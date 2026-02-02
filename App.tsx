
import React, { useState, useEffect, useCallback } from 'react';
import { Page, UserData, PrayerTimings, CustomRecitation } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import FatwaAssistant from './components/FatwaAssistant';
import PrayerTracker from './components/PrayerTracker';
import QuranReader, { SURAH_INDEX } from './components/QuranReader';
import Azkar from './components/Azkar';
import Settings from './components/Settings';
import Minbar from './components/Minbar';
import Recitations from './components/Recitations';
import VoiceAssistant from './components/VoiceAssistant';
import { calculateLocalPrayers } from './services/prayerService';

export const RECITATIONS_DATA: Record<string, CustomRecitation[]> = {
  nafees: [
    { id: 1, title: 'الفاتحة', url: 'https://youtu.be/hZwA9D2nDqM' },
    { id: 2, title: 'البقرة', url: 'https://youtu.be/9HW7j9lZZTU' },
    { id: 3, title: 'الكهف', url: 'https://youtu.be/-Rvavu8vyEw' },
    { id: 4, title: 'الدخان', url: 'https://youtu.be/0nKqbDR_ya0' },
    { id: 5, title: 'القيامة', url: 'https://youtu.be/WJ6OWeTTqtU' },
    { id: 6, title: 'الملك', url: 'https://youtu.be/Byyrubr7eqQ' }
  ],
  dosari: [
    { id: 7, title: 'الفاتحة', url: 'https://youtu.be/MePQ7B0dNek' },
    { id: 8, title: 'البقرة', url: 'https://youtu.be/P0uaLRO6V1U' },
    { id: 9, title: 'الكهف', url: 'https://youtu.be/GYqzkR_AnKE' },
    { id: 10, title: 'الدخان', url: 'https://youtu.be/zmarpXKqMno' },
    { id: 11, title: 'القيامة', url: 'https://youtu.be/Tj6M-QrsYWQ' },
    { id: 12, title: 'الملك', url: 'https://youtu.be/Xg3dnwXfsBc' }
  ],
  afasy: [
    { id: 13, title: 'الفاتحة', url: 'https://youtu.be/pUb9EW770d0' },
    { id: 14, title: 'البقرة', url: 'https://youtu.be/Y1M6hJHHrjM' },
    { id: 15, title: 'الكهف', url: 'https://youtu.be/fLHVCOLU_WI' },
    { id: 16, title: 'الدخان', url: 'https://youtu.be/ZB2Vaea3U6c' },
    { id: 17, title: 'القيامة', url: 'https://youtu.be/PUec_OAAsuw' },
    { id: 18, title: 'الملك', url: 'https://youtu.be/IDvV7Tvt8gM' }
  ]
};

export const SERMONS_DATA: CustomRecitation[] = [
  { id: 101, title: "التوبة النصوحة - الشيخ أحمد النفيس", url: "https://youtu.be/TTlnoFztl6E" },
  { id: 102, title: "كيف يغير القرآن نفوسنا - الشيخ أحمد النفيس", url: "https://youtu.be/AH7kbk9Smdk" },
  { id: 103, title: "صفة النار - الشيخ أحمد النفيس", url: "https://youtu.be/BV8JxZJZdIc" },
  { id: 104, title: "كيف كانت صلاتهم - الشيخ أحمد النفيس", url: "https://youtu.be/Ceti5Xc_oI0" },
  { id: 105, title: "متى نصر الله - الشيخ أحمد النفيس", url: "https://youtu.be/m-g98Rae79c" },
  { id: 106, title: "وقال ربكم ادعوني استجب لكم - الشيخ ياسر الدوسري", url: "https://youtu.be/FpIE8dmOSbU" },
  { id: 107, title: "مكارم الأخلاق - الشيخ ياسر الدوسري", url: "https://youtu.be/rjxrG2qVhYE" }
];

const STORAGE_KEY = 'zikr_user_data_v2';

const initialUserData: UserData = {
  username: "عبد الله",
  themeColor: 'white',
  prayerTable: {},
  customSurahsBySheikh: {},
  customSermons: [],
  azkarReminders: {},
  prayerReminders: {},
  fatwaHistory: [{
    role: 'assistant',
    content: 'أهلاً بك في مساعد Zikr الذكي. أنا هنا للإجابة على تساؤلاتك الفقهية والشرعية بكل إيجاز وموثوقية.'
  }],
  lastOpenedPage: 1,
  favorites: { surahIds: [], sheikhIds: [] },
  khatmah: {
    currentPage: 1,
    pagesPerDay: 5,
    lastReadDate: new Date().toDateString(),
    isCompletedToday: false,
    totalReadPages: 0
  }
};

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [prayerData, setPrayerData] = useState<any>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [pendingAction, setPendingAction] = useState<CustomRecitation | null>(null);
  const [azkarCat, setAzkarCat] = useState<string | null>(null);
  const [voiceDirCommand, setVoiceDirCommand] = useState<'next' | 'prev' | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastCoords, setLastCoords] = useState<{lat: number, lon: number} | null>(null);
  
  const [quranNav, setQuranNav] = useState<{
    page: number | null, 
    ayah: number | null, 
    range: { from: number, to: number } | null
  }>({ page: null, ayah: null, range: null });

  const isDark = userData.themeColor === 'dark';

  const updatePrayersManually = useCallback((lat: number, lon: number) => {
    const data = calculateLocalPrayers(lat, lon);
    setPrayerData(data);
  }, []);

  const updateLocationAndPrayers = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => { 
        setLastCoords({lat: pos.coords.latitude, lon: pos.coords.longitude});
        updatePrayersManually(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => { 
        console.warn("Location access denied, using default Riyadh", err);
        const lat = 24.7136, lon = 46.6753;
        setLastCoords({lat, lon});
        updatePrayersManually(lat, lon);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [updatePrayersManually]);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (!parsed.fatwaHistory) parsed.fatwaHistory = initialUserData.fatwaHistory;
        if (parsed.lastOpenedPage === undefined) parsed.lastOpenedPage = initialUserData.lastOpenedPage;
        setUserData(parsed);
      } catch (e) {
        console.error("Failed to load user data", e);
      }
    }
    setIsLoaded(true);
    updateLocationAndPrayers();
  }, [updateLocationAndPrayers]);

  useEffect(() => {
    if (isLoaded && lastCoords) {
      updatePrayersManually(lastCoords.lat, lastCoords.lon);
    }
  }, [isLoaded, lastCoords, updatePrayersManually]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
  }, [userData, isLoaded]);

  const normalizeText = (text: string) => {
    if (!text) return "";
    return text.replace(/^سورة\s+/, "").replace(/^(ال)/, "").trim();
  };

  const handleVoiceCommand = async (name: string, args: any) => {
    if (name === 'control_app') {
      const { action, target, theme, page_number, surah_name, ayah_number, azkar_category } = args;
      
      if (action === 'navigate') {
        if (target) setPage(target as Page);
        
        if (target === 'quran') {
          let targetPage = page_number;
          if (surah_name && !targetPage) {
            const cleanName = normalizeText(surah_name);
            const surah = SURAH_INDEX.find(s => normalizeText(s.name).includes(cleanName));
            if (surah) targetPage = surah.start;
          }
          setQuranNav({ page: targetPage || null, ayah: ayah_number || null, range: null });
        }
        
        if (target === 'azkar' && azkar_category) {
          const catMap: Record<string, string> = {
            'الصباح': 'morning', 'morning': 'morning',
            'المساء': 'evening', 'evening': 'evening',
            'بعد الصلاة': 'after_prayer', 'after_prayer': 'after_prayer',
            'النوم': 'sleep', 'sleep': 'sleep'
          };
          setAzkarCat(catMap[azkar_category] || azkar_category);
        }
      } else if (action === 'change_theme' && theme) {
        setUserData(prev => ({ ...prev, themeColor: theme as any }));
      } else if (action === 'next_item') {
        setVoiceDirCommand('next');
      } else if (action === 'prev_item') {
        setVoiceDirCommand('prev');
      }
    }
  };

  if (!isLoaded) return null;

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-32 pt-24 px-6 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-black'}`}>
      <Header userData={userData} onSettings={() => setPage('settings')} isVoiceActive={isVoiceActive} setIsVoiceActive={setIsVoiceActive} />
      
      <main className="max-w-2xl mx-auto">
        {page === 'home' && (
          <Home 
            userData={userData} 
            setUserData={setUserData} 
            prayerTimings={prayerData?.timings || null} 
            onNavigate={setPage} 
            onWirdClick={(p) => { setPage('quran'); setQuranNav({page: p, ayah: null, range: null}); }} 
          />
        )}
        {page === 'quran' && <QuranReader userData={userData} setUserData={setUserData} initialPage={quranNav.page} targetAyah={quranNav.ayah} initialRange={quranNav.range} command={voiceDirCommand} onCommandProcessed={() => setVoiceDirCommand(null)} />}
        {page === 'prayer' && <PrayerTracker prayerData={prayerData} onRefresh={updateLocationAndPrayers} />}
        {page === 'fatwa' && <FatwaAssistant userData={userData} setUserData={setUserData} />}
        {page === 'azkar' && <Azkar initialCategory={azkarCat} command={voiceDirCommand} onCommandProcessed={() => { setAzkarCat(null); setVoiceDirCommand(null); }} isDark={isDark} />}
        {page === 'settings' && <Settings userData={userData} setUserData={setUserData} onNavigate={setPage} />}
        {page === 'minbar' && <Minbar userData={userData} setUserData={setUserData} />}
        {page === 'recitations' && <Recitations userData={userData} setUserData={setUserData} />}
      </main>
      <VoiceAssistant isActive={isVoiceActive} setIsActive={setIsVoiceActive} onCommand={handleVoiceCommand} />
      <BottomNav currentPage={page} onNavigate={setPage} />
    </div>
  );
};

export default App;
