
import React from 'react';

interface Props {
  count: number;
  updateCount: (count: number) => void;
  // Removed addPoints from Props
}

const Tasbeeh: React.FC<Props> = ({ count, updateCount }) => {
  const handleIncrement = () => {
    updateCount(count + 1);
    // Removed call to addPoints
    if (navigator.vibrate) navigator.vibrate(35);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-16 animate-in fade-in zoom-in-90 duration-700">
      <div className="text-center space-y-2">
        <h2 className="zikr-logo text-3xl font-black">ZIKR COUNTER</h2>
        <p className="text-white/20 text-[10px] font-black tracking-[0.4em] uppercase">سبحان الله وبحمده</p>
      </div>

      <div className="relative group">
        {/* Glowing Aura */}
        <div className="absolute inset-0 bg-[#c5a021]/20 rounded-full blur-[100px] group-active:blur-[140px] transition-all"></div>
        
        {/* Counter Ring */}
        <div className="absolute inset-[-30px] border border-white/[0.03] rounded-full"></div>
        
        <button
          onClick={handleIncrement}
          className="relative w-80 h-80 rounded-full glass-panel border-white/10 flex flex-col items-center justify-center text-white active:scale-95 transition-all duration-300 overflow-hidden shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]"
        >
          {/* Dynamic Fill Effect */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#c5a021]/10 to-transparent transition-all duration-700 pointer-events-none" 
            style={{ height: `${(count % 33) * 3}%` }}
          />
          
          <div className="relative z-10 text-center select-none">
            <span className="block text-[120px] font-black text-white leading-none tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">{count}</span>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c5a021]"></div>
              <span className="text-xs font-black text-white/30 tracking-[0.2em] uppercase">TASBEEH</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#c5a021]"></div>
            </div>
          </div>
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => confirm('تصفير العداد؟') && updateCount(0)}
          className="neo-button px-8 py-4 rounded-2xl text-[10px] font-black text-white/40 tracking-widest uppercase hover:text-white transition-all"
        >
          Reset Counter
        </button>
      </div>
    </div>
  );
};

export default Tasbeeh;
