import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Settings, X, Clock, Sparkles, BookOpen, Layers, Palette, Check, Upload, FileJson, Copy, AlertCircle, Folder, FolderOpen, CheckSquare, Square, Trash2, Edit2, Save, Plus, ListPlus, FolderPlus } from 'lucide-react';

// --- 初期データ ---
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

const THEMES = {
  stylish: { id: 'stylish', label: 'Midnight Blur', bgClass: 'bg-slate-950', textMain: 'text-white', textSub: 'text-slate-400', accent: 'text-indigo-400', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30', cardBorder: 'border-slate-900', buttonBg: 'bg-slate-800/40', isDark: true, hasEffects: true },
  gray: { id: 'gray', label: 'Focus Gray', bgClass: 'bg-[#3c3c3c]', textMain: 'text-white', textSub: 'text-gray-300', accent: 'text-gray-200', badge: 'bg-transparent text-gray-300 border-gray-400', cardBorder: 'border-gray-600', buttonBg: 'bg-black/20', isDark: true, hasEffects: false },
  black: { id: 'black', label: 'OLED Black', bgClass: 'bg-black', textMain: 'text-white', textSub: 'text-neutral-500', accent: 'text-neutral-300', badge: 'bg-neutral-900 text-white border-neutral-800', cardBorder: 'border-neutral-900', buttonBg: 'bg-neutral-900', isDark: true, hasEffects: false },
  white: { id: 'white', label: 'Polar White', bgClass: 'bg-slate-50', textMain: 'text-slate-900', textSub: 'text-slate-500', accent: 'text-indigo-600', badge: 'bg-white text-indigo-600 border-indigo-200 shadow-sm', cardBorder: 'border-slate-200', buttonBg: 'bg-white shadow-md border border-slate-100', isDark: false, hasEffects: false },
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- プレイリスト選択ボトムシート ---
const AddToFolderSheet = ({ isOpen, onClose, folders, currentWordId, folderAssignments, onToggleAssignment, onCreateFolder, themeKey }) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const t = THEMES[themeKey] || THEMES.stylish;

  if (!isOpen) return null;

  const handleCreate = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center pointer-events-none">
      {/* 背景オーバーレイ */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* ボトムシート */}
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`w-full max-w-md rounded-t-2xl p-4 pb-8 pointer-events-auto shadow-2xl relative ${t.isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-500/20 rounded-full mx-auto mb-6" />
        
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-lg font-bold">Save to...</h3>
          <button 
            onClick={() => setIsCreating(!isCreating)} 
            className="text-sm font-bold text-indigo-500 flex items-center gap-1 hover:underline"
          >
            <Plus size={16} /> New Playlist
          </button>
        </div>

        {isCreating && (
          <div className="mb-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
            <input 
              autoFocus
              type="text" 
              placeholder="Enter playlist name..."
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              className={`flex-1 p-3 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`}
            />
            <button 
              onClick={handleCreate}
              className="p-3 bg-indigo-500 text-white rounded-xl font-bold text-sm"
            >
              Create
            </button>
          </div>
        )}

        <div className="space-y-1 max-h-[50vh] overflow-y-auto">
          {folders.map(folder => {
            const isAssigned = (folderAssignments[folder.id] || []).includes(currentWordId);
            return (
              <div 
                key={folder.id}
                onClick={() => onToggleAssignment(folder.id, currentWordId)}
                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${t.isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isAssigned ? 'bg-indigo-500 border-indigo-500' : 'border-gray-400'}`}>
                  {isAssigned && <Check size={14} className="text-white" />}
                </div>
                <div className="flex-1 font-medium">{folder.name}</div>
                {/* インポートされたフォルダか、手動作成かなどのアイコン区別も可能 */}
                {folder.id === INITIAL_FOLDER_ID && <span className="text-xs opacity-50 bg-gray-500/20 px-2 py-0.5 rounded">Default</span>}
              </div>
            );
          })}
        </div>
        
        <button onClick={onClose} className="w-full mt-6 py-3 rounded-xl font-bold bg-gray-500/10 hover:bg-gray-500/20 transition-colors">
          Done
        </button>
      </motion.div>
    </div>
  );
};

// --- 設定モーダル (前のコードと同じだが、簡略化のため一部省略なしで再掲) ---
const SettingsModal = ({ isOpen, onClose, settings, updateSettings, folders, toggleFolderActive, onImportData, initialTab, onRenameFolder, onDeleteFolder }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'settings');
  const [importStatus, setImportStatus] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => { if (isOpen && initialTab) setActiveTab(initialTab); }, [isOpen, initialTab]);
  if (!isOpen) return null;
  const t = THEMES[settings.theme] || THEMES.stylish;

  const startEditing = (folder) => { setEditingFolderId(folder.id); setEditName(folder.name); };
  const saveEditing = () => { if (editName.trim()) onRenameFolder(editingFolderId, editName); setEditingFolderId(null); };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const folderName = newFolderName.trim() || `Imported ${new Date().toLocaleDateString()}`;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json)) {
          const newFolderId = generateId();
          const wordsToAdd = json.map(w => ({ ...w, id: w.id || generateId(), folderId: newFolderId }));
          onImportData(newFolderId, folderName, wordsToAdd);
          setImportStatus(`Success! Added to "${folderName}".`);
          setNewFolderName('');
          setTimeout(() => setImportStatus(''), 3000);
        } else { setImportStatus('Error: Invalid JSON format.'); }
      } catch (error) { setImportStatus('Error: Could not parse JSON.'); }
    };
    reader.readAsText(file);
    event.target.value = '';
  };
  const copyFormat = () => { navigator.clipboard.writeText(`[{ "en": "apple", "ja": "りんご", "pos": "名詞", "exEn": "I like apples.", "exJa": "りんごが好き。" }]`); setImportStatus('Copied!'); setTimeout(() => setImportStatus(''), 2000); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`w-full max-w-sm max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${t.isDark ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'}`} onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-500/10 flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2"><Settings size={18} /> Preferences</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 transition-colors"><X size={18} /></button>
        </div>
        <div className="flex border-b border-gray-500/10">
          {['settings', 'folders', 'import'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide ${activeTab === tab ? 'text-indigo-500 border-b-2 border-indigo-500' : 'opacity-50'}`}>{tab}</button>
          ))}
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 font-medium mb-3 text-sm opacity-70"><Palette size={14} /> Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(THEMES).map((theme) => (
                    <button key={theme.id} onClick={() => updateSettings({ theme: theme.id })} className={`p-2.5 rounded-lg border text-left text-xs font-bold transition-all flex justify-between items-center ${settings.theme === theme.id ? 'ring-2 ring-indigo-500 border-transparent' : 'border-transparent bg-gray-500/5 hover:bg-gray-500/10'}`} style={{ backgroundColor: theme.id === 'white' ? '#f8fafc' : (theme.id === 'gray' ? '#3c3c3c' : (theme.id === 'black' ? '#000' : undefined)) }}>
                      <span className={theme.isDark ? 'text-white' : 'text-slate-900'}>{theme.label}</span>
                      {settings.theme === theme.id && <Check size={12} className="text-indigo-500 bg-white rounded-full p-0.5" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex justify-between items-center mb-2 font-medium"><span className="flex items-center gap-2 text-sm opacity-70"><Clock size={14} /> Speed</span><span className="text-sm font-mono">{settings.revealSpeed}s</span></label>
                <input type="range" min="0" max="3.0" step="0.1" value={settings.revealSpeed} onChange={(e) => updateSettings({ revealSpeed: parseFloat(e.target.value) })} className="w-full h-1.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>
            </div>
          )}
          {activeTab === 'folders' && (
            <div className="space-y-4">
              <p className="text-xs opacity-60 mb-2">Active folders will appear in your feed.</p>
              {folders.map(folder => (
                <div key={folder.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${folder.active ? (t.isDark ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200') : (t.isDark ? 'bg-transparent border-gray-700 opacity-70' : 'bg-transparent border-gray-200 opacity-70')}`}>
                  <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <button onClick={() => toggleFolderActive(folder.id)} className="flex-shrink-0">{folder.active ? <CheckSquare size={18} className="text-indigo-500" /> : <Square size={18} />}</button>
                    {editingFolderId === folder.id ? <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-transparent border-b border-indigo-500 text-sm font-bold w-full focus:outline-none" autoFocus /> : <span className="font-bold text-sm truncate" onClick={() => toggleFolderActive(folder.id)}>{folder.name}</span>}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {editingFolderId === folder.id ? <button onClick={saveEditing} className="p-1.5 hover:bg-indigo-500/20 rounded-md text-indigo-500"><Save size={14} /></button> : <button onClick={() => startEditing(folder)} className="p-1.5 hover:bg-gray-500/10 rounded-md opacity-50 hover:opacity-100"><Edit2 size={14} /></button>}
                    {folders.length > 1 && <button onClick={() => { if(window.confirm('Delete this folder?')) onDeleteFolder(folder.id); }} className="p-1.5 hover:bg-rose-500/20 rounded-md text-rose-500 opacity-50 hover:opacity-100"><Trash2 size={14} /></button>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'import' && (
            <div className="space-y-6">
              <div><label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2">1. New Playlist Name</label><input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="e.g. TOEIC Part 1" className={`w-full p-3 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${t.isDark ? 'border-gray-700' : 'border-gray-300'}`} /></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2">2. Upload JSON</label><input type="file" accept=".json" ref={fileInputRef} onChange={handleFileUpload} className="hidden" /><button onClick={() => fileInputRef.current.click()} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${t.isDark ? 'bg-white text-slate-900 hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-700'}`}><Upload size={18} /> Select File</button></div>
              {importStatus && <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${importStatus.includes('Error') ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}><AlertCircle size={14} /> {importStatus}</div>}
              <div className="pt-4 border-t border-gray-500/20"><div className="flex justify-between items-center mb-2"><span className="text-xs font-bold opacity-50">JSON SAMPLE</span><button onClick={copyFormat} className="text-xs text-indigo-400 hover:underline flex items-center gap-1"><Copy size={10} /> Copy</button></div></div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- 単語カード (UI拡張) ---
const WordCard = ({ word, isSaved, onToggleSave, onOpenAddToFolder, settings }) => {
  const { revealSpeed, theme } = settings;
  const t = THEMES[theme] || THEMES.stylish;
  const revealVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: revealSpeed, duration: 0.4 } } };

  return (
    <div className={`h-[100dvh] w-full flex-shrink-0 snap-start snap-always relative overflow-hidden flex flex-col justify-center items-center transition-colors duration-500 ${t.bgClass} border-b ${t.cardBorder}`}>
      {t.hasEffects && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-black/80" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]" />
        </div>
      )}
      <div className="z-10 flex flex-col items-center w-full px-4 text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.3 }} viewport={{ once: true }} className={`mb-4 px-3 py-1 text-xs font-bold border rounded-full uppercase tracking-wider ${t.badge}`}>{word.pos}</motion.div>
        <motion.h2 initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} viewport={{ once: true }} className={`text-6xl md:text-7xl font-medium tracking-tight mb-2 ${t.textMain} drop-shadow-lg`}>{word.en}</motion.h2>
        <div className="h-16 flex items-center justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ amount: 0.5, once: false }} variants={revealVariants}><p className={`text-2xl font-bold ${t.textMain} drop-shadow-md`}>{word.ja}</p></motion.div>
        </div>
        <div className="absolute bottom-24 w-full px-6 max-w-md">
           <motion.div initial="hidden" whileInView="visible" viewport={{ amount: 0.5, once: false }} variants={revealVariants} className={`p-4 rounded-xl border backdrop-blur-sm ${t.isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
            <p className={`text-lg font-medium leading-snug mb-2 ${t.textMain}`}>"{word.exEn}"</p>
            <p className={`text-sm ${t.textSub}`}>{word.exJa}</p>
          </motion.div>
        </div>
      </div>
      
      {/* サイドボタン */}
      <div className="absolute right-4 bottom-48 flex flex-col items-center gap-6 z-20">
        <button onClick={() => onToggleSave(word.id)} className="group flex flex-col items-center gap-1 cursor-pointer">
          <div className={`p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-md ${t.buttonBg} ${isSaved ? 'ring-2 ring-rose-500 bg-rose-500/10' : ''}`}>
            <Heart size={28} className={`transition-all duration-300 ${isSaved ? 'fill-rose-500 text-rose-500 scale-110' : (t.isDark ? 'text-white' : 'text-slate-700')}`} />
          </div>
          <span className={`text-[10px] font-bold drop-shadow-md ${t.textSub}`}>Like</span>
        </button>

        {/* フォルダ追加ボタン (New!) */}
        <button onClick={() => onOpenAddToFolder(word.id)} className="group flex flex-col items-center gap-1 cursor-pointer">
          <div className={`p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-md ${t.buttonBg} hover:bg-indigo-500/20`}>
            <ListPlus size={28} className={`transition-all duration-300 ${t.isDark ? 'text-white' : 'text-slate-700'}`} />
          </div>
          <span className={`text-[10px] font-bold drop-shadow-md ${t.textSub}`}>Add</span>
        </button>
      </div>
    </div>
  );
};

// --- ヘッダー ---
const Header = ({ activeTab, onTabChange, savedCount, openSettings, themeKey }) => {
  const t = THEMES[themeKey] || THEMES.stylish;
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-6 flex justify-between items-start pointer-events-none">
      <button onClick={() => openSettings('settings')} className={`pointer-events-auto p-3 rounded-full backdrop-blur-md border shadow-lg transition-all ${t.buttonBg} ${t.isDark ? 'text-white border-white/10' : 'text-slate-800 border-black/5'}`}><Settings size={20} /></button>
      <div className={`pointer-events-auto flex items-center backdrop-blur-md rounded-full p-1 border shadow-xl mx-auto absolute left-1/2 -translate-x-1/2 top-6 ${t.buttonBg} ${t.isDark ? 'border-white/10' : 'border-black/5'}`}>
        <button onClick={() => onTabChange('all')} className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'all' ? (t.isDark ? 'bg-white/20 text-white' : 'bg-black/10 text-slate-900') : (t.isDark ? 'text-slate-400' : 'text-slate-500')}`}><Layers size={14} /> Feed</button>
        <button onClick={() => onTabChange('saved')} className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'saved' ? 'bg-rose-500 text-white shadow-md' : (t.isDark ? 'text-slate-400' : 'text-slate-500')}`}><Heart size={14} className={activeTab === 'saved' ? 'fill-white' : ''} />{savedCount > 0 && <span className="opacity-90">{savedCount}</span>}</button>
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
  const [settingsTab, setSettingsTab] = useState('settings');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [currentAddWordId, setCurrentAddWordId] = useState(null);
  const [folderAssignments, setFolderAssignments] = useState({}); // { folderId: [wordId1, wordId2] }

  const containerRef = useRef(null);
  const [settings, setSettings] = useState(() => { const saved = localStorage.getItem('appSettings'); return saved ? JSON.parse(saved) : { revealSpeed: 0.5, theme: 'stylish' }; });

  const openSettings = (tab = 'settings') => { setSettingsTab(tab); setIsSettingsOpen(true); };
  const openAddSheet = (wordId) => { setCurrentAddWordId(wordId); setIsAddSheetOpen(true); };

  // データ初期化
  useEffect(() => {
    const savedFolders = localStorage.getItem('myVocabularyFolders');
    if (savedFolders) setFolders(JSON.parse(savedFolders));
    else { setFolders(INITIAL_FOLDERS); localStorage.setItem('myVocabularyFolders', JSON.stringify(INITIAL_FOLDERS)); }

    const savedWords = localStorage.getItem('myVocabularyData');
    if (savedWords) setAllWords(JSON.parse(savedWords).map(w => ({ ...w, folderId: w.folderId || INITIAL_FOLDER_ID })));
    else { const initial = shuffleArray(INITIAL_WORDS); setAllWords(initial); localStorage.setItem('myVocabularyData', JSON.stringify(initial)); }

    const savedLikes = localStorage.getItem('myVocabularySaved');
    if (savedLikes) setSavedIds(JSON.parse(savedLikes));

    const savedAssignments = localStorage.getItem('myFolderAssignments');
    if (savedAssignments) setFolderAssignments(JSON.parse(savedAssignments));
  }, []);

  // 永続化
  useEffect(() => localStorage.setItem('myVocabularyFolders', JSON.stringify(folders)), [folders]);
  useEffect(() => localStorage.setItem('myVocabularyData', JSON.stringify(allWords)), [allWords]);
  useEffect(() => localStorage.setItem('myVocabularySaved', JSON.stringify(savedIds)), [savedIds]);
  useEffect(() => localStorage.setItem('myFolderAssignments', JSON.stringify(folderAssignments)), [folderAssignments]);
  useEffect(() => localStorage.setItem('appSettings', JSON.stringify(settings)), [settings]);

  const updateSettings = (newSettings) => setSettings(prev => ({ ...prev, ...newSettings }));
  const toggleSave = (id) => setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const handleTabChange = (tab) => { setActiveTab(tab); if (containerRef.current) containerRef.current.scrollTo({ top: 0 }); };
  const toggleFolderActive = (folderId) => setFolders(prev => prev.map(f => f.id === folderId ? { ...f, active: !f.active } : f));
  const handleRenameFolder = (id, newName) => setFolders(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
  
  const handleDeleteFolder = (id) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    // インポート時の「所属フォルダ」概念も消す場合
    setAllWords(prev => prev.filter(w => w.folderId !== id)); 
    // assignmentsからも削除
    const newAssignments = { ...folderAssignments };
    delete newAssignments[id];
    setFolderAssignments(newAssignments);
  };

  const handleImportData = (newFolderId, folderName, newWords) => {
    setFolders(prev => [...prev, { id: newFolderId, name: folderName, active: true }]);
    setAllWords(prev => shuffleArray([...prev, ...newWords]));
  };

  // ボトムシートからのフォルダ作成
  const handleCreateFolderFromSheet = (name) => {
    const newId = generateId();
    setFolders(prev => [...prev, { id: newId, name: name, active: true }]);
    // 作成と同時に現在の単語を追加する
    if (currentAddWordId) {
      handleToggleAssignment(newId, currentAddWordId);
    }
  };

  // フォルダへの単語追加・削除（トグル）
  const handleToggleAssignment = (folderId, wordId) => {
    setFolderAssignments(prev => {
      const currentList = prev[folderId] || [];
      if (currentList.includes(wordId)) {
        return { ...prev, [folderId]: currentList.filter(id => id !== wordId) };
      } else {
        return { ...prev, [folderId]: [...currentList, wordId] };
      }
    });
  };

  // 表示ロジック（インポートによる所属 + 手動割り当て）
  const displayWords = useMemo(() => {
    // アクティブなフォルダIDリスト
    const activeFolderIds = folders.filter(f => f.active).map(f => f.id);
    
    // 1. そのフォルダに「元々所属している（インポート時）」単語
    // 2. または「手動で割り当てられた（Assignment）」単語
    // のいずれかに該当し、かつそのフォルダがアクティブなら表示
    
    let filtered = allWords.filter(w => {
      // 元々の所属フォルダがアクティブか？
      if (activeFolderIds.includes(w.folderId)) return true;
      
      // 手動で割り当てられたフォルダの中に、アクティブなものがあるか？
      const assignedFolders = Object.keys(folderAssignments).filter(fid => 
        folderAssignments[fid]?.includes(w.id)
      );
      return assignedFolders.some(fid => activeFolderIds.includes(fid));
    });

    if (activeTab === 'saved') {
      filtered = filtered.filter(w => savedIds.includes(w.id));
    }
    return filtered;
  }, [activeTab, allWords, savedIds, folders, folderAssignments]);

  const currentTheme = THEMES[settings.theme] || THEMES.stylish;

  return (
    <div className={`relative w-full h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${currentTheme.bgClass}`}>
      <Header activeTab={activeTab} onTabChange={handleTabChange} savedCount={savedIds.length} openSettings={openSettings} themeKey={settings.theme} />

      <div ref={containerRef} className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {displayWords.length > 0 ? (
          <>
            {displayWords.map((word) => (
              <WordCard 
                key={word.id} 
                word={word} 
                isSaved={savedIds.includes(word.id)} 
                onToggleSave={toggleSave} 
                onOpenAddToFolder={openAddSheet}
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
              <FolderOpen size={40} className="opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No active words</h3>
            <p className="text-sm opacity-60 text-center max-w-xs mb-6">Active folders are empty or deselected.</p>
            <button onClick={() => openSettings('folders')} className="px-6 py-3 rounded-full bg-indigo-500 text-white font-bold text-sm shadow-lg hover:bg-indigo-600 transition-colors">Manage Folders</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            initialTab={settingsTab}
            settings={settings}
            updateSettings={updateSettings}
            folders={folders}
            toggleFolderActive={toggleFolderActive}
            onRenameFolder={handleRenameFolder}
            onDeleteFolder={handleDeleteFolder}
            onImportData={handleImportData}
          />
        )}
        {isAddSheetOpen && (
          <AddToFolderSheet 
            isOpen={isAddSheetOpen}
            onClose={() => setIsAddSheetOpen(false)}
            folders={folders}
            currentWordId={currentAddWordId}
            folderAssignments={folderAssignments}
            onToggleAssignment={handleToggleAssignment}
            onCreateFolder={handleCreateFolderFromSheet}
            themeKey={settings.theme}
          />
        )}
      </AnimatePresence>

      <style jsx global>{` .hide-scrollbar::-webkit-scrollbar { display: none; } `}</style>
    </div>
  );
};

export default App;
