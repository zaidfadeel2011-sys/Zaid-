
import React from 'react';
import { Page, UserData } from '../types';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userData: UserData;
}

const BottomNav: React.FC<Props> = ({ currentPage, onNavigate, userData }) => {
  const isDark = userData.themeColor === 'dark';
  
  const items: { id: Page; icon: React.ReactNode; label: string }[] = [
    { 
      id: 'home', 
      label: 'الرئيسية',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    { 
      id: 'quran', 
      label: 'المصحف',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    },
    { 
      id: 'prayer', 
      label: 'الصلاة',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    },
    { 
      id: 'fatwa', 
      label: 'الفتوى',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    },
    { 
      id: 'azkar', 
      label: 'الأذكار',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    },
  ];

  const navClass = isDark 
    ? "bg-white border-black/10 shadow-[0_-10px_40px_rgba(255,255,255,0.1)]" 
    : "bg-black/90 border-[var(--gold)]/30 shadow-2xl";

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <nav className={`glass-panel rounded-[2rem] px-2 py-3 flex items-center justify-around border transition-colors duration-500 ${navClass}`}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-12 rounded-2xl transition-all duration-300 ${
              currentPage === item.id 
                ? 'bg-[var(--primary)] text-black active-tab-glow scale-110' 
                : isDark ? 'text-black/60 hover:text-black' : 'text-white hover:text-[var(--primary)]'
            }`}
          >
            <div className="mb-1">{item.icon}</div>
            {currentPage === item.id && <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
