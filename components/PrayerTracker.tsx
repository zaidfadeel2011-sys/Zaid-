
import React from 'react';
import { PrayerTimings } from '../types';

interface Props {
  prayerData: any; // الكائن الكامل من API
  onRefresh: () => void;
}

const PrayerTracker: React.FC<Props> = ({ prayerData, onRefresh }) => {
  const prayerTimings = prayerData?.timings || null;
  const meta = prayerData?.meta || null;

  const prayers = [
    { 
      id: 'fajr', 
      name: 'الفجر', 
      key: 'Fajr', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707.707m12.728 12.728L5 5" /></svg>
    },
    { 
      id: 'sunrise', 
      name: 'الشروق', 
      key: 'Sunrise', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5H11V1H13V5ZM4.87868 7.70711L3.46447 6.29289L6.29289 3.46447L7.70711 4.87868L4.87868 7.70711ZM1 13H5V11H1V13ZM19 13H23V11H19V13ZM17.7071 4.87868L19.1213 3.46447L16.2929 0.636039L14.8787 2.05025L17.7071 4.87868ZM12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7Z" /></svg>
    },
    { 
      id: 'dhuhr', 
      name: 'الظهر', 
      key: 'Dhuhr', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
    },
    { 
      id: 'asr', 
      name: 'العصر', 
      key: 'Asr', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
    },
    { 
      id: 'maghrib', 
      name: 'المغرب', 
      key: 'Maghrib', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12h2a10 10 0 00-20 0h2a8 8 0 1116 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.364-6.364l-2.828 2.828M8.464 15.536l-2.828 2.828m11.314 0l-2.828-2.828M8.464 8.464L5.636 5.636" /></svg>
    },
    { 
      id: 'isha', 
      name: 'العشاء', 
      key: 'Isha', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
    },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700 text-[var(--text-main)]">
      <div className="flex flex-col items-center text-center mb-8 gap-2">
        <h2 className="text-3xl font-black text-[var(--gold)]">مواقيت الصلاة</h2>
        <p className="opacity-40 text-[9px] font-bold uppercase tracking-widest mt-1">طريقة الحساب: {meta?.method?.name || 'تلقائي'}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {prayers.map((prayer) => {
          const prayerTime = prayerTimings ? prayerTimings[prayer.key as keyof PrayerTimings] : '--:--';

          return (
            <div key={prayer.id} className="glass-panel rounded-[2rem] p-6 border border-[var(--border-color)] flex items-center justify-between shadow-md transition-transform hover:scale-[1.02] active:bg-[var(--gold)]/5">
              <div className="flex items-center gap-4">
                <div className="text-[var(--gold)]">{prayer.icon}</div>
                <h3 className="text-xl font-black">{prayer.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[var(--gold)] font-mono">{prayerTime}</p>
                <p className="text-[10px] opacity-40 font-bold uppercase">حسب إحداثياتك</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 glass-panel rounded-[2rem] border border-[var(--gold)]/20 bg-[var(--gold)]/5 text-center mt-8">
         <p className="text-xs font-bold leading-relaxed opacity-60">"إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوقُوتًا"</p>
      </div>
    </div>
  );
};

export default PrayerTracker;
