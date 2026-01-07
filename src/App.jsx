import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Settings, X, Clock, Sparkles, BookOpen, Layers, Palette, Check, Upload, FileJson, Copy, AlertCircle } from 'lucide-react';

// --- 初期データ ---
const INITIAL_WORDS = [
  { id: 1, en: "comprehensive", pos: "形容詞", ja: "包括的な、総合的な", exEn: "We need a comprehensive guide.", exJa: "私たちには包括的なガイドが必要です。" },
  { id: 2, en: "innovation", pos: "名詞", ja: "革新、刷新", exEn: "Innovation distinguishes between a leader and a follower.", exJa: "革新はリーダーとフォロワーを区別する。" },
  { id: 3, en: "mandatory", pos: "形容詞", ja: "義務的な、必須の", exEn: "Attendance at the meeting is mandatory.", exJa: "会議への出席は義務です。" },
  { id: 4, en: "subsequent", pos: "形容詞", ja: "その後の、次の", exEn: "Subsequent events proved him wrong.", exJa: "その後の出来事が彼の誤りを証明した。" },
  { id: 5, en: "incentive", pos: "名詞", ja: "動機、報奨金", exEn: "There is no incentive to work harder.", exJa: "もっと一生懸命働く動機がない。" },
];

// --- テーマ定義 (変更なし) ---
const THEMES = {
  stylish: {
    id: 'stylish',
    label: 'Midnight Blur',
    bgClass: 'bg-slate-950',
    textMain: 'text-white',
    textSub: 'text-slate-400',
    accent: 'text-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    cardBorder: 'border-slate-900',
    buttonBg: 'bg-slate-800/40',
    isDark: true,
    hasEffects: true,
  },
  gray: {
    id: 'gray',
    label: 'Focus Gray',
    bgClass: 'bg-[#3c3c3c]',
    textMain: 'text-white',
    textSub: 'text-gray-300',
    accent: 'text-gray-200',
    badge: 'bg-transparent text-gray-300 border-gray-400',
    cardBorder: 'border-gray-600',
    buttonBg: 'bg-black/20',
    isDark: true,
    hasEffects: false,
  },
  black: {
    id: 'black',
    label: 'OLED Black',
    bgClass: 'bg-black',
    textMain: 'text-white',
    textSub: 'text-neutral-500',
    accent: 'text-neutral-300',
    badge: 'bg-neutral-900 text-white border-neutral-800',
    cardBorder: 'border-neutral-900',
    buttonBg: 'bg-neutral-900',
    isDark: true,
    hasEffects: false,
  },
  white: {
    id: 'white',
    label: 'Polar White',
    bgClass: 'bg-slate-50',
    textMain: 'text-slate-900',
    textSub: 'text-slate-500',
    accent: 'text-indigo-600',
    badge: 'bg-white text-indigo-600 border-indigo-200 shadow-sm',
    cardBorder: 'border-slate-200',
    buttonBg: 'bg-white shadow-md border border-slate-100',
    isDark: false,
    hasEffects: false,
  },
};

// --- ユーティリティ ---
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- JSONサンプル ---
const SAMPLE_JSON_FORMAT = `[
  {
    "id": 101,
    "en": "example",
    "pos": "名詞",
    "ja": "例、見本",
    "exEn": "This is a good example.",
    "exJa": "これは良い例です。"
  }
]`;

// --- 設定モーダル ---
const SettingsModal = ({ isOpen, onClose, settings, updateSettings, onImportData }) => {
  const [importStatus, setImportStatus] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;
  const currentTheme = THEMES[settings.theme] || THEMES.stylish;

  // JSONファイル読み込み処理
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json) && json.length > 0 && json[0].en && json[0].ja) {
          onImportData(json);
          setImportStatus(`Success! Added ${json.length} words.`);
          setTimeout(() => setImportStatus(''), 3000);
        } else {
          setImportStatus('Error: Invalid JSON format.');
        }
      } catch (error) {
        setImportStatus('Error: Could not parse JSON.');
      }
    };
    reader.readAsText(file);
    // 同じファイルを再度選べるようにリセット
    event.target.value = '';
  };

  // クリップボードにコピー
  const copyFormat = () => {
    navigator.clipboard.writeText(SAMPLE_JSON_FORMAT);
    setImportStatus('Format copied to clipboard!');
    setTimeout(() => setImportStatus(''), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className={`w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border ${currentTheme.isDark ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings size={20} /> Settings
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* テーマ選択 */}
        <div className="mb-8">
          <label className="flex items-center gap-2 font-medium mb-3 text-sm uppercase tracking-wider opacity-70">
            <Palette size={14} /> Theme
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(THEMES).map((theme) => (
              <button
                key={theme.id}
                onClick={() => updateSettings({ theme: theme.id })}
                className={`relative p-3 rounded-xl border text-left transition-all ${
                  settings.theme === theme.id 
                    ? 'ring-2 ring-indigo-500 border-transparent' 
                    : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{ backgroundColor: theme.id === 'white' ? '#f8fafc' : (theme.id === 'gray' ? '#3c3c3c' : (theme.id === 'black' ? '#000' : '#0f172a')) }}
              >
                <span className={`text-sm font-bold block mb-1 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                  {theme.label}
                </span>
                {settings.theme === theme.id && (
                  <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* スピード調整 */}
        <div className="mb-8">
          <label className="flex justify-between items-center mb-2 font-medium">
            <span className="flex items-center gap-2 text-sm uppercase tracking-wider opacity-70"><Clock size={14} /> Speed</span>
            <span className="text-sm font-mono">{settings.revealSpeed}s</span>
          </label>
          <input 
            type="range" min="0" max="3.0" step="0.1"
            value={settings.revealSpeed}
            onChange={(e) => updateSettings({ revealSpeed: parseFloat(e.target.value) })}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* データ管理セクション (新規追加) */}
        <div className="border-t border-dashed border-gray-500/30 pt-6">
          <h3 className="flex items-center gap-2 font-medium mb-4 text-sm uppercase tracking-wider opacity-70">
            <FileJson size={14} /> Data Management
          </h3>

          {/* 1. フォーマット確認 */}
          <div className={`p-3 rounded-lg mb-4 text-xs font-mono break-all relative ${currentTheme.isDark ? 'bg-black/30' : 'bg-slate-100'}`}>
            <pre>{SAMPLE_JSON_FORMAT}</pre>
            <button 
              onClick={copyFormat}
              className="absolute top-2 right-2 p-1.5 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
              title="Copy Format"
            >
              <Copy size={12} />
            </button>
          </div>

          {/* 2. インポートボタン */}
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              currentTheme.isDark 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            <Upload size={18} />
            Import JSON File
          </button>
          
          {/* ステータス表示 */}
          {importStatus && (
            <div className={`mt-3 text-xs flex items-center gap-1.5 ${importStatus.includes('Error') ? 'text-rose-500' : 'text-emerald-500'}`}>
              <AlertCircle size={12} />
              {importStatus}
            </div>
          )}
        </div>

      </motion.div>
    </motion.div>
  );
};

// --- 単語カード (変更なし) ---
const WordCard = ({ word, isSaved, onToggleSave, settings }) => {
  const { revealSpeed, theme } = settings;
  const t = THEMES[theme] || THEMES.stylish;

  const revealVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: revealSpeed, duration: 0.4 }
    }
  };

  return (
    <div className={`h-[100dvh] w-full flex-shrink-0 snap-start snap-always relative overflow-hidden flex flex-col justify-center items-center transition-colors duration-500 ${t.bgClass} border-b ${t.cardBorder}`}>
      {t.hasEffects && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-black/80" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]" />
        </div>
      )}
      <div className="z-10 flex flex-col items-center w-full px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.3 }} viewport={{ once: true }}
          className={`mb-4 px-3 py-1 text-xs font-bold border rounded-full uppercase tracking-wider ${t.badge}`}
        >
          {word.pos}
        </motion.div>
        <motion.h2 
          initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} viewport={{ once: true }}
          className={`text-6xl md:text-7xl font-medium tracking-tight mb-2 ${t.textMain} drop-shadow-lg`}
        >
          {word.en}
        </motion.h2>
        <div className="h-16 flex items-center justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ amount: 0.5, once: false }} variants={revealVariants}>
            <p className={`text-2xl font-bold ${t.textMain} drop-shadow-md`}>{word.ja}</p>
          </motion.div>
        </div>
        <div className="absolute bottom-24 w-full px-6 max-w-md">
           <motion.div
            initial="hidden" whileInView="visible" viewport={{ amount: 0.5, once: false }} variants={revealVariants}
            className={`p-4 rounded-xl border backdrop-blur-sm ${t.isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}
          >
            <p className={`text-lg font-medium leading-snug mb-2 ${t.textMain}`}>"{word.exEn}"</p>
            <p className={`text-sm ${t.textSub}`}>{word.exJa}</p>
          </motion.div>
        </div>
      </div>
      <div className="absolute right-4 bottom-48 flex flex-col items-center gap-6 z-20">
        <button onClick={() => onToggleSave(word.id)} className="group flex flex-col items-center gap-1 cursor-pointer">
          <div className={`p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-md ${t.buttonBg} ${isSaved ? 'ring-2 ring-rose-500 bg-rose-500/10' : ''}`}>
            <Heart size={28} className={`transition-all duration-300 ${isSaved ? 'fill-rose-500 text-rose-500 scale-110' : (t.isDark ? 'text-white' : 'text-slate-700')}`} />
          </div>
          <span className={`text-[10px] font-bold drop-shadow-md ${t.textSub}`}>Save</span>
        </button>
      </div>
    </div>
  );
};

// --- ヘッダー (変更なし) ---
const Header = ({ activeTab, onTabChange, savedCount, onOpenSettings, themeKey }) => {
  const t = THEMES[themeKey] || THEMES.stylish;
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-6 flex justify-between items-start pointer-events-none">
      <button 
        onClick={onOpenSettings}
        className={`pointer-events-auto p-3 rounded-full backdrop-blur-md border shadow-lg transition-all ${t.buttonBg} ${t.isDark ? 'text-white border-white/10' : 'text-slate-800 border-black/5'}`}
      >
        <Settings size={20} />
      </button>
      <div className={`pointer-events-auto flex items-center backdrop-blur-md rounded-full p-1 border shadow-xl mx-auto absolute left-1/2 -translate-x-1/2 top-6 ${t.buttonBg} ${t.isDark ? 'border-white/10' : 'border-black/5'}`}>
        <button
          onClick={() => onTabChange('all')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'all' 
              ? (t.isDark ? 'bg-white/20 text-white' : 'bg-black/10 text-slate-900')
              : (t.isDark ? 'text-slate-400' : 'text-slate-500')
          }`}
        >
          <Layers size={14} /> All
        </button>
        <button
          onClick={() => onTabChange('saved')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'saved' 
              ? 'bg-rose-500 text-white shadow-md' 
              : (t.isDark ? 'text-slate-400' : 'text-slate-500')
          }`}
        >
          <Heart size={14} className={activeTab === 'saved' ? 'fill-white' : ''} />
          {savedCount > 0 && <span className="opacity-90">{savedCount}</span>}
        </button>
      </div>
      <div className="w-10"></div>
    </div>
  );
};

// --- アプリ本体 ---
const App = () => {
  // 初期単語リストを LocalStorage または 初期データ から取得
  const [allWords, setAllWords] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const containerRef = useRef(null);

  // 設定
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : { revealSpeed: 0.5, theme: 'stylish' };
  });

  // 初期ロード：単語データと保存データの読み込み
  useEffect(() => {
    const savedWords = localStorage.getItem('myVocabularyData');
    if (savedWords) {
      // 既存のデータがあればそれを使う（初期データ + ユーザー追加分）
      setAllWords(JSON.parse(savedWords));
    } else {
      // 初回は初期データをシャッフルしてセット
      const initial = shuffleArray(INITIAL_WORDS);
      setAllWords(initial);
      localStorage.setItem('myVocabularyData', JSON.stringify(initial));
    }

    const savedLikes = localStorage.getItem('myVocabularySaved');
    if (savedLikes) setSavedIds(JSON.parse(savedLikes));
  }, []);

  // いいね保存
  useEffect(() => {
    localStorage.setItem('myVocabularySaved', JSON.stringify(savedIds));
  }, [savedIds]);

  // 設定保存
  const updateSettings = (newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('appSettings', JSON.stringify(updated));
      return updated;
    });
  };

  // データのインポート処理
  const handleImportData = (newJsonData) => {
    // IDの衝突を避けるため、既存の最大IDを取得して連番を振るなどの処理も可能だが
    // ここでは単純に結合し、LocalStroageを更新する
    const updatedWords = [...allWords, ...newJsonData];
    // シャッフルして保存
    const shuffled = shuffleArray(updatedWords);
    setAllWords(shuffled);
    localStorage.setItem('myVocabularyData', JSON.stringify(shuffled));
  };

  const toggleSave = (id) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (containerRef.current) containerRef.current.scrollTo({ top: 0 });
  };

  const displayWords = useMemo(() => {
    return activeTab === 'saved' ? allWords.filter(w => savedIds.includes(w.id)) : allWords;
  }, [activeTab, allWords, savedIds]);

  const currentTheme = THEMES[settings.theme] || THEMES.stylish;

  return (
    <div className={`relative w-full h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${currentTheme.bgClass}`}>
      
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        savedCount={savedIds.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        themeKey={settings.theme}
      />

      <div 
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayWords.length > 0 ? (
          <>
            {displayWords.map((word) => (
              <WordCard 
                key={word.id} // 重複IDがあるとReactが警告を出すため、実運用ではUUID推奨
                word={word} 
                isSaved={savedIds.includes(word.id)}
                onToggleSave={toggleSave}
                settings={settings}
              />
            ))}
            <div className={`h-[30vh] w-full snap-start flex items-center justify-center border-t ${currentTheme.bgClass} ${currentTheme.cardBorder} ${currentTheme.textSub}`}>
              <div className="flex flex-col items-center gap-2">
                <Sparkles size={20} />
                <p className="text-xs font-medium uppercase tracking-widest">End of list</p>
              </div>
            </div>
          </>
        ) : (
          <div className={`h-[100dvh] w-full flex flex-col items-center justify-center snap-start px-6 ${currentTheme.bgClass} ${currentTheme.textMain}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${currentTheme.buttonBg}`}>
              <BookOpen size={40} className="opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No words found</h3>
            <button onClick={() => handleTabChange('all')} className="mt-4 opacity-70 hover:opacity-100 underline">Back</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            settings={settings}
            updateSettings={updateSettings}
            onImportData={handleImportData}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;
