import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Volume2, BookOpen, Layers } from 'lucide-react';

// --- サンプルデータ ---
const INITIAL_WORDS = [
  { id: 1, en: "innovation", ja: "革新", part: "noun", sentence: "Technological innovation is key." },
  { id: 2, en: "mandatory", ja: "義務的な", part: "adj", sentence: "Attendance is mandatory." },
  { id: 3, en: "subsequent", ja: "その後の", part: "adj", sentence: "Subsequent events proved him wrong." },
  { id: 4, en: "comprehensive", ja: "包括的な", part: "adj", sentence: "A comprehensive study." },
  { id: 5, en: "incentive", ja: "動機、報奨金", part: "noun", sentence: "Financial incentives for employees." },
  { id: 6, en: "allocate", ja: "割り当てる", part: "verb", sentence: "Allocate resources efficiently." },
  { id: 7, en: "deficit", ja: "赤字、不足", part: "noun", sentence: "Reduce the budget deficit." },
  { id: 8, en: "implement", ja: "実行する", part: "verb", sentence: "Implement the new strategy." },
  { id: 9, en: "perspective", ja: "観点、見通し", part: "noun", sentence: "From a global perspective." },
  { id: 10, en: "revenue", ja: "収益", part: "noun", sentence: "Annual tax revenue." },
  { id: 11, en: "apprentice", ja: "実習生、弟子", part: "noun", sentence: "He works as an apprentice." },
  { id: 12, en: "negotiation", ja: "交渉", part: "noun", sentence: "Contract negotiations." },
  { id: 13, en: "preliminary", ja: "予備の", part: "adj", sentence: "Preliminary results are good." },
  { id: 14, en: "soar", ja: "急上昇する", part: "verb", sentence: "Stock prices soared." },
  { id: 15, en: "boost", ja: "促進する", part: "verb", sentence: "Boost the economy." },
  { id: 16, en: "outcome", ja: "結果", part: "noun", sentence: "The outcome of the election." },
  { id: 17, en: "conservative", ja: "保守的な", part: "adj", sentence: "A conservative estimate." },
  { id: 18, en: "distinguish", ja: "区別する", part: "verb", sentence: "Distinguish between right and wrong." },
  { id: 19, en: "exclusively", ja: "独占的に", part: "adv", sentence: "Available exclusively online." },
  { id: 20, en: "prohibit", ja: "禁止する", part: "verb", sentence: "Smoking is prohibited here." },
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

// --- コンポーネント: 単語カード ---
const WordCard = ({ word, isSaved, onToggleSave, isActive }) => {
  return (
    // 【重要修正】snap-always を追加。これにより勢いよくスクロールしても必ずここで止まる
    <div className="h-[100dvh] w-full flex-shrink-0 snap-start snap-always relative bg-slate-950 border-b border-slate-900 overflow-hidden flex flex-col justify-center items-center">
      
      {/* 背景エフェクト */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]" />

      {/* メインコンテンツ */}
      <div className="z-10 flex flex-col items-center justify-center w-full px-6 text-center space-y-10">
        
        {/* 品詞 */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="px-4 py-1.5 text-xs font-bold tracking-widest text-indigo-300 uppercase bg-indigo-950/50 rounded-full border border-indigo-500/20 shadow-lg shadow-indigo-500/10"
        >
          {word.part}
        </motion.div>

        {/* 英単語 */}
        <motion.h2 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isActive ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          className="text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-2xl"
        >
          {word.en}
        </motion.h2>

        {/* 日本語訳 & 例文 (遅延表示) */}
        <div className="h-32 w-full flex flex-col items-center justify-start">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            animate={isActive ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }} // 0.5秒遅延
            className="flex flex-col items-center space-y-4"
          >
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
              {word.ja}
            </p>
            <p className="text-sm text-slate-400 font-light italic max-w-xs leading-relaxed">
              "{word.sentence}"
            </p>
          </motion.div>
        </div>
      </div>

      {/* サイドボタン (TikTok風) */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
        <button 
          onClick={() => onToggleSave(word.id)}
          className="group flex flex-col items-center gap-1 cursor-pointer"
        >
          <div className={`p-3.5 rounded-full transition-all duration-300 shadow-xl ${isSaved ? 'bg-white/10' : 'bg-slate-800/40 backdrop-blur-sm'}`}>
            <Heart 
              size={28} 
              className={`transition-all duration-300 ${isSaved ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white group-active:scale-75'}`} 
            />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md">Save</span>
        </button>

        <button className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
          <div className="p-3.5 bg-slate-800/40 backdrop-blur-sm rounded-full">
            <Volume2 size={24} className="text-white" />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md">Speak</span>
        </button>
      </div>
    </div>
  );
};

// --- コンポーネント: タブナビゲーション ---
const TabHeader = ({ activeTab, onTabChange, savedCount }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-6 pb-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none flex justify-center">
      <div className="pointer-events-auto flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/5 shadow-2xl">
        <button
          onClick={() => onTabChange('all')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'all' 
              ? 'bg-white text-black shadow-lg' 
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Layers size={14} />
          All
        </button>
        <button
          onClick={() => onTabChange('saved')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'saved' 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Heart size={14} className={activeTab === 'saved' ? 'fill-white' : ''} />
          Saved
          {savedCount > 0 && <span className="ml-1 text-[10px] opacity-80">({savedCount})</span>}
        </button>
      </div>
    </div>
  );
};

// --- コンポーネント: 空の状態 ---
const EmptyState = ({ onBack }) => (
  <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-slate-950 text-center px-6 snap-start">
    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6">
      <BookOpen size={40} className="text-slate-600" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-2">No saved words yet</h3>
    <p className="text-slate-400 mb-8 max-w-xs">
      Tap the heart icon on any word to build your personal collection.
    </p>
    <button 
      onClick={onBack}
      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-colors shadow-lg shadow-indigo-500/30"
    >
      Start Learning
    </button>
  </div>
);

// --- メインアプリ ---
const App = () => {
  const [allWords, setAllWords] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'saved'
  const containerRef = useRef(null);

  // 初期化
  useEffect(() => {
    setAllWords(shuffleArray(INITIAL_WORDS));
    const saved = localStorage.getItem('myVocabularySaved');
    if (saved) {
      setSavedIds(JSON.parse(saved));
    }
  }, []);

  // 保存処理
  useEffect(() => {
    localStorage.setItem('myVocabularySaved', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = (id) => {
    setSavedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(savedId => savedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 表示する単語リストの切り替え
  const displayWords = useMemo(() => {
    if (activeTab === 'saved') {
      // 保存順ではなく、現在のリストの順序を維持しつつフィルタリング
      return allWords.filter(word => savedIds.includes(word.id));
    }
    return allWords;
  }, [activeTab, allWords, savedIds]);

  // タブ切り替え時にスクロール位置をトップにリセット（重要修正）
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white font-sans overflow-hidden">
      
      {/* タブヘッダー */}
      <TabHeader 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        savedCount={savedIds.length} 
      />

      {/* 
        スクロールコンテナ
        - snap-y: 縦方向のスナップ有効
        - snap-mandatory: 必ずどこかの要素で止める
        - h-full: 画面いっぱい
        - overflow-y-scroll: スクロール許可
      */}
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
                isActive={true} // 簡易的に常にアクティブとしているが、IntersectionObserverを使えばさらに最適化可能
                isSaved={savedIds.includes(word.id)}
                onToggleSave={toggleSave}
              />
            ))}
            
            {/* リスト末尾のメッセージ */}
            <div className="h-[30vh] w-full snap-start flex items-center justify-center bg-slate-950 text-slate-600">
              <div className="flex flex-col items-center gap-2">
                <Sparkles size={20} />
                <p className="text-xs font-medium uppercase tracking-widest">
                  {activeTab === 'all' ? "You've seen all words" : "End of saved collection"}
                </p>
              </div>
            </div>
          </>
        ) : (
          /* 保存リストが空の場合の表示 */
          <EmptyState onBack={() => handleTabChange('all')} />
        )}
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default App;
