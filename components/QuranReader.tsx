
import React, { useState, useEffect, useRef } from 'react';
import { UserData } from '../types';

export const SURAH_INDEX = [
  {id: 1, name: "الفاتحة", start: 1}, {id: 2, name: "البقرة", start: 2}, {id: 3, name: "آل عمران", start: 50},
  {id: 4, name: "النساء", start: 77}, {id: 5, name: "المائدة", start: 106}, {id: 6, name: "الأنعام", start: 128},
  {id: 7, name: "الأعراف", start: 151}, {id: 8, name: "الأنفال", start: 177}, {id: 9, name: "التوبة", start: 187},
  {id: 10, name: "يونس", start: 208}, {id: 11, name: "هود", start: 221}, {id: 12, name: "يوسف", start: 235},
  {id: 13, name: "الرعد", start: 249}, {id: 14, name: "إبراهيم", start: 255}, {id: 15, name: "الحجر", start: 262},
  {id: 16, name: "النحل", start: 267}, {id: 17, name: "الإسراء", start: 282}, {id: 18, name: "الكهف", start: 293},
  {id: 19, name: "مريم", start: 305}, {id: 20, name: "طه", start: 312}, {id: 21, name: "الأنبياء", start: 322},
  {id: 22, name: "الحج", start: 332}, {id: 23, name: "المؤمنون", start: 342}, {id: 24, name: "النور", start: 350},
  {id: 25, name: "الفرقان", start: 359}, {id: 26, name: "الشعراء", start: 367}, {id: 27, name: "النمل", start: 377},
  {id: 28, name: "القصص", start: 385}, {id: 29, name: "العنكبوت", start: 396}, {id: 30, name: "الروم", start: 404},
  {id: 31, name: "لقمان", start: 411}, {id: 32, name: "السجدة", start: 415}, {id: 33, name: "الأحزاب", start: 418},
  {id: 34, name: "سبأ", start: 428}, {id: 35, name: "فاطر", start: 434}, {id: 36, name: "يس", start: 440},
  {id: 37, name: "الصافات", start: 446}, {id: 38, name: "ص", start: 453}, {id: 39, name: "الزمر", start: 458},
  {id: 40, name: "غافر", start: 467}, {id: 41, name: "فصلت", start: 477}, {id: 42, name: "الشورى", start: 483},
  {id: 43, name: "الزخرف", start: 489}, {id: 44, name: "الدخان", start: 496}, {id: 45, name: "الجاثية", start: 499},
  {id: 46, name: "الأحقاف", start: 502}, {id: 47, name: "محمد", start: 507}, {id: 48, name: "الفتح", start: 511},
  {id: 49, name: "الحجرات", start: 515}, {id: 50, name: "ق", start: 518}, {id: 51, name: "الذاريات", start: 520},
  {id: 52, name: "الطور", start: 523}, {id: 53, name: "النجم", start: 526}, {id: 54, name: "القمر", start: 528},
  {id: 55, name: "الرحمن", start: 531}, {id: 56, name: "الواقعة", start: 534}, {id: 57, name: "الحديد", start: 537},
  {id: 58, name: "المجادلة", start: 542}, {id: 59, name: "الحشر", start: 545}, {id: 60, name: "الممتحنة", start: 549},
  {id: 61, name: "الصف", start: 551}, {id: 62, name: "الجمعة", start: 553}, {id: 63, name: "المنافقون", start: 554},
  {id: 64, name: "التغابن", start: 556}, {id: 65, name: "الطلاق", start: 558}, {id: 66, name: "التحريم", start: 560},
  {id: 67, name: "الملك", start: 562}, {id: 68, name: "القلم", start: 564}, {id: 69, name: "الحاقة", start: 566},
  {id: 70, name: "المعارج", start: 568}, {id: 71, name: "نوح", start: 570}, {id: 72, name: "الجن", start: 572},
  {id: 73, name: "المزمل", start: 574}, {id: 74, name: "المدثر", start: 575}, {id: 75, name: "القيامة", start: 577},
  {id: 76, name: "الإنسان", start: 578}, {id: 77, name: "المرسلات", start: 580}, {id: 78, name: "النبأ", start: 582},
  {id: 79, name: "النازعات", start: 583}, {id: 80, name: "عبس", start: 585}, {id: 81, name: "التكوير", start: 586},
  {id: 82, name: "الانفطار", start: 587}, {id: 83, name: "المطففين", start: 587}, {id: 84, name: "الانشقاق", start: 589},
  {id: 85, name: "البروج", start: 590}, {id: 86, name: "الطارق", start: 591}, {id: 87, name: "الأعلى", start: 591},
  {id: 88, name: "الغاشية", start: 592}, {id: 89, name: "الفجر", start: 593}, {id: 90, name: "البلد", start: 594},
  {id: 91, name: "الشمس", start: 595}, {id: 92, name: "الليل", start: 595}, {id: 93, name: "الضحى", start: 596},
  {id: 94, name: "الشرح", start: 596}, {id: 95, name: "التين", start: 597}, {id: 96, name: "العلق", start: 597},
  {id: 97, name: "القدر", start: 598}, {id: 98, name: "البينة", start: 598}, {id: 99, name: "الزلزلة", start: 599},
  {id: 100, name: "العاديات", start: 599}, {id: 101, name: "القارعة", start: 600}, {id: 102, name: "التكاثر", start: 600},
  {id: 103, name: "العصر", start: 601}, {id: 104, name: "الهمزة", start: 601}, {id: 105, name: "الفيل", start: 601},
  {id: 106, name: "قريش", start: 602}, {id: 107, name: "الماعون", start: 602}, {id: 108, name: "الكوثر", start: 602},
  {id: 109, name: "الكافرون", start: 603}, {id: 110, name: "النصر", start: 603}, {id: 111, name: "المسد", start: 603},
  {id: 112, name: "الإخلاص", start: 604}, {id: 113, name: "الفلق", start: 604}, {id: 114, name: "الناس", start: 604}
];

interface Props {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  initialPage?: number | null;
  targetAyah?: number | null;
  command?: 'next' | 'prev' | null;
  onCommandProcessed?: () => void;
}

const QuranReader: React.FC<Props> = ({ userData, setUserData, initialPage, command, onCommandProcessed }) => {
  const [view, setView] = useState<'index' | 'reader'>(initialPage ? 'reader' : 'index');
  const [currentPage, setCurrentPage] = useState(initialPage || userData.lastOpenedPage || 1);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isDark = userData.themeColor === 'dark';

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // استجابة لتغيير الصفحة من الأوامر الخارجية (الصوتية)
  useEffect(() => {
    if (initialPage) {
      setCurrentPage(initialPage);
      setView('reader');
    }
  }, [initialPage]);

  useEffect(() => {
    if (currentPage !== userData.lastOpenedPage) {
      setUserData(prev => ({ ...prev, lastOpenedPage: currentPage }));
    }
    if (view === 'reader') {
      setLoading(true);
      fetch(`https://api.alquran.cloud/v1/page/${currentPage}/quran-uthmani`)
        .then(r => r.json())
        .then(d => {
          setPageData(d.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [currentPage, view]);

  useEffect(() => {
    if (command && view === 'reader') {
      if (command === 'next') setCurrentPage(p => Math.min(604, p + 1));
      else if (command === 'prev') setCurrentPage(p => Math.max(1, p - 1));
      onCommandProcessed?.();
    }
  }, [command]);

  const playAyah = (ayahNumber: number) => {
    if (playingAyah === ayahNumber) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }
    
    if (audioRef.current) audioRef.current.pause();
    
    setPlayingAyah(ayahNumber);
    const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`;
    audioRef.current = new Audio(url);
    audioRef.current.play();
    audioRef.current.onended = () => setPlayingAyah(null);
  };

  // Filter surahs for the list view
  const filteredSurahs = SURAH_INDEX.filter(s => {
    const trimmed = searchQuery.trim();
    return s.name.includes(trimmed) || s.id.toString() === trimmed;
  });

  if (view === 'index') return (
    <div className="space-y-4 pb-20 animate-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-[#D4AF37]">المصحف الشريف</h2>
        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">ابحث باسم السورة أو رقمها</p>
      </div>

      <div className="relative sticky top-0 z-20 pt-2 pb-4">
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all ${isDark ? 'bg-white/5 border-white/10 focus-within:border-[#D4AF37]/50' : 'bg-white border-black/5 focus-within:border-[#D4AF37]/50 shadow-sm'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="ابحث عن سورة (مثلاً: البقرة أو 2)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="opacity-40 hover:opacity-100">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* General Surah Index */}
        {filteredSurahs.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-[10px] font-black opacity-40 uppercase tracking-widest px-2">فهرس السور</h3>
            <div className="grid grid-cols-1 gap-2">
              {filteredSurahs.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => { setCurrentPage(s.start); setView('reader'); }} 
                  className={`w-full glass-panel p-5 rounded-2xl flex justify-between items-center hover:border-[#D4AF37] transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg ${isDark ? 'bg-white/10 text-white' : 'bg-black/5'} flex items-center justify-center text-[10px] font-black`}>{s.id}</span>
                    <span className="font-bold text-lg">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold opacity-30">ص {s.start}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {searchQuery && filteredSurahs.length === 0 && (
          <div className="text-center py-20 opacity-20">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
             <p className="font-bold">عذراً، لم نجد سورة تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 animate-in">
      <div className={`fixed top-0 left-0 right-0 h-24 backdrop-blur-md z-50 flex items-center justify-between px-6 border-b ${isDark ? 'bg-black/80 border-white/10' : 'bg-white/80 border-[#D4AF37]/20'}`}>
        <button onClick={() => setView('index')} className={`text-[#D4AF37] font-black text-xs uppercase ${isDark ? 'bg-white/10' : 'bg-black/5'} px-4 py-2 rounded-xl flex items-center gap-2`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" /></svg>
          الفهرس
        </button>
        <div className="text-center">
          <h3 className="text-lg font-black text-[#D4AF37]">ص {currentPage}</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={`p-2 rounded-xl text-xs font-black ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}>السابق</button>
          <button onClick={() => setCurrentPage(p => Math.min(604, p + 1))} className={`p-2 rounded-xl text-xs font-black ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}>التالي</button>
        </div>
      </div>
      
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className={`p-8 sm:p-12 rounded-[2.5rem] border shadow-inner ${isDark ? 'bg-[#121212] border-white/5 text-white' : 'bg-[#fffdf2] border-[#e6dec5] text-black'}`}>
            <div className="quran-font text-2xl sm:text-3xl text-right leading-[2.2] select-none" style={{ direction: 'rtl', textAlign: 'justify', textAlignLast: 'center' }}>
              {pageData?.ayahs.map((a: any, idx: number) => (
                <React.Fragment key={a.number}>
                  {a.numberInSurah === 1 && (
                    <div className="block w-full text-center my-10 animate-in fade-in zoom-in duration-500">
                      <div className="text-[#D4AF37] text-3xl font-black mb-4 border-b-2 border-[#D4AF37]/20 pb-4 inline-block min-w-[180px]">
                        {a.surah.name}
                      </div>
                      {a.surah.number !== 9 && (
                        <div className="quran-font text-2xl opacity-80 mt-2 font-medium">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                      )}
                    </div>
                  )}
                  <span 
                    onClick={() => playAyah(a.number)}
                    className={`inline transition-all cursor-pointer rounded-lg px-1 hover:bg-[#D4AF37]/10 ${playingAyah === a.number ? 'text-[#D4AF37] bg-[#D4AF37]/5' : ''}`}
                  >
                    {a.text} <span className="text-[#D4AF37] text-lg font-bold mx-1 opacity-60">({a.numberInSurah})</span>
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="text-center opacity-30 text-[10px] font-bold mt-4">نقر الآية للاستماع (الشيخ العفاسي)</div>
    </div>
  );
};

export default QuranReader;
