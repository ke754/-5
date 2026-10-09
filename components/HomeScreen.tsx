import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, GraduationCap, Award, Info, Loader2, MessageSquare, User, Send, AlertCircle, CheckCircle2, Images, X, ChevronRight, ChevronLeft, PlayCircle, Sparkles, Clock, Calendar, Phone, MessageCircle, Image as ImageIcon, MapPin, BookOpen, Quote, Heart, Volume2, Bookmark, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem, NewsComment } from '../types';
import { githubStorage } from '../services/githubStorage';

const HomeScreen: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGallery, setActiveGallery] = useState<{urls: string[], index: number} | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const newsList = await githubStorage.getNews();
      setNews(newsList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'نُشر الآن';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
    return date.toLocaleDateString('ar-EG');
  };

  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* Hero Section - Royal Azhari Masterpiece */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border border-amber-500/25 group">
        {/* Intricate Geometric Background Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#eab308_0.07rem,transparent_0.07rem)] [background-size:2rem_2rem] opacity-[0.04] pointer-events-none"></div>
        <div className="absolute -top-16 -right-16 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-700"></div>
        
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-400/15 text-amber-300 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold leading-none backdrop-blur-sm shadow-sm">
               <Sparkles size={13} className="text-amber-400 animate-spin" />
               <span>المرحلة الإعدادية والثانوية بنين • منارة أزهرية رائدة</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-amiri font-bold leading-tight sm:leading-snug">
              معهد الشيخ <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">محمد صديق المنشاوي</span> الإعدادي الثانوي (بنين)
            </h1>
            
            <p className="text-emerald-100/85 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
              المنصة الرقمية الرسمية لطلاب المرحلتين الإعدادية والثانوية الأزهرية بالمنشأة بسوهاج. نجمع بين إتقان القرآن الكريم كاملاً وتفوق العلوم الشرعية والعربية والحديثة لإعداد قادة الغد.
            </p>

            {/* Quick Stats Banner inside Hero */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-lg pt-1">
              <div className="bg-white/10 border border-white/10 p-2.5 sm:p-3 rounded-2xl text-center backdrop-blur-md">
                <div className="text-lg sm:text-2xl font-bold text-amber-300 font-sans">٧٥٠+</div>
                <div className="text-[10px] sm:text-xs text-emerald-100/80 font-semibold mt-0.5">طالب أزهري (بنين)</div>
              </div>
              <div className="bg-white/10 border border-white/10 p-2.5 sm:p-3 rounded-2xl text-center backdrop-blur-md">
                <div className="text-lg sm:text-2xl font-bold text-amber-300 font-sans">٤٥+</div>
                <div className="text-[10px] sm:text-xs text-emerald-100/80 font-semibold mt-0.5">شيخ ومعلم أزهري</div>
              </div>
              <div className="bg-white/10 border border-white/10 p-2.5 sm:p-3 rounded-2xl text-center backdrop-blur-md">
                <div className="text-lg sm:text-2xl font-bold text-amber-300 font-sans">١١٤</div>
                <div className="text-[10px] sm:text-xs text-emerald-100/80 font-semibold mt-0.5">سورة بالمنهج الصوتي</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link 
                to="/schedules" 
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-950 px-6 sm:px-8 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-[0_4px_20px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>جداول الامتحانات والحصص</span>
                <Calendar size={16} />
              </Link>
              
              <button 
                onClick={() => setShowContactModal(true)} 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-6 sm:px-8 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <span>تواصل مع الإدارة</span>
                <Phone size={16} className="text-amber-400" />
              </button>
            </div>
          </div>

          {/* Side Crest / Illustration */}
          <div className="lg:col-span-4 hidden lg:flex justify-center relative">
            <div className="w-64 h-64 rounded-[3rem] bg-gradient-to-br from-amber-400/20 to-amber-600/5 absolute -top-4 -left-4 animate-pulse"></div>
            <div className="w-64 h-64 rounded-[3rem] border border-amber-500/30 flex flex-col items-center justify-center p-6 bg-emerald-900/40 backdrop-blur-md shadow-2xl relative text-center">
              <div className="w-20 h-20 bg-amber-400 text-emerald-950 rounded-2xl flex items-center justify-center mb-3 shadow-lg border border-amber-300">
                <BookOpen size={40} />
              </div>
              <h3 className="font-amiri font-bold text-lg text-amber-300">معهد محمد صديق المنشاوي</h3>
              <p className="text-[11px] text-emerald-200 mt-1">المنشأة • محافظة سوهاج</p>
              <div className="absolute -bottom-3 bg-amber-500 text-emerald-950 px-4 py-1.5 rounded-full font-bold text-[10px] shadow-lg border border-amber-300">
                أصالة أزهرية ورعاية متكاملة
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Feature: Tribute to Sheikh Mohamed Siddiq El-Minshawi (The Pride of Al-Manshah) */}
      <section className="bg-gradient-to-br from-[#fcfaf4] via-white to-[#f8f5eb] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-amber-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          {/* Avatar / Emblem of Honor */}
          <div className="shrink-0 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-950 via-emerald-900 to-amber-600 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-emerald-950 flex flex-col items-center justify-center text-amber-300 border border-amber-400/40">
                  <Volume2 size={32} className="text-amber-400" />
                  <span className="font-amiri text-[10px] font-bold mt-1 text-emerald-200">الصوت الباكي</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-emerald-950 rounded-full p-1.5 shadow border-2 border-white">
                <Award size={14} />
              </div>
            </div>
          </div>

          {/* Biographical Tribute */}
          <div className="flex-1 text-center md:text-right space-y-2.5">
            <div className="inline-flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold bg-amber-100/70 border border-amber-300/60 px-3 py-1 rounded-full">
              <Sparkles size={12} className="text-amber-700" />
              <span>نبذة شرفية عن راعي اسم المعهد</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-amiri font-bold text-emerald-950">
              فضيلة القارئ الشيخ محمد صديق المنشاوي (١٩٢٠ - ١٩٦٩م)
            </h2>
            
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              ابن مدينة المنشأة بمحافظة سوهاج، وأحد أعلام التلاوة الكبار في تاريخ العالم الإسلامي، لُقّب بـ <strong className="text-emerald-900">"الصوت الباكي الخاشع"</strong> لما وهبه الله من رقة ونبرة تفيض خشوعاً وإيماناً. وسمّي معهدنا تيمناً وتخليداً لاسمه العاطر ليكون نبراساً لأبنائنا في حب القرآن الكريم وتجويده.
            </p>

            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2 text-[11px] font-bold text-emerald-900">
              <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1">
                <Check size={12} className="text-emerald-700" />
                <span>مواليد المنشأة - سوهاج</span>
              </span>
              <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1">
                <Check size={12} className="text-emerald-700" />
                <span>سفير القرآن للأزهر الشريف</span>
              </span>
              <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1">
                <Check size={12} className="text-emerald-700" />
                <span>تلاواته متوفرة بالموقع</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Institute Core Pillars (Bento Grid) */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-md mx-auto">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block font-sans">قيمنا ورسالتنا</span>
          <h2 className="text-2xl md:text-3xl font-amiri font-bold text-emerald-950">ركائز المعهد الأساسية</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-emerald-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-emerald-800"></div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <BookOpen size={24} />
            </div>
            <h3 className="text-base sm:text-lg font-bold font-amiri text-emerald-950 mb-2">منهج التلاوة والترتيل</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              تحفيظ القرآن الكريم كاملاً وتجويده وإتقان أحكام التلاوة لطلاب المرحلتين الإعدادية والثانوية بنين.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-emerald-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-amber-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <Award size={24} />
            </div>
            <h3 className="text-base sm:text-lg font-bold font-amiri text-emerald-950 mb-2">الوسطية الأزهرية</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              ترسيخ مبادئ ديننا الحنيف القائمة على التسامح والرحمة والاعتدال لبناء شخصية متوازنة تخدم دينها ووطنها.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-emerald-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-emerald-800"></div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-base sm:text-lg font-bold font-amiri text-emerald-950 mb-2">التميز العلمي والأكاديمي</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              تكامل فريد بين العلوم الشرعية والعربية وبين المواد الحديثة كالرياضيات والعلوم وتكنولوجيا المعلومات.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-emerald-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-amber-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <Sparkles size={24} />
            </div>
            <h3 className="text-base sm:text-lg font-bold font-amiri text-emerald-950 mb-2">الأنشطة والابتكار</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              اكتشاف مواهب التلاميذ في الخط العربي، الإلقاء، مسابقات حفظ القرآن الكريم، والأنشطة الرياضية والثقافية.
            </p>
          </div>
        </div>
      </section>

      {/* News & Announcements Section */}
      <section id="news-section" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200/80 pb-4 gap-3">
           <div className="flex items-center gap-3">
              <div className="bg-emerald-950 text-amber-400 p-2.5 rounded-2xl shadow-md">
                 <Clock size={20} />
              </div>
              <div>
                 <h2 className="text-xl sm:text-2xl font-amiri font-bold text-emerald-950">أحدث الأخبار والفعاليات</h2>
                 <p className="text-xs text-slate-500 font-medium">متابعة مستمرة لقرارات المعهد وتوجيهات الإدارة</p>
              </div>
           </div>
           <span className="text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
             تحديث مباشر
           </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 text-slate-400">
             <Loader2 className="animate-spin mb-3 text-emerald-800" size={36}/>
             <p className="text-xs font-bold text-emerald-950">جاري تحميل الأخبار والمنشورات من قاعدة البيانات...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <BookOpen className="mx-auto text-emerald-800" size={40} />
            <h3 className="text-lg font-bold font-amiri text-emerald-950">مرحباً بكم في معهد محمد صديق المنشاوي الأزهري</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">سيتم إدراج التنبيهات والأخبار الجديدة هنا قريباً من قبل إدارة المعهد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <article key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                {item.mediaUrls && item.mediaUrls[0] && (
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900 cursor-pointer" onClick={() => setActiveGallery({urls: item.mediaUrls || [], index: 0})}>
                    {isVideo(item.mediaUrls[0]) ? (
                      <video src={item.mediaUrls[0]} className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.mediaUrls[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} referrerPolicy="no-referrer" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute top-3 right-3 bg-emerald-950/90 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-xl text-[10px] font-bold shadow">
                      {getTimeAgo(item.date || (item as any).created_at)}
                    </div>
                  </div>
                )}
                
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-emerald-950 font-amiri group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mt-2 font-medium">
                      {item.content}
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                     <span className="text-emerald-900 text-[10px] font-bold bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                       <MessageSquare size={12} className="text-emerald-700" />
                       <span>{item.comments?.length || 0} تعليقات</span>
                     </span>
                     <button 
                       onClick={() => setActiveGallery({urls: item.mediaUrls || [], index: 0})} 
                       className="text-amber-600 hover:text-amber-700 text-xs font-bold hover:underline"
                     >
                       عرض التفاصيل
                     </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Quranic Verse Frame */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-8 sm:p-12 rounded-3xl sm:rounded-[2.5rem] text-center max-w-4xl mx-auto space-y-3 relative overflow-hidden shadow-xl border border-amber-500/20">
         <div className="absolute inset-0 bg-[radial-gradient(#eab308_0.05rem,transparent_0.05rem)] [background-size:2rem_2rem] opacity-5 pointer-events-none"></div>
         <div className="text-amber-400/20 absolute top-2 left-6 pointer-events-none"><Quote size={70} /></div>
         <p className="text-lg sm:text-2xl font-amiri font-bold text-amber-300 leading-relaxed max-w-2xl mx-auto">
            "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ"
         </p>
         <span className="text-[11px] text-emerald-200/80 font-bold tracking-widest block font-sans">سورة المجادلة • الآية ١١</span>
      </section>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] bg-emerald-950/60 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowContactModal(false)}>
            <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in zoom-in-95 border border-emerald-100" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowContactModal(false)} className="absolute top-4 left-4 text-slate-400 hover:text-slate-900 bg-slate-100 p-1.5 rounded-full transition-colors"><X size={18}/></button>
              
              <div className="text-center space-y-2">
                 <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 text-emerald-950 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-amber-300">
                   <Phone size={26} />
                 </div>
                 <h3 className="text-xl sm:text-2xl font-bold text-emerald-950 font-amiri">معهد محمد صديق المنشاوي الأزهري</h3>
                 <p className="text-xs text-slate-500 font-medium">نسعد باستقبال استفسارات أولياء الأمور والطلاب</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/60 flex items-center justify-between">
                   <div className="space-y-0.5">
                      <div className="text-xs font-bold text-emerald-950 font-amiri">الشيخ: بهاء الدين محمد</div>
                      <div className="text-[10px] text-slate-500">شيخ المعهد وإدارته العامة</div>
                      <div className="font-sans font-bold text-sm text-emerald-900 tracking-wider mt-1">01033456963</div>
                   </div>
                   <a href="tel:01033456963" className="p-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow active:scale-95 transition-all">
                     <Phone size={16}/>
                   </a>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 flex items-center justify-between">
                   <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 font-amiri">المقر والعنوان</div>
                      <div className="text-[10px] text-slate-500">مدينة المنشأة - محافظة سوهاج</div>
                      <div className="text-xs text-slate-600 mt-1">بجوار مجمع المعاهد الأزهرية</div>
                   </div>
                   <div className="p-3 bg-slate-200 text-slate-700 rounded-xl">
                     <MapPin size={16}/>
                   </div>
                </div>
              </div>
            </div>
        </div>
      )}

      {/* Active Gallery Lightbox */}
      {activeGallery && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between p-4" onClick={() => setActiveGallery(null)}>
           <div className="flex justify-between items-center text-white px-4 py-2">
              <span className="text-xs font-bold">{activeGallery.index + 1} من {activeGallery.urls.length}</span>
              <button onClick={() => setActiveGallery(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"><X size={20} /></button>
           </div>

           <div className="relative flex-1 flex items-center justify-center max-w-4xl mx-auto w-full" onClick={e => e.stopPropagation()}>
              {activeGallery.urls.length > 1 && (
                <button 
                  onClick={() => setActiveGallery({ ...activeGallery, index: (activeGallery.index - 1 + activeGallery.urls.length) % activeGallery.urls.length })}
                  className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
                >
                  <ChevronRight size={24} />
                </button>
              )}

              <div className="max-h-[75vh] max-w-full flex items-center justify-center">
                 {isVideo(activeGallery.urls[activeGallery.index]) ? (
                   <video src={activeGallery.urls[activeGallery.index]} controls autoPlay className="max-h-[70vh] max-w-full rounded-2xl" />
                 ) : (
                   <img src={activeGallery.urls[activeGallery.index]} className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl" alt="تفاصيل الخبر" referrerPolicy="no-referrer" />
                 )}
              </div>

              {activeGallery.urls.length > 1 && (
                <button 
                  onClick={() => setActiveGallery({ ...activeGallery, index: (activeGallery.index + 1) % activeGallery.urls.length })}
                  className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
           </div>

           <div className="text-center text-slate-400 text-xs py-3">
              اضغط في أي مكان خارج الصورة للإغلاق
           </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
