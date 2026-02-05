
import React, { useState, useEffect } from 'react';
import { UserData, PrayerTimings, Page, PrayerStatus } from '../types.ts';
import { getNextPrayer } from '../services/prayerService.ts';

interface Props {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  prayerTimings: PrayerTimings | null;
  onNavigate: (page: Page) => void;
}

const PRAYERS_LIST = [
  { id: 'Fajr', name: 'الفجر' },
  { id: 'Dhuhr', name: 'الظهر' },
  { id: 'Asr', name: 'العصر' },
  { id: 'Maghrib', name: 'المغرب' },
  { id: 'Isha', name: 'العشاء' }
];

const Home: React.FC<Props> = ({ userData, setUserData, prayerTimings, onNavigate }) => {
  const [nextPrayer, setNextPrayer] = useState<any>(null);
  const isDark = userData.themeColor === 'dark';
  const today = new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    if (!prayerTimings) return;
    const interval = setInterval(() => setNextPrayer(getNextPrayer(prayerTimings)), 1000);
    return () => clearInterval(interval);
  }, [prayerTimings]);

  const getPrayerStatus = (prayerId: string): PrayerStatus => {
    return userData.prayerTable?.[today]?.[prayerId] || 'none';
  };

  const togglePrayerStatus = (prayerId: string) => {
    const current = getPrayerStatus(prayerId);
    const sequence: PrayerStatus[] = ['none', 'mosque', 'home', 'late', 'missed'];
    const nextIndex = (sequence.indexOf(current) + 1) % sequence.length;
    const nextStatus = sequence[nextIndex];

    if (navigator.vibrate) navigator.vibrate(35);

    setUserData(prev => ({
      ...prev,
      prayerTable: {
        ...prev.prayerTable,
        [today]: {
          ...(prev.prayerTable?.[today] || {}),
          [prayerId]: nextStatus
        }
      }
    }));
  };

  const renderStatusIcon = (status: PrayerStatus) => {
    const baseIconClass = "h-6 w-6";
    const primaryBg = isDark ? "bg-white text-black" : "bg-black text-[var(--gold)]";
    const missedBg = isDark ? "bg-white text-black" : "bg-black text-white";

    switch (status) {
      case 'mosque':
        return (
          <div className={`${primaryBg} p-3 rounded-full shadow-lg border-2 border-[var(--gold)]`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={baseIconClass} viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2L4.5 9V21H9.5V15H14.5V21H19.5V9L12 2Z" />
            </svg>
          </div>
        );
      case 'home':
        return (
          <div className="bg-[var(--gold)] text-black p-3 rounded-full shadow-lg border-2 border-black/20">
            <svg xmlns="http://www.w3.org/2000/svg" className={baseIconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'late':
        return (
          <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-black'} p-3 rounded-full shadow-lg border-2 border-[var(--gold)]`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={baseIconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'missed':
        return (
          <div className={`${missedBg} p-3 rounded-full shadow-lg border-2 border-white/20`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={baseIconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`p-3 rounded-full border-2 border-dashed transition-all ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5 opacity-40'}`}>
            <div className="w-6 h-6"></div>
          </div>
        );
    }
  };

  const getStatusText = (status: PrayerStatus) => {
    switch (status) {
      case 'mosque': return 'بالمسجد';
      case 'home': return 'بالوقت';
      case 'late': return 'صلاة قضاء';
      case 'missed': return 'فاتتني';
      default: return 'لم تُصلَّ';
    }
  };

  const getStatusColorClass = (status: PrayerStatus) => {
    if (isDark) return 'text-white/60 font-black';
    switch (status) {
      case 'mosque': return 'text-black font-black';
      case 'home': return 'text-black font-black';
      case 'late': return 'text-black/80 font-black';
      case 'missed': return 'text-black/60 font-black';
      default: return 'opacity-40';
    }
  };

  const getHijriDate = () => {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-uma', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  };

  return (
    <div className="space-y-6 animate-in">
      <div className={`rounded-[2.5rem] p-8 gold-card shadow-2xl border border-white/20`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black tracking-tight text-black">جدول الصلاة</h3>
          </div>
          <span className="text-[10px] font-black bg-black/10 text-black px-4 py-2 rounded-xl border border-black/10">
            {getHijriDate()}
          </span>
        </div>
        
        <div className="grid grid-cols-5 gap-3">
          {PRAYERS_LIST.map((prayer) => {
            const status = getPrayerStatus(prayer.id);
            return (
              <div key={prayer.id} className="flex flex-col items-center gap-3">
                <span className="text-[11px] font-black text-black/80">{prayer.name}</span>
                <button 
                  onClick={() => togglePrayerStatus(prayer.id)}
                  className="transition-all active:scale-90 hover:scale-105"
                >
                  {renderStatusIcon(status)}
                </button>
                <span className={`text-[9px] text-center h-8 flex items-center justify-center leading-tight ${getStatusColorClass(status)}`}>
                  {getStatusText(status)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`glass-panel rounded-[2.5rem] p-6 flex justify-between items-center border shadow-sm ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-black/5 text-black'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black opacity-40 uppercase">الصلاة القادمة</p>
            <h4 className="text-xl font-black">{nextPrayer?.name || '...'}</h4>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-[var(--gold)] tabular-nums">{nextPrayer?.countdown || '--:--'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onNavigate('minbar')} className={`glass-panel rounded-3xl p-8 flex flex-col items-center gap-3 border transition-all group ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 hover:border-[var(--gold)]'}`}>
          <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-white text-black' : 'bg-black text-[var(--gold)]'} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
             </svg>
          </div>
          <span className="font-black text-xs">المنبر الإسلامي</span>
        </button>
        <button onClick={() => onNavigate('recitations')} className={`glass-panel rounded-3xl p-8 flex flex-col items-center gap-3 border transition-all group ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 hover:border-[var(--gold)]'}`}>
          <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-white text-black' : 'bg-black text-[var(--gold)]'} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </div>
          <span className="font-black text-xs">تلاوات خاشعة</span>
        </button>
      </div>

      <div className={`p-6 glass-panel rounded-3xl border text-center transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">سبحان الله وبحمده .. سبحان الله العظيم</p>
      </div>
    </div>
  );
};

export default Home;
