
import React, { useState, useRef, useEffect } from 'react';
import { askFatwa } from '../services/geminiService.ts';
import { Message, UserData } from '../types.ts';

interface Props {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const FatwaAssistant: React.FC<Props> = ({ userData, setUserData }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDark = userData.themeColor === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [userData.fatwaHistory]);

  const handleSend = async (text?: string) => {
    const messageContent = text || input.trim();
    if (!messageContent || isLoading) return;

    const newUserMessage: Message = { role: 'user', content: messageContent };
    const updatedMessages = [...userData.fatwaHistory, newUserMessage];
    
    setInput('');
    setUserData(prev => ({ ...prev, fatwaHistory: updatedMessages }));
    setIsLoading(true);

    try {
      const response = await askFatwa(updatedMessages);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setUserData(prev => ({ 
        ...prev, 
        fatwaHistory: [...prev.fatwaHistory, assistantMessage] 
      }));
    } catch (error) {
      console.error("Fatwa Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-14rem)] glass-panel rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-700 border border-[var(--gold)]/30 shadow-2xl ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      <div className={`px-6 py-5 ${isDark ? 'bg-white text-black' : 'bg-black'} border-b border-[var(--gold)]/30 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-black text-[var(--gold)]' : 'bg-[var(--gold)] text-black'} flex items-center justify-center text-xs font-black uppercase`}>AI</div>
          </div>
          <div>
            <h3 className={`text-sm font-black ${isDark ? 'text-black' : 'text-[var(--gold)]'}`}>Zikr AI Assistant</h3>
            <p className={`text-[9px] opacity-60 uppercase tracking-widest font-black ${isDark ? 'text-black' : 'text-white'}`}>مساعدك الذكي</p>
          </div>
        </div>
        <button 
          onClick={() => {
            if(confirm("هل تريد مسح تاريخ المحادثة والبدء من جديد؟")) {
              setUserData(prev => ({ 
                ...prev, 
                fatwaHistory: [{ role: 'assistant', content: 'أهلاً بك مجدداً. كيف يمكنني مساعدتك في مسألة شرعية جديدة؟' }] 
              }));
            }
          }}
          className={`${isDark ? 'text-black' : 'text-[var(--gold)]'} hover:opacity-70 transition-colors p-2`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]'}`}>
        {userData.fatwaHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} items-end gap-2`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed transition-all shadow-md ${
              msg.role === 'user'
                ? 'bg-[var(--gold)] text-black font-black rounded-tr-none'
                : `${isDark ? 'bg-white text-black border-2 border-[var(--gold)]/20' : 'bg-black text-[var(--gold)]'} rounded-tl-none`
            }`}>
              <div className="whitespace-pre-wrap quran-font">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end p-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={`p-6 ${isDark ? 'bg-white/10' : 'bg-black'} border-t border-[var(--gold)]/30`}>
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل سؤالك هنا..."
            className={`w-full ${isDark ? 'bg-black text-white' : 'bg-white text-black'} border-2 border-[var(--gold)]/30 rounded-2xl pl-16 pr-6 py-5 text-sm focus:outline-none focus:border-[var(--gold)] transition-all shadow-inner font-black`}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className={`absolute left-2 w-12 h-12 ${isDark ? 'bg-white text-black' : 'bg-[var(--gold)] text-black'} rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-lg disabled:opacity-50`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FatwaAssistant;
