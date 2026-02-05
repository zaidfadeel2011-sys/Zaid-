
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'https://esm.sh/adhan';
import { PrayerTimings } from '../types';

/**
 * تحديد أفضل طريقة حساب تلقائياً بناءً على الموقع الجغرافي
 */
const getAutomaticMethod = (lat: number, lon: number) => {
  // منطقة الخليج والسعودية -> أم القرى
  if (lat > 15 && lat < 33 && lon > 34 && lon < 56) {
    if (lon > 51 && lon < 56 && lat > 22 && lat < 26) return CalculationMethod.Dubai(); // الإمارات
    if (lon > 50 && lon < 52 && lat > 24 && lat < 27) return CalculationMethod.Qatar(); // قطر
    if (lon > 46 && lon < 49 && lat > 28 && lat < 31) return CalculationMethod.Kuwait(); // الكويت
    return CalculationMethod.UmmAlQura();
  }
  
  // مصر والسودان
  if (lat > 15 && lat < 32 && lon > 22 && lon < 35) return CalculationMethod.Egyptian();
  
  // شبه القارة الهندية
  if (lat > 5 && lat < 37 && lon > 60 && lon < 100) return CalculationMethod.Karachi();
  
  // تركيا
  if (lat > 36 && lat < 42 && lon > 26 && lon < 45) return CalculationMethod.Turkey();

  // أوروبا وأمريكا وباقي العالم (رابطة العالم الإسلامي هي المعيار العالمي)
  return CalculationMethod.MuslimWorldLeague();
};

/**
 * حساب مواقيت الصلاة محلياً بدقة عالية مع اختيار تلقائي للمذهب والطريقة.
 */
export const calculateLocalPrayers = (lat: number, lon: number): any => {
  const coords = new Coordinates(lat, lon);
  const date = new Date();
  
  // اختيار الطريقة تلقائياً بناءً على الإحداثيات
  const params = getAutomaticMethod(lat, lon);

  // استخدام مذهب الجمهور (الشافعي/المالكي/الحنبلي) كافتراضي للعصر
  // يمكن مستقبلاً إضافة خيار للمذهب الحنفي إذا لزم الأمر
  params.madhab = Madhab.Shafi;

  const prayerTimes = new PrayerTimes(coords, date, params);

  const format = (d: Date) => {
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  return {
    timings: {
      Fajr: format(prayerTimes.fajr),
      Sunrise: format(prayerTimes.sunrise),
      Dhuhr: format(prayerTimes.dhuhr),
      Asr: format(prayerTimes.asr),
      Maghrib: format(prayerTimes.maghrib),
      Isha: format(prayerTimes.isha),
    },
    meta: {
      method: { name: 'تلقائي (حسب الموقع)' },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    raw: prayerTimes
  };
};

export const getNextPrayer = (timings: PrayerTimings) => {
  const now = new Date();
  const prayerNames: (keyof PrayerTimings)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  const prayersWithDates = prayerNames.map(name => {
    const timeStr = timings[name];
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    return { name, date: prayerDate };
  }).filter(p => p !== null) as { name: keyof PrayerTimings, date: Date }[];

  let next = prayersWithDates.find(p => p.date > now);

  if (!next) {
    const [hours, minutes] = timings.Fajr.split(':').map(Number);
    const tomorrowFajr = new Date();
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    tomorrowFajr.setHours(hours, minutes, 0, 0);
    next = { name: 'Fajr', date: tomorrowFajr };
  }

  const diff = next.date.getTime() - now.getTime();
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  const prayerAr: Record<string, string> = {
    Fajr: 'الفجر',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
  };

  return {
    name: prayerAr[next.name],
    time: timings[next.name],
    countdown: `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  };
};
