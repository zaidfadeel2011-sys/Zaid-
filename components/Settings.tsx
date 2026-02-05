
import React from 'react';
import { UserData, Page, PrayerStatus } from '../types';

interface Props {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  onNavigate: (page: Page) => void;
}

const Settings: React.FC<Props> = ({ userData, setUserData }) => {
  const isDark = userData.themeColor === 'dark';

  const calculateStats = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - i);
      return d.toLocaleDateString('en-CA');
    });

    let stats = {
      mosque: 0,
      home: 0,
      late: 0,
      missed: 0,
      total: 0
    };

    last7Days.forEach(dateKey => {
      const dayData = userData.prayerTable?.[dateKey];
      if (dayData) {
        Object.values(dayData).forEach(status => {
          if (status !== 'none') {
            stats.total++;
            if (status === 'mosque') stats.mosque++;
            if (status === 'home') stats.home++;
            if (status === 'late') stats.late++;
            if (status === 'missed') stats.missed++;
          }
        });
      }
    });

    return stats;
  };

  const stats = calculateStats();
  const getPercentage = (val: number) => stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-[var(--gold)]">الإعدادات</h2>
        <div className="w-16 h-1.5 bg-[var(--gold)]/30 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="space-y-6">
        {/* إحصائيات بالألوان المختارة فقط (ذهبي، أسود، أبيض) */}
        <div className={`glass-panel p-8 rounded-[2.5rem] border border-[var(--gold)]/20 shadow-lg ${isDark ? 'bg-white/5' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-black text-xl text-[var(--gold)]">إحصائيات الأسبوع</h4>
            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">آخر 7 أيام</span>
          </div>

          {stats.total === 0 ? (
            <div className="text-center py-8 opacity-40 italic text-sm">
              لا توجد بيانات مسجلة لهذا الأسبوع حتى الآن.
            </div>
          ) : (
            <div className="space-y-6">
              {/* شريط التقدم بنظام الألوان الجديد */}
              <div className="relative h-4 w-full bg-black/5 rounded-full overflow-hidden flex">
                <div style={{ width: `${getPercentage(stats.mosque)}%` }} className="h-full bg-black"></div>
                <div style={{ width: `${getPercentage(stats.home)}%` }} className="h-full bg-[var(--gold)]"></div>
                <div style={{ width: `${getPercentage(stats.late)}%` }} className="h-full bg-[var(--gold-light)]"></div>
                <div style={{ width: `${getPercentage(stats.missed)}%` }} className="h-full bg-white border-l border-black/10"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard label="في المسجد" count={stats.mosque} color="bg-black" percentage={getPercentage(stats.mosque)} isDark={isDark} />
                <StatCard label="في وقتها" count={stats.home} color="bg-[var(--gold)]" percentage={getPercentage(stats.home)} isDark={isDark} />
                <StatCard label="صلاة قضاء" count={stats.late} color="bg-[var(--gold-light)]" percentage={getPercentage(stats.late)} isDark={isDark} />
                <StatCard label="صلوات فائتة" count={stats.missed} color="bg-white border border-black/10" percentage={getPercentage(stats.missed)} isDark={isDark} />
              </div>

              <div className="text-center pt-4 border-t border-black/5">
                <p className="text-[10px] font-black opacity-40">إجمالي الصلوات المسجلة: {stats.total}</p>
              </div>
            </div>
          )}
        </div>

        {/* المظهر */}
        <div className={`glass-panel p-8 rounded-[2.5rem] border border-[var(--gold)]/20 shadow-lg ${isDark ? 'bg-white/5' : 'bg-white'}`}>
          <h4 className="font-black text-xl mb-6 text-[var(--gold)]">المظهر</h4>
          <div className="flex gap-4">
            {['white', 'dark'].map((t) => (
              <button 
                key={t}
                onClick={() => setUserData(prev => ({ ...prev, themeColor: t as any }))}
                className={`flex-1 py-4 rounded-2xl border-2 font-black transition-all ${
                  userData.themeColor === t 
                  ? 'border-black bg-black text-[var(--gold)]' 
                  : 'border-black/5 hover:border-[var(--gold)]/20 opacity-60'
                }`}
              >
                {t === 'white' ? 'نهاري' : 'ليلي'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  count: number;
  color: string;
  percentage: number;
  isDark: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, count, color, percentage, isDark }) => (
  <div className={`p-4 rounded-2xl border flex flex-col gap-1 ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-[10px] font-black opacity-60">{label}</span>
    </div>
    <div className="flex justify-between items-baseline">
      <span className="text-xl font-black">{count}</span>
      <span className="text-[10px] font-bold opacity-40">{percentage}%</span>
    </div>
  </div>
);

export default Settings;
