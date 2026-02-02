
export type Page = 'home' | 'fatwa' | 'prayer' | 'quran' | 'azkar' | 'settings' | 'minbar' | 'recitations';

export type ThemeColor = 'green' | 'dark' | 'white';

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface CustomRecitation {
  id: number;
  title: string;
  url: string;
}

export interface ReminderSettings {
  enabled: boolean;
  minutesBefore: number;
}

export interface AzkarReminder {
  enabled: boolean;
  time: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface UserData {
  username: string;
  themeColor: ThemeColor;
  prayerTable: Record<string, string>;
  customSurahsBySheikh: Record<string, CustomRecitation[]>;
  customSermons: CustomRecitation[];
  azkarReminders: Record<string, AzkarReminder>;
  prayerReminders: Record<string, ReminderSettings>;
  fatwaHistory: Message[];
  lastOpenedPage: number; // الصفحة الأخيرة التي تم فتحها في المصحف
  favorites: {
    surahIds: number[];
    sheikhIds: string[];
  };
  khatmah: {
    currentPage: number;
    pagesPerDay: number;
    lastReadDate: string;
    isCompletedToday: boolean;
    totalReadPages: number;
  };
}
