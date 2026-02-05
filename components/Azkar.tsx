
import React, { useState, useEffect } from 'react';

const AZKAR_DATA: Record<string, { name: string, items: { text: string, count: number }[] }> = {
  morning: {
    name: 'أذكار الصباح',
    items: [
      { text: "أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: {اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ...}", count: 1 },
      { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: {قُلْ هُوَ اللَّهُ أَحَدٌ ...} (الإخلاص)", count: 3 },
      { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: {قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ...}", count: 3 },
      { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: {قُلْ أَعُوذُ بِرَبِّ النَّاسِ ...}", count: 3 },
      { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ...", count: 1 },
      { text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أنتَ، خَلقتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ...", count: 1 },
      { text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ...", count: 4 },
      { text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي...", count: 3 },
      { text: "حَسْبِيَ اللهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.", count: 7 },
      { text: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.", count: 3 },
      { text: "رَضِيتُ بِاللهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.", count: 3 },
      { text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ.", count: 100 }
    ]
  },
  evening: {
    name: 'أذكار المساء',
    items: [
      { text: "أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: {اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ...}", count: 1 },
      { text: "بِسْم. اللهِ الرَّحْمنِ الرَّحِيم: {قُلْ هُوَ اللَّهُ أَحَدٌ ...}", count: 3 },
      { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: {قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ...}", count: 3 },
      { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: {قُلْ أَعُوذُ بِرَبِّ النَّاسِ ...}", count: 3 },
      { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ...", count: 1 },
      { text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ...", count: 1 },
      { text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي...", count: 3 },
      { text: "حَسْبِيَ اللهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.", count: 7 },
      { text: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.", count: 3 },
      { text: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.", count: 3 },
      { text: "رَضِيتُ بِاللهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.", count: 3 },
      { text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ.", count: 100 }
    ]
  },
  after_prayer: {
    name: 'أذكار بعد الصلاة',
    items: [
      { text: "أَسْتَغْفِرُ اللهَ (ثلاثاً)", count: 3 },
      { text: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.", count: 1 },
      { text: "سُبْحَانَ اللهِ", count: 33 },
      { text: "الْحَمْدُ لِلَّهِ", count: 33 },
      { text: "اللهُ أَكْبَرُ", count: 33 },
      { text: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 1 },
      { text: "قراءة آية الكرسي: {اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...}", count: 1 },
      { text: "قراءة سورة الإخلاص، الفلق، والناس.", count: 1 }
    ]
  },
  sleep: {
    name: 'أذكار النوم',
    items: [
      { text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ...", count: 1 },
      { text: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا.", count: 1 },
      { text: "قِرَاءَةُ آيَةِ الْكُرْسِيِّ وَآخِرِ آيَتَيْنِ مِنْ سُورَةِ الْبَقَرَةِ.", count: 1 }
    ]
  }
};

interface Props {
  command?: 'next' | 'prev' | null;
  onCommandProcessed?: () => void;
  initialCategory?: string | null;
  isDark?: boolean;
}

const Azkar: React.FC<Props> = ({ command, onCommandProcessed, initialCategory, isDark }) => {
  const [activeCat, setActiveCat] = useState<string | null>(initialCategory || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counts, setCounts] = useState<Record<number, number>>({});

  useEffect(() => { if (initialCategory) { setActiveCat(initialCategory); setCurrentIndex(0); setCounts({}); } }, [initialCategory]);

  useEffect(() => {
    if (command && activeCat) {
      if (command === 'next') nextZikr();
      else if (command === 'prev') prevZikr();
      onCommandProcessed?.();
    }
  }, [command]);

  const handlePress = (index: number, max: number) => {
    const current = counts[index] || 0;
    if (current < max) {
      setCounts(prev => ({ ...prev, [index]: current + 1 }));
      if (current + 1 === max && navigator.vibrate) navigator.vibrate(50);
    }
  };

  const nextZikr = () => {
    if (activeCat && currentIndex < AZKAR_DATA[activeCat].items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevZikr = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  if (activeCat && AZKAR_DATA[activeCat]) {
    const cat = AZKAR_DATA[activeCat];
    const item = cat.items[currentIndex];
    const currentCount = counts[currentIndex] || 0;
    const isDone = currentCount === item.count;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-12 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <button onClick={() => { setActiveCat(null); setCurrentIndex(0); setCounts({}); }} className={`font-black text-[10px] uppercase px-4 py-2 rounded-xl ${isDark ? 'bg-white text-black' : 'bg-black text-[var(--gold)]'}`}>القائمة الرئيسية</button>
          <div className={`font-black text-xs ${isDark ? 'text-white' : 'text-[var(--gold)]'}`}>{currentIndex + 1} / {cat.items.length}</div>
        </div>
        <h2 className="text-2xl font-black text-[var(--gold)] text-center">{cat.name}</h2>
        <button 
          onClick={() => handlePress(currentIndex, item.count)} 
          className={`w-full text-right glass-panel p-8 rounded-[3rem] transition-all shadow-xl border-2 min-h-[300px] flex flex-col justify-between ${
            isDone ? 'border-green-500/30' : 'border-[var(--gold)]/20 active:scale-95'
          } ${isDark ? 'bg-white/5' : ''}`}
        >
          <p className={`text-xl leading-[2] mb-10 quran-font font-medium ${isDark ? 'text-white' : 'text-[var(--text-main)]'}`}>{item.text}</p>
          <div className="flex justify-between items-center mt-auto">
            <span className={`text-2xl font-black px-4 py-1 rounded-2xl ${isDark ? 'bg-white text-black' : 'bg-black text-[var(--gold)]'}`}>{currentCount} / {item.count}</span>
            {isDone && <span className="text-green-500 font-black text-xs">تم</span>}
          </div>
        </button>
        <div className="flex gap-4 w-full mt-8">
           <button onClick={prevZikr} disabled={currentIndex === 0} className={`flex-1 py-5 rounded-3xl font-black text-sm active:scale-95 disabled:opacity-20 ${isDark ? 'bg-white/10 text-white' : 'bg-black text-[var(--gold)]'}`}>السابق</button>
           <button onClick={nextZikr} disabled={currentIndex === cat.items.length - 1} className="flex-1 py-5 rounded-3xl font-black text-sm bg-[var(--gold)] text-black active:scale-95 disabled:opacity-20">التالي</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="text-center"><h2 className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-[var(--text-main)]'}`}>الأذكار</h2></div>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(AZKAR_DATA).map(([id, cat]) => (
          <button key={id} onClick={() => setActiveCat(id)} className={`glass-panel p-8 rounded-[2.5rem] flex items-center justify-between group shadow-lg border border-[var(--border-color)] transition-all ${isDark ? 'bg-white/10 border-white/20 hover:border-[var(--gold)]' : 'bg-white/50 hover:border-[var(--gold)]'}`}>
            <div className="text-right">
              <h4 className={`font-black text-xl ${isDark ? 'text-white' : ''}`}>{cat.name}</h4>
              <p className={`text-[10px] font-bold ${isDark ? 'text-white' : 'opacity-30'}`}>{cat.items.length} ذكراً</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Azkar;
