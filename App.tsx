
import React, { useState, useEffect, useCallback } from 'react';
import { Page, UserData, PrayerTimings, CustomRecitation } from './types.ts';
import Header from './components/Header.tsx';
import BottomNav from './components/BottomNav.tsx';
import Home from './components/Home.tsx';
import FatwaAssistant from './components/FatwaAssistant.tsx';
import PrayerTracker from './components/PrayerTracker.tsx';
import QuranReader, { SURAH_INDEX } from './components/QuranReader.tsx';
import Azkar from './components/Azkar.tsx';
import Settings from './components/Settings.tsx';
import Minbar from './components/Minbar.tsx';
import Recitations from './components/Recitations.tsx';
import VoiceAssistant from './components/VoiceAssistant.tsx';
import { calculateLocalPrayers } from './services/prayerService.ts';

// مكتبة التلاوات الخاشعة
export const RECITATIONS_DATA: Record<string, CustomRecitation[]> = {
  nafees: [
    { id: 1, title: 'سورة الفاتحة', url: 'https://youtu.be/hZwA9D2nDqM' },
    { id: 2, title: 'سورة البقرة', url: 'https://youtu.be/9HW7j9lZZTU' },
    { id: 3, title: 'سورة الكهف', url: 'https://youtu.be/-Rvavu8vyEw' },
    { id: 4, title: 'سورة الدخان', url: 'https://youtu.be/0nKqbDR_ya0' },
    { id: 5, title: 'سورة القيامة', url: 'https://youtu.be/WJ6OWeTTqtU' },
    { id: 6, title: 'سورة الملك', url: 'https://youtu.be/Byyrubr7eqQ' }
  ],
  dosari: [
    { id: 7, title: 'سورة الفاتحة', url: 'https://youtu.be/MePQ7B0dNek' },
    { id: 8, title: 'سورة البقرة', url: 'https://youtu.be/P0uaLRO6V1U' },
    { id: 9, title: 'سورة الكهف', url: 'https://youtu.be/GYqzkR_AnKE' },
    { id: 10, title: 'سورة الدخان', url: 'https://youtu.be/zmarpXKqMno' },
    { id: 11, title: 'سورة القيامة', url: 'https://youtu.be/Tj6M-QrsYWQ' },
    { id: 12, title: 'سورة الملك', url: 'https://youtu.be/Xg3dnwXfsBc' }
  ],
  afasy: [
    { id: 13, title: 'سورة الفاتحة', url: 'https://youtu.be/pUb9EW770d0' },
    { id: 14, title: 'سورة البقرة', url: 'https://youtu.be/Y1M6hJHHrjM' },
    { id: 15, title: 'سورة الكهف', url: 'https://youtu.be/fLHVCOLU_WI' },
    { id: 16, title: 'سورة الدخان', url: 'https://youtu.be/ZB2Vaea3U6c' },
    { id: 17, title: 'سورة القيامة', url: 'https://youtu.be/PUec_OAAsuw' },
    { id: 18, title: 'سورة الملك', url: 'https://youtu.be/IDvV7Tvt8gM' }
  ],
  yamani: [
    { id: 19, title: 'سورة الفاتحة', url: 'https://youtu.be/qWzAyszODe4' },
    { id: 20, title: 'سورة البقرة', url: 'https://youtu.be/oV8ZuycmnSA' },
    { id: 21, title: 'سورة الكهف', url: 'https://youtu.be/lQYNKmL0noU' },
    { id: 22, title: 'سورة الدخان', url: 'https://youtu.be/EM0pLYUvdbA' },
    { id: 23, title: 'سورة القيامة', url: 'https://youtu.be/i1_Gbsu9IH8' },
    { id: 24, title: 'سورة الملك', url: 'https://youtu.be/ZhRXf6nSbpw' }
  ],
  sudais: [
    { id: 25, title: 'سورة الفاتحة', url: 'https://youtu.be/m3EBoMovUg8' },
    { id: 26, title: 'سورة البقرة', url: 'https://youtu.be/MspLXPfFzjg' },
    { id: 27, title: 'سورة الكهف', url: 'https://youtu.be/xB4JmhhouFQ' },
    { id: 28, title: 'سورة الدخان', url: 'https://youtu.be/Ww-L6S4cESM' },
    { id: 29, title: 'سورة القيامة', url: 'https://youtu.be/PyzTyTv85-M' },
    { id: 30, title: 'سورة الملك', url: 'https://youtu.be/NYti96AJOFc' }
  ]
};

export const SERMONS_DATA: CustomRecitation[] = [
  { id: 1, title: 'التوبة النصوحة', url: 'https://youtu.be/TTlnoFztl6E' },
  { id: 2, title: 'كيف يغير القرآن نفوسنا', url: 'https://youtu.be/AH7kbk9Smdk' },
  { id: 3, title: 'صفة النار', url: 'https://youtu.be/BV8JxZJZdIc' },
  { id: 4, title: 'كيف كانت صلاتهم', url: 'https://youtu.be/Ceti5Xc_oI0' },
  { id: 5, title: 'متى نصر الله', url: 'https://youtu.be/m-g98Rae79c' },
  { id: 6, title: 'وقال ربكم ادعوني استجب لكم', url: 'https://youtu.be/FpIE8dmOSbU' },
  { id: 7, title: 'مكارم الأخلاق', url: 'https://youtu.be/rjxrG2qVhYE' },
  { id: 8, title: 'فضل متابعة النبي ﷺ', url: 'https://youtu.be/YJ3_i3K8xYo' },
  { id: 9, title: 'فضل الصلاة وأسرارها', url: 'https://youtu.be/4nbTOGAt1Aw' },
  { id: 10, title: 'ظلم العباد', url: 'https://youtu.be/ZFxasHPL2Co' }
];

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('zikr_user_data');
    if (saved) return JSON.parse(saved);
    return {
      username: 'المسلم',
      themeColor: 'white',
      fatwaHistory: [{ role: 'assistant', content: 'أهلاً بك. أنا مساعدك الشرعي الذكي، كيف يمكنني مساعدتك اليوم؟' }],
      lastOpenedPage: 1,
      prayerTable: {},
      customSurahsBySheikh: {},
      customSermons: [],
      azkarReminders: {},
      prayerReminders: {},
      favorites: []
    };
  });

  const [prayerTimings, setPrayerTimings] = useState<PrayerTimings | null>(null);
  const [prayerMeta, setPrayerMeta] = useState<any>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState<{ action: string; args?: any } | null>(null);

  const updatePrayers = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const data = calculateLocalPrayers(pos.coords.latitude, pos.coords.longitude);
        setPrayerTimings(data.timings);
        setPrayerMeta(data.meta);
      },
      () => {
        const data = calculateLocalPrayers(24.7136, 46.6753);
        setPrayerTimings(data.timings);
        setPrayerMeta(data.meta);
      }
    );
  }, []);

  useEffect(() => {
    localStorage.setItem('zikr_user_data', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    updatePrayers();
  }, [updatePrayers]);

  const handleVoiceCommand = useCallback((name: string, args?: any) => {
    if (name === 'control_app') {
      const { action, target, surah_name, azkar_category } = args;
      if (action === 'navigate' && target) {
        setPage(target);
        if (target === 'quran' && surah_name) {
          const surah = SURAH_INDEX.find(s => s.name.includes(surah_name));
          if (surah) setVoiceCommand({ action: 'open_surah', args: { page: surah.start } });
        }
        if (target === 'azkar' && azkar_category) {
          setVoiceCommand({ action: 'open_azkar', args: { category: azkar_category } });
        }
      } else if (action === 'next_item' || action === 'prev_item') {
        setVoiceCommand({ action, args });
      }
    }
  }, []);

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-500 ${userData.themeColor === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#fafafa] text-black'}`}>
      <Header 
        userData={userData} 
        onSettings={() => setPage('settings')} 
        isVoiceActive={isVoiceActive}
        setIsVoiceActive={setIsVoiceActive}
      />
      
      <main className="pt-28 px-6 max-w-2xl mx-auto">
        {page === 'home' && <Home userData={userData} setUserData={setUserData} prayerTimings={prayerTimings} onNavigate={setPage} />}
        {page === 'fatwa' && <FatwaAssistant userData={userData} setUserData={setUserData} />}
        {page === 'prayer' && <PrayerTracker prayerData={{ timings: prayerTimings, meta: prayerMeta }} onRefresh={updatePrayers} />}
        {page === 'quran' && <QuranReader userData={userData} setUserData={setUserData} initialPage={voiceCommand?.action === 'open_surah' ? voiceCommand.args.page : null} command={voiceCommand?.action === 'next_item' ? 'next' : voiceCommand?.action === 'prev_item' ? 'prev' : null} onCommandProcessed={() => setVoiceCommand(null)} />}
        {page === 'azkar' && <Azkar isDark={userData.themeColor === 'dark'} initialCategory={voiceCommand?.action === 'open_azkar' ? voiceCommand.args.category : null} command={voiceCommand?.action === 'next_item' ? 'next' : voiceCommand?.action === 'prev_item' ? 'prev' : null} onCommandProcessed={() => setVoiceCommand(null)} />}
        {page === 'settings' && <Settings userData={userData} setUserData={setUserData} onNavigate={setPage} />}
        {page === 'minbar' && <Minbar userData={userData} setUserData={setUserData} />}
        {page === 'recitations' && <Recitations userData={userData} setUserData={setUserData} />}
      </main>

      <BottomNav currentPage={page} onNavigate={setPage} userData={userData} />
      
      <VoiceAssistant 
        isActive={isVoiceActive} 
        setIsActive={setIsVoiceActive} 
        onCommand={handleVoiceCommand} 
      />
    </div>
  );
};

export default App;
