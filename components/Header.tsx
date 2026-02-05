
import React from 'react';
import { UserData } from '../types';

interface Props {
  userData: UserData;
  onSettings: () => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (val: boolean) => void;
}

const Header: React.FC<Props> = ({ userData, onSettings, isVoiceActive, setIsVoiceActive }) => {
  const isDark = userData.themeColor === 'dark';
  return (
    <header className="fixed top-0 left-0 right-0 h-24 z-50 px-6 flex items-center justify-between bg-[var(--bg-base)]/60 backdrop-blur-md border-b border-[var(--border-color)]">
      {/* Settings on the Right */}
      <button 
        onClick={onSettings}
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${
          isDark 
            ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' 
            : 'bg-black/5 text-black border-black/10 hover:bg-[var(--gold)]/20'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      
      <h1 className="text-4xl zikr-logo-font text-[var(--gold)]">ZIKR</h1>

      {/* Instant Voice Assistant on the Left */}
      <button 
        onClick={() => setIsVoiceActive(!isVoiceActive)}
        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border transition-all duration-300 ${
          isVoiceActive 
            ? 'bg-red-500 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' 
            : 'bg-[var(--gold)] text-black border-black/10'
        }`}
      >
        {isVoiceActive ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
    </header>
  );
};

export default Header;
