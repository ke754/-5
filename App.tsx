import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Home, Info, Menu, X, Youtube, Image as ImageIcon, FileText, Sparkles, Shield, UserCheck, Music2, Cloud } from 'lucide-react';
import QuranSidebar from './components/QuranSidebar';
import HomeScreen from './components/HomeScreen';
import ScheduleScreen from './components/ScheduleScreen';
import AdminPortal from './components/AdminPortal';
import AboutScreen from './components/AboutScreen';

const NavigationContent: React.FC<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}> = ({ isSidebarOpen, toggleSidebar, closeSidebar, isAdmin, setIsAdmin }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f2] text-slate-900 rtl overflow-x-hidden font-sans">
      {/* Top Banner - Subtle Islamic Pattern & Prayer/News Ticker */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-amber-300/90 text-[11px] py-1.5 px-4 border-b border-amber-500/20 text-center font-amiri tracking-wider flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <Sparkles size={12} className="text-amber-400" />
          <span>الأزهر الشريف • الإدارة المركزية لمنطقة سوهاج الأزهرية</span>
        </div>
        <div className="mx-auto sm:mx-0 font-bold flex items-center gap-1.5">
          <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          <span className="hidden md:inline text-amber-200/60">• "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ"</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-emerald-200/80">
          <span>مركز المنشأة • محافظة سوهاج</span>
        </div>
      </div>

      {/* Main Navigation Bar - Royal & Responsive */}
      <header className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white shadow-xl sticky top-0 z-40 border-b border-amber-500/25 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-20 flex justify-between items-center">
          
          {/* Logo & Institute Identity */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-emerald-950 w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-bold text-2xl group-hover:rotate-6 transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.3)] border border-amber-300/50">
                <span className="font-amiri font-bold leading-none mt-1">م</span>
                <div className="absolute -inset-0.5 rounded-2xl border border-white/30 animate-pulse pointer-events-none"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-lg md:text-xl font-bold font-amiri tracking-wide leading-tight text-amber-400 group-hover:text-amber-300 transition-colors">
                    معهد محمد صديق المنشاوي
                  </h1>
                  <span className="hidden lg:inline-block bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] px-2 py-0.5 rounded-full font-bold">
                    إعدادي وثانوي بنين
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-emerald-200/80 font-medium leading-none mt-1">
                  المرحلتان الإعدادية والثانوية (بنين) بسوهاج
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link 
              to="/" 
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${currentPath === '/' ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/50'}`}
            >
              <Home size={15} /> 
              <span>الرئيسية</span>
            </Link>

            <Link 
              to="/schedules" 
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${currentPath === '/schedules' ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/50'}`}
            >
              <Calendar size={15} /> 
              <span>الجداول الدراسية</span>
            </Link>

            <Link 
              to="/about" 
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${currentPath === '/about' ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/50'}`}
            >
              <Info size={15} /> 
              <span>عن المعهد</span>
            </Link>

            {/* Quick Quran Sidebar Toggle */}
            <button 
              onClick={toggleSidebar}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${isSidebarOpen ? 'bg-emerald-800 border-amber-400/40 text-amber-300' : 'bg-emerald-900/60 border-emerald-700/60 text-emerald-100 hover:text-white hover:border-amber-400'}`}
              title="عرض وتلاوة منهج القرآن الكريم"
            >
              <BookOpen size={15} className="text-amber-400" />
              <span>منهج القرآن</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            </button>

            {/* Admin & Cloud Portal Button */}
            <Link 
              to="/admin" 
              className={`mr-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${isAdmin ? 'bg-amber-500 text-emerald-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'border-emerald-700/60 hover:border-amber-400 hover:bg-white/5 text-emerald-100'}`}
              title="لوحة الإدارة والتخزين السحابي"
            >
              <Shield size={14} className={isAdmin ? 'text-emerald-950' : 'text-amber-400'} />
              <span>{isAdmin ? 'لوحة التحكم' : 'دخول الإدارة'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="السحابة متصلة"></span>
            </Link>
          </nav>

          {/* Mobile Action Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Music2 size={14} />
              <span>القرآن</span>
            </button>

            <Link
              to="/admin"
              className={`p-2 rounded-xl border text-xs ${isAdmin ? 'bg-amber-400 text-emerald-950 border-amber-400' : 'border-emerald-700/80 text-emerald-100'}`}
              title="دخول الإدارة"
            >
              <UserCheck size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex flex-1 relative max-w-[1600px] w-full mx-auto">
        
        {/* Right Quran Drawer / Sidebar */}
        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div 
            onClick={closeSidebar}
            className="fixed inset-0 bg-emerald-950/60 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-300"
          />
        )}

        {/* Sidebar Container */}
        <aside 
          className={`fixed inset-y-0 right-0 z-[60] w-80 md:w-88 bg-white border-l border-emerald-100 shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:hidden'}`}
        >
          <QuranSidebar onClose={closeSidebar} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-6 md:p-10 relative pb-28 md:pb-12 min-w-0">
          {/* Subtle Arabesque watermarks */}
          <div className="absolute inset-0 bg-[radial-gradient(#047857_0.04rem,transparent_0.04rem)] [background-size:1.8rem_1.8rem] opacity-3 pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/schedules" element={<ScheduleScreen />} />
              <Route path="/about" element={<AboutScreen />} />
              <Route 
                path="/admin" 
                element={
                  <AdminPortal 
                    onLogin={() => setIsAdmin(true)} 
                    onLogout={() => setIsAdmin(false)} 
                    isAdmin={isAdmin} 
                  />
                } 
              />
            </Routes>
          </div>
        </main>
      </div>

      {/* Floating Quran Toggle on Desktop when Sidebar is Closed */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="hidden md:flex fixed bottom-6 left-6 z-40 bg-gradient-to-r from-emerald-950 to-emerald-900 text-amber-300 hover:text-white hover:from-amber-500 hover:to-amber-600 hover:text-emerald-950 p-3.5 rounded-2xl shadow-2xl border border-amber-500/30 items-center gap-2.5 group transition-all duration-300 hover:scale-105"
          title="فتح مقرر القرآن الكريم الصوتي"
        >
          <BookOpen size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold font-amiri">مقرر القرآن والتلاوة</span>
        </button>
      )}

      {/* Mobile Bottom Navigation Bar (Thumb-Friendly Experience) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-emerald-100/80 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] z-40 py-2 px-3">
        <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
          <Link 
            to="/" 
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${currentPath === '/' ? 'text-emerald-950 font-bold bg-amber-400/20' : 'text-slate-500 hover:text-emerald-900'}`}
          >
            <Home size={18} className={currentPath === '/' ? 'text-emerald-900' : ''} />
            <span className="text-[10px] mt-0.5">الرئيسية</span>
          </Link>

          <Link 
            to="/schedules" 
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${currentPath === '/schedules' ? 'text-emerald-950 font-bold bg-amber-400/20' : 'text-slate-500 hover:text-emerald-900'}`}
          >
            <Calendar size={18} className={currentPath === '/schedules' ? 'text-emerald-900' : ''} />
            <span className="text-[10px] mt-0.5">الجداول</span>
          </Link>

          {/* Central Quran Button */}
          <button 
            onClick={toggleSidebar} 
            className="flex flex-col items-center py-1 -mt-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-950 via-emerald-900 to-amber-600 text-amber-300 flex items-center justify-center shadow-lg border-2 border-white active:scale-95 transition-transform">
              <BookOpen size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-950 mt-0.5">المصحف</span>
          </button>

          <Link 
            to="/about" 
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${currentPath === '/about' ? 'text-emerald-950 font-bold bg-amber-400/20' : 'text-slate-500 hover:text-emerald-900'}`}
          >
            <Info size={18} className={currentPath === '/about' ? 'text-emerald-900' : ''} />
            <span className="text-[10px] mt-0.5">من نحن</span>
          </Link>

          <Link 
            to="/admin" 
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${currentPath === '/admin' ? 'text-emerald-950 font-bold bg-amber-400/20' : 'text-slate-500 hover:text-emerald-900'}`}
          >
            <Shield size={18} className={currentPath === '/admin' ? 'text-emerald-900' : ''} />
            <span className="text-[10px] mt-0.5">{isAdmin ? 'التحكم' : 'الإدارة'}</span>
          </Link>
        </div>
      </nav>

      {/* Footer - Elegant, Symmetrical, Islamic Aesthetics */}
      <footer className="bg-gradient-to-b from-emerald-950 to-emerald-900 text-emerald-200 border-t border-amber-500/20 py-10 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#eab308_0.05rem,transparent_0.05rem)] [background-size:2rem_2rem] opacity-[0.02] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-400 font-amiri">
              معهد الشيخ محمد صديق المنشاوي الإعدادي الثانوي الأزهري (بنين) بسوهاج
            </p>
            <p className="text-[11px] text-emerald-300/80 font-medium mt-1">
              تأسس لنشر منهج الوسطية وحفظ كتاب الله العزيز والعلوم العربية والشرعية
            </p>
            <p className="text-[10px] text-emerald-400/50 mt-0.5">
              &copy; {new Date().getFullYear()} جميع الحقوق محفوظة للأزهر الشريف
            </p>
          </div>
          <div className="flex gap-3">
             <Link to="/about" className="p-2.5 bg-emerald-900/80 hover:bg-amber-400 hover:text-emerald-950 rounded-xl border border-emerald-800/60 transition-all duration-300 shadow-md text-emerald-100" title="حول المعهد"><Info size={16} /></Link>
             <Link to="/schedules" className="p-2.5 bg-emerald-900/80 hover:bg-amber-400 hover:text-emerald-950 rounded-xl border border-emerald-800/60 transition-all duration-300 shadow-md text-emerald-100" title="الجداول والامتحانات"><FileText size={16} /></Link>
             <button onClick={toggleSidebar} className="p-2.5 bg-emerald-900/80 hover:bg-amber-400 hover:text-emerald-950 rounded-xl border border-emerald-800/60 transition-all duration-300 shadow-md text-emerald-100" title="منهج التلاوة"><BookOpen size={16} /></button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem('admin_session');
    if (session === 'true') setIsAdmin(true);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <Router>
      <NavigationContent 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        closeSidebar={closeSidebar}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />
    </Router>
  );
};

export default App;
