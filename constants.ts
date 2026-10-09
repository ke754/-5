import { Grade, Curriculum, Reciter, Surah, JuzInfo } from './types';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const ADMIN_PASSWORD = 'khtml1212';

// Supabase Configuration
const supabaseUrl = 'https://qvgvcoojkidihkagtsyf.supabase.co';
const supabaseKey = 'sb_publishable_nqBbU96-LTs_aGgm5hUZmw_SlIZZ2l0';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Cloudinary Configuration
export const CLOUDINARY_CLOUD_NAME = 'ddduuctpb';
export const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

// Curated list of premier Azhari & Islamic Reciters from mp3quran.net
export const RECITERS: Reciter[] = [
  { 
    id: 'minsh', 
    name: 'الشيخ محمد صديق المنشاوي (مرتل)', 
    server: 'server10', 
    folder: 'minsh', 
    description: 'ابن المنشأة البار - راعي المعهد الفخري (المصحف المرتل).' 
  },
  { 
    id: 'minsh_mjwd', 
    name: 'الشيخ محمد صديق المنشاوي (مجود)', 
    server: 'server10', 
    folder: 'minsh_mjwd', 
    description: 'تلاوات خاشعة نادرة بالمقامات الأصيلة (المصحف المجود).' 
  },
  { 
    id: 'husr', 
    name: 'الشيخ محمود خليل الحصري (المعلم)', 
    server: 'server13', 
    folder: 'husr', 
    description: 'شيخ عموم المقارئ المصرية - المصحف المعلم لأحكام التجويد.' 
  },
  { 
    id: 'basit', 
    name: 'الشيخ عبد الباسط عبد الصمد (مرتل)', 
    server: 'server7', 
    folder: 'basit', 
    description: 'صوت مكة وحنجرة القرآن الذهبية الخالدة.' 
  },
  { 
    id: 'basit_mjwd', 
    name: 'الشيخ عبد الباسط عبد الصمد (مجود)', 
    server: 'server7', 
    folder: 'basit_mjwd', 
    description: 'روائع التلاوات المحفلية المجودة.' 
  },
  { 
    id: 'mustafa', 
    name: 'الشيخ مصطفى إسماعيل', 
    server: 'server8', 
    folder: 'mustafa', 
    description: 'عبقري التلاوة ومقرئ الجامع الأزهر الأسبق.' 
  },
  { 
    id: 'rifat', 
    name: 'الشيخ محمد رفعت', 
    server: 'server14', 
    folder: 'rifat', 
    description: 'قيثارة السماء وأول صوت قرآني في الإذاعة المصرية.' 
  },
  { 
    id: 'banna', 
    name: 'الشيخ محمود علي البنا', 
    server: 'server8', 
    folder: 'banna', 
    description: 'صوت جهوري وقور وتجويد محكم.' 
  },
  { 
    id: 'tblwi', 
    name: 'الشيخ محمد محمود الطبلاوي', 
    server: 'server12', 
    folder: 'tblwi', 
    description: 'نقيب قراء مصر الراحل وصاحب النبرة الشجية.' 
  },
  { 
    id: 'afs', 
    name: 'الشيخ مشاري راشد العفاسي', 
    server: 'server8', 
    folder: 'afs', 
    description: 'تلاوة عصرية عذبة واضحة ومتقنة.' 
  },
  { 
    id: 'maher', 
    name: 'الشيخ ماهر المعيقلي', 
    server: 'server12', 
    folder: 'maher', 
    description: 'إمام وخطيب المسجد الحرام بمكة المكرمة.' 
  },
  { 
    id: 'ajm', 
    name: 'الشيخ أحمد بن علي العجمي', 
    server: 'server10', 
    folder: 'ajm', 
    description: 'تلاوة خاشعة محببة لقلوب الطلاب.' 
  },
  { 
    id: 'sds', 
    name: 'الشيخ عبد الرحمن السديس', 
    server: 'server11', 
    folder: 'sds', 
    description: 'إمام الحرم المكي الشريف ورئيس الشؤون الدينية.' 
  },
  { 
    id: 's_gmd', 
    name: 'الشيخ سعد الغامدي', 
    server: 'server7', 
    folder: 's_gmd', 
    description: 'تلاوة هادئة ومرتلة بجودة عالية.' 
  }
];

// Complete 114 Surahs of the Holy Quran with precise data
export const ALL_SURAHS: Surah[] = [
  { id: 1, name: "الفاتحة", ayat: 7, type: "مكية", juz: 1 },
  { id: 2, name: "البقرة", ayat: 286, type: "مدنية", juz: 1 },
  { id: 3, name: "آل عمران", ayat: 200, type: "مدنية", juz: 3 },
  { id: 4, name: "النساء", ayat: 176, type: "مدنية", juz: 4 },
  { id: 5, name: "المائدة", ayat: 120, type: "مدنية", juz: 6 },
  { id: 6, name: "الأنعام", ayat: 165, type: "مكية", juz: 7 },
  { id: 7, name: "الأعراف", ayat: 206, type: "مكية", juz: 8 },
  { id: 8, name: "الأنفال", ayat: 75, type: "مدنية", juz: 9 },
  { id: 9, name: "التوبة", ayat: 129, type: "مدنية", juz: 10 },
  { id: 10, name: "يونس", ayat: 109, type: "مكية", juz: 11 },
  { id: 11, name: "هود", ayat: 123, type: "مكية", juz: 11 },
  { id: 12, name: "يوسف", ayat: 111, type: "مكية", juz: 12 },
  { id: 13, name: "الرعد", ayat: 43, type: "مدنية", juz: 13 },
  { id: 14, name: "إبراهيم", ayat: 52, type: "مكية", juz: 13 },
  { id: 15, name: "الحجر", ayat: 99, type: "مكية", juz: 14 },
  { id: 16, name: "النحل", ayat: 128, type: "مكية", juz: 14 },
  { id: 17, name: "الإسراء", ayat: 111, type: "مكية", juz: 15 },
  { id: 18, name: "الكهف", ayat: 110, type: "مكية", juz: 15 },
  { id: 19, name: "مريم", ayat: 98, type: "مكية", juz: 16 },
  { id: 20, name: "طه", ayat: 135, type: "مكية", juz: 16 },
  { id: 21, name: "الأنبياء", ayat: 112, type: "مكية", juz: 17 },
  { id: 22, name: "الحج", ayat: 78, type: "مدنية", juz: 17 },
  { id: 23, name: "المؤمنون", ayat: 118, type: "مكية", juz: 18 },
  { id: 24, name: "النور", ayat: 64, type: "مدنية", juz: 18 },
  { id: 25, name: "الفرقان", ayat: 77, type: "مكية", juz: 18 },
  { id: 26, name: "الشعراء", ayat: 227, type: "مكية", juz: 19 },
  { id: 27, name: "النمل", ayat: 93, type: "مكية", juz: 19 },
  { id: 28, name: "القصص", ayat: 88, type: "مكية", juz: 20 },
  { id: 29, name: "العنكبوت", ayat: 69, type: "مكية", juz: 20 },
  { id: 30, name: "الروم", ayat: 60, type: "مكية", juz: 21 },
  { id: 31, name: "لقمان", ayat: 34, type: "مكية", juz: 21 },
  { id: 32, name: "السجدة", ayat: 30, type: "مكية", juz: 21 },
  { id: 33, name: "الأحزاب", ayat: 73, type: "مدنية", juz: 21 },
  { id: 34, name: "سبأ", ayat: 54, type: "مكية", juz: 22 },
  { id: 35, name: "فاطر", ayat: 45, type: "مكية", juz: 22 },
  { id: 36, name: "يس", ayat: 83, type: "مكية", juz: 22 },
  { id: 37, name: "الصافات", ayat: 182, type: "مكية", juz: 23 },
  { id: 38, name: "ص", ayat: 88, type: "مكية", juz: 23 },
  { id: 39, name: "الزمر", ayat: 75, type: "مكية", juz: 23 },
  { id: 40, name: "غافر", ayat: 85, type: "مكية", juz: 24 },
  { id: 41, name: "فصلت", ayat: 54, type: "مكية", juz: 24 },
  { id: 42, name: "الشورى", ayat: 53, type: "مكية", juz: 25 },
  { id: 43, name: "الزخرف", ayat: 89, type: "مكية", juz: 25 },
  { id: 44, name: "الدخان", ayat: 59, type: "مكية", juz: 25 },
  { id: 45, name: "الجاثية", ayat: 37, type: "مكية", juz: 25 },
  { id: 46, name: "الأحقاف", ayat: 35, type: "مكية", juz: 26 },
  { id: 47, name: "محمد", ayat: 38, type: "مدنية", juz: 26 },
  { id: 48, name: "الفتح", ayat: 29, type: "مدنية", juz: 26 },
  { id: 49, name: "الحجرات", ayat: 18, type: "مدنية", juz: 26 },
  { id: 50, name: "ق", ayat: 45, type: "مكية", juz: 26 },
  { id: 51, name: "الذاريات", ayat: 60, type: "مكية", juz: 26 },
  { id: 52, name: "الطور", ayat: 49, type: "مكية", juz: 27 },
  { id: 53, name: "النجم", ayat: 62, type: "مكية", juz: 27 },
  { id: 54, name: "القمر", ayat: 55, type: "مكية", juz: 27 },
  { id: 55, name: "الرحمن", ayat: 78, type: "مدنية", juz: 27 },
  { id: 56, name: "الواقعة", ayat: 96, type: "مكية", juz: 27 },
  { id: 57, name: "الحديد", ayat: 29, type: "مدنية", juz: 27 },
  { id: 58, name: "المجادلة", ayat: 22, type: "مدنية", juz: 28 },
  { id: 59, name: "الحشر", ayat: 24, type: "مدنية", juz: 28 },
  { id: 60, name: "الممتحنة", ayat: 13, type: "مدنية", juz: 28 },
  { id: 61, name: "الصف", ayat: 14, type: "مدنية", juz: 28 },
  { id: 62, name: "الجمعة", ayat: 11, type: "مدنية", juz: 28 },
  { id: 63, name: "المنافقون", ayat: 11, type: "مدنية", juz: 28 },
  { id: 64, name: "التغابن", ayat: 18, type: "مدنية", juz: 28 },
  { id: 65, name: "الطلاق", ayat: 12, type: "مدنية", juz: 28 },
  { id: 66, name: "التحريم", ayat: 12, type: "مدنية", juz: 28 },
  { id: 67, name: "الملك", ayat: 30, type: "مكية", juz: 29 },
  { id: 68, name: "القلم", ayat: 52, type: "مكية", juz: 29 },
  { id: 69, name: "الحاقة", ayat: 52, type: "مكية", juz: 29 },
  { id: 70, name: "المعارج", ayat: 44, type: "مكية", juz: 29 },
  { id: 71, name: "نوح", ayat: 28, type: "مكية", juz: 29 },
  { id: 72, name: "الجن", ayat: 28, type: "مكية", juz: 29 },
  { id: 73, name: "المزمل", ayat: 20, type: "مكية", juz: 29 },
  { id: 74, name: "المدثر", ayat: 56, type: "مكية", juz: 29 },
  { id: 75, name: "القيامة", ayat: 40, type: "مكية", juz: 29 },
  { id: 76, name: "الإنسان", ayat: 31, type: "مدنية", juz: 29 },
  { id: 77, name: "المرسلات", ayat: 50, type: "مكية", juz: 29 },
  { id: 78, name: "النبأ", ayat: 40, type: "مكية", juz: 30 },
  { id: 79, name: "النازعات", ayat: 46, type: "مكية", juz: 30 },
  { id: 80, name: "عبس", ayat: 42, type: "مكية", juz: 30 },
  { id: 81, name: "التكوير", ayat: 29, type: "مكية", juz: 30 },
  { id: 82, name: "الانفطار", ayat: 19, type: "مكية", juz: 30 },
  { id: 83, name: "المطففين", ayat: 36, type: "مكية", juz: 30 },
  { id: 84, name: "الانشقاق", ayat: 25, type: "مكية", juz: 30 },
  { id: 85, name: "البروج", ayat: 22, type: "مكية", juz: 30 },
  { id: 86, name: "الطارق", ayat: 17, type: "مكية", juz: 30 },
  { id: 87, name: "الأعلى", ayat: 19, type: "مكية", juz: 30 },
  { id: 88, name: "الغاشية", ayat: 26, type: "مكية", juz: 30 },
  { id: 89, name: "الفجر", ayat: 30, type: "مكية", juz: 30 },
  { id: 90, name: "البلد", ayat: 20, type: "مكية", juz: 30 },
  { id: 91, name: "الشمس", ayat: 15, type: "مكية", juz: 30 },
  { id: 92, name: "الليل", ayat: 21, type: "مكية", juz: 30 },
  { id: 93, name: "الضحى", ayat: 11, type: "مكية", juz: 30 },
  { id: 94, name: "الشرح", ayat: 8, type: "مكية", juz: 30 },
  { id: 95, name: "التين", ayat: 8, type: "مكية", juz: 30 },
  { id: 96, name: "العلق", ayat: 19, type: "مكية", juz: 30 },
  { id: 97, name: "القدر", ayat: 5, type: "مكية", juz: 30 },
  { id: 98, name: "البينة", ayat: 8, type: "مدنية", juz: 30 },
  { id: 99, name: "الزلزلة", ayat: 8, type: "مدنية", juz: 30 },
  { id: 100, name: "العاديات", ayat: 11, type: "مكية", juz: 30 },
  { id: 101, name: "القارعة", ayat: 11, type: "مكية", juz: 30 },
  { id: 102, name: "التكاثر", ayat: 8, type: "مكية", juz: 30 },
  { id: 103, name: "العصر", ayat: 3, type: "مكية", juz: 30 },
  { id: 104, name: "الهمزة", ayat: 9, type: "مكية", juz: 30 },
  { id: 105, name: "الفيل", ayat: 5, type: "مكية", juz: 30 },
  { id: 106, name: "قريش", ayat: 4, type: "مكية", juz: 30 },
  { id: 107, name: "الماعون", ayat: 7, type: "مكية", juz: 30 },
  { id: 108, name: "الكوثر", ayat: 3, type: "مكية", juz: 30 },
  { id: 109, name: "الكافرون", ayat: 6, type: "مكية", juz: 30 },
  { id: 110, name: "النصر", ayat: 3, type: "مدنية", juz: 30 },
  { id: 111, name: "المسد", ayat: 5, type: "مكية", juz: 30 },
  { id: 112, name: "الإخلاص", ayat: 4, type: "مكية", juz: 30 },
  { id: 113, name: "الفلق", ayat: 5, type: "مكية", juz: 30 },
  { id: 114, name: "الناس", ayat: 6, type: "مكية", juz: 30 }
];

export const surahMap: Record<string, number> = ALL_SURAHS.reduce((acc, s) => {
  acc[s.name] = s.id;
  return acc;
}, {} as Record<string, number>);

export const getSurahById = (id: number): Surah => {
  return ALL_SURAHS.find(s => s.id === id) || ALL_SURAHS[0];
};

export const formatSurahCount = (count: number): string => {
  if (count <= 0) return 'لا توجد سور';
  if (count === 1) return 'سورة واحدة';
  if (count === 2) return 'سورتان';
  if (count >= 3 && count <= 10) return `${count} سُوَر`;
  return `${count} سورة`;
};

// Accurate mapping of the 30 Juz of the Holy Quran and their constituent Surahs
export const JUZ_DATA: JuzInfo[] = [
  {
    juz: 1,
    name: "الجزء الأول (الم)",
    ayatDescription: "الفاتحة كاملة، وسورة البقرة (١ - ١٤١)",
    surahIds: [1, 2],
    surahEntries: [
      { surahId: 1, surahName: "الفاتحة", ayatRange: "كاملة (١ - ٧)", type: "مكية", ayat: 7 },
      { surahId: 2, surahName: "البقرة", ayatRange: "الآيات ١ - ١٤١", type: "مدنية", ayat: 286 }
    ]
  },
  {
    juz: 2,
    name: "الجزء الثاني (سيقول السفهاء)",
    ayatDescription: "سورة البقرة (١٤٢ - ٢٥٢)",
    surahIds: [2],
    surahEntries: [
      { surahId: 2, surahName: "البقرة", ayatRange: "الآيات ١٤٢ - ٢٥٢", type: "مدنية", ayat: 286 }
    ]
  },
  {
    juz: 3,
    name: "الجزء الثالث (تلك الرسل)",
    ayatDescription: "سورة البقرة (٢٥٣ - ٢٨٦)، وآل عمران (١ - ٩٢)",
    surahIds: [2, 3],
    surahEntries: [
      { surahId: 2, surahName: "البقرة", ayatRange: "الآيات ٢٥٣ - ٢٨٦", type: "مدنية", ayat: 286 },
      { surahId: 3, surahName: "آل عمران", ayatRange: "الآيات ١ - ٩٢", type: "مدنية", ayat: 200 }
    ]
  },
  {
    juz: 4,
    name: "الجزء الرابع (لن تنالوا البر)",
    ayatDescription: "آل عمران (٩٣ - ٢٠٠)، والنساء (١ - ٢٣)",
    surahIds: [3, 4],
    surahEntries: [
      { surahId: 3, surahName: "آل عمران", ayatRange: "الآيات ٩٣ - ٢٠٠", type: "مدنية", ayat: 200 },
      { surahId: 4, surahName: "النساء", ayatRange: "الآيات ١ - ٢٣", type: "مدنية", ayat: 176 }
    ]
  },
  {
    juz: 5,
    name: "الجزء الخامس (والمحصنات)",
    ayatDescription: "سورة النساء (٢٤ - ١٤٧)",
    surahIds: [4],
    surahEntries: [
      { surahId: 4, surahName: "النساء", ayatRange: "الآيات ٢٤ - ١٤٧", type: "مدنية", ayat: 176 }
    ]
  },
  {
    juz: 6,
    name: "الجزء السادس (لا يحب الله)",
    ayatDescription: "النساء (١٤٨ - ١٧٦)، والمائدة (١ - ٨١)",
    surahIds: [4, 5],
    surahEntries: [
      { surahId: 4, surahName: "النساء", ayatRange: "الآيات ١٤٨ - ١٧٦", type: "مدنية", ayat: 176 },
      { surahId: 5, surahName: "المائدة", ayatRange: "الآيات ١ - ٨١", type: "مدنية", ayat: 120 }
    ]
  },
  {
    juz: 7,
    name: "الجزء السابع (وإذا سمعوا)",
    ayatDescription: "المائدة (٨٢ - ١٢٠)، والأنعام (١ - ١١٠)",
    surahIds: [5, 6],
    surahEntries: [
      { surahId: 5, surahName: "المائدة", ayatRange: "الآيات ٨٢ - ١٢٠", type: "مدنية", ayat: 120 },
      { surahId: 6, surahName: "الأنعام", ayatRange: "الآيات ١ - ١١٠", type: "مكية", ayat: 165 }
    ]
  },
  {
    juz: 8,
    name: "الجزء الثامن (ولو أننا)",
    ayatDescription: "الأنعام (١١١ - ١٦٥)، والأعراف (١ - ٨٧)",
    surahIds: [6, 7],
    surahEntries: [
      { surahId: 6, surahName: "الأنعام", ayatRange: "الآيات ١١١ - ١٦٥", type: "مكية", ayat: 165 },
      { surahId: 7, surahName: "الأعراف", ayatRange: "الآيات ١ - ٨٧", type: "مكية", ayat: 206 }
    ]
  },
  {
    juz: 9,
    name: "الجزء التاسع (قال الملأ)",
    ayatDescription: "الأعراف (٨٨ - ٢٠٦)، والأنفال (١ - ٤٠)",
    surahIds: [7, 8],
    surahEntries: [
      { surahId: 7, surahName: "الأعراف", ayatRange: "الآيات ٨٨ - ٢٠٦", type: "مكية", ayat: 206 },
      { surahId: 8, surahName: "الأنفال", ayatRange: "الآيات ١ - ٤٠", type: "مدنية", ayat: 75 }
    ]
  },
  {
    juz: 10,
    name: "الجزء العاشر (واعلموا)",
    ayatDescription: "الأنفال (٤١ - ٧٥)، والتوبة (١ - ٩٢)",
    surahIds: [8, 9],
    surahEntries: [
      { surahId: 8, surahName: "الأنفال", ayatRange: "الآيات ٤١ - ٧٥", type: "مدنية", ayat: 75 },
      { surahId: 9, surahName: "التوبة", ayatRange: "الآيات ١ - ٩٢", type: "مدنية", ayat: 129 }
    ]
  },
  {
    juz: 11,
    name: "الجزء الحادي عشر (يعتذرون)",
    ayatDescription: "التوبة (٩٣ - ١٢٩)، يونس كاملة، وهود (١ - ٥)",
    surahIds: [9, 10, 11],
    surahEntries: [
      { surahId: 9, surahName: "التوبة", ayatRange: "الآيات ٩٣ - ١٢٩", type: "مدنية", ayat: 129 },
      { surahId: 10, surahName: "يونس", ayatRange: "كاملة (١ - ١٠٩)", type: "مكية", ayat: 109 },
      { surahId: 11, surahName: "هود", ayatRange: "الآيات ١ - ٥", type: "مكية", ayat: 123 }
    ]
  },
  {
    juz: 12,
    name: "الجزء الثاني عشر (وما من دابة)",
    ayatDescription: "هود (٦ - ١٢٣)، ويوسف (١ - ٥٢)",
    surahIds: [11, 12],
    surahEntries: [
      { surahId: 11, surahName: "هود", ayatRange: "الآيات ٦ - ١٢٣", type: "مكية", ayat: 123 },
      { surahId: 12, surahName: "يوسف", ayatRange: "الآيات ١ - ٥٢", type: "مكية", ayat: 111 }
    ]
  },
  {
    juz: 13,
    name: "الجزء الثالث عشر (وما أبرئ نفسي)",
    ayatDescription: "يوسف (٥٣ - ١١١)، الرعد، وإبراهيم",
    surahIds: [12, 13, 14],
    surahEntries: [
      { surahId: 12, surahName: "يوسف", ayatRange: "الآيات ٥٣ - ١١١", type: "مكية", ayat: 111 },
      { surahId: 13, surahName: "الرعد", ayatRange: "كاملة (١ - ٤٣)", type: "مدنية", ayat: 43 },
      { surahId: 14, surahName: "إبراهيم", ayatRange: "كاملة (١ - ٥٢)", type: "مكية", ayat: 52 }
    ]
  },
  {
    juz: 14,
    name: "الجزء الرابع عشر (ربما)",
    ayatDescription: "سورتا الحجر والنحل كاملتين",
    surahIds: [15, 16],
    surahEntries: [
      { surahId: 15, surahName: "الحجر", ayatRange: "كاملة (١ - ٩٩)", type: "مكية", ayat: 99 },
      { surahId: 16, surahName: "النحل", ayatRange: "كاملة (١ - ١٢٨)", type: "مكية", ayat: 128 }
    ]
  },
  {
    juz: 15,
    name: "الجزء الخامس عشر (سبحان الذي)",
    ayatDescription: "الإسراء كاملة، والكهف (١ - ٧٤)",
    surahIds: [17, 18],
    surahEntries: [
      { surahId: 17, surahName: "الإسراء", ayatRange: "كاملة (١ - ١١١)", type: "مكية", ayat: 111 },
      { surahId: 18, surahName: "الكهف", ayatRange: "الآيات ١ - ٧٤", type: "مكية", ayat: 110 }
    ]
  },
  {
    juz: 16,
    name: "الجزء السادس عشر (قال ألم)",
    ayatDescription: "الكهف (٧٥ - ١١٠)، مريم، وطه",
    surahIds: [18, 19, 20],
    surahEntries: [
      { surahId: 18, surahName: "الكهف", ayatRange: "الآيات ٧٥ - ١١٠", type: "مكية", ayat: 110 },
      { surahId: 19, surahName: "مريم", ayatRange: "كاملة (١ - ٩٨)", type: "مكية", ayat: 98 },
      { surahId: 20, surahName: "طه", ayatRange: "كاملة (١ - ١٣٥)", type: "مكية", ayat: 135 }
    ]
  },
  {
    juz: 17,
    name: "الجزء السابع عشر (اقترب للناس)",
    ayatDescription: "سورتا الأنبياء والحج كاملتين",
    surahIds: [21, 22],
    surahEntries: [
      { surahId: 21, surahName: "الأنبياء", ayatRange: "كاملة (١ - ١١٢)", type: "مكية", ayat: 112 },
      { surahId: 22, surahName: "الحج", ayatRange: "كاملة (١ - ٧٨)", type: "مدنية", ayat: 78 }
    ]
  },
  {
    juz: 18,
    name: "الجزء الثامن عشر (قد أفلح)",
    ayatDescription: "المؤمنون، النور، والفرقان (١ - ٢٠)",
    surahIds: [23, 24, 25],
    surahEntries: [
      { surahId: 23, surahName: "المؤمنون", ayatRange: "كاملة (١ - ١١٨)", type: "مكية", ayat: 118 },
      { surahId: 24, surahName: "النور", ayatRange: "كاملة (١ - ٦٤)", type: "مدنية", ayat: 64 },
      { surahId: 25, surahName: "الفرقان", ayatRange: "الآيات ١ - ٢٠", type: "مكية", ayat: 77 }
    ]
  },
  {
    juz: 19,
    name: "الجزء التاسع عشر (وقال الذين)",
    ayatDescription: "الفرقان (٢١ - ٧٧)، الشعراء، والنمل (١ - ٥٥)",
    surahIds: [25, 26, 27],
    surahEntries: [
      { surahId: 25, surahName: "الفرقان", ayatRange: "الآيات ٢١ - ٧٧", type: "مكية", ayat: 77 },
      { surahId: 26, surahName: "الشعراء", ayatRange: "كاملة (١ - ٢٢٧)", type: "مكية", ayat: 227 },
      { surahId: 27, surahName: "النمل", ayatRange: "الآيات ١ - ٥٥", type: "مكية", ayat: 93 }
    ]
  },
  {
    juz: 20,
    name: "الجزء العشرون (فما كان جواب قومه)",
    ayatDescription: "النمل (٥٦ - ٩٣)، القصص، والعنكبوت (١ - ٤٥)",
    surahIds: [27, 28, 29],
    surahEntries: [
      { surahId: 27, surahName: "النمل", ayatRange: "الآيات ٥٦ - ٩٣", type: "مكية", ayat: 93 },
      { surahId: 28, surahName: "القصص", ayatRange: "كاملة (١ - ٨٨)", type: "مكية", ayat: 88 },
      { surahId: 29, surahName: "العنكبوت", ayatRange: "الآيات ١ - ٤٥", type: "مكية", ayat: 69 }
    ]
  },
  {
    juz: 21,
    name: "الجزء الحادي والعشرون (ولا تجادلوا)",
    ayatDescription: "العنكبوت (٤٦ - ٦٩)، الروم، لقمان، السجدة، والأحزاب (١ - ٣٠)",
    surahIds: [29, 30, 31, 32, 33],
    surahEntries: [
      { surahId: 29, surahName: "العنكبوت", ayatRange: "الآيات ٤٦ - ٦٩", type: "مكية", ayat: 69 },
      { surahId: 30, surahName: "الروم", ayatRange: "كاملة (١ - ٦٠)", type: "مكية", ayat: 60 },
      { surahId: 31, surahName: "لقمان", ayatRange: "كاملة (١ - ٣٤)", type: "مكية", ayat: 34 },
      { surahId: 32, surahName: "السجدة", ayatRange: "كاملة (١ - ٣٠)", type: "مكية", ayat: 30 },
      { surahId: 33, surahName: "الأحزاب", ayatRange: "الآيات ١ - ٣٠", type: "مدنية", ayat: 73 }
    ]
  },
  {
    juz: 22,
    name: "الجزء الثاني والعشرون (ومن يقنت)",
    ayatDescription: "الأحزاب (٣١ - ٧٣)، سبأ، فاطر، ويس (١ - ٢٧)",
    surahIds: [33, 34, 35, 36],
    surahEntries: [
      { surahId: 33, surahName: "الأحزاب", ayatRange: "الآيات ٣١ - ٧٣", type: "مدنية", ayat: 73 },
      { surahId: 34, surahName: "سبأ", ayatRange: "كاملة (١ - ٥٤)", type: "مكية", ayat: 54 },
      { surahId: 35, surahName: "فاطر", ayatRange: "كاملة (١ - ٤٥)", type: "مكية", ayat: 45 },
      { surahId: 36, surahName: "يس", ayatRange: "الآيات ١ - ٢٧", type: "مكية", ayat: 83 }
    ]
  },
  {
    juz: 23,
    name: "الجزء الثالث والعشرون (وما أنزلنا)",
    ayatDescription: "يس (٢٨ - ٨٣)، الصافات، ص، والزمر (١ - ٣١)",
    surahIds: [36, 37, 38, 39],
    surahEntries: [
      { surahId: 36, surahName: "يس", ayatRange: "الآيات ٢٨ - ٨٣", type: "مكية", ayat: 83 },
      { surahId: 37, surahName: "الصافات", ayatRange: "كاملة (١ - ١٨٢)", type: "مكية", ayat: 182 },
      { surahId: 38, surahName: "ص", ayatRange: "كاملة (١ - ٨٨)", type: "مكية", ayat: 88 },
      { surahId: 39, surahName: "الزمر", ayatRange: "الآيات ١ - ٣١", type: "مكية", ayat: 75 }
    ]
  },
  {
    juz: 24,
    name: "الجزء الرابع والعشرون (فمن أظلم)",
    ayatDescription: "الزمر (٣٢ - ٧٥)، غافر، وفصلت (١ - ٤٦)",
    surahIds: [39, 40, 41],
    surahEntries: [
      { surahId: 39, surahName: "الزمر", ayatRange: "الآيات ٣٢ - ٧٥", type: "مكية", ayat: 75 },
      { surahId: 40, surahName: "غافر", ayatRange: "كاملة (١ - ٨٥)", type: "مكية", ayat: 85 },
      { surahId: 41, surahName: "فصلت", ayatRange: "الآيات ١ - ٤٦", type: "مكية", ayat: 54 }
    ]
  },
  {
    juz: 25,
    name: "الجزء الخامس والعشرون (إليه يرد)",
    ayatDescription: "فصلت (٤٧ - ٥٤)، الشورى، الزخرف، الدخان، والجاثية",
    surahIds: [41, 42, 43, 44, 45],
    surahEntries: [
      { surahId: 41, surahName: "فصلت", ayatRange: "الآيات ٤٧ - ٥٤", type: "مكية", ayat: 54 },
      { surahId: 42, surahName: "الشورى", ayatRange: "كاملة (١ - ٥٣)", type: "مكية", ayat: 53 },
      { surahId: 43, surahName: "الزخرف", ayatRange: "كاملة (١ - ٨٩)", type: "مكية", ayat: 89 },
      { surahId: 44, surahName: "الدخان", ayatRange: "كاملة (١ - ٥٩)", type: "مكية", ayat: 59 },
      { surahId: 45, surahName: "الجاثية", ayatRange: "كاملة (١ - ٣٧)", type: "مكية", ayat: 37 }
    ]
  },
  {
    juz: 26,
    name: "الجزء السادس والعشرون (حم)",
    ayatDescription: "الأحقاف، محمد، الفتح، الحجرات، ق، والذاريات (١ - ٣٠)",
    surahIds: [46, 47, 48, 49, 50, 51],
    surahEntries: [
      { surahId: 46, surahName: "الأحقاف", ayatRange: "كاملة (١ - ٣٥)", type: "مكية", ayat: 35 },
      { surahId: 47, surahName: "محمد", ayatRange: "كاملة (١ - ٣٨)", type: "مدنية", ayat: 38 },
      { surahId: 48, surahName: "الفتح", ayatRange: "كاملة (١ - ٢٩)", type: "مدنية", ayat: 29 },
      { surahId: 49, surahName: "الحجرات", ayatRange: "كاملة (١ - ١٨)", type: "مدنية", ayat: 18 },
      { surahId: 50, surahName: "ق", ayatRange: "كاملة (١ - ٤٥)", type: "مكية", ayat: 45 },
      { surahId: 51, surahName: "الذاريات", ayatRange: "الآيات ١ - ٣٠", type: "مكية", ayat: 60 }
    ]
  },
  {
    juz: 27,
    name: "الجزء السابع والعشرون (قال فما خطبكم)",
    ayatDescription: "الذاريات (٣١ - ٦٠)، الطور، النجم، القمر، الرحمن، الواقعة، والحديد",
    surahIds: [51, 52, 53, 54, 55, 56, 57],
    surahEntries: [
      { surahId: 51, surahName: "الذاريات", ayatRange: "الآيات ٣١ - ٦٠", type: "مكية", ayat: 60 },
      { surahId: 52, surahName: "الطور", ayatRange: "كاملة (١ - ٤٩)", type: "مكية", ayat: 49 },
      { surahId: 53, surahName: "النجم", ayatRange: "كاملة (١ - ٦٢)", type: "مكية", ayat: 62 },
      { surahId: 54, surahName: "القمر", ayatRange: "كاملة (١ - ٥٥)", type: "مكية", ayat: 55 },
      { surahId: 55, surahName: "الرحمن", ayatRange: "كاملة (١ - ٧٨)", type: "مدنية", ayat: 78 },
      { surahId: 56, surahName: "الواقعة", ayatRange: "كاملة (١ - ٩٦)", type: "مكية", ayat: 96 },
      { surahId: 57, surahName: "الحديد", ayatRange: "كاملة (١ - ٢٩)", type: "مدنية", ayat: 29 }
    ]
  },
  {
    juz: 28,
    name: "الجزء الثامن والعشرون (قد سمع)",
    ayatDescription: "المجادلة، الحشر، الممتحنة، الصف، الجمعة، المنافقون، التغابن، الطلاق، والتحريم",
    surahIds: [58, 59, 60, 61, 62, 63, 64, 65, 66],
    surahEntries: [
      { surahId: 58, surahName: "المجادلة", ayatRange: "كاملة (١ - ٢٢)", type: "مدنية", ayat: 22 },
      { surahId: 59, surahName: "الحشر", ayatRange: "كاملة (١ - ٢٤)", type: "مدنية", ayat: 24 },
      { surahId: 60, surahName: "الممتحنة", ayatRange: "كاملة (١ - ١٣)", type: "مدنية", ayat: 13 },
      { surahId: 61, surahName: "الصف", ayatRange: "كاملة (١ - ١٤)", type: "مدنية", ayat: 14 },
      { surahId: 62, surahName: "الجمعة", ayatRange: "كاملة (١ - ١١)", type: "مدنية", ayat: 11 },
      { surahId: 63, surahName: "المنافقون", ayatRange: "كاملة (١ - ١١)", type: "مدنية", ayat: 11 },
      { surahId: 64, surahName: "التغابن", ayatRange: "كاملة (١ - ١٨)", type: "مدنية", ayat: 18 },
      { surahId: 65, surahName: "الطلاق", ayatRange: "كاملة (١ - ١٢)", type: "مدنية", ayat: 12 },
      { surahId: 66, surahName: "التحريم", ayatRange: "كاملة (١ - ١٢)", type: "مدنية", ayat: 12 }
    ]
  },
  {
    juz: 29,
    name: "الجزء التاسع والعشرون (تبارك)",
    ayatDescription: "الملك، القلم، الحاقة، المعارج، نوح، الجن، المزمل، المدثر، القيامة، الإنسان، والمرسلات",
    surahIds: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77],
    surahEntries: [
      { surahId: 67, surahName: "الملك", ayatRange: "كاملة (١ - ٣٠)", type: "مكية", ayat: 30 },
      { surahId: 68, surahName: "القلم", ayatRange: "كاملة (١ - ٥٢)", type: "مكية", ayat: 52 },
      { surahId: 69, surahName: "الحاقة", ayatRange: "كاملة (١ - ٥٢)", type: "مكية", ayat: 52 },
      { surahId: 70, surahName: "المعارج", ayatRange: "كاملة (١ - ٤٤)", type: "مكية", ayat: 44 },
      { surahId: 71, surahName: "نوح", ayatRange: "كاملة (١ - ٢٨)", type: "مكية", ayat: 28 },
      { surahId: 72, surahName: "الجن", ayatRange: "كاملة (١ - ٢٨)", type: "مكية", ayat: 28 },
      { surahId: 73, surahName: "المزمل", ayatRange: "كاملة (١ - ٢٠)", type: "مكية", ayat: 20 },
      { surahId: 74, surahName: "المدثر", ayatRange: "كاملة (١ - ٥٦)", type: "مكية", ayat: 56 },
      { surahId: 75, surahName: "القيامة", ayatRange: "كاملة (١ - ٤٠)", type: "مكية", ayat: 40 },
      { surahId: 76, surahName: "الإنسان", ayatRange: "كاملة (١ - ٣١)", type: "مدنية", ayat: 31 },
      { surahId: 77, surahName: "المرسلات", ayatRange: "كاملة (١ - ٥٠)", type: "مكية", ayat: 50 }
    ]
  },
  {
    juz: 30,
    name: "الجزء الثلاثون (عم يتساءلون)",
    ayatDescription: "من سورة النبأ (٧٨) حتى سورة الناس (١١٤) - ٣٧ سورة",
    surahIds: Array.from({ length: 37 }, (_, i) => 78 + i),
    surahEntries: Array.from({ length: 37 }, (_, i) => {
      const s = ALL_SURAHS.find(sur => sur.id === 78 + i);
      return {
        surahId: 78 + i,
        surahName: s ? s.name : '',
        ayatRange: `كاملة (١ - ${s ? s.ayat : ''})`,
        type: s ? s.type : 'مكية',
        ayat: s ? s.ayat : 0
      };
    })
  }
];

// Automatically populate each Surah with its complete list of Ajza and text representation
ALL_SURAHS.forEach(surah => {
  const matchedAjza = JUZ_DATA.filter(j => j.surahIds.includes(surah.id)).map(j => j.juz);
  surah.juzList = matchedAjza.length > 0 ? matchedAjza : [surah.juz];
  if (surah.juzList.length === 1) {
    surah.juzText = `الجزء ${surah.juzList[0]}`;
  } else {
    surah.juzText = `الأجزاء ${surah.juzList[0]} - ${surah.juzList[surah.juzList.length - 1]}`;
  }
});

// Official Al-Azhar Curriculum for Preparatory & Secondary stages (المرحلة الإعدادية والثانوية بنين)
export const CURRICULUM_DATA: Curriculum = {
  [Grade.PREP_1]: {
    term1: [getSurahById(11), getSurahById(10)], // هود ويونس
    term1Note: "من سورة هود إلى سورة يونس",
    term2: [getSurahById(9), getSurahById(8)],   // التوبة والأنفال
    term2Note: "من سورة التوبة إلى سورة الأنفال",
    revisionNote: "مراجعة من سورة يوسف حتى سورة الناس (منهج الابتدائية المقرّر تثبيته)",
    revisionSurahs: ALL_SURAHS.filter(s => s.id >= 12 && s.id <= 114)
  },
  [Grade.PREP_2]: {
    term1: [getSurahById(7)], // الأعراف
    term1Note: "سورة الأعراف",
    term2: [getSurahById(6)], // الأنعام
    term2Note: "سورة الأنعام",
    revisionNote: "مراجعة من سورة الأنفال حتى سورة الناس",
    revisionSurahs: ALL_SURAHS.filter(s => s.id >= 8 && s.id <= 114)
  },
  [Grade.PREP_3]: {
    term1: [getSurahById(5)], // المائدة (من البداية حتى الآية 66)
    term1Note: "من بداية سورة المائدة حتى الآية 66",
    term2: [getSurahById(5), getSurahById(4)], // بقية المائدة (من 67) إلى النساء (حتى الآية 23)
    term2Note: "بقية سورة المائدة (من الآية 67) إلى سورة النساء (حتى الآية 23)",
    revisionNote: "مراجعة من سورة الأنعام حتى سورة الناس",
    revisionSurahs: ALL_SURAHS.filter(s => s.id >= 6 && s.id <= 114)
  },
  [Grade.SEC_1]: {
    term1: [getSurahById(4)],
    term1Note: "من سورة النساء (الآية 24) إلى النساء (الآية 147)",
    term2: [getSurahById(4), getSurahById(3)],
    term2Note: "من سورة النساء (الآية 148) إلى سورة آل عمران (الآية 92)",
    revisionNote: "مراجعة شاملة من سورة المائدة حتى سورة الناس",
    revisionSurahs: ALL_SURAHS.filter(s => s.id >= 5 && s.id <= 114)
  },
  [Grade.SEC_2]: {
    term1: [getSurahById(3)],
    term1Note: "من سورة آل عمران (الآية 93) إلى آخر سورة آل عمران",
    term2: [getSurahById(2)],
    term2Note: "من بداية سورة البقرة (الآية 1) إلى الآية 105 من سورة البقرة",
    revisionNote: "مراجعة من سورة النساء حتى سورة الناس",
    revisionSurahs: ALL_SURAHS.filter(s => s.id >= 4 && s.id <= 114)
  },
  [Grade.SEC_3]: {
    term1: [getSurahById(2)],
    term1Note: "من سورة البقرة (الآية 106) إلى نهاية سورة البقرة (الآية 286) - المقرر للعام كاملاً",
    term2: [getSurahById(2), getSurahById(1)],
    term2Note: "تثبيت ومراجعة المصحف كاملاً حِفظاً وتلاوةً",
    revisionNote: "مراجعة المصحف كاملاً (من سورة آل عمران حتى سورة الناس)، حيث يكون الامتحان في القرآن الكريم كاملاً حِفظاً وتلاوةً",
    revisionSurahs: ALL_SURAHS.filter(s => s.id >= 3 && s.id <= 114)
  }
};
