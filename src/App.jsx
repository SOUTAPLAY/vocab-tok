import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Settings, X, Moon, Sun, Clock, Sparkles, BookOpen, Layers } from 'lucide-react';

// --- サンプルデータ (形式更新) ---
const INITIAL_WORDS = [
  { id: 1, en: "comprehensive", pos: "形容詞", ja: "包括的な、総合的な", exEn: "We need a comprehensive guide.", exJa: "私たちには包括的なガイドが必要です。" },
  { id: 2, en: "innovation", pos: "名詞", ja: "革新、刷新", exEn: "Innovation distinguishes between a leader and a follower.", exJa: "革新はリーダーとフォロワーを区別する。" },
  { id: 3, en: "mandatory", pos: "形容詞", ja: "義務的な、必須の", exEn: "Attendance at the meeting is mandatory.", exJa: "会議への出席は義務です。" },
  { id: 4, en: "subsequent", pos: "形容詞", ja: "その後の、次の", exEn: "Subsequent events proved him wrong.", exJa: "その後の出来事が彼の誤りを証明した。" },
  { id: 5, en: "incentive", pos: "名詞", ja: "動機、報奨金", exEn: "There is no incentive to work harder.", exJa: "もっと一生懸命働く動機がない。" },
  { id: 6, en: "allocate", pos: "動詞", ja: "割り当てる、配分する", exEn: "They allocated funds for the project.", exJa: "彼らはそのプロジェクトに資金を割り当てた。" },
  { id: 7, en: "deficit", pos: "名詞", ja: "赤字、不足", exEn: "The government is trying to reduce the deficit.", exJa: "政府は赤字を減らそうとしている。" },
  { id: 8, en: "implement", pos: "動詞", ja: "実行する、履行する", exEn: "It is difficult to implement the new rules.", exJa: "新しい規則を実行するのは難しい。" },
  { id: 9, en: "perspective", pos: "名詞", ja: "観点、見通し", exEn: "Try to see things from my perspective.", exJa: "私の観点から物事を見るようにしてほしい。" },
  { id: 10, en: "revenue", pos: "名詞", ja: "収益、歳入", exEn: "The company's revenue increased by 20%.", exJa: "その会社の収益は20%増加した。" },
  { id: 11, en: "apprentice", pos: "名詞", ja: "実習生、見習い", exEn: "He started as an apprentice carpenter.", exJa: "彼は大工の見習いとして始めた。" },
  { id: 12, en: "negotiation", pos: "名詞", ja: "交渉", exEn: "The negotiations reached a deadlock.", exJa: "交渉は行き詰まった。" },
  { id: 13, en: "preliminary", pos: "形容詞", ja: "予備の、準備の", exEn: "This is just a preliminary sketch.", exJa: "これはほんの予備のスケッチだ。" },
  { id: 14, en: "soar", pos: "動詞", ja: "急上昇する", exEn: "Temperatures will soar over the weekend.", exJa: "週末にかけて気温が急上昇するだろう。" },
  { id: 15, en: "boost", pos: "動詞", ja: "促進する、高める", exEn: "We need to boost our sales.", exJa: "私たちは売上を伸ばす必要がある。" },
  { id: 16, en: "outcome", pos: "名詞", ja: "結果、成果", exEn: "We are waiting for the final outcome.", exJa: "私たちは最終的な結果を待っている。" },
  { id: 17, en: "conservative", pos: "形容詞", ja: "保守的な、控えめな", exEn: "He has conservative views on politics.", exJa: "彼は政治に対して保守的な考えを持っている。" },
  { id: 18, en: "distinguish", pos: "動詞", ja: "区別する", exEn: "It's hard to distinguish the twins.", exJa: "その双子を区別するのは難しい。" },
  { id: 19, en: "exclusively", pos: "副詞", ja: "独占的に、もっぱら", exEn: "This offer is available exclusively online.", exJa: "このオファーはオンライン限定です。" },
  { id: 20, en: "prohibit", pos: "動詞", ja: "禁止する", exEn: "Smoking is prohibited in this area.", exJa: "このエリアでの喫煙は禁止されています。" },
];

// --- ユーティリティ ---
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- 設定モーダル ---
const SettingsModal = ({ isOpen, onClose, settings, updateSettings }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl ${settings.darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
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

        {/* 1. スピード調整 */}
        <div className="mb-8">
          <label className="flex justify-between items-center mb-2 font-medium">
            <span className="flex items-center gap-2"><Clock size={16} /> Reveal Speed</span>
            <span className="text-sm opacity-70">{settings.revealSpeed}s</span>
          </label>
          <input 
            type="range" min="0" max="3.0" step="0.1"
            value={settings.revealSpeed}
            onChange={(e) => updateSettings({ revealSpeed: parseFloat(e.target.value) })}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs opacity-50 mt-1">
            <span>Fast (0s)</span>
            <span>Slow (3s)</span>
          </div>
        </div>

        {/* 2. ダークモード切り替え */}
        <div className="flex justify-between items-center p-4 rounded-xl bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            {settings.darkMode ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-orange-400" />}
            <span className="font-medium">Dark Mode</span>
          </div>
          <button 
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${settings.darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- 単語カードコンポーネント ---
const WordCard = ({ word, isSaved, onToggleSave, isActive, settings }) => {
  const { darkMode, revealSpeed } = settings;
  const textColor = darkMode ? 'text-white' : 'text-slate-900';
  const subTextColor = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`h-[100dvh] w-full flex-shrink-0 snap-start snap-always relative overflow-hidden flex flex-col justify-center items-center transition-colors duration-500 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* 背景装飾 */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-900/20 rounded-full blur-[80px]" />
      </div>

      {/* メインコンテンツ */}
      <div className="z-10 flex flex-col items-center w-full px-6 text-center">
        
        {/* 英単語 */}
        <motion.h2 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isActive ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          className={`text-6xl font-black tracking-tighter mb-2 ${textColor} drop-shadow-xl`}
        >
          {word.en}
        </motion.h2>

        {/* [修正] 品詞バッジ (英単語の直下) */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`mb-10 px-3 py-1 text-xs font-bold border rounded-full ${
            darkMode 
              ? 'text-indigo-300 border-indigo-500/30 bg-indigo-950/30' 
              : 'text-indigo-600 border-indigo-200 bg-indigo-50'
          }`}
        >
          {word.pos}
        </motion.div>

        {/* [修正] 日本語訳 (グラデーション廃止・白文字・ドロップシャドウ) */}
        <div className="h-16 flex items-center justify-center mb-8">
          <motion.p
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={isActive ? { opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ delay: revealSpeed, duration: 0.5 }} // 設定値のスピードを使用
            className={`text-3xl font-bold ${textColor} drop-shadow-md`}
          >
            {word.ja}
          </motion.p>
        </div>

        {/* [新規] 例文セクション (画面下部に配置・同時フェードイン) */}
        <div className="absolute bottom-24 w-full px-8">
           <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: revealSpeed, duration: 0.6 }} // 日本語訳と同期
            className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}
          >
            <p className={`text-lg font-medium leading-snug mb-2 ${textColor}`}>
              "{word.exEn}"
            </p>
            <p className={`text-sm ${subTextColor}`}>
              {word.exJa}
            </p>
          </motion.div>
        </div>
      </div>

      {/* サイドボタン */}
      <div className="absolute right-4 bottom-48 flex flex-col items-center gap-6 z-20">
        <button 
          onClick={() => onToggleSave(word.id)}
          className="group flex flex-col items-center gap-1 cursor-pointer"
        >
          <div className={`p-3.5 rounded-full transition-all duration-300 shadow-xl ${
            isSaved ? 'bg-rose-500/20' : (darkMode ? 'bg-slate-800/60' : 'bg-white/80')
          } backdrop-blur-md`}>
            <Heart 
              size={28} 
              className={`transition-all duration-300 ${isSaved ? 'fill-rose-500 text-rose-500 scale-110' : (darkMode ? 'text-white' : 'text-slate-800')}`} 
            />
          </div>
          <span className={`text-[10px] font-bold drop-shadow-md ${textColor}`}>Save</span>
        </button>
      </div>
    </div>
  );
};

// --- タブヘッダー & 設定トリガー ---
const Header = ({ activeTab, onTabChange, savedCount, onOpenSettings, darkMode }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-6 flex justify-between items-start pointer-events-none">
      
      {/* 左上: 設定ボタン */}
      <button 
        onClick={onOpenSettings}
        className={`pointer-events-auto p-3 rounded-full backdrop-blur-md border shadow-lg transition-all ${
          darkMode 
            ? 'bg-slate-800/50 text-white border-white/10 hover:bg-slate-700/50' 
            : 'bg-white/80 text-slate-800 border-black/5 hover:bg-white'
        }`}
      >
        <Settings size={20} />
      </button>

      {/* 中央: タブ切り替え */}
      <div className="pointer-events-auto flex items-center backdrop-blur-md rounded-full p-1 border shadow-xl mx-auto absolute left-1/2 -translate-x-1/2 top-6
        ${darkMode ? 'bg-slate-800/60 border-white/10' : 'bg-white/90 border-black/5'}"
      >
        <button
          onClick={() => onTabChange('all')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'all' 
              ? (darkMode ? 'bg-slate-700 text-white shadow-md' : 'bg-slate-100 text-slate-900 shadow-md')
              : (darkMode ? 'text-slate-400' : 'text-slate-500')
          }`}
        >
          <Layers size={14} /> All
        </button>
        <button
          onClick={() => onTabChange('saved')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'saved' 
              ? 'bg-rose-500 text-white shadow-md' 
              : (darkMode ? 'text-slate-400' : 'text-slate-500')
          }`}
        >
          <Heart size={14} className={activeTab === 'saved' ? 'fill-white' : ''} />
          {savedCount > 0 && <span className="opacity-90">{savedCount}</span>}
        </button>
      </div>

      {/* 右上のスペース確保用ダミー */}
      <div className="w-10"></div>
    </div>
  );
};

// --- アプリ本体 ---
const App = () => {
  const [allWords, setAllWords] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const containerRef = useRef(null);

  // 設定用State (LocalStorage永続化)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : { revealSpeed: 0.5, darkMode: true };
  });

  useEffect(() => {
    setAllWords(shuffleArray(INITIAL_WORDS));
    const saved = localStorage.getItem('myVocabularySaved');
    if (saved) setSavedIds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('myVocabularySaved', JSON.stringify(savedIds));
  }, [savedIds]);

  // 設定変更時に保存
  const updateSettings = (newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('appSettings', JSON.stringify(updated));
      return updated;
    });
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

  return (
    <div className={`relative w-full h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${settings.darkMode ? 'bg-black' : 'bg-slate-100'}`}>
      
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        savedCount={savedIds.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        darkMode={settings.darkMode}
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
                key={word.id} 
                word={word} 
                isActive={true} 
                isSaved={savedIds.includes(word.id)}
                onToggleSave={toggleSave}
                settings={settings}
              />
            ))}
            <div className={`h-[30vh] w-full snap-start flex items-center justify-center ${settings.darkMode ? 'bg-slate-950 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
              <div className="flex flex-col items-center gap-2">
                <Sparkles size={20} />
                <p className="text-xs font-medium uppercase tracking-widest">End of list</p>
              </div>
            </div>
          </>
        ) : (
          <div className={`h-[100dvh] w-full flex flex-col items-center justify-center snap-start px-6 ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${settings.darkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
              <BookOpen size={40} className="opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No saved words</h3>
            <button onClick={() => handleTabChange('all')} className="mt-4 text-indigo-500 hover:underline">Back to All Words</button>
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
