import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Calendar, Clock, Code, Sparkles, MapPin, ShieldCheck, 
  Heart, Terminal, Cpu, Quote, ExternalLink, Award, BookOpen, 
  Volume2, Bell, BellRing, BellOff, Play, Square, AlertTriangle, 
  CheckCircle, Radio, Cloud, Server, Database
} from 'lucide-react';

const AboutScreen: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [alarmEnabled, setAlarmEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('minshawi_assembly_alarm');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [isPlayingAlarm, setIsPlayingAlarm] = useState(false);
  const [alarmTriggeredTime, setAlarmTriggeredTime] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isStoppingRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save alarm preference
  const toggleAlarm = () => {
    const nextState = !alarmEnabled;
    setAlarmEnabled(nextState);
    try {
      localStorage.setItem('minshawi_assembly_alarm', String(nextState));
    } catch (e) {
      console.warn(e);
    }
    // If turning on, request notification permission if supported
    if (nextState && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  // Web Audio API School Bell / Azhari Morning Chime Generator
  const playChimeTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      setIsPlayingAlarm(true);
      isStoppingRef.current = false;

      // Realistic Westminster / Azhari School Chime Notes (E5, C5, D5, G4 - G4, D5, E5, C5)
      const notes = [
        { freq: 659.25, time: 0.0, dur: 0.65 }, // E5
        { freq: 523.25, time: 0.5, dur: 0.65 }, // C5
        { freq: 587.33, time: 1.0, dur: 0.65 }, // D5
        { freq: 392.00, time: 1.5, dur: 1.10 }, // G4
        // Second chime phrase
        { freq: 392.00, time: 2.8, dur: 0.65 }, // G4
        { freq: 587.33, time: 3.3, dur: 0.65 }, // D5
        { freq: 659.25, time: 3.8, dur: 0.65 }, // E5
        { freq: 523.25, time: 4.3, dur: 1.30 }, // C5
      ];

      notes.forEach(({ freq, time: noteTime, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Bell chime tone (sine with overtone harmonics)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + noteTime);

        // Bell strike amplitude envelope
        gain.gain.setValueAtTime(0.001, ctx.currentTime + noteTime);
        gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + noteTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + noteTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + noteTime);
        osc.stop(ctx.currentTime + noteTime + dur + 0.1);
      });

      // Reset playing status after notes finish
      setTimeout(() => {
        if (!isStoppingRef.current) {
          setIsPlayingAlarm(false);
        }
      }, 5800);
    } catch (e) {
      console.warn('Audio playback error', e);
      setIsPlayingAlarm(false);
    }
  };

  const stopAlarmSound = () => {
    isStoppingRef.current = true;
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    setIsPlayingAlarm(false);
  };

  // Calculate Cairo Time & Morning Assembly Schedule (7:45 AM)
  const cairoTime = time.toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo' });
  const cairoDate = time.toLocaleDateString('ar-EG', { 
    timeZone: 'Africa/Cairo', 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Calculate countdown to 7:45 AM (Cairo Time)
  const cairoDateObj = new Date(time.toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
  const cairoHours = cairoDateObj.getHours();
  const cairoMins = cairoDateObj.getMinutes();
  const cairoSecs = cairoDateObj.getSeconds();

  let targetAssembly = new Date(cairoDateObj);
  targetAssembly.setHours(7, 45, 0, 0);

  // If currently past 7:45 AM today, the next assembly is tomorrow at 7:45 AM
  if (cairoDateObj.getTime() >= targetAssembly.getTime()) {
    targetAssembly.setDate(targetAssembly.getDate() + 1);
  }

  const diffMs = targetAssembly.getTime() - cairoDateObj.getTime();
  const diffTotalSec = Math.max(0, Math.floor(diffMs / 1000));
  const hoursLeft = Math.floor(diffTotalSec / 3600);
  const minsLeft = Math.floor((diffTotalSec % 3600) / 60);
  const secsLeft = diffTotalSec % 60;

  // Status conditions
  const currentTotalMins = cairoHours * 60 + cairoMins;
  const isAssemblyNow = currentTotalMins >= (7 * 60 + 45) && currentTotalMins < (8 * 60 + 15);

  // Check alarm trigger condition at 7:45:00 AM Cairo Time
  useEffect(() => {
    if (alarmEnabled && cairoHours === 7 && cairoMins === 45 && cairoSecs === 0) {
      const todayKey = `${cairoDateObj.getFullYear()}-${cairoDateObj.getMonth()}-${cairoDateObj.getDate()}`;
      if (alarmTriggeredTime !== todayKey) {
        setAlarmTriggeredTime(todayKey);
        playChimeTone();
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('طابور معهد محمد صديق المنشاوي الأزهري', {
              body: 'الساعة الآن 7:45 صباحاً! يبدأ الطابور المدرسي الآن وغير مسموح بالدخول بعده إطلاقاً.',
              icon: '/favicon.ico'
            });
          } catch {}
        }
      }
    }
  }, [cairoHours, cairoMins, cairoSecs, alarmEnabled, alarmTriggeredTime]);

  return (
    <div className="space-y-10 sm:space-y-12 pb-16 animate-in fade-in duration-500">
      {/* Royal Page Header */}
      <div className="text-center space-y-2.5">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block font-sans">التوثيق والهوية الأزهرية</span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-amiri font-bold text-emerald-950">
          عن معهد محمد صديق المنشاوي الإعدادي الثانوي (بنين)
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto rounded-full"></div>
        <p className="text-slate-500 font-medium text-xs sm:text-sm">
          تاريخ المعهد ورسالته التعليمية لطلاب المرحلتين الإعدادية والثانوية الأزهرية بنين
        </p>
      </div>

      {/* Sheikh Mohamed Siddiq El-Minshawi Memorial Banner */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-amber-500/25 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#eab308_0.05rem,transparent_0.05rem)] [background-size:2rem_2rem] opacity-5 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-400 text-emerald-950 rounded-3xl flex items-center justify-center shrink-0 shadow-lg border border-amber-300">
            <Volume2 size={36} />
          </div>
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 text-amber-300 text-[10px] font-bold bg-white/10 px-3 py-1 rounded-full">
              <Sparkles size={11} className="text-amber-400" />
              <span>فخر سوهاج ومدينة المنشأة</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-amiri text-amber-300">
              لماذا سُمّي المعهد باسم الشيخ محمد صديق المنشاوي؟
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-3xl">
              وُلد فضيلة القارئ الشيخ محمد صديق المنشاوي في مدينة المنشأة بمحافظة سوهاج عام ١٩٢٠م، ونشأ في أسرة قرآنية عريقة أنجبت كبار قراء العالم الإسلامي. وبات صوته المرتل مدرسة قائمة بذاتها تفيض إخلاصاً وهيبة. وتكريماً لابن المنشأة البار وفخر مصر والأزهر، تشرّف المعهد بحمل اسمه تخليداً لذكراه وحثاً للأبناء والبراعم على الاقتداء بمسيرته القرآنية العطرة.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Creator Portfolio Card */}
        <div className="lg:col-span-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-amber-500/20 group">
          <div className="absolute inset-0 bg-[radial-gradient(#eab308_0.05rem,transparent_0.05rem)] [background-size:2rem_2rem] opacity-[0.03] pointer-events-none"></div>
          <div className="absolute top-0 right-0 opacity-5 -mr-10 -mt-10 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
             <Code size={300} />
          </div>
          
          <div className="relative z-10 space-y-6 sm:space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center text-emerald-950 shadow-lg border border-amber-300">
                  <User size={24} />
               </div>
               <div>
                  <h3 className="text-base sm:text-xl font-amiri font-bold text-amber-300 leading-none">مطور ومصمم المنصة</h3>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-300 uppercase tracking-widest mt-1.5 font-sans">
                     <Sparkles size={11} className="text-amber-400 animate-spin" />
                     <span>الهندسة الرقمية والبرمجية</span>
                  </div>
               </div>
            </div>

            <div className="space-y-3">
               <p className="text-2xl sm:text-4xl font-bold font-amiri text-white tracking-wide">عمر مصطفى كامل</p>
               <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed font-semibold">
                  تم بناء وتطوير هذه المنصة الرقمية الموحدة لمعهد الشيخ محمد صديق المنشاوي الأزهري بسوهاج بأحدث تقنيات الويب العالمية (React, TypeScript & Tailwind CSS & Supabase) لتقديم تجربة استخدام فائقة السلاسة على أجهزة الكمبيوتر والهواتف المحمولة على حد سواء.
               </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm pt-1">
              <div className="bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                <Cpu size={14} className="text-amber-400 shrink-0" />
                <span className="text-[10px] font-bold tracking-wider">Frontend Engineer</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                <Terminal size={14} className="text-amber-400 shrink-0" />
                <span className="text-[10px] font-bold tracking-wider">UI/UX Architect</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/80">
              <span className="text-[10px] font-sans">© 2026 Omar Mostafa Kamel</span>
              <span className="text-amber-300 font-bold">تطوير مستمر لخدمة طلاب الأزهر</span>
            </div>
          </div>
        </div>

        {/* Luminous Clock Widget, Official Assembly Notice & Smart Alarm System */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          {/* Official Morning Assembly Alert Banner */}
          <div className="bg-gradient-to-br from-red-950 via-red-900 to-amber-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-amber-400/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-start gap-3.5 relative z-10">
              <div className="w-12 h-12 bg-amber-400 text-red-950 rounded-2xl flex items-center justify-center shrink-0 shadow-lg font-bold">
                <AlertTriangle size={24} className="animate-bounce" />
              </div>
              <div className="space-y-2 flex-1 text-right">
                <div className="inline-flex items-center gap-1.5 bg-red-800/80 border border-amber-400/40 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  <ShieldCheck size={11} className="text-amber-400" />
                  <span>تنبيه إداري مشدد للطلاب وأولياء الأمور</span>
                </div>
                <h4 className="text-base sm:text-xl font-bold font-amiri text-amber-300 leading-snug">
                  تنبيه: الساعة 7:45 يبدأ الطابور المدرسي وغير مسموح بالدخول بعده
                </h4>
                <p className="text-xs sm:text-sm text-red-100/95 font-bold leading-relaxed">
                  يبدأ الطابور الصباحي في فناء المعهد تمام الساعة <span className="text-amber-300 underline font-mono text-sm sm:text-base">7:45 صباحاً</span>، و<span className="text-amber-300">غير مسموح نهائياً بدخول أي طالب بعد هذا التوقيت</span>، وذلك تنفيذاً لتعليمات الانضباط المدرسي وقرارات إدارة المعهد ومنطقة سوهاج الأزهرية.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Morning Assembly Alarm Card (منبه طابور الصباح) */}
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-7 border border-emerald-100 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  alarmEnabled ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'
                }`}>
                  {alarmEnabled ? (
                    <BellRing size={20} className="animate-pulse text-amber-600" />
                  ) : (
                    <BellOff size={20} />
                  )}
                </div>
                <div className="text-right">
                  <h4 className="text-sm sm:text-base font-bold font-amiri text-emerald-950">
                    منبه طابور الصباح (٧:٤٥ ص)
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isAssemblyNow ? '🔔 الطابور منعقد الآن!' : 'تنبيه صوتي يومي لموعد الاصطفاف'}
                  </p>
                </div>
              </div>

              {/* Toggle Alarm Button */}
              <button
                onClick={toggleAlarm}
                type="button"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 ${
                  alarmEnabled 
                    ? 'bg-emerald-900 text-amber-300 border border-emerald-800' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                title={alarmEnabled ? 'إلغاء تفعيل المنبه' : 'تفعيل المنبه'}
              >
                <span>{alarmEnabled ? 'المنبه مُفَعَّل' : 'المنبه مُعَطَّل'}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${alarmEnabled ? 'bg-amber-400 animate-ping' : 'bg-slate-300'}`}></span>
              </button>
            </div>

            {/* Live Countdown & Visual Indicator */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 mb-2">
                  <Clock size={13} className="text-amber-600" />
                  <span>
                    {isAssemblyNow 
                      ? 'الطابور المدرسي منعقد حالياً في ساحة المعهد' 
                      : 'الوقت المتبقي حتى موعد الطابور القادم (7:45 ص):'}
                  </span>
                </div>

                {/* Digital Countdown Timer */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 dir-ltr" dir="ltr">
                  <div className="bg-emerald-950 text-amber-300 rounded-xl p-2 sm:p-2.5 min-w-[56px] text-center shadow-inner">
                    <span className="font-mono text-xl sm:text-2xl font-bold block leading-none">
                      {String(hoursLeft).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-emerald-200 font-bold block mt-1 font-sans">ساعة</span>
                  </div>
                  <span className="text-emerald-950 font-bold text-xl sm:text-2xl font-mono">:</span>
                  <div className="bg-emerald-950 text-amber-300 rounded-xl p-2 sm:p-2.5 min-w-[56px] text-center shadow-inner">
                    <span className="font-mono text-xl sm:text-2xl font-bold block leading-none">
                      {String(minsLeft).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-emerald-200 font-bold block mt-1 font-sans">دقيقة</span>
                  </div>
                  <span className="text-emerald-950 font-bold text-xl sm:text-2xl font-mono">:</span>
                  <div className="bg-emerald-950 text-amber-300 rounded-xl p-2 sm:p-2.5 min-w-[56px] text-center shadow-inner">
                    <span className="font-mono text-xl sm:text-2xl font-bold block leading-none">
                      {String(secsLeft).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-emerald-200 font-bold block mt-1 font-sans">ثانية</span>
                  </div>
                </div>
              </div>

              {/* Sound Test / Stop Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                {isPlayingAlarm ? (
                  <button
                    onClick={stopAlarmSound}
                    type="button"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all animate-pulse"
                  >
                    <Square size={15} />
                    <span>إيقاف صوت الرنين الآن</span>
                  </button>
                ) : (
                  <button
                    onClick={playChimeTone}
                    type="button"
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                  >
                    <Volume2 size={16} className="text-amber-600" />
                    <span>تجربة رنين جرس المعهد الأزهرى</span>
                  </button>
                )}
              </div>

              {/* Active Sound Ringing Alert */}
              {isPlayingAlarm && (
                <div className="bg-amber-500 text-emerald-950 font-bold p-3 rounded-xl text-xs flex items-center gap-2.5 border border-amber-400 animate-in fade-in">
                  <BellRing size={18} className="animate-bounce shrink-0" />
                  <p className="flex-1">
                    جرس التنبيه يرن الآن! يرجى الاستعداد والتوجه إلى فناء المعهد الأزهرية قبل الساعة 7:45 ص.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Royal Clock Frame */}
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-7 border border-emerald-100 shadow-xl flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-800 to-amber-500"></div>
            
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-[10px] uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
               <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping shrink-0"></span>
               <Clock size={12} className="text-amber-600 ml-1" /> 
               <span>التوقيت المحلي في سوهاج ومصر</span>
            </div>
            
            <div className="text-3xl sm:text-5xl font-bold text-emerald-950 font-sans tracking-tight">
               {cairoTime}
            </div>
            
            <div className="text-slate-500 font-bold text-xs font-amiri tracking-wide">
               {cairoDate}
            </div>
          </div>

          {/* Dates and Verification Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
             <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center shrink-0">
                   <Calendar size={18} />
                </div>
                <div>
                   <p className="text-[9px] font-bold text-slate-400 font-sans">العام الدراسي</p>
                   <p className="font-bold text-emerald-950 font-sans text-xs sm:text-sm mt-0.5">٢٠٢٥ / ٢٠٢٦م</p>
                </div>
             </div>
             
             <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
                   <ShieldCheck size={18} />
                </div>
                <div>
                   <p className="text-[9px] font-bold text-slate-400 font-sans">المنطقة التعليمية</p>
                   <p className="font-bold text-emerald-950 text-xs sm:text-sm mt-0.5">منطقة سوهاج الأزهرية</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission Card */}
      <section className="bg-gradient-to-b from-[#fdfbf6] to-[#faf7f0] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-amber-500/20 text-center space-y-4 max-w-4xl mx-auto shadow-sm relative overflow-hidden">
         <div className="w-12 h-12 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-md text-emerald-950 border border-amber-500/20">
            <Heart size={22} fill="currentColor" className="text-amber-500/40" />
         </div>
         <div className="max-w-2xl mx-auto space-y-2.5">
            <h4 className="text-lg sm:text-xl font-amiri font-bold text-emerald-950">
              رسالة معهد محمد صديق المنشاوي الأزهري
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
               نسعى لتقديم تعليم أزهري نموذجي يرسخ حفظ وتجويد القرآن الكريم، ويبني جيلاً نافعاً لأمته مسلحاً بالعلم الشرعي والخلق القويم والمعرفة العصرية، من خلال بيئة تعليمية وتربوية داعمة ومحفزة لكل طالب ومعلم.
            </p>
         </div>
      </section>

      {/* Cloud & Hosting Infrastructure Card */}
      <section className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-emerald-100 shadow-lg max-w-4xl mx-auto space-y-5">
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-100/70 pb-4">
            <div className="flex items-center gap-3">
               <div className="w-11 h-11 bg-emerald-950 text-amber-400 rounded-2xl flex items-center justify-center shadow-md">
                  <Cloud size={22} />
               </div>
               <div>
                  <h4 className="text-base sm:text-lg font-bold font-amiri text-emerald-950">
                     البنية السحابية ومنظومة النشر والاستضافة
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                     تكامل موثوق للتخزين السحابي مع GitHub والنشر العالمي عبر Vercel
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-2">
               <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  متصل سحابياً (Active Cloud)
               </span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
               <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-2">
                     <Database size={15} className="text-emerald-700" />
                     <span>التخزين السحابي (GitHub Storage)</span>
                  </span>
                  <a 
                     href="https://github.com/ke754/-5" 
                     target="_blank" 
                     rel="noreferrer"
                     className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 font-mono underline"
                  >
                     <span>ke754/-5</span>
                     <ExternalLink size={11} />
                  </a>
               </div>
               <p className="text-slate-600 text-[11px] leading-relaxed">
                  يتم حفظ المناهج، جداول الحصص والامتحانات، والتوجيهات الإدارية تلقائياً في مستودع GitHub كسجلات سحابية آمنة لا تفقد مع دعم الاسترجاع الفوري.
               </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
               <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-2">
                     <Server size={15} className="text-amber-600" />
                     <span>منصة الاستضافة (Vercel Ready)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                     SPA Optimized
                  </span>
               </div>
               <p className="text-slate-600 text-[11px] leading-relaxed">
                  المنصة مهيأة بملف <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px] text-slate-800 font-mono">vercel.json</code> لتقديم أقصى سرعة استجابة وأمان عالي وتحميل فوري للطلاب وأولياء الأمور.
               </p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default AboutScreen;
