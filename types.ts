export enum Grade {
  PREP_1 = 'الصف الأول الإعدادي',
  PREP_2 = 'الصف الثاني الإعدادي',
  PREP_3 = 'الصف الثالث الإعدادي',
  SEC_1 = 'الصف الأول الثانوي',
  SEC_2 = 'الصف الثاني الثانوي',
  SEC_3 = 'الصف الثالث الثانوي'
}

export interface Surah {
  id: number; // 1 to 114
  name: string;
  ayat: number;
  type: 'مكية' | 'مدنية';
  juz: number;
  juzList?: number[];
  juzText?: string;
}

export interface SemesterData {
  term1: Surah[];
  term1Note?: string;
  term2: Surah[];
  term2Note?: string;
  revisionNote?: string;
  revisionSurahs?: Surah[];
}

export interface Curriculum {
  [key: string]: SemesterData;
}

export interface JuzSurahEntry {
  surahId: number;
  surahName: string;
  ayatRange: string;
  type: 'مكية' | 'مدنية';
  ayat: number;
}

export interface JuzInfo {
  juz: number;
  name: string;
  ayatDescription: string;
  surahIds: number[];
  surahEntries?: JuzSurahEntry[];
}

export interface Reciter {
  id: string;
  name: string;
  server: string;
  folder?: string;
  description: string;
  moshafType?: string;
}

export interface ClassSession {
  day: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
}

export interface ExamEntry {
  date: string;
  subject: string;
  duration: string;
  timeFrom?: string;
  timeTo?: string;
}

export interface NewsComment {
  id: string;
  news_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'text' | 'image' | 'video' | 'gallery';
  mediaUrl?: string;
  mediaUrls?: string[];
  comments?: NewsComment[];
}
