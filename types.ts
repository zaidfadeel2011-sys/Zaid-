
export type Page = 'home' | 'fatwa' | 'prayer' | 'quran' | 'azkar' | 'settings' | 'minbar' | 'recitations';
export type ThemeColor = 'green' | 'dark' | 'white';

export type PrayerStatus = 'none' | 'mosque' | 'home' | 'late' | 'missed';

export interface Message { role: 'user' | 'assistant'; content: string; }
export interface CustomRecitation { id: number; title: string; url: string; }
export interface PrayerTimings { Fajr: string; Sunrise: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string; }

export interface UserData {
  username: string;
  themeColor: ThemeColor;
  fatwaHistory: Message[];
  lastOpenedPage: number;
  prayerTable: Record<string, Record<string, PrayerStatus>>; // Date -> PrayerName -> Status
  customSurahsBySheikh: any;
  customSermons: any;
  azkarReminders: any;
  prayerReminders: any;
  favorites: any;
}
