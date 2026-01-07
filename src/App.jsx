import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Settings, X, Moon, Sun, Clock, Sparkles, BookOpen, Layers } from 'lucide-react';

// --- サンプルデータ (変更なし) ---
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
        className="w-full max-w-sm rounded-lg p-6 shadow-2xl bg-[#3c3c3c] text-white border border-gray-600"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings size={20} /> Settings
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* スピード調整 */}
        <div className="mb-8">
          <label className="flex justify-between items-center mb-2 font-medium">
            <span className="flex items-center gap-2"><Clock size={16} /> Reveal Speed</span>
            <span className="text-sm opacity-70">{settings.revealSpeed}s</span>
          </label>
          <input 
            type="range" min="0" max="3.0" step="0.1"
            value={settings.revealSpeed}
            onChange={(e) => updateSettings({ revealSpeed: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <div className="flex justify-between text-xs opacity-50 mt-1">
            <span>Fast (0s)</span>
            <span>Slow (3s)</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- 単語カードコンポーネント (シンプル化) ---
const WordCard = ({ word, isSaved, onToggleSave, settings }) => {
  const { revealSpeed } = settings;
  // ご指定の色 #3c3c3c を使用
  const bgColor = 'bg-[#3c3c3c]';
  const textColor = 'text-white';
  const subTextColor = 'text-gray-300';

  const revealVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: revealSpeed,
        duration: 0.3
      }
    }
  };

  return (
    <div className={`h-[100dvh] w-full flex-shrink-0 snap-start snap-always relative overflow-hidden flex flex-col justify-center items-center ${bgColor} border-b border-gray-700`}>
      
      {/* メインコンテンツ */}
      <div className="z-10 flex flex-col items-center w-full px-4 text-center">
        
        {/* 品詞バッジ (シンプルに) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true }}
          className="mb-4 px-3 py-1 text-xs font-bold border border-gray-400 rounded bg-transparent text-gray-300 uppercase tracking-wider"
        >
          {word.pos}
        </motion.div>

        {/* 英単語 (白文字) */}
        <motion.h2 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className={`text-6xl md:text-7xl font-medium tracking-tight mb-2 ${textColor}`}
        >
          {word.en}
        </motion.h2>

        {/* 日本語訳 */}
        <div className="h-16 flex items-center justify-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.5, once: false }}
            variants={revealVariants}
          >
            <p className={`text-2xl font-bold ${textColor}`}>
              {word.ja}
            </p>
          </motion.div>
        </div>

        {/* 例文セクション (装飾なし) */}
        <div className="absolute bottom-24 w-full px-6 max-w-md">
           <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.5, once: false }}
            variants={revealVariants}
            className="p-4 rounded border border-gray-600 bg-black/20"
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
          <div className={`p-3 rounded-full transition-all duration-200 ${
            isSaved ? 'bg-white/10' : 'bg-transparent'
          }`}>
            <Heart 
              size={32} 
              className={`transition-all duration-200 ${isSaved ? 'fill-white text-white' : 'text-gray-400'}`} 
            />
          </div>
          <span className="text-[10px] font-bold text-gray-400">Save</span>
        </button>
      </div>
    </div>
  );
};

// --- タブヘッダー & 設定トリガー ---
const Header = ({ activeTab, onTabChange, savedCount, onOpenSettings }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-6 flex justify-between items-start pointer-events-none">
      
      {/* 左上: 設定ボタン */}
      <button 
        onClick={onOpenSettings}
        className="pointer-events-auto p-3 rounded-full bg-[#3c3c3c] border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-all shadow-lg"
      >
        <Settings size={20} />
      </button>

      {/* 中央: タブ切り替え */}
      <div className="pointer-events-auto flex items-center bg-[#3c3c3c] rounded-full p-1 border border-gray-600 shadow-xl mx-auto absolute left-1/2 -translate-x-1/2 top-6">
        <button
          onClick={() => onTabChange('all')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'all' 
              ? 'bg-gray-200 text-[#3c3c3c]' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers size={14} /> All
        </button>
        <button
          onClick={() => onTabChange('saved')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'saved' 
              ? 'bg-gray-200 text-[#3c3c3c]' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart size={14} className={activeTab === 'saved' ? 'fill-[#3c3c3c]' : ''} />
          {savedCount > 0 && <span className="opacity-90">{savedCount}</span>}
        </button>
      </div>

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

  // 設定 (ダークモード切り替えは廃止)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : { revealSpeed: 0.5 };
  });

  useEffect(() => {
    setAllWords(shuffleArray(INITIAL_WORDS));
    const saved = localStorage.getItem('myVocabularySaved');
    if (saved) setSavedIds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('myVocabularySaved', JSON.stringify(savedIds));
  }, [savedIds]);

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
    // 背景色を指定色 #3c3c3c に固定
    <div className="relative w-full h-[100dvh] font-sans overflow-hidden bg-[#3c3c3c] text-white">
      
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        savedCount={savedIds.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
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
                isSaved={savedIds.includes(word.id)}
                onToggleSave={toggleSave}
                settings={settings}
              />
            ))}
            <div className="h-[30vh] w-full snap-start flex items-center justify-center bg-[#3c3c3c] text-gray-500 border-t border-gray-700">
              <div className="flex flex-col items-center gap-2">
                <Sparkles size={20} />
                <p className="text-xs font-medium uppercase tracking-widest">End of list</p>
              </div>
            </div>
          </>
        ) : (
          <div className="h-[100dvh] w-full flex flex-col items-center justify-center snap-start px-6 bg-[#3c3c3c] text-white">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-white/10">
              <BookOpen size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No saved words</h3>
            <button onClick={() => handleTabChange('all')} className="mt-4 text-gray-300 hover:text-white underline decoration-gray-500">Back to All Words</button>
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
