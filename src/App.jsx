import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Settings, X, Clock, Sparkles, FolderOpen, Layers, Palette, Check, Upload, Copy, AlertCircle, Plus, ListPlus, Database, ListMusic, Trash2, Edit2, Save, Square, CheckSquare, Shuffle, EyeOff, RefreshCcw, Volume2, Mic, PlayCircle, FastForward } from 'lucide-react';

// --- 初期データ ---
const INITIAL_SOURCE_ID = 'sample-source';
const INITIAL_SOURCES = [
  { id: INITIAL_SOURCE_ID, name: 'Sample Words (Built-in)', active: true }
];

const INITIAL_WORDS = [
  { id: 1, sourceId: INITIAL_SOURCE_ID, en: "comprehensive", pos: "形容詞", ja: "包括的な、総合的な", exEn: "We need a comprehensive guide.", exJa: "私たちには包括的なガイドが必要です。" },
  { id: 2, sourceId: INITIAL_SOURCE_ID, en: "innovation", pos: "名詞", ja: "革新、刷新", exEn: "Innovation distinguishes between a leader and a follower.", exJa: "革新はリーダーとフォロワーを区別する。" },
  { id: 3, sourceId: INITIAL_SOURCE_ID, en: "mandatory", pos: "形容詞", ja: "義務的な、必須の", exEn: "Attendance at the meeting is mandatory.", exJa: "会議への出席は義務です。" },
  { id: 4, sourceId: INITIAL_SOURCE_ID, en: "subsequent", pos: "形容詞", ja: "その後の、次の", exEn: "Subsequent events proved him wrong.", exJa: "その後の出来事が彼の誤りを証明した。" },
  { id: 5, sourceId: INITIAL_SOURCE_ID, en: "incentive", pos: "名詞", ja: "動機、報奨金", exEn: "There is no incentive to work harder.", exJa: "もっと一生懸命働く動機がない。" },
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

// 更新されたJSONサンプルフォーマット
const SAMPLE_JSON_FORMAT = `[
  {
    "en": "example",
    "pos": "名詞",
    "ja": "例",
    "exEn": "This is an example.",
    "exJa": "これは例です。"
  }
]`;

// 音声再生マネージャ
const speakUtterance = (text, lang, rate) => {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    
    // エラーハンドリングと終了処理
    utterance.onend = () => resolve();
    utterance.onerror = (e) => resolve(); // エラーでも止まらないようにresolve

    window.speechSynthesis.speak(utterance);
  });
};

// --- プレイリスト追加ボトムシート ---
const AddToPlaylistSheet = ({ isOpen, onClose, playlists, currentWordId, playlistAssignments, onToggleAssignment, onCreatePlaylist, themeKey }) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const t = THEMES[themeKey] || THEMES.stylish;

  if (!isOpen) return null;

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName);
      setNewPlaylistName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center pointer-events-none">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={onClose} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className={`w-full max-w-md rounded-t-2xl p-4 pb-8 pointer-events-auto shadow-2xl relative ${t.isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`} onClick={e => e.stopPropagation()}>
        <div className="w-12 h-1.5 bg-gray-500/20 rounded-full mx-auto mb-6" />
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-lg font-bold">Add to Playlist</h3>
          <button onClick={() => setIsCreating(!isCreating)} className="text-sm font-bold text-indigo-500 flex items-center gap-1 hover:underline"><Plus size={16} /> New Playlist</button>
        </div>
        {isCreating && (
          <div className="mb-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
            <input autoFocus type="text" placeholder="Playlist name..." value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} className={`flex-1 p-3 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`} />
            <button onClick={handleCreate} className="p-3 bg-indigo-500 text-white rounded-xl font-bold text-sm">Create</button>
          </div>
        )}
        <div className="space-y-1 max-h-[50vh] overflow-y-auto">
          {playlists.length === 0 && !isCreating && <p className="text-center text-sm opacity-50 py-4">No playlists yet. Create one!</p>}
          {playlists.map(playlist => {
            const isAssigned = (playlistAssignments[playlist.id] || []).includes(currentWordId);
            return (
              <div key={playlist.id} onClick={() => onToggleAssignment(playlist.id, currentWordId)} className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${t.isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isAssigned ? 'bg-indigo-500 border-indigo-500' : 'border-gray-400'}`}>{isAssigned && <Check size={14} className="text-white" />}</div>
                <div className="flex-1 font-medium">{playlist.name}</div>
              </div>
            );
          })}
        </div>
        <button onClick={onClose} className="w-full mt-6 py-3 rounded-xl font-bold bg-gray-500/10 hover:bg-gray-500/20 transition-colors">Done</button>
      </motion.div>
    </div>
  );
};

// --- 設定モーダル ---
const SettingsModal = ({ isOpen, onClose, settings, updateSettings, sources, toggleSourceActive, playlists, onRenamePlaylist, onDeletePlaylist, onImportData, initialTab, hiddenWords, onUnhideWord }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'settings');
  const [importStatus, setImportStatus] = useState('');
  const [newSourceName, setNewSourceName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => { if (isOpen && initialTab) setActiveTab(initialTab); }, [isOpen, initialTab]);
  if (!isOpen) return null;
  const t = THEMES[settings.theme] || THEMES.stylish;

  const startEditing = (item) => { setEditingId(item.id); setEditName(item.name); };
  const saveEditing = () => { if (editName.trim()) onRenamePlaylist(editingId, editName); setEditingId(null); };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const sourceName = newSourceName.trim() || `Imported ${new Date().toLocaleDateString()}`;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json)) {
          const newSourceId = generateId();
          const wordsToAdd = json.map(w => ({ ...w, id: w.id || generateId(), sourceId: newSourceId }));
          onImportData(newSourceId, sourceName, wordsToAdd);
          setImportStatus(`Success! Added "${sourceName}".`);
          setNewSourceName('');
          setTimeout(() => setImportStatus(''), 3000);
        } else { setImportStatus('Error: Invalid JSON format.'); }
      } catch (error) { setImportStatus('Error: Could not parse JSON.'); }
    };
    reader.readAsText(file);
    event.target.value = '';
  };
  const copyFormat = () => { navigator.clipboard.writeText(SAMPLE_JSON_FORMAT); setImportStatus('Copied!'); setTimeout(() => setImportStatus(''), 2000); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`w-full max-w-sm max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${t.isDark ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'}`} onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-500/10 flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2"><Settings size={18} /> Preferences</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 transition-colors"><X size={18} /></button>
        </div>
        <div className="flex border-b border-gray-500/10 overflow-x-auto">
          {['settings', 'speed', 'data', 'playlists', 'hidden'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[60px] py-3 text-[10px] font-bold uppercase tracking-wide ${activeTab === tab ? 'text-indigo-500 border-b-2 border-indigo-500' : 'opacity-50'}`}>{tab}</button>
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
              <div className="space-y-4">
                {/* シャッフル切り替え */}
                <div className={`flex items-center justify-between p-3 rounded-xl border ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <Shuffle size={18} className="opacity-70" />
                    <span className="text-sm font-bold">Shuffle Words</span>
                  </div>
                  <button onClick={() => updateSettings({ isShuffle: !settings.isShuffle })} className={`w-12 h-6 rounded-full p-1 transition-colors relative ${settings.isShuffle ? 'bg-indigo-500' : 'bg-gray-500/30'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.isShuffle ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
                {/* 自動読み上げ切り替え */}
                <div className={`flex items-center justify-between p-3 rounded-xl border ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <Volume2 size={18} className="opacity-70" />
                    <span className="text-sm font-bold">Auto-Speak</span>
                  </div>
                  <button onClick={() => updateSettings({ autoSpeak: !settings.autoSpeak })} className={`w-12 h-6 rounded-full p-1 transition-colors relative ${settings.autoSpeak ? 'bg-indigo-500' : 'bg-gray-500/30'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.autoSpeak ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
                {/* 自動送り切り替え */}
                <div className={`flex items-center justify-between p-3 rounded-xl border ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <FastForward size={18} className="opacity-70" />
                    <span className="text-sm font-bold">Auto-Scroll</span>
                  </div>
                  <button onClick={() => updateSettings({ autoScroll: !settings.autoScroll })} className={`w-12 h-6 rounded-full p-1 transition-colors relative ${settings.autoScroll ? 'bg-indigo-500' : 'bg-gray-500/30'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.autoScroll ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SPEEDタブ */}
          {activeTab === 'speed' && (
             <div className="space-y-8">
              <div>
                <label className="flex justify-between items-center mb-4 font-medium">
                  <span className="flex items-center gap-2 text-sm opacity-70"><Clock size={16} /> Reveal Speed</span>
                  <span className="text-sm font-mono font-bold bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded">{settings.revealSpeed}s</span>
                </label>
                <div className="relative h-10 flex items-center">
                  <input type="range" min="0" max="3.0" step="0.1" value={settings.revealSpeed} onChange={(e) => updateSettings({ revealSpeed: parseFloat(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                </div>
                <p className="text-[10px] opacity-50 mt-1">Delay before showing Japanese translation.</p>
              </div>

              <div>
                <label className="flex justify-between items-center mb-4 font-medium">
                  <span className="flex items-center gap-2 text-sm opacity-70"><Mic size={16} /> Speech Rate</span>
                  <span className="text-sm font-mono font-bold bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded">{settings.speechRate}x</span>
                </label>
                <div className="relative h-10 flex items-center">
                  <input type="range" min="0.5" max="2.0" step="0.1" value={settings.speechRate} onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                </div>
                 <p className="text-[10px] opacity-50 mt-1">Speed of text-to-speech voice.</p>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs opacity-60 mb-2">Toggle active source folders.</p>
                {sources.map(source => (
                  <div key={source.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${source.active ? (t.isDark ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200') : (t.isDark ? 'bg-transparent border-gray-700 opacity-70' : 'bg-transparent border-gray-200 opacity-70')}`}>
                    <div className="flex items-center gap-3 flex-1 overflow-hidden" onClick={() => toggleSourceActive(source.id)}>
                      <button className="flex-shrink-0">{source.active ? <CheckSquare size={18} className="text-indigo-500" /> : <Square size={18} />}</button>
                      <span className="font-bold text-sm truncate">{source.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-gray-500/20 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-2"><Database size={12} /> Import New Source</h3>
                <input type="text" value={newSourceName} onChange={(e) => setNewSourceName(e.target.value)} placeholder="Source Name (e.g. TOEIC)" className={`w-full p-3 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${t.isDark ? 'border-gray-700' : 'border-gray-300'}`} />
                <button onClick={() => fileInputRef.current.click()} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${t.isDark ? 'bg-white text-slate-900 hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-700'}`}><Upload size={18} /> Upload JSON</button>
                <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                {importStatus && <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${importStatus.includes('Error') ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}><AlertCircle size={14} /> {importStatus}</div>}
                
                <div className="pt-4 border-t border-gray-500/20">
                    <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold opacity-50">JSON FORMAT SAMPLE</span>
                    <button onClick={copyFormat} className="text-xs text-indigo-400 hover:underline flex items-center gap-1"><Copy size={10} /> Copy</button>
                    </div>
                    {/* JSONサンプル表示の修正部分 */}
                    <div className={`p-3 rounded-lg text-[10px] font-mono leading-relaxed opacity-70 overflow-x-auto whitespace-pre ${t.isDark ? 'bg-black/30' : 'bg-slate-100'}`}>
                      {SAMPLE_JSON_FORMAT}
                    </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'playlists' && (
            <div className="space-y-4">
              <p className="text-xs opacity-60 mb-2">Manage your custom playlists.</p>
              {playlists.length === 0 && <p className="text-sm opacity-50 italic">No playlists created yet.</p>}
              {playlists.map(playlist => (
                <div key={playlist.id} className={`flex items-center justify-between p-3 rounded-xl border ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <ListMusic size={18} className="opacity-50" />
                    {editingId === playlist.id ? <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-transparent border-b border-indigo-500 text-sm font-bold w-full focus:outline-none" autoFocus /> : <span className="font-bold text-sm truncate">{playlist.name}</span>}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {editingId === playlist.id ? <button onClick={saveEditing} className="p-1.5 hover:bg-indigo-500/20 rounded-md text-indigo-500"><Save size={14} /></button> : <button onClick={() => startEditing(playlist)} className="p-1.5 hover:bg-gray-500/10 rounded-md opacity-50 hover:opacity-100"><Edit2 size={14} /></button>}
                    <button onClick={() => { if(window.confirm('Delete playlist?')) onDeletePlaylist(playlist.id); }} className="p-1.5 hover:bg-rose-500/20 rounded-md text-rose-500 opacity-50 hover:opacity-100"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'hidden' && (
            <div className="space-y-4">
              <p className="text-xs opacity-60 mb-2">Words you've hidden from the feed.</p>
              {hiddenWords.length === 0 && <p className="text-sm opacity-50 italic">No hidden words.</p>}
              {hiddenWords.map(word => (
                <div key={word.id} className={`flex items-center justify-between p-3 rounded-xl border ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-sm">{word.en}</p>
                    <p className="text-xs opacity-60 truncate">{word.ja}</p>
                  </div>
                  <button onClick={() => onUnhideWord(word.id)} className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg text-xs font-bold hover:bg-indigo-500/20 flex items-center gap-1"><RefreshCcw size={12} /> Unhide</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- 単語カード (自動読み上げ対応) ---
const WordCard = ({ word, isSaved, onToggleSave, onOpenAddToPlaylist, onHideWord, settings, isActive, onPlaybackEnd }) => {
  const { revealSpeed, theme, autoSpeak, speechRate, autoScroll } = settings;
  const t = THEMES[theme] || THEMES.stylish;
  const [isHiding, setIsHiding] = useState(false);
  
  const isSpeakingRef = useRef(false);

  // 連続再生実行関数
  const playSequence = async () => {
    if (!window.speechSynthesis) return;
    if (isSpeakingRef.current) return; 
    
    isSpeakingRef.current = true;
    window.speechSynthesis.cancel(); 

    try {
      // 1. 英単語
      await speakUtterance(word.en, 'en-US', speechRate);
      if(!isSpeakingRef.current) return;
      
      // 2. 日本語訳
      await speakUtterance(word.ja, 'ja-JP', speechRate);
      if(!isSpeakingRef.current) return;
      
      // 3. 英語例文
      await speakUtterance(word.exEn, 'en-US', speechRate);
      if(!isSpeakingRef.current) return;

      // 4. 日本語例文
      await speakUtterance(word.exJa, 'ja-JP', speechRate);
      
    } catch (e) {
      console.error(e);
    } finally {
      if(isSpeakingRef.current) {
        if(autoScroll) onPlaybackEnd();
        isSpeakingRef.current = false;
      }
    }
  };

  useEffect(() => {
    if (isActive && autoSpeak) {
      const timer = setTimeout(() => {
        playSequence();
      }, 500);
      
      return () => {
        clearTimeout(timer);
        isSpeakingRef.current = false;
        window.speechSynthesis.cancel();
      };
    }
  }, [isActive, word.id, autoSpeak]); 

  const handleHideClick = () => {
    setIsHiding(true);
    setTimeout(() => { onHideWord(word.id); }, 400);
  };

  const handleManualSpeak = () => {
    isSpeakingRef.current = false; 
    playSequence();
  };

  const revealVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: revealSpeed, duration: 0.4 } } };

  if (isHiding) {
    return (
      <div className={`h-[100dvh] w-full flex-shrink-0 flex items-center justify-center transition-all duration-500 ease-in-out bg-black`}>
        <motion.div initial={{ scale: 1, opacity: 1 }} animate={{ scale: 0.8, opacity: 0, y: -50 }} transition={{ duration: 0.4 }} className="text-white font-bold flex flex-col items-center gap-2"><EyeOff size={40} className="text-indigo-400" /><span>Hiding...</span></motion.div>
      </div>
    );
  }

  return (
    <div className={`h-[100dvh] w-full flex-shrink-0 snap-start snap-always relative overflow-hidden flex flex-col justify-center items-center transition-colors duration-500 ${t.bgClass} border-b ${t.cardBorder}`}>
      {t.hasEffects && <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-indigo-900/10 to-black/80" />}
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
      <div className="absolute right-4 bottom-48 flex flex-col items-center gap-6 z-20">
        <button onClick={() => onToggleSave(word.id)} className="group flex flex-col items-center gap-1 cursor-pointer">
          <div className={`p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-md ${t.buttonBg} ${isSaved ? 'ring-2 ring-rose-500 bg-rose-500/10' : ''}`}>
            <Heart size={28} className={`transition-all duration-300 ${isSaved ? 'fill-rose-500 text-rose-500 scale-110' : (t.isDark ? 'text-white' : 'text-slate-700')}`} />
          </div>
          <span className={`text-[10px] font-bold drop-shadow-md ${t.textSub}`}>Like</span>
        </button>
        <button onClick={() => onOpenAddToPlaylist(word.id)} className="group flex flex-col items-center gap-1 cursor-pointer">
          <div className={`p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-md ${t.buttonBg} hover:bg-indigo-500/20`}>
            <ListPlus size={28} className={`transition-all duration-300 ${t.isDark ? 'text-white' : 'text-slate-700'}`} />
          </div>
          <span className={`text-[10px] font-bold drop-shadow-md ${t.textSub}`}>Add</span>
        </button>
        
        {/* 手動再生ボタン */}
        <button onClick={handleManualSpeak} className="group flex flex-col items-center gap-1 cursor-pointer">
          <div className={`p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-md ${t.buttonBg} hover:bg-indigo-500/20`}>
            <Volume2 size={24} className={`transition-all duration-300 ${t.isDark ? 'text-white' : 'text-slate-700'}`} />
          </div>
          <span className={`text-[10px] font-bold drop-shadow-md ${t.textSub}`}>Speak</span>
        </button>

        <button onClick={handleHideClick} className="group flex flex-col items-center gap-1 cursor-pointer">
          <div className={`p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-md ${t.buttonBg} hover:bg-gray-500/20`}>
            <EyeOff size={24} className={`transition-all duration-300 ${t.isDark ? 'text-white opacity-50 hover:opacity-100' : 'text-slate-700 opacity-50 hover:opacity-100'}`} />
          </div>
          <span className={`text-[10px] font-bold drop-shadow-md ${t.textSub}`}>Hide</span>
        </button>
      </div>
    </div>
  );
};

// --- ヘッダー ---
const Header = ({ activeTab, onTabChange, savedCount, openSettings, themeKey, playlists }) => {
  const t = THEMES[themeKey] || THEMES.stylish;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const selectTab = (tab) => { onTabChange(tab); setIsMenuOpen(false); };
  
  let currentLabel = "Main Feed";
  if (activeTab === 'saved') currentLabel = "Favorites";
  else if (activeTab !== 'all') {
    const p = playlists.find(p => p.id === activeTab);
    if (p) currentLabel = p.name;
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-6 flex justify-between items-start pointer-events-none">
      <button onClick={() => openSettings('settings')} className={`pointer-events-auto p-3 rounded-full backdrop-blur-md border shadow-lg transition-all ${t.buttonBg} ${t.isDark ? 'text-white border-white/10' : 'text-slate-800 border-black/5'}`}><Settings size={20} /></button>
      <div className="pointer-events-auto relative">
        <button onClick={toggleMenu} className={`px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 backdrop-blur-md border ${t.buttonBg} ${t.isDark ? 'text-white border-white/10' : 'text-slate-800 border-black/5'}`}>
          {activeTab === 'all' ? <Layers size={16} /> : (activeTab === 'saved' ? <Heart size={16} className="text-rose-500 fill-rose-500" /> : <ListMusic size={16} className="text-indigo-400" />)}
          {currentLabel}
        </button>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl shadow-2xl border overflow-hidden flex flex-col ${t.isDark ? 'bg-slate-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-slate-900'}`}>
              <button onClick={() => selectTab('all')} className="p-3 text-left hover:bg-indigo-500/10 flex items-center gap-2 text-sm font-bold"><Layers size={14} /> Main Feed</button>
              <button onClick={() => selectTab('saved')} className="p-3 text-left hover:bg-indigo-500/10 flex items-center gap-2 text-sm font-bold"><Heart size={14} className="text-rose-500" /> Favorites ({savedCount})</button>
              {playlists.length > 0 && <div className="h-px bg-gray-500/20 mx-2 my-1" />}
              {playlists.map(p => (
                <button key={p.id} onClick={() => selectTab(p.id)} className="p-3 text-left hover:bg-indigo-500/10 flex items-center gap-2 text-sm font-medium"><ListMusic size={14} className="opacity-70" /> {p.name}</button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-10"></div>
    </div>
  );
};

// --- アプリ本体 ---
const App = () => {
  const [sources, setSources] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [hiddenIds, setHiddenIds] = useState([]);
  const [playlistAssignments, setPlaylistAssignments] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('settings');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [currentAddWordId, setCurrentAddWordId] = useState(null);
  
  const [activeWordId, setActiveWordId] = useState(null);
  const containerRef = useRef(null);
  
  const [settings, setSettings] = useState(() => { 
    const saved = localStorage.getItem('appSettings'); 
    return saved ? JSON.parse(saved) : { revealSpeed: 0.5, theme: 'stylish', isShuffle: true, autoSpeak: false, speechRate: 1.0, autoScroll: false }; 
  });

  const openSettings = (tab = 'settings') => { setSettingsTab(tab); setIsSettingsOpen(true); };
  const openAddSheet = (wordId) => { setCurrentAddWordId(wordId); setIsAddSheetOpen(true); };

  const scrollToNext = () => {
    if (containerRef.current) {
      const h = window.innerHeight;
      containerRef.current.scrollBy({ top: h, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if(id) setActiveWordId(id);
          }
        });
      },
      { root: containerRef.current, threshold: 0.6 }
    );
    const cards = document.querySelectorAll('.word-card');
    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [allWords, activeTab, hiddenIds]);

  useEffect(() => {
    const savedSources = localStorage.getItem('vocabSources');
    if (savedSources) setSources(JSON.parse(savedSources));
    else { setSources(INITIAL_SOURCES); localStorage.setItem('vocabSources', JSON.stringify(INITIAL_SOURCES)); }
    
    const savedPlaylists = localStorage.getItem('vocabPlaylists');
    if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
    else setPlaylists([]);

    const savedWords = localStorage.getItem('myVocabularyData');
    if (savedWords) {
      const parsedWords = JSON.parse(savedWords);
      const fixedWords = parsedWords.map(w => ({ ...w, sourceId: w.sourceId || w.folderId || INITIAL_SOURCE_ID }));
      setAllWords(fixedWords);
    } else { 
      const initial = shuffleArray(INITIAL_WORDS); 
      setAllWords(initial); 
      localStorage.setItem('myVocabularyData', JSON.stringify(initial)); 
    }

    const savedLikes = localStorage.getItem('myVocabularySaved');
    if (savedLikes) setSavedIds(JSON.parse(savedLikes));
    
    const savedHidden = localStorage.getItem('vocabHidden');
    if (savedHidden) setHiddenIds(JSON.parse(savedHidden));
    
    const savedAssigns = localStorage.getItem('vocabAssignments');
    if (savedAssigns) setPlaylistAssignments(JSON.parse(savedAssigns));
  }, []);

  useEffect(() => localStorage.setItem('vocabSources', JSON.stringify(sources)), [sources]);
  useEffect(() => localStorage.setItem('vocabPlaylists', JSON.stringify(playlists)), [playlists]);
  useEffect(() => localStorage.setItem('myVocabularyData', JSON.stringify(allWords)), [allWords]);
  useEffect(() => localStorage.setItem('myVocabularySaved', JSON.stringify(savedIds)), [savedIds]);
  useEffect(() => localStorage.setItem('vocabHidden', JSON.stringify(hiddenIds)), [hiddenIds]);
  useEffect(() => localStorage.setItem('vocabAssignments', JSON.stringify(playlistAssignments)), [playlistAssignments]);
  useEffect(() => localStorage.setItem('appSettings', JSON.stringify(settings)), [settings]);

  const updateSettings = (newSettings) => setSettings(prev => ({ ...prev, ...newSettings }));
  const toggleSave = (id) => setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const handleTabChange = (tab) => { setActiveTab(tab); if (containerRef.current) containerRef.current.scrollTo({ top: 0 }); };

  const toggleSourceActive = (sourceId) => setSources(prev => prev.map(s => s.id === sourceId ? { ...s, active: !s.active } : s));
  const handleImportData = (newSourceId, sourceName, newWords) => {
    setSources(prev => [...prev, { id: newSourceId, name: sourceName, active: true }]);
    if (settings.isShuffle) setAllWords(prev => shuffleArray([...prev, ...newWords]));
    else setAllWords(prev => [...prev, ...newWords]);
  };

  const handleCreatePlaylist = (name) => {
    const newId = generateId();
    setPlaylists(prev => [...prev, { id: newId, name }]);
    if (isAddSheetOpen && currentAddWordId) handleToggleAssignment(newId, currentAddWordId);
  };
  const handleRenamePlaylist = (id, newName) => setPlaylists(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
  const handleDeletePlaylist = (id) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    if (activeTab === id) setActiveTab('all');
    const newAssigns = { ...playlistAssignments };
    delete newAssigns[id];
    setPlaylistAssignments(newAssigns);
  };
  const handleToggleAssignment = (playlistId, wordId) => {
    setPlaylistAssignments(prev => {
      const current = prev[playlistId] || [];
      return { ...prev, [playlistId]: current.includes(wordId) ? current.filter(id => id !== wordId) : [...current, wordId] };
    });
  };

  const handleHideWord = (id) => setHiddenIds(prev => [...prev, id]);
  const handleUnhideWord = (id) => setHiddenIds(prev => prev.filter(hid => hid !== id));

  const displayWords = useMemo(() => {
    const activeSourceIds = sources.filter(s => s.active).map(s => s.id);
    let basePool = allWords.filter(w => activeSourceIds.includes(w.sourceId));
    basePool = basePool.filter(w => !hiddenIds.includes(w.id));

    if (!settings.isShuffle) basePool.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (activeTab === 'all') return basePool;
    else if (activeTab === 'saved') return basePool.filter(w => savedIds.includes(w.id));
    else {
      const assignedWordIds = playlistAssignments[activeTab] || [];
      return basePool.filter(w => assignedWordIds.includes(w.id));
    }
  }, [activeTab, allWords, sources, savedIds, playlistAssignments, hiddenIds, settings.isShuffle]);

  const hiddenWordObjects = useMemo(() => allWords.filter(w => hiddenIds.includes(w.id)), [allWords, hiddenIds]);
  const currentTheme = THEMES[settings.theme] || THEMES.stylish;

  return (
    <div className={`relative w-full h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${currentTheme.bgClass}`}>
      <Header activeTab={activeTab} onTabChange={handleTabChange} savedCount={savedIds.length} openSettings={openSettings} themeKey={settings.theme} playlists={playlists} />
      <div ref={containerRef} className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {displayWords.length > 0 ? (
          <>
            {displayWords.map((word) => (
              <div key={word.id} data-id={word.id} className="word-card h-[100dvh] w-full snap-start snap-always">
                <WordCard 
                  word={word} 
                  isSaved={savedIds.includes(word.id)} 
                  onToggleSave={toggleSave} 
                  onOpenAddToPlaylist={openAddSheet} 
                  onHideWord={handleHideWord} 
                  settings={settings}
                  isActive={String(activeWordId) === String(word.id)}
                  onPlaybackEnd={scrollToNext}
                />
              </div>
            ))}
            <div className={`h-[30vh] w-full snap-start flex items-center justify-center border-t ${currentTheme.bgClass} ${currentTheme.cardBorder} ${currentTheme.textSub}`}><div className="flex flex-col items-center gap-2"><Sparkles size={20} /><p className="text-xs font-medium uppercase tracking-widest">End of list</p></div></div>
          </>
        ) : (
          <div className={`h-[100dvh] w-full flex flex-col items-center justify-center snap-start px-6 ${currentTheme.bgClass} ${currentTheme.textMain}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${currentTheme.buttonBg}`}><FolderOpen size={40} className="opacity-50" /></div>
            <h3 className="text-2xl font-bold mb-2">No active words</h3>
            <p className="text-sm opacity-60 text-center max-w-xs mb-6">Check your data sources or add words to this playlist.</p>
            <button onClick={() => openSettings('data')} className="px-6 py-3 rounded-full bg-indigo-500 text-white font-bold text-sm shadow-lg hover:bg-indigo-600 transition-colors">Manage Data</button>
          </div>
        )}
      </div>
      <AnimatePresence>
        {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} initialTab={settingsTab} settings={settings} updateSettings={updateSettings} sources={sources} toggleSourceActive={toggleSourceActive} playlists={playlists} onRenamePlaylist={handleRenamePlaylist} onDeletePlaylist={handleDeletePlaylist} onImportData={handleImportData} hiddenWords={hiddenWordObjects} onUnhideWord={handleUnhideWord} />}
        {isAddSheetOpen && <AddToPlaylistSheet isOpen={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)} playlists={playlists} currentWordId={currentAddWordId} playlistAssignments={playlistAssignments} onToggleAssignment={handleToggleAssignment} onCreatePlaylist={handleCreatePlaylist} themeKey={settings.theme} />}
      </AnimatePresence>
      <style jsx global>{` .hide-scrollbar::-webkit-scrollbar { display: none; } `}</style>
    </div>
  );
};

export default App;
