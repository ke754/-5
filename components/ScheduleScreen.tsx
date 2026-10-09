import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, AlertCircle, CalendarRange, Layers, Loader2, Info, Timer, CalendarDays, ArrowLeftRight, CheckCircle, ChevronDown, Printer } from 'lucide-react';
import { Grade, ClassSession, ExamEntry } from '../types';
import { supabase } from '../constants';

// Official Al-Azhar Preparatory Stage Exams (المرحلة الإعدادية بنين)
const OFFICIAL_EXAMS_PREP: ExamEntry[] = [
  { date: 'السبت 2026/1/10', subject: 'الفقه (الحنفي / الشافعي / المالكي)', duration: 'ساعتان', timeFrom: '9:00', timeTo: '11:00' },
  { date: 'السبت 2026/1/10', subject: 'اللغة العربية ورقة أولى (النحو والصرف)', duration: 'ساعة ونصف', timeFrom: '11:30', timeTo: '1:00' },
  { date: 'الأحد 2026/1/11', subject: 'أصول الدين ورقة أولى (التفسير والحديث)', duration: 'ساعتان', timeFrom: '9:00', timeTo: '11:00' },
  { date: 'الأحد 2026/1/11', subject: 'العلوم', duration: 'ساعة ونصف', timeFrom: '11:30', timeTo: '1:00' },
  { date: 'الإثنين 2026/1/12', subject: 'اللغة العربية ورقة ثانية (المطالعة والنصوص والإملاء)', duration: 'ساعتان', timeFrom: '9:00', timeTo: '11:00' },
  { date: 'الإثنين 2026/1/12', subject: 'الهندسة والقياس', duration: 'ساعة ونصف', timeFrom: '11:30', timeTo: '1:00' },
  { date: 'الثلاثاء 2026/1/13', subject: 'أصول الدين ورقة ثانية (التوحيد والسيرة النبوية)', duration: 'ساعتان', timeFrom: '9:00', timeTo: '11:00' },
  { date: 'الثلاثاء 2026/1/13', subject: 'الدراسات الاجتماعية', duration: 'ساعة ونصف', timeFrom: '11:30', timeTo: '1:00' },
  { date: 'الأربعاء 2026/1/14', subject: 'القرآن الكريم وتجويده (تحريري وشفهي)', duration: 'ساعتان', timeFrom: '9:00', timeTo: '11:00' },
  { date: 'الأربعاء 2026/1/14', subject: 'الحاسب الآلي وتكنولوجيا المعلومات', duration: 'ساعة ونصف', timeFrom: '11:30', timeTo: '1:00' },
  { date: 'الخميس 2026/1/15', subject: 'اللغة الإنجليزية', duration: 'ساعتان', timeFrom: '9:00', timeTo: '11:00' },
  { date: 'الخميس 2026/1/15', subject: 'الجبر والإحصاء', duration: 'ساعة ونصف', timeFrom: '11:30', timeTo: '1:00' },
];

// Official Al-Azhar Secondary Stage Exams (المرحلة الثانوية بنين)
const OFFICIAL_EXAMS_SEC: ExamEntry[] = [
  { date: 'السبت 2026/1/10', subject: 'الفقه والقرآن الكريم', duration: 'ساعتان ونصف', timeFrom: '9:00', timeTo: '11:30' },
  { date: 'الأحد 2026/1/11', subject: 'الحديث الشريف وعلومه', duration: 'ساعتان', timeFrom: '9:00', timeTo: '11:00' },
  { date: 'الأحد 2026/1/11', subject: 'النحو', duration: 'ساعتان', timeFrom: '11:30', timeTo: '1:30' },
  { date: 'الإثنين 2026/1/12', subject: 'التفسير وعلومه', duration: 'ساعتان', timeFrom: '9:00', timeTo: '11:00' },
  { date: 'الإثنين 2026/1/12', subject: 'الصرف', duration: 'ساعتان', timeFrom: '11:30', timeTo: '1:30' },
  { date: 'الثلاثاء 2026/1/13', subject: 'التوحيد', duration: 'ساعتان', timeFrom: '9:00', timeTo: '11:00' },
  { date: 'الثلاثاء 2026/1/13', subject: 'البلاغة', duration: 'ساعتان', timeFrom: '11:30', timeTo: '1:30' },
  { date: 'الأربعاء 2026/1/14', subject: 'الأدب والنصوص والمطالعة', duration: 'ساعتان', timeFrom: '9:00', timeTo: '11:00' },
  { date: 'الأربعاء 2026/1/14', subject: 'اللغة الأجنبية الأولى', duration: 'ساعتان ونصف', timeFrom: '11:30', timeTo: '2:00' },
  { date: 'الخميس 2026/1/15', subject: 'الرياضيات / الفيزياء / التاريخ', duration: 'ساعتان ونصف', timeFrom: '9:00', timeTo: '11:30' },
  { date: 'السبت 2026/1/17', subject: 'الكيمياء / الجغرافيا / الفلسفة والمنطق', duration: 'ساعتان ونصف', timeFrom: '9:00', timeTo: '11:30' },
];

const ScheduleScreen: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<Grade>(Grade.PREP_1);
  const [scheduleType, setScheduleType] = useState<'exams' | 'classes'>('exams');
  const [schedules, setSchedules] = useState<Record<string, { classes: ClassSession[], exams: ExamEntry[] }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSchedules(); }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('schedules').select('*');
      if (error) throw error;
      const map: any = {};
      data?.forEach(row => { map[row.grade] = { classes: row.classes, exams: row.exams }; });
      setSchedules(map);
    } catch (e) {
      console.error(e);
    } finally { 
      setLoading(false); 
    }
  };

  const isSec = selectedGrade.includes('الثانوي');
  const currentExams = schedules[selectedGrade]?.exams?.length > 0 
    ? schedules[selectedGrade].exams 
    : (isSec ? OFFICIAL_EXAMS_SEC : OFFICIAL_EXAMS_PREP);

  const groupedExams = currentExams.reduce((acc: any, exam) => {
    if (!acc[exam.date]) acc[exam.date] = [];
    acc[exam.date].push(exam);
    return acc;
  }, {});

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-16 animate-in fade-in duration-500">
      {/* Decorative Heading */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100/70 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
          <span>المرحلتان الإعدادية والثانوية (بنين)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-amiri font-bold text-emerald-950">
          جداول معهد محمد صديق المنشاوي الأزهري
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto rounded-full"></div>
        <p className="text-slate-500 font-medium text-xs sm:text-sm">
          جداول الحصص والامتحانات المعتمدة لطلاب الإعدادي والثانوي بمنطقة سوهاج الأزهرية
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white p-4 sm:p-8 md:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-emerald-100 relative overflow-hidden">
        
        {/* Controls */}
        <div className="space-y-5 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Tab Selector Pill */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200/50 w-full sm:w-auto">
              <button 
                onClick={() => setScheduleType('exams')} 
                className={`flex-1 sm:flex-none px-5 sm:px-8 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 ${scheduleType === 'exams' ? 'bg-gradient-to-l from-emerald-950 to-emerald-900 text-white shadow-md' : 'text-slate-500 hover:text-emerald-900'}`}
              >
                <CalendarRange size={14} className={scheduleType === 'exams' ? 'text-amber-400' : ''} />
                <span>جدول الامتحانات الرسمية</span>
              </button>
              <button 
                onClick={() => setScheduleType('classes')} 
                className={`flex-1 sm:flex-none px-5 sm:px-8 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 ${scheduleType === 'classes' ? 'bg-gradient-to-l from-emerald-950 to-emerald-900 text-white shadow-md' : 'text-slate-500 hover:text-emerald-900'}`}
              >
                <Layers size={14} className={scheduleType === 'classes' ? 'text-amber-400' : ''} />
                <span>جدول الحصص الأسبوعي</span>
              </button>
            </div>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-bold border border-slate-200 transition-colors"
              title="طباعة الجدول"
            >
              <Printer size={15} />
              <span>طباعة الجدول</span>
            </button>
          </div>

          {/* Grade Selector Pills */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">اختر الصف الدراسي (إعدادي / ثانوي):</span>
            <div className="flex flex-wrap gap-2 justify-center max-w-4xl">
              {Object.values(Grade).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs transition-all border ${selectedGrade === g ? 'bg-gradient-to-l from-emerald-950 to-emerald-900 text-amber-300 border-amber-500/60 shadow-md scale-105' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-900'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-emerald-900">
              <Loader2 className="animate-spin mb-3 text-emerald-850" size={36}/>
              <p className="text-xs font-bold text-emerald-900/70">جاري تحميل الجداول الرسمية المعتمدة...</p>
           </div>
        ) : (
          <div className="space-y-6">
            {scheduleType === 'classes' ? (
              <div>
                {/* Desktop Table View */}
                <div className="hidden md:block rounded-3xl border border-emerald-100 overflow-hidden shadow-sm bg-slate-50/20">
                  <table className="w-full text-center text-xs md:text-sm">
                    <thead className="bg-gradient-to-l from-emerald-950 to-emerald-900 text-white font-bold border-b border-emerald-800">
                      <tr>
                        <th className="p-4 border-r border-emerald-800 font-amiri text-sm md:text-base">اليوم</th>
                        <th className="p-4 border-r border-emerald-800">الحصة الأولى</th>
                        <th className="p-4 border-r border-emerald-800">الحصة الثانية</th>
                        <th className="p-4 border-r border-emerald-800">الحصة الثالثة</th>
                        <th className="p-4 border-r border-emerald-800">الحصة الرابعة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(schedules[selectedGrade]?.classes || [
                        { day: 'السبت', p1: 'قرآن كريم وتجويد', p2: 'فقه إسلامي', p3: 'لغة عربية (نحو)', p4: 'لغة إنجليزية' },
                        { day: 'الأحد', p1: 'أصول دين (تفسير)', p2: 'رياضيات', p3: 'علوم', p4: 'دراسات اجتماعية' },
                        { day: 'الإثنين', p1: 'أصول دين (حديث)', p2: 'لغة عربية (صرف)', p3: 'قرآن كريم', p4: 'حاسب آلي' },
                        { day: 'الثلاثاء', p1: 'أصول دين (توحيد وسيرة)', p2: 'لغة عربية (مطالعة ونصوص)', p3: 'رياضيات', p4: 'تربية بدنية' },
                        { day: 'الأربعاء', p1: 'فقه إسلامي', p2: 'علوم', p3: 'لغة إنجليزية', p4: 'فنون كتابة وإملاء' },
                        { day: 'الخميس', p1: 'قرآن كريم (تسميع ومراجعة)', p2: 'دراسات اجتماعية', p3: 'رياضيات', p4: 'نشاط أزهري وثقافي' },
                      ]).map((row, idx) => (
                        <tr key={idx} className={`hover:bg-emerald-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfa]'}`}>
                          <td className="p-4 border-l border-b border-slate-100 font-bold font-amiri text-emerald-950 bg-emerald-50/40 text-sm">{row.day}</td>
                          <td className="p-4 border-r border-b border-slate-100 font-semibold">{row.p1 || '-'}</td>
                          <td className="p-4 border-r border-b border-slate-100 font-semibold">{row.p2 || '-'}</td>
                          <td className="p-4 border-r border-b border-slate-100 font-semibold">{row.p3 || '-'}</td>
                          <td className="p-4 border-r border-b border-slate-100 font-semibold">{row.p4 || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Responsive Cards View */}
                <div className="md:hidden space-y-4">
                  {(schedules[selectedGrade]?.classes || [
                    { day: 'السبت', p1: 'قرآن كريم وتجويد', p2: 'فقه إسلامي', p3: 'لغة عربية (نحو)', p4: 'لغة إنجليزية' },
                    { day: 'الأحد', p1: 'أصول دين (تفسير)', p2: 'رياضيات', p3: 'علوم', p4: 'دراسات اجتماعية' },
                    { day: 'الإثنين', p1: 'أصول دين (حديث)', p2: 'لغة عربية (صرف)', p3: 'قرآن كريم', p4: 'حاسب آلي' },
                    { day: 'الثلاثاء', p1: 'أصول دين (توحيد وسيرة)', p2: 'لغة عربية (مطالعة ونصوص)', p3: 'رياضيات', p4: 'تربية بدنية' },
                    { day: 'الأربعاء', p1: 'فقه إسلامي', p2: 'علوم', p3: 'لغة إنجليزية', p4: 'فنون كتابة وإملاء' },
                    { day: 'الخميس', p1: 'قرآن كريم (تسميع ومراجعة)', p2: 'دراسات اجتماعية', p3: 'رياضيات', p4: 'نشاط أزهري وثقافي' },
                  ]).map((row, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-amiri font-bold text-base text-emerald-950">{row.day}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">٤ حصص</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-bold">الحصة الأولى:</span>
                          <span className="font-semibold text-emerald-950">{row.p1 || '-'}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-bold">الحصة الثانية:</span>
                          <span className="font-semibold text-emerald-950">{row.p2 || '-'}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-bold">الحصة الثالثة:</span>
                          <span className="font-semibold text-emerald-950">{row.p3 || '-'}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-bold">الحصة الرابعة:</span>
                          <span className="font-semibold text-emerald-950">{row.p4 || '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {Object.keys(groupedExams).length === 0 ? (
                  <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 font-medium text-xs sm:text-sm">
                     لا توجد بيانات امتحانات مسجلة لهذا الصف حالياً.
                  </div>
                ) : Object.keys(groupedExams).map((date, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    {/* Date Header */}
                    <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/20">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-emerald-800/80 p-2 rounded-xl border border-emerald-700/60 text-amber-300">
                          <CalendarDays size={18} />
                        </div>
                        <span className="font-bold text-sm sm:text-base font-amiri tracking-wide text-white">{date}</span>
                      </div>
                      <div className="text-[10px] font-bold bg-amber-400 text-emerald-950 px-3 py-1 rounded-full border border-amber-300">
                        لجان المواد
                      </div>
                    </div>
                    
                    {/* Subjects Grid */}
                    <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/20">
                      {groupedExams[date].map((exam: any, subIdx: number) => (
                        <div key={subIdx} className="bg-white p-4 rounded-2xl border border-slate-200/70 hover:border-emerald-300 shadow-sm flex flex-col gap-3 relative overflow-hidden transition-all">
                          <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-800"></div>
                          
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-emerald-950 font-amiri text-sm sm:text-base leading-snug">{exam.subject}</h4>
                            <div className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 shrink-0">
                              <Timer size={11} className="text-amber-600" /> 
                              <span>{exam.duration}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1 text-emerald-800">
                               <Clock size={13} className="text-emerald-600" />
                               <span>من: <span className="text-emerald-950 font-sans font-bold">{exam.timeFrom}</span></span>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-800">
                               <ArrowLeftRight size={13} className="text-emerald-600 rotate-90" />
                               <span>إلى: <span className="text-emerald-950 font-sans font-bold">{exam.timeTo}</span></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Info Box */}
        <div className="mt-10 bg-amber-50/40 p-5 sm:p-7 rounded-3xl border border-amber-500/20 flex flex-col md:flex-row gap-5 items-start relative overflow-hidden">
           <div className="absolute top-0 right-0 h-1 bg-amber-400 left-0"></div>
           <div className="bg-amber-400 p-3.5 rounded-2xl text-emerald-950 shadow shrink-0"><Info size={24} /></div>
           <div className="space-y-3 flex-1">
              <h4 className="text-base font-bold text-amber-950 font-amiri">تعليمات وضوابط الامتحانات للطلاب بمعهد محمد صديق المنشاوي (إعدادي وثانوي بنين):</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                <li className="flex items-start gap-2 text-xs font-bold text-amber-950 leading-relaxed">
                   <CheckCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                   <span>الحضور المبكر والاصطفاف بفناء المعهد قبل بدء لجان الامتحانات بـ ٢٠ دقيقة.</span>
                </li>
                <li className="flex items-start gap-2 text-xs font-bold text-amber-950 leading-relaxed">
                   <CheckCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                   <span>يُمنع منعاً باتاً دخول الطلاب بالهواتف المحمولة أو السماعات الذكية داخل اللجان.</span>
                </li>
                <li className="flex items-start gap-2 text-xs font-bold text-amber-950 leading-relaxed">
                   <CheckCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                   <span>الالتزام بالزي الأزهري اللائق والانضباط السلوكي التام طوال فترة الامتحانات.</span>
                </li>
                <li className="flex items-start gap-2 text-xs font-bold text-amber-950 leading-relaxed">
                   <CheckCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                   <span>امتحان القرآن الكريم الشفهي يُجرى أمام اللجان المعتمدة وفق جدول التسميع الأزهري.</span>
                </li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleScreen;
