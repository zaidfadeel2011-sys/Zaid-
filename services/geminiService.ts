
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types.ts";

export const askFatwa = async (history: Message[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `أنت مساعد إسلامي متخصص وموثوق في الفتاوى الشرعية. 
        قواعد الإجابة:
        1. الإجابة يجب أن تكون دقيقة ومختصرة (3-5 جمل).
        2. يجب ذكر مصدر شرعي واحد على الأقل لكل فتوى (آية قرآنية، حديث شريف، أو مذهب فقهي معتبر).
        3. استخدم لغة وقورة وواضحة.
        4. إذا كانت المسألة خلافية، اذكر القول الراجح باختصار.
        5. تذكر سياق الأسئلة السابقة في المحادثة لتكون الإجابات متصلة ومنطقية.
        6. أنهِ الإجابة دائماً بذكر المصدر بشكل صريح تحت عنوان "المصدر:".
        7. تذييل الإجابة بـ: (والله أعلم - إجابة استرشادية لتعزيز الوعي).`,
        temperature: 0.4,
        topP: 0.8,
      },
    });

    return response.text || "عذراً، لم أتمكن من العثور على إجابة حالياً.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "حدث خطأ أثناء معالجة سؤالك. يرجى التأكد من الاتصال بالإنترنت والمحاولة لاحقاً.";
  }
};
