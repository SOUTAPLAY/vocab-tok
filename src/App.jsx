import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Settings, X, Clock, Sparkles, BookOpen, Layers, Palette, Check, Upload, FileJson, Copy, AlertCircle, Folder, FolderOpen, CheckSquare, Square } from 'lucide-react';

// --- 初期データ (フォルダIDを追加) ---
const INITIAL_FOLDER_ID = 'sample-folder';
const INITIAL_FOLDERS = [
  { id: INITIAL_FOLDER_ID, name: 'Sample Words', active: true }
];

const INITIAL_WORDS = [
  { id: 1, folderId: INITIAL_FOLDER_ID, en: "comprehensive", pos: "形容詞", ja: "包括的な、総合的な", exEn: "We need a comprehensive guide.", exJa: "私たちには包括的なガイドが必要です。" },
  { id: 2, folderId: INITIAL_FOLDER_ID, en: "innovation", pos: "名詞", ja: "革新、刷新", exEn: "Innovation distinguishes between a leader and a follower.", exJa: "革新はリーダーとフォロワーを区別する。" },
  { id: 3, folderId: INITIAL_FOLDER_ID, en: "mandatory", pos: "形容詞", ja: "義務的な、必須の", exEn: "Attendance at the meeting is mandatory.", exJa: "会議への出席は義務です。" },
  { id: 4, folderId: INITIAL_FOLDER_ID, en: "subsequent", pos: "形容詞", ja: "その後の、次の", exEn: "Subsequent events proved him wrong.", exJa: "その後の出来事が彼の誤りを証明した。" },
  { id: 5, folderId: INITIAL_FOLDER_ID, en: "incentive", pos: "名詞", ja: "動機、報奨金", exEn: "There is no incentive to work harder.", exJa: "もっと一生懸命働く動機がない。" },
];

// --- テーマ定義 ---
const THEMES = {
  stylish: { id: 'stylish', label: 'Midnight Blur', bgClass: 'bg-slate-950', textMain: 'text-white', textSub: 'text-slate-400', accent: 'text-indigo-400', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30', cardBorder: 'border-slate-900', buttonBg: 'bg-slate-800/40', isDark: true, hasEffects: true },
  gray: { id: 'gray', label: 'Focus Gray', bgClass: 'bg-[#3c3c3c]', textMain: 'text-white', textSub: 'text-gray-300', accent: 'text-gray-200', badge: 'bg-transparent text-gray-300 border-gray-400', cardBorder: 'border-gray-600', buttonBg: 'bg-black/20', isDark: true, hasEffects: false },
  black: { id: 'black', label: 'OLED Black', bgClass: 'bg-black', textMain: 'text-white', textSub: 'text-neutral-500', accent: 'text-neutral-300', badge: 'bg-neutral-900 text-white border-neutral-800', cardBorder: 'border-neutral-900', buttonBg: 'bg-neutral-900', isDark: true, hasEffects: false },
  white: { id: 'white', label: 'Polar White', bgClass: 'bg-slate-50', textMain: 'text-slate-900', textSub: 'text-slate-500', accent: 'text-indigo-600', badge: 'bg-white text-indigo-600 border-indigo-200 shadow-sm', cardBorder: 'border-slate-200', buttonBg: 'bg-white shadow-md border border-slate-100', isDark: false, hasEffects: false },
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

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- JSONサンプル ---
const SAMPLE_JSON_FORMAT = `[
  {
    "en": "example",
    "pos": "名詞",
    "ja": "例",
    "exEn": "This is an example.",
    "exJa": "これは例です。"
  }
]`;

// --- 設定・フォルダ管理モーダル ---
const SettingsModal = ({ isOpen, onClose, settings, updateSettings, folders, toggleFolderActive, onImportData }) => {
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'folders' | 'import'
  const [importStatus, setImportStatus] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;
  const currentTheme = THEMES[settings.theme] || THEMES.stylish;

  // JSONインポート処理
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const folderName = newFolderName.trim() || `Imported ${new Date().toLocaleDateString()}`;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json)) {
          // ID生成とフォルダ割り当て
          const newFolderId = generateId();
          const wordsToAdd = json.map(w => ({
            ...w,
            id: w.id || generateId(),
            folderId: newFolderId
          }));
          
          onImportData(newFolderId, folderName, wordsToAdd);
          setImportStatus(`Success! Added to "${folderName}".`);
          setNewFolderName('');
          setTimeout(() => setImportStatus(''), 3000);
        } else {
          setImportStatus('Error: Invalid JSON format.');
        }
      } catch (error) {
        setImportStatus('Error: Could not parse JSON.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const copyFormat = () => {
    navigator.clipboard.writeText(SAMPLE_JSON_FORMAT);
    setImportStatus('Copied to clipboard!');
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
        className={`w-full max-w-sm max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${currentTheme.isDark ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="p-4 border-b border-gray-500/10 flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2">
            <Settings size={18} /> Preferences
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* タブナビゲーション */}
        <div className="flex border-b border-gray-500/10">
          <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide ${activeTab === 'settings' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'opacity-50'}`}>Settings</button>
          <button onClick={() => setActiveTab('folders')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide ${activeTab === 'folders' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'opacity-50'}`}>Folders</button>
          <button onClick={() => setActiveTab('import')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide ${activeTab === 'import' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'opacity-50'}`}>Import</button>
        </div>

        {/* コンテンツエリア */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* --- SETTINGS TAB --- */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* テーマ */}
              <div>
                <label className="flex items-center gap-2 font-medium mb-3 text-sm opacity-70"><Palette size={14} /> Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(THEMES).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => updateSettings({ theme: theme.id })}
                      className={`p-2.5 rounded-lg border text-left text-xs font-bold transition-all flex justify-between items-center ${
                        settings.theme === theme.id 
                          ? 'ring-2 ring-indigo-500 border-transparent' 
                          : 'border-transparent bg-gray-500/5 hover:bg-gray-500/10'
                      }`}
                      style={{ backgroundColor: theme.id === 'white' ? '#f8fafc' : (theme.id === 'gray' ? '#3c3c3c' : (theme.id === 'black' ? '#000' : undefined)) }}
                    >
                      <span className={theme.isDark ? 'text-white' : 'text-slate-900'}>{theme.label}</span>
                      {settings.theme === theme.id && <Check size={12} className="text-indigo-500 bg-white rounded-full p-0.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* スピード */}
              <div>
                <label className="flex justify-between items-center mb-2 font-medium">
                  <span className="flex items-center gap-2 text-sm opacity-70"><Clock size={14} /> Speed</span>
                  <span className="text-sm font-mono">{settings.revealSpeed}s</span>
                </label>
                <input 
                  type="range" min="0" max="3.0" step="0.1"
                  value={settings.revealSpeed}
                  onChange={(e) => updateSettings({ revealSpeed: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          )}

          {/* --- FOLDERS TAB --- */}
          {activeTab === 'folders' && (
            <div className="space-y-4">
              <p className="text-xs opacity-60 mb-2">Select folders to include in your feed.</p>
              {folders.map(folder => (
                <div 
                  key={folder.id} 
                  onClick={() => toggleFolderActive(folder.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    folder.active 
                      ? (currentTheme.isDark ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200') 
                      : (currentTheme.isDark ? 'bg-transparent border-gray-700 opacity-50' : 'bg-transparent border-gray-200 opacity-50')
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {folder.active ? <FolderOpen size={18} className="text-indigo-400" /> : <Folder size={18} />}
                    <span className="font-bold text-sm">{folder.name}</span>
                  </div>
                  {folder.active ? <CheckSquare size={18} className="text-indigo-500" /> : <Square size={18} />}
                </div>
              ))}
            </div>
          )}

          {/* --- IMPORT TAB --- */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2">1. Target Folder Name</label>
                <input 
                  type="text" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. TOEIC Part 1"
                  className={`w-full p-3 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${currentTheme.isDark ? 'border-gray-700' : 'border-gray-300'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2">2. Upload JSON</label>
                <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    currentTheme.isDark 
                      ? 'bg-white text-slate-900 hover:bg-gray-200' 
                      : 'bg-slate-900 text-white hover:bg-slate-700'
                  }`}
                >
                  <Upload size={18} /> Select File
                </button>
              </div>

              {importStatus && (
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${importStatus.includes('Error') ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  <AlertCircle size={14} /> {importStatus}
                </div>
              )}

              <div className="pt-4 border-t border-gray-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold opacity-50">JSON FORMAT SAMPLE</span>
                  <button onClick={copyFormat} className="text-xs text-indigo-400 hover:underline flex items-center gap-1"><Copy size={10} /> Copy</button>
                </div>
                <div className={`p-3 rounded-lg text-[10px] font-mono leading-relaxed opacity-70 ${currentTheme.isDark ? 'bg-black/30' : 'bg-slate-100'}`}>
                  <pre>{SAMPLE_JSON_FORMAT}</pre>
                </div>
              </div>
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
    visible: { opacity: 1, y: 0, transition: { delay: revealSpeed, duration: 0.4 } }
  };

  return (
    <div className={`h-[100dvh] w-full flex-shrink-0 snap-start snap-always relative overflow-hidden flex flex-col justify-center items-center transition-colors duration-500 ${t.bgClass} border-b ${t.cardBorder}`}>
      {t.hasEffects && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-black/80" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]" />
        </div>
      )}
      <div className="z-10 flex flex-col items-center w-full px-4 text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.3 }} viewport={{ once: true }} className={`mb-4 px-3 py-1 text-xs font-bold border rounded-full uppercase tracking-wider ${t.badge}`}>
          {word.pos}
        </motion.div>
        <motion.h2 initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} viewport={{ once: true }} className={`text-6xl md:text-7xl font-medium tracking-tight mb-2 ${t.textMain} drop-shadow-lg`}>
          {word.en}
        </motion.h2>
        <div className="h-16 flex items-center justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ amount: 0.5, once: false }} variants={revealVariants}>
            <p className={`text-2xl font-bold ${t.textMain} drop-shadow-md`}>{word.ja}</p>
          </motion.div>
        </div>
        <div className="absolute bottom-24 w-full px-6 max-w-md">
           <motion.div initial="hidden" whileInView="visible" viewport={{ amount: 0.5, once: false }} variants={revealVariants} className={`p-4 rounded-xl border backdrop-blur-sm ${t.isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
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

// --- ヘッダー ---
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
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'all' ? (t.isDark ? 'bg-white/20 text-white' : 'bg-black/10 text-slate-900') : (t.isDark ? 'text-slate-400' : 'text-slate-500')}`}
        >
          <Layers size={14} /> Feed
        </button>
        <button
          onClick={() => onTabChange('saved')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'saved' ? 'bg-rose-500 text-white shadow-md' : (t.isDark ? 'text-slate-400' : 'text-slate-500')}`}
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
  const [folders, setFolders] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const containerRef = useRef(null);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : { revealSpeed: 0.5, theme: 'stylish' };
  });

  // データ初期化
  useEffect(() => {
    // フォルダ読み込み
    const savedFolders = localStorage.getItem('myVocabularyFolders');
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    } else {
      setFolders(INITIAL_FOLDERS);
      localStorage.setItem('myVocabularyFolders', JSON.stringify(INITIAL_FOLDERS));
    }

    // 単語読み込み
    const savedWords = localStorage.getItem('myVocabularyData');
    if (savedWords) {
      setAllWords(JSON.parse(savedWords));
    } else {
      const initial = shuffleArray(INITIAL_WORDS);
      setAllWords(initial);
      localStorage.setItem('myVocabularyData', JSON.stringify(initial));
    }

    const savedLikes = localStorage.getItem('myVocabularySaved');
    if (savedLikes) setSavedIds(JSON.parse(savedLikes));
  }, []);

  // 永続化処理
  useEffect(() => localStorage.setItem('myVocabularyFolders', JSON.stringify(folders)), [folders]);
  useEffect(() => localStorage.setItem('myVocabularyData', JSON.stringify(allWords)), [allWords]);
  useEffect(() => localStorage.setItem('myVocabularySaved', JSON.stringify(savedIds)), [savedIds]);
  useEffect(() => localStorage.setItem('appSettings', JSON.stringify(settings)), [settings]);

  const updateSettings = (newSettings) => setSettings(prev => ({ ...prev, ...newSettings }));
  
  const toggleSave = (id) => setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (containerRef.current) containerRef.current.scrollTo({ top: 0 });
  };

  // フォルダ有効化切り替え
  const toggleFolderActive = (folderId) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, active: !f.active } : f));
  };

  // インポート処理
  const handleImportData = (newFolderId, folderName, newWords) => {
    // 新規フォルダ追加
    setFolders(prev => [...prev, { id: newFolderId, name: folderName, active: true }]);
    // 単語リストに追加してシャッフル
    setAllWords(prev => shuffleArray([...prev, ...newWords]));
  };

  // 表示単語のフィルタリング（アクティブなフォルダ かつ 保存状態）
  const displayWords = useMemo(() => {
    // 1. アクティブなフォルダのIDリストを取得
    const activeFolderIds = folders.filter(f => f.active).map(f => f.id);
    
    // 2. フォルダでフィルタリング
    let filtered = allWords.filter(w => activeFolderIds.includes(w.folderId));

    // 3. Savedタブならさらに絞り込み
    if (activeTab === 'saved') {
      filtered = filtered.filter(w => savedIds.includes(w.id));
    }

    return filtered;
  }, [activeTab, allWords, savedIds, folders]);

  const currentTheme = THEMES[settings.theme] || THEMES.stylish;

  return (
    <div className={`relative w-full h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${currentTheme.bgClass}`}>
      <Header activeTab={activeTab} onTabChange={handleTabChange} savedCount={savedIds.length} onOpenSettings={() => setIsSettingsOpen(true)} themeKey={settings.theme} />

      <div ref={containerRef} className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {displayWords.length > 0 ? (
          <>
            {displayWords.map((word) => (
              <WordCard key={word.id} word={word} isSaved={savedIds.includes(word.id)} onToggleSave={toggleSave} settings={settings} />
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
              <FolderOpen size={40} className="opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No words active</h3>
            <p className="text-sm opacity-60 text-center max-w-xs mb-6">Check your folder settings or import new words to get started.</p>
            <button onClick={() => setIsSettingsOpen(true)} className="px-6 py-3 rounded-full bg-indigo-500 text-white font-bold text-sm shadow-lg hover:bg-indigo-600 transition-colors">Manage Folders</button>
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
            folders={folders}
            toggleFolderActive={toggleFolderActive}
            onImportData={handleImportData}
          />
        )}
      </AnimatePresence>

      <style jsx global>{` .hide-scrollbar::-webkit-scrollbar { display: none; } `}</style>
    </div>
  );
};

export default App;
