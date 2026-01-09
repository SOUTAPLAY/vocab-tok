import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Settings, X, Clock, Sparkles, FolderOpen, Layers, Palette, Check, Upload, Copy, AlertCircle, Plus, ListPlus, Database, ListMusic, Trash2, Edit2, Save, Square, CheckSquare, Shuffle, EyeOff, RefreshCcw, Volume2, Mic, FastForward, Zap, FolderCog, Link2, Link2Off } from 'lucide-react';

// --- 初期データ定義 ---
const INITIAL_SOURCE_ID = 'built-in-academic';
const INITIAL_SOURCES = [
  { id: INITIAL_SOURCE_ID, name: 'Essential Academic Words', active: true }
];

// ユーザー提供の生データ
const RAW_WORD_LIST = [
  { "en": "abandon", "pos": "動詞", "ja": "（計画などを）断念する、捨てる", "exEn": "They had to abandon the plan due to lack of funds.", "exJa": "資金不足のため、彼らはその計画を断念しなければならなかった。" },
  { "en": "abstract", "pos": "形容詞", "ja": "抽象的な", "exEn": "Happiness is an abstract concept.", "exJa": "幸福は抽象的な概念だ。" },
  { "en": "academic", "pos": "形容詞", "ja": "学術的な、大学の", "exEn": "She has a strong academic background.", "exJa": "彼女にはしっかりとした学術的背景がある。" },
  { "en": "access", "pos": "名詞", "ja": "接近、利用する権利", "exEn": "Students have free access to the library.", "exJa": "学生は図書館を自由に利用できる。" },
  { "en": "accommodate", "pos": "動詞", "ja": "収容する、適応させる", "exEn": "The hotel can accommodate up to 500 guests.", "exJa": "そのホテルは最大500人の客を収容できる。" },
  { "en": "accompany", "pos": "動詞", "ja": "同行する、伴う", "exEn": "Thunder often accompanies lightning.", "exJa": "雷にはしばしば雷鳴が伴う。" },
  { "en": "accumulate", "pos": "動詞", "ja": "蓄積する", "exEn": "Dust tends to accumulate under the bed.", "exJa": "ベッドの下にはほこりがたまりやすい。" },
  { "en": "accurate", "pos": "形容詞", "ja": "正確な", "exEn": "We need accurate data to make a decision.", "exJa": "決断を下すには正確なデータが必要だ。" },
  { "en": "achieve", "pos": "動詞", "ja": "達成する", "exEn": "She worked hard to achieve her goals.", "exJa": "彼女は目標を達成するために懸命に働いた。" },
  { "en": "acquire", "pos": "動詞", "ja": "習得する、獲得する", "exEn": "He acquired a good knowledge of English.", "exJa": "彼は英語の十分な知識を習得した。" },
  { "en": "adapt", "pos": "動詞", "ja": "適応する、順応させる", "exEn": "It is important to adapt to new environments.", "exJa": "新しい環境に適応することは重要だ。" },
  { "en": "adequate", "pos": "形容詞", "ja": "十分な、適切な", "exEn": "The room provides adequate space for three people.", "exJa": "その部屋は3人にとって十分なスペースがある。" },
  { "en": "adjust", "pos": "動詞", "ja": "調整する、慣れる", "exEn": "You can adjust the height of the chair.", "exJa": "椅子の高さを調整できます。" },
  { "en": "administration", "pos": "名詞", "ja": "管理、行政、政権", "exEn": "She works in the administration department.", "exJa": "彼女は管理部門で働いている。" },
  { "en": "advocate", "pos": "動詞", "ja": "提唱する、主張する", "exEn": "The group advocates for human rights.", "exJa": "その団体は人権を主張している。" },
  { "en": "affect", "pos": "動詞", "ja": "影響を及ぼす", "exEn": "The weather can affect your mood.", "exJa": "天気は気分に影響を及ぼすことがある。" },
  { "en": "aggregate", "pos": "形容詞", "ja": "総計の、集まった", "exEn": "The aggregate demand for the product is high.", "exJa": "その製品への総需要は高い。" },
  { "en": "allocate", "pos": "動詞", "ja": "割り当てる、配分する", "exEn": "The government allocated funds for education.", "exJa": "政府は教育に資金を割り当てた。" },
  { "en": "alter", "pos": "動詞", "ja": "変える、変わる", "exEn": "We had to alter our travel plans.", "exJa": "私たちは旅行計画を変更しなければならなかった。" },
  { "en": "alternative", "pos": "名詞", "ja": "代わりとなるもの、選択肢", "exEn": "We have no alternative but to leave.", "exJa": "私たちは立ち去る以外に選択肢がない。" },
  { "en": "ambiguous", "pos": "形容詞", "ja": "あいまいな", "exEn": "His answer was ambiguous.", "exJa": "彼の答えはあいまいであった。" },
  { "en": "analyze", "pos": "動詞", "ja": "分析する", "exEn": "Scientists analyzed the water samples.", "exJa": "科学者たちは水質サンプルを分析した。" },
  { "en": "annual", "pos": "形容詞", "ja": "年1回の、毎年の", "exEn": "The company published its annual report.", "exJa": "その会社は年次報告書を発表した。" },
  { "en": "anticipate", "pos": "動詞", "ja": "予期する、楽しみに待つ", "exEn": "We anticipate a large crowd at the event.", "exJa": "私たちはイベントに大勢の人が来ると予想している。" },
  { "en": "apparent", "pos": "形容詞", "ja": "明らかな、外見上の", "exEn": "It became apparent that she was right.", "exJa": "彼女が正しいことが明らかになった。" },
  { "en": "approach", "pos": "名詞", "ja": "取り組み方、接近", "exEn": "We need a new approach to solve this problem.", "exJa": "この問題を解決するには新しい取り組み方が必要だ。" },
  { "en": "appropriate", "pos": "形容詞", "ja": "適切な", "exEn": "Please wear clothes appropriate for the occasion.", "exJa": "その場にふさわしい服を着てください。" },
  { "en": "approximate", "pos": "形容詞", "ja": "およその", "exEn": "The approximate cost will be $100.", "exJa": "およその費用は100ドルになるだろう。" },
  { "en": "arbitrary", "pos": "形容詞", "ja": "恣意的な、勝手な", "exEn": "The decision seemed arbitrary.",
    "exJa": "その決定は恣意的に思えた。"
  },
  { "en": "aspect", "pos": "名詞", "ja": "側面、局面", "exEn": "We must consider every aspect of the situation.", "exJa": "我々は状況のあらゆる側面を考慮しなければならない。" },
  { "en": "assemble", "pos": "動詞", "ja": "集める、組み立てる", "exEn": "All students were asked to assemble in the hall.", "exJa": "全生徒がホールに集まるよう求められた。" },
  { "en": "assess", "pos": "動詞", "ja": "評価する、査定する", "exEn": "Tests are used to assess students' progress.", "exJa": "テストは生徒の進歩を評価するために使われる。" },
  { "en": "assign", "pos": "動詞", "ja": "割り当てる、任命する", "exEn": "The teacher assigned homework to the class.", "exJa": "先生はクラスに宿題を割り当てた。" },
  { "en": "assist", "pos": "動詞", "ja": "支援する、手伝う", "exEn": "This device assists people with hearing loss.", "exJa": "この装置は難聴の人々を支援する。" },
  { "en": "assume", "pos": "動詞", "ja": "（証拠はないが）〜だと思う、仮定する", "exEn": "I assume that you are busy.", "exJa": "あなたは忙しいのだと思います。" },
  { "en": "assure", "pos": "動詞", "ja": "保証する、安心させる", "exEn": "I assure you that everything will be fine.", "exJa": "すべてうまくいくと保証します。" },
  { "en": "attach", "pos": "動詞", "ja": "取り付ける、添付する", "exEn": "Please attach a photo to your application.", "exJa": "申込書に写真を添付してください。" },
  { "en": "attain", "pos": "動詞", "ja": "達成する、到達する", "exEn": "He attained the highest rank in the organization.", "exJa": "彼は組織で最高位に到達した。" },
  { "en": "attitude", "pos": "名詞", "ja": "態度、考え方", "exEn": "She has a positive attitude towards life.", "exJa": "彼女は人生に対して前向きな態度を持っている。" },
  { "en": "attribute", "pos": "動詞", "ja": "（結果などを）〜のせいにする、〜のおかげと考える", "exEn": "He attributes his success to hard work.", "exJa": "彼は成功を勤勉のおかげだと考えている。" },
  { "en": "authority", "pos": "名詞", "ja": "権威、当局", "exEn": "She is an authority on modern art.", "exJa": "彼女は現代美術の権威だ。" },
  { "en": "available", "pos": "形容詞", "ja": "利用できる、入手可能な", "exEn": "Tickets are still available online.", "exJa": "チケットはまだオンラインで入手可能だ。" },
  { "en": "aware", "pos": "形容詞", "ja": "気づいている、知っている", "exEn": "I was not aware of the problem.", "exJa": "私はその問題に気づいていなかった。" },
  { "en": "benefit", "pos": "名詞", "ja": "利益、恩恵", "exEn": "The new policy will bring many benefits.", "exJa": "新しい政策は多くの利益をもたらすだろう。" },
  { "en": "bias", "pos": "名詞", "ja": "偏見、先入観", "exEn": "We must avoid bias in our research.", "exJa": "私たちは研究において偏見を避けなければならない。" },
  { "en": "capable", "pos": "形容詞", "ja": "能力がある", "exEn": "She is capable of handling the situation.", "exJa": "彼女はその状況に対処する能力がある。" },
  { "en": "capacity", "pos": "名詞", "ja": "収容能力、能力", "exEn": "The stadium has a capacity of 50,000.", "exJa": "そのスタジアムは5万人収容できる。" },
  { "en": "category", "pos": "名詞", "ja": "範疇、カテゴリー", "exEn": "The books are sorted by category.", "exJa": "本はカテゴリー別に分類されている。" },
  { "en": "cease", "pos": "動詞", "ja": "やめる、終わる", "exEn": "The factory ceased operations last year.", "exJa": "その工場は昨年操業を停止した。" },
  { "en": "challenge", "pos": "名詞", "ja": "課題、挑戦", "exEn": "Climate change is a global challenge.", "exJa": "気候変動は地球規模の課題だ。" },
  { "en": "circumstance", "pos": "名詞", "ja": "状況、事情", "exEn": "Under normal circumstances, I would agree.", "exJa": "普通の状況なら、私は同意するだろう。" },
  { "en": "clarify", "pos": "動詞", "ja": "明確にする", "exEn": "Could you clarify your last point?", "exJa": "最後の点を明確にしていただけますか？" },
  { "en": "coherence", "pos": "名詞", "ja": "一貫性", "exEn": "The essay lacks coherence.", "exJa": "その小論文は一貫性に欠ける。" },
  { "en": "coincide", "pos": "動詞", "ja": "同時に起こる、一致する", "exEn": "My vacation coincides with yours.", "exJa": "私の休暇はあなたのと重なっている。" },
  { "en": "collapse", "pos": "動詞", "ja": "崩壊する、倒れる", "exEn": "The roof collapsed under the weight of the snow.", "exJa": "雪の重みで屋根が崩壊した。" },
  { "en": "colleague", "pos": "名詞", "ja": "同僚", "exEn": "I had lunch with a colleague.", "exJa": "私は同僚と昼食をとった。" },
  { "en": "commence", "pos": "動詞", "ja": "開始する", "exEn": "The ceremony will commence at noon.", "exJa": "式典は正午に開始される。" },
  { "en": "commission", "pos": "名詞", "ja": "委員会、委任", "exEn": "A commission was set up to investigate the incident.", "exJa": "その事件を調査するために委員会が設置された。" },
  { "en": "commit", "pos": "動詞", "ja": "（罪などを）犯す、委ねる、約束する", "exEn": "He committed a serious error.", "exJa": "彼は重大な過ちを犯した。" },
  { "en": "commodity", "pos": "名詞", "ja": "商品、産物", "exEn": "Coffee is a valuable commodity.", "exJa": "コーヒーは価値のある商品だ。" },
  { "en": "communicate", "pos": "動詞", "ja": "伝達する、意思疎通する", "exEn": "We use email to communicate.", "exJa": "私たちは意思疎通にメールを使う。" },
  { "en": "community", "pos": "名詞", "ja": "地域社会、共同体", "exEn": "He is a respected member of the community.", "exJa": "彼は地域社会の尊敬される一員だ。" },
  { "en": "compatible", "pos": "形容詞", "ja": "互換性のある、相性が良い", "exEn": "This software is compatible with Mac.", "exJa": "このソフトはMacと互換性がある。" },
  { "en": "compensate", "pos": "動詞",
    "ja": "補償する、埋め合わせる", "exEn": "Nothing can compensate for the loss of a loved one.", "exJa": "愛する人を失ったことは何によっても埋め合わせられない。"
  },
  { "en": "compile", "pos": "動詞", "ja": "編集する、まとめる", "exEn": "They compiled a list of potential customers.", "exJa": "彼らは見込み客のリストをまとめた。" },
  { "en": "complement", "pos": "動詞", "ja": "補完する、引き立てる", "exEn": "The wine complements the meal perfectly.", "exJa": "そのワインは食事を完璧に引き立てている。" },
  { "en": "complex", "pos": "形容詞", "ja": "複雑な", "exEn": "The human brain is extremely complex.", "exJa": "人間の脳は極めて複雑だ。" },
  { "en": "component", "pos": "名詞", "ja": "構成要素、部品", "exEn": "Trust is a key component of any relationship.", "exJa": "信頼はあらゆる人間関係の重要な構成要素だ。" },
  { "en": "comprehensive", "pos": "形容詞", "ja": "包括的な、総合的な", "exEn": "We need a comprehensive guide to the city.", "exJa": "私たちはその都市の包括的なガイドが必要だ。" },
  { "en": "comprise", "pos": "動詞", "ja": "構成する、〜から成る", "exEn": "The team comprises five members.", "exJa": "そのチームは5人のメンバーで構成されている。" },
  { "en": "concentrate", "pos": "動詞", "ja": "集中する", "exEn": "I can't concentrate with that noise.", "exJa": "その騒音のせいで集中できない。" },
  { "en": "concept", "pos": "名詞", "ja": "概念、考え", "exEn": "The concept of zero was revolutionary.", "exJa": "ゼロという概念は革命的だった。" },
  { "en": "conclude", "pos": "動詞", "ja": "結論づける、終える", "exEn": "The report concludes that the economy is improving.", "exJa": "報告書は経済が改善していると結論づけている。" },
  { "en": "conduct", "pos": "動詞", "ja": "実施する、指揮する", "exEn": "They conducted a survey on sleep habits.", "exJa": "彼らは睡眠習慣に関する調査を実施した。" },
  { "en": "confirm", "pos": "動詞", "ja": "確認する、裏付ける", "exEn": "Please confirm your reservation by email.", "exJa": "メールで予約を確認してください。" },
  { "en": "conflict", "pos": "名詞", "ja": "対立、紛争", "exEn": "There is a conflict between the two parties.", "exJa": "二つの党の間には対立がある。" },
  { "en": "conform", "pos": "動詞", "ja": "従う、順応する", "exEn": "Employees must conform to the safety rules.", "exJa": "従業員は安全規則に従わなければならない。" },
  { "en": "consent", "pos": "名詞", "ja": "同意、承諾", "exEn": "He gave his consent to the proposal.", "exJa": "彼はその提案に同意を与えた。" },
  { "en": "consequent", "pos": "形容詞", "ja": "結果として生じる", "exEn": "The heavy rain and consequent flooding caused damage.", "exJa": "大雨とその結果生じた洪水が被害をもたらした。" },
  { "en": "considerable", "pos": "形容詞", "ja": "かなりの、相当な", "exEn": "She has a considerable amount of money.", "exJa": "彼女はかなりの金額を持っている。" },
  { "en": "consist", "pos": "動詞", "ja": "〜から成る（of）", "exEn": "The committee consists of ten members.", "exJa": "委員会は10人のメンバーから成る。" },
  { "en": "constant", "pos": "形容詞", "ja": "絶え間ない、一定の", "exEn": "The machine requires constant maintenance.", "exJa": "その機械は絶え間ないメンテナンスを必要とする。" },
  { "en": "constitute", "pos": "動詞", "ja": "構成する、〜と見なされる", "exEn": "Twelve months constitute a year.", "exJa": "12ヶ月で1年を構成する。" },
  { "en": "construct", "pos": "動詞", "ja": "建設する、組み立てる", "exEn": "They plan to construct a new bridge.", "exJa": "彼らは新しい橋を建設する計画だ。" },
  { "en": "consult", "pos": "動詞", "ja": "相談する、調べる", "exEn": "You should consult a doctor.", "exJa": "医者に相談すべきだ。" },
  { "en": "consume", "pos": "動詞", "ja": "消費する", "exEn": "This car consumes a lot of fuel.", "exJa": "この車は多くの燃料を消費する。" },
  { "en": "contemporary", "pos": "形容詞", "ja": "現代の、同時代の", "exEn": "He studies contemporary art.", "exJa": "彼は現代美術を研究している。" },
  { "en": "context", "pos": "名詞", "ja": "文脈、背景", "exEn": "You need to understand the historical context.", "exJa": "歴史的背景を理解する必要がある。" },
  { "en": "contract", "pos": "名詞", "ja": "契約", "exEn": "They signed a three-year contract.", "exJa": "彼らは3年契約を結んだ。" },
  { "en": "contradict", "pos": "動詞", "ja": "矛盾する、否定する", "exEn": "The evidence contradicts his statement.", "exJa": "証拠は彼の供述と矛盾している。" },
  { "en": "contrary", "pos": "形容詞", "ja": "反対の", "exEn": "Contrary to popular belief, he is shy.", "exJa": "一般に信じられていることとは反対に、彼は内気だ。" },
  { "en": "contrast", "pos": "名詞", "ja": "対照、相違", "exEn": "There is a sharp contrast between the two colors.", "exJa": "その2色の間には鋭い対照がある。" },
  { "en": "contribute", "pos": "動詞", "ja": "貢献する、寄付する", "exEn": "She contributed significantly to the project.", "exJa": "彼女はプロジェクトに大いに貢献した。" },
  { "en": "controversy", "pos": "名詞", "ja": "論争", "exEn": "The new law caused a lot of controversy.", "exJa": "新法は多くの論争を引き起こした。"
  },
  { "en": "convene", "pos": "動詞", "ja": "招集する、開催される", "exEn": "The committee will convene next week.", "exJa": "委員会は来週開催される。" },
  { "en": "convert", "pos": "動詞", "ja": "転換する、変える", "exEn": "The sofa converts into a bed.", "exJa": "そのソファはベッドに変わる。" },
  { "en": "convince", "pos": "動詞", "ja": "納得させる、確信させる", "exEn": "I tried to convince him to stay.", "exJa": "私は彼にとどまるよう説得しようとした。" },
  { "en": "cooperate", "pos": "動詞", "ja": "協力する", "exEn": "We need to cooperate with each other.", "exJa": "私たちはお互いに協力する必要がある。" },
  { "en": "coordinate", "pos": "動詞", "ja": "調整する", "exEn": "She coordinates the events for the company.", "exJa": "彼女は会社のイベントを調整している。" },
  { "en": "core", "pos": "名詞", "ja": "核心、中心", "exEn": "The core of the problem lies elsewhere.", "exJa": "問題の核心は別のところにある。" },
  { "en": "corporate", "pos": "形容詞", "ja": "企業の、法人の", "exEn": "He works in corporate finance.", "exJa": "彼は企業財務の仕事をしている。" },
  { "en": "correspond", "pos": "動詞", "ja": "一致する、文通する", "exEn": "His account corresponds with the police report.", "exJa": "彼の説明は警察の報告書と一致している。" },
  { "en": "create", "pos": "動詞", "ja": "創造する、引き起こす", "exEn": "The internet created new opportunities.", "exJa": "インターネットは新たな機会を創出した。" },
  { "en": "criteria", "pos": "名詞", "ja": "基準（criterionの複数形）", "exEn": "What are the criteria for selection?", "exJa": "選考の基準は何ですか？" },
  { "en": "crucial", "pos": "形容詞", "ja": "決定的な、極めて重要な", "exEn": "Water is crucial for survival.", "exJa": "水は生存にとって極めて重要だ。" },
  { "en": "culture", "pos": "名詞", "ja": "文化", "exEn": "I am interested in Japanese culture.", "exJa": "私は日本文化に興味がある。" },
  { "en": "currency", "pos": "名詞", "ja": "通貨", "exEn": "The euro is the currency used in France.", "exJa": "ユーロはフランスで使われている通貨だ。" },
  { "en": "cycle", "pos": "名詞", "ja": "循環、周期", "exEn": "The life cycle of a butterfly is fascinating.", "exJa": "蝶のライフサイクルは興味深い。" },
  { "en": "data", "pos": "名詞", "ja": "データ、資料", "exEn": "The data shows a clear trend.", "exJa": "データは明確な傾向を示している。" },
  { "en": "debate", "pos": "名詞", "ja": "討論、論争", "exEn": "There was a heated debate about tax reform.", "exJa": "税制改革について激しい討論があった。" },
  { "en": "decade", "pos": "名詞", "ja": "10年間", "exEn": "He has lived here for a decade.", "exJa": "彼はここに10年間住んでいる。" },
  { "en": "decline", "pos": "動詞", "ja": "減少する、断る", "exEn": "Profits declined by 10% this year.", "exJa": "利益は今年10%減少した。" }
];

// IDとSourceIDを付与
const INITIAL_WORDS = RAW_WORD_LIST.map((word, index) => ({
  ...word,
  id: `builtin-${index + 1}`,
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
    // 初期データソースが「Sample」のまま、または古い場合、新しいAcademicに強制更新するロジック（簡易的）
    if (savedSources) {
       const parsed = JSON.parse(savedSources);
       // もしIDが古いサンプルIDなら上書き
       if(parsed.some(s => s.id === 'sample-source')) {
          setSources(INITIAL_SOURCES);
          localStorage.setItem('vocabSources', JSON.stringify(INITIAL_SOURCES));
       } else {
          setSources(parsed);
       }
    } else { 
      setSources(INITIAL_SOURCES); 
      localStorage.setItem('vocabSources', JSON.stringify(INITIAL_SOURCES)); 
    }
    
    const savedPlaylists = localStorage.getItem('vocabPlaylists');
    if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
    else setPlaylists([]);

    const savedWords = localStorage.getItem('myVocabularyData');
    if (savedWords) {
      const parsedWords = JSON.parse(savedWords);
      // 古いサンプルデータ（数が少ない）場合、新しいデータで上書きしてあげる
      if(parsedWords.length < 10 && parsedWords[0].id === 1) {
         const initial = shuffleArray(INITIAL_WORDS);
         setAllWords(initial);
         localStorage.setItem('myVocabularyData', JSON.stringify(initial));
      } else {
         const fixedWords = parsedWords.map(w => ({ ...w, sourceId: w.sourceId || w.folderId || INITIAL_SOURCE_ID }));
         setAllWords(fixedWords);
      }
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
