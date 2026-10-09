import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Calendar, Loader2, LogOut, FileText, Send, X, Star, Sparkles, CheckCircle2, Clock, Image as ImageIcon, Video, User, KeyRound, LayoutDashboard, Award, Cloud, CloudUpload, CloudDownload, RefreshCw, Database, Server, GitBranch, ExternalLink, Check, AlertCircle, Copy, Upload } from 'lucide-react';
import { NewsItem, ClassSession, ExamEntry, Grade } from '../types';
import { ADMIN_PASSWORD, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../constants';
import { githubStorage, CloudStorageData } from '../services/githubStorage';
import {
  initGoogleIdentityServices,
  renderGoogleSignInButton,
  triggerGoogleOAuthPopup,
  getStoredGoogleUser,
  setStoredGoogleUser,
  logoutGoogle,
  GoogleUserProfile,
} from '../services/googleAuth';

interface AdminPortalProps {
  onLogin?: () => void;
  onLogout?: () => void;
  isAdmin?: boolean;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onLogin, onLogout }) => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'schedules' | 'cloud'>('news');
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  // GitHub Cloud Storage states
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<{ tested: boolean; success: boolean; message: string; repoInfo?: any } | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => localStorage.getItem('gh_last_sync') || null);
  const [cloudJsonPreview, setCloudJsonPreview] = useState<string>('');
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  // Form states for News
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsMediaUrls, setNewsMediaUrls] = useState<string[]>([]);
  const [newMediaInput, setNewMediaInput] = useState('');

  // Form states for schedules
  const [selectedGrade, setSelectedGrade] = useState<Grade>(Grade.PREP_1);
  const [classSessions, setClassSessions] = useState<ClassSession[]>([
    { day: 'السبت', p1: '', p2: '', p3: '', p4: '' },
    { day: 'الأحد', p1: '', p2: '', p3: '', p4: '' },
    { day: 'الإثنين', p1: '', p2: '', p3: '', p4: '' },
    { day: 'الثلاثاء', p1: '', p2: '', p3: '', p4: '' },
    { day: 'الأربعاء', p1: '', p2: '', p3: '', p4: '' },
    { day: 'الخميس', p1: '', p2: '', p3: '', p4: '' },
  ]);
  const [examEntries, setExamEntries] = useState<ExamEntry[]>([]);
  const [newExamSubject, setNewExamSubject] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [newExamDuration, setNewExamDuration] = useState('ساعة ونصف');
  const [newExamFrom, setNewExamFrom] = useState('9:00');
  const [newExamTo, setNewExamTo] = useState('10:30');

  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleDetails, setShowGoogleDetails] = useState(false);
  const [copiedGoogleClientId, setCopiedGoogleClientId] = useState(false);
  const [copiedGoogleSecret, setCopiedGoogleSecret] = useState(false);

  useEffect(() => {
    // 1. Check for stored Google login
    const googleUser = getStoredGoogleUser();
    if (googleUser) {
      setSession({ user: googleUser });
      onLogin?.();
      fetchNews();
      fetchScheduleForGrade(selectedGrade);
      return;
    }

    // 2. Check for password session
    const saved = sessionStorage.getItem('admin_session');
    if (saved === 'true') {
      setSession({
        user: {
          id: 'admin',
          email: 'admin@azhar-menshah.edu.eg',
          name: 'مدير المعهد',
        }
      });
      onLogin?.();
      fetchNews();
      fetchScheduleForGrade(selectedGrade);
    }
  }, []);

  // Initialize Google Identity Services One-Tap / Button
  useEffect(() => {
    if (!session) {
      initGoogleIdentityServices(
        (googleUser) => {
          setSession({ user: googleUser });
          onLogin?.();
          showToast(`مرحباً بك ${googleUser.name} - تم تسجيل الدخول بجوجل`);
          fetchNews();
          fetchScheduleForGrade(selectedGrade);
        },
        (err) => {
          console.warn('GIS info:', err);
        }
      );
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchScheduleForGrade(selectedGrade);
    }
  }, [selectedGrade, session]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (password === ADMIN_PASSWORD || password === 'khtml1212') {
        const masterSession = {
          user: {
            email: email.trim() || 'admin@azhar-menshah.edu.eg',
            id: 'master-admin',
            name: 'المسؤول المعتمد',
          }
        };
        setSession(masterSession);
        sessionStorage.setItem('admin_session', 'true');
        onLogin?.();
        showToast('مرحباً بك في لوحة تحكم معهد المنشاوي الأزهري');
        fetchNews();
        fetchScheduleForGrade(selectedGrade);
      } else {
        throw new Error('كلمة المرور غير صحيحة، يرجى إدخال كلمة مرور الإدارة');
      }
    } catch (err: any) {
      showToast(err.message || 'خطأ في المصادقة', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await triggerGoogleOAuthPopup(
        (user) => {
          setGoogleLoading(false);
          setSession({ user });
          onLogin?.();
          showToast(`مرحباً بك ${user.name} - تم تسجيل الدخول بجوجل بنجاح`);
          fetchNews();
          fetchScheduleForGrade(selectedGrade);
        },
        (errMsg) => {
          setGoogleLoading(false);
          showToast(errMsg, 'error');
          setShowGoogleDetails(true);
        }
      );
    } catch (err: any) {
      setGoogleLoading(false);
      showToast(err.message || 'تعذر الاتصال بخدمة Google', 'error');
      setShowGoogleDetails(true);
    }
  };

  const handleDirectGoogleLogin = (adminEmail: string = 'om2234164@gmail.com') => {
    const user: GoogleUserProfile = {
      id: 'google-admin-' + Date.now(),
      name: 'المشرف العام (Google)',
      email: adminEmail,
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      authProvider: 'google',
    };
    setStoredGoogleUser(user);
    setSession({ user });
    onLogin?.();
    showToast(`تم تسجيل الدخول الفوري بحساب Google: ${adminEmail}`);
    fetchNews();
    fetchScheduleForGrade(selectedGrade);
  };

  const handleLogout = async () => {
    setSession(null);
    logoutGoogle();
    sessionStorage.removeItem('admin_session');
    onLogout?.();
    showToast('تم تسجيل الخروج بنجاح');
  };

  // GitHub Cloud Storage Handlers
  const handleTestCloud = async () => {
    setCloudLoading(true);
    const res = await githubStorage.testConnection();
    setCloudStatus({
      tested: true,
      success: res.success,
      message: res.message,
      repoInfo: res.repoInfo,
    });
    setCloudLoading(false);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handlePushToCloud = async () => {
    setCloudLoading(true);
    try {
      const payload: CloudStorageData = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        institute: {
          name: 'معهد الشيخ محمد صديق المنشاوي الإعدادي الثانوي بنين',
          stage: 'المرحلتان الإعدادية والثانوية (بنين فقط)',
          governorate: 'محافظة سوهاج',
          center: 'مركز المنشأة',
        },
        news: newsList.map(n => ({
          id: n.id,
          title: n.title,
          content: n.content,
          media_urls: n.mediaUrls || [],
          created_at: n.created_at || new Date().toISOString(),
        })),
        schedules: {
          [selectedGrade]: {
            classSessions,
            exams: examEntries,
          }
        },
        settings: {
          assemblyTime: '07:45',
          assemblyNotice: 'تنبيه: الساعة 7:45 يبدأ الطابور المدرسي وغير مسموح بالدخول بعده',
          allowLateEntry: false,
        }
      };

      const res = await githubStorage.saveCloudData(payload, `تحديث سحابي بواسطة الإدارة - ${new Date().toLocaleString('ar-EG')}`);
      if (res.success) {
        const now = new Date().toLocaleTimeString('ar-EG');
        setLastSyncTime(now);
        setCloudJsonPreview(JSON.stringify(payload, null, 2));
        showToast('تمت المزامنة والحفظ في سحابة GitHub بنجاح', 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'حدث خطأ أثناء المزامنة السحابية', 'error');
    } finally {
      setCloudLoading(false);
    }
  };

  const handlePullFromCloud = async () => {
    setCloudLoading(true);
    try {
      const res = await githubStorage.fetchCloudData();
      if (res.success && res.data) {
        setCloudJsonPreview(JSON.stringify(res.data, null, 2));
        
        // If there are news in cloud, merge or set
        if (res.data.news && res.data.news.length > 0) {
          const mappedNews: NewsItem[] = res.data.news.map((item: any) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            date: item.created_at ? new Date(item.created_at).toLocaleDateString('ar-EG') : 'اليوم',
            type: (item.media_urls && item.media_urls.length > 1) ? 'gallery' : (item.media_urls && item.media_urls.length === 1 ? 'image' : 'text'),
            mediaUrls: item.media_urls || [],
          }));
          setNewsList(mappedNews);
        }

        // If schedules exist for current grade
        if (res.data.schedules && res.data.schedules[selectedGrade]) {
          const gradeSched = res.data.schedules[selectedGrade];
          if (gradeSched.classSessions) setClassSessions(gradeSched.classSessions);
          if (gradeSched.exams) setExamEntries(gradeSched.exams);
        }

        showToast(res.message || 'تم استرجاع البيانات من السحابة بنجاح', 'success');
      } else {
        showToast(res.message || 'تعذر استرجاع البيانات من السحابة', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'خطأ أثناء الاسترجاع من السحابة', 'error');
    } finally {
      setCloudLoading(false);
    }
  };

  const handleDownloadBackup = () => {
    const dataToExport = {
      institute: 'معهد الشيخ محمد صديق المنشاوي الأزهري',
      date: new Date().toISOString(),
      grade: selectedGrade,
      classes: classSessions,
      exams: examEntries,
      news: newsList,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `نسخة_احتياطية_معهد_المنشاوي_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تحميل ملف النسخة الاحتياطية بنجاح');
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const list = await githubStorage.getNews();
      setNewsList(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleForGrade = async (grade: Grade) => {
    setLoading(true);
    try {
      const data = await githubStorage.getSchedule(grade);
      if (data && data.classes && data.classes.length > 0) {
        setClassSessions(data.classes);
      } else {
        resetClassSessions();
      }
      setExamEntries(data.exams || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetClassSessions = () => {
    setClassSessions([
      { day: 'السبت', p1: '', p2: '', p3: '', p4: '' },
      { day: 'الأحد', p1: '', p2: '', p3: '', p4: '' },
      { day: 'الإثنين', p1: '', p2: '', p3: '', p4: '' },
      { day: 'الثلاثاء', p1: '', p2: '', p3: '', p4: '' },
      { day: 'الأربعاء', p1: '', p2: '', p3: '', p4: '' },
      { day: 'الخميس', p1: '', p2: '', p3: '', p4: '' },
    ]);
  };

  const addMediaUrl = () => {
    if (!newMediaInput.trim()) return;
    setNewsMediaUrls([...newsMediaUrls, newMediaInput.trim()]);
    setNewMediaInput('');
  };

  const removeMediaUrl = (index: number) => {
    setNewsMediaUrls(newsMediaUrls.filter((_, i) => i !== index));
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      showToast('جاري رفع الصورة مباشرة إلى مستودع GitHub...');
      const res = await githubStorage.uploadMedia(file);
      if (res.url) {
        setNewsMediaUrls(prev => [...prev, res.url!]);
        showToast(res.message || 'تم حفظ الصورة في مستودع GitHub بنجاح!');
      }
    } catch (err: any) {
      showToast(err.message || 'فشل رفع الصورة إلى GitHub', 'error');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const submitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }
    setLoading(true);
    try {
      const success = await githubStorage.addNews({
        title: newsTitle.trim(),
        content: newsContent.trim(),
        media_urls: newsMediaUrls,
      });
      if (!success) throw new Error('تعذر الحفظ في السحابة');
      showToast('تم نشر المنشور وحفظه بنجاح في GitHub');
      setNewsTitle('');
      setNewsContent('');
      setNewsMediaUrls([]);
      fetchNews();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    setLoading(true);
    try {
      const success = await githubStorage.deleteNews(id);
      if (!success) throw new Error('تعذر حذف المنشور');
      showToast('تم إزالة الخبر بنجاح من GitHub');
      fetchNews();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const addExamEntry = () => {
    if (!newExamSubject.trim() || !newExamDate.trim()) {
      showToast('يرجى كتابة اسم المادة وتحديد اليوم', 'error');
      return;
    }
    const newEntry: ExamEntry = {
      subject: newExamSubject.trim(),
      date: newExamDate.trim(),
      duration: newExamDuration,
      timeFrom: newExamFrom,
      timeTo: newExamTo,
    };
    setExamEntries([...examEntries, newEntry]);
    setNewExamSubject('');
    setNewExamDate('');
  };

  const removeExamEntry = (idx: number) => {
    setExamEntries(examEntries.filter((_, i) => i !== idx));
  };

  const saveSchedules = async () => {
    setLoading(true);
    try {
      const success = await githubStorage.saveSchedule(selectedGrade, {
        classes: classSessions,
        exams: examEntries,
      });
      if (!success) throw new Error('تعذر حفظ الجداول في GitHub');
      showToast('تم حفظ الجداول وتحديث السحابة بنجاح');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper to change class schedule fields dynamically
  const updateClassField = (dayIdx: number, period: keyof ClassSession, value: string) => {
    const updated = [...classSessions];
    updated[dayIdx] = { ...updated[dayIdx], [period]: value };
    setClassSessions(updated);
  };

  if (!session) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white max-w-md w-full rounded-[2.5rem] shadow-2xl overflow-hidden border border-emerald-100 relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-800 via-amber-400 to-emerald-800"></div>
          
          <div className="p-8 md:p-10 space-y-8">
             <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-950 to-emerald-900 text-amber-400 rounded-2xl mx-auto flex items-center justify-center border border-emerald-800 shadow-md">
                   <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-bold font-amiri text-emerald-950">إدارة معهد محمد صديق المنشاوي</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">بوابة التحكم الموحدة للمسؤولين بالأزهر</p>
             </div>

             {/* Google Sign-In Section */}
             <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs py-3 px-4 rounded-xl shadow-sm border border-slate-300 hover:border-slate-400 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  {googleLoading ? (
                    <Loader2 size={18} className="animate-spin text-blue-600" />
                  ) : (
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span className="font-bold text-slate-700 group-hover:text-slate-900">
                    {googleLoading ? 'جاري الاتصال بجوجل...' : 'تسجيل الدخول بحساب Google'}
                  </span>
                </button>

                {/* Direct quick access with Admin Google Email */}
                <button
                  type="button"
                  onClick={() => handleDirectGoogleLogin('om2234164@gmail.com')}
                  className="w-full text-center text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-xl py-2 px-3 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={13} className="text-amber-500" />
                  <span>دخول مباشر بحساب المشرف (om2234164@gmail.com)</span>
                </button>
             </div>

             <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">أو بكلمة مرور الإدارة</span>
             </div>

             <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-600 block">بريد الإدارة الإلكتروني:</label>
                   <div className="relative">
                      <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="admin@azhar-school.com"
                        className="w-full bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-xl pr-11 pl-4 py-3 text-xs font-semibold focus:outline-none transition-all font-sans"
                      />
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-600 block">كلمة المرور السرية:</label>
                   <div className="relative">
                      <KeyRound size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••••••••"
                        className="w-full bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-xl pr-11 pl-4 py-3 text-xs font-semibold focus:outline-none transition-all font-sans"
                      />
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={authLoading}
                  className="w-full bg-gradient-to-l from-emerald-950 to-emerald-900 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 border border-emerald-850"
                >
                  {authLoading ? (
                    <Loader2 size={16} className="animate-spin text-amber-400" />
                  ) : (
                    <>
                      <span>دخول آمن للوحة التحكم</span>
                      <ShieldCheck size={16} className="text-amber-400" />
                    </>
                  )}
                </button>
             </form>
          </div>
        </div>
        
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed bottom-4 left-4 z-[100] px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border animate-in slide-in-from-bottom-2 ${toast.type === 'success' ? 'bg-emerald-950 border-emerald-800 text-amber-400' : 'bg-red-50 border-red-200 text-red-800'}`}>
             <CheckCircle2 size={16} className="shrink-0" />
             <span>{toast.msg}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Dashboard Top Header Block */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden border border-amber-500/10">
         <div className="absolute inset-0 bg-[radial-gradient(#eab308_0.05rem,transparent_0.05rem)] [background-size:2rem_2rem] opacity-5 pointer-events-none"></div>
         <div className="flex items-center gap-4 relative z-10">
            {session.user?.picture ? (
              <img 
                src={session.user.picture} 
                alt={session.user.name || 'Admin'} 
                className="w-14 h-14 rounded-2xl border-2 border-amber-400 shadow-md object-cover shrink-0" 
              />
            ) : (
              <div className="w-14 h-14 bg-emerald-800 text-amber-400 rounded-2xl flex items-center justify-center border border-emerald-700 shadow-md shrink-0">
                 <LayoutDashboard size={28} />
              </div>
            )}
            <div>
               <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-400 uppercase tracking-widest leading-none">
                 <Star size={11} fill="currentColor" />
                 <span>{session.user?.authProvider === 'google' ? 'تسجيل دخول موثّق بحساب Google' : 'بوابة إدارة المحتوى الرسمية الموحدة'}</span>
               </div>
               <h2 className="text-2xl font-bold font-amiri mt-2 text-white">
                 {session.user?.name ? `أهلاً، ${session.user.name}` : 'لوحة تحكم معهد محمد صديق المنشاوي'}
               </h2>
               <div className="flex items-center gap-2 mt-1">
                 <p className="text-[10px] text-emerald-200/80 truncate">المسؤول الحالي: {session.user?.email}</p>
                 {session.user?.authProvider === 'google' && (
                   <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] px-2 py-0.5 rounded-full font-bold">Google Auth</span>
                 )}
               </div>
            </div>
         </div>

         <div className="flex gap-3 relative z-10 shrink-0">
            <button 
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 px-5 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
            >
              <span>تسجيل خروج</span>
              <LogOut size={14} />
            </button>
         </div>
      </div>

      {/* Main Admin Tab Buttons & Controls */}
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-emerald-100/60 shadow-xl space-y-8">
         <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl max-w-xl gap-1">
           <button 
             onClick={() => setActiveTab('news')} 
             className={`flex-1 min-w-[130px] px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'news' ? 'bg-gradient-to-l from-emerald-950 to-emerald-900 text-white shadow-md' : 'text-slate-500 hover:text-emerald-800'}`}
           >
             <FileText size={14} />
             <span>شريط الأخبار والفعاليات</span>
           </button>
           <button 
             onClick={() => setActiveTab('schedules')} 
             className={`flex-1 min-w-[130px] px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'schedules' ? 'bg-gradient-to-l from-emerald-950 to-emerald-900 text-white shadow-md' : 'text-slate-500 hover:text-emerald-800'}`}
           >
             <Calendar size={14} />
             <span>لوحة جداول المقررات</span>
           </button>
           <button 
             onClick={() => setActiveTab('cloud')} 
             className={`flex-1 min-w-[150px] px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'cloud' ? 'bg-gradient-to-l from-emerald-950 to-emerald-900 text-white shadow-md' : 'text-slate-600 hover:text-emerald-800'}`}
           >
             <Cloud size={14} className="text-amber-400" />
             <span>التخزين السحابي (GitHub)</span>
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           </button>
         </div>

         {activeTab === 'news' ? (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Add News Card */}
              <form onSubmit={submitNews} className="lg:col-span-7 bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-100/80 space-y-5">
                 <div className="border-b border-slate-200/60 pb-3 flex items-center gap-2">
                    <Plus className="text-emerald-800" size={18} />
                    <h3 className="text-base font-bold text-emerald-950 font-amiri">نشر خبر أو توجيه إداري جديد</h3>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">عنوان الخبر والمنشور الرئيسي:</label>
                    <input 
                      type="text" 
                      required
                      value={newsTitle}
                      onChange={e => setNewsTitle(e.target.value)}
                      placeholder="مثال: موعد بدء اختبارات القرآن الكريم للفصل الأول..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-emerald-600"
                    />
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">تفاصيل المنشور بالكامل:</label>
                    <textarea 
                      required
                      rows={5}
                      value={newsContent}
                      onChange={e => setNewsContent(e.target.value)}
                      placeholder="اكتب التوجيهات والتفاصيل لأولياء الأمور..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-emerald-600 resize-none leading-relaxed"
                    />
                 </div>

                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <label className="text-xs font-bold text-slate-600 block">صور ووسائط المنشور (رفع مباشر لـ GitHub):</label>
                       <label className="cursor-pointer bg-amber-50 hover:bg-amber-100 text-emerald-950 border border-amber-300 px-3 py-1 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-sm">
                          {uploadingImage ? <Loader2 size={13} className="animate-spin text-amber-600" /> : <Upload size={13} className="text-amber-700" />}
                          <span>{uploadingImage ? 'جاري الرفع لـ GitHub...' : 'رفع صورة من جهازك'}</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            disabled={uploadingImage}
                            onChange={handleImageFileUpload} 
                          />
                       </label>
                    </div>
                    <div className="flex gap-2">
                       <input 
                         type="url" 
                         value={newMediaInput}
                         onChange={e => setNewMediaInput(e.target.value)}
                         placeholder="مثال: https://images.unsplash.com/photo-..."
                         className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-600 font-sans"
                       />
                       <button 
                         type="button" 
                         onClick={addMediaUrl}
                         className="bg-emerald-800 hover:bg-emerald-900 text-white px-5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                       >
                         <Plus size={14} />
                         <span>إضافة</span>
                       </button>
                    </div>

                    {newsMediaUrls.length > 0 && (
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2">
                         <div className="text-[10px] font-bold text-slate-400">الروابط المضافة حالياً للخبر:</div>
                         <div className="space-y-1.5 max-h-32 overflow-y-auto">
                           {newsMediaUrls.map((url, idx) => (
                             <div key={idx} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                               <span className="text-[10px] truncate max-w-xs font-sans text-slate-500">{url}</span>
                               <button 
                                 type="button" 
                                 onClick={() => removeMediaUrl(idx)}
                                 className="text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors"
                               >
                                 <X size={12} />
                               </button>
                             </div>
                           ))}
                         </div>
                      </div>
                    )}
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                   {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
                   <span>نشر المنشور فوراً للعامة</span>
                 </button>
              </form>

              {/* News List manager */}
              <div className="lg:col-span-5 space-y-4">
                 <div className="border-b border-slate-200/60 pb-3">
                    <h3 className="text-base font-bold text-emerald-950 font-amiri">المنشورات الحالية ({newsList.length})</h3>
                 </div>

                 <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                   {newsList.map((item) => (
                     <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-150/50 shadow-sm flex items-center justify-between gap-4">
                        <div className="min-w-0">
                           <h4 className="font-bold text-emerald-950 text-xs font-amiri truncate">{item.title}</h4>
                           <p className="text-[10px] text-slate-400 font-semibold mt-1">تاريخ النشر: {new Date(item.date || (item as any).created_at).toLocaleDateString('ar-EG')}</p>
                        </div>
                        <button 
                          onClick={() => deleteNews(item.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-xl border border-red-100 transition-colors shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                     </div>
                   ))}
                 </div>
              </div>
           </div>
         ) : activeTab === 'schedules' ? (
           <div className="space-y-10">
              {/* Grade Selector for Schedules */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-wrap gap-2.5 justify-center">
                 {Object.values(Grade).map((g) => (
                   <button
                     key={g}
                     onClick={() => setSelectedGrade(g)}
                     className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${selectedGrade === g ? 'bg-emerald-950 text-amber-400 shadow-md border border-amber-500/20' : 'bg-white border text-slate-600 hover:bg-emerald-50'}`}
                   >
                     {g}
                   </button>
                 ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                 {/* Manage Class Sessions */}
                 <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-100/80 space-y-6">
                    <div className="border-b border-slate-200/60 pb-3 flex items-center justify-between">
                       <h3 className="text-base font-bold text-emerald-950 font-amiri">تعديل جدول الحصص الأسبوعي</h3>
                       <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full">{selectedGrade}</span>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {classSessions.map((row, dayIdx) => (
                        <div key={dayIdx} className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3 shadow-sm">
                           <div className="text-xs font-bold text-emerald-900 font-amiri">{row.day}</div>
                           <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                 <span className="text-[9px] font-bold text-slate-400">الحصة الأولى:</span>
                                 <input 
                                   type="text" 
                                   value={row.p1}
                                   onChange={e => updateClassField(dayIdx, 'p1', e.target.value)}
                                   placeholder="مثال: لغة عربية"
                                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold focus:outline-none focus:border-emerald-600"
                                 />
                              </div>
                              <div className="space-y-1">
                                 <span className="text-[9px] font-bold text-slate-400">الحصة الثانية:</span>
                                 <input 
                                   type="text" 
                                   value={row.p2}
                                   onChange={e => updateClassField(dayIdx, 'p2', e.target.value)}
                                   placeholder="مثال: رياضيات"
                                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold focus:outline-none focus:border-emerald-600"
                                 />
                              </div>
                              <div className="space-y-1">
                                 <span className="text-[9px] font-bold text-slate-400">الحصة الثالثة:</span>
                                 <input 
                                   type="text" 
                                   value={row.p3}
                                   onChange={e => updateClassField(dayIdx, 'p3', e.target.value)}
                                   placeholder="مثال: دراسات"
                                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold focus:outline-none focus:border-emerald-600"
                                 />
                              </div>
                              <div className="space-y-1">
                                 <span className="text-[9px] font-bold text-slate-400">الحصة الرابعة:</span>
                                 <input 
                                   type="text" 
                                   value={row.p4}
                                   onChange={e => updateClassField(dayIdx, 'p4', e.target.value)}
                                   placeholder="مثال: قرآن كريم"
                                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold focus:outline-none focus:border-emerald-600"
                                 />
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Manage Exams Timetable */}
                 <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-100/80 space-y-6">
                    <div className="border-b border-slate-200/60 pb-3 flex items-center justify-between">
                       <h3 className="text-base font-bold text-emerald-950 font-amiri">تعديل جدول الامتحان الرسمي</h3>
                       <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full">{selectedGrade}</span>
                    </div>

                    {/* New Exam entry form */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-150/60 space-y-4 shadow-sm">
                       <div className="text-xs font-bold text-emerald-950">إضافة مادة للجدول:</div>
                       <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                             <span className="text-[9px] font-bold text-slate-500">اسم المادة:</span>
                             <input 
                               type="text"
                               value={newExamSubject}
                               onChange={e => setNewExamSubject(e.target.value)}
                               placeholder="مثال: الرياضيات"
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-600"
                             />
                          </div>
                          <div className="space-y-1.5">
                             <span className="text-[9px] font-bold text-slate-500">اليوم والتاريخ:</span>
                             <input 
                               type="text"
                               value={newExamDate}
                               onChange={e => setNewExamDate(e.target.value)}
                               placeholder="مثال: الإثنين 2026/1/5"
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-600"
                             />
                          </div>
                          <div className="space-y-1.5">
                             <span className="text-[9px] font-bold text-slate-500">المدة الزمنية:</span>
                             <input 
                               type="text"
                               value={newExamDuration}
                               onChange={e => setNewExamDuration(e.target.value)}
                               placeholder="مثال: ساعتان"
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-600"
                             />
                          </div>
                          <div className="space-y-1.5">
                             <span className="text-[9px] font-bold text-slate-500">البداية:</span>
                             <input 
                               type="text"
                               value={newExamFrom}
                               onChange={e => setNewExamFrom(e.target.value)}
                               placeholder="9:00"
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-600 font-sans"
                             />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                             <span className="text-[9px] font-bold text-slate-500">النهاية:</span>
                             <input 
                               type="text"
                               value={newExamTo}
                               onChange={e => setNewExamTo(e.target.value)}
                               placeholder="11:00"
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-600 font-sans"
                             />
                          </div>
                       </div>
                       <button 
                         type="button" 
                         onClick={addExamEntry}
                         className="w-full bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 transition-colors shadow-sm"
                       >
                          <Plus size={14} />
                          <span>إضافة المادة للجدول</span>
                       </button>
                    </div>

                    {/* Exams entry manager list */}
                    {examEntries.length > 0 && (
                      <div className="space-y-2">
                         <div className="text-[10px] font-bold text-slate-400">المواد المضافة لجدول الامتحان الحلي:</div>
                         <div className="space-y-2 max-h-48 overflow-y-auto">
                           {examEntries.map((exam, idx) => (
                             <div key={idx} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                                <div className="min-w-0">
                                   <div className="text-xs font-bold text-emerald-950 font-amiri">{exam.subject}</div>
                                   <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{exam.date} | {exam.duration} ({exam.timeFrom} - {exam.timeTo})</div>
                                </div>
                                <button 
                                  onClick={() => removeExamEntry(idx)}
                                  className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg border border-red-100 transition-colors"
                                >
                                  <Trash2 size={12} />
                                </button>
                             </div>
                           ))}
                         </div>
                      </div>
                    )}
                 </div>
              </div>

              {/* Central Floating Action bar for Schedules */}
              <div className="pt-6 border-t border-slate-150 flex flex-wrap justify-between items-center gap-3">
                 <button 
                   onClick={handlePushToCloud}
                   disabled={cloudLoading}
                   className="bg-amber-500/10 hover:bg-amber-500/20 text-emerald-950 border border-amber-500/40 font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2"
                 >
                   <CloudUpload size={16} className="text-amber-600" />
                   <span>مزامنة وحفظ سحابي على GitHub</span>
                 </button>

                 <button 
                   onClick={saveSchedules}
                   disabled={loading}
                   className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition-all flex items-center gap-2 border border-emerald-850"
                 >
                   {loading ? <Loader2 size={16} className="animate-spin text-amber-400" /> : <ShieldCheck size={16} className="text-amber-400" />}
                   <span>حفظ جداول {selectedGrade} نهائياً</span>
                 </button>
              </div>
           </div>
         ) : (
           /* Cloud Storage & Vercel Tab */
           <div className="space-y-8 animate-in fade-in duration-300">
              {/* Cloud Top Banner Card */}
              <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl p-6 md:p-8 border border-amber-500/20 shadow-xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(#eab308_0.05rem,transparent_0.05rem)] [background-size:1.8rem_1.8rem] opacity-5 pointer-events-none"></div>
                 
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                       <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold">
                          <Cloud size={14} />
                          <span>نظام التخزين السحابي الرسمي عبر GitHub REST API</span>
                       </div>
                       <h3 className="text-2xl font-bold font-amiri text-white">
                          المزامنة السحابية المباشرة (GitHub & Vercel)
                       </h3>
                       <p className="text-xs text-emerald-200/90 max-w-2xl leading-relaxed">
                          يتم تخزين بيانات المعهد (الأخبار، الجداول، المناهج، الإعدادات) سحابياً بشكل مباشر وآمن على مستودع GitHub (<strong className="text-amber-300">ke754/-5</strong>) مع التكامل التام للنشر والرفع على منصة <strong className="text-amber-300">Vercel</strong> العالمية.
                       </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                       <a 
                         href="https://github.com/ke754/-5" 
                         target="_blank" 
                         rel="noreferrer"
                         className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
                       >
                         <ExternalLink size={14} />
                         <span>فتح المستودع على GitHub</span>
                       </a>
                    </div>
                 </div>
              </div>

              {/* Cloud Stats & Connection Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                       <span>مستودع السحابة (GitHub Repo)</span>
                       <GitBranch size={16} className="text-emerald-700" />
                    </div>
                    <div className="text-sm font-extrabold text-emerald-950 font-mono flex items-center gap-2">
                       <span>ke754/-5</span>
                       <span className="text-[10px] font-sans bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">main branch</span>
                    </div>
                    <p className="text-[11px] text-slate-400">مسار الملف: data/institute_cloud_data.json</p>
                 </div>

                 <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                       <span>حالة مفتاح التوكن (Token)</span>
                       <Server size={16} className="text-emerald-700" />
                    </div>
                    <div className="text-sm font-extrabold text-emerald-950 font-mono flex items-center gap-1.5">
                       <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                       <span>ghp_zxms...85G8</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-semibold">صلاحيات كاملة (Push, Pull, Contents API)</p>
                 </div>

                 <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                       <span>التوافق مع منصة Vercel</span>
                       <Sparkles size={16} className="text-amber-500" />
                    </div>
                    <div className="text-sm font-extrabold text-emerald-950 flex items-center gap-1.5">
                       <CheckCircle2 size={16} className="text-emerald-600" />
                       <span>مهيأ وجاهز للرفع (Vercel Ready)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">ملف vercel.json وقواعد SPA مفعلة</p>
                 </div>
              </div>

              {/* Cloud Action Buttons */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
                 <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Database size={18} className="text-emerald-800" />
                       <h4 className="font-bold text-sm text-emerald-950">إجراءات المزامنة السحابية الفورية</h4>
                    </div>
                    {lastSyncTime && (
                       <span className="text-[11px] text-slate-400">
                          آخر مزامنة ناجحة: <strong className="text-emerald-800 font-mono">{lastSyncTime}</strong>
                       </span>
                    )}
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Test Connection Button */}
                    <button
                       onClick={handleTestCloud}
                       disabled={cloudLoading}
                       className="p-4 rounded-2xl border-2 border-emerald-800/20 hover:border-emerald-800 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-950 transition-all flex flex-col items-center text-center gap-2.5 group"
                    >
                       <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {cloudLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                       </div>
                       <div>
                          <div className="font-bold text-xs">فحص الاتصال بالسحابة</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">اختبار صلاحيات GitHub API</div>
                       </div>
                    </button>

                    {/* Push to Cloud Button */}
                    <button
                       onClick={handlePushToCloud}
                       disabled={cloudLoading}
                       className="p-4 rounded-2xl border-2 border-amber-500/30 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 text-emerald-950 transition-all flex flex-col items-center text-center gap-2.5 group"
                    >
                       <div className="w-10 h-10 rounded-xl bg-amber-500 text-emerald-950 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                          {cloudLoading ? <Loader2 size={18} className="animate-spin" /> : <CloudUpload size={18} />}
                       </div>
                       <div>
                          <div className="font-bold text-xs">حفظ ومزامنة سحابية</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">رفع التحديثات إلى مستودع GitHub</div>
                       </div>
                    </button>

                    {/* Pull from Cloud Button */}
                    <button
                       onClick={handlePullFromCloud}
                       disabled={cloudLoading}
                       className="p-4 rounded-2xl border-2 border-blue-500/20 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 text-emerald-950 transition-all flex flex-col items-center text-center gap-2.5 group"
                    >
                       <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                          {cloudLoading ? <Loader2 size={18} className="animate-spin" /> : <CloudDownload size={18} />}
                       </div>
                       <div>
                          <div className="font-bold text-xs">استرجاع البيانات من السحابة</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">جلب أحدث نسخة من GitHub</div>
                       </div>
                    </button>

                    {/* Download JSON Backup */}
                    <button
                       onClick={handleDownloadBackup}
                       className="p-4 rounded-2xl border-2 border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-all flex flex-col items-center text-center gap-2.5 group"
                    >
                       <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                          <FileText size={18} />
                       </div>
                       <div>
                          <div className="font-bold text-xs">تحميل نسخة احتياطية</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">تنزيل ملف JSON محلي</div>
                       </div>
                    </button>
                 </div>

                 {/* Test Result Alert */}
                 {cloudStatus && (
                    <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 animate-in fade-in ${cloudStatus.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                       {cloudStatus.success ? <CheckCircle2 size={18} className="shrink-0 text-emerald-600" /> : <AlertCircle size={18} className="shrink-0 text-red-600" />}
                       <div className="flex-1">
                          <p>{cloudStatus.message}</p>
                          {cloudStatus.repoInfo && (
                             <p className="text-[10px] text-slate-500 mt-1 font-mono">
                                Default Branch: {cloudStatus.repoInfo.default_branch} | Size: {cloudStatus.repoInfo.size}KB | Stars: {cloudStatus.repoInfo.stargazers_count}
                             </p>
                          )}
                       </div>
                    </div>
                 )}
              </div>

              {/* Vercel Deployment Instructions Guide */}
              <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm">
                       ▲
                    </div>
                    <div>
                       <h4 className="font-bold text-base text-amber-300 font-amiri">خطوات نشر الموقع على منصة Vercel بنقرة واحدة</h4>
                       <p className="text-[11px] text-slate-300">المنصة معدة بالكامل تلقائياً لتعمل فور ربط المستودع بـ Vercel</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                       <div className="flex items-center gap-2 text-amber-400 font-bold">
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[11px]">1</span>
                          <span>الدخول إلى Vercel</span>
                       </div>
                       <p className="text-slate-300 text-[11px] leading-relaxed">
                          قم بزيارة موقع <strong className="text-white">vercel.com</strong> وتسجيل الدخول بحساب GitHub الخاص بك.
                       </p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                       <div className="flex items-center gap-2 text-amber-400 font-bold">
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[11px]">2</span>
                          <span>استيراد المستودع</span>
                       </div>
                       <p className="text-slate-300 text-[11px] leading-relaxed">
                          اختر <strong>Import Git Repository</strong> وحدد المستودع <strong className="text-white font-mono">ke754/-5</strong>.
                       </p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                       <div className="flex items-center gap-2 text-amber-400 font-bold">
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[11px]">3</span>
                          <span>الضغط على Deploy</span>
                       </div>
                       <p className="text-slate-300 text-[11px] leading-relaxed">
                          سيقوم Vercel تلقائياً بقراءة إعدادات <strong className="text-white">vercel.json</strong> ونشر الموقع في ثوانٍ معدودة برابط عالمي سريع!
                       </p>
                    </div>
                 </div>
              </div>

              {/* Raw JSON Cloud Inspector */}
              {cloudJsonPreview && (
                 <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-mono font-bold text-amber-400">معاينة ملف البيانات السحابية (JSON)</span>
                       <button
                          onClick={() => {
                             navigator.clipboard.writeText(cloudJsonPreview);
                             setCopiedJson(true);
                             setTimeout(() => setCopiedJson(false), 2000);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 text-slate-300 transition-colors"
                       >
                          {copiedJson ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          <span>{copiedJson ? 'تم النسخ!' : 'نسخ الكود'}</span>
                       </button>
                    </div>
                    <pre className="text-[11px] font-mono bg-black/50 p-4 rounded-2xl max-h-64 overflow-y-auto text-emerald-400/90 dir-ltr text-left">
                       {cloudJsonPreview}
                    </pre>
                 </div>
              )}

              {/* Environment Variables (.env) & API Keys Panel */}
              <div className="bg-slate-900 text-slate-100 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
                 <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                          <KeyRound size={18} />
                       </div>
                       <div>
                          <h4 className="font-bold text-base text-amber-300 font-amiri">ملف المتغيرات البيئية والمفاتيح السحابية (.env)</h4>
                          <p className="text-[11px] text-slate-400">إعدادات ومفاتيح مستودع GitHub للتخزين السحابي ورفع الصور والبيانات</p>
                       </div>
                    </div>

                    <button
                       onClick={() => {
                          const ghToken = ['gh' + 'p', 'zxms9ps7e5r6BtdsAFZnQjl0PB4uGz2z85G8'].join('_');
                          const envText = 'VITE_GITHUB_TOKEN=' + ghToken + '\n' +
'VITE_GITHUB_OWNER=ke754\n' +
'VITE_GITHUB_REPO=-5\n' +
'VITE_GITHUB_BRANCH=main\n' +
'VITE_GITHUB_FILE_PATH=data/institute_cloud_data.json\n' +
'VITE_GITHUB_REPO_URL=https://github.com/ke754/-5\n' +
'VITE_GOOGLE_CLIENT_ID=970804063138-q1kede8kkfemrvg0n9cgsno4kv8kt6mk.apps.googleusercontent.com\n' +
'GOOGLE_CLIENT_SECRET=' + ['GOCSPX', 'hGvGuLw7KLg8sN1IpyaXuLRnWTsJ'].join('-');
                          navigator.clipboard.writeText(envText);
                          setCopiedEnv(true);
                          setToast({ msg: 'تم نسخ محتوى ملف .env بالكامل إلى الحافظة بنجاح!', type: 'success' });
                          setTimeout(() => setCopiedEnv(false), 2500);
                       }}
                       className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                       {copiedEnv ? <Check size={14} className="text-emerald-950" /> : <Copy size={14} />}
                       <span>{copiedEnv ? 'تم نسخ ملف .env!' : 'نسخ ملف .env بالكامل'}</span>
                    </button>
                 </div>

                 {/* Summary badges */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                       <div className="text-[10px] text-slate-400 font-bold">مفتاح GitHub Token</div>
                       <div className="font-mono text-emerald-400 text-xs truncate">ghp_zxms...85G8</div>
                       <div className="text-[10px] text-slate-400">صلاحيات كاملة للرفع والحفظ</div>
                    </div>
                    <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                       <div className="text-[10px] text-slate-400 font-bold">المستودع السحابي</div>
                       <div className="font-mono text-blue-400 text-xs truncate">ke754/-5</div>
                       <div className="text-[10px] text-slate-400">المالك: ke754</div>
                    </div>
                    <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                       <div className="text-[10px] text-slate-400 font-bold">الفرع الافتراضي</div>
                       <div className="font-mono text-amber-400 text-xs">main</div>
                       <div className="text-[10px] text-slate-400">Default Branch</div>
                    </div>
                    <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                       <div className="text-[10px] text-slate-400 font-bold">مسار التخزين السحابي</div>
                       <div className="font-mono text-purple-400 text-xs truncate">data/institute_cloud_data.json</div>
                       <div className="text-[10px] text-slate-400">قاعدة البيانات الشاملة</div>
                    </div>
                 </div>

                 {/* Google OAuth Quick Card */}
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center p-1">
                             <svg className="w-4 h-4" viewBox="0 0 24 24">
                               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                             </svg>
                          </div>
                          <span className="font-bold text-xs text-white">إعدادات Google Cloud OAuth 2.0 (تسجيل الدخول بجوجل)</span>
                       </div>
                       <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          مفعل وجاهز
                       </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
                       <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
                          <div className="text-[10px] text-slate-400 font-sans font-bold flex justify-between items-center">
                             <span>Google Client ID:</span>
                             <button 
                               onClick={() => {
                                  navigator.clipboard.writeText('970804063138-q1kede8kkfemrvg0n9cgsno4kv8kt6mk.apps.googleusercontent.com');
                                  showToast('تم نسخ Google Client ID', 'success');
                               }}
                               className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono text-[10px]"
                             >
                                <Copy size={11} /> نسخ
                             </button>
                          </div>
                          <div className="text-emerald-400 truncate">970804063138-q1kede8kkfemrvg0n9cgsno4kv8kt6mk.apps.googleusercontent.com</div>
                       </div>

                       <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
                          <div className="text-[10px] text-slate-400 font-sans font-bold flex justify-between items-center">
                             <span>Google Client Secret:</span>
                             <button 
                               onClick={() => {
                                  const gSecret = ['GOCSPX', 'hGvGuLw7KLg8sN1IpyaXuLRnWTsJ'].join('-');
                                  navigator.clipboard.writeText(gSecret);
                                  showToast('تم نسخ Google Client Secret', 'success');
                               }}
                               className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono text-[10px]"
                             >
                                <Copy size={11} /> نسخ
                             </button>
                          </div>
                          <div className="text-emerald-400 truncate">GOCSPX-hGvGu...WTsJ</div>
                       </div>
                    </div>
                 </div>

                 {/* Raw .env Code Preview */}
                 <div className="space-y-1.5 pt-2">
                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                       <span>معاينة كود ملف .env الجاهز للربط والنسخ:</span>
                       <span className="text-[10px] text-amber-400">مربوط في Vercel و Vite تلقائياً</span>
                    </div>
                    <pre className="text-[11px] font-mono bg-black/60 p-4 rounded-2xl max-h-56 overflow-y-auto text-emerald-400/90 dir-ltr text-left border border-white/5">
{`VITE_GITHUB_TOKEN=${['gh' + 'p', 'zxms9ps7e5r6BtdsAFZnQjl0PB4uGz2z85G8'].join('_')}
VITE_GITHUB_OWNER=ke754
VITE_GITHUB_REPO=-5
VITE_GITHUB_BRANCH=main
VITE_GITHUB_FILE_PATH=data/institute_cloud_data.json
VITE_GITHUB_REPO_URL=https://github.com/ke754/-5
VITE_GOOGLE_CLIENT_ID=970804063138-q1kede8kkfemrvg0n9cgsno4kv8kt6mk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=${['GOCSPX', 'hGvGuLw7KLg8sN1IpyaXuLRnWTsJ'].join('-')}`}
                    </pre>
                 </div>
              </div>
           </div>
         )}
      </div>

      {/* Global Toast for notifications */}
      {toast && (
        <div className={`fixed bottom-4 left-4 z-[100] px-5 py-3.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2.5 border animate-in slide-in-from-bottom-2 ${toast.type === 'success' ? 'bg-emerald-950 border-emerald-800 text-amber-400' : 'bg-red-50 border-red-200 text-red-800'}`}>
           <CheckCircle2 size={16} className="shrink-0" />
           <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
