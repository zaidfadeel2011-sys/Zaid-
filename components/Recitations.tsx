
import React, { useState, useEffect, useRef } from 'react';
import { UserData, CustomRecitation } from '../types';
import { RECITATIONS_DATA } from '../App';

const SHEIKHS = [
  { id: 'nafees', name: 'الشيخ أحمد النفيس' },
  { id: 'dosari', name: 'الشيخ ياسر الدوسري' },
  { id: 'afasy', name: 'الشيخ مشاري العفاسي' },
  { id: 'yamani', name: 'الشيخ وديع اليمني' },
  { id: 'sudais', name: 'الشيخ عبدالرحمن السديس' }
];

interface Props {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  externalShowForm?: boolean;
  onFormClosed?: () => void;
}

const Recitations: React.FC<Props> = ({ userData, setUserData, externalShowForm, onFormClosed }) => {
  const [selectedSheikh, setSelectedSheikh] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = userData.themeColor === 'dark';

  useEffect(() => { if (externalShowForm && selectedSheikh) { setShowAddForm(true); onFormClosed?.(); } }, [externalShowForm, selectedSheikh]);

  const openInYouTube = (url: string) => {
    if (url.startsWith('data:')) {
      const audio = new Audio(url);
      audio.play();
      alert("جاري تشغيل الملف المحلي...");
    } else {
      window.open(url, '_blank');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("عذراً، حجم الملف كبير جداً. يرجى اختيار ملف أقل من 5 ميجابايت لضمان حفظه.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewUrl(event.target?.result as string);
      setNewTitle(file.name.split('.')[0]);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddRecitation = () => {
    if (!newTitle || !newUrl || !selectedSheikh) return;
    const newRec: CustomRecitation = { id: Date.now(), title: newTitle, url: newUrl };
    setUserData(prev => ({
      ...prev,
      customSurahsBySheikh: {
        ...prev.customSurahsBySheikh,
        [selectedSheikh.id]: [...(prev.customSurahsBySheikh[selectedSheikh.id] || []), newRec]
      }
    }));
    setNewTitle(''); setNewUrl(''); setShowAddForm(false);
  };

  if (selectedSheikh) {
    const list = [...(RECITATIONS_DATA[selectedSheikh.id] || []), ...(userData.customSurahsBySheikh[selectedSheikh.id] || [])];
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        <div className="flex justify-between items-center">
          <button onClick={() => setSelectedSheikh(null)} className={`font-black text-[10px] uppercase px-4 py-2 rounded-xl ${isDark ? 'bg-white text-black' : 'bg-black text-[var(--gold)]'}`}>العودة</button>
          <button onClick={() => setShowAddForm(true)} className="bg-[var(--gold)] text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase">إضافة تلاوة</button>
        </div>
        <div className="text-center mb-8"><h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-black'}`}>{selectedSheikh.name}</h2></div>
        {showAddForm && (
          <div className={`glass-panel p-6 rounded-[2.5rem] border-2 border-[var(--gold)]/30 animate-in zoom-in-95 shadow-2xl ${isDark ? 'bg-white/5' : ''}`}>
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 ${isDark ? 'bg-white text-black' : 'bg-black text-[var(--gold)]'} py-3 rounded-xl font-black text-[10px] flex items-center justify-center gap-2`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                {isUploading ? 'جاري التحميل...' : 'اختر ملفاً'}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
            </div>
            
            <p className={`text-[8px] opacity-30 text-center mb-2 ${isDark ? 'text-white' : ''}`}>أو أدخل رابطاً يدوياً</p>

            <input type="text" placeholder="عنوان التلاوة" value={newTitle} onChange={e => setNewTitle(e.target.value)} className={`w-full ${isDark ? 'bg-white/10 text-white' : 'bg-black/5'} rounded-2xl px-5 py-4 mb-3 text-xs outline-none`} />
            <input type="text" placeholder="رابط يوتيوب" value={newUrl} onChange={e => setNewUrl(e.target.value)} className={`w-full ${isDark ? 'bg-white/10 text-white' : 'bg-black/5'} rounded-2xl px-5 py-4 mb-4 text-xs outline-none`} />
            <div className="flex gap-2">
              <button onClick={handleAddRecitation} disabled={isUploading} className="flex-1 bg-[var(--gold)] text-black py-4 rounded-2xl font-black text-xs disabled:opacity-50">حفظ</button>
              <button onClick={() => setShowAddForm(false)} className={`flex-1 py-4 rounded-2xl font-black text-xs ${isDark ? 'bg-white/10 text-white' : 'bg-black/5'}`}>إلغاء</button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-3">
          {list.map((surah, i) => (
            <button key={i} onClick={() => openInYouTube(surah.url)} className={`w-full glass-panel p-6 rounded-[2rem] flex justify-between items-center transition-all border border-[var(--border-color)] ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/40 hover:border-[var(--gold)]'}`}>
              <div className="flex items-center gap-4">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black ${isDark ? 'bg-white text-black' : 'bg-black text-[var(--gold)]'}`}>{i + 1}</span>
                <span className={`font-bold text-lg ${isDark ? 'text-white' : ''}`}>{surah.title}</span>
              </div>
              <div className="text-[var(--gold)]">
                {surah.url.startsWith('data:') ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      <div className="text-center mb-10"><h2 className={`text-3xl font-black uppercase ${isDark ? 'text-white' : 'text-[var(--text-main)]'}`}>RECITATIONS</h2></div>
      <div className="grid grid-cols-2 gap-4">
        {SHEIKHS.map((sheikh) => (
          <button key={sheikh.id} onClick={() => setSelectedSheikh(sheikh)} className={`w-full glass-panel p-6 rounded-[2.5rem] flex flex-col items-center justify-center transition-all shadow-md space-y-3 border border-[var(--border-color)] hover:border-[var(--gold)] ${isDark ? 'bg-white/5' : 'bg-white/50'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-[var(--gold)] ${isDark ? 'bg-white/10' : 'bg-[var(--gold)]/10'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div className="text-center"><h4 className={`font-black text-sm ${isDark ? 'text-white' : ''}`}>{sheikh.name}</h4><p className="text-[8px] opacity-40 font-bold uppercase">تصفح التلاوات</p></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Recitations;
