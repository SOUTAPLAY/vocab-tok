import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Settings, X, Clock, Sparkles, FolderOpen, Layers, Palette, Check, Upload, Copy, AlertCircle, Plus, ListPlus, Database, ListMusic, Trash2, Edit2, Save, Square, CheckSquare, Shuffle, EyeOff, RefreshCcw, Volume2, Mic, FastForward, Zap, FolderCog, Link2, Link2Off } from 'lucide-react';

// --- 初期データ定義 ---
// IDを変更して、以前のデータ(Essential Academic)と区別し、強制アップデートのトリガーにする
const INITIAL_SOURCE_ID = 'advanced-academic-v2';
const INITIAL_SOURCES = [
  { id: INITIAL_SOURCE_ID, name: 'Advanced Academic & Idioms', active: true }
];

// ユーザー提供の生データ
const RAW_WORD_LIST = [
    { "en": "achieve", "pos": "動詞", "ja": "達成する", "exEn": "She achieved her goal of graduating with honors.", "exJa": "彼女は優秀な成績で卒業する目標を達成した。" },
    { "en": "analyze", "pos": "動詞", "ja": "分析する", "exEn": "We need to analyze the data carefully.", "exJa": "私たちはデータを注意深く分析する必要がある。" },
    { "en": "approach", "pos": "名詞・動詞", "ja": "アプローチ、接近する", "exEn": "His approach to solving problems is very creative.", "exJa": "彼の問題解決へのアプローチは非常に創造的だ。" },
    { "en": "aspect", "pos": "名詞", "ja": "側面、観点", "exEn": "We need to consider every aspect of the situation.", "exJa": "私たちは状況のあらゆる側面を考慮する必要がある。" },
    { "en": "assume", "pos": "動詞", "ja": "仮定する、思い込む", "exEn": "Don't assume that everyone agrees with you.", "exJa": "誰もがあなたに同意していると思い込んではいけない。" },
    { "en": "benefit", "pos": "名詞・動詞", "ja": "利益、恩恵", "exEn": "Exercise has many health benefits.", "exJa": "運動には多くの健康上の利益がある。" },
    { "en": "concept", "pos": "名詞", "ja": "概念、考え", "exEn": "The concept of time is difficult to explain.", "exJa": "時間の概念を説明するのは難しい。" },
    { "en": "consist", "pos": "動詞", "ja": "構成される", "exEn": "The committee consists of ten members.", "exJa": "委員会は10人のメンバーで構成されている。" },
    { "en": "constitute", "pos": "動詞", "ja": "構成する", "exEn": "Women constitute 40% of the workforce.", "exJa": "女性は労働力の40%を構成している。" },
    { "en": "context", "pos": "名詞", "ja": "文脈、状況", "exEn": "You need to understand words in context.", "exJa": "文脈の中で単語を理解する必要がある。" },
    { "en": "create", "pos": "動詞", "ja": "創造する、作る", "exEn": "Artists create works that inspire people.", "exJa": "芸術家は人々を鼓舞する作品を創造する。" },
    { "en": "data", "pos": "名詞", "ja": "データ、資料", "exEn": "The data supports our hypothesis.", "exJa": "そのデータは私たちの仮説を裏付けている。" },
    { "en": "define", "pos": "動詞", "ja": "定義する", "exEn": "How do you define success?", "exJa": "あなたは成功をどう定義しますか?" },
    { "en": "derive", "pos": "動詞", "ja": "引き出す、由来する", "exEn": "The word 'democracy' derives from Greek.", "exJa": "「democracy」という語はギリシャ語に由来する。" },
    { "en": "distribute", "pos": "動詞", "ja": "分配する、配布する", "exEn": "The teacher distributed the handouts to students.", "exJa": "教師は学生に資料を配布した。" },
    { "en": "economy", "pos": "名詞", "ja": "経済", "exEn": "The economy is showing signs of recovery.", "exJa": "経済は回復の兆しを見せている。" },
    { "en": "environment", "pos": "名詞", "ja": "環境", "exEn": "We must protect the environment for future generations.", "exJa": "将来の世代のために環境を守らなければならない。" },
    { "en": "establish", "pos": "動詞", "ja": "確立する、設立する", "exEn": "The university was established in 1850.", "exJa": "その大学は1850年に設立された。" },
    { "en": "estimate", "pos": "動詞・名詞", "ja": "見積もる、推定する", "exEn": "I estimate that it will take two hours.", "exJa": "それには2時間かかると見積もっている。" },
    { "en": "evident", "pos": "形容詞", "ja": "明白な", "exEn": "It is evident that she has been practicing.", "exJa": "彼女が練習してきたことは明白だ。" },
    { "en": "factor", "pos": "名詞", "ja": "要因", "exEn": "Many factors contributed to their success.", "exJa": "多くの要因が彼らの成功に寄与した。" },
    { "en": "function", "pos": "名詞・動詞", "ja": "機能、働く", "exEn": "The brain's function is very complex.", "exJa": "脳の機能は非常に複雑だ。" },
    { "en": "identify", "pos": "動詞", "ja": "特定する、確認する", "exEn": "Can you identify the problem?", "exJa": "問題を特定できますか?" },
    { "en": "illustrate", "pos": "動詞", "ja": "説明する、例証する", "exEn": "This example illustrates my point clearly.", "exJa": "この例は私の要点を明確に説明している。" },
    { "en": "impact", "pos": "名詞・動詞", "ja": "影響、衝撃", "exEn": "Technology has a huge impact on society.", "exJa": "技術は社会に大きな影響を与えている。" },
    { "en": "indicate", "pos": "動詞", "ja": "示す、表す", "exEn": "The survey indicates that people are satisfied.", "exJa": "調査は人々が満足していることを示している。" },
    { "en": "individual", "pos": "名詞・形容詞", "ja": "個人、個々の", "exEn": "Each individual has unique talents.", "exJa": "各個人にはユニークな才能がある。" },
    { "en": "interpret", "pos": "動詞", "ja": "解釈する", "exEn": "Different people interpret art differently.", "exJa": "人によって芸術の解釈は異なる。" },
    { "en": "involve", "pos": "動詞", "ja": "含む、関係する", "exEn": "The job involves a lot of traveling.", "exJa": "その仕事には多くの出張が含まれる。" },
    { "en": "issue", "pos": "名詞", "ja": "問題、課題", "exEn": "Climate change is a major issue today.", "exJa": "気候変動は今日の主要な問題だ。" },
    { "en": "method", "pos": "名詞", "ja": "方法", "exEn": "There are many methods to learn a language.", "exJa": "言語を学ぶ方法はたくさんある。" },
    { "en": "obtain", "pos": "動詞", "ja": "獲得する、得る", "exEn": "She obtained a scholarship to study abroad.", "exJa": "彼女は留学のための奨学金を獲得した。" },
    { "en": "occur", "pos": "動詞", "ja": "起こる、生じる", "exEn": "Accidents can occur when people are careless.", "exJa": "人々が不注意な時に事故が起こり得る。" },
    { "en": "perceive", "pos": "動詞", "ja": "知覚する、認識する", "exEn": "How we perceive reality differs from person to person.", "exJa": "現実をどう認識するかは人それぞれ異なる。" },
    { "en": "period", "pos": "名詞", "ja": "期間、時期", "exEn": "He lived in Japan for a period of three years.", "exJa": "彼は3年間の期間、日本に住んでいた。" },
    { "en": "policy", "pos": "名詞", "ja": "政策、方針", "exEn": "The government announced a new economic policy.", "exJa": "政府は新しい経済政策を発表した。" },
    { "en": "principle", "pos": "名詞", "ja": "原理、原則", "exEn": "He always acts according to his principles.", "exJa": "彼は常に自分の原則に従って行動する。" },
    { "en": "procedure", "pos": "名詞", "ja": "手順、手続き", "exEn": "Follow the safety procedure carefully.", "exJa": "安全手順を注意深く守りなさい。" },
    { "en": "process", "pos": "名詞・動詞", "ja": "過程、処理する", "exEn": "Learning is a gradual process.", "exJa": "学習は段階的な過程である。" },
    { "en": "require", "pos": "動詞", "ja": "必要とする", "exEn": "This task requires patience and skill.", "exJa": "この作業には忍耐と技術が必要だ。" },
    { "en": "research", "pos": "名詞・動詞", "ja": "研究、調査する", "exEn": "She is conducting research on climate change.", "exJa": "彼女は気候変動についての研究を行っている。" },
    { "en": "respond", "pos": "動詞", "ja": "応答する、反応する", "exEn": "He didn't respond to my email.", "exJa": "彼は私のメールに応答しなかった。" },
    { "en": "role", "pos": "名詞", "ja": "役割", "exEn": "Teachers play an important role in society.", "exJa": "教師は社会において重要な役割を果たす。" },
    { "en": "section", "pos": "名詞", "ja": "部分、セクション", "exEn": "Please read the first section of the chapter.", "exJa": "その章の最初の部分を読んでください。" },
    { "en": "significant", "pos": "形容詞", "ja": "重要な、意義のある", "exEn": "This is a significant achievement for the team.", "exJa": "これはチームにとって重要な成果だ。" },
    { "en": "similar", "pos": "形容詞", "ja": "似ている", "exEn": "Their opinions are very similar.", "exJa": "彼らの意見は非常に似ている。" },
    { "en": "source", "pos": "名詞", "ja": "源、情報源", "exEn": "What is the source of this information?", "exJa": "この情報の出典は何ですか?" },
    { "en": "specific", "pos": "形容詞", "ja": "特定の、具体的な", "exEn": "Can you give me a specific example?", "exJa": "具体的な例を挙げてもらえますか?" },
    { "en": "structure", "pos": "名詞", "ja": "構造", "exEn": "The structure of the essay is well-organized.", "exJa": "そのエッセイの構造はよく整理されている。" },
    { "en": "theory", "pos": "名詞", "ja": "理論", "exEn": "Einstein developed the theory of relativity.", "exJa": "アインシュタインは相対性理論を発展させた。" },
    { "en": "vary", "pos": "動詞", "ja": "変わる、異なる", "exEn": "Opinions vary from person to person.", "exJa": "意見は人によって異なる。" },
    { "en": "ensure", "pos": "動詞", "ja": "確実にする、保証する", "exEn": "Please ensure that all doors are locked.", "exJa": "すべてのドアに鍵がかかっていることを確認してください。" },
    { "en": "enhance", "pos": "動詞", "ja": "高める、向上させる", "exEn": "Reading can enhance your vocabulary.", "exJa": "読書は語彙力を高めることができる。" },
    { "en": "facilitate", "pos": "動詞", "ja": "促進する、容易にする", "exEn": "Technology facilitates communication across distances.", "exJa": "技術は遠距離でのコミュニケーションを容易にする。" },
    { "en": "demonstrate", "pos": "動詞", "ja": "実証する、示す", "exEn": "The experiment demonstrates the theory clearly.", "exJa": "その実験はその理論を明確に実証している。" },
    { "en": "sufficient", "pos": "形容詞", "ja": "十分な", "exEn": "Do we have sufficient time to complete the project?", "exJa": "プロジェクトを完成させるのに十分な時間がありますか?" },
    { "en": "preliminary", "pos": "形容詞", "ja": "予備的な", "exEn": "These are just preliminary results.", "exJa": "これらは単なる予備的な結果です。" },
    { "en": "comprehensive", "pos": "形容詞", "ja": "包括的な", "exEn": "She conducted a comprehensive study on the topic.", "exJa": "彼女はそのトピックについて包括的な研究を行った。" },
    { "en": "appropriate", "pos": "形容詞", "ja": "適切な", "exEn": "Please use appropriate language in class.", "exJa": "授業中は適切な言葉を使ってください。" },
    { "en": "subsequent", "pos": "形容詞", "ja": "その後の", "exEn": "Subsequent events proved him right.", "exJa": "その後の出来事が彼の正しさを証明した。" },
    { "en": "in terms of", "pos": "熟語", "ja": "〜の観点から", "exEn": "In terms of quality, this product is excellent.", "exJa": "品質の観点から、この製品は優れている。" },
    { "en": "on the other hand", "pos": "熟語", "ja": "一方で", "exEn": "The plan is risky. On the other hand, it could succeed.", "exJa": "その計画はリスクがある。一方で、成功する可能性もある。" },
    { "en": "in addition to", "pos": "熟語", "ja": "〜に加えて", "exEn": "In addition to English, she speaks French.", "exJa": "英語に加えて、彼女はフランス語を話す。" },
    { "en": "as a result", "pos": "熟語", "ja": "結果として", "exEn": "He studied hard. As a result, he passed the exam.", "exJa": "彼は一生懸命勉強した。結果として、試験に合格した。" },
    { "en": "take into account", "pos": "熟語", "ja": "考慮に入れる", "exEn": "We must take into account all possible outcomes.", "exJa": "すべての可能な結果を考慮に入れなければならない。" },
    { "en": "come up with", "pos": "熟語", "ja": "思いつく、考え出す", "exEn": "She came up with a brilliant idea.", "exJa": "彼女は素晴らしいアイデアを思いついた。" },
    { "en": "carry out", "pos": "熟語", "ja": "実行する", "exEn": "They will carry out the plan next month.", "exJa": "彼らは来月その計画を実行する。" },
    { "en": "point out", "pos": "熟語", "ja": "指摘する", "exEn": "The teacher pointed out my mistakes.", "exJa": "教師は私の間違いを指摘した。" },
    { "en": "bring about", "pos": "熟語", "ja": "もたらす、引き起こす", "exEn": "The new policy will bring about significant changes.", "exJa": "新しい政策は大きな変化をもたらすだろう。" },
    { "en": "account for", "pos": "熟語", "ja": "説明する、占める", "exEn": "Tourism accounts for 10% of the economy.", "exJa": "観光業は経済の10%を占めている。" },
    { "en": "deal with", "pos": "熟語", "ja": "対処する、扱う", "exEn": "She knows how to deal with difficult situations.", "exJa": "彼女は困難な状況への対処法を知っている。" },
    { "en": "rely on", "pos": "熟語", "ja": "頼る、依存する", "exEn": "You can rely on him to keep his promise.", "exJa": "彼が約束を守ることを頼りにできる。" },
    { "en": "contribute to", "pos": "熟語", "ja": "貢献する", "exEn": "Exercise contributes to good health.", "exJa": "運動は健康に貢献する。" },
    { "en": "refer to", "pos": "熟語", "ja": "言及する、参照する", "exEn": "She referred to several studies in her presentation.", "exJa": "彼女はプレゼンテーションでいくつかの研究に言及した。" },
    { "en": "concentrate on", "pos": "熟語", "ja": "集中する", "exEn": "Please concentrate on your work.", "exJa": "仕事に集中してください。" },
    { "en": "result in", "pos": "熟語", "ja": "結果として〜になる", "exEn": "Poor planning resulted in failure.", "exJa": "不十分な計画が失敗という結果になった。" },
    { "en": "consist of", "pos": "熟語", "ja": "〜で構成される", "exEn": "The team consists of five members.", "exJa": "チームは5人のメンバーで構成されている。" },
    { "en": "depend on", "pos": "熟語", "ja": "〜に依存する", "exEn": "Success depends on hard work.", "exJa": "成功は努力に依存する。" },
    { "en": "focus on", "pos": "熟語", "ja": "焦点を当てる", "exEn": "Let's focus on the main issue.", "exJa": "主要な問題に焦点を当てましょう。" },
    { "en": "advocate", "pos": "動詞・名詞", "ja": "主張する、提唱者", "exEn": "She advocates for environmental protection.", "exJa": "彼女は環境保護を主張している。" },
    { "en": "overcome", "pos": "動詞", "ja": "克服する", "exEn": "He overcame many obstacles to succeed.", "exJa": "彼は成功するために多くの障害を克服した。" },
    { "en": "maintain", "pos": "動詞", "ja": "維持する", "exEn": "It's important to maintain a healthy lifestyle.", "exJa": "健康的なライフスタイルを維持することが重要だ。" },
    { "en": "acquire", "pos": "動詞", "ja": "獲得する、習得する", "exEn": "Children acquire language naturally.", "exJa": "子供たちは自然に言語を習得する。" },
    { "en": "pursue", "pos": "動詞", "ja": "追求する", "exEn": "She decided to pursue a career in medicine.", "exJa": "彼女は医学の道を追求することに決めた。" },
    { "en": "implement", "pos": "動詞", "ja": "実施する、実行する", "exEn": "The company will implement new policies next year.", "exJa": "会社は来年新しい政策を実施する。" },
    { "en": "sustain", "pos": "動詞", "ja": "維持する、支える", "exEn": "We need to sustain economic growth.", "exJa": "経済成長を維持する必要がある。" },
    { "en": "assess", "pos": "動詞", "ja": "評価する、査定する", "exEn": "Teachers assess students' progress regularly.", "exJa": "教師は定期的に生徒の進歩を評価する。" },
    { "en": "anticipate", "pos": "動詞", "ja": "予期する、予測する", "exEn": "We anticipate strong demand for this product.", "exJa": "この製品への強い需要を予測している。" },
    { "en": "elaborate", "pos": "動詞・形容詞", "ja": "詳しく述べる、精巧な", "exEn": "Could you elaborate on your proposal?", "exJa": "あなたの提案について詳しく述べてもらえますか?" },
    { "en": "acknowledge", "pos": "動詞", "ja": "認める、承認する", "exEn": "He acknowledged his mistake.", "exJa": "彼は自分の間違いを認めた。" },
    { "en": "emphasize", "pos": "動詞", "ja": "強調する", "exEn": "The professor emphasized the importance of research.", "exJa": "教授は研究の重要性を強調した。" },
    { "en": "justify", "pos": "動詞", "ja": "正当化する", "exEn": "Can you justify your decision?", "exJa": "あなたの決定を正当化できますか?" },
    { "en": "undermine", "pos": "動詞", "ja": "弱める、損なう", "exEn": "Lack of sleep can undermine your health.", "exJa": "睡眠不足は健康を損なう可能性がある。" },
    { "en": "perspective", "pos": "名詞", "ja": "視点、見方", "exEn": "We need to look at this from a different perspective.", "exJa": "これを違う視点から見る必要がある。" },
    { "en": "criterion", "pos": "名詞", "ja": "基準", "exEn": "What is the criterion for selection?", "exJa": "選考の基準は何ですか?" },
    { "en": "phenomenon", "pos": "名詞", "ja": "現象", "exEn": "Global warming is a serious phenomenon.", "exJa": "地球温暖化は深刻な現象だ。" },
    { "en": "hypothesis", "pos": "名詞", "ja": "仮説", "exEn": "Scientists test their hypothesis through experiments.", "exJa": "科学者は実験を通じて仮説を検証する。" },
    { "en": "implication", "pos": "名詞", "ja": "含意、影響", "exEn": "What are the implications of this decision?", "exJa": "この決定の影響は何ですか?" },
    { "en": "constraint", "pos": "名詞", "ja": "制約", "exEn": "Budget constraints limit our options.", "exJa": "予算の制約が選択肢を制限している。" }
];

// IDとSourceIDを付与
const INITIAL_WORDS = RAW_WORD_LIST.map((word, index) => ({
  ...word,
  id: `builtin-v2-${index + 1}`,
  sourceId: INITIAL_SOURCE_ID
}));

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
    
    utterance.onend = () => resolve();
    utterance.onerror = (e) => resolve(); 

    window.speechSynthesis.speak(utterance);
  });
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

// --- 管理画面 (Playlists & Hidden) ---
const ManagementPanel = ({ isOpen, onClose, settings, playlists, onRenamePlaylist, onDeletePlaylist, hiddenWords, onUnhideWord }) => {
  const [activeTab, setActiveTab] = useState('playlists');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  
  const t = THEMES[settings.theme] || THEMES.stylish;
  const startEditing = (item) => { setEditingId(item.id); setEditName(item.name); };
  const saveEditing = () => { if (editName.trim()) onRenamePlaylist(editingId, editName); setEditingId(null); };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
           <motion.div 
             key="overlay"
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }} 
             transition={{ duration: 0.3 }}
             className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm" 
             onClick={onClose}
           />
           <motion.div 
             key="panel"
             initial={{ x: '100%' }} 
             animate={{ x: 0 }} 
             exit={{ x: '100%' }} 
             transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.8 }}
             className={`fixed inset-y-0 right-0 z-[130] w-full max-w-md shadow-2xl flex flex-col ${t.bgClass} ${t.textMain}`}
             onClick={e => e.stopPropagation()}
           >
             <div className={`p-4 pt-12 flex justify-between items-center border-b ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className="text-xl font-bold flex items-center gap-2"><FolderCog size={24} /> Manage</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-500/10 transition-colors"><X size={24} /></button>
             </div>
             
             <div className={`flex p-2 gap-2 border-b ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
               <button onClick={() => setActiveTab('playlists')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'playlists' ? 'bg-indigo-500 text-white' : 'opacity-50 hover:bg-gray-500/10'}`}>Playlists</button>
               <button onClick={() => setActiveTab('hidden')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'hidden' ? 'bg-indigo-500 text-white' : 'opacity-50 hover:bg-gray-500/10'}`}>Hidden Words</button>
             </div>

             <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'playlists' && (
                  <div className="space-y-4">
                    {playlists.length === 0 && <div className="text-center py-10 opacity-50">No playlists created yet.</div>}
                    {playlists.map(playlist => (
                      <div key={playlist.id} className={`flex items-center justify-between p-4 rounded-xl border ${t.isDark ? 'border-gray-700 bg-white/5' : 'border-gray-200 bg-slate-50'}`}>
                        <div className="flex items-center gap-4 flex-1 overflow-hidden">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500"><ListMusic size={20} /></div>
                          {editingId === playlist.id ? <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-transparent border-b border-indigo-500 text-lg font-bold w-full focus:outline-none" autoFocus /> : <span className="font-bold text-lg truncate">{playlist.name}</span>}
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {editingId === playlist.id ? <button onClick={saveEditing} className="p-2 hover:bg-indigo-500/20 rounded-lg text-indigo-500"><Save size={18} /></button> : <button onClick={() => startEditing(playlist)} className="p-2 hover:bg-gray-500/10 rounded-lg opacity-50 hover:opacity-100"><Edit2 size={18} /></button>}
                          <button onClick={() => { if(window.confirm('Delete playlist?')) onDeletePlaylist(playlist.id); }} className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-500 opacity-50 hover:opacity-100"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'hidden' && (
                  <div className="space-y-4">
                    {hiddenWords.length === 0 && <div className="text-center py-10 opacity-50">No hidden words.</div>}
                    {hiddenWords.map(word => (
                      <div key={word.id} className={`flex items-center justify-between p-4 rounded-xl border ${t.isDark ? 'border-gray-700 bg-white/5' : 'border-gray-200 bg-slate-50'}`}>
                        <div className="flex-1 overflow-hidden">
                          <p className="font-bold text-lg">{word.en}</p>
                          <p className="text-sm opacity-60 truncate">{word.ja}</p>
                        </div>
                        <button onClick={() => onUnhideWord(word.id)} className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl text-xs font-bold hover:bg-indigo-500/20 flex items-center gap-2"><RefreshCcw size={16} /> Unhide</button>
                      </div>
                    ))}
                  </div>
                )}
             </div>
           </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


// --- 設定モーダル ---
const SettingsModal = ({ isOpen, onClose, settings, updateSettings, sources, toggleSourceActive, onImportData, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'settings');
  const [importStatus, setImportStatus] = useState('');
  const [newSourceName, setNewSourceName] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => { if (isOpen && initialTab) setActiveTab(initialTab); }, [isOpen, initialTab]);
  if (!isOpen) return null;
  const t = THEMES[settings.theme] || THEMES.stylish;

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
  const clearData = () => {
    if(window.confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
      localStorage.removeItem('myVocabularyData');
      localStorage.removeItem('vocabSources');
      window.location.reload();
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`w-full max-w-sm max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${t.bgClass} ${t.textMain} ${t.isDark ? 'border-slate-800' : 'border-slate-200'}`} onClick={e => e.stopPropagation()}>
        <div className={`p-4 border-b flex justify-between items-center ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="font-bold flex items-center gap-2"><Settings size={18} /> Preferences</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 transition-colors"><X size={18} /></button>
        </div>
        <div className={`flex border-b overflow-x-auto ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {['settings', 'speed', 'data'].map(tab => (
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

              {/* Sync Toggle */}
              <div className={`flex items-center justify-between p-3 rounded-xl border ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    {settings.syncSpeech ? <Link2 size={18} className="opacity-70" /> : <Link2Off size={18} className="opacity-70" />}
                    <span className="text-sm font-bold">Sync Speech & Reveal</span>
                  </div>
                  <button onClick={() => updateSettings({ syncSpeech: !settings.syncSpeech })} className={`w-12 h-6 rounded-full p-1 transition-colors relative ${settings.syncSpeech ? 'bg-indigo-500' : 'bg-gray-500/30'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.syncSpeech ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
              </div>
              <p className="text-[10px] opacity-50 -mt-6">If ON, waits for speech to finish before showing next text.</p>

              {/* Animation Toggle */}
              <div className={`flex items-center justify-between p-3 rounded-xl border ${t.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <Zap size={18} className="opacity-70" />
                    <span className="text-sm font-bold">Text Animation</span>
                  </div>
                  <button onClick={() => updateSettings({ textAnimation: !settings.textAnimation })} className={`w-12 h-6 rounded-full p-1 transition-colors relative ${settings.textAnimation ? 'bg-indigo-500' : 'bg-gray-500/30'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.textAnimation ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
              </div>
              <p className="text-[10px] opacity-50 -mt-6">If OFF, text appears instantly (but still follows Reveal Speed delay).</p>

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
                    <div className={`p-3 rounded-lg text-[10px] font-mono leading-relaxed opacity-70 overflow-x-auto whitespace-pre ${t.isDark ? 'bg-black/30' : 'bg-slate-100'}`}>
                      {SAMPLE_JSON_FORMAT}
                    </div>
                </div>
                
                <div className="pt-4 border-t border-gray-500/20">
                   <button onClick={clearData} className="w-full py-3 rounded-xl border border-rose-500/30 text-rose-500 text-xs font-bold hover:bg-rose-500/10 transition-colors">Reset / Clear All Data</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- 単語カード (自動読み上げ・表示同期対応) ---
const WordCard = ({ word, isSaved, onToggleSave, onOpenAddToPlaylist, onHideWord, settings, isActive, onPlaybackEnd }) => {
  const { revealSpeed, theme, autoSpeak, speechRate, autoScroll, textAnimation, syncSpeech } = settings;
  const t = THEMES[theme] || THEMES.stylish;
  const [isHiding, setIsHiding] = useState(false);
  
  // 0: Initial (EN Only), 1: Show JA & Ex (Merged)
  const [revealStage, setRevealStage] = useState(0);
  
  const isSpeakingRef = useRef(false);

  // 画面から消えたらリセット
  useEffect(() => {
    if (!isActive) {
      setRevealStage(0);
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    }
  }, [isActive]);

  // 連続再生実行関数 (同期型: 最低待機時間保証)
  const playSequence = async () => {
    if (!window.speechSynthesis) return;
    if (isSpeakingRef.current) return; 
    
    isSpeakingRef.current = true;
    window.speechSynthesis.cancel(); 

    try {
      // 1. 英単語 & 待機
      if (syncSpeech) {
        // --- 同期モード: 両方完了するまで待つ ---
        if (autoSpeak) {
          await Promise.all([
            speakUtterance(word.en, 'en-US', speechRate),
            wait(revealSpeed * 1000)
          ]);
        } else {
          await wait(revealSpeed * 1000);
        }
      } else {
        // --- 非同期モード: 読み上げは投げっぱなし、待機のみawait ---
        if (autoSpeak) speakUtterance(word.en, 'en-US', speechRate); 
        await wait(revealSpeed * 1000);
      }
      
      if (!isSpeakingRef.current) return;

      // 2. 日本語 & 例文 表示 (同時)
      setRevealStage(1);

      // 3. 残りの読み上げ (JA -> ExEn -> ExJa)
      if (autoSpeak) {
        // ここからは一気に読み上げる
        await speakUtterance(word.ja, 'ja-JP', speechRate);
        if (!isSpeakingRef.current) return;

        await speakUtterance(word.exEn, 'en-US', speechRate);
        if (!isSpeakingRef.current) return;

        await speakUtterance(word.exJa, 'ja-JP', speechRate);
      }
      
    } catch (e) {
      console.error(e);
    } finally {
      if(isSpeakingRef.current) {
        if(autoScroll && autoSpeak) onPlaybackEnd();
        isSpeakingRef.current = false;
      }
    }
  };

  useEffect(() => {
    if (isActive) {
      // isActiveになったら即座にシーケンス開始（最初のDelayはplaySequence内で制御）
      const timer = setTimeout(() => {
        playSequence();
      }, 300); // カードスナップの安定待ち
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isActive, word.id, autoSpeak, syncSpeech]); 

  const handleHideClick = () => {
    setIsHiding(true);
    setTimeout(() => { onHideWord(word.id); }, 400);
  };

  const handleManualSpeak = () => {
    setRevealStage(0);
    isSpeakingRef.current = false; 
    setTimeout(() => playSequence(), 100);
  };

  // 修正: 日本語訳と例文は同時に出る (Stage 1以上なら両方出る)
  const showContent = revealStage >= 1;

  // Text Animation OFFなら duration: 0
  const actualAnim = {
    hidden: { opacity: 0, y: textAnimation ? 10 : 0 },
    visible: { opacity: 1, y: 0, transition: { duration: textAnimation ? 0.4 : 0 } }
  };

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
        
        {/* Japanese Translation Area */}
        <div className="h-16 flex items-center justify-center">
          <motion.div 
            initial="hidden" 
            animate={showContent ? "visible" : "hidden"} 
            variants={actualAnim}
          >
            <p className={`text-2xl font-bold ${t.textMain} drop-shadow-md`}>{word.ja}</p>
          </motion.div>
        </div>

        {/* Examples Area */}
        <div className="absolute bottom-24 w-full px-6 max-w-md">
           <motion.div 
             initial="hidden" 
             animate={showContent ? "visible" : "hidden"} 
             variants={actualAnim} 
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
const Header = ({ activeTab, onTabChange, savedCount, openSettings, openManagement, themeKey, playlists }) => {
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
      <button onClick={openManagement} className={`pointer-events-auto p-3 rounded-full backdrop-blur-md border shadow-lg transition-all ${t.buttonBg} ${t.isDark ? 'text-white border-white/10' : 'text-slate-800 border-black/5'}`}><FolderCog size={20} /></button>
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
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('settings');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [currentAddWordId, setCurrentAddWordId] = useState(null);
  
  const [activeWordId, setActiveWordId] = useState(null);
  const containerRef = useRef(null);
  
  const [settings, setSettings] = useState(() => { 
    const saved = localStorage.getItem('appSettings'); 
    return saved ? JSON.parse(saved) : { revealSpeed: 0.5, theme: 'stylish', isShuffle: true, autoSpeak: false, speechRate: 1.0, autoScroll: false, textAnimation: true, syncSpeech: true }; 
  });

  const openSettings = (tab = 'settings') => { setSettingsTab(tab); setIsSettingsOpen(true); };
  const openManagement = () => setIsManagementOpen(true);
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
    // 強制アップデートロジック: 
    // 保存されたソースに今回の新しいIDが含まれていない場合、強制的にデフォルトに戻す
    if (savedSources) {
       const parsed = JSON.parse(savedSources);
       const hasNewDefault = parsed.some(s => s.id === INITIAL_SOURCE_ID);
       
       if (!hasNewDefault) {
          // 新しいソースがない＝古いデータと判断して全リセット
          setSources(INITIAL_SOURCES);
          localStorage.setItem('vocabSources', JSON.stringify(INITIAL_SOURCES));
          
          const initial = shuffleArray(INITIAL_WORDS);
          setAllWords(initial);
          localStorage.setItem('myVocabularyData', JSON.stringify(initial));
          
          // ここでreturnして、下のsavedWordsの読み込みをスキップする（二重セット防止）
          // ただし、Playlistsなどは維持したいので下へ続く
       } else {
          setSources(parsed);
          
          // ソースが最新なら単語データもロード
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
       }
    } else { 
      // 初回起動
      setSources(INITIAL_SOURCES); 
      localStorage.setItem('vocabSources', JSON.stringify(INITIAL_SOURCES)); 
      
      const initial = shuffleArray(INITIAL_WORDS); 
      setAllWords(initial); 
      localStorage.setItem('myVocabularyData', JSON.stringify(initial)); 
    }
    
    const savedPlaylists = localStorage.getItem('vocabPlaylists');
    if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
    else setPlaylists([]);

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
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        savedCount={savedIds.length} 
        openSettings={openSettings} 
        openManagement={openManagement}
        themeKey={settings.theme} 
        playlists={playlists} 
      />
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
      
      {/* 修正ポイント: ManagementPanelは常にレンダリングし、内部でAnimatePresenceを使う */}
      <ManagementPanel 
        isOpen={isManagementOpen} 
        onClose={() => setIsManagementOpen(false)} 
        settings={settings} 
        playlists={playlists} 
        onRenamePlaylist={handleRenamePlaylist} 
        onDeletePlaylist={handleDeletePlaylist} 
        hiddenWords={hiddenWordObjects} 
        onUnhideWord={handleUnhideWord} 
      />

      <AnimatePresence>
        {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} initialTab={settingsTab} settings={settings} updateSettings={updateSettings} sources={sources} toggleSourceActive={toggleSourceActive} onImportData={handleImportData} />}
        {isAddSheetOpen && <AddToPlaylistSheet isOpen={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)} playlists={playlists} currentWordId={currentAddWordId} playlistAssignments={playlistAssignments} onToggleAssignment={handleToggleAssignment} onCreatePlaylist={handleCreatePlaylist} themeKey={settings.theme} />}
      </AnimatePresence>
      <style jsx global>{` .hide-scrollbar::-webkit-scrollbar { display: none; } `}</style>
    </div>
  );
};

export default App;
