import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ChevronDown, ChevronLeft, PlayCircle, Book, PauseCircle, Volume2, Users, 
  AlertTriangle, Loader2, Music, Sparkles, X, Search, SkipForward, SkipBack, 
  SlidersHorizontal, CheckCircle2, Bookmark, Layers, Check, RefreshCw
} from 'lucide-react';
import { Grade, Surah, Reciter } from '../types';
import { CURRICULUM_DATA, RECITERS, ALL_SURAHS, getSurahById, JUZ_DATA, formatSurahCount } from '../constants';

interface QuranSidebarProps {
  onClose?: () => void;
}

const QuranSidebar: React.FC<QuranSidebarProps> = ({ onClose }) => {
  // Navigation & Tab state
  const [activeTab, setActiveTab] = useState<'all' | 'curriculum' | 'juz'>('all');
  const [expandedGrade, setExpandedGrade] = useState<Grade | null>(Grade.PREP_1);
  const [expandedTerm, setExpandedTerm] = useState<'term1' | 'term2' | 'revision' | null>('term1');
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);

  // Audio Playback state
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Reciter state
  const [recitersList, setRecitersList] = useState<Reciter[]>(RECITERS);
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS[0]);
  const [showReciters, setShowReciters] = useState(false);
  const [reciterSearch, setReciterSearch] = useState('');
  const [loadingApiReciters, setLoadingApiReciters] = useState(false);

  // Search & Error states
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load additional reciters from mp3quran API
  useEffect(() => {
    const fetchApiReciters = async () => {
      try {
        setLoadingApiReciters(true);
        const res = await fetch('https://mp3quran.net/api/v3/reciters?language=ar');
        if (!res.ok) return;
        const data = await res.json();
        if (data && Array.isArray(data.reciters)) {
          const apiReciters: Reciter[] = [];
          data.reciters.forEach((r: any) => {
            if (r.moshaf && r.moshaf.length > 0) {
              const primaryMoshaf = r.moshaf[0];
              // Avoid duplicates with our curated list
              const alreadyExists = RECITERS.some(existing => existing.name.includes(r.name) || r.name.includes(existing.name));
              if (!alreadyExists && primaryMoshaf.server) {
                // Ensure server URL format
                let cleanServer = primaryMoshaf.server.replace(/^https?:\/\//, '').replace(/\/$/, '');
                let folder = '';
                const parts = cleanServer.split('/');
                if (parts.length > 1) {
                  cleanServer = parts[0].replace('.mp3quran.net', '');
                  folder = parts.slice(1).join('/');
                }
                apiReciters.push({
                  id: `api_${r.id}`,
                  name: `الشيخ ${r.name}`,
                  server: cleanServer,
                  folder: folder,
                  description: `${primaryMoshaf.name || 'حفص عن عاصم'} (${primaryMoshaf.surah_total || 114} سورة)`,
                });
              }
            }
          });
          // Merge while keeping Sheikh El-Minshawi strictly at index 0 & 1
          setRecitersList([...RECITERS, ...apiReciters]);
        }
      } catch (e) {
        // Fallback to local RECITERS
      } finally {
        setLoadingApiReciters(false);
      }
    };

    fetchApiReciters();
  }, []);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      // Auto-play next Surah
      if (currentPlaying && currentPlaying < 114) {
        const nextSurah = getSurahById(currentPlaying + 1);
        playSurah(nextSurah);
      } else {
        setIsPlaying(false);
        setCurrentPlaying(null);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentPlaying]);

  const toggleGrade = (grade: Grade) => {
    setExpandedGrade(expandedGrade === grade ? null : grade);
    setExpandedTerm('term1');
  };

  const toggleTerm = (term: 'term1' | 'term2' | 'revision') => {
    setExpandedTerm(expandedTerm === term ? null : term);
  };

  const playSurah = async (surah: Surah) => {
    setErrorMsg(null);
    
    // If clicking same surah that is playing, toggle play/pause
    if (currentPlaying === surah.id && !isLoading) {
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
      return;
    }

    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      setCurrentPlaying(surah.id);

      const paddedId = surah.id.toString().padStart(3, '0');
      let audioUrl = '';

      if (selectedReciter.folder) {
        audioUrl = `https://${selectedReciter.server}.mp3quran.net/${selectedReciter.folder}/${paddedId}.mp3`;
      } else if (selectedReciter.server.includes('mp3quran.net')) {
        const base = selectedReciter.server.endsWith('/') ? selectedReciter.server : `${selectedReciter.server}/`;
        audioUrl = `https://${base}${paddedId}.mp3`;
      } else {
        audioUrl = `https://${selectedReciter.server}.mp3quran.net/${paddedId}.mp3`;
      }
      
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.playbackRate = playbackRate;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsLoading(false);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Audio Playback Error:", err);
        handlePlaybackError();
      }
    }
  };

  const handlePlaybackError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    setErrorMsg("تعذر تشغيل هذا المقطع من السيرفر. يرجى تجربة قارئ آخر.");
    setTimeout(() => setErrorMsg(null), 5000);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const changeReciter = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    setShowReciters(false);
    setErrorMsg(null);
    if (currentPlaying) {
      const currentId = currentPlaying;
      setCurrentPlaying(null);
      setTimeout(() => {
        playSurah(getSurahById(currentId));
      }, 200);
    }
  };

  const playNextSurah = () => {
    if (!currentPlaying) return;
    const nextId = currentPlaying < 114 ? currentPlaying + 1 : 1;
    playSurah(getSurahById(nextId));
  };

  const playPrevSurah = () => {
    if (!currentPlaying) return;
    const prevId = currentPlaying > 1 ? currentPlaying - 1 : 114;
    playSurah(getSurahById(prevId));
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filtered surahs for the "all" tab
  const filteredAllSurahs = useMemo(() => {
    if (!searchQuery.trim()) return ALL_SURAHS;
    const q = searchQuery.trim().toLowerCase();
    return ALL_SURAHS.filter(s => 
      s.name.includes(q) || 
      s.id.toString() === q ||
      s.juz.toString() === q ||
      (s.juzList && s.juzList.some(j => j.toString() === q)) ||
      (s.juzText && s.juzText.includes(q))
    );
  }, [searchQuery]);

  // Grouped by Juz using authentic Quranic mapping
  const juzList = useMemo(() => {
    return JUZ_DATA.map(item => ({
      juz: item.juz,
      name: item.name,
      description: item.ayatDescription,
      surahs: item.surahIds.map(id => getSurahById(id)),
      surahEntries: item.surahEntries || []
    }));
  }, []);

  // Filtered juz for the "juz" tab
  const filteredJuzList = useMemo(() => {
    if (!searchQuery.trim()) return juzList;
    const q = searchQuery.trim().toLowerCase();
    return juzList.filter(item => 
      item.name.toLowerCase().includes(q) ||
      item.juz.toString() === q ||
      item.description.toLowerCase().includes(q) ||
      item.surahs.some(s => s.name.includes(q) || s.id.toString() === q)
    );
  }, [juzList, searchQuery]);

  // Filtered reciters in modal
  const filteredReciters = useMemo(() => {
    if (!reciterSearch.trim()) return recitersList;
    return recitersList.filter(r => r.name.toLowerCase().includes(reciterSearch.toLowerCase()) || r.description.toLowerCase().includes(reciterSearch.toLowerCase()));
  }, [reciterSearch, recitersList]);

  const currentPlayingSurah = currentPlaying ? getSurahById(currentPlaying) : null;

  return (
    <div className="h-full flex flex-col bg-white select-none border-l border-emerald-100 shadow-2xl relative">
      {/* Sidebar Header with Royal Islamic Aesthetic */}
      <div className="p-4 md:p-5 bg-gradient-to-b from-emerald-950 to-emerald-900 text-white shrink-0 relative overflow-hidden">
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500"></div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-400 text-emerald-950 p-2 rounded-xl shadow-md font-bold">
              <Book size={18} />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold font-amiri text-amber-300 leading-none">
                القرآن الكريم كاملاً (١١٤ سورة)
              </h2>
              <span className="text-[10px] text-emerald-200/90 block mt-1">
                معهد محمد صديق المنشاوي الإعدادي الثانوي
              </span>
            </div>
          </div>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="إغلاق"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Reciter Selector Box */}
        <div className="relative mt-2">
          <button 
            onClick={() => setShowReciters(!showReciters)}
            className="w-full bg-emerald-900/95 hover:bg-emerald-850 border border-emerald-700/80 rounded-xl px-3 py-2 flex items-center justify-between text-xs font-bold text-amber-200 transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2 truncate">
              <Users size={14} className="text-amber-400 shrink-0" />
              <span className="truncate">القارئ: {selectedReciter.name}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {selectedReciter.id.startsWith('minsh') && (
                <span className="text-[9px] bg-amber-400 text-emerald-950 px-1.5 py-0.5 rounded font-bold">الرئيسي</span>
              )}
              <ChevronDown size={14} className={`text-amber-300 transition-transform duration-300 ${showReciters ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Reciters Dropdown Modal */}
          {showReciters && (
            <div className="absolute left-0 right-0 mt-2 bg-white text-slate-800 border border-emerald-100 rounded-2xl shadow-2xl max-h-80 overflow-y-auto p-2 space-y-1.5 z-[70] animate-in fade-in slide-in-from-top-2">
              <div className="p-1.5 border-b border-slate-100">
                <input
                  type="text"
                  value={reciterSearch}
                  onChange={e => setReciterSearch(e.target.value)}
                  placeholder="ابحث عن قارئ..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="px-2 py-0.5 text-[9px] font-bold text-emerald-900 flex justify-between">
                <span>أئمة وقراء القرآن المعتمدون:</span>
                {loadingApiReciters && <span className="text-amber-600 animate-pulse">جاري المزامنة...</span>}
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                {filteredReciters.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => changeReciter(r)}
                    className={`w-full text-right p-2 rounded-xl transition-all flex flex-col gap-0.5 ${selectedReciter.id === r.id ? 'bg-emerald-950 text-white shadow-md' : 'hover:bg-emerald-50 text-slate-700'}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs">{r.name}</span>
                      {r.id.startsWith('minsh') ? (
                        <span className="text-[9px] bg-amber-400 text-emerald-950 px-1.5 py-0.5 rounded font-bold">قارئ المعهد</span>
                      ) : (
                        selectedReciter.id === r.id && <Sparkles size={12} className="text-amber-400" />
                      )}
                    </div>
                    <span className={`text-[9px] leading-tight ${selectedReciter.id === r.id ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {r.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Surah Search Input */}
        <div className="relative mt-2">
          <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن أي سورة (مثال: يس، الكهف، 114)..."
            className="w-full bg-emerald-950/70 border border-emerald-800/80 rounded-xl pr-8 pl-3 py-1.5 text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:border-amber-400 font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mt-2 p-2 bg-red-900/80 text-red-100 text-[10px] font-bold rounded-xl flex items-center gap-1.5 border border-red-700 animate-pulse">
            <AlertTriangle size={12} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Audio Player Dashboard & Progress Bar */}
        {currentPlaying && currentPlayingSurah && (
          <div className="mt-3 bg-emerald-950/90 rounded-2xl p-3 border border-amber-400/40 shadow-xl space-y-2 relative">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="font-amiri text-sm">سورة {currentPlayingSurah.name}</span>
                <span className="text-[10px] text-emerald-300 font-sans">({currentPlayingSurah.type} • {currentPlayingSurah.ayat} آية)</span>
              </div>
              <span className="text-[10px] text-amber-200/80 font-sans">
                {currentPlayingSurah.juzText || `الجزء ${currentPlayingSurah.juz}`}
              </span>
            </div>

            {/* Time seeker progress */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-emerald-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[9px] font-sans text-emerald-300/80 font-semibold">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Media Controls Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-emerald-850">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
                    setPlaybackRate(nextRate);
                    if (audioRef.current) audioRef.current.playbackRate = nextRate;
                  }}
                  className="px-2 py-0.5 rounded bg-emerald-900 hover:bg-emerald-800 text-[9px] font-sans font-bold text-amber-300"
                  title="سرعة التلاوة"
                >
                  {playbackRate}x
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={playPrevSurah}
                  className="p-1.5 text-emerald-300 hover:text-white transition-colors"
                  title="السورة السابقة"
                >
                  <SkipForward size={16} />
                </button>

                <button
                  onClick={() => playSurah(currentPlayingSurah)}
                  className="w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center justify-center shadow-md active:scale-95 transition-all"
                  title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isPlaying ? (
                    <PauseCircle size={18} />
                  ) : (
                    <PlayCircle size={18} />
                  )}
                </button>

                <button 
                  onClick={playNextSurah}
                  className="p-1.5 text-emerald-300 hover:text-white transition-colors"
                  title="السورة التالية"
                >
                  <SkipBack size={16} />
                </button>
              </div>

              <span className="text-[9px] text-emerald-300 truncate max-w-[90px]">
                {selectedReciter.name.replace('الشيخ ', '')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Native Audio Element */}
      <audio 
        ref={audioRef} 
        onError={handlePlaybackError}
        className="hidden"
        preload="auto"
        crossOrigin="anonymous"
      />

      {/* Tabs Switcher: All 114 Surahs vs Prep/Sec Curriculum vs Juz */}
      <div className="flex border-b border-emerald-100 bg-slate-50/80 p-1.5 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'all' ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-600 hover:bg-emerald-50'}`}
        >
          المصحف كاملاً (١١٤)
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'curriculum' ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-600 hover:bg-emerald-50'}`}
        >
          مقرر الصفوف
        </button>
        <button
          onClick={() => setActiveTab('juz')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'juz' ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-600 hover:bg-emerald-50'}`}
        >
          الأجزاء (٣٠)
        </button>
      </div>
      
      {/* Scrollable Surahs List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-16">
        
        {/* TAB 1: Complete Holy Quran (114 Surahs) */}
        {activeTab === 'all' && (
          <div className="divide-y divide-slate-100">
            {filteredAllSurahs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                لم يتم العثور على سورة مطابقة للبحث
              </div>
            ) : (
              filteredAllSurahs.map((surah) => {
                const isCurrent = currentPlaying === surah.id;
                return (
                  <div
                    key={surah.id}
                    onClick={() => playSurah(surah)}
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer group transition-all hover:bg-emerald-50/60 ${isCurrent ? 'bg-emerald-50/80 border-r-4 border-emerald-800' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Number badge */}
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-sans font-bold text-xs shrink-0 ${isCurrent ? 'bg-emerald-950 text-amber-300' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-900'}`}>
                        {surah.id}
                      </span>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className={`font-amiri font-bold text-sm ${isCurrent ? 'text-emerald-950 font-extrabold' : 'text-slate-800 group-hover:text-emerald-900'}`}>
                            سورة {surah.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-sans">
                            {surah.type}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                          {surah.ayat} آية • {surah.juzText || `الجزء ${surah.juz}`}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 mr-2">
                      {isCurrent ? (
                        isLoading ? (
                          <Loader2 size={18} className="animate-spin text-emerald-800" />
                        ) : isPlaying ? (
                          <PauseCircle size={18} className="text-emerald-800" />
                        ) : (
                          <PlayCircle size={18} className="text-emerald-800" />
                        )
                      ) : (
                        <PlayCircle size={18} className="text-slate-300 group-hover:text-emerald-800 group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: Official Al-Azhar Preparatory & Secondary Curriculum */}
        {activeTab === 'curriculum' && (
          <div className="divide-y divide-slate-100">
            {Object.values(Grade).map((grade) => (
              <div key={grade} className="bg-white">
                <button
                  onClick={() => toggleGrade(grade)}
                  className={`w-full text-right px-4 py-3.5 flex items-center justify-between hover:bg-emerald-50/50 transition-all ${expandedGrade === grade ? 'bg-emerald-50/70 text-emerald-950 font-bold border-r-4 border-emerald-800' : 'text-slate-700'}`}
                >
                  <span className="text-xs font-bold font-amiri md:text-sm">{grade}</span>
                  {expandedGrade === grade ? <ChevronDown size={15} className="text-emerald-800" /> : <ChevronLeft size={15} className="text-slate-400" />}
                </button>

                {expandedGrade === grade && (
                  <div className="bg-slate-50/60 border-t border-slate-100">
                    {/* Term 1 */}
                    <button
                      onClick={() => toggleTerm('term1')}
                      className={`w-full text-right px-5 py-2.5 flex items-center justify-between border-b border-slate-100 hover:bg-white text-xs ${expandedTerm === 'term1' ? 'text-emerald-900 font-bold bg-white' : 'text-slate-600'}`}
                    >
                      <div className="flex flex-col text-right">
                        <span className="font-bold">الفصل الدراسي الأول</span>
                        {CURRICULUM_DATA[grade]?.term1Note && (
                          <span className="text-[10px] text-amber-700 font-normal mt-0.5">
                            الحفظ المقرر: {CURRICULUM_DATA[grade].term1Note}
                          </span>
                        )}
                      </div>
                      <ChevronDown size={13} className={`transform transition-transform text-slate-400 shrink-0 ${expandedTerm === 'term1' ? 'rotate-180 text-emerald-700' : 'rotate-90'}`} />
                    </button>
                    {expandedTerm === 'term1' && (
                      <div className="px-6 py-1 bg-white border-b border-slate-100 max-h-64 overflow-y-auto custom-scrollbar divide-y divide-slate-50">
                        {(CURRICULUM_DATA[grade]?.term1 || []).map((surah) => (
                          <div 
                            key={surah.id}
                            onClick={() => playSurah(surah)}
                            className={`flex items-center justify-between py-2.5 cursor-pointer group hover:text-emerald-700 transition-all ${currentPlaying === surah.id ? 'text-emerald-900 font-bold bg-emerald-50/50 px-2 rounded-lg' : 'text-slate-600'}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-sans font-bold text-slate-300 group-hover:text-emerald-700">
                                {surah.id}
                              </span>
                              <span className="text-xs font-amiri">سورة {surah.name}</span>
                              <span className="text-[9px] text-slate-400 font-sans">({surah.ayat} آية)</span>
                            </div>
                            <div className="shrink-0">
                              {currentPlaying === surah.id ? (
                                isPlaying ? <PauseCircle size={15} className="text-emerald-800" /> : <PlayCircle size={15} className="text-emerald-800" />
                              ) : (
                                <PlayCircle size={15} className="text-slate-300 group-hover:text-emerald-700" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Term 2 */}
                    <button
                      onClick={() => toggleTerm('term2')}
                      className={`w-full text-right px-5 py-2.5 flex items-center justify-between hover:bg-white text-xs ${expandedTerm === 'term2' ? 'text-emerald-900 font-bold bg-white border-b border-slate-100' : 'text-slate-600'}`}
                    >
                      <div className="flex flex-col text-right">
                        <span className="font-bold">الفصل الدراسي الثاني</span>
                        {CURRICULUM_DATA[grade]?.term2Note && (
                          <span className="text-[10px] text-amber-700 font-normal mt-0.5">
                            الحفظ المقرر: {CURRICULUM_DATA[grade].term2Note}
                          </span>
                        )}
                      </div>
                      <ChevronDown size={13} className={`transform transition-transform text-slate-400 shrink-0 ${expandedTerm === 'term2' ? 'rotate-180 text-emerald-700' : 'rotate-90'}`} />
                    </button>
                    {expandedTerm === 'term2' && (
                      <div className="px-6 py-1 bg-white border-b border-slate-100 max-h-64 overflow-y-auto custom-scrollbar divide-y divide-slate-50">
                        {(CURRICULUM_DATA[grade]?.term2 || []).map((surah) => (
                          <div 
                            key={surah.id}
                            onClick={() => playSurah(surah)}
                            className={`flex items-center justify-between py-2.5 cursor-pointer group hover:text-emerald-700 transition-all ${currentPlaying === surah.id ? 'text-emerald-900 font-bold bg-emerald-50/50 px-2 rounded-lg' : 'text-slate-600'}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-sans font-bold text-slate-300 group-hover:text-emerald-700">
                                {surah.id}
                              </span>
                              <span className="text-xs font-amiri">سورة {surah.name}</span>
                              <span className="text-[9px] text-slate-400 font-sans">({surah.ayat} آية)</span>
                            </div>
                            <div className="shrink-0">
                              {currentPlaying === surah.id ? (
                                isPlaying ? <PauseCircle size={15} className="text-emerald-800" /> : <PlayCircle size={15} className="text-emerald-800" />
                              ) : (
                                <PlayCircle size={15} className="text-slate-300 group-hover:text-emerald-700" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Revision (الماضي) */}
                    {CURRICULUM_DATA[grade]?.revisionNote && (
                      <>
                        <button
                          onClick={() => toggleTerm('revision')}
                          className={`w-full text-right px-5 py-2.5 flex items-center justify-between hover:bg-white text-xs border-t border-slate-100 ${expandedTerm === 'revision' ? 'text-emerald-900 font-bold bg-white' : 'text-slate-600'}`}
                        >
                          <div className="flex flex-col text-right">
                            <span className="font-bold flex items-center gap-1.5 text-emerald-850">
                              <span>المراجعة (الماضي)</span>
                              <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-sans">تثبيت</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal mt-0.5">
                              {CURRICULUM_DATA[grade].revisionNote}
                            </span>
                          </div>
                          <ChevronDown size={13} className={`transform transition-transform text-slate-400 shrink-0 ${expandedTerm === 'revision' ? 'rotate-180 text-emerald-700' : 'rotate-90'}`} />
                        </button>
                        {expandedTerm === 'revision' && (
                          <div className="px-6 py-1 bg-white max-h-64 overflow-y-auto custom-scrollbar divide-y divide-slate-50">
                            {(CURRICULUM_DATA[grade]?.revisionSurahs || []).map((surah) => (
                              <div 
                                key={surah.id}
                                onClick={() => playSurah(surah)}
                                className={`flex items-center justify-between py-2.5 cursor-pointer group hover:text-emerald-700 transition-all ${currentPlaying === surah.id ? 'text-emerald-900 font-bold bg-emerald-50/50 px-2 rounded-lg' : 'text-slate-600'}`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-sans font-bold text-slate-300 group-hover:text-emerald-700">
                                    {surah.id}
                                  </span>
                                  <span className="text-xs font-amiri">سورة {surah.name}</span>
                                  <span className="text-[9px] text-slate-400 font-sans">({surah.ayat} آية)</span>
                                </div>
                                <div className="shrink-0">
                                  {currentPlaying === surah.id ? (
                                    isPlaying ? <PauseCircle size={15} className="text-emerald-800" /> : <PlayCircle size={15} className="text-emerald-800" />
                                  ) : (
                                    <PlayCircle size={15} className="text-slate-300 group-hover:text-emerald-700" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: All 30 Juz */}
        {activeTab === 'juz' && (
          <div className="divide-y divide-slate-100">
            {filteredJuzList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                لم يتم العثور على أجزاء أو سور مطابقة للبحث
              </div>
            ) : (
              filteredJuzList.map((item) => (
                <div key={item.juz} className="bg-white">
                  <button
                    onClick={() => setSelectedJuz(selectedJuz === item.juz ? null : item.juz)}
                    className={`w-full text-right px-4 py-3 flex items-center justify-between hover:bg-emerald-50/50 transition-all ${selectedJuz === item.juz ? 'bg-emerald-50/80 font-bold text-emerald-950 border-r-4 border-emerald-800' : 'text-slate-700'}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-emerald-900 text-amber-300 font-sans text-xs flex items-center justify-center font-bold shrink-0">
                        {item.juz}
                      </span>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-amiri text-xs md:text-sm font-bold text-emerald-950">
                            {item.name}
                          </span>
                          <span className="text-[9px] bg-emerald-100/70 text-emerald-900 px-2 py-0.5 rounded-full font-sans font-bold">
                            {formatSurahCount(item.surahs.length)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans truncate mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <ChevronDown size={14} className={`text-emerald-800 shrink-0 transform transition-transform ${selectedJuz === item.juz ? 'rotate-180' : ''}`} />
                  </button>

                  {selectedJuz === item.juz && (
                    <div className="px-5 py-2 bg-slate-50/70 border-t border-slate-100 divide-y divide-slate-100">
                      {item.surahs.map((surah) => {
                        const entry = item.surahEntries?.find(e => e.surahId === surah.id);
                        const isCurrent = currentPlaying === surah.id;
                        return (
                          <div
                            key={surah.id}
                            onClick={() => playSurah(surah)}
                            className={`flex items-center justify-between py-2.5 cursor-pointer hover:bg-white rounded-xl px-2.5 transition-all ${isCurrent ? 'bg-white shadow-sm border border-emerald-200 font-bold text-emerald-900' : 'text-slate-700'}`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center font-sans font-bold text-[10px] shrink-0 ${isCurrent ? 'bg-emerald-900 text-amber-300' : 'bg-slate-100 text-slate-400'}`}>
                                {surah.id}
                              </span>
                              <div className="truncate">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-amiri font-bold text-emerald-950">
                                    سورة {surah.name}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-sans">
                                    ({surah.type} • {surah.ayat} آية)
                                  </span>
                                </div>
                                {entry?.ayatRange && (
                                  <div className="text-[10px] text-amber-800 font-sans font-medium mt-0.5">
                                    المقرر بالجزء: {entry.ayatRange}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="shrink-0 mr-2">
                              {isCurrent ? (
                                isLoading ? (
                                  <Loader2 size={16} className="animate-spin text-emerald-800" />
                                ) : isPlaying ? (
                                  <PauseCircle size={16} className="text-emerald-800" />
                                ) : (
                                  <PlayCircle size={16} className="text-emerald-800" />
                                )
                              ) : (
                                <PlayCircle size={16} className="text-slate-300 hover:text-emerald-700 hover:scale-110 transition-transform" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Sidebar Footer badge */}
      <div className="p-2.5 bg-gradient-to-r from-emerald-950 to-emerald-900 text-amber-300 text-[10px] text-center font-bold shrink-0 border-t border-amber-500/20 flex items-center justify-center gap-1.5">
        <Sparkles size={11} className="text-amber-400" />
        <span>بصوت فضيلة الشيخ محمد صديق المنشاوي وكبار القراء</span>
      </div>
    </div>
  );
};

export default QuranSidebar;
