
import React, { useState, useEffect, useRef } from 'react';
import { UserData, CustomRecitation } from '../types';
import { SERMONS_DATA } from '../App';

interface Props {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  externalShowForm?: boolean;
  onFormClosed?: () => void;
}

const Minbar: React.FC<Props> = ({ userData, setUserData, externalShowForm, onFormClosed }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (externalShowForm) { setShowAddForm(true); onFormClosed?.(); } }, [externalShowForm]);

  const openInYouTube = (url: string) => { 
    if (url.startsWith('data:')) {
      const audio = new Audio(url);
      audio.play();
      alert("جاري تشغيل الموعظة المحلية...");
    } else {
      window.open(url, '_blank'); 
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("عذراً، حجم الملف كبير جداً. يرجى اختيار ملف أقل من 5 ميجابايت.");
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

  const handleAddSermon = () => {
    if (!newTitle || !newUrl) return;
    const newSermon: CustomRecitation = { id: Date.now(), title: newTitle, url: newUrl };
    setUserData(prev => ({ ...prev, customSermons: [...(prev.customSermons || []), newSermon] }));
    setNewTitle(''); setNewUrl(''); setShowAddForm(false);
  };

  const allSermons = [...SERMONS_DATA, ...(userData.customSermons || [])];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12 text-[var(--text-main)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black uppercase">MINBAR</h2>
        <button onClick={() => setShowAddForm(true)} className="bg-[var(--gold)] text-black px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase shadow-lg">إضافة موعظة</button>
      </div>
      {showAddForm && (
        <div className="glass-panel p-8 rounded-[3rem] border-2 border-[var(--gold)]/30 animate-in slide-in-from-top-4 mb-8 shadow-2xl relative z-10">
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-black text-[var(--gold)] py-4 rounded-xl font-black text-[10px] flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
              {isUploading ? 'جاري التحميل...' : 'اختر تسجيل صوتي'}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
          </div>

          <p className="text-[8px] opacity-30 text-center mb-2">أو أدخل رابطاً يوتيوب</p>

          <input type="text" placeholder="عنوان الموعظة" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-black/5 rounded-2xl px-5 py-4 mb-3 text-xs outline-none" />
          <input type="text" placeholder="رابط يوتيوب" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="w-full bg-black/5 rounded-2xl px-5 py-4 mb-5 text-xs outline-none" />
          <div className="flex gap-3">
            <button onClick={handleAddSermon} disabled={isUploading} className="flex-1 bg-[var(--gold)] text-black py-4 rounded-2xl font-black text-xs shadow-xl disabled:opacity-50">حفظ</button>
            <button onClick={() => setShowAddForm(false)} className="flex-1 bg-black/5 py-4 rounded-2xl font-black text-xs">إلغاء</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {allSermons.map((sermon, i) => (
          <button key={i} onClick={() => openInYouTube(sermon.url)} className="w-full glass-panel p-7 rounded-[2.5rem] flex items-center justify-between border border-[var(--border-color)] hover:border-[var(--primary)] transition-all shadow-md bg-white/40">
            <div className="text-right flex-1 ml-4">
              <span className="text-[8px] font-black text-[var(--gold)] uppercase opacity-60">SERMON #{i + 1}</span>
              <h4 className="font-black text-lg leading-relaxed">{sermon.title}</h4>
            </div>
            <div className="w-12 h-12 rounded-2xl border border-[var(--border-color)] flex items-center justify-center text-[var(--gold)]">
              {sermon.url.startsWith('data:') ? (
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
};

export default Minbar;
