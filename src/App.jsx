import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, List, X, Volume2, Sparkles, Search } from 'lucide-react';

// --- サンプルデータ (TOEIC 700点レベル) ---
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

// --- コンポーネント: 単語カード (1画面分) ---
const WordCard = ({ word, isSaved, onToggleSave }) => {
  return (
    <div className="h-[100dvh] w-full flex flex-col justify-center items-center relative snap-start bg-slate-950 border-b border-slate-900 overflow-hidden">
      
      {/* 背景装飾 (没入感を高めるグラデーション) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-black pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />

      {/* メインコンテンツエリア */}
      <div className="z-10 flex flex-col items-center justify-center w-full px-8 text-center space-y-8">
        
        {/* 品詞タグ */}
        <motion.span 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-3 py-1 text-xs font-medium tracking-wider text-indigo-300 uppercase bg-indigo-900/30 rounded-full border border-indigo-500/20"
        >
          {word.part}
        </motion.span>

        {/* 英単語 (メイン) */}
        <motion.h2 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="text-6xl font-black tracking-tighter text-white drop-shadow-2xl"
        >
          {word.en}
        </motion.h2>

        {/* 日本語訳 (0.5秒遅延でフェードイン - これが学習の肝) */}
        <div className="h-24 flex flex-col items-center justify-start">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ delay: 0.5, duration: 0.8 }} // 0.5秒待ってから表示
            className="flex flex-col items-center space-y-3"
          >
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
              {word.ja}
            </p>
            <p className="text-sm text-slate-400 font-light italic max-w-xs">
              "{word.sentence}"
            </p>
          </motion.div>
        </div>
      </div>

      {/* 右側のアクションバー (TikTokスタイル) */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-20">
        
        {/* Likeボタン */}
        <button 
          onClick={() => onToggleSave(word.id)}
          className="group flex flex-col items-center gap-1"
        >
          <div className={`p-3 rounded-full transition-all duration-300 ${isSaved ? 'bg-white/10' : 'bg-transparent'}`}>
            <Heart 
              size={32} 
              className={`transition-all duration-300 ${isSaved ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white group-active:scale-90'}`} 
            />
          </div>
          <span className="text-xs font-medium text-white shadow-black drop-shadow-md">Save</span>
        </button>

        {/* ダミーの音声ボタン (機能拡張用) */}
        <button className="group flex flex-col items-center gap-1 opacity-80 hover:opacity-100">
          <div className="p-3 bg-slate-800/50 rounded-full backdrop-blur-sm">
            <Volume2 size={28} className="text-white" />
          </div>
          <span className="text-xs font-medium text-white shadow-black drop-shadow-md">Sound</span>
        </button>
      </div>
    </div>
  );
};

// --- コンポーネント: 保存リスト画面 ---
const SavedList = ({ savedWords, words, onClose, onRemove }) => {
  // 保存されたIDに基づいて単語データをフィルタリング
  const savedItems = words.filter(w => savedWords.includes(w.id));

  return (
    <motion.div 
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col"
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Heart className="fill-rose-500 text-rose-500" size={20} />
          Saved Words ({savedItems.length})
        </h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 text-white">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {savedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
            <Sparkles size={48} className="text-slate-700" />
            <p>No saved words yet.</p>
            <button onClick={onClose} className="text-indigo-400 text-sm hover:underline">
              Go back to discover
            </button>
          </div>
        ) : (
          savedItems.map(word => (
            <div key={word.id} className="bg-slate-900 rounded-xl p-4 flex justify-between items-center border border-slate-800 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-white">{word.en}</h3>
                <p className="text-emerald-400 text-sm">{word.ja}</p>
              </div>
              <button 
                onClick={() => onRemove(word.id)}
                className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
              >
                <Heart size={20} className="fill-rose-500 text-rose-500" />
              </button>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

// --- メインアプリ ---
const App = () => {
  const [words, setWords] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [isSavedListOpen, setIsSavedListOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  // 初期化：単語シャッフルとローカルストレージ読み込み
  useEffect(() => {
    setWords(shuffleArray(INITIAL_WORDS));
    
    const saved = localStorage.getItem('myVocabularySaved');
    if (saved) {
      setSavedIds(JSON.parse(saved));
    }
  }, []);

  // 保存状態が変化したらローカルストレージを更新
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

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white overflow-hidden font-sans">
      
      {/* メインフィード (スクロールスナップコンテナ) */}
      <div 
        ref={scrollContainerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // スクロールバー非表示
      >
        {words.map((word) => (
          <WordCard 
            key={word.id} 
            word={word} 
            isSaved={savedIds.includes(word.id)}
            onToggleSave={toggleSave}
          />
        ))}
        
        {/* 最後までいったら... */}
        <div className="h-[20vh] w-full snap-start flex items-center justify-center bg-slate-950 text-slate-500">
          <p className="text-sm">All words reviewed! Reload to shuffle.</p>
        </div>
      </div>

      {/* ヘッダーナビゲーション (Floating) */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-xl font-bold tracking-tighter text-white drop-shadow-md">
            Vocab<span className="text-indigo-500">Tok</span>
          </h1>
        </div>
        
        <button 
          onClick={() => setIsSavedListOpen(true)}
          className="pointer-events-auto bg-slate-800/50 backdrop-blur-md p-3 rounded-full text-white border border-white/10 shadow-lg active:scale-95 transition-all"
        >
          <List size={20} />
          {savedIds.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">
              {savedIds.length}
            </span>
          )}
        </button>
      </div>

      {/* 保存リストモーダル */}
      <AnimatePresence>
        {isSavedListOpen && (
          <SavedList 
            savedWords={savedIds} 
            words={INITIAL_WORDS} // 元の全データリストを渡す
            onClose={() => setIsSavedListOpen(false)}
            onRemove={toggleSave}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Chrome, Safari, Edgeでスクロールバーを隠す */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default App;
