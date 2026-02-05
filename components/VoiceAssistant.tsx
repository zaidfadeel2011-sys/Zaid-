
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, Type, FunctionDeclaration, LiveServerMessage, Blob } from '@google/genai';

interface VoiceAssistantProps {
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  onCommand?: (name: string, args?: any) => void;
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export default function VoiceAssistant({ isActive, setIsActive, onCommand }: VoiceAssistantProps) {
  const sessionRef = useRef<any>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const micStreamRef = useRef<MediaStream | null>(null);
  const isConnectingRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      setErrorMessage(null);
      startSession();
    } else {
      stopSession();
    }
    return () => stopSession();
  }, [isActive]);

  const controlAppFunction: FunctionDeclaration = {
    name: 'control_app',
    parameters: {
      type: Type.OBJECT,
      description: 'التحكم الكامل في تطبيق Zikr. يتضمن التنقل، فتح السور، تشغيل الأذكار، والمزيد.',
      properties: {
        action: {
          type: Type.STRING,
          description: 'الإجراء: navigate (تنقل/فتح محتوى), change_theme (تغيير ثيم), next_item (التالي/الآية التالية/الذكر التالي), prev_item (السابق).',
        },
        target: {
          type: Type.STRING,
          description: 'الصفحة الهدف: home, fatwa, prayer, quran, azkar, settings, minbar, recitations.',
        },
        surah_name: {
          type: Type.STRING,
          description: 'اسم السورة المطلوب فتحها (مثلاً: البقرة، الكهف، يس). استخدم هذا عند طلب المستخدم سورة معينة.',
        },
        azkar_category: {
          type: Type.STRING,
          description: 'نوع الأذكار: morning (الصباح), evening (المساء), after_prayer (بعد الصلاة), sleep (النوم). استخدم هذا عند طلب الأذكار.',
        },
        page_number: {
          type: Type.NUMBER,
          description: 'رقم الصفحة في القرآن الكريم.',
        },
        ayah_number: {
          type: Type.NUMBER,
          description: 'رقم الآية.',
        },
        theme: {
          type: Type.STRING,
          description: 'لون المظهر: dark, white.',
        }
      },
      required: ['action'],
    },
  };

  const startSession = async () => {
    if (isConnectingRef.current) return;
    isConnectingRef.current = true;

    try {
      stopSession();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      nextStartTimeRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            isConnectingRef.current = false;
            retryCountRef.current = 0;
            if (!inputAudioContextRef.current || !micStreamRef.current) return;
            const source = inputAudioContextRef.current.createMediaStreamSource(micStreamRef.current);
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob: Blob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => { 
                if (s) s.sendRealtimeInput({ media: pcmBlob }); 
              }).catch(() => {});
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current) {
                try { source.stop(); } catch(e) {}
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (onCommand) await onCommand(fc.name, fc.args);
                sessionPromise.then(s => s.sendToolResponse({
                  functionResponses: { id: fc.id, name: fc.name, response: { result: "ok" } }
                }));
              }
            }
            
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              if (ctx.state === 'suspended') await ctx.resume();
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
          },
          onclose: () => { 
            isConnectingRef.current = false; 
            if (isActive) setIsActive(false); 
          },
          onerror: (e) => {
            console.error("Gemini Session Error:", e);
            isConnectingRef.current = false;
            setErrorMessage("حدث خطأ تقني. سنحاول استعادة الاتصال.");
            if (retryCountRef.current < 2 && isActive) {
              retryCountRef.current++;
              setTimeout(() => startSession(), 2000);
            } else {
              setIsActive(false);
            }
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: [controlAppFunction] }],
          speechConfig: { 
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } 
          },
          systemInstruction: `أنت المساعد الذكي لتطبيق "Zikr". وظيفتك تنفيذ الأوامر الصوتية بدقة متناهية وفورية.
          قواعد التنفيذ الصارمة:
          1. إذا طلب المستخدم سورة (مثلاً: "افتح سورة البقرة" أو "شغل الكهف") -> استدعِ control_app بـ action='navigate', target='quran', surah_name='[اسم السورة]'.
          2. إذا طلب المستخدم الأذكار (مثلاً: "أريد أذكار الصباح") -> استدعِ control_app بـ action='navigate', target='azkar', azkar_category='morning'.
          3. إذا طلب المستخدم التنقل بين الأقسام (مثلاً: "اذهب للرئيسية"، "افتح الفتوى") -> استدعِ control_app بـ action='navigate', target='[home/fatwa/prayer/quran/azkar/settings/minbar/recitations]'.
          4. للتحكم داخل القارئ أو الأذكار (مثلاً: "التالي"، "اقلب الصفحة"، "الذكر التالي") -> استدعِ control_app بـ action='next_item'.
          5. للرجوع للخلف (مثلاً: "السابق") -> استدعِ control_app بـ action='prev_item'.
          
          أجب بصوت وقور وهادئ، ونفذ الأوامر فوراً دون تأخير. تذكر أنك تخدم مستخدماً في رحلته الروحانية.`,
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Start Session Failed:", err);
      isConnectingRef.current = false;
      setErrorMessage("تعذر تفعيل المساعد الصوتي.");
      setIsActive(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) { try { sessionRef.current.close(); } catch(e) {} sessionRef.current = null; }
    if (micStreamRef.current) { micStreamRef.current.getTracks().forEach(t => t.stop()); micStreamRef.current = null; }
    if (inputAudioContextRef.current) { inputAudioContextRef.current.close().catch(() => {}); inputAudioContextRef.current = null; }
    if (outputAudioContextRef.current) { outputAudioContextRef.current.close().catch(() => {}); outputAudioContextRef.current = null; }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    isConnectingRef.current = false;
  };

  if (!errorMessage) return null;

  return (
    <div className="fixed top-28 left-6 right-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-red-400/50">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs font-black">{errorMessage}</p>
        </div>
        <button onClick={() => setErrorMessage(null)} className="bg-white/20 p-2 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
