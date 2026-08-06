import {
  c as ne,
  j as e,
  r as x,
  S as H,
  X as Q,
  H as le,
  L as ie,
  B as re,
  a as Y,
  T as ce,
  C as te,
  b as de,
  M as oe,
  d as he,
  e as T,
  R as X,
  f as A,
  g as Z,
  h as ee,
  V as U,
  P as xe,
  i as W,
  k as me,
  l as je,
  m as pe,
} from "./vendor.js";
import { s as V, g as D } from "./learning-data.js?v=20260731-starter-twelve";
import quizPhonetics from "./quiz-phonetics.js";
const coreStages = V.map((n) => ({
    ...n,
    roots: n.roots.filter((g) =>
      n.id === "lower" ? !g.generated : g.grade >= 3 && g.grade <= 12
    ),
  })).filter((n) => n.roots.length),
  coreUniqueWords = (() => {
    const n = new Set();
    return (
      coreStages.forEach((g) =>
        g.roots.forEach((j) => j.words.forEach((r) => n.add(r.word)))
      ),
      n.size
    );
  })();
(function () {
  const g = document.createElement("link").relList;
  if (g && g.supports && g.supports("modulepreload")) return;
  for (const c of document.querySelectorAll('link[rel="modulepreload"]')) r(c);
  new MutationObserver((c) => {
    for (const i of c)
      if (i.type === "childList")
        for (const a of i.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && r(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function j(c) {
    const i = {};
    return (
      c.integrity && (i.integrity = c.integrity),
      c.referrerPolicy && (i.referrerPolicy = c.referrerPolicy),
      c.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : c.crossOrigin === "anonymous"
        ? (i.credentials = "omit")
        : (i.credentials = "same-origin"),
      i
    );
  }
  function r(c) {
    if (c.ep) return;
    c.ep = !0;
    const i = j(c);
    fetch(c.href, i);
  }
})();
const se = "ciya-learning-state-v1",
  ae = "ciya-settings-v1",
  dailyStateKey = "ciya-daily-state-v1",
  ge = {
    zk: "中考",
    gk: "高考",
    cet4: "四级",
    cet6: "六级",
    ky: "考研",
    toefl: "托福",
    ielts: "雅思",
    gre: "GRE",
  },
  _ = {
    stageId: "middle",
    dailyGoal: 12,
    speechRate: 0.82,
    voiceURI: "",
    themeMode: "light",
    accentColor: "#3b82f6",
    fontSize: "standard",
    volume: 1,
    quizQuestionCount: 10,
    quizDelay: 3,
    quizAutoPlay: true,
    showQuizPhonetic: true,
    showTranslations: true,
    rememberPosition: true,
    lastModule: "learn",
  };
function $(n) {
  return n
    .replace(/\bvt\./gi, "及物动词:")
    .replace(/\bvi\./gi, "不及物动词:")
    .replace(/\b(?:adj|a|s)\./gi, "形容词:")
    .replace(/\b(?:adv|ad|r)\./gi, "副词:")
    .replace(/\bprep\./gi, "介词:")
    .replace(/\bpron\./gi, "代词:")
    .replace(/\bconj\./gi, "连词:")
    .replace(/\bnum\./gi, "数词:")
    .replace(/\bint\./gi, "感叹词:")
    .replace(/\bn\./gi, "名词:")
    .replace(/\bv\./gi, "动词:")
    .replace(/(^|\s)n(?=\s)/gi, "$1名词:")
    .replace(/(^|\s)v(?=\s)/gi, "$1动词")
    .replace(/(^|\s)s(?=\s)/gi, "$1形容词:")
    .replace(/(^|\s)r(?=\s)/gi, "$1副词:")
    .replace(/\s+/g, " ")
    .trim();
}
function ve() {
  try {
    return JSON.parse(localStorage.getItem(se)) || {};
  } catch {
    return {};
  }
}
function J() {
  try {
    const n = { ..._, ...(JSON.parse(localStorage.getItem(ae)) || {}) };
    return coreStages.some((g) => g.id === n.stageId)
      ? n
      : { ...n, stageId: _.stageId };
  } catch {
    return _;
  }
}
function getLocalDateKey() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(n.getDate()).padStart(2, "0")}`;
}
function getDailyState() {
  const n = getLocalDateKey();
  try {
    const g = JSON.parse(localStorage.getItem(dailyStateKey));
    return g && g.date === n ? g : { date: n, words: {} };
  } catch {
    return { date: n, words: {} };
  }
}
const bridgeGrammarGuides = [
  {
    topic: "be 动词",
    title: "我是、你是、他是",
    tag: "am / are / is",
    scene: "Lily 在介绍自己和朋友。先听听“谁”和后面的词怎样搭配。",
    examples: [
      ["I am Lily.", "我是莉莉。", "I → am"],
      ["You are Tom.", "你是汤姆。", "You → are"],
      ["She is Lucy.", "她是露西。", "She → is"],
    ],
    rule: "I 配 am，you 配 are，单个他、她、它配 is。",
    mistake: ["I is happy.", "I am happy.", "I 后面要用 am。"],
    swaps: [
      ["happy", "I am happy.", "我很开心。"],
      ["ready", "I am ready.", "我准备好了。"],
      ["eight", "I am eight.", "我八岁了。"],
    ],
    quiz: {
      question: "I ___ happy.",
      options: ["am", "is", "are"],
      answer: "am",
      explanation: "看到 I，就选 am。",
    },
    speaking: "用 I am ... 说出你的名字、年龄或心情。",
  },
  {
    topic: "名词单复数",
    title: "一个和多个",
    tag: "is / are",
    scene: "桌上先有一本书，后来又放来了几本书。数量变了，句子也会变化。",
    examples: [
      ["It is a book.", "它是一本书。", "一个 → is"],
      ["They are books.", "它们是书。", "多个 → are"],
      ["These are apples.", "这些是苹果。", "这些 → are"],
    ],
    rule: "一个常用 is，多个常用 are；多个东西的单词后面常有 s。",
    mistake: ["They is books.", "They are books.", "They 表示多个，要用 are。"],
    swaps: [
      ["a cat", "It is a cat.", "它是一只猫。"],
      ["cats", "They are cats.", "它们是猫。"],
      ["pencils", "They are pencils.", "它们是铅笔。"],
    ],
    quiz: {
      question: "They ___ apples.",
      options: ["am", "is", "are"],
      answer: "are",
      explanation: "They 表示多个，所以用 are。",
    },
    speaking: "看看身边的一个或多个物品，用 It is ... 或 They are ... 说一句。",
  },
  {
    topic: "人称与物主代词",
    title: "谁做、对谁、谁的",
    tag: "I / me / my",
    scene:
      "同一个人放在句子里的位置不同，英文形式也会变化。先判断“谁做”“对谁”还是“谁的”。",
    examples: [
      ["I like English.", "我喜欢英语。", "谁做 → I"],
      ["Tom helps me.", "汤姆帮助我。", "对谁 → me"],
      ["This is my book.", "这是我的书。", "谁的 → my"],
    ],
    rule: "动作前用主格，动作后用宾格，名词前用表示“谁的”的词。",
    mistake: [
      "This is me book.",
      "This is my book.",
      "book 前面要用 my，表示“我的书”。",
    ],
    swaps: [
      ["she", "She likes music.", "她喜欢音乐。"],
      ["her", "I can help her.", "我可以帮助她。"],
      ["her book", "This is her book.", "这是她的书。"],
    ],
    quiz: {
      question: "This is ___ pencil.",
      options: ["I", "me", "my"],
      answer: "my",
      explanation: "pencil 是名词，前面用 my 表示“我的”。",
    },
    speaking: "指着自己的物品，用 This is my ... 介绍一句。",
  },
  {
    topic: "一般现在时",
    title: "经常做和习惯做",
    tag: "do / does",
    scene: "每天上学、经常阅读和喜欢音乐，都是习惯或经常发生的事情。",
    examples: [
      ["I play football every day.", "我每天踢足球。", "I → play"],
      ["He plays football every day.", "他每天踢足球。", "He → plays"],
      ["Does he play football?", "他踢足球吗？", "does + play"],
    ],
    rule: "经常、习惯和事实用一般现在时；he、she、it 后的动作常加 s。",
    mistake: [
      "He play football.",
      "He plays football.",
      "主语是 He，肯定句里的 play 要加 s。",
    ],
    swaps: [
      ["read", "I read every day.", "我每天阅读。"],
      ["reads", "She reads every day.", "她每天阅读。"],
      ["does not", "He does not play today.", "他今天不踢。"],
    ],
    quiz: {
      question: "She ___ English every day.",
      options: ["study", "studies", "studying"],
      answer: "studies",
      explanation: "主语是 She，study 变成 studies。",
    },
    speaking: "用 I ... every day 说一件自己每天都会做的事。",
  },
  {
    topic: "现在进行时",
    title: "此刻正在做",
    tag: "be + doing",
    scene: "像看一张正在动的照片：动作此刻正在发生，就用现在进行时。",
    examples: [
      ["I am reading now.", "我现在正在阅读。", "am + reading"],
      ["She is running.", "她正在跑步。", "is + running"],
      ["They are playing.", "他们正在玩。", "are + playing"],
    ],
    rule: "正在做，be 先到，动作后面加 ing；be 动词不能漏掉。",
    mistake: [
      "He playing football.",
      "He is playing football.",
      "现在进行时必须有 is。",
    ],
    swaps: [
      ["read", "I am reading.", "我正在阅读。"],
      ["dance", "She is dancing.", "她正在跳舞。"],
      ["swim", "They are swimming.", "他们正在游泳。"],
    ],
    quiz: {
      question: "Look! The boy ___ now.",
      options: ["runs", "is running", "run"],
      answer: "is running",
      explanation: "Look 和 now 提示动作正在发生，要用 is running。",
    },
    speaking: "观察身边的人，用 He/She is ...ing 描述他或她正在做什么。",
  },
  {
    topic: "一般过去时",
    title: "昨天做过什么",
    tag: "was / were / did",
    scene: "昨天、上周或刚才发生并已经结束的事情，要放到“过去”的时间里表达。",
    examples: [
      ["I played yesterday.", "我昨天玩了。", "play → played"],
      ["She went home.", "她回家了。", "go → went"],
      ["Did you play?", "你玩了吗？", "did + play"],
    ],
    rule: "过去发生已结束，动作变成过去式；did 出现，动作恢复原形。",
    mistake: [
      "Did you went home?",
      "Did you go home?",
      "did 已表示过去，后面的 go 用原形。",
    ],
    swaps: [
      ["play", "I played yesterday.", "我昨天玩了。"],
      ["visit", "We visited Grandma.", "我们看望了奶奶。"],
      ["go", "He went to school.", "他去上学了。"],
    ],
    quiz: {
      question: "Did she ___ the book?",
      options: ["read", "reads", "reading"],
      answer: "read",
      explanation: "did 后面使用动作词原形 read。",
    },
    speaking: "用 Yesterday I ... 说一件昨天做过的事。",
  },
];
function renderBridgeText(text, cue) {
  const words = [...new Set(cue.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || [])];
  if (!words.length) return text;
  const pattern = new RegExp(
    `(${words
      .sort((a, b) => b.length - a.length)
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`,
    "gi"
  );
  return text
    .split(pattern)
    .map((part, index) =>
      words.some((word) => word.toLowerCase() === part.toLowerCase())
        ? e.jsx("mark", { className: "bridge-change", children: part }, index)
        : part
    );
}
const starterLessons = [
  {
    title: "字母与发音",
    tag: "Letters",
    goal: "认识字母名和常见字母音，为自然拼读做准备。",
    pattern: "字母有名字，也有在单词里的声音。",
    words: [
      ["A a", "/eɪ/", "apple"],
      ["B b", "/biː/", "book"],
      ["C c", "/siː/", "cat"],
      ["D d", "/diː/", "dog"],
      ["E e", "/iː/", "egg"],
      ["F f", "/ef/", "fish"],
      ["G g", "/dʒiː/", "girl"],
      ["H h", "/eɪtʃ/", "hat"],
      ["I i", "/aɪ/", "ink"],
      ["J j", "/dʒeɪ/", "jam"],
      ["K k", "/keɪ/", "kite"],
      ["L l", "/el/", "leg"],
      ["M m", "/em/", "milk"],
      ["N n", "/en/", "nose"],
      ["O o", "/əʊ/", "orange"],
      ["P p", "/piː/", "pen"],
      ["Q q", "/kjuː/", "queen"],
      ["R r", "/ɑːr/", "red"],
      ["S s", "/es/", "sun"],
      ["T t", "/tiː/", "table"],
      ["U u", "/juː/", "umbrella"],
      ["V v", "/viː/", "van"],
      ["W w", "/ˈdʌbəl juː/", "water"],
      ["X x", "/eks/", "box"],
      ["Y y", "/waɪ/", "yellow"],
      ["Z z", "/ziː/", "zoo"],
    ],
    examples: [
      ["A is for apple.", "A 代表 apple。"],
      ["B is for book.", "B 代表 book。"],
      ["C is for cat.", "C 代表 cat。"],
      ["D is for dog.", "D 代表 dog。"],
      ["E is for egg.", "E 代表 egg。"],
      ["F is for fish.", "F 代表 fish。"],
      ["G is for girl.", "G 代表 girl。"],
      ["H is for hat.", "H 代表 hat。"],
      ["I is for ink.", "I 代表 ink。"],
      ["J is for jam.", "J 代表 jam。"],
      ["K is for kite.", "K 代表 kite。"],
      ["L is for leg.", "L 代表 leg。"],
      ["M is for milk.", "M 代表 milk。"],
      ["N is for nose.", "N 代表 nose。"],
      ["O is for orange.", "O 代表 orange。"],
      ["P is for pen.", "P 代表 pen。"],
      ["Q is for queen.", "Q 代表 queen。"],
      ["R is for red.", "R 代表 red。"],
      ["S is for sun.", "S 代表 sun。"],
      ["T is for table.", "T 代表 table。"],
      ["U is for umbrella.", "U 代表 umbrella。"],
      ["V is for van.", "V 代表 van。"],
      ["W is for water.", "W 代表 water。"],
      ["X is for box.", "X 在 box 里。"],
      ["Y is for yellow.", "Y 代表 yellow。"],
      ["Z is for zoo.", "Z 代表 zoo。"],
    ],
    practice: [
      ["听到 /b/，先想到哪个字母？", "B b"],
      ["apple 的开头字母是什么？", "A a"],
      ["fish 的开头字母是什么？", "F f"],
      ["zoo 的开头字母是什么？", "Z z"],
    ],
    tip: "启蒙阶段先听声音、认字母，不急着背复杂音标。",
  },
  {
    title: "自然拼读入门",
    tag: "Phonics",
    goal: "会拼读简单的辅音 + 元音 + 辅音单词。",
    pattern: "CVC = 辅音 + 元音 + 辅音，例如 c-a-t。",
    words: [
      ["cat", "c-a-t", "猫"],
      ["dog", "d-o-g", "狗"],
      ["sun", "s-u-n", "太阳"],
      ["pen", "p-e-n", "钢笔"],
    ],
    examples: [
      ["I see a cat.", "我看见一只猫。"],
      ["The dog is big.", "这只狗很大。"],
      ["The sun is up.", "太阳升起来了。"],
    ],
    practice: [
      ["把 p-e-n 连起来读。", "pen"],
      ["sun 由哪三个声音组成？", "s-u-n"],
    ],
    tip: "先练短词拼读，再进入 ee、ea、ai、oa 等字母组合。",
  },
  {
    title: "常用小词",
    tag: "Sight Words",
    goal: "先掌握最常见的句子骨架词。",
    pattern: "I / you / he / she / it / we / they 是句子里常见的“谁”。",
    words: [
      ["I", "我", "I am Tom."],
      ["you", "你；你们", "You are kind."],
      ["he", "他", "He is my friend."],
      ["she", "她", "She can sing."],
      ["it", "它", "It is red."],
    ],
    examples: [
      ["I am happy.", "我很开心。"],
      ["You are my friend.", "你是我的朋友。"],
      ["She can read.", "她会读。"],
    ],
    practice: [
      ["“我很开心”怎么说？", "I am happy."],
      ["“她会读”怎么说？", "She can read."],
    ],
    tip: "这些词不一定按拼读规则读，适合整词认读和反复跟读。",
  },
  {
    title: "短句模板",
    tag: "Sentence",
    goal: "会用固定句型表达自己、物品和能力。",
    pattern: "先套模板，再替换一个词。",
    words: [
      ["My name is ...", "我的名字是……", "My name is Lily."],
      ["This is ...", "这是……", "This is my bag."],
      ["I like ...", "我喜欢……", "I like apples."],
      ["I can ...", "我会……", "I can swim."],
      ["I want ...", "我想要……", "I want some water."],
      ["I have ...", "我有……", "I have a pencil."],
    ],
    examples: [
      ["My name is Lily.", "我的名字是莉莉。"],
      ["This is my pencil.", "这是我的铅笔。"],
      ["I like English.", "我喜欢英语。"],
      ["I can jump.", "我会跳。"],
      ["I want some water.", "我想喝点水。"],
      ["I have a pencil.", "我有一支铅笔。"],
    ],
    practice: [
      ["“我的名字是莉莉”怎么说？", "My name is Lily."],
      ["“我喜欢英语”怎么说？", "I like English."],
    ],
    tip: "启蒙阶段优先让孩子能说完整短句，而不是只背单词。",
  },
  {
    title: "场景词汇",
    tag: "Topics",
    goal: "按生活场景积累能马上造句的词。",
    pattern: "词汇按 family、school、color、food 等主题记。",
    words: [
      ["family", "家庭", "This is my family."],
      ["school", "学校", "I go to school."],
      ["red", "红色的", "It is red."],
      ["milk", "牛奶", "I like milk."],
    ],
    examples: [
      ["This is my family.", "这是我的家人。"],
      ["I go to school.", "我去上学。"],
      ["The apple is red.", "这个苹果是红色的。"],
    ],
    practice: [
      ["“这是我的家人”怎么说？", "This is my family."],
      ["“这个苹果是红色的”怎么说？", "The apple is red."],
    ],
    tip: "每个新词都配一个短句，记忆会比孤立背词更稳。",
  },
  {
    title: "启蒙小语法",
    tag: "Grammar",
    goal: "先懂最小语法，不讲复杂术语。",
    pattern: "先比较人称、单复数、肯定句和问句的变化。",
    words: [
      ["I am / You are", "我是 / 你是", "I am happy. You are kind."],
      ["It is / They are", "它是 / 它们是", "It is small. They are small."],
      ["can / cannot", "会 / 不会", "I can read. I cannot swim."],
      ["Are you ...?", "你是……吗？", "Are you ready?"],
    ],
    examples: [
      ["I am happy. You are kind.", "我很开心。你很友善。"],
      ["It is a book. They are books.", "它是一本书。它们是一些书。"],
      ["I can read. I cannot swim.", "我会阅读。我不会游泳。"],
      ["Are you ready?", "你准备好了吗？"],
    ],
    practice: [
      ["把“它是”变成“它们是”。", "It is → They are"],
      ["把“I can swim”变成否定句。", "I cannot swim."],
    ],
    tip: "先会用，再逐步过渡到 be 动词、一般现在时和现在进行时。",
  },
];
function BridgeGrammarGuide({ speak: n, lessons: g, compact: guideOnly = !1 }) {
  const [j, r] = x.useState(0),
    [c, i] = x.useState(""),
    a = g[j];
  x.useEffect(() => i(""), [j]);
  return e.jsxs("div", {
    className: "starter-grammar-course",
    children: [
      !guideOnly &&
        e.jsxs("section", {
          className: "starter-grammar-nav",
          children: [
            !guideOnly &&
              e.jsxs("div", {
                children: [
                  e.jsx("span", {
                    className: "section-label",
                    children: "小课导航",
                  }),
                  e.jsx("h3", { children: "一次只学一个小规律" }),
                ],
              }),
            e.jsx("div", {
              className: "starter-grammar-tabs",
              children: g.map((l, u) =>
                e.jsxs(
                  "button",
                  {
                    className: j === u ? "active" : "",
                    onClick: () => r(u),
                    children: [
                      e.jsxs("span", { children: ["第 ", u + 1, " 课"] }),
                      e.jsx("strong", { children: l.title }),
                      e.jsx("small", { children: l.tag }),
                    ],
                  },
                  l.title
                )
              ),
            }),
          ],
        }),
      e.jsxs("section", {
        className: "starter-grammar-hero",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "情景导入",
              }),
              e.jsx("h3", { children: a.title }),
              e.jsx("p", { children: a.scene }),
            ],
          }),
          !guideOnly &&
            e.jsxs("div", {
              className: "starter-grammar-progress",
              children: [
                e.jsx("strong", { children: `${j + 1}/${g.length}` }),
                e.jsx("span", { children: "启蒙小课" }),
              ],
            }),
        ],
      }),
      e.jsxs("section", {
        className: "starter-grammar-panel",
        children: [
          e.jsxs("div", {
            className: "starter-grammar-panel-title",
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "例句对比",
              }),
              e.jsx("h4", { children: "听一听，找出变化的地方" }),
            ],
          }),
          e.jsx("div", {
            className: "starter-grammar-examples",
            children: a.examples.map(([l, u, o]) =>
              e.jsxs(
                "article",
                {
                  children: [
                    e.jsx("button", {
                      onClick: () => n(l),
                      "aria-label": `朗读 ${l}`,
                      title: "朗读例句",
                      children: e.jsx(U, { size: 17 }),
                    }),
                    e.jsx("strong", { children: renderBridgeText(l, o) }),
                    e.jsx("span", { children: u }),
                    e.jsx("small", { children: o }),
                  ],
                },
                l
              )
            ),
          }),
          e.jsxs("div", {
            className: "starter-grammar-rule",
            children: [
              e.jsx("span", { children: "一句话口诀" }),
              e.jsx("strong", { children: a.rule }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "starter-grammar-two-column",
        children: [
          e.jsxs("section", {
            className: "starter-grammar-panel starter-grammar-mistake",
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "常见错误",
              }),
              e.jsxs("div", {
                className: "starter-grammar-correction",
                children: [
                  e.jsxs("p", {
                    className: "wrong",
                    children: [e.jsx("b", { children: "×" }), a.mistake[0]],
                  }),
                  e.jsxs("p", {
                    className: "right",
                    children: [e.jsx("b", { children: "✓" }), a.mistake[1]],
                  }),
                ],
              }),
              e.jsx("small", { children: a.mistake[2] }),
            ],
          }),
          e.jsxs("section", {
            className: "starter-grammar-panel",
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "跟读与替换",
              }),
              e.jsx("div", {
                className: "starter-grammar-swaps",
                children: a.swaps.map(([l, u, o]) =>
                  e.jsxs(
                    "button",
                    {
                      onClick: () => n(u),
                      children: [
                        e.jsx("small", { children: `替换：${l}` }),
                        e.jsx("strong", { children: u }),
                        e.jsx("span", { children: o }),
                      ],
                    },
                    u
                  )
                ),
              }),
            ],
          }),
        ],
      }),
      e.jsxs("section", {
        className: "starter-grammar-panel starter-grammar-quiz",
        children: [
          e.jsx("span", { className: "section-label", children: "互动练习" }),
          e.jsx("h4", { children: a.quiz.question }),
          e.jsx("div", {
            className: "starter-grammar-options",
            children: a.quiz.options.map((l) =>
              e.jsx(
                "button",
                {
                  className:
                    c === ""
                      ? ""
                      : l === a.quiz.answer
                      ? "correct"
                      : c === l
                      ? "wrong"
                      : "",
                  onClick: () => i(l),
                  "aria-pressed": c === l,
                  children: l,
                },
                l
              )
            ),
          }),
          c &&
            e.jsxs("div", {
              className:
                c === a.quiz.answer
                  ? "quiz-feedback correct"
                  : "quiz-feedback wrong",
              children: [
                e.jsx("strong", {
                  children: c === a.quiz.answer ? "答对了！" : "再看一次口诀",
                }),
                e.jsx("span", { children: a.quiz.explanation }),
              ],
            }),
        ],
      }),
      e.jsxs("section", {
        className: "starter-grammar-speaking",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "开口任务",
              }),
              e.jsx("h4", { children: "轮到你来说" }),
            ],
          }),
          e.jsx("p", { children: a.speaking }),
        ],
      }),
    ],
  });
}
function StarterPage({ speak: n }) {
  const [g, j] = x.useState(0),
    r = starterLessons[g];
  return e.jsxs("section", {
    className: "page-view starter-page",
    children: [
      e.jsxs("div", {
        className: "page-heading starter-heading",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "1-2 年级",
              }),
              e.jsx("h2", { children: "启蒙基础" }),
              e.jsx("p", {
                children:
                  "先建立字母、声音、常用词和短句能力，再进入三年级后的词根学习。",
              }),
            ],
          }),
          e.jsx("span", {
            className: "starter-count",
            children: `${starterLessons.length} 个基础主题`,
          }),
        ],
      }),
      e.jsx("div", {
        className: "starter-tabs",
        children: starterLessons.map((c, i) =>
          e.jsxs(
            "button",
            {
              className: g === i ? "active" : "",
              onClick: () => j(i),
              children: [
                e.jsx("strong", { children: c.title }),
                e.jsx("small", { children: c.tag }),
              ],
            },
            c.title
          )
        ),
      }),
      e.jsxs("div", {
        className: `starter-layout ${r.tag === "Letters" ? "is-letters" : ""}`,
        children: [
          e.jsxs("article", {
            className: "starter-card starter-main",
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "本课目标",
              }),
              e.jsx("h3", { children: r.title }),
              e.jsx("p", { children: r.goal }),
              e.jsxs("div", {
                className: "starter-pattern",
                children: [
                  e.jsx("strong", { children: "核心方法" }),
                  e.jsx("span", { children: r.pattern }),
                ],
              }),
              e.jsxs("div", {
                className: "starter-tip",
                children: [
                  e.jsx("strong", { children: "提醒" }),
                  e.jsx("span", { children: r.tip }),
                ],
              }),
            ],
          }),
          e.jsxs("article", {
            className: "starter-card",
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "核心词块",
              }),
              e.jsx("div", {
                className: "starter-words",
                children: r.words.map(([c, i, a]) =>
                  e.jsxs(
                    "button",
                    {
                      disabled: r.tag === "Phonics",
                      onClick: () => playStarterWordAudio(r.tag, c, a),
                      "aria-label":
                        r.tag === "Letters"
                          ? `朗读字母 ${c.split(/\s+/)[0]}`
                          : `朗读 ${a || c.replace(/\s*\.\.\.$/, "")}`,
                      title: r.tag === "Letters" ? "朗读字母名称" : "朗读示例",
                      children: [
                        e.jsx("strong", { children: c }),
                        e.jsx("span", { children: i }),
                        e.jsx("small", { children: a }),
                      ],
                    },
                    c
                  )
                ),
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "starter-section",
        children: [
          e.jsxs("div", {
            className: "grammar-section-title",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("span", {
                    className: "section-label",
                    children: "先听再读",
                  }),
                  e.jsx("h4", { children: "英文例句" }),
                ],
              }),
              e.jsxs("small", { children: [r.examples.length, " 个例句"] }),
            ],
          }),
          e.jsx("div", {
            className: "starter-examples",
            children: r.examples.map(([c, i]) =>
              e.jsxs(
                "article",
                {
                  children: [
                    e.jsx("button", {
                      onClick: () => playStarterBasicAudio(c),
                      "aria-label": `朗读 ${c}`,
                      title: "朗读例句",
                      children: e.jsx(U, { size: 17 }),
                    }),
                    e.jsx("strong", { children: c }),
                    e.jsx("span", { children: i }),
                  ],
                },
                c
              )
            ),
          }),
        ],
      }),
      e.jsxs("div", {
        className: "starter-section",
        children: [
          e.jsxs("div", {
            className: "grammar-section-title",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("span", {
                    className: "section-label",
                    children: "马上练",
                  }),
                  e.jsx("h4", { children: "小练习" }),
                ],
              }),
              e.jsxs("small", { children: [r.practice.length, " 道练习"] }),
            ],
          }),
          e.jsx("div", {
            className: "starter-practice",
            children: r.practice.map(([c, i], a) =>
              e.jsxs(
                "article",
                {
                  children: [
                    e.jsxs("span", { children: ["练习 ", a + 1] }),
                    e.jsx("p", { children: c }),
                    e.jsxs("strong", { children: ["参考：", i] }),
                  ],
                },
                c
              )
            ),
          }),
        ],
      }),
    ],
  });
}
function be() {
  const initialSettings = J(),
    [n, g] = x.useState(
      initialSettings.rememberPosition ? initialSettings.lastModule : "learn"
    ),
    [j, r] = x.useState(initialSettings),
    [c, i] = x.useState(() => J().stageId),
    [a, p] = x.useState(0),
    [l, m] = x.useState(0),
    [o, h] = x.useState(""),
    [v, z] = x.useState(ve),
    [daily, setDaily] = x.useState(getDailyState),
    [y, w] = x.useState(!1),
    [b, I] = x.useState(!1),
    [q, F] = x.useState([]),
    C = coreStages.find((t) => t.id === c) || coreStages[0],
    u = C.roots[a] || C.roots[0],
    O = u.words[l] || u.words[0];
  x.useEffect(() => {
    localStorage.setItem(se, JSON.stringify(v));
  }, [v]),
    x.useEffect(() => {
      localStorage.setItem(dailyStateKey, JSON.stringify(daily));
    }, [daily]),
    x.useEffect(() => {
      localStorage.setItem(ae, JSON.stringify(j));
    }, [j]),
    x.useEffect(() => {
      const t = j.themeMode === "dark" ? "dark" : "light";
      document.documentElement.dataset.theme = t;
      document.documentElement.dataset.fontSize = j.fontSize;
      document.documentElement.dataset.showTranslations = String(
        j.showTranslations !== false
      );
      appAudioVolume = Number(j.volume ?? 1);
      document.documentElement.style.setProperty(
        "--green",
        /^#[0-9a-f]{6}$/i.test(j.accentColor) ? j.accentColor : _.accentColor
      );
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", t === "dark" ? "#000000" : j.accentColor);
    }, [j.themeMode, j.accentColor, j.fontSize, j.showTranslations, j.volume]),
    x.useEffect(() => {
      if (!j.rememberPosition || j.lastModule === n) return;
      r((t) => ({ ...t, lastModule: n }));
    }, [n, j.rememberPosition, j.lastModule]),
    x.useEffect(() => {
      if (!("speechSynthesis" in window)) return;
      const t = () => {
        F(
          window.speechSynthesis
            .getVoices()
            .filter((N) => N.lang.toLowerCase().startsWith("en"))
        );
      };
      return (
        t(),
        window.speechSynthesis.addEventListener("voiceschanged", t),
        () => window.speechSynthesis.removeEventListener("voiceschanged", t)
      );
    }, []);
  const d = x.useMemo(() => {
      const t = new Map();
      return (
        coreStages.forEach((N) =>
          N.roots.forEach((R) =>
            R.words.forEach((G) => {
              t.has(G.word) ||
                t.set(G.word, {
                  ...G,
                  stageId: N.id,
                  stageLabel: N.label,
                });
            })
          )
        ),
        Array.from(t.values())
      );
    }, []),
    S = Object.values(v).filter((t) => t === "mastered").length,
    todayMastered =
      daily.date === getLocalDateKey() ? Object.keys(daily.words).length : 0,
    E = Object.values(v).filter((t) => t === "learning").length;
  function s(t) {
    i(t), r((N) => ({ ...N, stageId: t })), p(0), m(0);
  }
  function k(t) {
    p(t), m(0), g("learn");
  }
  function f(t) {
    z((N) => ({ ...N, [O.word]: t })),
      t === "mastered" && markDailyWord(O.word);
  }
  function markDailyWord(t) {
    const N = getLocalDateKey();
    setDaily((R) => ({
      date: N,
      words: { ...(R.date === N ? R.words : {}), [t]: !0 },
    }));
  }
  function markWordMastered(t) {
    z((N) => ({ ...N, [t]: "mastered" })), markDailyWord(t);
  }
  function L() {
    l < u.words.length - 1 ? m(l + 1) : (p((a + 1) % C.roots.length), m(0));
  }
  function M(t) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const N = new SpeechSynthesisUtterance(t);
    (N.lang = "en-US"), (N.rate = j.speechRate), (N.volume = j.volume ?? 1);
    const R = q.find((G) => G.voiceURI === j.voiceURI);
    R && (N.voice = R), window.speechSynthesis.speak(N);
  }
  const B = [
    { id: "starter", label: "启蒙基础", icon: H },
    { id: "phonetics", label: "音标表", icon: U },

    { id: "learn", label: "学习地图", icon: le },
    { id: "quiz", label: "闯关练习", icon: ce },
    { id: "library", label: "词根库", icon: ie },
    { id: "grammar", label: "语法学习", icon: re },
    { id: "dictionary", label: "扩展词典", icon: Y },

    { id: "records", label: "学习记录", icon: te },
    { id: "help", label: "学习帮助", icon: je },
  ];
  return e.jsxs("div", {
    className: "app-shell",
    children: [
      e.jsxs("aside", {
        className: `sidebar ${y ? "open" : ""}`,
        children: [
          e.jsxs("div", {
            className: "brand",
            children: [e.jsx(H, { size: 27 }), "词芽"],
          }),
          e.jsx("button", {
            className: "close-menu icon-button",
            onClick: () => w(!1),
            "aria-label": "关闭菜单",
            children: e.jsx(Q, { size: 20 }),
          }),
          e.jsx("nav", {
            children: B.map(({ id: t, label: N, icon: R }) =>
              e.jsxs(
                "button",
                {
                  className: n === t ? "active" : "",
                  onClick: () => {
                    g(t), w(!1);
                  },
                  children: [
                    e.jsx(R, { size: 20 }),
                    e.jsx("span", { children: N }),
                  ],
                },
                t
              )
            ),
          }),
          e.jsxs("div", {
            className: "sidebar-foot",
            children: [
              e.jsxs("div", {
                className: "student",
                children: [
                  e.jsx("span", { className: "avatar", children: "学" }),
                  e.jsxs("span", {
                    children: [
                      e.jsx("strong", { children: "学习者" }),
                      e.jsx("small", { children: C.shortLabel }),
                    ],
                  }),
                ],
              }),
              e.jsxs("button", {
                onClick: () => {
                  I(!0), w(!1);
                },
                children: [
                  e.jsx(de, { size: 19 }),
                  e.jsx("span", { children: "设置" }),
                ],
              }),
            ],
          }),
        ],
      }),
      y &&
        e.jsx("button", {
          className: "scrim",
          onClick: () => w(!1),
          "aria-label": "关闭菜单",
        }),
      e.jsxs("main", {
        children: [
          e.jsxs("header", {
            className: "topbar",
            children: [
              e.jsx("button", {
                className: "mobile-menu icon-button",
                onClick: () => w(!0),
                "aria-label": "打开菜单",
                children: e.jsx(oe, { size: 22 }),
              }),
              e.jsxs("div", {
                children: [
                  e.jsx("p", {
                    className: "dayline",
                    children: "今天学一点，词汇多一片",
                  }),
                  e.jsx("h1", { children: "从一个词根，长出一棵词汇树" }),
                ],
              }),
            ],
          }),
          n === "learn" &&
            e.jsx(fe, {
              stage: C,
              stageId: c,
              selectStage: s,
              root: u,
              rootIndex: a,
              selectRoot: k,
              word: O,
              wordIndex: l,
              setWordIndex: m,
              progress: v,
              setMastery: f,
              nextWord: L,
              speak: M,
              mastered: S,
              todayMastered,
              learning: E,
              dailyGoal: j.dailyGoal,
            }),
          n === "starter" && e.jsx(StarterPage, { speak: M }),
          n === "phonetics" && e.jsx(PhoneticsPage, {}),
          n === "library" &&
            e.jsx(ye, {
              query: o,
              setQuery: h,
              onSelect: (t, N) => {
                i(t), k(N);
              },
              progress: v,
            }),
          n === "dictionary" && e.jsx(Se, { fallbackWords: d, speak: M }),
          n === "grammar" && e.jsx(Ce, { speak: M }),
          n === "quiz" &&
            e.jsx(ze, {
              words: d,
              onMaster: markWordMastered,
              speak: playQuizWordAudio,
              questionCount: j.quizQuestionCount,
              delay: j.quizDelay,
              autoPlay: j.quizAutoPlay,
              showPhonetic: j.showQuizPhonetic,
            }),
          n === "records" && e.jsx(Ie, { progress: v, total: d.length }),
          n === "help" && e.jsx(HelpPage, { onNavigate: g }),
        ],
      }),
      b &&
        e.jsx(Ne, {
          settings: j,
          voices: q,
          onChange: (t, N) => {
            r((R) => ({ ...R, [t]: N }));
          },
          onReset: () => {
            window.confirm("确定清空所有单词的学习记录吗？此操作不能撤销。") &&
              (z({}), setDaily({ date: getLocalDateKey(), words: {} }));
          },
          onExport: () => {
            const payload = {
              version: 1,
              exportedAt: new Date().toISOString(),
              settings: j,
              progress: v,
              daily,
            };
            const url = URL.createObjectURL(
              new Blob([JSON.stringify(payload, null, 2)], {
                type: "application/json",
              })
            );
            const link = document.createElement("a");
            link.href = url;
            link.download = `词芽学习数据-${getLocalDateKey()}.json`;
            link.click();
            URL.revokeObjectURL(url);
          },
          onImport: (file) => {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const data = JSON.parse(reader.result);
                if (!data || typeof data !== "object") throw new Error();
                data.settings && r({ ..._, ...data.settings });
                data.progress && z(data.progress);
                data.daily && setDaily(data.daily);
                window.alert("学习数据已导入。");
              } catch {
                window.alert("导入失败：请选择由词芽导出的 JSON 文件。");
              }
            };
            reader.readAsText(file);
          },
          onClose: () => I(!1),
        }),
    ],
  });
}
function Ne({
  settings: n,
  voices: g,
  onChange: r,
  onReset: c,
  onExport: onExport,
  onImport: onImport,
  onClose: i,
}) {
  const [active, setActive] = x.useState("appearance");
  x.useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && i();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [i]);
  const sections = [
    ["appearance", "外观", "主题、颜色与字号"],
    ["sound", "声音", "发音与音量"],
    ["quiz", "闯关", "题目与反馈节奏"],
    ["display", "学习显示", "控制学习页信息"],
    ["data", "数据管理", "备份与恢复记录"],
    ["about", "关于词芽", "版本与隐私说明"],
  ];
  const toggle = (key, label, note) =>
    e.jsxs("label", {
      className: "settings-toggle-row",
      children: [
        e.jsxs("span", {
          children: [
            e.jsx("strong", { children: label }),
            e.jsx("small", { children: note }),
          ],
        }),
        e.jsx("input", {
          type: "checkbox",
          checked: n[key] !== false,
          onChange: (event) => r(key, event.target.checked),
        }),
      ],
    });
  let content;
  if (active === "appearance")
    content = e.jsxs(e.Fragment, {
      children: [
        e.jsx("h3", { children: "外观" }),
        e.jsxs("div", {
          className: "settings-control",
          children: [
            e.jsx("label", { children: "主题模式" }),
            e.jsxs("div", {
              className: "settings-segmented",
              children: [
                e.jsx("button", {
                  type: "button",
                  className: n.themeMode === "light" ? "active" : "",
                  onClick: () => r("themeMode", "light"),
                  children: "浅色",
                }),
                e.jsx("button", {
                  type: "button",
                  className: n.themeMode === "dark" ? "active" : "",
                  onClick: () => r("themeMode", "dark"),
                  children: "深色",
                }),
              ],
            }),
          ],
        }),
        e.jsxs("div", {
          className: "settings-control",
          children: [
            e.jsx("label", { children: "主题颜色" }),
            e.jsxs("div", {
              className: "settings-color-row",
              children: [
                e.jsx("input", {
                  type: "color",
                  value: n.accentColor,
                  onChange: (event) => r("accentColor", event.target.value),
                  "aria-label": "选择主题颜色",
                }),
                e.jsx("output", { children: n.accentColor.toUpperCase() }),
              ],
            }),
          ],
        }),
        e.jsxs("div", {
          className: "settings-control",
          children: [
            e.jsx("label", { children: "字体大小" }),
            e.jsxs("select", {
              value: n.fontSize,
              onChange: (event) => r("fontSize", event.target.value),
              children: [
                e.jsx("option", { value: "compact", children: "较小" }),
                e.jsx("option", { value: "standard", children: "标准" }),
                e.jsx("option", { value: "large", children: "较大" }),
              ],
            }),
          ],
        }),
      ],
    });
  else if (active === "sound")
    content = e.jsxs(e.Fragment, {
      children: [
        e.jsx("h3", { children: "声音" }),
        e.jsxs("div", {
          className: "settings-control",
          children: [
            e.jsxs("label", {
              children: [
                "音量 ",
                e.jsx("output", {
                  children: `${Math.round((n.volume ?? 1) * 100)}%`,
                }),
              ],
            }),
            e.jsx("input", {
              type: "range",
              min: "0",
              max: "1",
              step: "0.05",
              value: n.volume ?? 1,
              onChange: (event) => r("volume", Number(event.target.value)),
            }),
          ],
        }),
        e.jsxs("div", {
          className: "settings-control",
          children: [
            e.jsx("label", { children: "英语发音人" }),
            e.jsxs("select", {
              value: n.voiceURI,
              onChange: (event) => r("voiceURI", event.target.value),
              children: [
                e.jsx("option", { value: "", children: "跟随系统默认" }),
                ...g.map((voice) =>
                  e.jsx(
                    "option",
                    {
                      value: voice.voiceURI,
                      children: `${voice.name} · ${voice.lang}`,
                    },
                    voice.voiceURI
                  )
                ),
              ],
            }),
          ],
        }),
        e.jsxs("div", {
          className: "settings-control",
          children: [
            e.jsxs("label", {
              children: [
                "朗读速度 ",
                e.jsx("output", { children: `${n.speechRate.toFixed(2)}×` }),
              ],
            }),
            e.jsx("input", {
              type: "range",
              min: "0.6",
              max: "1.2",
              step: "0.05",
              value: n.speechRate,
              onChange: (event) => r("speechRate", Number(event.target.value)),
            }),
          ],
        }),
      ],
    });
  else if (active === "quiz")
    content = e.jsxs(e.Fragment, {
      children: [
        e.jsx("h3", { children: "闯关" }),
        e.jsxs("div", {
          className: "settings-control",
          children: [
            e.jsx("label", { children: "每轮题数" }),
            e.jsxs("select", {
              value: n.quizQuestionCount,
              onChange: (event) =>
                r("quizQuestionCount", Number(event.target.value)),
              children: [5, 10, 15, 20].map((count) =>
                e.jsx(
                  "option",
                  { value: count, children: `${count} 题` },
                  count
                )
              ),
            }),
          ],
        }),
        e.jsxs("div", {
          className: "settings-control",
          children: [
            e.jsxs("label", {
              children: [
                "答对后停留 ",
                e.jsx("output", { children: `${n.quizDelay} 秒` }),
              ],
            }),
            e.jsx("input", {
              type: "range",
              min: "1",
              max: "6",
              step: "1",
              value: n.quizDelay,
              onChange: (event) => r("quizDelay", Number(event.target.value)),
            }),
          ],
        }),
        toggle(
          "quizAutoPlay",
          "答对后自动播放",
          "先听单词读音，再查看解析并进入下一题"
        ),
      ],
    });
  else if (active === "display")
    content = e.jsxs(e.Fragment, {
      children: [
        e.jsx("h3", { children: "学习显示" }),
        toggle("showQuizPhonetic", "显示音标", "在闯关单词下方显示国际音标"),
        toggle("showTranslations", "显示例句翻译", "显示学习内容中的中文翻译"),
        toggle(
          "rememberPosition",
          "记住上次位置",
          "下次打开时回到上次使用的学习模块"
        ),
      ],
    });
  else if (active === "data")
    content = e.jsxs(e.Fragment, {
      children: [
        e.jsx("h3", { children: "数据管理" }),
        e.jsx("p", {
          className: "settings-intro",
          children:
            "学习数据仅保存在当前浏览器。可以导出 JSON 文件备份，再在本设备或其他设备导入。",
        }),
        e.jsxs("div", {
          className: "settings-actions",
          children: [
            e.jsx("button", {
              type: "button",
              onClick: onExport,
              children: "导出学习数据",
            }),
            e.jsxs("label", {
              className: "settings-import",
              children: [
                "导入学习数据",
                e.jsx("input", {
                  type: "file",
                  accept: ".json,application/json",
                  onChange: (event) =>
                    event.target.files?.[0] && onImport(event.target.files[0]),
                }),
              ],
            }),
            e.jsx("button", {
              type: "button",
              className: "danger",
              onClick: c,
              children: "清空学习记录",
            }),
          ],
        }),
      ],
    });
  else
    content = e.jsxs(e.Fragment, {
      children: [
        e.jsx("h3", { children: "关于词芽" }),
        e.jsxs("div", {
          className: "about-card",
          children: [
            e.jsx("strong", { children: "词芽" }),
            e.jsx("span", { children: "版本 1.0.0" }),
            e.jsx("p", {
              children:
                "从一个词根，长出一棵词汇树。面向学生的英语构词、发音与语法学习工具。",
            }),
          ],
        }),
        e.jsxs("dl", {
          className: "about-list",
          children: [
            e.jsx("dt", { children: "学习资源" }),
            e.jsx("dd", { children: "词根词缀、音标、语法课程与本地发音资源" }),
            e.jsx("dt", { children: "隐私说明" }),
            e.jsx("dd", {
              children: "学习记录默认只存储在本机浏览器，不会自动上传。",
            }),
          ],
        }),
      ],
    });
  return e.jsx("div", {
    className: "settings-overlay",
    role: "presentation",
    onMouseDown: (event) => event.target === event.currentTarget && i(),
    children: e.jsxs("section", {
      className: "settings-dialog settings-dialog-wide",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "settings-title",
      children: [
        e.jsxs("header", {
          children: [
            e.jsxs("div", {
              children: [
                e.jsx("span", {
                  className: "section-label",
                  children: "学习偏好",
                }),
                e.jsx("h2", { id: "settings-title", children: "设置" }),
              ],
            }),
            e.jsx("button", {
              className: "icon-button",
              onClick: i,
              "aria-label": "关闭设置",
              children: e.jsx(Q, { size: 20 }),
            }),
          ],
        }),
        e.jsxs("div", {
          className: "settings-layout",
          children: [
            e.jsx("nav", {
              className: "settings-nav",
              "aria-label": "设置分类",
              children: sections.map(([id, label, note]) =>
                e.jsxs(
                  "button",
                  {
                    type: "button",
                    className: active === id ? "active" : "",
                    onClick: () => setActive(id),
                    children: [
                      e.jsx("strong", { children: label }),
                      e.jsx("small", { children: note }),
                    ],
                  },
                  id
                )
              ),
            }),
            e.jsx("div", { className: "settings-content", children: content }),
          ],
        }),
        e.jsx("footer", {
          children: e.jsxs("button", {
            className: "primary-action",
            onClick: i,
            children: ["完成", e.jsx(A, { size: 17 })],
          }),
        }),
      ],
    }),
  });
}
function NeLegacy({
  settings: n,
  voices: g,
  onChange: r,
  onReset: c,
  onClose: i,
}) {
  return (
    x.useEffect(() => {
      const a = (p) => {
        p.key === "Escape" && i();
      };
      return (
        window.addEventListener("keydown", a),
        () => window.removeEventListener("keydown", a)
      );
    }, [i]),
    e.jsx("div", {
      className: "settings-overlay",
      role: "presentation",
      onMouseDown: (a) => a.target === a.currentTarget && i(),
      children: e.jsxs("section", {
        className: "settings-dialog",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "settings-title",
        children: [
          e.jsxs("header", {
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("span", {
                    className: "section-label",
                    children: "学习偏好",
                  }),
                  e.jsx("h2", { id: "settings-title", children: "设置" }),
                ],
              }),
              e.jsx("button", {
                className: "icon-button",
                onClick: i,
                "aria-label": "关闭设置",
                children: e.jsx(Q, { size: 20 }),
              }),
            ],
          }),
          e.jsxs("div", {
            className: "settings-fields",
            children: [
              e.jsxs("label", {
                children: [
                  e.jsx("span", { children: "主题模式" }),
                  e.jsxs("div", {
                    className: "theme-mode-options",
                    children: [
                      e.jsx("button", {
                        type: "button",
                        className: n.themeMode === "light" ? "active" : "",
                        onClick: () => r("themeMode", "light"),
                        "aria-pressed": n.themeMode === "light",
                        children: "浅色",
                      }),
                      e.jsx("button", {
                        type: "button",
                        className: n.themeMode === "dark" ? "active" : "",
                        onClick: () => r("themeMode", "dark"),
                        "aria-pressed": n.themeMode === "dark",
                        children: "深色",
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("label", {
                children: [
                  e.jsx("span", { children: "主题颜色" }),
                  e.jsxs("div", {
                    className: "theme-color-setting",
                    children: [
                      e.jsx("input", {
                        type: "color",
                        value: n.accentColor,
                        onChange: (a) => r("accentColor", a.target.value),
                        "aria-label": "选择主题颜色",
                      }),
                      e.jsx("output", {
                        children: n.accentColor.toUpperCase(),
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("label", {
                children: [
                  e.jsx("span", { children: "英语发音" }),
                  e.jsxs("select", {
                    value: n.voiceURI,
                    onChange: (a) => r("voiceURI", a.target.value),
                    children: [
                      e.jsx("option", { value: "", children: "跟随系统默认" }),
                      g.map((a) =>
                        e.jsxs(
                          "option",
                          {
                            value: a.voiceURI,
                            children: [a.name, " · ", a.lang],
                          },
                          a.voiceURI
                        )
                      ),
                    ],
                  }),
                ],
              }),
              e.jsxs("label", {
                children: [
                  e.jsxs("span", {
                    children: [
                      "朗读速度 ",
                      e.jsxs("output", {
                        children: [n.speechRate.toFixed(2), "×"],
                      }),
                    ],
                  }),
                  e.jsx("input", {
                    type: "range",
                    min: "0.6",
                    max: "1.2",
                    step: "0.05",
                    value: n.speechRate,
                    onChange: (a) => r("speechRate", Number(a.target.value)),
                  }),
                ],
              }),
            ],
          }),
          e.jsxs("footer", {
            children: [
              e.jsxs("button", {
                className: "reset-progress",
                onClick: c,
                children: [e.jsx(pe, { size: 17 }), "清空学习记录"],
              }),
              e.jsxs("button", {
                className: "primary-action",
                onClick: i,
                children: ["完成", e.jsx(A, { size: 17 })],
              }),
            ],
          }),
        ],
      }),
    })
  );
}
function fe({
  stage: n,
  stageId: g,
  selectStage: j,
  root: r,
  rootIndex: c,
  selectRoot: i,
  word: a,
  wordIndex: p,
  setWordIndex: l,
  progress: m,
  setMastery: o,
  nextWord: h,
  speak: v,
  mastered: z,
  todayMastered: today,
  learning: y,
  dailyGoal: w,
}) {
  const b = r.form.replace(/\s/g, "").length,
    I = b > 28 ? 16 : b > 20 ? 18 : b > 13 ? 21 : 30,
    q = r.meaning.length > 12 ? 14 : r.meaning.length > 8 ? 16 : 20,
    F = r.form.replace(/,\s*/g, ",​ "),
    C = n.roots.map((d, S) => S),
    u = C.indexOf(c),
    O = (d) => {
      const S = (u + d + C.length) % C.length;
      i(C[S]);
    };
  return e.jsxs(e.Fragment, {
    children: [
      e.jsxs("section", {
        className: "summary-strip",
        children: [
          e.jsxs("div", {
            className: "today-progress",
            children: [
              e.jsx("span", { children: "学习目标" }),
              e.jsx("div", {
                className: "progress-track",
                children: e.jsx("i", {
                  style: { width: `${Math.min(100, (today / w) * 100)}%` },
                }),
              }),
              e.jsxs("strong", { children: [Math.min(today, w), "/", w] }),
            ],
          }),
          e.jsx(P, { label: "已掌握", value: z, unit: "个单词" }),
          e.jsx(P, { label: "正在学习", value: y, unit: "个单词" }),
          e.jsx(P, { label: "本阶段", value: n.roots.length, unit: "组构词" }),
        ],
      }),
      e.jsx("div", {
        className: "stage-tabs",
        role: "tablist",
        children: coreStages.map((d) =>
          e.jsxs(
            "button",
            {
              className: g === d.id ? "active" : "",
              onClick: () => j(d.id),
              children: [
                d.label,
                e.jsxs("small", {
                  children: [d.range, " · ", d.roots.length, "组"],
                }),
              ],
            },
            d.id
          )
        ),
      }),
      e.jsxs("section", {
        className: "learning-grid",
        children: [
          e.jsxs("div", {
            className: "tree-panel",
            children: [
              e.jsxs("div", {
                className: "panel-head",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsxs("span", {
                        className: "section-label",
                        children: ["正在学习 · ", n.label],
                      }),
                      e.jsxs("h2", {
                        children: [
                          r.type === "root"
                            ? "词根"
                            : r.type === "prefix"
                            ? "前缀"
                            : "后缀",
                          " · ",
                          r.form,
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "root-switcher",
                    children: [
                      e.jsx("button", {
                        onClick: () => O(-1),
                        "aria-label": "上一个词根",
                        children: e.jsx(he, { size: 18 }),
                      }),
                      e.jsxs("span", { children: [u + 1, " / ", C.length] }),
                      e.jsx("button", {
                        onClick: () => O(1),
                        "aria-label": "下一个词根",
                        children: e.jsx(T, { size: 18 }),
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "word-tree",
                children: [
                  e.jsxs("div", {
                    className: "root-node",
                    children: [
                      e.jsx(H, { size: 28 }),
                      e.jsx("strong", { style: { fontSize: I }, children: F }),
                      e.jsx("span", {
                        style: { fontSize: q },
                        children: $(r.meaning),
                      }),
                      e.jsx("small", { children: r.origin }),
                    ],
                  }),
                  e.jsx("div", {
                    className: "branches",
                    children: r.words.map((d, S) =>
                      e.jsxs(
                        "button",
                        {
                          className: `branch ${p === S ? "active" : ""}`,
                          onClick: () => l(S),
                          children: [
                            e.jsx("span", {
                              className: "branch-word",
                              children: d.word,
                            }),
                            e.jsx("span", {
                              className: "parts",
                              children: d.parts.map((E, s) =>
                                e.jsxs(
                                  X.Fragment,
                                  {
                                    children: [
                                      s > 0 && e.jsx("b", { children: "+" }),
                                      e.jsxs("i", {
                                        "data-kind": E.kind,
                                        children: [
                                          E.text,
                                          e.jsx("small", { children: E.label }),
                                        ],
                                      }),
                                    ],
                                  },
                                  `${E.text}-${s}`
                                )
                              ),
                            }),
                            e.jsx("span", {
                              className: `status-dot ${m[d.word] || ""}`,
                              "aria-label": m[d.word] || "未学习",
                            }),
                          ],
                        },
                        d.word
                      )
                    ),
                  }),
                ],
              }),
            ],
          }),
          e.jsx(we, {
            word: a,
            mastery: m[a.word],
            setMastery: o,
            nextWord: h,
            speak: v,
          }),
        ],
      }),
      e.jsxs("section", {
        className: "lesson-row",
        children: [
          e.jsxs("div", {
            className: "lesson-list",
            children: [
              e.jsxs("div", {
                className: "panel-head",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsx("span", {
                        className: "section-label",
                        children: "本组词汇",
                      }),
                      e.jsx("h2", { children: "今天要认识的词" }),
                    ],
                  }),
                  e.jsxs("span", {
                    className: "count",
                    children: [r.words.length, " 个"],
                  }),
                ],
              }),
              e.jsx("div", {
                className: "lesson-words",
                children: r.words.map((d, S) =>
                  e.jsxs(
                    "button",
                    {
                      className: p === S ? "selected" : "",
                      onClick: () => l(S),
                      children: [
                        e.jsx("span", {
                          className: `learning-mark ${m[d.word] || ""}`,
                          children:
                            m[d.word] === "mastered"
                              ? e.jsx(A, { size: 14 })
                              : S + 1,
                        }),
                        e.jsx("strong", { children: d.word }),
                        e.jsx("span", { children: $(d.meaning) }),
                        e.jsx("span", {
                          className: "decomp",
                          children: d.parts.map((E) => E.text).join(" + "),
                        }),
                        e.jsx(T, { size: 16 }),
                      ],
                    },
                    d.word
                  )
                ),
              }),
            ],
          }),
          e.jsx(Le, { word: a, nextWord: h }),
        ],
      }),
    ],
  });
}
function we({ word: n, mastery: g, setMastery: j, nextWord: r, speak: c }) {
  return e.jsxs("aside", {
    className: "detail-panel",
    children: [
      e.jsxs("div", {
        className: "word-title",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("h2", { children: n.word }),
              e.jsx("p", { children: $(n.meaning) }),
            ],
          }),
          e.jsx("button", {
            className: "speak-button",
            onClick: () => c(n.word),
            "aria-label": `朗读 ${n.word}`,
            children: e.jsx(U, { size: 20 }),
          }),
        ],
      }),
      e.jsx("div", {
        className: "pronunciation",
        children:
          n.phonetic && n.phonetic !== "点击扬声器听发音"
            ? `/${n.phonetic.replace(/^\/|\/$/g, "")}/`
            : "暂无音标",
      }),
      e.jsxs("div", {
        className: "detail-block",
        children: [
          e.jsx("span", { className: "section-label", children: "拆分" }),
          e.jsx("div", {
            className: "detail-parts",
            children: n.parts.map((i, a) =>
              e.jsxs(
                X.Fragment,
                {
                  children: [
                    a > 0 && e.jsx("b", { children: "+" }),
                    e.jsxs("i", {
                      "data-kind": i.kind,
                      children: [i.text, e.jsx("small", { children: i.label })],
                    }),
                  ],
                },
                `${i.text}-${a}`
              )
            ),
          }),
        ],
      }),
      e.jsxs("div", {
        className: "detail-block",
        children: [
          e.jsx("span", { className: "section-label", children: "这样理解" }),
          e.jsx("p", { className: "explanation", children: $(n.explanation) }),
          e.jsx("p", { className: "example", children: $(n.example) }),
          e.jsx("p", { className: "translation", children: $(n.translation) }),
        ],
      }),
      e.jsxs("div", {
        className: "mastery",
        children: [
          e.jsx("span", { className: "section-label", children: "掌握程度" }),
          e.jsxs("div", {
            children: [
              e.jsx("button", {
                className: g === "new" ? "active" : "",
                onClick: () => j("new"),
                children: "不熟悉",
              }),
              e.jsx("button", {
                className: g === "learning" ? "active learning" : "",
                onClick: () => j("learning"),
                children: "学习中",
              }),
              e.jsx("button", {
                className: g === "mastered" ? "active mastered" : "",
                onClick: () => j("mastered"),
                children: "已掌握",
              }),
            ],
          }),
        ],
      }),
      e.jsxs("button", {
        className: "next-button",
        onClick: r,
        children: ["下一个词 ", e.jsx(T, { size: 18 })],
      }),
    ],
  });
}
function ye({ query: n, setQuery: g, onSelect: j, progress: r }) {
  const [c, i] = x.useState("all"),
    a = n.trim().toLowerCase(),
    p = coreStages
      .flatMap((l) =>
        l.roots.map((m, o) => ({
          ...m,
          stageId: l.id,
          stageLabel: l.label,
          index: o,
        }))
      )
      .filter(
        (l) =>
          (c === "all" || l.stageId === c) &&
          (!a ||
            l.form.toLowerCase().includes(a) ||
            l.meaning.includes(a) ||
            l.words.some((m) => m.word.includes(a) || m.meaning.includes(a)))
      );
  return e.jsxs("section", {
    className: "page-view",
    children: [
      e.jsxs("div", {
        className: "page-heading",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "构词资料库",
              }),
              e.jsx("h2", { children: "从熟悉的意思，找到更多单词" }),
            ],
          }),
          e.jsxs("div", {
            className: "library-controls",
            children: [
              e.jsxs("select", {
                value: c,
                onChange: (l) => i(l.target.value),
                "aria-label": "按阶段筛选",
                children: [
                  e.jsx("option", { value: "all", children: "全部阶段" }),
                  coreStages.map((l) =>
                    e.jsx("option", { value: l.id, children: l.label }, l.id)
                  ),
                ],
              }),
              e.jsxs("label", {
                className: "search wide",
                children: [
                  e.jsx(Z, { size: 18 }),
                  e.jsx("input", {
                    value: n,
                    onChange: (l) => g(l.target.value),
                    placeholder: "输入 bio、看、检查……",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "library-table",
        children: [
          e.jsxs("div", {
            className: "table-head",
            children: [
              e.jsx("span", { children: "构词成分" }),
              e.jsx("span", { children: "核心意思" }),
              e.jsx("span", { children: "阶段" }),
              e.jsx("span", { children: "派生词" }),
              e.jsx("span", { children: "进度" }),
            ],
          }),
          p.map((l) => {
            const m = l.words.filter((o) => r[o.word] === "mastered").length;
            return e.jsxs(
              "button",
              {
                onClick: () => j(l.stageId, l.index),
                children: [
                  e.jsxs("span", {
                    className: "root-form",
                    children: [
                      l.form,
                      e.jsx("small", {
                        children:
                          l.type === "root"
                            ? "词根"
                            : l.type === "prefix"
                            ? "前缀"
                            : "后缀",
                      }),
                    ],
                  }),
                  e.jsx("strong", { children: $(l.meaning) }),
                  e.jsx("span", { children: l.stageLabel }),
                  e.jsx("span", {
                    className: "sample-words",
                    children: l.words
                      .slice(0, 3)
                      .map((o) => o.word)
                      .join(" · "),
                  }),
                  e.jsxs("span", {
                    children: [m, "/", l.words.length, e.jsx(T, { size: 16 })],
                  }),
                ],
              },
              `${l.stageId}-${l.index}-${l.form}`
            );
          }),
        ],
      }),
      !p.length &&
        e.jsxs("div", {
          className: "empty-state",
          children: [
            e.jsx(ee, { size: 32 }),
            e.jsx("p", { children: "没有找到相关词根或单词" }),
          ],
        }),
    ],
  });
}
const makePhonetic = (symbol, dir, sound, video, examples) => ({
  symbol,
  dir,
  sound,
  video,
  examples,
});
const phoneticExampleFallbacks = {
  we: { phonetic: "wiː", translation: "我们", partOfSpeech: "代词" },
  my: { phonetic: "maɪ", translation: "我的", partOfSpeech: "代词" },
  no: { phonetic: "nəʊ", translation: "不；没有", partOfSpeech: "常用词" },
  adds: { phonetic: "ædz", translation: "增加", partOfSpeech: "动词" },
  beds: { phonetic: "bedz", translation: "床（复数）", partOfSpeech: "名词" },
  cats: { phonetic: "kæts", translation: "猫（复数）", partOfSpeech: "名词" },
  eats: {
    phonetic: "iːts",
    translation: "吃（第三人称单数）",
    partOfSpeech: "动词",
  },
  friends: {
    phonetic: "frendz",
    translation: "朋友（复数）",
    partOfSpeech: "名词",
  },
  gifts: {
    phonetic: "ɡɪfts",
    translation: "礼物（复数）",
    partOfSpeech: "名词",
  },
};
function getPartOfSpeech(translation = "", definition = "") {
  const text = ` ${translation} ${definition}`;
  const has = (codes) =>
    new RegExp(`(?:^|[\\s;])(?:${codes})\\.`, "i").test(text);
  if (has("pron")) return "代词";
  if (has("prep")) return "介词";
  if (has("conj")) return "连词";
  if (has("num")) return "数词";
  if (has("int")) return "感叹词";
  if (has("vt|vi|v")) return "动词";
  if (has("adj|adjective|a|s")) return "形容词";
  if (has("adv|adverb|ad|r")) return "副词";
  if (has("n")) return "名词";
  return "常用词";
}
const phoneticGroups = [
  {
    title: "单元音",
    subtitle: "发音过程中口型基本保持不变",
    sections: [
      {
        title: "长元音",
        items: [
          makePhonetic(
            "iː",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/长元音/iː",
            "long_vowel_i.aac",
            "长元音 [iː]发音.mp4",
            ["bee", "read", "we"]
          ),
          makePhonetic(
            "uː",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/长元音/uː",
            "long_vowel_u.aac",
            "长元音 [uː]发音.mp4",
            ["cool", "rude", "tooth"]
          ),
          makePhonetic(
            "ɔː",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/长元音/ɔː",
            "long_vowel_4.aac",
            "长元音 [ɔː]发音.mp4",
            ["board", "caught", "walk"]
          ),
          makePhonetic(
            "ɜː",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/长元音/ɜː",
            "long_vowel_3.aac",
            "长元音 [ɜː]发音.mp4",
            ["bird", "word", "work"]
          ),
          makePhonetic(
            "ɑː",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/长元音/ɑː",
            "long_vowel_2.aac",
            "长元音 [ɑː]发音.mp4",
            ["father", "mark", "shark"]
          ),
        ],
      },
      {
        title: "短元音",
        items: [
          makePhonetic(
            "ɪ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/ɪ",
            "short_vowel_I.aac",
            "短元音 [ɪ]发音.mp4",
            ["fish", "little", "sit"]
          ),
          makePhonetic(
            "e",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/e",
            "short_vowel_e.aac",
            "短元音 [e]发音.mp4",
            ["bed", "egg", "red"]
          ),
          makePhonetic(
            "æ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/æ",
            "short_vowel_5.aac",
            "短元音 [æ]发音.mp4",
            ["ant", "lamb", "mass"]
          ),
          makePhonetic(
            "ə",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/ə",
            "short_vowel_6.aac",
            "短元音 [ə]发音.mp4",
            ["actor", "center", "panda"]
          ),
          makePhonetic(
            "ʌ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/ʌ",
            "short_vowel_7.aac",
            "短元音 [ʌ]发音.mp4",
            ["bus", "cup", "sun"]
          ),
          makePhonetic(
            "ɒ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/ɒ",
            "short_vowel_8.aac",
            "短元音[ɒ]发音.mp4",
            ["box", "dog", "stop"]
          ),
          makePhonetic(
            "ʊ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/ʊ",
            "short_vowel_9.aac",
            "短元音 [ʊ]发音.mp4",
            ["book", "full", "good"]
          ),
        ],
      },
    ],
  },
  {
    title: "双元音",
    subtitle: "由一个元音自然滑向另一个元音",
    sections: [
      {
        title: "双元音",
        items: [
          makePhonetic(
            "eɪ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/eɪ",
            "two_vowel_ei.aac",
            "双元音 [eɪ]发音.mp4",
            ["hate", "late", "wait"]
          ),
          makePhonetic(
            "aɪ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/aɪ",
            "two_vowel_1.aac",
            "双元音 [aɪ]发音.mp4",
            ["my", "why", "write"]
          ),
          makePhonetic(
            "ɔɪ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/ɔɪ",
            "two_vowel_4.aac",
            "双元音 [ɔɪ]发音.mp4",
            ["noise", "oil", "point"]
          ),
          makePhonetic(
            "əʊ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/əʊ",
            "two_vowel_5.aac",
            "双元音 [əʊ]发音.mp4",
            ["know", "mode", "pose"]
          ),
          makePhonetic(
            "aʊ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/aʊ",
            "two_vowel_2.aac",
            "双元音 [aʊ]发音.mp4",
            ["cloud", "mouse", "town"]
          ),
          makePhonetic(
            "ɪə",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/ɪə",
            "two_vowel_6.aac",
            "双元音 [ɪə]发音.mp4",
            ["beer", "deer", "mere"]
          ),
          makePhonetic(
            "eə",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/eə",
            "two_vowel_3.aac",
            "双元音 [eə]发音.mp4",
            ["bear", "fare", "wear"]
          ),
          makePhonetic(
            "ʊə",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/元音/短元音/ʊə",
            "two_vowel_7.aac",
            "双元音[ʊə]发音.mp4",
            ["poor", "pure", "tour"]
          ),
        ],
      },
    ],
  },
  {
    title: "清辅音",
    subtitle: "发音时声带不振动",
    sections: [
      {
        title: "清辅音",
        items: [
          makePhonetic(
            "p",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/清辅音/P",
            "consonant_p.aac",
            "清辅音[p]发音.mp4",
            ["cup", "put", "sip"]
          ),
          makePhonetic(
            "t",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/清辅音/t",
            "consonant_t.aac",
            "清辅音[t]发音.mp4",
            ["today", "tomorrow", "top"]
          ),
          makePhonetic(
            "k",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/清辅音/k",
            "consonant_k.aac",
            "清辅音 [k]发音.mp4",
            ["card", "cat", "cup"]
          ),
          makePhonetic(
            "f",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/清辅音/f",
            "consonant_f.aac",
            "清辅音[f]发音.mp4",
            ["fish", "floor", "free"]
          ),
          makePhonetic(
            "θ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/清辅音/θ",
            "consonant_2.aac",
            "清辅音 [θ]发音.mp4",
            ["math", "path", "think"]
          ),
          makePhonetic(
            "s",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/清辅音/s",
            "consonant_s.aac",
            "清辅音 [s]发音.mp4",
            ["bus", "nice", "sit"]
          ),
          makePhonetic(
            "ʃ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/清辅音/∫",
            "consonant_1.aac",
            "清辅音 [ʃ]发音.mp4",
            ["fish", "ship", "shirt"]
          ),
          makePhonetic(
            "tʃ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/清辅音/t∫",
            "consonant_6.aac",
            "清辅音[tʃ]发音.mp4",
            ["chick", "coach", "rich"]
          ),
          makePhonetic(
            "tr",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/清辅音/tr",
            "consonant_tr.aac",
            "[ tr ]和 [ dr ]发音.mp4",
            ["track", "tree", "trill"]
          ),
          makePhonetic(
            "ts",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/清辅音/ts",
            "consonant_ts.aac",
            "[ ts ]和[ dz ]发音.mp4",
            ["cats", "eats", "gifts"]
          ),
          makePhonetic(
            "h",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/清辅音/h",
            "consonant_h.aac",
            "清辅音 [h]发音.mp4",
            ["hello", "home", "hut"]
          ),
        ],
      },
    ],
  },
  {
    title: "浊辅音",
    subtitle: "发音时声带振动",
    sections: [
      {
        title: "浊辅音",
        items: [
          makePhonetic(
            "b",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/b",
            "consonant_b.aac",
            "浊辅音[b]发音.mp4",
            ["bread", "club", "lab"]
          ),
          makePhonetic(
            "d",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/d",
            "consonant_d.aac",
            "清辅音 [d]发音.mp4",
            ["bed", "card", "dog"]
          ),
          makePhonetic(
            "ɡ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/g",
            "consonant_g.aac",
            "浊辅音 [g]发音.mp4",
            ["dig", "egg", "gate"]
          ),
          makePhonetic(
            "v",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/v",
            "consonant_v.aac",
            "浊辅音 [v]发音.mp4",
            ["dove", "ever", "very"]
          ),
          makePhonetic(
            "ð",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/ð",
            "consonant_5.aac",
            "浊辅音 [ð]发音.mp4",
            ["other", "they", "those"]
          ),
          makePhonetic(
            "z",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/z",
            "consonant_z.aac",
            "浊辅音 [z]发音.mp4",
            ["seize", "size", "zero"]
          ),
          makePhonetic(
            "ʒ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/ʒ",
            "consonant_3.aac",
            "浊辅音 [ʒ]发音.mp4",
            ["decision", "leisure", "television"]
          ),
          makePhonetic(
            "dʒ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/dʒ",
            "consonant_7.aac",
            "浊辅音 [dʒ]发音.mp4",
            ["bridge", "jam", "July"]
          ),
          makePhonetic(
            "dr",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/dr",
            "consonant_dr.aac",
            "[ tr ]和 [ dr ]发音.mp4",
            ["dream", "dress", "drink"]
          ),
          makePhonetic(
            "dz",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/dz",
            "consonant_dz.aac",
            "[ ts ]和[ dz ]发音.mp4",
            ["adds", "beds", "friends"]
          ),
          makePhonetic(
            "m",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/m",
            "consonant_m.aac",
            "浊辅音 [m]发音.mp4",
            ["move", "mud", "smart"]
          ),
          makePhonetic(
            "n",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/n",
            "consonant_n.aac",
            "浊辅音 [n]发音.mp4",
            ["find", "hunt", "no"]
          ),
          makePhonetic(
            "ŋ",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/ŋ",
            "consonant_4.aac",
            "浊辅音 [ŋ]发音.mp4",
            ["ink", "sing", "spring"]
          ),
          makePhonetic(
            "l",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/l",
            "consonant_l.aac",
            "浊辅音 [ l ]发音.mp4",
            ["alive", "line", "pool"]
          ),
          makePhonetic(
            "r",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/r",
            "consonant_r.aac",
            "浊辅音 [ r ]发音.mp4",
            ["grass", "read", "write"]
          ),
          makePhonetic(
            "j",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/j",
            "consonant_j.aac",
            "浊辅音 [ j ]发音.mp4",
            ["yak", "yell", "youth"]
          ),
          makePhonetic(
            "w",
            "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/辅音/浊辅音/w",
            "consonant_w.aac",
            "浊辅音 [ w ]发音.mp4",
            ["what", "wood", "work"]
          ),
        ],
      },
    ],
  },
];
function PhoneticsPage() {
  const [n, g] = x.useState(null),
    [exampleData, setExampleData] = x.useState(phoneticExampleFallbacks),
    [exampleDataLoaded, setExampleDataLoaded] = x.useState(!1),
    j = x.useRef(null),
    r = x.useRef(null);
  function c(t) {
    j.current && (j.current.pause(), (j.current.currentTime = 0)),
      r.current && r.current.pause();
    const N = new Audio(t);
    N.volume = appAudioVolume;
    (j.current = N), N.play();
  }
  function i() {
    j.current && (j.current.pause(), (j.current.currentTime = 0)),
      r.current && r.current.pause(),
      g(null);
  }
  x.useEffect(() => {
    const t = (N) => {
      N.key === "Escape" && n && i();
    };
    return (
      window.addEventListener("keydown", t),
      () => window.removeEventListener("keydown", t)
    );
  }, [n]);
  x.useEffect(
    () => () => {
      j.current && j.current.pause();
    },
    []
  );
  x.useEffect(() => {
    if (!n || exampleDataLoaded) return;
    let t = !0;
    const N = new Set(
      phoneticGroups.flatMap((R) =>
        R.sections.flatMap((G) =>
          G.items.flatMap((K) => K.examples.map((q) => q.toLowerCase()))
        )
      )
    );
    return (
      fetch("/dictionary.json")
        .then((R) => R.json())
        .then((R) => {
          if (!t) return;
          const G = { ...phoneticExampleFallbacks };
          R.forEach((K) => {
            const q = K.word.toLowerCase();
            N.has(q) &&
              !G[q] &&
              (G[q] = {
                phonetic: K.phonetic || "",
                translation: K.translation || "",
                partOfSpeech: getPartOfSpeech(
                  K.translation || "",
                  K.definition || ""
                ),
              });
          }),
            setExampleData(G),
            setExampleDataLoaded(!0);
        })
        .catch(() => t && setExampleDataLoaded(!0)),
      () => {
        t = !1;
      }
    );
  }, [n, exampleDataLoaded]);
  return e.jsxs("section", {
    className: "page-view phonetics-view",
    children: [
      e.jsxs("div", {
        className: "page-heading phonetics-heading",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "英语国际音标 · IPA",
              }),
              e.jsx("h2", { children: "音标表" }),
              e.jsx("p", {
                children:
                  "点击扬声器听音标发音，打开卡片可观看视频并练习三个例词。",
              }),
            ],
          }),
          e.jsxs("div", {
            className: "phonetics-tip",
            children: [
              e.jsx(U, { size: 18 }),
              e.jsx("span", {
                children: "建议佩戴耳机，注意长短音和清浊音差别",
              }),
            ],
          }),
        ],
      }),
      phoneticGroups.map((t) =>
        e.jsxs(
          "section",
          {
            className: "phonetic-group",
            children: [
              e.jsxs("header", {
                children: [
                  e.jsx("h3", { children: t.title }),
                  e.jsx("span", { children: t.subtitle }),
                  e.jsx("small", {
                    children: `${t.sections.reduce(
                      (N, R) => N + R.items.length,
                      0
                    )} 个音标`,
                  }),
                ],
              }),
              t.sections.map((N) =>
                e.jsxs(
                  "div",
                  {
                    className: "phonetic-section",
                    children: [
                      e.jsx("h4", { children: N.title }),
                      e.jsx("div", {
                        className: "phonetic-grid",
                        children: N.items.map((R) =>
                          e.jsxs(
                            "article",
                            {
                              className: "phonetic-card",
                              children: [
                                e.jsx("button", {
                                  type: "button",
                                  className: "phonetic-sound",
                                  onClick: () => c(`${R.dir}/${R.sound}`),
                                  "aria-label": `播放音标 ${R.symbol}`,
                                  children: e.jsx(U, { size: 17 }),
                                }),
                                e.jsxs("button", {
                                  type: "button",
                                  className: "phonetic-open",
                                  onClick: () =>
                                    g({
                                      ...R,
                                      category: t.title,
                                      section: N.title,
                                    }),
                                  children: [
                                    e.jsxs("span", {
                                      className: "phonetic-symbol",
                                      children: ["/", R.symbol, "/"],
                                    }),
                                    e.jsx("strong", { children: N.title }),
                                    e.jsx("small", {
                                      children: "查看发音详情",
                                    }),
                                  ],
                                }),
                              ],
                            },
                            R.symbol
                          )
                        ),
                      }),
                    ],
                  },
                  N.title
                )
              ),
            ],
          },
          t.title
        )
      ),
      n &&
        e.jsx("div", {
          className: "phonetic-overlay",
          role: "presentation",
          onMouseDown: (t) => t.target === t.currentTarget && i(),
          children: e.jsxs("section", {
            className: "phonetic-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "phonetic-dialog-title",
            children: [
              e.jsxs("header", {
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsxs("span", {
                        children: [n.category, " · ", n.section],
                      }),
                      e.jsxs("h2", {
                        id: "phonetic-dialog-title",
                        children: ["/", n.symbol, "/"],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "phonetic-dialog-actions",
                    children: [
                      e.jsx("button", {
                        type: "button",
                        className: "icon-button phonetic-header-sound",
                        onClick: () => c(`${n.dir}/${n.sound}`),
                        "aria-label": `播放音标 ${n.symbol}`,
                        children: e.jsx(U, { size: 20 }),
                      }),
                      e.jsx("button", {
                        type: "button",
                        className: "icon-button",
                        onClick: i,
                        "aria-label": "关闭音标详情",
                        children: e.jsx(Q, { size: 20 }),
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "phonetic-dialog-body",
                children: [
                  e.jsx("video", {
                    ref: r,
                    className: "phonetic-video",
                    src: `${n.dir}/${n.video}`,
                    controls: !0,
                    preload: "metadata",
                    onPlay: () => {
                      j.current && j.current.pause();
                    },
                  }),
                  e.jsxs("section", {
                    className: "phonetic-examples",
                    children: [
                      e.jsx("h3", { children: "示例词" }),
                      e.jsx("div", {
                        children: n.examples.map((t) =>
                          e.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => c(`${n.dir}/${t}.aac`),
                              children: [
                                e.jsxs("span", {
                                  className: "phonetic-example-word",
                                  children: [
                                    e.jsx(U, { size: 18 }),
                                    e.jsxs("span", {
                                      children: [
                                        e.jsx("strong", { children: t }),
                                        e.jsx("span", {
                                          children: exampleData[t.toLowerCase()]
                                            ?.phonetic
                                            ? `/${exampleData[
                                                t.toLowerCase()
                                              ].phonetic.replace(
                                                /^\/|\/$/g,
                                                ""
                                              )}/`
                                            : "音标加载中",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs("span", {
                                  className: "phonetic-example-meaning",
                                  children: [
                                    e.jsx("em", {
                                      children:
                                        exampleData[t.toLowerCase()]
                                          ?.partOfSpeech || "常用词",
                                    }),
                                    e.jsx("small", {
                                      children:
                                        $(
                                          exampleData[t.toLowerCase()]
                                            ?.translation || ""
                                        ) || "释义加载中",
                                    }),
                                  ],
                                }),
                              ],
                            },
                            t
                          )
                        ),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
function Se({ fallbackWords: n, speak: g }) {
  const [j, r] = x.useState([]),
    [c, i] = x.useState(""),
    [a, p] = x.useState(!0);
  x.useEffect(() => {
    let o = !0;
    return (
      fetch("/dictionary.json")
        .then((h) => {
          if (!h.ok) throw new Error("dictionary unavailable");
          return h.json();
        })
        .then((h) => o && r(h))
        .catch(() => {
          if (!o) return;
          const h = new Map();
          n.forEach((v) => {
            h.has(v.word) ||
              h.set(v.word, {
                word: v.word,
                phonetic: v.phonetic,
                translation: v.meaning,
                definition: v.example,
                tag: "课程词",
              });
          }),
            r(Array.from(h.values()));
        })
        .finally(() => o && p(!1)),
      () => {
        o = !1;
      }
    );
  }, [n]);
  const l = c.trim().toLowerCase(),
    m = x.useMemo(() => {
      var z;
      if (!l) return [];
      const o = [],
        h = [],
        v = [];
      for (const y of j) {
        const w = y.word.toLowerCase();
        if (
          (w === l
            ? o.push(y)
            : w.startsWith(l)
            ? h.push(y)
            : (w.includes(l) ||
                y.translation.includes(l) ||
                ((z = y.definition) != null && z.toLowerCase().includes(l))) &&
              v.push(y),
          o.length + h.length + v.length >= 80)
        )
          break;
      }
      return [...o, ...h, ...v].slice(0, 30);
    }, [j, l]);
  return e.jsxs("section", {
    className: "page-view dictionary-view",
    children: [
      e.jsxs("div", {
        className: "page-heading dictionary-heading",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "30,000 条扩展查询库",
              }),
              e.jsx("h2", { children: "查单词、音标和常用释义" }),
            ],
          }),
          e.jsxs("label", {
            className: "search dictionary-search",
            children: [
              e.jsx(Z, { size: 19 }),
              e.jsx("input", {
                value: c,
                onChange: (o) => i(o.target.value),
                placeholder: "输入英文单词或中文意思",
                autoFocus: !0,
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "dictionary-meta",
        children: [
          e.jsx("span", {
            children: a
              ? "正在载入词典…"
              : `已载入 ${j.length.toLocaleString()} 条`,
          }),
          e.jsxs("span", {
            children: [
              "课程学习 ",
              coreUniqueWords.toLocaleString(),
              " 个不同单词 · 查询库用于拓展，不计入学习进度",
            ],
          }),
        ],
      }),
      !l &&
        !a &&
        e.jsxs("div", {
          className: "dictionary-empty",
          children: [
            e.jsx(Y, { size: 38 }),
            e.jsx("strong", { children: "输入一个词开始查询" }),
            e.jsx("span", { children: "例如：happy、school、快乐" }),
          ],
        }),
      l &&
        e.jsxs("div", {
          className: "dictionary-results",
          children: [
            m.map((o) =>
              e.jsxs(
                "article",
                {
                  children: [
                    e.jsxs("div", {
                      className: "dictionary-word",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", { children: o.word }),
                            e.jsx("span", {
                              children: o.phonetic
                                ? `/${o.phonetic.replace(/^\/|\/$/g, "")}/`
                                : "暂无音标",
                            }),
                          ],
                        }),
                        e.jsx("button", {
                          onClick: () => g(o.word),
                          "aria-label": `朗读 ${o.word}`,
                          children: e.jsx(U, { size: 18 }),
                        }),
                      ],
                    }),
                    e.jsx("strong", { children: $(o.translation) }),
                    o.definition && e.jsx("p", { children: $(o.definition) }),
                    o.tag &&
                      e.jsx("small", {
                        children: o.tag
                          .split(" ")
                          .slice(0, 4)
                          .map((h) => ge[h] || h)
                          .join(" · "),
                      }),
                  ],
                },
                o.word
              )
            ),
            !a &&
              !m.length &&
              e.jsxs("div", {
                className: "empty-state",
                children: [
                  e.jsx(ee, { size: 32 }),
                  e.jsx("p", { children: "没有找到相关单词" }),
                ],
              }),
          ],
        }),
      e.jsx("p", {
        className: "data-credit",
        children: "数据来源：Morphemes 与 ECDICT，均采用 MIT License。",
      }),
    ],
  });
}
const beVerbEnhancement = {
  knowledge: [
    {
      title: "一、be 动词的三个基础形式",
      points: [
        "现在时有 am、is、are。口诀：我用 am，你用 are，is 连着他、她、它；单数 is，复数 are。",
        "I am；you / we / they are；he / she / it 和单数名词用 is。",
      ],
    },
    {
      title: "二、三种基础句式",
      points: [
        "肯定句：主语 + be + 其他。例：She is happy.",
        "否定句：直接在 be 后加 not。例：She is not happy.",
        "一般疑问句：把 be 放到主语前。例：Is she happy?",
      ],
    },
    {
      title: "三、过去式",
      points: [
        "am 和 is 的过去式是 was；are 的过去式是 were。",
        "I / he / she / it 用 was；you / we / they 用 were。",
      ],
    },
    {
      title: "四、be 后面可以接什么",
      points: [
        "接形容词：He is clever. 他很聪明。",
        "接名词：This is a book. 这是一本书。",
        "接地点介词短语：We are in the classroom. 我们在教室里。",
        "be 不能直接和实义动词原形连用：He is play football. ×",
        "可以说 He is playing football.（正在进行）或 He plays football.（经常发生）。",
      ],
    },
    {
      title: "五、be 的其他形态",
      points: [
        "will be 表示“将会是”：I will be ten years old. 我将十岁了。",
        "have / has been 是完成时形式；being 是现在分词形式，后续课程会继续学习。",
      ],
    },
  ],
  practice: [
    ["I am a new student.", "我是一名新学生。"],
    ["They are not in the library.", "他们不在图书馆里。"],
    ["Is your brother at home?", "你的哥哥在家吗？"],
  ],
};
const nounPluralEnhancement = {
  knowledge: [
    {
      title: "一、先弄懂单数和复数",
      points: [
        "单数名词表示 1 个人或事物：a book（一本书）、an apple（一个苹果）。",
        "复数名词表示 2 个及以上的人或事物：two books、three apples。",
        "只有可数名词才有单复数；water、milk 等不可数名词通常没有复数形式。",
      ],
    },
    {
      title: "二、规则变化：一般直接加 -s",
      points: [
        "大多数可数名词直接加 -s：book → books，cat → cats，pen → pens。",
        "以 s、x、sh、ch 结尾通常加 -es：bus → buses，box → boxes，brush → brushes，watch → watches。",
      ],
    },
    {
      title: "三、-o、-y、-f / -fe 结尾",
      points: [
        "辅音字母 + o 结尾多数加 -es：potato → potatoes，tomato → tomatoes；特例 photo → photos，piano → pianos。",
        "辅音字母 + y：变 y 为 i 再加 -es，如 city → cities；元音字母 + y 直接加 -s，如 boy → boys。",
        "部分 f / fe 结尾变为 v 再加 -es：knife → knives，leaf → leaves；少数直接加 -s，如 roof → roofs。",
      ],
    },
    {
      title: "四、不规则变化和单复数同形",
      points: [
        "不规则变化需要单独记忆：man → men，woman → women，child → children。",
        "还有 foot → feet，tooth → teeth，mouse → mice。",
        "单复数同形表示形式不变：sheep → sheep，deer → deer；fish 表示同一种鱼时常保持 fish。",
      ],
    },
    {
      title: "五、基础句型搭配",
      points: [
        "单数：There is a / an + 单数名词。例：There is a dog.",
        "复数：There are + 数量 + 复数名词。例：There are two dogs.",
        "a / an 只能放在可数名词单数前；不能说 a books。",
      ],
    },
    {
      title: "六、不可数名词和主谓一致",
      points: [
        "不可数名词不能随意加 -s；表达数量可以说 a cup of water、two bottles of milk。",
        "单数主语通常配 is：The dog is small.",
        "复数主语通常配 are：The dogs are small.",
      ],
    },
    {
      title: "七、给孩子的背诵口诀",
      points: [
        "名词单数变复数，一般直接加上 s；s、x、sh、ch 结尾，后面加 es。",
        "辅音加 y，变 y 为 i 再加 es；元音加 y，直接加 s。",
        "f、fe 有时变 v 加 es；特殊变化单独记，单复数同形要留意。",
      ],
    },
  ],
  practice: [
    ["There are three boxes under the table.", "桌子下面有三个盒子。"],
    ["These children have two toy buses.", "这些孩子有两辆玩具公共汽车。"],
    ["The sheep are eating leaves.", "这些绵羊正在吃树叶。"],
    ["There is a bottle of milk in the fridge.", "冰箱里有一瓶牛奶。"],
  ],
};
const makeAdverbialClauseEnhancement = (
  name,
  meaning,
  connectors,
  rules,
  practice
) => ({
  knowledge: [
    {
      title: `一、${name}说明什么`,
      points: [meaning, `常用引导词：${connectors}。`],
    },
    {
      title: `二、${name}的使用重点`,
      points: rules,
    },
  ],
  practice,
});
const basicGrammarEnhancements = {
  词性与句子成分: {
    knowledge: [
      {
        title: "一、先分清两个问题",
        points: [
          "词性回答“这个词是什么种类”，句子成分回答“它在句子里做什么工作”。",
          "同一个名词可以当主语、宾语或表语，所以词性和句子成分不能画等号。",
        ],
      },
      {
        title: "二、八种常见词性逐个认",
        points: [
          "名词是人或物的名称；代词代替名词；动词表示动作或状态；形容词描述人或物。",
          "副词说明动作怎样发生；冠词放在名词前；介词表示时间、地点等关系；连词连接词或句子。",
        ],
      },
      {
        title: "三、先找句子的三根主梁",
        points: [
          "先找“谁或什么”，它通常是主语；再找“做什么或怎么样”，它通常是谓语；最后找动作影响“谁或什么”，它通常是宾语。",
          "She reads books 中，She 是主语，reads 是谓语，books 是宾语。",
        ],
      },
      {
        title: "四、孩子版口诀与做题法",
        points: [
          "名代动形副，冠介连要记住；谁来做是主语，做什么是谓语，动作落谁是宾语。",
          "做题时先圈动词，再向前找主语、向后找宾语，最后判断修饰词。",
        ],
      },
    ],
  },
  "人称、物主与指示代词": {
    knowledge: [
      {
        title: "一、代词分成三大家族",
        points: [
          "人称代词表示“谁”：I、me、she、her 等。",
          "物主代词表示“谁的”：my、mine、our、ours 等；指示代词负责“指一指”：this、that、these、those。",
        ],
      },
      {
        title: "二、人称代词看位置",
        points: [
          "动作前做主语用主格：I、you、he、she、it、we、they。",
          "动词或介词后用宾格：me、you、him、her、it、us、them。",
        ],
      },
      {
        title: "三、物主代词看后面有没有名词",
        points: [
          "后面有名词，用 my、your、his、her、its、our、their：our classroom。",
          "后面没有名词，用 mine、yours、his、hers、ours、theirs：The classroom is ours。",
        ],
      },
      {
        title: "四、指示代词看远近和数量",
        points: [
          "this 是近处一个，that 是远处一个；these 是近处多个，those 是远处多个。",
          "口诀：近单 this，远单 that；近复 these，远复 those。先看远近，再看单双。",
        ],
      },
    ],
  },
  "冠词 a、an、the 与零冠词": {
    knowledge: [
      {
        title: "一、冠词像名词前的小帽子",
        points: [
          "第一次提到、不确定是哪一个，用 a 或 an；双方都知道是哪一个，用 the。",
          "有些名词前不需要戴帽子，这叫零冠词。",
        ],
      },
      {
        title: "二、a 和 an 听声音，不看字母",
        points: [
          "辅音音素开头用 a：a book、a university；元音音素开头用 an：an apple、an hour。",
          "hour 的 h 不发音，university 开头读 /j/，所以不能只看首字母。",
        ],
      },
      {
        title: "三、什么时候用 the 或不用冠词",
        points: [
          "前面提过、双方都知道、世界上独一无二的事物常用 the：the sun。",
          "球类、学科、三餐前通常不用冠词：play football、study English、have breakfast。",
        ],
      },
      {
        title: "四、记忆口诀与检查法",
        points: [
          "一个泛指 a/an，元音声音 an 在前；再次提到用 the，球科三餐常空着。",
          "做题先问：可数单数吗？第一次提吗？双方知道吗？再选择冠词。",
        ],
      },
    ],
  },
  时间与地点介词: {
    knowledge: [
      {
        title: "一、时间介词像三个大小盒子",
        points: [
          "at 装一个时间点：at seven；on 装具体的一天：on Monday；in 装较长时间：in July、in 2026。",
          "具体某一天的早中晚仍用 on：on Monday morning。",
        ],
      },
      {
        title: "二、地点介词看空间关系",
        points: [
          "at 是一个地点点位，on 是接触表面，in 是进入内部。",
          "at school、on the desk、in the box 可以想成“点—面—里面”。",
        ],
      },
      {
        title: "三、方位词画图最好懂",
        points: [
          "under 在下面，above 在上方，behind 在后面，in front of 在前面。",
          "between 通常在两者之间，next to 表示紧挨着。",
        ],
      },
      {
        title: "四、孩子版口诀",
        points: [
          "时间点用 at，具体日子要用 on，月年季节大时间，统统放进 in 里面。",
          "地点记住点面里：at 点、on 面、in 里面。",
        ],
      },
    ],
  },
  "情态动词 can": {
    knowledge: [
      {
        title: "一、can 有三种常用本领",
        points: [
          "表示能力：I can swim；表示许可：You can go now；表示请求：Can you help me?",
        ],
      },
      {
        title: "二、can 后面的动词永远用原形",
        points: [
          "不管主语是 I 还是 he，都说 can play，不能说 can plays。",
          "can 自己不随人称变化：I can、she can、they can。",
        ],
      },
      {
        title: "三、否定和疑问特别简单",
        points: [
          "否定在 can 后加 not：cannot 或 can't。",
          "疑问把 can 放到主语前：Can Tom dance? 简答 Yes, he can. / No, he can't.",
        ],
      },
      {
        title: "四、记忆口诀",
        points: [
          "can 像小助手，后跟动词原形走；变否定加 not，变疑问自己往前走。",
        ],
      },
    ],
  },
  特殊疑问词: {
    knowledge: [
      {
        title: "一、先看你想问哪一种信息",
        points: [
          "who 问人，what 问事物，where 问地点，when 问时间，why 问原因，which 问选择。",
          "how 问方式，也能和其他词组成新的问题。",
        ],
      },
      {
        title: "二、how 家族逐个认",
        points: [
          "how old 问年龄，how many 问可数数量，how much 问价格或不可数数量。",
          "how often 问频率，how long 问时长，how far 问距离，how soon 问多久以后。",
        ],
      },
      {
        title: "三、根据答语倒推问题",
        points: [
          "答语是地点就选 where，是时间就选 when，是 because 开头的原因就选 why。",
          "答语是数字时还要判断它表示年龄、价格、数量、距离还是时长。",
        ],
      },
      {
        title: "四、做题口诀",
        points: [
          "看答语，找信息；人 who，地 where，时间 when，原因 why；多少几个 many，多少钱用 much。",
        ],
      },
    ],
  },
  名词所有格: {
    knowledge: [
      {
        title: "一、所有格就是回答“谁的”",
        points: [
          "Tom's book 表示汤姆的书，'s 像一条所属关系的小尾巴。",
          "通常人和动物的所属关系使用 's，无生命事物常用 of：the door of the room。",
        ],
      },
      {
        title: "二、单数和复数分别怎样加",
        points: [
          "单数名词一般加 's：the girl's bag。",
          "以 s 结尾的复数名词只加 '：the teachers' office；不规则复数仍加 's：children's toys。",
        ],
      },
      {
        title: "三、共同拥有还是分别拥有",
        points: [
          "Tom and Jack's room 表示两人共有一个房间，只在最后加 's。",
          "Tom's and Jack's rooms 表示两人各自的房间，两个人名都加 's。",
        ],
      },
      {
        title: "四、记忆口诀",
        points: [
          "单数直接撇 s，复数已有 s 只加撇；共同拥有最后加，各自拥有分别加。",
        ],
      },
    ],
  },
  祈使句: {
    knowledge: [
      {
        title: "一、祈使句是在对别人说“请这样做”",
        points: [
          "它可以表示命令、请求、建议或提醒，主语 you 通常不说出来。",
          "Open the door 相当于 You open the door，但英语习惯直接从动词开始。",
        ],
      },
      {
        title: "二、四种常见开头",
        points: [
          "肯定句用动词原形开头：Sit down；否定句用 Don't + 动词原形：Don't run。",
          "礼貌请求可加 Please；提出共同建议可用 Let's + 动词原形。",
        ],
      },
      {
        title: "三、语气要让孩子分得清",
        points: [
          "Please 可以放句首，也可放句末并在前面加逗号。",
          "No + 名词或动名词常见于标志：No photos、No swimming。",
        ],
      },
      {
        title: "四、记忆口诀",
        points: [
          "祈使句，没有主语；动词原形站最前。否定 Don't 来开头，Please 一加更礼貌。",
        ],
      },
    ],
  },
  "There be 句型": {
    knowledge: [
      {
        title: "一、There be 专门说“某处有什么”",
        points: [
          "There is a cat under the chair 表示椅子下面有一只猫。",
          "它强调存在的位置，不表示谁拥有；“我有一本书”要说 I have a book。",
        ],
      },
      {
        title: "二、is 还是 are 看后面的名词",
        points: [
          "单数和不可数名词用 There is；复数名词用 There are。",
          "多个名词并列时看离 be 最近的一个：There is a pen and two books。",
        ],
      },
      {
        title: "三、否定和疑问怎样变",
        points: [
          "否定在 be 后加 not：There isn't any milk。",
          "疑问把 be 放到 there 前：Are there any students?",
        ],
      },
      {
        title: "四、口诀与易错点",
        points: [
          "某地有某物，There be 来帮助；单数 is，复数 are，多个名词看最近。",
          "不能说 There have a park；have 表示拥有，There be 表示存在。",
        ],
      },
    ],
  },
  "情态动词与 have to": {
    knowledge: [
      {
        title: "一、先按意思给它们分类",
        points: [
          "can 表能力，may 表许可或可能，must 表强烈的必须，should 表应该。",
          "have to 表示受到规则或情况影响而“不得不”。",
        ],
      },
      {
        title: "二、must 和 have to 的区别",
        points: [
          "must 常是说话者认为必须：I must study hard。",
          "have to 常是外部要求：We have to wear uniforms；它会变成 has to、had to。",
        ],
      },
      {
        title: "三、两个否定意思完全不同",
        points: [
          "mustn't 表示禁止、绝对不能；don't have to 表示没有必要，但做了也可以。",
          "You mustn't swim here 是禁止游泳；You don't have to come early 是不必早来。",
        ],
      },
      {
        title: "四、记忆口诀",
        points: [
          "情态动词本领大，后面动词用原形；mustn't 是不准做，don't have to 是不必做。",
        ],
      },
    ],
  },
  频度副词: {
    knowledge: [
      {
        title: "一、把频率想成一把尺子",
        points: [
          "always 100%，usually 通常，often 经常，sometimes 有时，seldom 很少，never 0%。",
          "频度副词回答 How often，不是回答动作在什么时候发生。",
        ],
      },
      {
        title: "二、放在哪里看动词类型",
        points: [
          "实义动词前：I often read；be 动词后：She is always kind。",
          "情态动词或助动词后、主要动词前：He can usually help us。",
        ],
      },
      {
        title: "三、sometimes 比较自由",
        points: [
          "sometimes 可放句首、句中或句末：Sometimes I walk home；I sometimes walk home。",
          "never 本身已经是否定意义，不能再加 don't。",
        ],
      },
      {
        title: "四、位置口诀",
        points: [
          "实前 be 后记心头，sometimes 前中后都能走；never 已经表示不，别再重复加 not。",
        ],
      },
    ],
  },
  形容词与副词原级: {
    knowledge: [
      {
        title: "一、先看它在描述谁",
        points: [
          "形容词描述人或物：a careful student；副词描述动作怎样发生：study carefully。",
          "先问“什么样的人或物”，再问“动作做得怎么样”。",
        ],
      },
      {
        title: "二、系动词后面用形容词",
        points: [
          "be、look、feel、sound、smell、taste 后通常接形容词：The soup tastes good。",
          "这些词后描述的是主语的状态，不是在修饰动作。",
        ],
      },
      {
        title: "三、副词怎样变化",
        points: [
          "许多形容词加 -ly：quick → quickly，careful → carefully。",
          "辅音加 y 常变 y 为 i 再加 -ly：happy → happily；fast、hard 等形容词和副词同形。",
        ],
      },
      {
        title: "四、判断口诀",
        points: [
          "修饰名词用形容，修饰动作副词用；系动词后看状态，仍然要用形容词。",
        ],
      },
    ],
  },
  "how 引导的问句": {
    knowledge: [
      {
        title: "一、how 不只表示“怎样”",
        points: [
          "how 单独使用问方式：How do you go to school?",
          "和形容词或副词组合后，它会询问年龄、数量、距离、频率和时间。",
        ],
      },
      {
        title: "二、四组最容易混的问法",
        points: [
          "how long 问持续多久，how soon 问多久以后；how often 问多久一次。",
          "how far 问距离，how many 问可数数量，how much 问价格或不可数数量。",
        ],
      },
      {
        title: "三、看答语就能选",
        points: [
          "for two hours 对应 how long；in two days 对应 how soon；twice a week 对应 how often。",
          "five kilometres 对应 how far；twenty yuan 对应 how much。",
        ],
      },
      {
        title: "四、孩子版口诀",
        points: [
          "long 多久，soon 多快，often 几次，far 多远；many 数得清，much 问价格或数不清。",
        ],
      },
    ],
  },
  动词不定式基础: {
    knowledge: [
      {
        title: "一、认识 to do 这个小组合",
        points: [
          "to + 动词原形叫动词不定式，常表示还没做、准备做或想要做的事情。",
          "I want to play 中，to play 表示“想要去做”的动作。",
        ],
      },
      {
        title: "二、哪些动词后常跟 to do",
        points: [
          "want、hope、plan、decide、need、learn 等后常接 to do。",
          "可以按意思成组记：想要 want，计划 plan，希望 hope，决定 decide。",
        ],
      },
      {
        title: "三、否定和常见句型",
        points: [
          "否定通常把 not 放在 to 前：not to do。",
          "ask/tell/want + 人 + to do：Mum told me to wait；疑问词 + to do：I don't know what to do。",
        ],
      },
      {
        title: "四、记忆口诀",
        points: [
          "想要计划和希望，后接 to do 不会忘；叫某人去做事，人后同样接 to do。",
        ],
      },
    ],
  },
  并列连词: {
    knowledge: [
      {
        title: "一、连词是句子之间的小桥",
        points: [
          "and 表并列或顺承，but 表转折，or 表选择或“否则”，so 表结果。",
          "选择连词前，先说清前后两部分是什么逻辑关系。",
        ],
      },
      {
        title: "二、逐个看四座桥",
        points: [
          "A and B 表示两者都有；A but B 表示后面与前面预想不同。",
          "A or B 表示二选一；原因在前、结果在后可用 so。",
        ],
      },
      {
        title: "三、中文习惯不能直接搬进英语",
        points: [
          "英语通常不把 because 和 so 同时放在一个句子里。",
          "because 引出原因，so 引出结果，选择其中一座桥就够了。",
        ],
      },
      {
        title: "四、关系口诀",
        points: [
          "并列顺承用 and，转折不同要用 but；两者选择使用 or，前因后果可用 so。",
        ],
      },
    ],
  },
  量词与数量短语: {
    knowledge: [
      {
        title: "一、数不清的名词请量词帮忙",
        points: [
          "water、milk、bread 等不能直接说 two waters，可用杯、瓶、片等单位来数。",
          "a cup of water、two bottles of milk、three pieces of bread。",
        ],
      },
      {
        title: "二、数量变在哪里",
        points: [
          "数量大于一时，通常把单位词变复数：two cups of tea、three kilos of rice。",
          "后面的不可数名词仍不加 -s。",
        ],
      },
      {
        title: "三、成双成组的东西",
        points: [
          "a pair of shoes 表示一双鞋，two pairs of shoes 表示两双鞋。",
          "a piece of 可表示一张、一片、一则：a piece of paper/news。",
        ],
      },
      {
        title: "四、做题口诀",
        points: ["数不清，单位帮；数字一多单位加 s，of 后名词保持原样。"],
      },
    ],
  },
  时间表达: {
    knowledge: [
      {
        title: "一、最简单的顺读法",
        points: [
          "先读小时，再读分钟：10:20 读 ten twenty；分钟是 05 时读 oh five。",
          "整点可说数字 + o'clock：seven o'clock。",
        ],
      },
      {
        title: "二、past 表示“过了”，to 表示“差”",
        points: [
          "分钟不超过30，用 分钟 + past + 当前小时：6:20 是 twenty past six。",
          "分钟超过30，用距离下一点的分钟 + to + 下一小时：6:45 是 a quarter to seven。",
        ],
      },
      {
        title: "三、两个特殊分数词",
        points: [
          "15分钟是 a quarter，30分钟是 half。",
          "6:15 是 a quarter past six；6:30 是 half past six；6:45 是 a quarter to seven。",
        ],
      },
      {
        title: "四、画钟表判断法",
        points: [
          "先看分针是否越过30；没越过从当前小时往后读 past，越过后算离下一小时还差多少并用 to。",
          "口诀：三十以前 past 过，三十以后 to 还差；十五 quarter，三十 half。",
        ],
      },
    ],
  },
};
const basicExample = (
  sentence,
  translation,
  note,
  highlights,
  tone = "correct"
) => ({
  highlights,
  examples: [{ sentence, translation, note, highlights, tone }],
});
const basicGrammarExampleGuides = {
  词性与句子成分: [
    basicExample(
      "Tom reads books.",
      "汤姆读书。",
      "Tom、books 都是名词，reads 是动词；词性说明单词属于哪一类。",
      ["Tom", "reads", "books"]
    ),
    basicExample(
      "Books are useful. / I read books.",
      "书很有用。/我读书。",
      "同一个名词 books 在第一句作主语，在第二句作宾语。",
      ["Books", "books"],
      "contrast"
    ),
    basicExample(
      "She sings songs.",
      "她唱歌。",
      "谁做事：She；做什么：sings；动作落到什么：songs。",
      ["She", "sings", "songs"]
    ),
    basicExample(
      "The happy girl sings beautifully.",
      "那个快乐的女孩唱得很美。",
      "happy 描述女孩，beautifully 说明唱得怎么样。",
      ["happy", "girl", "sings", "beautifully"]
    ),
  ],
  "人称、物主与指示代词": [
    basicExample(
      "She helps me. This is my book. The book is mine.",
      "她帮助我。这是我的书。这本书是我的。",
      "she/me 表示谁；my/mine 表示谁的。",
      ["She", "me", "my", "mine"],
      "contrast"
    ),
    basicExample(
      "We like her. She likes us.",
      "我们喜欢她。她喜欢我们。",
      "动作前用主格 we/she，动作后用宾格 her/us。",
      ["We", "her", "She", "us"],
      "contrast"
    ),
    basicExample(
      "This is our classroom. The classroom is ours.",
      "这是我们的教室。这个教室是我们的。",
      "后面有名词用 our；没有名词用 ours。",
      ["our classroom", "ours"],
      "contrast"
    ),
    basicExample(
      "This apple is near. That apple is far. These apples are near. Those apples are far.",
      "这个苹果近，那个苹果远；这些苹果近，那些苹果远。",
      "先看远近，再看单数还是复数。",
      ["This", "That", "These", "Those"],
      "contrast"
    ),
  ],
  "冠词 a、an、the 与零冠词": [
    basicExample(
      "I see a dog. The dog is white.",
      "我看见一只狗。那只狗是白色的。",
      "第一次提到用 a，再次提到同一只狗用 the。",
      ["a dog", "The dog"],
      "contrast"
    ),
    basicExample(
      "an apple / an hour / a university",
      "一个苹果/一小时/一所大学。",
      "选择 a/an 要听开头的声音，不只看首字母。",
      ["an apple", "an hour", "a university"],
      "contrast"
    ),
    basicExample(
      "The sun is bright. We play football after school.",
      "太阳很明亮。我们放学后踢足球。",
      "独一无二的太阳用 the；球类 football 前通常不用冠词。",
      ["The sun", "play football"],
      "contrast"
    ),
    basicExample(
      "She has an umbrella. √  She has a umbrella. ×",
      "她有一把雨伞。",
      "umbrella 以元音音素开头，使用 an。",
      ["an umbrella", "a umbrella"],
      "wrong"
    ),
  ],
  时间与地点介词: [
    basicExample(
      "at seven / on Monday / in July",
      "在七点/在星期一/在七月。",
      "时间点用 at，具体一天用 on，较长时间用 in。",
      ["at seven", "on Monday", "in July"],
      "contrast"
    ),
    basicExample(
      "The cat is at the door, on the chair, and in the box.",
      "猫在门口、椅子上和箱子里。",
      "at 是地点点位，on 是表面，in 是里面。",
      ["at the door", "on the chair", "in the box"],
      "contrast"
    ),
    basicExample(
      "The ball is under the chair and next to the bag.",
      "球在椅子下面、书包旁边。",
      "under 和 next to 直接画位置图最容易理解。",
      ["under", "next to"]
    ),
    basicExample(
      "We meet on Monday morning. √  in Monday morning ×",
      "我们星期一上午见面。",
      "具体某一天的早上仍使用 on。",
      ["on Monday morning", "in Monday morning"],
      "wrong"
    ),
  ],
  "情态动词 can": [
    basicExample(
      "I can swim. Can I use your pen? Can you help me?",
      "我会游泳。我可以用你的笔吗？你能帮我吗？",
      "can 可以表示能力、许可和请求。",
      ["can swim", "Can I", "Can you"],
      "contrast"
    ),
    basicExample(
      "He can play football. √  He can plays football. ×",
      "他会踢足球。",
      "can 后面的动词永远使用原形。",
      ["can play", "can plays"],
      "wrong"
    ),
    basicExample(
      "She can't dance. / Can she dance? — Yes, she can.",
      "她不会跳舞。/她会跳舞吗？——是的。",
      "否定加 not，疑问把 can 放到主语前。",
      ["can't", "Can she", "she can"],
      "contrast"
    ),
    basicExample(
      "Can Tom play the guitar?",
      "汤姆会弹吉他吗？",
      "看到 can，后面的 play 不加 -s。",
      ["Can", "play"]
    ),
  ],
  特殊疑问词: [
    basicExample(
      "Who is she? What is this? Where is my bag? When is the party?",
      "她是谁？这是什么？我的包在哪里？聚会什么时候？",
      "who 问人，what 问事物，where 问地点，when 问时间。",
      ["Who", "What", "Where", "When"],
      "contrast"
    ),
    basicExample(
      "How old are you? How many books do you have? How much is it?",
      "你多大？你有多少本书？它多少钱？",
      "how 与不同单词组合后询问不同信息。",
      ["How old", "How many", "How much"],
      "contrast"
    ),
    basicExample(
      "— Where do you live? — In Beijing.",
      "——你住在哪里？——北京。",
      "先看答语是地点，再选择 where。",
      ["Where", "In Beijing"]
    ),
    basicExample(
      "How many apples? / How much milk?",
      "多少个苹果？/多少牛奶？",
      "many 后接可数复数，much 后接不可数名词。",
      ["How many apples", "How much milk"],
      "contrast"
    ),
  ],
  名词所有格: [
    basicExample(
      "This is Tom's room.",
      "这是汤姆的房间。",
      "'s 表示房间属于 Tom。",
      ["Tom's room"]
    ),
    basicExample(
      "the girl's bag / the teachers' office / the children's toys",
      "女孩的包/教师办公室/孩子们的玩具。",
      "单数加 's，已有 s 的复数只加 '，不规则复数加 's。",
      ["girl's", "teachers'", "children's"],
      "contrast"
    ),
    basicExample(
      "Tom and Jack's room / Tom's and Jack's rooms",
      "汤姆和杰克共有的房间/汤姆和杰克各自的房间。",
      "共同拥有只在最后加；分别拥有每个人名都加。",
      ["Tom and Jack's", "Tom's and Jack's"],
      "contrast"
    ),
    basicExample(
      "my parents' room / my parent's room",
      "我父母的房间/我的一位家长的房间。",
      "撇号位置不同，表示的人数也不同。",
      ["parents'", "parent's"],
      "contrast"
    ),
  ],
  祈使句: [
    basicExample(
      "Open the door. Please sit down.",
      "打开门。请坐下。",
      "祈使句省略 you，直接从动词原形开始。",
      ["Open", "Please sit"]
    ),
    basicExample(
      "Don't run. / Let's play.",
      "不要跑。/我们一起玩吧。",
      "否定用 Don't + 原形；共同建议用 Let's + 原形。",
      ["Don't run", "Let's play"],
      "contrast"
    ),
    basicExample(
      "Please help me. / Help me, please.",
      "请帮助我。",
      "please 可在句首，也可放句末并用逗号隔开。",
      ["Please", "please"],
      "contrast"
    ),
    basicExample(
      "Don't talk. √  Don't to talk. ×",
      "不要说话。",
      "Don't 后面直接接动词原形，不加 to。",
      ["Don't talk", "Don't to talk"],
      "wrong"
    ),
  ],
  "There be 句型": [
    basicExample(
      "There is a cat under the chair.",
      "椅子下面有一只猫。",
      "There be 表示某处存在某人或某物。",
      ["There is", "under the chair"]
    ),
    basicExample(
      "There is some milk. / There are two apples.",
      "有一些牛奶。/有两个苹果。",
      "不可数或单数用 is，复数用 are。",
      ["There is", "There are"],
      "contrast"
    ),
    basicExample(
      "There isn't any water. / Are there any books?",
      "没有水。/有书吗？",
      "否定在 be 后加 not，疑问把 be 放到 there 前。",
      ["isn't", "Are there"],
      "contrast"
    ),
    basicExample(
      "There is a pen and two books.",
      "有一支笔和两本书。",
      "多个名词并列时，看离 be 最近的 a pen。",
      ["There is", "a pen"]
    ),
  ],
  "情态动词与 have to": [
    basicExample(
      "She can swim. You may come in. You must stop.",
      "她会游泳。你可以进来。你必须停下。",
      "can、may、must 分别表示能力、许可和必须。",
      ["can", "may", "must"],
      "contrast"
    ),
    basicExample(
      "I must finish my homework. / We have to wear uniforms.",
      "我必须完成作业。/我们按规定必须穿校服。",
      "must 偏自己的要求，have to 偏外部规定。",
      ["must", "have to"],
      "contrast"
    ),
    basicExample(
      "You mustn't run here. / You don't have to come early.",
      "禁止在这里跑。/你不必早来。",
      "mustn't 是禁止，don't have to 是不必。",
      ["mustn't", "don't have to"],
      "contrast"
    ),
    basicExample(
      "He must go now. √  He must goes now. ×",
      "他现在必须走。",
      "情态动词后使用动词原形。",
      ["must go", "must goes"],
      "wrong"
    ),
  ],
  频度副词: [
    basicExample(
      "I always get up early. I never get up late.",
      "我总是早起。我从不晚起。",
      "always 接近100%，never 是0%。",
      ["always", "never"],
      "contrast"
    ),
    basicExample(
      "I often read books. / She is always kind.",
      "我经常读书。/她总是很友善。",
      "实义动词前放 often；be 动词后放 always。",
      ["often read", "is always"],
      "contrast"
    ),
    basicExample(
      "Sometimes I walk home. / I sometimes walk home.",
      "有时我走路回家。",
      "sometimes 可以放句首，也可以放实义动词前。",
      ["Sometimes", "sometimes"],
      "contrast"
    ),
    basicExample(
      "I never eat breakfast. √  I don't never eat breakfast. ×",
      "我从不吃早餐。",
      "never 已经表示否定，不能再加 don't。",
      ["never", "don't never"],
      "wrong"
    ),
  ],
  形容词与副词原级: [
    basicExample(
      "She is a careful student. She studies carefully.",
      "她是一个认真的学生。她学习很认真。",
      "careful 描述人，carefully 描述动作。",
      ["careful student", "studies carefully"],
      "contrast"
    ),
    basicExample(
      "The soup tastes good. The music sounds beautiful.",
      "汤很好喝。音乐听起来很美。",
      "taste、sound 是系动词，后面用形容词。",
      ["tastes good", "sounds beautiful"]
    ),
    basicExample(
      "quick → quickly; happy → happily; fast → fast",
      "快的→快速地；开心的→开心地；fast 形式不变。",
      "多数副词加 -ly，但 fast 是特殊同形。",
      ["quickly", "happily", "fast"],
      "contrast"
    ),
    basicExample(
      "He runs quickly. √  He runs quick. ×",
      "他跑得很快。",
      "修饰动作 runs 要使用副词 quickly。",
      ["runs quickly", "runs quick"],
      "wrong"
    ),
  ],
  "how 引导的问句": [
    basicExample(
      "How do you go to school? — By bus.",
      "你怎样去学校？——坐公交车。",
      "how 单独使用时询问方式。",
      ["How", "By bus"]
    ),
    basicExample(
      "How long did you stay? / How soon will you return?",
      "你待了多久？/你多久以后回来？",
      "long 问持续时长，soon 问还要等多久。",
      ["How long", "How soon"],
      "contrast"
    ),
    basicExample(
      "How often do you exercise? / How far is the school?",
      "你多久锻炼一次？/学校有多远？",
      "often 问频率，far 问距离。",
      ["How often", "How far"],
      "contrast"
    ),
    basicExample(
      "In two days. → How soon?  For two days. → How long?",
      "两天以后对应多久以后；持续两天对应多久。",
      "看答语中的 in 或 for 来判断。",
      ["In two days", "How soon", "For two days", "How long"],
      "contrast"
    ),
  ],
  动词不定式基础: [
    basicExample(
      "I want to join the club.",
      "我想加入俱乐部。",
      "to join 表示想要做、还没有发生的动作。",
      ["want to join"]
    ),
    basicExample(
      "We hope to win. She plans to travel. He decided to stay.",
      "我们希望获胜。她计划旅行。他决定留下。",
      "hope、plan、decide 后常接 to do。",
      ["hope to win", "plans to travel", "decided to stay"]
    ),
    basicExample(
      "Mum told me to wait. She asked me not to run.",
      "妈妈让我等待。她叫我不要跑。",
      "叫某人做用 人 + to do；否定把 not 放在 to 前。",
      ["told me to wait", "not to run"],
      "contrast"
    ),
    basicExample(
      "We plan to visit the zoo. √  We plan visit the zoo. ×",
      "我们计划参观动物园。",
      "plan 后面不能直接接动词原形。",
      ["plan to visit", "plan visit"],
      "wrong"
    ),
  ],
  并列连词: [
    basicExample(
      "I have a pen and a ruler. She is tired but happy.",
      "我有一支笔和一把尺。她很累但很开心。",
      "and 表并列，but 表转折。",
      ["and", "but"],
      "contrast"
    ),
    basicExample(
      "Tea or milk? Hurry up, or you will be late.",
      "茶还是牛奶？快点，否则会迟到。",
      "or 可以表示选择，也可以表示“否则”。",
      ["or", "or"],
      "contrast"
    ),
    basicExample(
      "It rained, so we stayed home.",
      "下雨了，所以我们待在家。",
      "前面是原因，后面是结果，使用 so。",
      ["so"]
    ),
    basicExample(
      "Because it rained, we stayed home. √  Because it rained, so we stayed home. ×",
      "因为下雨，我们待在家。",
      "because 和 so 通常只使用一个。",
      ["Because", "so"],
      "wrong"
    ),
  ],
  量词与数量短语: [
    basicExample(
      "a cup of water / two bottles of milk",
      "一杯水/两瓶牛奶。",
      "不可数名词需要杯、瓶等单位帮助计数。",
      ["a cup of", "two bottles of"],
      "contrast"
    ),
    basicExample(
      "one piece of paper / three pieces of paper",
      "一张纸/三张纸。",
      "数量变多时，单位词 piece 变复数 pieces。",
      ["one piece", "three pieces"],
      "contrast"
    ),
    basicExample(
      "a pair of shoes / two pairs of shoes",
      "一双鞋/两双鞋。",
      "成双物品使用 pair，数字大于一时用 pairs。",
      ["a pair of", "two pairs of"],
      "contrast"
    ),
    basicExample(
      "two bottles of milk √  two bottle of milk ×",
      "两瓶牛奶。",
      "数字 two 后的单位名词必须使用复数。",
      ["two bottles", "two bottle"],
      "wrong"
    ),
  ],
  时间表达: [
    basicExample(
      "7:00 → seven o'clock; 10:20 → ten twenty",
      "七点整；十点二十分。",
      "顺读法先读小时，再读分钟。",
      ["seven o'clock", "ten twenty"],
      "contrast"
    ),
    basicExample(
      "6:20 → twenty past six; 6:45 → fifteen to seven",
      "六点二十；六点四十五。",
      "30分以前用 past，30分以后算离下一点还差多少并用 to。",
      ["past", "to"],
      "contrast"
    ),
    basicExample(
      "6:15 → a quarter past six; 6:30 → half past six; 6:45 → a quarter to seven",
      "六点一刻；六点半；六点四十五。",
      "15分钟是 a quarter，30分钟是 half。",
      ["a quarter", "half", "a quarter to"],
      "contrast"
    ),
    basicExample(
      "6:45 = a quarter to seven. √  a quarter past six = 6:15.",
      "六点四十五等于差一刻七点；六点一刻是过六点一刻。",
      "先看分针是否超过30，再决定 past 或 to。",
      ["a quarter to seven", "a quarter past six"],
      "contrast"
    ),
  ],
};
Object.entries(basicGrammarExampleGuides).forEach(([title, guides]) => {
  const lesson = basicGrammarEnhancements[title];
  if (!lesson) return;
  lesson.knowledge = lesson.knowledge.map((section, index) => ({
    ...section,
    ...guides[index],
  }));
});
const grade8GrammarEnhancements = {
  一般将来时: {
    knowledge: [
      {
        title: "一、先看事情是不是还没发生",
        points: [
          "明天、下周或未来准备发生的动作，用一般将来时。",
          "常见时间词有 tomorrow、next week、soon、in the future、in two days。",
        ],
      },
      {
        title: "二、will 和 be going to 怎样选",
        points: [
          "临时决定、承诺或没有明显依据的预测常用 will + 动词原形。",
          "提前计划好的事或眼前有迹象的预测常用 be going to + 动词原形。",
        ],
      },
      {
        title: "三、两套句型分别怎样变化",
        points: [
          "will 的否定是 won't，疑问时把 will 提前；所有主语后都用 will。",
          "be going to 中的 be 要随主语变成 am、is、are，否定和疑问都围绕 be 变化。",
        ],
      },
      {
        title: "四、口诀与做题步骤",
        points: [
          "临时决定多用 will，提前计划 going to；乌云已来要下雨，有迹象也用 going to。",
          "先找未来时间，再判断是临时决定、计划还是有迹象的预测，最后检查动词是否为原形。",
        ],
      },
    ],
  },
  情态动词深化: {
    knowledge: [
      {
        title: "一、按语气给情态动词排队",
        points: [
          "can/could 表能力或请求，may/might 表许可或可能，should 表建议，must 表强烈义务。",
          "情态动词没有人称变化，后面都接动词原形。",
        ],
      },
      {
        title: "二、must 和 have to 不完全一样",
        points: [
          "must 常表示说话者认为必须；have to 常表示规则或客观情况要求。",
          "have to 会随人称和时态变化：has to、had to；must 本身不变。",
        ],
      },
      {
        title: "三、否定含义最容易考",
        points: [
          "mustn't 是“禁止”，needn't 或 don't have to 是“不必”。",
          "Must I finish now? 的否定回答用 No, you needn't，不能用 mustn't。",
        ],
      },
      {
        title: "四、孩子版记忆法",
        points: [
          "情态动词像语气按钮：can 能，may 可能，should 应该，must 必须。",
          "按钮后面动词不变；mustn't 不许做，needn't 不必做。",
        ],
      },
    ],
  },
  "形容词、副词比较等级": {
    knowledge: [
      {
        title: "一、先判断比较几个人或事物",
        points: [
          "一个对象只描述特点，用原级；两个对象比较，用比较级；三个及以上比出第一，用最高级。",
          "than 常提醒比较级，in/of + 范围常提醒最高级。",
        ],
      },
      {
        title: "二、规则变化分四组记",
        points: [
          "短词一般加 -er/-est：tall → taller → tallest。",
          "e 结尾加 -r/-st；辅音+y 变 y 为 i；重读闭音节常双写末尾辅音。",
          "较长词通常用 more/most：more beautiful、most important。",
        ],
      },
      {
        title: "三、不规则变化和修饰词",
        points: [
          "good/well → better → best；bad/badly → worse → worst；many/much → more → most。",
          "much、a lot、a little、even 可修饰比较级，但 very 不能直接修饰比较级。",
        ],
      },
      {
        title: "四、口诀与易错点",
        points: [
          "两者比较 er，三者以上 est；长词前面 more/most，不规则变化单独记。",
          "不能说 more easier；比较级已经有 -er，就不要再加 more。",
        ],
      },
    ],
  },
  同级比较: {
    knowledge: [
      {
        title: "一、同级比较是在看“一不一样”",
        points: [
          "两者程度相同用 as...as，表示“和……一样……”。",
          "程度不同用 not as/so...as，表示“不如……”。",
        ],
      },
      {
        title: "二、中间必须放原级",
        points: [
          "as + 形容词原级 + as：as tall as；as + 副词原级 + as：run as fast as。",
          "不能说 as taller as，因为 as...as 已经表示比较。",
        ],
      },
      {
        title: "三、形容词还是副词看修饰对象",
        points: [
          "描述人或物用形容词：Amy is as careful as Lily。",
          "描述动作方式用副词：Amy writes as carefully as Lily。",
        ],
      },
      {
        title: "四、记忆口诀",
        points: [
          "两边 as 像夹心，中间原级不能变；肯定一样 as...as，否定不如 not as...as。",
        ],
      },
    ],
  },
  复合不定代词: {
    knowledge: [
      {
        title: "一、把它们拆成前后两部分",
        points: [
          "some、any、every、no 表范围；-one/-body 指人，-thing 指事物。",
          "someone 和 somebody 意思相近，something 指某件事。",
        ],
      },
      {
        title: "二、some、any、every、no 怎样选",
        points: [
          "some 系列常用于肯定句，any 系列常用于疑问句和否定句。",
          "every 系列表示每一个，no 系列本身表示否定，不能再与 not 重复。",
        ],
      },
      {
        title: "三、两个特殊规则",
        points: [
          "复合不定代词通常按单数处理：Everyone is ready。",
          "形容词必须放在它后面：something interesting，不能说 interesting something。",
        ],
      },
      {
        title: "四、做题口诀",
        points: [
          "肯定 some，疑否 any；每个 every，没有 no；形容词往后站，谓语动词用单数。",
        ],
      },
    ],
  },
  动词不定式固定搭配: {
    knowledge: [
      {
        title: "一、先把常跟 to do 的动词分组",
        points: [
          "愿望计划类：want、hope、wish、plan、decide + to do。",
          "努力答应类：try、learn、agree、promise、refuse + to do。",
        ],
      },
      {
        title: "二、to do 和 doing 意思会不同",
        points: [
          "stop to do 是停下当前事情去做另一件事；stop doing 是停止正在做的事。",
          "remember to do 是记得要做；remember doing 是记得做过。",
        ],
      },
      {
        title: "三、动作发生没有是判断关键",
        points: [
          "forget to lock 表示该锁但忘了，动作没发生；forget locking 表示锁过但忘记这件事。",
          "不要只背中文，要画出动作先后。",
        ],
      },
      {
        title: "四、做题三步法",
        points: [
          "先认前面的固定搭配，再判断动作是否已经发生，最后检查 to 后是不是动词原形。",
          "口诀：要做未做多用 to do，做过或持续常看 doing。",
        ],
      },
    ],
  },
  并列句与连词: {
    knowledge: [
      {
        title: "一、先判断前后句的逻辑关系",
        points: [
          "并列顺承用 and，转折用 but，选择或“否则”用 or，结果用 so。",
          "先用中文说清关系，再选择连接词。",
        ],
      },
      {
        title: "二、but 和 however 的位置不同",
        points: [
          "but 是连词，可直接连接两个并列分句：..., but ...。",
          "however 是连接副词，常另起一句或用分号，并用逗号隔开：...; however, ...。",
        ],
      },
      {
        title: "三、英语里一座桥就够了",
        points: [
          "because 和 so 通常不同时连接同一组因果句。",
          "although/though 和 but 通常也不同时使用。",
        ],
      },
      {
        title: "四、标点也要一起检查",
        points: [
          "连接两个完整句子时，and/but/or/so 前通常需要逗号。",
          "口诀：关系先看清，连词再决定；however 有逗号，双桥不要挤一起。",
        ],
      },
    ],
  },
  疑问词组: {
    knowledge: [
      {
        title: "一、六个 how 词组各问什么",
        points: [
          "how many 问可数数量，how much 问不可数数量或价格。",
          "how long 问时长，how far 问距离，how often 问频率，how soon 问多久以后。",
        ],
      },
      {
        title: "二、从答语反推最快",
        points: [
          "five books → how many；20 yuan → how much；two kilometres → how far。",
          "for two hours → how long；twice a week → how often；in two days → how soon。",
        ],
      },
      {
        title: "三、long、often、soon 重点辨析",
        points: [
          "how long 关心持续了多久，how often 关心重复频率，how soon 关心还要等多久。",
          "看到 in + 时间段回答，通常选择 how soon。",
        ],
      },
      {
        title: "四、记忆口诀",
        points: [
          "many 可数，much 钱和不可数；long 持续，far 距离，often 频率，soon 多久以后。",
        ],
      },
    ],
  },
  反身代词: {
    knowledge: [
      {
        title: "一、动作又回到自己身上",
        points: [
          "主语发出动作，宾语还是同一个人时用反身代词：She taught herself。",
          "反身代词也可加强语气：I made it myself，强调“我亲自”。",
        ],
      },
      {
        title: "二、单数和复数分别记",
        points: [
          "myself、yourself、himself、herself、itself 是单数。",
          "ourselves、yourselves、themselves 是复数；注意 self 变成 selves。",
        ],
      },
      {
        title: "三、常用搭配放进情景记",
        points: [
          "enjoy oneself 玩得开心，help oneself 自便，by oneself 独自，teach oneself 自学。",
          "主语和反身代词必须人称、数一致：we → ourselves。",
        ],
      },
      {
        title: "四、记忆口诀",
        points: [
          "单数 self，复数 selves；主语是谁就跟谁，动作回来用反身，亲自完成也能用。",
        ],
      },
    ],
  },
  可数与不可数名词量化: {
    knowledge: [
      {
        title: "一、先判断能不能一个个数",
        points: [
          "book、apple 可直接数，是可数名词；water、bread、information 通常不能直接数，是不可数名词。",
          "不可数名词通常没有复数，也不能直接和 a/an 连用。",
        ],
      },
      {
        title: "二、不可数名词怎样数",
        points: [
          "给它加单位：a cup of tea、two pieces of paper、three bottles of water。",
          "数量大于一时变化的是单位词：two pieces，不是 papers。",
        ],
      },
      {
        title: "三、many、much、few、little 配对记",
        points: [
          "many/few/a few 修饰可数名词复数。",
          "much/little/a little 修饰不可数名词；a few/a little 表示有一点，few/little 表示几乎没有。",
        ],
      },
      {
        title: "四、做题步骤",
        points: [
          "先判断名词可数还是不可数，再看数量词搭配，最后检查单位词是否需要复数。",
          "口诀：可数 many，不可数 much；数不清的单位来帮助。",
        ],
      },
    ],
  },
  现在完成时: {
    knowledge: [
      {
        title: "一、画一条“过去连到现在”的线",
        points: [
          "现在完成时谈过去发生的事，但重点是它对现在的结果、经历或持续影响。",
          "结构是 have/has + 过去分词；I/you/we/they 用 have，he/she/it 用 has。",
        ],
      },
      {
        title: "二、三种常见用法",
        points: [
          "结果：I have finished my homework，现在作业已完成。",
          "经历：Have you ever been to Beijing?；持续：She has lived here for five years。",
        ],
      },
      {
        title: "三、标志词分组记",
        points: [
          "already 已经，yet 尚未/已经，just 刚刚，ever 曾经，never 从未。",
          "for + 一段时间，since + 时间起点，so far 表示截至目前。",
        ],
      },
      {
        title: "四、been、gone、been in 别混",
        points: [
          "have been to 去过且已回来；have gone to 去了还没回来；have been in 在某地待了一段时间。",
          "口诀：been to 去过回来了，gone to 去了人不在，been in 一直待到现在。",
        ],
      },
      {
        title: "五、易错判断法",
        points: [
          "明确过去时间 yesterday 通常用一般过去时，不能机械看到“已经”就用完成时。",
          "for/since 表持续时，要使用能持续的状态，短暂动作需要转换。",
        ],
      },
    ],
  },
  状语从句: {
    knowledge: [
      {
        title: "一、把它看成给主句补背景的小句子",
        points: [
          "状语从句内部有自己的主语和谓语，整体给主句补充时间、地点、条件、原因、目的、结果、让步、比较或方式背景。",
          "先找主句，再问从句回答的是“何时、哪里、什么条件、为什么、为了什么、结果怎样、尽管什么、比较怎样、以什么方式”。",
        ],
      },
      {
        title: "二、九类状语从句完整地图",
        points: [
          "时间：when、while、before、after、until；地点：where、wherever；条件：if、unless、as long as。",
          "原因：because、since、as；目的：so that、in order that；结果：so...that、such...that。",
          "让步：although、though、even if；比较：than、as...as；方式：as、as if、as though。",
        ],
      },
      {
        title: "三、本阶段先重点掌握四类",
        points: [
          "时间从句回答“什么时候”，条件从句回答“满足什么条件”。",
          "原因从句回答“为什么”，让步从句表达“虽然如此，主句仍然成立”。",
          "地点、目的、结果、比较和方式也要先认识，后续课程再逐类深化。",
        ],
      },
      {
        title: "四、地点、目的和结果怎样区分",
        points: [
          "地点从句回答“在哪里”：Sit where you can see clearly。",
          "目的从句回答“为了什么”：Speak slowly so that everyone can understand。",
          "结果从句回答“最后造成什么”：He was so tired that he fell asleep。",
        ],
      },
      {
        title: "五、比较和方式怎样区分",
        points: [
          "比较从句把两者放在一起比较：Tom runs faster than I do。",
          "方式从句说明“按照什么方式”或“好像怎样”：Do it as I showed you。",
        ],
      },
      {
        title: "六、时间和条件从句的主将从现",
        points: [
          "主句谈将来时，时间或条件从句通常用一般现在时表示将来。",
          "I will call you when I arrive，不能写 when I will arrive；If it rains, we will stay home。",
        ],
      },
      {
        title: "七、三组容易重复或混淆的连接词",
        points: [
          "because 和 so 通常只用一个；although/though 和 but 通常只用一个。",
          "so that 表目的，so...that 表结果：前者是“为了”，后者是“如此……以至于”。",
          "unless 已经含有 if...not 的意思，通常不要再加 not。",
        ],
      },
      {
        title: "八、判断状语从句四步法",
        points: [
          "第一步圈连接词；第二步划出从句的主语和谓语；第三步问它给主句补充哪一种背景；第四步检查时态及连接词是否重复。",
          "口诀：时间地点和条件，原因目的接结果；让步比较加方式，九类关系要看清。",
        ],
      },
    ],
  },
  情态动词表示推测: {
    knowledge: [
      {
        title: "一、把推测想成把握程度尺",
        points: [
          "must 表示证据充分，“一定”；may/might/could 表示有可能；can't 表示有证据说明“不可能”。",
          "这里的 must 不是“必须”，要根据句意判断。",
        ],
      },
      {
        title: "二、先找证据再选词",
        points: [
          "His name is on the bag，所以 it must be his；人明明在国外，所以 he can't be at home。",
          "没有充分证据，只能说 may/might。",
        ],
      },
      {
        title: "三、否定推测不是 mustn't",
        points: [
          "mustn't 表示禁止做某事，can't 才表示“不可能是”。",
          "You mustn't park here 是禁止停车；He can't be Tom 是不可能是汤姆。",
        ],
      },
      {
        title: "四、做题口诀",
        points: [
          "证据很足用 must，可能不定 may/might，证据否定用 can't；mustn't 只管“不许干”。",
        ],
      },
    ],
  },
  宾语从句入门: {
    knowledge: [
      {
        title: "一、先找主句里的动词",
        points: [
          "think、know、say、ask、wonder 后若跟一整个有主语和谓语的小句子，这个小句子就是宾语从句。",
          "I think [that he is right] 中，方括号内容回答“think 什么”。",
        ],
      },
      {
        title: "二、三类引导词怎样选",
        points: [
          "陈述内容用 that；“是否”用 if/whether；有具体疑问信息保留 what、where、when、how 等。",
          "选引导词前，先把从句还原成一个独立句子。",
        ],
      },
      {
        title: "三、从句一律使用陈述语序",
        points: [
          "疑问句进入宾语从句后要变成“主语 + 谓语”：where she lives。",
          "不能写 where does she live；助动词不能跑到主语前。",
        ],
      },
      {
        title: "四、时态呼应基础",
        points: [
          "主句是现在时，从句按实际情况选时态；主句是过去时，从句通常向过去移动。",
          "客观真理不受影响：The teacher said that the earth goes around the sun。",
        ],
      },
      {
        title: "五、做题四步法",
        points: [
          "找主句动词、选引导词、改陈述语序、检查时态；口诀：连接词、语序、时态，三关逐个来。",
        ],
      },
    ],
  },
  一般时态的被动语态: {
    knowledge: [
      {
        title: "一、先问主语是“做”还是“被做”",
        points: [
          "主语执行动作，用主动语态；主语承受动作，用被动语态。",
          "The workers built the bridge 是工人建桥；The bridge was built 是桥被建。",
        ],
      },
      {
        title: "二、核心公式只有一个",
        points: [
          "被动语态 = be + 过去分词，时态和单复数变化都放在 be 上。",
          "一般现在时：am/is/are + done；一般过去时：was/were + done。",
        ],
      },
      {
        title: "三、主动句变被动句",
        points: [
          "把主动句宾语移到前面作新主语，选择正确的 be，把动词变过去分词。",
          "原主语需要说明时放到 by 后；不知道或不重要时可以省略。",
        ],
      },
      {
        title: "四、做题检查法",
        points: [
          "先找动作，再看主语能否主动完成它；room 不能自己 clean，所以要用 is cleaned。",
          "口诀：承受动作是被动，be 加过去分词；时间看 be，动作看 done。",
        ],
      },
    ],
  },
  过去进行时: {
    knowledge: [
      {
        title: "一、把时间停在过去某一刻",
        points: [
          "过去进行时表示过去某个时刻正在发生、尚未结束的动作。",
          "结构是 was/were + 动词-ing；I/he/she/it 用 was，you/we/they 用 were。",
        ],
      },
      {
        title: "二、时间标志和画面",
        points: [
          "at eight yesterday、at that time、from seven to nine last night 常提示过去进行。",
          "想象昨天八点拍下一张会动的照片，照片中正在做的事就是过去进行。",
        ],
      },
      {
        title: "三、when 和 while 怎样搭配",
        points: [
          "持续动作常用过去进行，突然发生的短动作常用一般过去：I was sleeping when the phone rang。",
          "while 常连接两个同时持续的动作：Mum was cooking while I was reading。",
        ],
      },
      {
        title: "四、口诀与易错点",
        points: [
          "过去某刻正在做，was/were 后 ing；长动作进行中，短动作突然来。",
          "不能写 We was playing，也不能漏掉 was/were。",
        ],
      },
    ],
  },
  动词形式辨析: {
    knowledge: [
      {
        title: "一、doing 和 to do 不是随便替换",
        points: [
          "to do 常指尚未发生、计划或努力完成的动作；doing 常指已经发生、持续或作为一种活动。",
          "判断时要看动作先后，不要只看前面动词的中文。",
        ],
      },
      {
        title: "二、三组高频辨析",
        points: [
          "try to do 努力做，try doing 试用某方法；remember to do 记得要做，remember doing 记得做过。",
          "forget to do 忘了要做，forget doing 忘了做过；stop to do 停下来去做，stop doing 停止正在做。",
        ],
      },
      {
        title: "三、like 的两种形式",
        points: [
          "like doing 常强调一般爱好；like to do 可强调某次选择或认为这样做合适。",
          "初中题目应结合具体语境，不要机械认定只有一种形式。",
        ],
      },
      {
        title: "四、时间线做题法",
        points: [
          "在草稿上标“已发生/未发生”“停止A/去做B”“努力/试方法”，再选 doing 或 to do。",
        ],
      },
    ],
  },
  "形容词短语与 enough": {
    knowledge: [
      {
        title: "一、enough 的位置取决于修饰谁",
        points: [
          "修饰名词时放名词前：enough time、enough money。",
          "修饰形容词或副词时放后面：old enough、quickly enough。",
        ],
      },
      {
        title: "二、enough to do 表示“足够……去做”",
        points: [
          "形容词 + enough + to do：He is old enough to travel alone。",
          "如果不够，使用 not + 形容词 + enough + to do。",
        ],
      },
      {
        title: "三、与 too...to...对比",
        points: [
          "too + 形容词 + to do 表示“太……而不能……”。",
          "not old enough to go 可与 too young to go 表达相近含义。",
        ],
      },
      {
        title: "四、位置口诀",
        points: [
          "enough 修名词往前站，修形副词往后站；足够去做 enough to，太而不能 too to。",
        ],
      },
    ],
  },
  比较级拓展: {
    knowledge: [
      {
        title: "一、“越来越”怎样表达",
        points: [
          "短词用 比较级 + and + 比较级：colder and colder。",
          "长词用 more and more + 原级：more and more beautiful。",
        ],
      },
      {
        title: "二、“越……越……”怎样表达",
        points: [
          "the + 比较级，the + 比较级：The more you read, the more you learn。",
          "两个 the 都不能漏，后半句仍要有完整的主语和谓语。",
        ],
      },
      {
        title: "三、比较级还能表示最高含义",
        points: [
          "比较级 + than any other + 单数名词，表示同一范围内“比其他任何一个都……”。",
          "China is larger than any other country in Asia。",
        ],
      },
      {
        title: "四、易错口诀",
        points: [
          "短词 er and er，长词 more and more；越来前后两个 the，比较范围要看清。",
          "不能写 more and more easier。",
        ],
      },
    ],
  },
  初中核心时态整合: {
    knowledge: [
      {
        title: "一、不要先猜时态，先画时间线",
        points: [
          "一般现在看习惯事实；现在进行看此刻正在；一般过去看过去已结束。",
          "过去进行看过去某刻正在；一般将来看未来；现在完成看过去与现在的联系。",
        ],
      },
      {
        title: "二、时间词只是提示，不是答案",
        points: [
          "every day 常提示一般现在，now 提示现在进行，yesterday 提示一般过去。",
          "tomorrow 提示一般将来，at eight yesterday 提示过去进行，so far/for/since 常提示现在完成。",
        ],
      },
      {
        title: "三、同一句中也可能出现多个时态",
        points: [
          "She usually walks, but today she is taking a bus：习惯用一般现在，今天此刻用现在进行。",
          "When I arrived, they were eating：短动作一般过去，背景长动作过去进行。",
        ],
      },
      {
        title: "四、六步检查法",
        points: [
          "圈时间词；确定时间点；判断动作完成、正在还是持续；选结构；按主语变动词；最后检查否定和疑问。",
          "口诀：时间、状态、联系，三样一起定时态；标志词只做提示，上下文才是答案。",
        ],
      },
    ],
  },
};
const grade8Example = (
  sentence,
  translation,
  note,
  highlights,
  tone = "correct"
) => ({
  highlights,
  examples: [{ sentence, translation, note, highlights, tone }],
});
const grade8ExampleGuides = {
  一般将来时: [
    grade8Example(
      "We will visit the zoo tomorrow.",
      "我们明天会参观动物园。",
      "tomorrow 表示事情还没有发生。",
      ["will visit", "tomorrow"]
    ),
    grade8Example(
      "The phone is ringing. I'll answer it. / We are going to visit Grandma on Sunday.",
      "电话响了，我来接。/我们打算周日看望奶奶。",
      "will 表示临时决定；be going to 表示提前计划。",
      ["I'll answer", "are going to visit"],
      "contrast"
    ),
    grade8Example(
      "She won't come. / Will she come? / Is she going to come?",
      "她不会来。/她会来吗？/她打算来吗？",
      "will 的变化围绕 will；going to 的变化围绕 be。",
      ["won't", "Will", "Is", "going to"],
      "contrast"
    ),
    grade8Example(
      "Look at the clouds! It is going to rain.",
      "看那些云！要下雨了。",
      "眼前已经有乌云这个迹象，选择 be going to。",
      ["is going to rain", "clouds"]
    ),
  ],
  情态动词深化: [
    grade8Example(
      "She can swim. You should rest. We must follow the rules.",
      "她会游泳。你应该休息。我们必须遵守规则。",
      "can、should、must 分别表示能力、建议和义务。",
      ["can", "should", "must"],
      "contrast"
    ),
    grade8Example(
      "I must finish it today. / I have to wear a uniform at school.",
      "我今天必须完成它。/学校规定我必须穿校服。",
      "must 偏说话者要求；have to 偏外部规则。",
      ["must", "have to"],
      "contrast"
    ),
    grade8Example(
      "You mustn't swim here. / You don't have to come early.",
      "你禁止在这里游泳。/你不必早来。",
      "mustn't 是禁止；don't have to 是没有必要。",
      ["mustn't", "don't have to"],
      "contrast"
    ),
    grade8Example(
      "Must I finish now? — No, you needn't.",
      "我必须现在完成吗？——不，你不必。",
      "Must I...? 的否定回答不能使用 mustn't。",
      ["Must I", "needn't"]
    ),
  ],
  "形容词、副词比较等级": [
    grade8Example(
      "Tom is tall. Tom is taller than Jack. Tom is the tallest in his class.",
      "汤姆很高。汤姆比杰克高。汤姆是班里最高的。",
      "一个对象用原级、两个对象用比较级、三个以上用最高级。",
      ["tall", "taller than", "the tallest"],
      "contrast"
    ),
    grade8Example(
      "large → larger → largest; easy → easier → easiest",
      "大→更大→最大；容易→更容易→最容易。",
      "观察 e 结尾和辅音+y结尾的不同变化。",
      ["larger", "largest", "easier", "easiest"]
    ),
    grade8Example(
      "This book is better, but that one is the best.",
      "这本书更好，但那本最好。",
      "good 的比较级和最高级是不规则变化 better、best。",
      ["better", "the best"],
      "contrast"
    ),
    grade8Example(
      "This question is much easier. √  This question is more easier. ×",
      "这道题容易得多。",
      "easier 已经是比较级，前面不能再加 more。",
      ["much easier", "more easier"],
      "wrong"
    ),
  ],
  同级比较: [
    grade8Example(
      "Amy is as tall as Lily.",
      "埃米和莉莉一样高。",
      "as...as 表示两者程度相同。",
      ["as tall as"]
    ),
    grade8Example(
      "This box is not as heavy as that one.",
      "这个箱子不如那个重。",
      "not as...as 表示前者不如后者。",
      ["not as heavy as"],
      "contrast"
    ),
    grade8Example(
      "Amy writes as carefully as Lily.",
      "埃米写得和莉莉一样认真。",
      "carefully 修饰动作 writes，所以使用副词。",
      ["writes", "as carefully as"]
    ),
    grade8Example(
      "He is as tall as Tom. √  He is as taller as Tom. ×",
      "他和汤姆一样高。",
      "两个 as 中间必须使用原级 tall。",
      ["as tall as", "as taller as"],
      "wrong"
    ),
  ],
  复合不定代词: [
    grade8Example(
      "Someone is waiting. Something happened.",
      "有人在等。发生了某件事。",
      "-one 指人，-thing 指事物。",
      ["Someone", "Something"],
      "contrast"
    ),
    grade8Example(
      "I saw someone. / I didn't see anyone.",
      "我看见了某人。/我没有看见任何人。",
      "肯定句常用 some 系列，否定句常用 any 系列。",
      ["someone", "anyone"],
      "contrast"
    ),
    grade8Example(
      "Everyone is ready. I have something important to say.",
      "每个人都准备好了。我有重要的事情要说。",
      "everyone 按单数；形容词 important 放在 something 后。",
      ["Everyone is", "something important"]
    ),
    grade8Example(
      "something interesting √  interesting something ×",
      "有趣的事情。",
      "口诀：复合不定代词在前，形容词往后站。",
      ["something interesting", "interesting something"],
      "wrong"
    ),
  ],
  动词不定式固定搭配: [
    grade8Example(
      "We plan to visit the museum. She hopes to win.",
      "我们计划参观博物馆。她希望获胜。",
      "plan、hope 后面常接 to do。",
      ["plan to visit", "hopes to win"]
    ),
    grade8Example(
      "He stopped talking. / He stopped to drink water.",
      "他停止说话。/他停下来去喝水。",
      "stop doing 是停止原动作；stop to do 是停下去做另一件事。",
      ["stopped talking", "stopped to drink"],
      "contrast"
    ),
    grade8Example(
      "Remember to lock the door. / I remember locking it.",
      "记得去锁门。/我记得锁过门。",
      "to do 表示动作还没发生；doing 表示动作已经发生。",
      ["to lock", "locking"],
      "contrast"
    ),
    grade8Example(
      "Please remember to bring your book.",
      "请记得带书。",
      "先判断动作尚未发生，再选择 remember to do。",
      ["remember to bring"]
    ),
  ],
  并列句与连词: [
    grade8Example(
      "She is kind and helpful. He is tired but happy.",
      "她善良而且乐于助人。他很累但很开心。",
      "and 表并列，but 表转折。",
      ["and", "but"],
      "contrast"
    ),
    grade8Example(
      "It was raining. However, we went out.",
      "当时下雨了，不过我们还是出去了。",
      "however 常另起一句，并用逗号隔开。",
      ["However"]
    ),
    grade8Example(
      "Because it rained, we stayed home. / It rained, so we stayed home.",
      "因为下雨，我们待在家。/下雨了，所以我们待在家。",
      "because 和 so 选择一个即可。",
      ["Because", "so"],
      "contrast"
    ),
    grade8Example(
      "Hurry up, or you will miss the bus.",
      "快一点，否则你会错过公交车。",
      "or 在这里不是选择，而是表示“否则”。",
      ["or"]
    ),
  ],
  疑问词组: [
    grade8Example(
      "How many books do you have? / How much water do you need?",
      "你有多少本书？/你需要多少水？",
      "many 接可数复数，much 接不可数名词。",
      ["How many", "books", "How much", "water"],
      "contrast"
    ),
    grade8Example(
      "How far is the station? — Two kilometres.",
      "车站有多远？——两千米。",
      "回答是距离，所以使用 how far。",
      ["How far", "Two kilometres"]
    ),
    grade8Example(
      "How long did you stay? / How often do you exercise? / How soon will you return?",
      "你待了多久？/你多久锻炼一次？/你多久以后回来？",
      "分别询问时长、频率和多久以后。",
      ["How long", "How often", "How soon"],
      "contrast"
    ),
    grade8Example(
      "In two days. → How soon?  For two days. → How long?",
      "两天以后对应多久以后；持续两天对应多长时间。",
      "重点观察回答使用 in 还是 for。",
      ["In two days", "How soon", "For two days", "How long"],
      "contrast"
    ),
  ],
  反身代词: [
    grade8Example(
      "She taught herself English.",
      "她自学英语。",
      "she 发出动作，动作又回到她自己身上，使用 herself。",
      ["She", "herself"]
    ),
    grade8Example(
      "I made it myself. / We made it ourselves.",
      "我亲自做的。/我们亲自做的。",
      "单数用 -self，复数用 -selves。",
      ["myself", "ourselves"],
      "contrast"
    ),
    grade8Example(
      "Please help yourself. The children enjoyed themselves.",
      "请自便。孩子们玩得很开心。",
      "固定搭配也要根据主语改变反身代词。",
      ["help yourself", "enjoyed themselves"]
    ),
    grade8Example(
      "We enjoyed ourselves. √  We enjoyed myself. ×",
      "我们玩得很开心。",
      "主语 we 必须和复数反身代词 ourselves 对应。",
      ["We", "ourselves", "myself"],
      "wrong"
    ),
  ],
  可数与不可数名词量化: [
    grade8Example(
      "I have two books. We need some water.",
      "我有两本书。我们需要一些水。",
      "books 可以逐个数；water 通常不能直接数。",
      ["two books", "some water"],
      "contrast"
    ),
    grade8Example(
      "two pieces of paper; three bottles of water",
      "两张纸；三瓶水。",
      "数量大于一时，变化的是单位词 pieces、bottles。",
      ["two pieces", "three bottles"]
    ),
    grade8Example(
      "many apples / much milk / a few books / a little rice",
      "许多苹果/许多牛奶/几本书/一点米饭。",
      "many、a few 配可数；much、a little 配不可数。",
      ["many apples", "much milk", "a few books", "a little rice"],
      "contrast"
    ),
    grade8Example(
      "two pieces of bread √  two breads ×",
      "两片面包。",
      "bread 是不可数名词，需要借助单位 piece。",
      ["two pieces of bread", "two breads"],
      "wrong"
    ),
  ],
  现在完成时: [
    grade8Example(
      "I have finished my homework.",
      "我已经完成作业了。",
      "动作发生在过去，但重点是现在作业已经完成。",
      ["have finished"]
    ),
    grade8Example(
      "I have finished my homework. / I have been to Beijing. / I have lived here for five years.",
      "我已完成作业。/我去过北京。/我在这里住了五年。",
      "三句分别表示现在结果、过去经历和持续到现在。",
      ["have finished", "have been to", "have lived"],
      "contrast"
    ),
    grade8Example(
      "She has already left. / Has she left yet? / She hasn't left yet.",
      "她已经离开。/她已经离开了吗？/她还没离开。",
      "already 常在肯定句；yet 常在疑问句和否定句。",
      ["already", "yet", "hasn't"],
      "contrast"
    ),
    grade8Example(
      "Tom has gone to Beijing. Lucy has been to Beijing twice. She has been in Beijing for a year.",
      "汤姆去了北京未回；露西去过北京两次；她在北京待了一年。",
      "判断人现在是否回来以及是否强调持续时间。",
      ["has gone to", "has been to", "has been in"],
      "contrast"
    ),
    grade8Example(
      "I saw the film yesterday. / I have seen the film twice.",
      "我昨天看了电影。/我已经看过这部电影两次。",
      "明确过去时间用一般过去时；强调截至现在的经历用现在完成时。",
      ["yesterday", "saw", "have seen"],
      "contrast"
    ),
  ],
  状语从句: [
    grade8Example(
      "I will call you when I arrive.",
      "我到达时会给你打电话。",
      "when I arrive 给主句补充时间背景。",
      ["when I arrive"]
    ),
    grade8Example(
      "Stay where I can see you. / I will go if it is sunny. / We stayed because it rained.",
      "待在我能看见你的地方。/如果天晴我就去。/因为下雨我们留下了。",
      "分别展示地点、条件和原因三种关系。",
      ["where", "if", "because"],
      "contrast"
    ),
    grade8Example(
      "I will call when I arrive. / We will stay home if it rains. / Although it rained, we went out.",
      "我到达时会打电话。/如果下雨我们会待在家。/尽管下雨我们仍出门。",
      "本阶段重点看时间、条件和让步关系。",
      ["when", "if", "Although"],
      "contrast"
    ),
    grade8Example(
      "Sit where you can see clearly. / Speak slowly so that everyone can understand. / He was so tired that he slept.",
      "坐在看得清的地方。/说慢些以便大家听懂。/他太累所以睡着了。",
      "依次表示地点、目的和结果。",
      ["where", "so that", "so tired that"],
      "contrast"
    ),
    grade8Example(
      "Tom runs faster than I do. / Do it as I showed you.",
      "汤姆跑得比我快。/按照我演示的方法做。",
      "than 引出比较；as 引出做事方式。",
      ["than", "as"],
      "contrast"
    ),
    grade8Example(
      "I will call you when I arrive. √  when I will arrive ×",
      "我到达时会给你打电话。",
      "时间从句谈将来时使用一般现在时。",
      ["will call", "when I arrive", "when I will arrive"],
      "wrong"
    ),
    grade8Example(
      "Because it rained, we stayed home. / Although it rained, we went out.",
      "因为下雨我们待在家。/尽管下雨我们仍出门。",
      "because 不再搭配 so；although 不再搭配 but。",
      ["Because", "Although", "so", "but"],
      "contrast"
    ),
    grade8Example(
      "We will stay home if it rains.",
      "如果下雨，我们会待在家。",
      "圈出 if，找到从句 it rains，再判断它补充的是条件背景。",
      ["if", "it rains"]
    ),
  ],
  情态动词表示推测: [
    grade8Example(
      "The light is on. He must be home.",
      "灯亮着，他一定在家。",
      "有充分证据时使用 must 表示肯定推测。",
      ["must be", "light is on"]
    ),
    grade8Example(
      "She may know the answer. / She might know the answer.",
      "她可能知道答案。",
      "没有充分证据，只表示可能时用 may 或 might。",
      ["may", "might"],
      "contrast"
    ),
    grade8Example(
      "He can't be Tom. Tom is abroad. / You mustn't park here.",
      "他不可能是汤姆，汤姆在国外。/这里禁止停车。",
      "can't 表不可能；mustn't 表禁止。",
      ["can't be", "mustn't"],
      "contrast"
    ),
    grade8Example(
      "His name is on the bag. It must be his.",
      "包上有他的名字，这一定是他的。",
      "先找证据，再判断把握程度。",
      ["name", "must be"]
    ),
  ],
  宾语从句入门: [
    grade8Example(
      "I think that he is right.",
      "我认为他是对的。",
      "that he is right 是 think 的内容，整体作宾语。",
      ["think", "that he is right"]
    ),
    grade8Example(
      "I know that he came. / I wonder whether he came. / I know where he went.",
      "我知道他来了。/我想知道他是否来了。/我知道他去哪里了。",
      "陈述用 that，是否用 whether，具体信息保留 where。",
      ["that", "whether", "where"],
      "contrast"
    ),
    grade8Example(
      "Do you know where she lives? √  where does she live ×",
      "你知道她住在哪里吗？",
      "疑问进入从句后恢复“主语+谓语”的陈述语序。",
      ["where she lives", "where does she live"],
      "wrong"
    ),
    grade8Example(
      "She said she was tired. / The teacher said the earth goes around the sun.",
      "她说她累了。/老师说地球绕太阳转。",
      "普通内容随过去主句后移；客观真理仍用一般现在时。",
      ["said", "was", "goes around"],
      "contrast"
    ),
    grade8Example(
      "Could you tell me when the train will arrive?",
      "你能告诉我火车什么时候到吗？",
      "先选 when，再使用陈述语序 the train will arrive。",
      ["when", "the train will arrive"]
    ),
  ],
  一般时态的被动语态: [
    grade8Example(
      "Workers built the bridge. / The bridge was built by workers.",
      "工人建了桥。/桥由工人建造。",
      "主语从执行者 workers 换成承受者 bridge。",
      ["built", "was built"],
      "contrast"
    ),
    grade8Example(
      "English is spoken here. / The bridge was built last year.",
      "这里使用英语。/这座桥去年建成。",
      "一般现在时用 is done；一般过去时用 was done。",
      ["is spoken", "was built"],
      "contrast"
    ),
    grade8Example(
      "Lu Xun wrote the story. → The story was written by Lu Xun.",
      "鲁迅写了这个故事。→故事由鲁迅创作。",
      "宾语 story 前移，按过去时选择 was，再把 write 变 written。",
      ["wrote", "was written"]
    ),
    grade8Example(
      "The room is cleaned every day. √  The room cleans every day. ×",
      "房间每天被打扫。",
      "room 不能主动打扫自己，它是动作承受者。",
      ["is cleaned", "cleans"],
      "wrong"
    ),
  ],
  过去进行时: [
    grade8Example(
      "I was reading at eight yesterday.",
      "昨天八点我正在阅读。",
      "把时间停在昨天八点，动作当时正在进行。",
      ["was reading", "at eight yesterday"]
    ),
    grade8Example(
      "They were playing from seven to nine.",
      "七点到九点他们一直在玩。",
      "一段过去时间内持续进行的动作使用 were playing。",
      ["were playing", "from seven to nine"]
    ),
    grade8Example(
      "I was sleeping when the phone rang. / Mum was cooking while I was reading.",
      "电话响时我正在睡觉。/妈妈做饭时我正在读书。",
      "when 常连接长动作和突然短动作；while 可连接两个持续动作。",
      ["was sleeping", "rang", "while", "was reading"],
      "contrast"
    ),
    grade8Example(
      "We were playing. √  We was playing. ×",
      "我们当时正在玩。",
      "主语 we 后必须使用 were。",
      ["were playing", "was playing"],
      "wrong"
    ),
  ],
  动词形式辨析: [
    grade8Example(
      "I want to learn English. / I enjoy learning English.",
      "我想学英语。/我喜欢学习英语。",
      "尚未发生的目标常用 to do；作为活动常用 doing。",
      ["to learn", "learning"],
      "contrast"
    ),
    grade8Example(
      "Try to open the box. / Try opening it with this key.",
      "努力打开箱子。/试试用这把钥匙打开。",
      "try to do 是努力做；try doing 是尝试一种方法。",
      ["Try to open", "Try opening"],
      "contrast"
    ),
    grade8Example(
      "I like reading. / I like to read before bed.",
      "我喜欢阅读。/我喜欢睡前阅读。",
      "doing 常强调一般爱好；to do 可强调具体习惯或选择。",
      ["like reading", "like to read"],
      "contrast"
    ),
    grade8Example(
      "Remember to call Mum. / I remember calling Mum.",
      "记得给妈妈打电话。/我记得给妈妈打过电话。",
      "先判断动作还没做还是已经做过。",
      ["to call", "calling"],
      "contrast"
    ),
  ],
  "形容词短语与 enough": [
    grade8Example(
      "We have enough time. / We have enough money.",
      "我们有足够的时间。/我们有足够的钱。",
      "enough 修饰名词时放在名词前。",
      ["enough time", "enough money"]
    ),
    grade8Example(
      "He is old enough to travel alone.",
      "他年龄足够大，可以独自旅行。",
      "enough 修饰形容词 old 时放在形容词后。",
      ["old enough", "to travel"]
    ),
    grade8Example(
      "He is not old enough to drive. / He is too young to drive.",
      "他年龄不够大，不能开车。/他太年轻，不能开车。",
      "not...enough 与 too...to 可以表达相近意思。",
      ["not old enough", "too young to"],
      "contrast"
    ),
    grade8Example(
      "large enough √  enough large ×",
      "足够大。",
      "enough 修饰形容词时必须后置。",
      ["large enough", "enough large"],
      "wrong"
    ),
  ],
  比较级拓展: [
    grade8Example(
      "The weather is getting colder and colder.",
      "天气变得越来越冷。",
      "短形容词使用比较级 + and + 比较级。",
      ["colder and colder"]
    ),
    grade8Example(
      "The city is becoming more and more beautiful.",
      "这座城市变得越来越美丽。",
      "长形容词使用 more and more + 原级。",
      ["more and more beautiful"]
    ),
    grade8Example(
      "The more you read, the more you learn.",
      "你读得越多，学得越多。",
      "两个 the + 比较级构成“越……越……”。",
      ["The more", "the more"],
      "contrast"
    ),
    grade8Example(
      "easier and easier √  more and more easier ×",
      "越来越容易。",
      "短词已有比较级 easier，不能再加 more。",
      ["easier and easier", "more and more easier"],
      "wrong"
    ),
  ],
  初中核心时态整合: [
    grade8Example(
      "She walks every day. She is walking now. She walked yesterday.",
      "她每天走路。她现在正在走。她昨天走了。",
      "同一动作放在习惯、此刻和过去三个时间区域。",
      ["walks", "is walking", "walked"],
      "contrast"
    ),
    grade8Example(
      "I have lived here for five years.",
      "我在这里住了五年。",
      "动作从过去开始并持续到现在，不能只看时间词机械判断。",
      ["have lived", "for five years"]
    ),
    grade8Example(
      "She usually walks, but today she is taking a bus.",
      "她通常步行，但今天正在坐公交。",
      "一个句子中可同时出现习惯和当前临时动作。",
      ["usually walks", "is taking"],
      "contrast"
    ),
    grade8Example(
      "I was reading when he called. / I have read the book twice.",
      "他打电话时我正在阅读。/这本书我读过两次。",
      "先确定时间，再判断动作是正在进行还是与现在有联系。",
      ["was reading", "called", "have read"],
      "contrast"
    ),
  ],
};
Object.entries(grade8ExampleGuides).forEach(([title, guides]) => {
  const lesson = grade8GrammarEnhancements[title];
  if (!lesson) return;
  lesson.knowledge = lesson.knowledge.map((section, index) => ({
    ...section,
    ...guides[index],
  }));
});
const grade9GrammarEnhancements = {
  现在完成时深化: {
    knowledge: [
      {
        title: "一、先画“从过去延伸到现在”的线",
        points: [
          "for 和 since 表示动作或状态持续到现在，时间线不能在过去突然断掉。",
          "for 后接一段时间，since 后接起点或过去时小句。",
        ],
      },
      {
        title: "二、短暂动作为什么不能直接拉长",
        points: [
          "leave、arrive、buy、borrow 等动作瞬间完成，不能直接持续 two years。",
          "要把瞬间动作换成可持续状态：leave → be away，arrive → be in，buy → have，borrow → keep。",
        ],
      },
      {
        title: "三、高频转换按含义成组",
        points: [
          "begin/start → be on，die → be dead，join → be a member of，marry → be married。",
          "open/close 常转换为 be open/be closed；动作变状态后再接 for/since。",
        ],
      },
      {
        title: "四、完成时三个地点结构",
        points: [
          "have been to 去过且回来；have gone to 去了未回；have been in 在某地持续一段时间。",
          "判断依据是“人现在在哪里”，不是只翻译“去”。",
        ],
      },
      {
        title: "五、考试陷阱与转换步骤",
        points: [
          "看到 for/since 先圈时间段，再检查谓语能否持续；不能持续就做意义等值转换。",
          "He has left for two days ×；He has been away for two days √。",
        ],
      },
    ],
  },
  过去完成时: {
    knowledge: [
      {
        title: "一、先找到两个过去时间点",
        highlights: ["过去完成时", "had left", "arrived"],
        points: [
          "过去完成时不是单纯“很久以前”，而是两个过去事件中较早发生的一个。",
          "时间线：火车先离开 had left → 我们后到达 arrived → 现在。",
        ],
        examples: [
          {
            label: "先发生 → 后发生",
            sentence: "The train had left before we arrived.",
            translation: "我们到达以前，火车已经离开了。",
            note: "had left 发生在 arrived 之前。",
            highlights: ["had left", "arrived"],
            tone: "correct",
          },
          {
            label: "再看一组",
            sentence: "She had finished dinner before her friend called.",
            translation: "朋友打电话前，她已经吃完晚饭了。",
            note: "先吃完 had finished，后接到电话 called。",
            highlights: ["had finished", "called"],
            tone: "correct",
          },
        ],
      },
      {
        title: "二、结构和判断核心",
        highlights: ["had + 过去分词", "过去完成时", "一般过去时"],
        points: [
          "结构是 had + 过去分词，所有人称都用 had。",
          "先发生的动作可能用过去完成时，作为参照的后发生动作通常用一般过去时。",
        ],
        examples: [
          {
            label: "结构拆解",
            sentence: "They had completed the work before noon.",
            translation: "中午以前，他们已经完成了工作。",
            note: "They + had + completed（过去分词）。",
            highlights: ["had completed"],
            tone: "correct",
          },
          {
            label: "错误对比",
            sentence: "They had complete the work. ×",
            translation: "had 后不能使用动词原形。",
            note: "应改为：They had completed the work. √",
            highlights: ["had complete", "had completed"],
            tone: "wrong",
          },
        ],
      },
      {
        title: "三、常见时间路标",
        highlights: [
          "by the time",
          "before",
          "after",
          "when",
          "already",
          "had finished",
        ],
        points: [
          "by the time、before、after、when、already 常帮助建立先后关系。",
          "by + 过去时间表示“到过去某时为止”，常搭配过去完成时。",
        ],
        examples: [
          {
            label: "by the time",
            sentence: "By the time Mum came home, I had finished my homework.",
            translation: "妈妈到家时，我已经完成作业了。",
            highlights: ["By the time", "had finished"],
            tone: "contrast",
          },
          {
            label: "by + 过去时间",
            sentence: "By 2020, she had written three books.",
            translation: "到2020年为止，她已经写了三本书。",
            highlights: ["By 2020", "had written"],
            tone: "contrast",
          },
        ],
      },
      {
        title: "四、不要见到两个过去就机械使用",
        highlights: ["before", "after", "一般过去时", "过去完成时"],
        points: [
          "若 before/after 已把顺序说得非常清楚，日常表达有时两个动作都可用一般过去时。",
          "只有一个孤立的过去动作，没有过去参照点时，通常不用过去完成时。",
        ],
        examples: [
          {
            label: "顺序已经清楚",
            sentence: "After he finished his homework, he went out.",
            translation: "他完成作业后出去了。",
            note: "after 已明确先后，两个动作都用一般过去时也很自然。",
            highlights: ["finished", "went out"],
            tone: "contrast",
          },
          {
            label: "只有一个过去动作",
            sentence: "I visited the museum yesterday.",
            translation: "我昨天参观了博物馆。",
            note: "没有另一个过去参照点，不需要使用过去完成时。",
            highlights: ["visited", "yesterday"],
            tone: "contrast",
          },
        ],
      },
      {
        title: "五、时间导演做题法",
        highlights: ["had started", "started", "When I arrived"],
        points: [
          "把两个事件写在时间线上，标出谁先谁后，再给较早事件选择 had done。",
          "陷阱：When I arrived, the class had started 强调到达前已经开始；started 表示到达时才开始。",
        ],
        examples: [
          {
            label: "到达前已经开始",
            sentence: "When I arrived, the class had started.",
            translation: "我到达时，课已经开始了。",
            note: "顺序：上课开始 → 我到达。",
            highlights: ["arrived", "had started"],
            tone: "correct",
          },
          {
            label: "到达时才开始",
            sentence: "When I arrived, the class started.",
            translation: "我到达时，课开始了。",
            note: "两个动作几乎同时发生，意思与上一句不同。",
            highlights: ["arrived", "started"],
            tone: "contrast",
          },
        ],
      },
    ],
  },
  被动语态完整体系: {
    knowledge: [
      {
        title: "一、先把镜头转向动作承受者",
        points: [
          "主动语态关注谁做事，被动语态关注谁被影响。",
          "Workers built the bridge → The bridge was built；主角换了，事件时间不能换。",
        ],
      },
      {
        title: "二、所有被动共用一个核心",
        points: [
          "公式始终是 be + 过去分词；时态变化装在 be 上。",
          "is done、was done、will be done、has been done、is being done、must be done。",
        ],
      },
      {
        title: "三、主动变被动的角色换位",
        points: [
          "找谓语、找执行者、找承受者；把承受者移到句首。",
          "按原句时态选择 be，把动词改为过去分词；执行者重要时用 by 保留。",
        ],
      },
      {
        title: "四、特殊结构不能漏",
        points: [
          "make/see/hear sb do 变被动时要补回 to：He was made to wait。",
          "双宾语可选择其中一个作主语：I was given a gift / A gift was given to me。",
        ],
      },
      {
        title: "五、不能被动的动词",
        points: [
          "happen、take place、belong to 等通常没有被动语态。",
          "做题先问“主语是否承受动作”，再选时态，最后检查 be 和过去分词是否齐全。",
        ],
      },
    ],
  },
  宾语从句完整体系: {
    knowledge: [
      {
        title: "一、先确认小句在回答“动词什么内容”",
        points: [
          "think、know、ask、wonder 后的一整句话若作宾语，就是宾语从句。",
          "先划主句，再把剩余小句框起来，避免只看连接词猜从句。",
        ],
      },
      {
        title: "二、引导词是一张选择地图",
        points: [
          "陈述内容用 that；一般疑问意义用 if/whether；特殊疑问信息保留 wh- 词。",
          "介词后、to do 前或与 or not 连用时通常优先 whether。",
        ],
      },
      {
        title: "三、疑问进入从句必须“站回正常队形”",
        points: [
          "宾语从句使用陈述语序：疑问词 + 主语 + 谓语。",
          "where is he ×；where he is √。",
        ],
      },
      {
        title: "四、时态呼应不是机械后退",
        points: [
          "主句现在时，从句按事实选；主句过去时，从句通常向过去移动。",
          "客观真理、自然规律仍用一般现在时。",
        ],
      },
      {
        title: "五、否定转移和考试检查表",
        points: [
          "I don't think he is right 比 I think he isn't right 更常见。",
          "检查顺序：功能 → 引导词 → 陈述语序 → 时态 → 否定位置。",
        ],
      },
    ],
  },
  定语从句: {
    knowledge: [
      {
        title: "一、用两个简单句搭出定语从句",
        points: [
          "I know the girl. The girl is singing. 两句重复 the girl。",
          "保留先行词，用 who 代替从句中的重复部分：I know the girl who is singing。",
        ],
      },
      {
        title: "二、关系词要完成两份工作",
        points: [
          "它向前指先行词，同时在从句中作主语、宾语或定语。",
          "指人常用 who/whom，指物常用 which，人或物可用 that，所属关系用 whose。",
        ],
      },
      {
        title: "三、先看成分再选关系词",
        points: [
          "从句缺主语或宾语用关系代词；从句成分完整但缺地点、时间或原因状语，用 where、when、why。",
          "不能只凭先行词是 place 就一定选 where。",
        ],
      },
      {
        title: "四、that 优先与关系词省略",
        points: [
          "先行词被最高级、序数词、all、only 等修饰时常优先用 that。",
          "关系代词作宾语时有时可省略，作主语时不能省略。",
        ],
      },
      {
        title: "五、拼装和排错步骤",
        points: [
          "找重复名词 → 确定先行词 → 判断从句缺什么 → 选关系词 → 删除重复成分。",
          "The girl who she won ×：who 已作主语，不能再保留 she。",
        ],
      },
    ],
  },
  状语从句深化: {
    knowledge: [
      {
        title: "一、先按逻辑关系选路",
        points: [
          "时间、地点、条件、原因、目的、结果、让步、比较、方式是九类状语从句。",
          "进阶题先问从句与主句是什么逻辑，不要只凭一个中文词选连接词。",
        ],
      },
      {
        title: "二、目的与结果是本课核心对比",
        points: [
          "目的回答“为了什么”，常用 so that/in order that，常搭配 can/could/will。",
          "结果回答“实际造成什么”，常用 so...that 或 such...that。",
        ],
      },
      {
        title: "三、so 和 such 看后面中心",
        points: [
          "so + 形容词/副词 + that：so tired that；so many/few + 复数名词。",
          "such + (a/an) + 形容词 + 名词 + that：such a difficult problem that。",
        ],
      },
      {
        title: "四、时间条件与让步陷阱",
        points: [
          "时间、条件从句谈将来仍常用一般现在时；unless 已含否定。",
          "although/though 不与 but 重复；even if 强调即使条件成立，主句仍不变。",
        ],
      },
      {
        title: "五、逻辑诊断步骤",
        points: [
          "圈连接词 → 划从句边界 → 给关系命名 → 检查时态 → 对比目的或真实结果。",
          "把从句改写成“为了……”或“结果……”能帮助区分目的和结果。",
        ],
      },
    ],
  },
  直接引语与间接引语: {
    knowledge: [
      {
        title: "一、把自己变成转述者",
        points: [
          "直接引语原样引用说话人的话；间接引语由转述者重新说明内容。",
          "转述不是机械去引号，需要重新确定谁说、对谁说、什么时候说。",
        ],
      },
      {
        title: "二、人称跟着角色换",
        points: [
          "第一人称通常随原说话者变化，第二人称随原听话者变化，第三人称多保持。",
          "先在原句旁写出人物关系，再替换 I、you、my 等。",
        ],
      },
      {
        title: "三、时态和时间地点后移",
        points: [
          "过去时转述时，am/is → was，are → were，will → would，have done → had done。",
          "now → then，today → that day，tomorrow → the next day，here → there。",
        ],
      },
      {
        title: "四、不同句型的转述方式",
        points: [
          "陈述句常用 said that；一般疑问句用 asked if/whether；特殊疑问句保留疑问词。",
          "命令请求常用 told/asked + 人 + to do。",
        ],
      },
      {
        title: "五、不是所有时态都必须后移",
        points: [
          "客观真理、仍然成立的事实或主句为现在时，可不后移。",
          "转换检查：人物视角、句型、语序、时态、时间地点五项逐个核对。",
        ],
      },
    ],
  },
  时态综合辨析: {
    knowledge: [
      {
        title: "一、建立七条时间轨道",
        points: [
          "一般现在看习惯事实；现在进行看此刻；一般过去看过去结束；过去进行看过去某刻。",
          "一般将来看未来；现在完成连接过去和现在；过去完成表示过去参照点之前。",
        ],
      },
      {
        title: "二、判断时态的三个问题",
        points: [
          "动作在哪个时间区域？动作是完成、正在还是持续？它与另一个时间点有什么关系？",
          "只有同时回答时间、状态和联系，才能稳定选对时态。",
        ],
      },
      {
        title: "三、同一语境中的时态切换",
        points: [
          "I have lived here since I came：主句持续到现在，从句是过去起点。",
          "She was cooking when I called：背景动作正在进行，短动作突然发生。",
        ],
      },
      {
        title: "四、标志词只能当路标",
        points: [
          "since 常提示完成时，但 since 从句本身常用一般过去时。",
          "when 可搭配多种时态，必须看两个动作的先后和长短。",
        ],
      },
      {
        title: "五、考场决策流程",
        points: [
          "圈时间信息 → 画时间线 → 标动作状态 → 找参照事件 → 根据主语完成动词变化。",
          "最后把选项放回完整语境朗读，检查意义而不只检查形式。",
        ],
      },
    ],
  },
  被动语态综合辨析: {
    knowledge: [
      {
        title: "一、主动还是被动先看角色关系",
        points: [
          "主语能主动完成动作就考虑主动；主语是动作承受者才考虑被动。",
          "不要一看到 by 就猜被动，也不要一看到物作主语就必选被动。",
        ],
      },
      {
        title: "二、先定时态再造被动",
        points: [
          "一般现在 is/are done；一般过去 was/were done；一般将来 will be done。",
          "现在完成 have/has been done；情态动词 modal + be done。",
        ],
      },
      {
        title: "三、主动与被动放进同一时间轴",
        points: [
          "People plant trees every year → Trees are planted every year。",
          "People have planted trees since last year → Trees have been planted since last year。",
        ],
      },
      {
        title: "四、无被动和看似被动",
        points: [
          "happen、take place、belong to 通常无被动；sell、wash 等有时主动形式表达被动含义。",
          "The book sells well 强调书好卖，不写 is sold well 表同一含义。",
        ],
      },
      {
        title: "五、双重检查法",
        points: [
          "第一遍查角色：谁做、谁承受；第二遍查时间：be 用什么形式；最后查过去分词。",
        ],
      },
    ],
  },
  三类从句综合辨析: {
    knowledge: [
      {
        title: "一、不要看连接词，先看整块从句做什么",
        points: [
          "宾语从句充当动词的内容，定语从句修饰前面的名词，状语从句说明逻辑背景。",
          "同一个 when 可能引导宾语从句、定语从句或时间状语从句。",
        ],
      },
      {
        title: "二、用删除测试判断功能",
        points: [
          "删除宾语从句后，主句动词缺少“什么内容”；删除定语从句后，名词仍在但说明减少。",
          "删除状语从句后，主句仍完整，只是时间、条件或原因背景消失。",
        ],
      },
      {
        title: "三、三类从句的结构信号",
        points: [
          "宾语从句常跟 think/know/ask 后并用陈述语序。",
          "定语从句紧跟先行词，关系词在从句中承担成分；状语从句连接主句，表达九类逻辑关系。",
        ],
      },
      {
        title: "四、同词不同身份对比",
        points: [
          "I know when he came：when 从句作 know 的宾语。",
          "I remember the day when he came：修饰 day；I left when he came：说明离开的时间。",
        ],
      },
      {
        title: "五、判别流程",
        points: [
          "框出从句 → 找前面的动词或名词 → 尝试删除 → 判断句中工作 → 再检查连接词和语序。",
        ],
      },
    ],
  },
  情态动词终极考点: {
    knowledge: [
      {
        title: "一、先确定是在表达哪种语气",
        points: [
          "能力、许可、义务、建议、请求和推测是情态动词的六类核心任务。",
          "同一个 can/could 在不同语境中可能表示能力、许可或可能。",
        ],
      },
      {
        title: "二、推测要看证据强弱",
        points: [
          "肯定把握强用 must，可能用 may/might/could，否定把握强用 can't。",
          "推测现在用 modal + do/be，推测过去用 modal + have done。",
        ],
      },
      {
        title: "三、三个否定绝不能混",
        points: [
          "mustn't 是禁止，can't 是不可能，needn't 是不必。",
          "先翻译完整语气，再选词，不能只看到 not 的意思。",
        ],
      },
      {
        title: "四、need 的两种身份",
        points: [
          "作情态动词：need do、needn't do；作实义动词：need to do、needs、needed。",
          "Need I...? 可用 No, you needn't 回答。",
        ],
      },
      {
        title: "五、语气刻度做题法",
        points: [
          "标出证据、规定或说话态度，把语气放到“可能—确定”“建议—必须”“不必—禁止”刻度上再选择。",
        ],
      },
    ],
  },
  非谓语固定搭配: {
    knowledge: [
      {
        title: "一、一个简单句只有一个核心谓语名额",
        points: [
          "先找已经随主语和时态变化的谓语，其他动作需要变成 to do、doing 或 done 等非谓语形式。",
          "I want to play 中 want 占据谓语名额，play 变成 to play。",
        ],
      },
      {
        title: "二、按动作身份选择形式",
        points: [
          "to do 常表示目的、计划或尚未发生；doing 常表示活动、持续或主动；done 常表示完成或被动。",
          "先判断动作身份，再记固定搭配。",
        ],
      },
      {
        title: "三、固定搭配分组而不是散背",
        points: [
          "want/hope/decide/refuse/plan + to do。",
          "enjoy/practice/finish/mind/suggest + doing；make/let sb do。",
        ],
      },
      {
        title: "四、感官动词的视角差异",
        points: [
          "see/hear/watch sb do 强调动作全过程，doing 强调正在进行的片段。",
          "变被动时，省略的 to 要回来：He was seen to enter。",
        ],
      },
      {
        title: "五、动作身份检查表",
        points: [
          "找谓语名额 → 看动作先后 → 判断主动被动 → 查固定搭配 → 检查逻辑主语是否一致。",
        ],
      },
    ],
  },
  "连词、倒装与省略": {
    knowledge: [
      {
        title: "一、先分清连接关系",
        points: [
          "unless = if...not；not...until 表示直到某时才发生；since 可表示自从或因为。",
          "whenever 表示无论何时，连接词先决定前后逻辑。",
        ],
      },
      {
        title: "二、So do I 是“我也是”",
        points: [
          "肯定附和用 So + 助动词/be/情态动词 + 主语。",
          "前句否定时用 Neither/Nor + 助动词 + 主语。",
        ],
      },
      {
        title: "三、So I do 意思不同",
        points: [
          "So do I 是倒装，表示另一个人也如此；So I do 不倒装，表示“我的确如此”。",
          "助动词必须跟前句时态和谓语类型保持一致。",
        ],
      },
      {
        title: "四、省略是为了避免重复",
        points: [
          "比较、并列和回答中，可省略前文已经清楚的部分，但保留助动词。",
          "I can swim and Tom can, too 中 can 代替 can swim。",
        ],
      },
      {
        title: "五、考试操作步骤",
        points: [
          "判断肯定或否定 → 找前句助动词 → 判断是附和还是强调 → 决定是否倒装。",
        ],
      },
    ],
  },
  "There be 与 used to": {
    knowledge: [
      {
        title: "一、There be 的核心仍是“存在”",
        points: [
          "There will be / There is going to be 表示将来会有，不能写 there will have。",
          "be 的单复数通常按就近原则判断。",
        ],
      },
      {
        title: "二、三个 used 结构逐个拆",
        points: [
          "used to do：过去常常做、现在通常不再做。",
          "be used to doing：习惯于做；be used to do：被用来做。",
        ],
      },
      {
        title: "三、关键是判断 to 的身份",
        points: [
          "used to do 中 to 是不定式符号，后接原形。",
          "be used to doing 中 to 是介词，后接名词或 doing；be used to do 是被动语态加目的。",
        ],
      },
      {
        title: "四、最小差异对照",
        points: [
          "I used to get up late；I am used to getting up early；The clock is used to wake me up。",
          "只改变 be 和动词形式，三句话意义完全不同。",
        ],
      },
      {
        title: "五、判断口诀",
        points: [
          "过去常常 used to do，习惯现在 be used to doing，被用来做 be used to do。",
        ],
      },
    ],
  },
  主谓一致: {
    knowledge: [
      {
        title: "一、先找真正的主语中心词",
        points: [
          "介词短语、定语从句等修饰成分可能很长，但不决定谓语单复数。",
          "The students in the classroom are... 的中心词是 students。",
        ],
      },
      {
        title: "二、三条判断原则",
        points: [
          "语法一致看形式单复数；意义一致看整体表达的是一个还是多个；就近原则看离谓语最近的主语。",
          "不同结构使用的原则不同，不能一律看最近。",
        ],
      },
      {
        title: "三、就近原则的高频结构",
        points: [
          "there be、either...or、neither...nor、not only...but also 常按最近主语决定。",
          "Neither Tom nor his parents are...；Not only students but also the teacher is...。",
        ],
      },
      {
        title: "四、看似复数或单数的陷阱",
        points: [
          "everyone、something、each、either 通常按单数；people、police 常按复数。",
          "时间、金钱、距离作为整体时常按单数：Ten years is a long time。",
        ],
      },
      {
        title: "五、剥洋葱做题法",
        points: [
          "划掉修饰成分 → 圈中心主语 → 识别特殊连接结构 → 选择一致原则 → 检查时态。",
        ],
      },
    ],
  },
};
const grade9ExampleGuides = {
  现在完成时深化: [
    {
      highlights: ["for", "since", "has lived"],
      examples: [
        {
          label: "时间线",
          sentence: "She has lived here for five years.",
          translation: "她已经在这里住了五年。",
          note: "has lived 从五年前一直延续到现在；for 后接一段时间。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["has been away", "has left"],
      examples: [
        {
          label: "状态才能延续",
          sentence: "He has been away for two days.",
          translation: "他已经离开两天了。",
          note: "不能说 has left for two days；leave 是瞬间动作，be away 是持续状态。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["has had", "has kept"],
      examples: [
        {
          label: "动作换成状态",
          sentence: "I have had this bike since May.",
          translation: "从五月起我就拥有这辆自行车。",
          note: "buy → have；borrow → keep。与 since/for 连用时要使用可持续表达。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["has been to", "has gone to", "has been in"],
      examples: [
        {
          label: "三种“去”",
          sentence:
            "Tom has gone to Beijing, but Lucy has been to Beijing twice.",
          translation: "汤姆去了北京还没回来；露西去过北京两次。",
          note: "gone to 人不在这里；been to 已经回来。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["for a week", "has kept"],
      examples: [
        {
          label: "考题判断",
          sentence: "She has kept the book for a week.",
          translation: "她借这本书已经一周了。",
          note: "看到 for a week，borrow 必须转换为可持续的 keep。",
          tone: "correct",
        },
      ],
    },
  ],
  被动语态完整体系: [
    {
      highlights: ["built", "was built"],
      examples: [
        {
          label: "镜头换主角",
          sentence:
            "Workers built the bridge. → The bridge was built by workers.",
          translation: "工人建了桥。→ 桥由工人建造。",
          note: "bridge 从动作承受者变成句子主角，时间仍是过去。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["is cleaned", "was cleaned", "will be cleaned"],
      examples: [
        {
          label: "时态装在 be 上",
          sentence:
            "The room is cleaned every day. It was cleaned yesterday and will be cleaned tomorrow.",
          translation: "房间每天被打扫；昨天打扫过，明天也会打扫。",
          note: "过去分词 cleaned 不变，时态通过 is/was/will be 表达。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["was written", "by Lu Xun"],
      examples: [
        {
          label: "角色换位三步",
          sentence:
            "Lu Xun wrote the story. → The story was written by Lu Xun.",
          translation: "鲁迅写了这个故事。→ 这个故事由鲁迅创作。",
          note: "宾语 story 前移，wrote 改为 was written，执行者放在 by 后。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["was made to wait", "was given"],
      examples: [
        {
          label: "特殊结构",
          sentence: "They made him wait. → He was made to wait.",
          translation: "他们让他等待。→ 他被要求等待。",
          note: "make sb do 变被动后，省略的 to 必须补回来。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["happened", "was happened"],
      examples: [
        {
          label: "不能使用被动",
          sentence:
            "The accident happened yesterday. √  The accident was happened yesterday. ×",
          translation: "事故昨天发生了。",
          note: "happen 没有动作承受者，不能使用被动语态。",
          tone: "wrong",
        },
      ],
    },
  ],
  宾语从句完整体系: [
    {
      highlights: ["I think", "that he is right"],
      examples: [
        {
          label: "找动词的内容",
          sentence: "I think that he is right.",
          translation: "我认为他是对的。",
          note: "that he is right 回答“think 什么”，整块内容作宾语。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["that", "whether", "where"],
      examples: [
        {
          label: "引导词选择",
          sentence:
            "I know that he came. / I wonder whether he came. / I know where he went.",
          translation: "我知道他来了。/我想知道他是否来了。/我知道他去了哪里。",
          note: "陈述用 that，是否用 whether，具体地点信息保留 where。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["where he is", "where is he"],
      examples: [
        {
          label: "语序对比",
          sentence: "Do you know where he is? √  Do you know where is he? ×",
          translation: "你知道他在哪里吗？",
          note: "进入宾语从句后必须恢复“主语 he + 谓语 is”的陈述语序。",
          tone: "wrong",
        },
      ],
    },
    {
      highlights: ["said", "was", "goes"],
      examples: [
        {
          label: "时态呼应",
          sentence:
            "She said she was tired. The teacher said the earth goes around the sun.",
          translation: "她说她累了。老师说地球绕太阳转。",
          note: "普通事实随过去主句后移；客观真理仍用一般现在时。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["don't think", "isn't"],
      examples: [
        {
          label: "否定转移",
          sentence: "I don't think he is right.",
          translation: "我认为他不对。",
          note: "think、believe 等后的否定常转移到主句，较少说 I think he isn't right。",
          tone: "contrast",
        },
      ],
    },
  ],
  定语从句: [
    {
      highlights: ["the girl", "who is singing"],
      examples: [
        {
          label: "两个句子合并",
          sentence:
            "I know the girl. The girl is singing. → I know the girl who is singing.",
          translation: "我认识那个正在唱歌的女孩。",
          note: "重复的 the girl 用 who 代替，说明句紧跟在先行词后。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["who", "which", "that", "whose"],
      examples: [
        {
          label: "关系词的两份工作",
          sentence: "The boy who helped me is Tom.",
          translation: "帮助我的那个男孩是汤姆。",
          note: "who 向前指 boy，同时在从句 who helped me 中作主语。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["which", "where"],
      examples: [
        {
          label: "先看从句缺什么",
          sentence:
            "This is the house which we bought. / This is the house where we live.",
          translation: "这是我们买的房子。/这是我们居住的房子。",
          note: "bought 缺宾语用 which；we live 成分完整、缺地点状语用 where。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["the first book", "that", "who"],
      examples: [
        {
          label: "that 优先与省略",
          sentence: "This is the first book that I read in English.",
          translation: "这是我读的第一本英文书。",
          note: "先行词被 first 修饰，常优先使用 that；that 作 read 的宾语时可省略。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["who won", "who she won"],
      examples: [
        {
          label: "删除重复成分",
          sentence:
            "The girl who won the race is my sister. √  The girl who she won the race... ×",
          translation: "赢得比赛的女孩是我的妹妹。",
          note: "who 已经在从句中作主语，不能再放 she。",
          tone: "wrong",
        },
      ],
    },
  ],
  状语从句深化: [
    {
      highlights: ["when", "if", "because", "although"],
      examples: [
        {
          label: "先判断逻辑",
          sentence:
            "I will call you when I arrive. / I will stay home if it rains.",
          translation: "我到达时会给你打电话。/如果下雨，我会待在家。",
          note: "when 补时间背景，if 补条件背景。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["so that", "so...that"],
      examples: [
        {
          label: "目的与结果",
          sentence:
            "He spoke slowly so that we could understand. / He spoke so slowly that everyone understood.",
          translation:
            "他讲慢一点是为了我们听懂。/他讲得如此慢，大家都听懂了。",
          note: "so that 回答“为了什么”；so...that 回答“造成什么结果”。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["so tired that", "such a difficult problem that"],
      examples: [
        {
          label: "so 与 such",
          sentence:
            "He was so tired that he slept. / It was such a difficult problem that nobody solved it.",
          translation: "他太累所以睡着了。/题太难以至于无人解出。",
          note: "so 后接形容词 tired；such 后面的中心是名词 problem。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["arrives", "will arrive", "Although", "but"],
      examples: [
        {
          label: "两类陷阱",
          sentence:
            "I will call when he arrives. √  Although it rained, we went out. √",
          translation: "他到达时我会打电话。尽管下雨，我们还是出去了。",
          note: "时间从句主将从现；although 后不能再加 but。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["so that", "so...that"],
      examples: [
        {
          label: "改写检查",
          sentence: "She saved money so that she could travel.",
          translation: "她存钱是为了旅行。",
          note: "能改写成“为了……”就是目的；若是已经造成的后果，则用结果结构。",
          tone: "contrast",
        },
      ],
    },
  ],
  直接引语与间接引语: [
    {
      highlights: ["said", "that"],
      examples: [
        {
          label: "从引用变转述",
          sentence: "She said, “I am tired.” → She said that she was tired.",
          translation: "她说：“我累了。”→ 她说她累了。",
          note: "去掉引号后，要按转述者视角调整人称和时态。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["I", "she", "my", "her"],
      examples: [
        {
          label: "人称跟角色换",
          sentence:
            "Lucy said, “I lost my key.” → Lucy said that she had lost her key.",
          translation: "露西说：“我丢了钥匙。”→ 露西说她丢了钥匙。",
          note: "I 和 my 都指 Lucy，因此改为 she 和 her。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["would", "the next day", "there"],
      examples: [
        {
          label: "时间地点后移",
          sentence:
            "Tom said, “I will come here tomorrow.” → Tom said he would go there the next day.",
          translation: "汤姆说他第二天会去那里。",
          note: "will → would，here → there，tomorrow → the next day。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["asked whether", "asked me to"],
      examples: [
        {
          label: "不同句型不同转法",
          sentence:
            "“Are you ready?” → She asked whether I was ready.  “Sit down.” → She asked me to sit down.",
          translation: "她问我是否准备好。她让我坐下。",
          note: "疑问句用 whether；请求命令用 ask/tell + 人 + to do。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["goes around", "went around"],
      examples: [
        {
          label: "客观真理不后移",
          sentence: "The teacher said that the earth goes around the sun.",
          translation: "老师说地球绕太阳转。",
          note: "客观真理现在仍成立，所以保持一般现在时。",
          tone: "correct",
        },
      ],
    },
  ],
  时态综合辨析: [
    {
      highlights: ["walks", "is taking", "visited", "will visit"],
      examples: [
        {
          label: "时间轨道",
          sentence:
            "She walks to school every day, but today she is taking a bus.",
          translation: "她每天步行上学，但今天正在坐公交。",
          note: "习惯用一般现在时；眼前临时动作使用现在进行时。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["has lived", "came"],
      examples: [
        {
          label: "时间、状态、联系",
          sentence: "I have lived here since I came to the city.",
          translation: "自从来到这座城市，我一直住在这里。",
          note: "came 是过去起点；has lived 从起点持续到现在。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["was cooking", "called"],
      examples: [
        {
          label: "同一语境切换",
          sentence: "She was cooking when I called her.",
          translation: "我给她打电话时，她正在做饭。",
          note: "was cooking 是背景长动作；called 是突然发生的短动作。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["since", "has known", "met"],
      examples: [
        {
          label: "标志词不是答案",
          sentence: "I have known him since we met at school.",
          translation: "自从在学校相识，我一直认识他。",
          note: "同一个 since 句中，主句用完成时，从句用一般过去时。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["had ended", "arrived"],
      examples: [
        {
          label: "画时间线再选择",
          sentence: "By the time we arrived, the meeting had ended.",
          translation: "我们到达时，会议已经结束。",
          note: "会议结束在先，到达在后，因此较早事件用过去完成时。",
          tone: "correct",
        },
      ],
    },
  ],
  被动语态综合辨析: [
    {
      highlights: ["writes", "is written"],
      examples: [
        {
          label: "先看角色关系",
          sentence: "She writes the report. / The report is written by her.",
          translation: "她写报告。/报告由她撰写。",
          note: "she 是执行者用主动；report 是承受者作主语时用被动。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["is built", "was built", "will be built", "has been built"],
      examples: [
        {
          label: "先定时态",
          sentence:
            "A bridge is built here every year. / A bridge will be built here next year.",
          translation: "这里每年建一座桥。/明年这里将建一座桥。",
          note: "先由时间确定一般现在或将来，再套入对应被动结构。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["plant", "have been planted"],
      examples: [
        {
          label: "同一时间轴转换",
          sentence:
            "People have planted many trees. → Many trees have been planted.",
          translation: "人们已经种了许多树。→ 许多树已经被种下。",
          note: "原句是现在完成时，变被动后仍保留 have been。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["happened", "sells well"],
      examples: [
        {
          label: "无被动与主动表被动",
          sentence: "The accident happened yesterday. / This book sells well.",
          translation: "事故昨天发生。/这本书很畅销。",
          note: "happen 无被动；sell well 用主动形式描述事物的性质。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["have been planted", "have planted"],
      examples: [
        {
          label: "双重检查",
          sentence: "A lot of trees have been planted since last year.",
          translation: "自去年以来，许多树已经被种下。",
          note: "trees 承受 plant，且 since 提示现在完成时，因此用 have been planted。",
          tone: "correct",
        },
      ],
    },
  ],
  三类从句综合辨析: [
    {
      highlights: ["what he wants", "that I bought", "when I arrive"],
      examples: [
        {
          label: "三种工作",
          sentence:
            "I know what he wants. / The book that I bought is useful. / I will call when I arrive.",
          translation: "我知道他想要什么。/我买的书有用。/我到达时会打电话。",
          note: "分别作宾语、修饰 book、补充时间背景。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["know", "book", "when"],
      examples: [
        {
          label: "删除测试",
          sentence:
            "I know [where he lives]. / The book [that he wrote] is popular.",
          translation: "我知道他住哪里。/他写的书很受欢迎。",
          note: "删去第一块后 know 缺内容；删去第二块后 book 仍在，只是说明减少。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["think", "who", "because"],
      examples: [
        {
          label: "结构信号",
          sentence:
            "I think that she is right. / The girl who won smiled. / We stayed because it rained.",
          translation: "我认为她是对的。/获胜的女孩笑了。/因为下雨我们留下了。",
          note: "动词后内容、名词后修饰、主句后逻辑背景分别对应三类从句。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["when he came", "the day", "left"],
      examples: [
        {
          label: "同词不同身份",
          sentence:
            "I know when he came. / I remember the day when he came. / I left when he came.",
          translation: "我知道他何时来。/我记得他来的那天。/他来时我离开了。",
          note: "同样是 when，三句中分别作宾语从句、定语从句和时间状语从句。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["when I arrive", "时间状语从句"],
      examples: [
        {
          label: "判别流程",
          sentence: "I will call you when I arrive.",
          translation: "我到达时会给你打电话。",
          note: "when I arrive 不作 call 的宾语，也不修饰名词，而是说明打电话的时间。",
          tone: "correct",
        },
      ],
    },
  ],
  情态动词终极考点: [
    {
      highlights: ["can", "should", "must"],
      examples: [
        {
          label: "同词先看语气任务",
          sentence:
            "She can swim. / You should rest. / You must wear a seat belt.",
          translation: "她会游泳。/你应该休息。/你必须系安全带。",
          note: "三句分别表示能力、建议和义务。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["must be", "may be", "can't be"],
      examples: [
        {
          label: "证据强弱",
          sentence:
            "He must be home—the light is on. He may be asleep. He can't be abroad.",
          translation: "灯亮着，他一定在家；可能睡着了；不可能在国外。",
          note: "must、may、can't 分别表示确定、可能和否定推测。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["mustn't", "can't", "needn't"],
      examples: [
        {
          label: "三个否定",
          sentence:
            "You mustn't enter. / It can't be true. / You needn't wait.",
          translation: "禁止进入。/不可能是真的。/你不必等待。",
          note: "禁止、不可能、不必是三种完全不同的语气。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["needn't go", "needs to go"],
      examples: [
        {
          label: "need 两种身份",
          sentence: "You needn't go now. / He needs to go now.",
          translation: "你现在不必走。/他现在需要走。",
          note: "情态动词 need 后接原形；实义动词 need 随主语变化并接 to do。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["can't be", "has gone abroad"],
      examples: [
        {
          label: "语气刻度",
          sentence: "The man can't be Mr. Li. He has gone abroad.",
          translation: "那个人不可能是李先生，他已经出国了。",
          note: "后句提供否定证据，因此选择 can't，而不是 must。",
          tone: "correct",
        },
      ],
    },
  ],
  非谓语固定搭配: [
    {
      highlights: ["want", "to play"],
      examples: [
        {
          label: "谓语名额",
          sentence: "I want to play football.",
          translation: "我想踢足球。",
          note: "want 已占核心谓语名额，第二个动作 play 变成 to play。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["to finish", "doing", "done"],
      examples: [
        {
          label: "动作身份",
          sentence: "I hope to finish the work. / I enjoy reading books.",
          translation: "我希望完成工作。/我喜欢读书。",
          note: "未发生的目标常用 to do；作为活动或持续动作常用 doing。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["decided to leave", "finished reading", "made me wait"],
      examples: [
        {
          label: "固定搭配分组",
          sentence:
            "She decided to leave. / She finished reading. / She made me wait.",
          translation: "她决定离开。/她读完了。/她让我等待。",
          note: "decide + to do；finish + doing；make + 人 + 动词原形。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["sing", "singing", "to sing"],
      examples: [
        {
          label: "全过程与片段",
          sentence: "I heard him sing the song. / I heard him singing.",
          translation: "我听见他唱完整首歌。/我听见他正在唱。",
          note: "do 强调全过程，doing 强调正在发生；变被动时补回 to。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["opening", "to open"],
      examples: [
        {
          label: "考题检查",
          sentence: "Would you mind opening the window?",
          translation: "你介意打开窗户吗？",
          note: "mind 后接 doing，所以选择 opening，不能选 to open。",
          tone: "correct",
        },
      ],
    },
  ],
  "连词、倒装与省略": [
    {
      highlights: ["unless", "until", "since", "whenever"],
      examples: [
        {
          label: "连接关系",
          sentence:
            "I won't leave until you return. / I will go unless it rains.",
          translation: "直到你回来我才离开。/除非下雨，否则我会去。",
          note: "not...until 表示“直到才”；unless 相当于 if...not。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["So do I", "Neither have I"],
      examples: [
        {
          label: "肯定与否定附和",
          sentence:
            "She likes music, and so do I. / I haven't seen it, and neither have I.",
          translation: "她喜欢音乐，我也是。/我没看过，我也没有。",
          note: "肯定用 So，否定用 Neither；助动词与前句保持一致。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["So do I", "So I do"],
      examples: [
        {
          label: "倒装与强调",
          sentence: "She likes music. — So do I. / You like music. — So I do.",
          translation: "她喜欢音乐——我也是。/你喜欢音乐——我的确喜欢。",
          note: "So do I 指另一个人也如此；So I do 强调原主语确实如此。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["can", "can swim"],
      examples: [
        {
          label: "省略避免重复",
          sentence: "I can swim, and Tom can, too.",
          translation: "我会游泳，汤姆也会。",
          note: "第二个 can 保留时态和语气，省略了已经明确的 swim。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["Neither have I", "Neither I have"],
      examples: [
        {
          label: "考试排错",
          sentence:
            "I haven't seen the film. — Neither have I. √  Neither I have. ×",
          translation: "我没看过这部电影。——我也没有。",
          note: "附和结构必须使用“Neither + 助动词 + 主语”的倒装语序。",
          tone: "wrong",
        },
      ],
    },
  ],
  "There be 与 used to": [
    {
      highlights: ["There will be", "there will have"],
      examples: [
        {
          label: "将来存在",
          sentence:
            "There will be a meeting tomorrow. √  There will have a meeting. ×",
          translation: "明天将有一场会议。",
          note: "There be 表示存在，将来形式是 There will be。",
          tone: "wrong",
        },
      ],
    },
    {
      highlights: ["used to do", "be used to doing", "be used to do"],
      examples: [
        {
          label: "三个结构",
          sentence:
            "I used to walk. / I am used to walking. / Wood is used to make paper.",
          translation: "我过去常步行。/我习惯步行。/木材被用来造纸。",
          note: "过去习惯、现在习惯、被用于做某事，意义完全不同。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["to get", "to getting", "to make"],
      examples: [
        {
          label: "判断 to 的身份",
          sentence: "I used to get up late. / I am used to getting up early.",
          translation: "我过去常晚起。/我习惯早起。",
          note: "used to 中 to 后接原形；be used to doing 中 to 是介词，后接 doing。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["used to get", "am used to getting", "is used to wake"],
      examples: [
        {
          label: "最小差异",
          sentence:
            "I used to get up late. I am used to getting up early. The clock is used to wake me up.",
          translation: "过去常晚起；现在习惯早起；闹钟被用来叫醒我。",
          note: "观察 be 是否存在以及 to 后的动词形式。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["is used to make", "is used to making"],
      examples: [
        {
          label: "考试判断",
          sentence: "Wood is used to make paper.",
          translation: "木材被用来造纸。",
          note: "主语 wood 是使用对象，表示“被用来”，选择 be used to do。",
          tone: "correct",
        },
      ],
    },
  ],
  主谓一致: [
    {
      highlights: ["students", "are"],
      examples: [
        {
          label: "找中心词",
          sentence: "The students in the classroom are reading.",
          translation: "教室里的学生正在读书。",
          note: "in the classroom 只是修饰语，真正主语中心词 students 是复数。",
          tone: "correct",
        },
      ],
    },
    {
      highlights: ["is", "are"],
      examples: [
        {
          label: "三种原则",
          sentence:
            "The boy is here. / The police are here. / There is a pen and two books.",
          translation: "男孩在这里。/警察在这里。/这里有一支笔和两本书。",
          note: "分别体现语法一致、意义一致和就近原则。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["parents are", "teacher is"],
      examples: [
        {
          label: "就近原则",
          sentence:
            "Neither Tom nor his parents are home. / Not only the students but also the teacher is excited.",
          translation: "汤姆和父母都不在家。/不仅学生，老师也很兴奋。",
          note: "谓语看离它最近的 parents 或 teacher。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["Everyone has", "Ten years is"],
      examples: [
        {
          label: "外形会骗人",
          sentence: "Everyone has a chance. / Ten years is a long time.",
          translation: "每个人都有机会。/十年是一段很长的时间。",
          note: "everyone 按单数；十年作为一个整体也按单数。",
          tone: "contrast",
        },
      ],
    },
    {
      highlights: ["teacher is", "students are"],
      examples: [
        {
          label: "剥洋葱判断",
          sentence: "Not only the students but also their teacher is excited.",
          translation: "不仅学生，老师也很兴奋。",
          note: "划去连接结构后看最近主语 teacher，所以谓语用 is。",
          tone: "correct",
        },
      ],
    },
  ],
};
Object.entries(grade9ExampleGuides).forEach(([title, guides]) => {
  const lesson = grade9GrammarEnhancements[title];
  if (!lesson) return;
  lesson.knowledge = lesson.knowledge.map((section, index) => ({
    ...section,
    ...guides[index],
  }));
});
const grade10ModeConfigs = {
  sentence: {
    titles: [
      "一、先找长句的主干",
      "二、再看修饰和连接层级",
      "三、按顺序拆句，不逐词翻译",
    ],
    intro:
      "先找真正随主语和时态变化的谓语，再确定主句主语；其余较长部分暂时用括号框起来。",
    method:
      "判断顺序：圈谓语 → 找主语 → 划连接词 → 框从句和非谓语 → 最后恢复修饰关系。",
  },
  timeline: {
    titles: [
      "一、先把动作放到时间线上",
      "二、结构服务于时间和状态",
      "三、用语境决定，不只看标志词",
    ],
    intro:
      "先确定观察时间点，再判断动作是完成、持续、正在进行，还是从另一个时间点向前看。",
    method:
      "判断顺序：找时间参照点 → 排动作先后 → 判断过程或结果 → 选择对应结构。",
  },
  clause: {
    titles: [
      "一、先划出主句和从句边界",
      "二、看整块从句在句中做什么",
      "三、再选择连接词和语序",
    ],
    intro:
      "不要看到连接词就猜答案；先把带有自己主语和谓语的小句子框出来，再判断它在大句子中的工作。",
    method:
      "判断顺序：框从句 → 找前面的动词或名词 → 判断句中位置或逻辑关系 → 检查连接词是否在从句中作成分。",
  },
  nonfinite: {
    titles: [
      "一、先确认核心谓语名额",
      "二、连接逻辑主语，判断主动被动",
      "三、再判断动作发生的先后",
    ],
    intro:
      "一个简单句先保留核心谓语，其他动作再根据句中工作变成 to do、doing、done 或完成式。",
    method:
      "判断顺序：找谓语 → 找非谓语的逻辑主语 → 判断主动/被动 → 判断先后 → 确定句法功能。",
  },
  special: {
    titles: [
      "一、先看普通表达想强调什么",
      "二、结构变化会改变语气和焦点",
      "三、用正常语序做还原检查",
    ],
    intro:
      "先把特殊句式还原成普通表达，弄清事实、假设、强调或附加语气，再学习形式变化。",
    method:
      "判断顺序：还原普通句 → 确定想突出或假设的内容 → 选择特殊结构 → 检查还原后是否仍是完整句。",
  },
};
function getGrade10Mode(title) {
  if (/长难句|句子结构|连词与并列|it、冠词/.test(title))
    return grade10ModeConfigs.sentence;
  if (/从句|which|whom/.test(title)) return grade10ModeConfigs.clause;
  if (/非谓语|分词|被动语态与非谓语/.test(title))
    return grade10ModeConfigs.nonfinite;
  if (/时|将来表达/.test(title)) return grade10ModeConfigs.timeline;
  return grade10ModeConfigs.special;
}
const grade10HighlightDictionary = [
  "have/has been doing",
  "have/has + 过去分词",
  "had + 过去分词",
  "will do",
  "be going to do",
  "be to do",
  "be about to do",
  "would do",
  "was/were going to do",
  "be + 过去分词",
  "to be done",
  "being done",
  "to have been done",
  "that",
  "whether",
  "what",
  "who",
  "where",
  "when",
  "why",
  "which",
  "whom",
  "whose",
  "as soon as",
  "provided that",
  "although",
  "though",
  "even if",
  "because",
  "since",
  "unless",
  "so that",
  "in order that",
  "so...that",
  "such...that",
  "than",
  "as...as",
  "as if",
  "as though",
  "to do",
  "doing",
  "done",
  "to have done",
  "having done",
  "being done",
  "having been done",
  "should",
  "would",
  "could",
  "might",
  "It is/was",
  "There be",
  "there may be",
  "there has been",
  "one",
  "ones",
  "do so",
  "a number of",
  "the number of",
];
function getGrade10Highlights(topic) {
  const text = [
    topic.summary,
    ...(topic.rules || []),
    ...(topic.examples || []).flat(),
    topic.mistake,
  ]
    .filter(Boolean)
    .join(" ");
  return grade10HighlightDictionary.filter((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}
function makeGrade10Example(example, label, highlights, tone = "correct") {
  if (!example) return null;
  return {
    label,
    sentence: example[0],
    translation: example[1],
    note: example[2] || "把关键词放回完整句子中，观察它与主句主干的关系。",
    highlights,
    tone,
  };
}
function createGrade10Enhancement(topic) {
  const mode = getGrade10Mode(topic.title);
  const highlights = getGrade10Highlights(topic);
  const examples = topic.examples || [];
  const quiz = topic.question;
  return {
    knowledge: [
      {
        title: mode.titles[0],
        points: [mode.intro, topic.summary].filter(
          (point) => typeof point === "string" && point.trim()
        ),
        highlights,
        examples: [
          makeGrade10Example(examples[0], "先看代表句", highlights),
        ].filter(Boolean),
      },
      {
        title: mode.titles[1],
        points: (topic.rules || []).slice(0, 2),
        highlights,
        examples: [
          makeGrade10Example(
            examples[1] || examples[0],
            "结构拆解",
            highlights,
            "contrast"
          ),
        ].filter(Boolean),
      },
      {
        title: mode.titles[2],
        points: [...(topic.rules || []).slice(2), mode.method],
        highlights,
        examples: [
          makeGrade10Example(
            examples[2] || examples[0],
            "按步骤判断",
            highlights,
            "contrast"
          ),
        ].filter(Boolean),
      },
      {
        title: "四、易错边界与选择理由",
        points: [topic.mistake].filter(
          (point) => typeof point === "string" && point.trim()
        ),
        highlights,
        examples: quiz
          ? [
              {
                label: "常见考法",
                sentence: quiz.prompt,
                translation: `正确选择：${quiz.answer}`,
                note: quiz.explanation,
                highlights: [...highlights, quiz.answer],
                tone: "wrong",
              },
            ]
          : [],
      },
    ],
  };
}
const grade10Topics = D.find((level) => level.id === "grade10")?.topics || [];
const grade10GrammarEnhancements = Object.fromEntries(
  grade10Topics.map((topic) => [topic.title, createGrade10Enhancement(topic)])
);
const grade11ModeConfigs = {
  compare: {
    titles: [
      "一、这节课要分清什么",
      "二、把易混结构放在一起比较",
      "三、从句子里寻找判断证据",
      "四、按顺序作出选择",
    ],
    intro:
      "这一阶段不再重新背一遍定义，而是把容易混淆的结构放进同一组句子中，比较它们表达的时间、关系和语气。",
    method:
      "做题顺序：先确定句子想表达什么，再检查结构是否完整，然后寻找时间、逻辑和搭配证据，最后排除只有形式相似的选项。",
  },
  longSentence: {
    titles: [
      "一、先数清句中的谓语",
      "二、用连接词划分层级",
      "三、保留主干，暂时收起修饰",
      "四、把各层意思逐步挂回",
    ],
    intro:
      "长句不是从第一个词一直翻译到最后一个词。先找到有限谓语和连接词，句子的层级就会逐渐清楚。",
    method:
      "拆句顺序：圈谓语 → 划连接词 → 找主句主干 → 框出从句和非谓语 → 确认修饰对象 → 按中文习惯重组。",
  },
  exam: {
    titles: [
      "一、先判断空格在考什么",
      "二、检查这个分句缺少什么",
      "三、抓住题目给出的证据",
      "四、逐项排除并说明理由",
    ],
    intro:
      "语法填空和改错不是看到提示词就套公式。先检查句子结构，再决定要处理谓语、非谓语、引导词还是小词。",
    method:
      "做题顺序：划分分句 → 检查主谓是否完整 → 判断主动被动和时间 → 检查词形与搭配 → 把答案放回原句通读。",
  },
  writing: {
    titles: [
      "一、先检查句子是否完整",
      "二、让并列和动词关系对齐",
      "三、让前后句衔接清楚",
      "四、从改错过渡到自己表达",
    ],
    intro:
      "写作中的语法不只追求单个空格正确，还要保证句子完整、并列一致、指代清楚，并让前后信息自然连接。",
    method:
      "修改顺序：找主谓 → 检查并列形式 → 检查宾语和补语 → 确认代词指向 → 选择合适的连接方式 → 朗读整句。",
  },
};
function getGrade11Mode(title) {
  if (/长难句/.test(title)) return grade11ModeConfigs.longSentence;
  if (/语法填空|短文改错|校对/.test(title)) return grade11ModeConfigs.exam;
  if (/平行结构|句子完整性|复杂谓语|宾补|语篇衔接|指代/.test(title))
    return grade11ModeConfigs.writing;
  return grade11ModeConfigs.compare;
}
function makeGrade11Example(
  example,
  label,
  note,
  highlights,
  tone = "correct"
) {
  if (!example) return null;
  return {
    label,
    sentence: example[0],
    translation: example[1],
    note,
    highlights,
    tone,
  };
}
const grade11SupplementalExamples = {
  易混时态综合拔高: [
    [
      "I have read the book, so you can borrow it now.",
      "我已经读完这本书了，所以你现在可以借走。",
      "have read 强调已经完成并产生了现在可以借出的结果。",
    ],
    [
      "I have been reading the book all afternoon.",
      "我整个下午一直在读这本书。",
      "have been reading 强调持续的阅读过程，不说明已经读完。",
    ],
  ],
  被动语态特殊形式: [
    [
      "The problem is difficult to solve.",
      "这个问题很难解决。",
      "主语 problem 是 solve 的承受者，但在“形容词 + to do”结构中使用主动形式。",
    ],
    [
      "The window wants cleaning before the guests arrive.",
      "客人到达前，这扇窗户需要清洁。",
      "want doing 表示“需要被做”，相当于 wants to be cleaned。",
    ],
  ],
  名词性从句精准选词: [
    [
      "That she won the prize surprised us.",
      "她获奖这件事让我们很惊讶。",
      "从句 she won the prize 结构完整，that 只负责连接。",
    ],
    [
      "What she needs is more time.",
      "她需要的是更多时间。",
      "从句中 needs 后缺少宾语，所以使用在从句中作宾语的 what。",
    ],
  ],
  "同位语从句、定语从句与 it": [
    [
      "The idea that we should leave early sounds sensible.",
      "我们应该早点离开的想法听起来很合理。",
      "that 从句解释 idea 的具体内容，句子本身不缺成分。",
    ],
    [
      "We found it difficult to explain the rule.",
      "我们发现解释这条规则很困难。",
      "it 是形式宾语，真正的宾语是后面的 to explain the rule。",
    ],
  ],
  定语从句高级辨析: [
    [
      "As we all know, exercise is good for health.",
      "众所周知，运动有益健康。",
      "as 位于句首，表示“正如大家所知道的”。",
    ],
    [
      "The road was blocked, which delayed our trip.",
      "道路被堵塞了，这耽误了我们的行程。",
      "which 指代前面整件事，并说明由此产生的结果。",
    ],
  ],
  "way 与分隔式定语从句": [
    [
      "This is the way in which the machine works.",
      "这就是这台机器的运作方式。",
      "way 作先行词，从句缺方式状语，可以使用 in which。",
    ],
    [
      "A message arrived from the student who had missed the class.",
      "那位缺课的学生发来了一条消息。",
      "who 从句修饰 student，而不是离它最近的其他成分。",
    ],
  ],
  状语从句精细辨析与省略: [
    [
      "Although tired, she continued working.",
      "尽管很累，她仍继续工作。",
      "完整形式是 Although she was tired，主语一致且含 be，可以省略。",
    ],
    [
      "Even though he was ill, he attended the meeting.",
      "虽然他生病了，但仍参加了会议。",
      "even though 表示对已经存在的事实作出让步。",
    ],
  ],
  比较从句与倍数表达: [
    [
      "This river is twice as wide as that one.",
      "这条河是那条河的两倍宽。",
      "使用“倍数 + as + 原级 + as”结构。",
    ],
    [
      "The population is three times what it was ten years ago.",
      "人口是十年前的三倍。",
      "倍数后接 what 从句，what it was 表示过去的人口数量。",
    ],
  ],
  非谓语内部时态与语态: [
    [
      "He is believed to have left the city.",
      "人们认为他已经离开了这座城市。",
      "to have left 表示离开发生在“被认为”之前。",
    ],
    [
      "Being repaired, the bridge is closed to traffic.",
      "这座桥正在维修，因此禁止通行。",
      "bridge 承受 repair，且动作正在进行，所以使用 being repaired。",
    ],
  ],
  非谓语功能与从句还原: [
    [
      "The man talking to our teacher is my uncle.",
      "正在和老师说话的男子是我的叔叔。",
      "talking 短语可还原为 who is talking，作后置定语。",
    ],
    [
      "Not knowing the answer, I remained silent.",
      "因为不知道答案，我保持沉默。",
      "Not knowing 可还原为 Because I did not know，表示原因。",
    ],
  ],
  "独立主格与 with 复合结构": [
    [
      "The meeting over, everyone left the room.",
      "会议结束后，大家离开了房间。",
      "The meeting 是独立逻辑主语，over 表示它所处的状态。",
    ],
    [
      "With the children playing outside, the room became quiet.",
      "孩子们在外面玩时，房间安静了下来。",
      "children 与 play 是主动进行关系，所以使用 playing。",
    ],
  ],
  虚拟语气完整体系: [
    [
      "If I were you, I would accept the offer.",
      "如果我是你，我会接受这个提议。",
      "条件与现在事实相反，if 从句使用 were，主句使用 would do。",
    ],
    [
      "If she had left earlier, she would be here now.",
      "如果她早一点出发，现在就已经到这里了。",
      "条件指过去，结果指现在，是混合虚拟。",
    ],
  ],
  "should 型与特殊虚拟": [
    [
      "The doctor suggested that he rest for a week.",
      "医生建议他休息一周。",
      "suggest 表示建议时，从句使用（should）+ 动词原形。",
    ],
    [
      "He speaks as if he had seen the accident.",
      "他说得好像亲眼见过那场事故一样。",
      "从句表示与过去事实相反，使用过去完成时。",
    ],
  ],
  "情态动词 + have done": [
    [
      "She must have taken the wrong bus.",
      "她一定是坐错公交车了。",
      "must have done 表示对过去情况较有把握的肯定推测。",
    ],
    [
      "You needn't have brought so much food.",
      "你本来没有必要带这么多食物。",
      "食物已经带来了，但这个动作实际上没有必要。",
    ],
  ],
  "倒装、强调与 There 结构": [
    [
      "Not until midnight did he finish the report.",
      "直到午夜他才完成报告。",
      "Not until 位于句首，主句使用部分倒装。",
    ],
    [
      "It was Tom who broke the window.",
      "打破窗户的人是汤姆。",
      "去掉 It was 和 who 后，Tom broke the window 仍然完整，因此是强调句。",
    ],
  ],
  "代词、冠词、介词与一致": [
    [
      "Neither of the answers is correct.",
      "两个答案都不正确。",
      "Neither of 作主语时，正式表达中谓语通常使用单数。",
    ],
    [
      "A number of students are waiting outside.",
      "许多学生正在外面等候。",
      "a number of 表示“许多”，谓语跟复数名词 students 保持一致。",
    ],
  ],
  长难句嵌套拆分: [
    [
      "The book that you lent me is easier to understand than I expected.",
      "你借给我的那本书比我预想的更容易理解。",
      "主干是 The book is easier；that 从句修饰 book，than 从句补充比较对象。",
    ],
    [
      "Anyone who wants to join should tell the teacher before the class begins.",
      "任何想参加的人都应在上课前告诉老师。",
      "主干是 Anyone should tell the teacher，句中还包含定语从句和时间状语从句。",
    ],
  ],
  "语法填空：谓语判断": [
    [
      "The museum attracts thousands of visitors every year.",
      "这座博物馆每年吸引成千上万的游客。",
      "分句缺少核心谓语，every year 和单数主语共同确定 attracts。",
    ],
    [
      "The old bridge was destroyed in the storm last night.",
      "那座旧桥昨晚在暴风雨中被毁了。",
      "bridge 承受 destroy，last night 提示一般过去时，因此使用 was destroyed。",
    ],
  ],
  "语法填空：非谓语判断": [
    [
      "Hearing the news, the children cheered loudly.",
      "听到消息后，孩子们大声欢呼。",
      "句中已有谓语 cheered，children 与 hear 是主动关系，所以使用 Hearing。",
    ],
    [
      "The documents sent yesterday have already arrived.",
      "昨天寄出的文件已经到了。",
      "documents 承受 send，sent 作后置定语。",
    ],
  ],
  "语法填空：引导词与小词": [
    [
      "I still remember the day when we first met.",
      "我仍然记得我们第一次见面的那一天。",
      "从句不缺主语或宾语，缺少时间状语，所以使用 when。",
    ],
    [
      "She was proud of the progress she had made.",
      "她为自己取得的进步感到自豪。",
      "be proud of 是固定搭配，介词不能只靠中文翻译选择。",
    ],
  ],
  短文改错与校对: [
    [
      "Each of the books has a different cover.",
      "每本书都有不同的封面。",
      "主语中心是 Each，谓语应使用单数 has。",
    ],
    [
      "He enjoys playing football and reading novels.",
      "他喜欢踢足球和读小说。",
      "and 两边保持相同的动名词形式。",
    ],
  ],
  平行结构与句子完整性: [
    [
      "The job requires patience, skill and careful planning.",
      "这项工作需要耐心、技巧和周密计划。",
      "三个宾语处于相同层级，形式和逻辑保持平行。",
    ],
    [
      "Because the road was closed, we took another route.",
      "因为道路封闭，我们选择了另一条路线。",
      "Because 从句不能独立存在，后面必须有完整主句。",
    ],
  ],
  复杂谓语框架与宾补: [
    [
      "The news made everyone feel nervous.",
      "这个消息让所有人感到紧张。",
      "made 后先找宾语 everyone，再判断 feel nervous 是宾语补足语。",
    ],
    [
      "She was seen to enter the building.",
      "有人看见她进入了大楼。",
      "感官动词变为被动后，主动句中省略的 to 要恢复。",
    ],
  ],
  语篇衔接与指代: [
    [
      "Lucy called Anna after she arrived home.",
      "露西或安娜到家后，露西给安娜打了电话。",
      "she 的指向不清楚，写作时应改用明确的人名消除歧义。",
    ],
    [
      "The first plan was too costly; therefore, we considered another.",
      "第一个方案成本太高，因此我们考虑了另一个方案。",
      "therefore 表示因果，但连接两个完整句时前面不能只放逗号。",
    ],
  ],
};
function createGrade11Enhancement(topic) {
  const mode = getGrade11Mode(topic.title);
  const highlights = getGrade10Highlights(topic);
  const examples = topic.examples || [];
  const supplemental = grade11SupplementalExamples[topic.title] || [];
  const question = topic.question;
  const rules = topic.rules || [];
  return {
    knowledge: [
      {
        title: mode.titles[0],
        points: [mode.intro, topic.summary].filter(Boolean),
        highlights,
        examples: [
          makeGrade11Example(
            examples[0],
            "先看问题",
            rules[0] || "先找出句子中真正决定答案的信息。",
            highlights
          ),
        ].filter(Boolean),
      },
      {
        title: mode.titles[1],
        points: rules.slice(0, 2),
        highlights,
        examples: [
          makeGrade11Example(
            examples[1],
            "对照着看",
            rules[1] || "把它与上一句比较，观察结构和意义发生了什么变化。",
            highlights,
            "contrast"
          ),
        ].filter(Boolean),
      },
      {
        title: mode.titles[2],
        points: [
          rules[2],
          "不要只看某一个标志词；主谓结构、动作先后、主动被动、连接关系和固定搭配都可能成为判断证据。",
        ].filter(Boolean),
        highlights,
        examples: [
          makeGrade11Example(
            supplemental[0],
            "找出句中证据",
            supplemental[0]?.[2],
            highlights,
            "contrast"
          ),
        ].filter(Boolean),
      },
      {
        title: mode.titles[3],
        points: [mode.method, topic.mistake].filter(Boolean),
        highlights,
        examples: [
          makeGrade11Example(
            supplemental[1],
            "再判断一个新句子",
            supplemental[1]?.[2],
            highlights,
            "contrast"
          ),
        ].filter(Boolean),
      },
      {
        title: "五、把答案说出理由，再迁移到新句子",
        points: [
          "选出答案后，用一句话说明“句中哪处证据支持它、其他形式为什么不合适”。能够说出理由，才是真正掌握。",
          "最后换一个主语、时间或场景仿写一句，检查这条规则能否用于新的表达。",
        ],
        highlights,
        examples: question
          ? [
              {
                label: "跟着思路做一题",
                sentence: question.prompt,
                translation: `正确答案：${question.answer}`,
                note: question.explanation,
                highlights: [...highlights, question.answer],
                tone: "wrong",
              },
            ]
          : [],
      },
    ],
  };
}
const grade11Topics = D.find((level) => level.id === "grade11")?.topics || [];
const grade11GrammarEnhancements = Object.fromEntries(
  grade11Topics.map((topic) => [topic.title, createGrade11Enhancement(topic)])
);
const grade12ModeConfigs = {
  review: {
    titles: [
      "一、先认出这类考点",
      "二、把核心区别压缩成一张图",
      "三、30 秒内寻找决定性证据",
      "四、识别命题人设置的干扰",
    ],
    intro:
      "系统复盘不是重新背完整课文，而是把分散知识压缩成考试时能迅速调用的判断框架。",
    method:
      "限时顺序：确定考点 → 找时间、结构或逻辑证据 → 回忆核心区别 → 排除形式相似但意义不符的选项。",
  },
  decision: {
    titles: [
      "一、先判断空格或错误的任务",
      "二、划分分句并检查句子骨架",
      "三、按固定流程缩小答案范围",
      "四、逐个排除高频干扰项",
    ],
    intro:
      "题型训练的关键是形成固定决策顺序。不要凭语感改词，也不要看到提示词就立刻套某一种形式。",
    method:
      "答题顺序：划分分句 → 检查谓语数量 → 判断成分和词性 → 检查时态语态与搭配 → 放回全文复核。",
  },
  reading: {
    titles: [
      "一、先抓主干，不逐词翻译",
      "二、找从句、非谓语和指代归属",
      "三、用连接词判断论证方向",
      "四、排除只抓局部信息的理解",
    ],
    intro:
      "阅读中的语法分析服务于理解：先找到作者真正说了什么，再判断修饰、转折和指代怎样改变信息重点。",
    method:
      "阅读顺序：圈谓语 → 划边界 → 找主干 → 确认修饰对象和代词指向 → 标出转折因果 → 概括作者保留的观点。",
  },
  writing: {
    titles: [
      "一、先保证基础句准确完整",
      "二、选择真正需要升级的信息",
      "三、合并后检查逻辑主语和连接",
      "四、比较基础表达与提分表达",
    ],
    intro:
      "备考写作不是句子越长越好。先保证主谓完整，再用从句、非谓语或特殊句式突出一个清楚的重点。",
    method:
      "升级顺序：写准基础句 → 确定信息关系 → 选择一种升级结构 → 检查主语、连接词和标点 → 必要时拆回两句。",
  },
};
function getGrade12Mode(title) {
  if (/语法填空|改错|诊断/.test(title)) return grade12ModeConfigs.decision;
  if (/长难句|阅读中/.test(title)) return grade12ModeConfigs.reading;
  if (/写作|语篇衔接|考后复盘/.test(title)) return grade12ModeConfigs.writing;
  return grade12ModeConfigs.review;
}
const grade12Practice = {
  十类时态全景复盘: [
    ["She was cooking when her friend arrived.", "朋友到达时，她正在做饭。"],
    [
      "By the end of this year, we will have completed the project.",
      "到今年年底，我们将完成这个项目。",
    ],
  ],
  完成时与完成进行时辨析: [
    [
      "They have repaired four bicycles today.",
      "他们今天已经修好了四辆自行车。",
    ],
    [
      "They have been repairing bicycles since morning.",
      "他们从早上起一直在修自行车。",
    ],
  ],
  一般过去时与过去完成时: [
    [
      "After he checked the map, he chose a different road.",
      "他查看地图后选择了另一条路。",
    ],
    [
      "We discovered that someone had opened the window.",
      "我们发现有人之前打开了窗户。",
    ],
  ],
  将来表达与时态呼应: [
    ["Look at those clouds; it is going to rain.", "看那些云，天要下雨了。"],
    ["I will wait here until the doctor returns.", "我会在这里等到医生回来。"],
  ],
  全时态被动与主动表被动: [
    ["The results will be announced next Monday.", "结果将在下周一公布。"],
    ["This kind of pen writes smoothly.", "这种笔写起来很流畅。"],
  ],
  名词性从句完整复盘: [
    [
      "Whether we can succeed depends on our preparation.",
      "我们能否成功取决于准备情况。",
    ],
    [
      "I find it amazing that she remembers every name.",
      "她记得每一个名字，我觉得很惊讶。",
    ],
  ],
  同位语从句与定语从句: [
    [
      "The hope that everyone would return safely kept us calm.",
      "大家都能平安归来的希望让我们保持镇定。",
    ],
    [
      "The hope that she expressed encouraged the team.",
      "她表达的希望鼓舞了团队。",
    ],
  ],
  状语从句与省略: [
    [
      "If properly stored, the food will remain fresh.",
      "如果妥善储存，这些食物会保持新鲜。",
    ],
    [
      "Even though the task was difficult, nobody gave up.",
      "尽管任务困难，没有人放弃。",
    ],
  ],
  "倍数、比较与结果结构": [
    [
      "The new playground is three times as large as the old one.",
      "新操场是旧操场的三倍大。",
    ],
    [
      "There were so many questions that we needed more time.",
      "问题太多了，我们需要更多时间。",
    ],
  ],
  非谓语功能与固定搭配: [
    ["Please remember to lock the classroom door.", "请记得锁教室门。"],
    [
      "I heard someone singing in the next room.",
      "我听见有人正在隔壁房间唱歌。",
    ],
  ],
  非谓语时态与语态: [
    ["She appears to have solved the problem.", "她似乎已经解决了这个问题。"],
    [
      "Having completed the survey, we began to analyze the data.",
      "完成调查后，我们开始分析数据。",
    ],
  ],
  "独立主格、with 结构与从句转化": [
    [
      "Time permitting, we will visit the science museum.",
      "如果时间允许，我们将参观科学博物馆。",
    ],
    [
      "With several questions unanswered, the discussion continued.",
      "由于还有几个问题没有解决，讨论继续进行。",
    ],
  ],
  虚拟语气完整复盘: [
    [
      "If I had followed your advice, I would not be worried now.",
      "如果我当时听了你的建议，现在就不会担心了。",
    ],
    [
      "Were I given another chance, I would make a different choice.",
      "如果再给我一次机会，我会作出不同的选择。",
    ],
  ],
  情态动词完成式: [
    [
      "The lights are off; they may have gone to bed.",
      "灯关着，他们可能已经睡觉了。",
    ],
    [
      "You should have told us about the change earlier.",
      "你本应该早点告诉我们这个变化。",
    ],
  ],
  "倒装、强调与省略替代": [
    [
      "Rarely do we see such a clear night sky.",
      "我们很少看到如此清澈的夜空。",
    ],
    [
      "It was her patience that impressed the children most.",
      "最打动孩子们的是她的耐心。",
    ],
  ],
  "冠词、代词与名词指代": [
    [
      "Learning a second language can be a challenge.",
      "学习第二语言可能是一项挑战。",
    ],
    [
      "I tried two methods, but neither worked.",
      "我尝试了两种方法，但都没有奏效。",
    ],
  ],
  "主谓一致、形副与连接关系": [
    [
      "Fifty percent of the land is covered by forest.",
      "百分之五十的土地被森林覆盖。",
    ],
    [
      "The instructions were simple; however, he read them carefully.",
      "说明很简单，不过他仍然认真阅读了。",
    ],
  ],
  "语法填空：谓语与非谓语决策": [
    [
      "Surrounded by trees, the small house looks peaceful.",
      "这座被树木环绕的小房子看起来很安静。",
    ],
    [
      "The festival attracts visitors who come from different countries.",
      "这个节日吸引了来自不同国家的游客。",
    ],
  ],
  "语法填空：无提示词决策": [
    [
      "This is the village where my grandfather was born.",
      "这就是我祖父出生的村庄。",
    ],
    [
      "She developed an interest in astronomy at an early age.",
      "她很小就对天文学产生了兴趣。",
    ],
  ],
  改错与易错诊断: [
    [
      "One of my classmates has won the competition.",
      "我的一位同学赢得了比赛。",
    ],
    [
      "The teacher advised us to review our notes every evening.",
      "老师建议我们每天晚上复习笔记。",
    ],
  ],
  长难句分层与嵌套还原: [
    [
      "The question is whether the solution proposed by the team can reduce waste.",
      "问题是团队提出的方案能否减少浪费。",
    ],
    [
      "The scientist whose work inspired the project will speak tomorrow.",
      "其研究启发了这个项目的科学家明天将发表讲话。",
    ],
  ],
  阅读中的句法与逻辑关系: [
    [
      "While the method is inexpensive, it is not suitable for every situation.",
      "虽然这种方法成本低，但并不适合所有情况。",
    ],
    [
      "The policy seemed strict; however, it produced positive results.",
      "这项政策看似严格，却产生了积极结果。",
    ],
  ],
  "写作：从句与复合句升级": [
    [
      "What I value most is the friendship we built during the activity.",
      "我最珍视的是我们在活动中建立的友谊。",
    ],
    [
      "The library, which reopened last month, now offers more study space.",
      "上个月重新开放的图书馆现在提供了更多学习空间。",
    ],
  ],
  "写作：非谓语与特殊句式": [
    [
      "Faced with an unexpected problem, we worked together to solve it.",
      "面对意外问题，我们共同努力解决了它。",
    ],
    [
      "Only through regular practice can we make steady progress.",
      "只有通过经常练习，我们才能稳步进步。",
    ],
  ],
  语篇衔接与考后复盘: [
    [
      "The plan saves time; moreover, it reduces unnecessary costs.",
      "这个方案节省时间，而且减少了不必要的成本。",
    ],
    [
      "After checking my mistakes, I wrote down the reason for each one.",
      "检查错题后，我写下了每道错题的原因。",
    ],
  ],
};
function getGrade12QuestionText(question) {
  if (!question) return "";
  if (/[A-Za-z]{3}/.test(question.prompt)) return question.prompt;
  return "";
}
function fillGrade12Question(prompt, choice) {
  if (!prompt?.includes("___")) return choice;
  const parts = choice.split(";").map((part) => part.trim());
  let index = 0;
  return prompt
    .replace(/___/g, () => parts[Math.min(index++, parts.length - 1)] || choice)
    .replace(/\s*\([A-Za-z]+\)/g, "");
}
function createGrade12Enhancement(topic) {
  const mode = getGrade12Mode(topic.title);
  const highlights = getGrade10Highlights(topic);
  const examples = topic.examples || [];
  const rules = topic.rules || [];
  const question = topic.question;
  const questionText = getGrade12QuestionText(question);
  const wrongChoice =
    question?.choices?.find((choice) => choice !== question.answer) || "";
  return {
    knowledge: [
      {
        title: mode.titles[0],
        points: [mode.intro, topic.summary].filter(Boolean),
        highlights,
        examples: [
          makeGrade11Example(
            examples[0],
            "考场先识别",
            rules[0] || "先判断这句话把考点放在了哪里。",
            highlights
          ),
        ].filter(Boolean),
      },
      {
        title: mode.titles[1],
        points: rules.slice(0, 2),
        highlights,
        examples: [
          makeGrade11Example(
            examples[1],
            "放在一起比较",
            rules[1] || "比较两个形式表达的时间、成分或逻辑差异。",
            highlights,
            "contrast"
          ),
        ].filter(Boolean),
      },
      {
        title: mode.titles[2],
        points: [...rules.slice(2), mode.method],
        highlights,
        examples: questionText
          ? [
              {
                label: "限时找证据",
                sentence: questionText,
                translation: "先不急着选，圈出真正决定答案的词和句子结构。",
                note: question?.explanation,
                highlights,
                tone: "contrast",
              },
            ]
          : [],
      },
      {
        title: mode.titles[3],
        points: [topic.mistake].filter(Boolean),
        highlights,
        examples: question
          ? [
              {
                label: "正确形式",
                sentence: fillGrade12Question(question.prompt, question.answer),
                translation: `正确答案：${question.answer}`,
                note: question.explanation,
                highlights: [...highlights, question.answer],
                tone: "correct",
              },
            ]
          : [],
      },
      {
        title: "五、给错题贴标签并完成变式复盘",
        points: [
          "做错后不要只抄正确答案，要记录自己错在考点识别、结构判断、时间语态、搭配还是逻辑关系。",
          "复盘时遮住答案重新做一次，再换一个主语、时间或语境完成变式，确认自己掌握的是判断方法。",
        ],
        highlights,
        examples:
          wrongChoice && question.prompt?.includes("___")
            ? [
                {
                  label: "干扰项为什么错",
                  sentence: fillGrade12Question(question.prompt, wrongChoice),
                  translation:
                    "这是本题中的干扰形式，不要只因为它看起来熟悉就选择。",
                  note: `回到原句检查：${question.explanation}`,
                  highlights,
                  tone: "wrong",
                },
              ]
            : [],
      },
    ],
    practice: grade12Practice[topic.title] || [],
  };
}
const grade12Topics =
  D.find((level) => level.id === "grade12")?.topics.filter(
    (topic) => topic.title !== "定语从句高级辨析"
  ) || [];
const grade12GrammarEnhancements = Object.fromEntries(
  grade12Topics.map((topic) => [topic.title, createGrade12Enhancement(topic)])
);
const grammarEnhancements = {
  ...basicGrammarEnhancements,
  "be 动词": beVerbEnhancement,
  名词单复数: nounPluralEnhancement,
  人称与物主代词: {
    knowledge: [
      {
        title: "一、先弄懂：代词是做什么的",
        points: [
          "代词就是“代替名字的词”。为了不一直重复“小明、小明、小明”，我们可以用 he（他）来代替小明。",
          "人称代词表示“谁”；物主代词表示“谁的”。先问自己“是哪个人”，还是“东西属于谁”，就不容易选错。",
        ],
      },
      {
        title: "二、逐个概念讲解",
        points: [
          "1. 人称代词主格：放在动作前面，表示“谁来做”。I 我、you 你/你们、he 他、she 她、it 它、we 我们、they 他们/她们/它们。",
          "2. 人称代词宾格：放在动词或介词后面，表示“动作对谁做”。me 我、you 你/你们、him 他、her 她、it 它、us 我们、them 他们/她们/它们。",
          "3. 形容词性物主代词：表示“谁的”，后面必须带一个名词。my book 我的书、your bag 你的书包、their classroom 他们的教室。",
          "4. 名词性物主代词：也表示“谁的”，但它自己就能代替“物主代词＋名词”，后面不能再接名词。This book is mine. 这本书是我的。",
        ],
      },
      {
        title: "三、四组词放在一起记",
        points: [
          "我：I → me → my → mine；我们：we → us → our → ours。",
          "你/你们：you → you → your → yours。",
          "他：he → him → his → his；她：she → her → her → hers；它：it → it → its（通常没有单独使用的名词性形式）。",
          "他们：they → them → their → theirs。",
        ],
      },
      {
        title: "四、看位置就能选对",
        points: [
          "句子开头、动作前面，通常选主格：She likes music. 她喜欢音乐。",
          "动词或介词后面，通常选宾格：Please help me. 请帮助我。This gift is for him. 这份礼物是给他的。",
          "空格后面紧跟名词，选形容词性物主代词：This is our classroom.",
          "空格后面没有名词，而且要表达“某人的东西”，选名词性物主代词：The classroom is ours.",
        ],
      },
      {
        title: "五、给孩子的记忆口诀",
        points: [
          "主格站前面，负责做事情；宾格跟后面，动作落到谁。",
          "有名词，用 my、your、his；没名词，用 mine、yours、his。",
          "男他 he，女她 she，动物物品常用 it；你和你们都是 you，复数他们要用 they。",
        ],
      },
      {
        title: "六、最容易混淆的三组",
        points: [
          "I 和 me：I am happy. √；Me am happy. ×。I 做主语，me 放在动词或介词后。",
          "we、us 和 our：We like English.；The teacher helps us.；Our teacher is kind.",
          "they、them 和 their：They play football.；I know them.；Their football is new.",
        ],
      },
      {
        title: "七、做题时按这三步判断",
        points: [
          "第一步：看空格表示“谁”还是“谁的”。",
          "第二步：表示“谁”时，看它在动作前还是动作后；动作前选主格，动作后选宾格。",
          "第三步：表示“谁的”时，看后面有没有名词；有名词选 my/your/our 等，没有名词选 mine/yours/ours 等。",
        ],
      },
    ],
    practice: [
      ["She often plays games with me.", "她经常和我一起玩游戏。"],
      ["Our English teacher is very kind.", "我们的英语老师很亲切。"],
      ["These crayons are theirs.", "这些蜡笔是他们的。"],
      ["Can you help us carry the books?", "你能帮我们搬这些书吗？"],
    ],
  },
  一般现在时: {
    knowledge: [
      {
        title: "一、先想生活场景：什么时候用",
        points: [
          "每天、经常、总是做的事，用一般现在时：I go to school every day. 我每天去上学。",
          "不会因为“此刻”而改变的状态，也用一般现在时：She likes music. 她喜欢音乐。",
          "大家都知道的事实和规律，也用一般现在时：The sun rises in the east. 太阳从东方升起。",
        ],
      },
      {
        title: "二、先分清主语属于哪一队",
        points: [
          "第一队是 I、you、we、they 和复数名词，后面的动词用原形：We play football.",
          "第二队是 he、she、it、一个人或一个东西，动词要变成第三人称单数：Tom plays football.",
          "做题先圈出主语，不要一看到动词就急着加 -s。",
        ],
      },
      {
        title: "三、第三人称单数怎样变化",
        points: [
          "一般直接加 -s：play → plays，read → reads。",
          "以 s、x、sh、ch、o 结尾，通常加 -es：wash → washes，go → goes。",
          "辅音字母加 y 结尾，变 y 为 i 再加 -es：study → studies；元音字母加 y 直接加 -s：play → plays。",
          "特殊变化要单独记：have → has。",
        ],
      },
      {
        title: "四、肯定、否定和疑问怎么变",
        points: [
          "肯定句：主语 + 动词。He likes apples.",
          "否定句：I/you/we/they 用 don't；he/she/it 用 doesn't。He doesn't like apples.",
          "一般疑问句：Do/Does 放句首。Does he like apples?",
          "记住：does 或 doesn't 已经带走了 -s，后面的动词必须恢复原形。不能说 Does he likes。",
        ],
      },
      {
        title: "五、看到这些词要想到一般现在时",
        points: [
          "频率词：always 总是、usually 通常、often 经常、sometimes 有时、never 从不。",
          "时间短语：every day、every week、on Sundays、once a week。",
          "提示词只是线索，最后还要看句子是不是在说习惯、状态或事实。",
        ],
      },
      {
        title: "六、给孩子的记忆口诀",
        points: [
          "经常习惯和真理，一般现在来帮你。",
          "我你我们和他们，动词原形跟后面；他她它和一个，动词后面加 s。",
          "否定疑问请 do 帮，三单主语 does 上；does 一来 s 走，动词马上变原形。",
        ],
      },
      {
        title: "七、最容易做错的地方",
        points: [
          "He go to school. × 应为 He goes to school.",
          "He doesn't goes to school. × 应为 He doesn't go to school.",
          "一般现在时不等于“此刻正在做”。Look! He is running. 要用现在进行时。",
        ],
      },
      {
        title: "八、做题三步法",
        points: [
          "第一步：看是不是习惯、状态或客观事实。",
          "第二步：圈主语，判断是原形队还是第三人称单数队。",
          "第三步：如果有 do、does、don't、doesn't，后面的动词一律用原形。",
        ],
      },
    ],
    practice: [
      ["My father goes to work by bus.", "我的爸爸乘公共汽车上班。"],
      ["We do not watch TV on school nights.", "上学日的晚上我们不看电视。"],
      ["Does Amy read English every morning?", "埃米每天早晨读英语吗？"],
      [
        "The little dog likes sleeping under the table.",
        "这只小狗喜欢睡在桌子下面。",
      ],
    ],
  },
  一般过去时: {
    knowledge: [
      {
        title: "一、先看时间：事情已经结束了吗",
        points: [
          "昨天、上周、去年发生并已经结束的事，用一般过去时：I visited Grandma yesterday.",
          "讲故事时，按顺序叙述过去发生的动作，也常用一般过去时：He opened the door and walked in.",
          "过去经常做、现在不一定还做的事，也能用一般过去时：We often played outside when we were young.",
        ],
      },
      {
        title: "二、be 动词和实义动词要分开",
        points: [
          "句子里是 am/is/are，过去式要变成 was 或 were：I/he/she/it 用 was；you/we/they 用 were。",
          "句子里是 play、go、see 等实义动词，要把动词变成过去式：play → played，go → went。",
          "先找句子的动词，再决定走“was/were”还是“动词过去式”这条路。",
        ],
      },
      {
        title: "三、规则动词怎样加 -ed",
        points: [
          "一般直接加 -ed：work → worked，play → played。",
          "以不发音的 e 结尾，只加 -d：live → lived，dance → danced。",
          "辅音字母加 y 结尾，变 y 为 i 再加 -ed：study → studied；play 直接变 played。",
          "重读闭音节末尾只有一个辅音字母，通常双写再加 -ed：stop → stopped。",
        ],
      },
      {
        title: "四、不规则过去式要一组组记",
        points: [
          "完全变化：go → went，see → saw，eat → ate，take → took。",
          "元音变化：sing → sang，drink → drank，begin → began。",
          "形状不变：put → put，cut → cut，read → read（过去式读 /red/）。",
          "不要给不规则动词再加 -ed：wented、eated 都是错的。",
        ],
      },
      {
        title: "五、否定句和疑问句请 did 帮忙",
        points: [
          "否定句：主语 + didn't + 动词原形。Tom didn't finish his homework.",
          "疑问句：Did + 主语 + 动词原形？Did you see the film?",
          "did 已经表示过去，后面的动词必须恢复原形：Did she go? √；Did she went? ×。",
          "be 动词不找 did：Was she at home?；They weren't late.",
        ],
      },
      {
        title: "六、过去时间标志词",
        points: [
          "yesterday、yesterday morning、the day before yesterday。",
          "last night、last week、last year；two days ago、a moment ago。",
          "in 2020、when I was six 等明确表示过去的时间。",
        ],
      },
      {
        title: "七、给孩子的记忆口诀",
        points: [
          "过去事情已完成，动词要穿过去衣。",
          "规则动词加 ed，不规则变化单独记。",
          "否定疑问 did 来，did 一出现，动词原形站出来。",
        ],
      },
      {
        title: "八、一般过去时和现在进行时别混淆",
        points: [
          "I played basketball yesterday. 表示昨天打过，现在已经结束。",
          "I am playing basketball now. 表示此刻正在打，还没有结束。",
          "判断关键不是动作是什么，而是动作发生在过去还是正在发生。",
        ],
      },
      {
        title: "九、做题三步法",
        points: [
          "第一步：圈出过去时间词，确认事情已经结束。",
          "第二步：判断句子用 was/were，还是实义动词过去式。",
          "第三步：看到 did 或 didn't，立刻把后面的动词改回原形。",
        ],
      },
    ],
    practice: [
      ["We visited the museum yesterday.", "我们昨天参观了博物馆。"],
      ["Tom did not finish his homework last night.", "汤姆昨晚没有完成作业。"],
      ["Did you see that film last week?", "你上周看那部电影了吗？"],
      [
        "My sister made a birthday card for Mum.",
        "我妹妹给妈妈做了一张生日卡片。",
      ],
    ],
  },
  一般将来时: {
    knowledge: [
      {
        title: "一、will 与 be going to",
        points: [
          "will + 动词原形常表示临时决定、预测或承诺。",
          "be going to + 动词原形常表示已经计划好的事情或有迹象的预测。",
        ],
      },
      {
        title: "二、句式变化",
        points: [
          "will not 可缩写为 won't；疑问句把 will 放在主语前。",
          "be going to 的否定和疑问仍然围绕 am、is、are 变化。",
        ],
      },
    ],
    practice: [
      ["I will help you with your English.", "我会帮助你学习英语。"],
      ["We are going to have a picnic tomorrow.", "我们明天打算去野餐。"],
      ["Will they come to the party?", "他们会来参加聚会吗？"],
    ],
  },
  现在进行时: {
    knowledge: [
      {
        title: "一、先看画面：动作正在发生吗",
        points: [
          "像看一张正在动的照片：动作此刻正在发生，就用现在进行时。Look! The boy is running.",
          "也可以表示现阶段正在做、但不一定就在说话这一秒做的事：I am reading a long story this week.",
          "已经安排好的近期活动有时也能用现在进行时：We are meeting our teacher tomorrow.",
        ],
      },
      {
        title: "二、句子必须有两个零件",
        points: [
          "第一个零件是 be 动词：I 用 am，he/she/it 和单数用 is，you/we/they 和复数用 are。",
          "第二个零件是动词-ing：play → playing，read → reading。",
          "两个零件缺一不可：He playing. ×；He is play. ×；He is playing. √。",
        ],
      },
      {
        title: "三、动词怎样变成 -ing",
        points: [
          "一般直接加 -ing：play → playing，read → reading。",
          "以不发音的 e 结尾，去 e 再加 -ing：make → making，write → writing。",
          "以 ie 结尾，变 ie 为 y 再加 -ing：lie → lying，die → dying。",
          "重读闭音节末尾只有一个辅音字母，双写再加 -ing：run → running，swim → swimming。",
        ],
      },
      {
        title: "四、肯定、否定和疑问怎么变",
        points: [
          "肯定句：主语 + am/is/are + 动词-ing。They are drawing.",
          "否定句：在 be 后加 not。They are not drawing.",
          "疑问句：把 be 放到主语前。Are they drawing?",
          "简短回答也用 be：Yes, they are. / No, they aren't.",
        ],
      },
      {
        title: "五、这些词会提醒你“正在发生”",
        points: [
          "now、right now、at the moment 表示现在、此刻。",
          "Look!、Listen! 常提醒你眼前有动作正在发生。",
          "Where is Tom? 这类问题后若回答他此刻在做什么，也常用现在进行时。",
        ],
      },
      {
        title: "六、有些动词通常不说“正在”",
        points: [
          "like、love、know、want、need、understand 等常表示感觉、想法或状态，初学阶段通常不用进行时。",
          "I like apples. √；I am liking apples. ×（初学常规用法）。",
          "I know the answer. √；I am knowing the answer. ×。",
        ],
      },
      {
        title: "七、给孩子的记忆口诀",
        points: [
          "现在正在做，进行时来报到；be 动词不能少，动作后面 ing。",
          "我用 am，你用 are，is 跟着他她它；单数 is，复数 are。",
          "变否定，be 后 not；变疑问，be 往前跑。",
        ],
      },
      {
        title: "八、和一般现在时对比",
        points: [
          "He plays football every Sunday. 表示每周日的习惯，用一般现在时。",
          "He is playing football now. 表示此刻正在踢，用现在进行时。",
          "看到 every day 想“经常”，看到 now 想“正在”，但最终要根据句子意思判断。",
        ],
      },
      {
        title: "九、做题三步法",
        points: [
          "第一步：判断动作是不是此刻或现阶段正在发生。",
          "第二步：根据主语选 am、is 或 are。",
          "第三步：检查动词有没有正确变成 -ing，句子里两个零件是否都在。",
        ],
      },
    ],
    practice: [
      ["The children are playing in the park.", "孩子们正在公园里玩。"],
      ["I am not using the computer now.", "我现在没有使用电脑。"],
      ["Is she listening to music?", "她正在听音乐吗？"],
      ["Look! Our cat is climbing the tree.", "看！我们的猫正在爬树。"],
    ],
  },
  现在完成时: {
    knowledge: [
      {
        title: "一、基本结构与意义",
        points: [
          "have / has + 过去分词，强调过去动作与现在的联系。",
          "可以表示经历、已经完成的结果，或从过去持续到现在的状态。",
        ],
      },
      {
        title: "二、常见标志词",
        points: [
          "already 常用于肯定句；yet 常用于否定句和疑问句。",
          "ever、never 表示经历；for 接一段时间，since 接时间起点。",
        ],
      },
    ],
    practice: [
      ["I have already finished my homework.", "我已经完成作业了。"],
      ["She has lived here for five years.", "她已经在这里住了五年。"],
      ["Have you ever been to Beijing?", "你曾经去过北京吗？"],
    ],
  },
  宾语从句: {
    knowledge: [
      {
        title: "一、什么是宾语从句",
        points: [
          "一个完整句子放在动词后作宾语，就是宾语从句。",
          "陈述事实常用 that；一般疑问意义常用 if 或 whether；特殊疑问保留疑问词。",
        ],
      },
      {
        title: "二、必须使用陈述语序",
        points: [
          "从句使用“主语 + 谓语”，不能继续使用疑问句倒装。",
          "I don't know where he is. √；不能说 where is he。",
        ],
      },
      {
        title: "三、时态呼应",
        points: [
          "主句是现在时，从句根据实际情况选择时态。",
          "主句是过去时，从句通常使用相应的过去时；客观真理仍用一般现在时。",
        ],
      },
    ],
    practice: [
      ["I think that this book is interesting.", "我认为这本书很有趣。"],
      ["Could you tell me where the station is?", "你能告诉我车站在哪里吗？"],
      ["She asked whether I needed help.", "她问我是否需要帮助。"],
    ],
  },
  定语从句: {
    knowledge: [
      {
        title: "一、定语从句修饰名词",
        points: [
          "被修饰的名词叫先行词，后面的从句说明“是哪一个人或物”。",
          "who 常指人，which 常指物，that 可以指人或物。",
        ],
      },
      {
        title: "二、关系词在从句中有成分",
        points: [
          "关系代词可在从句中作主语或宾语；作宾语时有时可以省略。",
          "where、when、why 分别表示地点、时间和原因。",
        ],
      },
    ],
    practice: [
      ["The girl who is singing is my sister.", "正在唱歌的女孩是我的妹妹。"],
      ["This is the book that I borrowed yesterday.", "这就是我昨天借的书。"],
      [
        "I remember the day when we first met.",
        "我记得我们第一次见面的那一天。",
      ],
    ],
  },
  状语从句: {
    knowledge: [
      {
        title: "一、状语从句说明逻辑关系",
        points: [
          "它可以说明时间、条件、原因、结果、目的、让步等关系。",
          "when / while 表时间，if / unless 表条件，because 表原因，although 表让步。",
        ],
      },
      {
        title: "二、主将从现",
        points: [
          "时间和条件状语从句谈论将来时，从句通常用一般现在时。",
          "If it rains tomorrow, we will stay at home.",
        ],
      },
    ],
    practice: [
      ["I will call you when I arrive.", "我到达时会给你打电话。"],
      [
        "If you study hard, you will make progress.",
        "如果你努力学习，你就会进步。",
      ],
      ["Although he was tired, he kept working.", "尽管他很累，他仍继续工作。"],
    ],
  },
  时间状语从句: makeAdverbialClauseEnhancement(
    "时间状语从句",
    "说明主句动作发生的时间，可以表达“当……时、在……之前、直到……”等关系。",
    "when、while、before、after、until、as soon as、since",
    [
      "when 后可接短动作或长动作；while 常强调两个持续动作同时发生。",
      "谈论将来时，时间从句通常用一般现在时，主句使用将来时。",
      "since 引导的时间起点常和现在完成时搭配。",
    ],
    [
      ["I will tell you as soon as he arrives.", "他一到，我就会告诉你。"],
      [
        "While Mum was cooking, I was doing my homework.",
        "妈妈做饭时，我正在写作业。",
      ],
      ["We waited until the rain stopped.", "我们一直等到雨停。"],
    ]
  ),
  地点状语从句: makeAdverbialClauseEnhancement(
    "地点状语从句",
    "说明主句动作发生的地点，意思是“在……的地方”或“无论在哪里”。",
    "where、wherever、anywhere",
    [
      "where 引导一个完整句子，不要和只接名词的介词 in、at 混淆。",
      "wherever 比 where 语气更强，表示“无论在哪里”。",
      "地点从句可以放在主句前，也可以放在主句后。",
    ],
    [
      [
        "Please sit where you can see the screen.",
        "请坐在你能看见屏幕的地方。",
      ],
      [
        "Wherever she goes, her dog follows her.",
        "无论她去哪里，她的狗都跟着她。",
      ],
      ["Put the book where it was.", "把书放回原来的地方。"],
    ]
  ),
  原因状语从句: makeAdverbialClauseEnhancement(
    "原因状语从句",
    "解释主句事情发生的原因，回答“为什么”。",
    "because、since、as",
    [
      "because 语气最直接，常回答 why 提出的问题。",
      "because 和 so 通常不能同时连接同一个句子。",
      "since、as 表示对方可能已经知道的原因，语气比 because 弱。",
    ],
    [
      [
        "We stayed inside because it was raining.",
        "因为下雨了，所以我们待在室内。",
      ],
      ["Since everyone is here, let's begin.", "既然大家都到了，我们开始吧。"],
      ["As it was late, we went home.", "由于时间晚了，我们回家了。"],
    ]
  ),
  条件状语从句: makeAdverbialClauseEnhancement(
    "条件状语从句",
    "说明主句成立需要满足的条件，意思是“如果……”或“除非……”。",
    "if、unless、as long as",
    [
      "谈论真实的将来条件时，常使用“主将从现”。",
      "unless 相当于 if ... not，本身已经含有否定意思。",
      "as long as 表示“只要”，强调满足一个基本条件。",
    ],
    [
      [
        "If you hurry, you will catch the bus.",
        "如果你快一点，就能赶上公共汽车。",
      ],
      [
        "You cannot enter unless you have a ticket.",
        "除非有票，否则你不能进入。",
      ],
      [
        "You can borrow it as long as you return it tomorrow.",
        "只要明天归还，你就可以借它。",
      ],
    ]
  ),
  让步状语从句: makeAdverbialClauseEnhancement(
    "让步状语从句",
    "表示虽然存在某种困难或事实，主句结果仍然发生。",
    "although、though、even though、even if",
    [
      "although / though 表示“虽然、尽管”，不能再和 but 同时连接主句。",
      "even though 强调已经存在的事实；even if 强调假设情况。",
      "让步从句放在句首时，后面通常使用逗号。",
    ],
    [
      [
        "Although the task was difficult, she finished it.",
        "尽管任务很难，她还是完成了。",
      ],
      [
        "Even though he is young, he is very responsible.",
        "虽然他年纪小，但很有责任心。",
      ],
      ["I will go even if it rains.", "即使下雨，我也会去。"],
    ]
  ),
  目的状语从句: makeAdverbialClauseEnhancement(
    "目的状语从句",
    "说明做某件事想达到的目的，回答“为了什么”。",
    "so that、in order that",
    [
      "目的从句中常使用 can、could、will、would、may 等情态动词。",
      "so that 较常用；in order that 更正式。",
      "可以和不定式表目的互换：He got up early to catch the bus.",
    ],
    [
      [
        "Speak slowly so that everyone can understand you.",
        "说慢一点，以便大家都能听懂。",
      ],
      [
        "She saved money in order that she could buy a bike.",
        "她存钱是为了买一辆自行车。",
      ],
      [
        "I wrote it down so that I would not forget it.",
        "我把它写下来，以免忘记。",
      ],
    ]
  ),
  结果状语从句: makeAdverbialClauseEnhancement(
    "结果状语从句",
    "说明前面的原因产生了什么结果，意思是“如此……以至于……”。",
    "so ... that、such ... that",
    [
      "so 后面通常接形容词或副词：so tired that ...。",
      "such 后面通常接名词短语：such a good book that ...。",
      "注意区分目的 so that 和结果 so ... that。",
    ],
    [
      [
        "The box was so heavy that I could not lift it.",
        "箱子太重了，我搬不起来。",
      ],
      [
        "It was such an interesting story that everyone listened quietly.",
        "这个故事如此有趣，大家都安静地听着。",
      ],
      [
        "He ran so fast that he won the race.",
        "他跑得非常快，因此赢得了比赛。",
      ],
    ]
  ),
  比较状语从句: makeAdverbialClauseEnhancement(
    "比较状语从句",
    "把两个对象、动作或程度放在一起比较。",
    "than、as ... as、not as / so ... as",
    [
      "比较级后常使用 than，表示“比……更……”。",
      "as + 原级 + as 表示“和……一样……”。",
      "为避免重复，比较从句中有些成分可以省略，但比较对象必须一致。",
    ],
    [
      ["Tom runs faster than I do.", "汤姆跑得比我快。"],
      ["This room is as bright as that one.", "这个房间和那个房间一样明亮。"],
      [
        "The test was not as difficult as we expected.",
        "考试没有我们预想的那么难。",
      ],
    ]
  ),
  方式状语从句: makeAdverbialClauseEnhancement(
    "方式状语从句",
    "说明动作是以什么方式完成的，意思是“按照……的样子”或“仿佛……”。",
    "as、as if、as though、the way",
    [
      "as 表示“按照、正如”，后面接完整句子。",
      "as if / as though 表示“好像”，可以描述真实感觉或不太可能的假设。",
      "不要把方式从句和只接名词的 like 混淆。",
    ],
    [
      ["Please do it as I showed you.", "请按照我演示的方式做。"],
      ["He talks as if he knew everything.", "他说起话来好像什么都知道。"],
      [
        "She arranged the books the way the teacher asked.",
        "她按照老师要求的方式整理了书。",
      ],
    ]
  ),
  ...grade8GrammarEnhancements,
  ...grade9GrammarEnhancements,
  ...grade10GrammarEnhancements,
  ...grade11GrammarEnhancements,
  ...grade12GrammarEnhancements,
};
function getGrammarEnhancement(title, topic) {
  const enhancement = grammarEnhancements[title] || {};
  const addition = getGrammarTopicAddition(title);
  if (!addition) return enhancement;
  const highlights = getGrammarAdditionHighlights(title);
  const makeExamples = (examples) =>
    (examples || []).map(([sentence, translation, note], index) => ({
      label: index === 0 ? "基础例句" : "例句分析",
      sentence,
      translation,
      note,
      highlights,
      tone: index > 0 ? "contrast" : "",
    }));
  if (!enhancement.knowledge) {
    return {
      ...enhancement,
      knowledge: [
        {
          title: addition.knowledgeTitle,
          points: topic.rules,
          highlights,
          examples: makeExamples(topic.examples),
        },
      ],
    };
  }
  return {
    ...enhancement,
    knowledge: [
      ...enhancement.knowledge,
      {
        title: addition.knowledgeTitle,
        points: addition.rules,
        highlights,
        examples: makeExamples(addition.examples),
      },
    ],
  };
}
const bridgeGrammarHighlights = {
  "be 动词": ["am", "is", "are", "was", "were", "be", "not", "been", "being"],
  名词单复数: [
    "-s",
    "-es",
    "books",
    "apples",
    "men",
    "women",
    "children",
    "feet",
    "teeth",
    "mice",
    "sheep",
    "deer",
    "There is",
    "There are",
  ],
  人称与物主代词: [
    "I",
    "me",
    "my",
    "mine",
    "he",
    "him",
    "his",
    "she",
    "her",
    "hers",
    "they",
    "them",
    "their",
    "theirs",
  ],
  一般现在时: [
    "do",
    "does",
    "don't",
    "doesn't",
    "play",
    "plays",
    "every day",
    "always",
    "usually",
    "often",
    "sometimes",
    "never",
  ],
  现在进行时: ["am", "is", "are", "-ing", "now", "Look", "Listen"],
  一般过去时: [
    "was",
    "were",
    "did",
    "didn't",
    "-ed",
    "yesterday",
    "last night",
    "last week",
    "ago",
  ],
};
const ruleExample = (
  sentence,
  translation,
  note,
  highlights = [],
  tone = ""
) => ({
  sentence,
  translation,
  note,
  highlights,
  tone,
});
const bridgeSectionExamples = {
  "be 动词": [
    [
      ruleExample(
        "I am a student. She is kind. They are ready.",
        "我是一名学生。她很友善。他们准备好了。",
        "主语不同，be 动词也跟着变化：I 配 am，she 配 is，they 配 are。",
        ["I am", "She is", "They are"]
      ),
    ],
    [
      ruleExample(
        "She is happy. She is not happy. Is she happy?",
        "她很开心。她不开心。她开心吗？",
        "肯定句保留 is；否定句在 is 后加 not；问句把 is 移到主语 she 前面。",
        ["is", "is not", "Is she"]
      ),
    ],
    [
      ruleExample(
        "I was at home. They were at school.",
        "我当时在家。他们当时在学校。",
        "am、is 的过去式是 was；are 的过去式是 were。",
        ["was", "were"]
      ),
    ],
    [
      ruleExample(
        "He is clever. This is a book. We are in the classroom.",
        "他很聪明。这是一本书。我们在教室里。",
        "be 后面可以接形容词、名词或地点介词短语，但不能直接接动作原形。",
        ["is clever", "is a book", "are in"]
      ),
    ],
    [
      ruleExample(
        "I will be ten next year. She has been here before.",
        "我明年十岁。她以前来过这里。",
        "will be 表示将来的状态；has been 是完成时形式，启蒙阶段先认识即可。",
        ["will be", "has been"]
      ),
    ],
  ],
  名词单复数: [
    [
      ruleExample(
        "I have one book. Tom has two books.",
        "我有一本书。汤姆有两本书。",
        "one 后用单数 book；two 表示多个，所以用复数 books。",
        ["one book", "two books"]
      ),
    ],
    [
      ruleExample(
        "one cat → two cats; one box → two boxes",
        "一只猫→两只猫；一个盒子→两个盒子。",
        "大多数名词加 -s；以 x 等音结尾时常加 -es。",
        ["cats", "boxes"]
      ),
    ],
    [
      ruleExample(
        "city → cities; boy → boys; knife → knives",
        "城市→城市们；男孩→男孩们；小刀→小刀们。",
        "辅音+y 常变 ies；元音+y 直接加 s；部分 f/fe 变 ves。",
        ["cities", "boys", "knives"]
      ),
    ],
    [
      ruleExample(
        "one child → two children; one sheep → two sheep",
        "一个孩子→两个孩子；一只绵羊→两只绵羊。",
        "children 是不规则复数；sheep 的单数和复数形式相同。",
        ["children", "sheep"]
      ),
    ],
    [
      ruleExample(
        "There is a dog. There are two dogs.",
        "有一只狗。有两只狗。",
        "单数搭配 There is；复数搭配 There are。",
        ["There is", "There are"]
      ),
    ],
    [
      ruleExample(
        "The dog is small. The dogs are small.",
        "这只狗很小。这些狗很小。",
        "单数主语配 is，复数主语配 are。",
        ["dog is", "dogs are"]
      ),
    ],
    [
      ruleExample(
        "box → boxes; city → cities; child → children",
        "盒子、城市和孩子的复数变化示例。",
        "先看词尾，再判断加 s、es、变 ies，还是属于不规则变化。",
        ["boxes", "cities", "children"]
      ),
    ],
  ],
  人称与物主代词: [
    [
      ruleExample(
        "Lucy is my friend. She is kind.",
        "露西是我的朋友。她很友善。",
        "第二句用 She 代替 Lucy，避免重复名字。",
        ["She"]
      ),
    ],
    [
      ruleExample(
        "I like her. This is my book. That book is mine.",
        "我喜欢她。这是我的书。那本书是我的。",
        "I 是主格，her 是宾格，my 后接名词，mine 单独使用。",
        ["I", "her", "my", "mine"]
      ),
    ],
    [
      ruleExample(
        "I → me → my → mine",
        "我（主格）→我（宾格）→我的（接名词）→我的（单独用）。",
        "把同一个人的四种形式横着记，更容易看清位置变化。",
        ["I", "me", "my", "mine"]
      ),
    ],
    [
      ruleExample(
        "She helps me. I help her.",
        "她帮助我。我帮助她。",
        "动作前用主格 She/I；动作后用宾格 me/her。",
        ["She", "me", "I", "her"]
      ),
    ],
    [
      ruleExample(
        "动作前用 I，动作后用 me，名词前用 my。",
        "用位置判断代词形式。",
        "先找动作，再看代词在动作前、动作后还是名词前。",
        ["I", "me", "my"]
      ),
    ],
    [
      ruleExample(
        "This is my book. This book is mine.",
        "这是我的书。这本书是我的。",
        "my 后面必须接 book；mine 已经包含“我的东西”，后面不再接名词。",
        ["my book", "is mine"]
      ),
    ],
    [
      ruleExample(
        "Tom helps ___. → me; ___ book is new. → My",
        "汤姆帮助我；我的书是新的。",
        "空格在动作后选 me；空格在名词 book 前选 My。",
        ["me", "My"]
      ),
    ],
  ],
  一般现在时: [
    [
      ruleExample(
        "I go to school every day. The sun rises in the east.",
        "我每天上学。太阳从东方升起。",
        "经常发生的习惯和客观事实都用一般现在时。",
        ["every day", "rises"]
      ),
    ],
    [
      ruleExample(
        "I play football. He plays football.",
        "我踢足球。他踢足球。",
        "I 后用 play；主语换成 He，动词要变成 plays。",
        ["I play", "He plays"]
      ),
    ],
    [
      ruleExample(
        "play → plays; study → studies; go → goes",
        "玩、学习和去的第三人称单数变化。",
        "一般加 s；辅音+y 变 ies；部分词尾加 es。",
        ["plays", "studies", "goes"]
      ),
    ],
    [
      ruleExample(
        "He likes apples. He doesn't like apples. Does he like apples?",
        "他喜欢苹果。他不喜欢苹果。他喜欢苹果吗？",
        "doesn't 或 Does 出现后，后面的动词恢复原形 like。",
        ["likes", "doesn't like", "Does he like"]
      ),
    ],
    [
      ruleExample(
        "She often reads books. We play every Sunday.",
        "她经常读书。我们每周日玩。",
        "often、every Sunday 等词提示习惯性动作。",
        ["often", "every Sunday"]
      ),
    ],
    [
      ruleExample(
        "经常习惯和真理，一般现在来帮你。",
        "一般现在时记忆口诀。",
        "口诀只帮助判断，最后仍要检查主语是不是 he、she、it。",
        ["一般现在"]
      ),
    ],
    [
      ruleExample(
        "He plays football. Does he play football?",
        "他踢足球。他踢足球吗？",
        "肯定句用 plays；Does 已承担变化，问句中用 play。",
        ["plays", "Does", "play"]
      ),
    ],
    [
      ruleExample(
        "every day → He reads; now → He is reading",
        "每天→他阅读；现在→他正在阅读。",
        "先找时间提示，再决定用一般现在时还是现在进行时。",
        ["every day", "reads", "now", "is reading"]
      ),
    ],
  ],
  现在进行时: [
    [
      ruleExample(
        "Look! The boy is running.",
        "看！这个男孩正在跑步。",
        "Look 提醒我们观察眼前动作，is running 表示此刻正在发生。",
        ["Look", "is running"]
      ),
    ],
    [
      ruleExample(
        "She is reading. They are playing.",
        "她正在阅读。他们正在玩。",
        "现在进行时有两个零件：be 动词和动词-ing，缺一不可。",
        ["is reading", "are playing"]
      ),
    ],
    [
      ruleExample(
        "read → reading; dance → dancing; run → running",
        "阅读、跳舞和跑步的 ing 变化。",
        "一般直接加 ing；不发音 e 常去掉；部分重读闭音节双写末字母。",
        ["reading", "dancing", "running"]
      ),
    ],
    [
      ruleExample(
        "He is running. He isn't running. Is he running?",
        "他正在跑。他没有在跑。他正在跑吗？",
        "否定在 be 后加 not；问句把 be 放到主语前。",
        ["is running", "isn't running", "Is he running"]
      ),
    ],
    [
      ruleExample(
        "Listen! She is singing now.",
        "听！她现在正在唱歌。",
        "Listen 和 now 都提示动作正在发生。",
        ["Listen", "is singing", "now"]
      ),
    ],
    [
      ruleExample(
        "I know the answer.",
        "我知道答案。",
        "know 表示状态，基础用法通常不说 I am knowing。",
        ["know"]
      ),
    ],
    [
      ruleExample(
        "正在做，be 先到，动作后面加 ing。",
        "现在进行时记忆口诀。",
        "先选 am/is/are，再把动作词变成 ing 形式。",
        ["be", "ing"]
      ),
    ],
    [
      ruleExample(
        "He plays on Sundays. He is playing now.",
        "他每周日都玩。他现在正在玩。",
        "习惯用一般现在时；眼前正在发生用现在进行时。",
        ["plays", "on Sundays", "is playing", "now"]
      ),
    ],
  ],
  一般过去时: [
    [
      ruleExample(
        "I visited Grandma yesterday.",
        "我昨天看望了奶奶。",
        "yesterday 表示事情已经结束，所以 visited 使用过去式。",
        ["visited", "yesterday"]
      ),
    ],
    [
      ruleExample(
        "She was at home. They played outside.",
        "她当时在家。他们在外面玩了。",
        "be 动词用 was/were；实义动词要变成过去式。",
        ["was", "played"]
      ),
    ],
    [
      ruleExample(
        "play → played; live → lived; study → studied",
        "玩、居住和学习的规则过去式变化。",
        "一般加 ed；以 e 结尾加 d；辅音+y 变 ied。",
        ["played", "lived", "studied"]
      ),
    ],
    [
      ruleExample(
        "go → went; see → saw; have → had",
        "去、看见和有的不规则过去式。",
        "不规则动词不能只加 ed，需要按常用组合记忆。",
        ["went", "saw", "had"]
      ),
    ],
    [
      ruleExample(
        "She went home. She didn't go home. Did she go home?",
        "她回家了。她没有回家。她回家了吗？",
        "didn't 或 Did 出现后，went 恢复为原形 go。",
        ["went", "didn't go", "Did she go"]
      ),
    ],
    [
      ruleExample(
        "yesterday; last week; two days ago",
        "昨天；上周；两天前。",
        "这些时间词通常提示一般过去时。",
        ["yesterday", "last week", "ago"]
      ),
    ],
    [
      ruleExample(
        "过去发生已结束，动作变成过去式。",
        "一般过去时记忆口诀。",
        "先找过去时间，再判断使用 was/were 还是动词过去式。",
        ["过去式"]
      ),
    ],
    [
      ruleExample(
        "He played yesterday. He is playing now.",
        "他昨天玩了。他现在正在玩。",
        "yesterday 对应一般过去时；now 对应现在进行时。",
        ["played", "yesterday", "is playing", "now"]
      ),
    ],
    [
      ruleExample(
        "Did she visit Grandma? → Yes, she did.",
        "她看望奶奶了吗？是的。",
        "看到 Did，句中动作使用原形 visit。",
        ["Did", "visit", "did"]
      ),
    ],
  ],
};
function renderGrammarText(text, highlights = []) {
  if (!highlights.length) return text;
  const escaped = highlights
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((item) => {
      const value = item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const leftBoundary = /^[A-Za-z0-9]/.test(item) ? "(?<![A-Za-z0-9])" : "";
      const rightBoundary = /[A-Za-z0-9]$/.test(item) ? "(?![A-Za-z0-9])" : "";
      return `${leftBoundary}${value}${rightBoundary}`;
    });
  if (!escaped.length) return text;
  const pattern = new RegExp(`(${escaped.join("|")})`, "g");
  const highlighted = new Set(highlights);
  return text
    .split(pattern)
    .map((part, index) =>
      highlighted.has(part)
        ? e.jsx(
            "strong",
            { className: "grammar-keyword", children: part },
            index
          )
        : part
    );
}
let currentGrammarExampleAudio = null;
let currentQuizAudio = null;
let appAudioVolume = 1;
function playQuizWordAudio(word) {
  const fileName = String(word || "").trim();
  if (!fileName) return;
  currentQuizAudio?.pause();
  currentQuizAudio = new Audio(
    `mp3/闯关练习/${encodeURIComponent(fileName)}.mp3`
  );
  currentQuizAudio.volume = appAudioVolume;
  currentQuizAudio.play().catch(() => {});
}
function getGrammarExampleAudioSrc(sentence) {
  const fileName = String(sentence || "")
    .trim()
    .replace(/[\/:*?"<>|]/g, "_")
    .slice(0, 80);
  return fileName
    ? `https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/例句/${encodeURIComponent(
        fileName
      )}.mp3`
    : "";
}
function playGrammarExampleAudio(sentence) {
  const src = getGrammarExampleAudioSrc(sentence);
  if (!src) return;
  currentGrammarExampleAudio?.pause();
  currentGrammarExampleAudio = new Audio(src);
  currentGrammarExampleAudio.volume = appAudioVolume;
  currentGrammarExampleAudio.play().catch(() => {});
}
let currentStarterAudio = null;
function playStarterLetterAudio(letter) {
  const name = String(letter || "")
    .trim()
    .charAt(0)
    .toUpperCase();
  if (!/^[A-Z]$/.test(name)) return;
  currentStarterAudio?.pause();
  currentStarterAudio = new Audio(
    `https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/26字母/${name}.mp3`
  );
  currentStarterAudio.volume = appAudioVolume;
  currentStarterAudio.play().catch(() => {});
}
function getStarterBasicAudioSrc(sentence) {
  const fileName = String(sentence || "")
    .trim()
    .replace(/[\/:*?"<>|]/g, "_")
    .slice(0, 80);
  return fileName
    ? `https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/english/mp3/启蒙基础/${encodeURIComponent(
        fileName
      )}.mp3`
    : "";
}
function playStarterBasicAudio(sentence) {
  const src = getStarterBasicAudioSrc(sentence);
  if (!src) return;
  currentStarterAudio?.pause();
  currentStarterAudio = new Audio(src);
  currentStarterAudio.volume = appAudioVolume;
  currentStarterAudio.play().catch(() => {});
}
function playStarterWordAudio(tag, word, sentence) {
  if (tag === "Letters") {
    playStarterLetterAudio(word);
    return;
  }
  if (tag === "Phonics") return;
  playStarterBasicAudio(sentence || word.replace(/\s*\.\.\.$/, ""));
}
function K(n) {
  return n
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9']+/g, " ")
    .trim();
}
function ke(n) {
  return n
    .replace(/[.,!?;:]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .reverse()
    .join(" · ");
}
const supplementalGrammarTopics = {
  exclamation: {
    title: "感叹句：What 与 How",
    term: "下册",
    summary: "用 What 或 How 表达惊讶、赞美和强烈感受。",
    rules: [
      "What + a/an + 形容词 + 可数名词单数：What a beautiful flower!",
      "What + 形容词 + 可数名词复数：What beautiful flowers!",
      "What + 形容词 + 不可数名词：What fine weather!",
      "How + 形容词/副词 + 主语 + 谓语：How beautiful the flower is!",
      "判断方法：中心词是名词常选 What，中心词是形容词或副词常选 How。",
    ],
    examples: [
      [
        "What a clever boy he is!",
        "他是一个多么聪明的男孩啊！",
        "中心部分是 a clever boy，因此使用 What。",
      ],
      ["How fast she runs!", "她跑得多快啊！", "fast 是副词，前面使用 How。"],
      [
        "What delicious food it is!",
        "这是多么美味的食物啊！",
        "food 是不可数名词，What 后面不使用 a/an。",
      ],
    ],
    mistake:
      "不要写 How a beautiful flower!；a beautiful flower 是名词短语，应使用 What。",
    question: {
      prompt: "___ exciting news it is!",
      choices: ["What", "What an", "How"],
      answer: "What",
      explanation: "news 是不可数名词，使用 What + 形容词 + 不可数名词。",
    },
  },
  determiners: {
    title: "常用限定词辨析",
    term: "上册",
    summary: "根据数量、范围和肯定或否定意义选择正确的限定词。",
    rules: [
      "both 表示两者都；all 表示三者或三者以上都。",
      "either 表示两者中的任意一个；neither 表示两者都不。",
      "each 强调逐个；every 强调整体中的每一个，后面都接可数名词单数。",
      "another 表示另一个；the other 表示两者中的另一个；others 表示其他人或物。",
      "a few/a little 表示还有一些；few/little 表示几乎没有。",
      "many 修饰可数名词复数；much 修饰不可数名词。",
    ],
    examples: [
      [
        "Both students are ready.",
        "两名学生都准备好了。",
        "范围只有两者并且表示都，使用 both。",
      ],
      [
        "Neither answer is correct.",
        "两个答案都不正确。",
        "neither 本身含否定意义，谓语通常用单数。",
      ],
      [
        "I have a few friends here.",
        "我在这里有几个朋友。",
        "a few 修饰可数名词，表达肯定的“有一些”。",
      ],
    ],
    mistake: "不要写 every students；every 后面接可数名词单数 student。",
    question: {
      prompt: "___ of the two answers is correct.",
      choices: ["Neither", "All", "Every"],
      answer: "Neither",
      explanation: "范围是两者，且两个答案都不正确，使用 Neither。",
    },
  },
  tagQuestion: {
    title: "反意疑问句",
    term: "下册",
    summary: "用“陈述句＋简短问句”确认信息或征求对方同意。",
    rules: [
      "基本原则是前肯后否、前否后肯：She is kind, isn't she?",
      "附加问句的人称代词要与前句主语一致。",
      "前句有 be、情态动词或助动词时，附加问句沿用它们。",
      "实义动词的一般现在时和一般过去时分别借助 do/does/did。",
      "There be 句型使用 there：There is a book, isn't there?",
      "祈使句常用 will you；Let's 开头常用 shall we。",
      "I think 后接从句时，附加问句通常根据从句判断。",
    ],
    examples: [
      [
        "Tom likes music, doesn't he?",
        "汤姆喜欢音乐，对吗？",
        "前句是肯定的一般现在时，主语 Tom 用 he，附加问句用 doesn't。",
      ],
      [
        "They weren't late, were they?",
        "他们没有迟到，对吗？",
        "前句是否定形式 weren't，后面使用肯定形式 were。",
      ],
      [
        "Let's go home, shall we?",
        "我们回家吧，好吗？",
        "Let's 开头的祈使句通常搭配 shall we。",
      ],
    ],
    mistake:
      "不要只看最后一个动词；先判断前句肯定或否定，再找对应助动词和代词。",
    question: {
      prompt: "She can swim, ___?",
      choices: ["can't she", "doesn't she", "can she"],
      answer: "can't she",
      explanation: "前句肯定且含 can，附加问句使用否定形式 can't she。",
    },
  },
  shortResponses: {
    title: "简短回答与附和表达",
    term: "下册",
    summary: "用正确的 be、助动词或情态动词完成简短回答和“我也是”。",
    rules: [
      "一般疑问句用相同的 be、助动词或情态动词回答：Yes, I am./No, I don't。",
      "肯定附和使用 So + be/助动词/情态动词 + 主语。",
      "否定附和使用 Neither/Nor + be/助动词/情态动词 + 主语。",
      "口语中可以说 Me too 和 Me neither，但正式结构要保持倒装。",
      "选择 be、do 还是情态动词，要根据前一句的谓语结构决定。",
    ],
    examples: [
      [
        "Do you like English? Yes, I do.",
        "你喜欢英语吗？是的。",
        "问句使用 do，简短回答也使用 do。",
      ],
      [
        "I am tired. So am I.",
        "我累了。我也是。",
        "前句谓语是 am，附和句使用 So am I。",
      ],
      [
        "I can't swim. Neither can I.",
        "我不会游泳。我也不会。",
        "否定句含 can，使用 Neither can I。",
      ],
    ],
    mistake: "不要写 So I do 来表达“我也是”；附和结构通常要倒装为 So do I。",
    question: {
      prompt: "Tom is a student. ___",
      choices: ["So am I.", "So do I.", "Neither am I."],
      answer: "So am I.",
      explanation: "前句使用 be 动词 is，肯定附和使用 So + be + 主语。",
    },
  },
  doubleObject: {
    title: "双宾语与宾语补足语",
    term: "下册",
    summary: "分清“给谁什么”和“让宾语变成什么”的两类动词结构。",
    rules: [
      "双宾语结构是动词 + 间接宾语 + 直接宾语：give me a book。",
      "部分双宾语可改为动词 + 物 + to/for + 人。",
      "give、show、send 常与 to 搭配；buy、make、cook 常与 for 搭配。",
      "宾语补足语补充说明宾语的身份、状态或动作：make me happy。",
      "名词、形容词、非谓语和介词短语都可能充当宾语补足语。",
      "判断方法：去掉后面的成分后，如果宾语意思不完整，通常需要宾补。",
    ],
    examples: [
      [
        "She gave me a book.",
        "她给了我一本书。",
        "me 是间接宾语，a book 是直接宾语。",
      ],
      [
        "Dad bought a bike for me.",
        "爸爸给我买了一辆自行车。",
        "buy 表示为某人购买，改写时使用 for。",
      ],
      [
        "The news made me happy.",
        "这个消息让我开心。",
        "happy 补充说明宾语 me 的状态，是宾语补足语。",
      ],
    ],
    mistake:
      "give a book for me 通常不表示“把书给我”；give 的改写结构应使用 give a book to me。",
    question: {
      prompt: "The teacher made the lesson ___.",
      choices: ["interesting", "interest", "interestingly"],
      answer: "interesting",
      explanation: "形容词 interesting 补充说明宾语 the lesson 的状态。",
    },
  },
  causativePerception: {
    title: "使役动词与感官动词",
    term: "新授深化",
    summary: "掌握 make、let、have 和 see、hear、watch 后面的动作形式。",
    rules: [
      "主动语态中 make/let/have + 人 + 动词原形。",
      "make 用于被动语态时恢复 to：be made to do。",
      "see/hear/watch + 人 + do 强调看见或听见动作全过程。",
      "see/hear/watch + 人 + doing 强调动作正在进行。",
      "感官动词用于被动语态时，do 通常变为 to do。",
      "have + 物 + done 可以表示让别人完成某事或某物遭受某事。",
    ],
    examples: [
      [
        "The joke made us laugh.",
        "这个笑话让我们笑了。",
        "主动结构 make + 人 + 动词原形 laugh。",
      ],
      [
        "We saw him cross the street.",
        "我们看见他穿过了街道。",
        "cross 表示看见了完整动作过程。",
      ],
      [
        "We saw him crossing the street.",
        "我们看见他正在过街。",
        "crossing 强调当时正在进行。",
      ],
    ],
    mistake:
      "不要写 The joke made us to laugh；主动语态中 make 后的动作使用原形。",
    question: {
      prompt: "The workers were made ___ all night.",
      choices: ["to work", "work", "working"],
      answer: "to work",
      explanation: "make 用于被动语态时，要恢复不定式符号 to。",
    },
  },
};
const supplementalGrammarKnowledge = {
  "感叹句：What 与 How": [
    {
      title: "一、先看中心词：名词用 What",
      points: [
        "中心部分是名词时，用 What 引导感叹句。",
        "可数名词单数使用 What + a / an + 形容词 + 名词！",
      ],
      highlights: ["What", "a", "an", "名词"],
      examples: [
        {
          label: "可数名词单数",
          sentence: "What a clever boy he is!",
          translation: "他是一个多么聪明的男孩啊！",
          note: "中心词是可数名词 boy，所以使用 What a。",
          highlights: ["What a", "boy"],
          tone: "correct",
        },
      ],
    },
    {
      title: "二、复数和不可数名词不加 a / an",
      points: [
        "What + 形容词 + 可数名词复数！",
        "What + 形容词 + 不可数名词！",
      ],
      highlights: ["What", "可数名词复数", "不可数名词", "不加 a / an"],
      examples: [
        {
          label: "复数名词",
          sentence: "What beautiful flowers they are!",
          translation: "这些花多么漂亮啊！",
          note: "flowers 是复数，What 后面不加 a / an。",
          highlights: ["What", "flowers", "不加 a / an"],
          tone: "contrast",
        },
        {
          label: "不可数名词",
          sentence: "What fine weather it is!",
          translation: "天气多么好啊！",
          note: "weather 不可数，不能说 What a fine weather。",
          highlights: ["What", "weather", "What a fine weather"],
          tone: "wrong",
        },
      ],
    },
    {
      title: "三、中心是形容词或副词，用 How",
      points: [
        "How + 形容词 / 副词 + 主语 + 谓语！",
        "判断口诀：看到名词优先想 What，只强调形容词或副词优先想 How。",
      ],
      highlights: ["How", "形容词", "副词", "What"],
      examples: [
        {
          label: "强调副词",
          sentence: "How fast she runs!",
          translation: "她跑得多快啊！",
          note: "fast 修饰 runs，是副词，前面使用 How。",
          highlights: ["How", "fast"],
          tone: "correct",
        },
        {
          label: "What 与 How 对比",
          sentence:
            "What a beautiful flower it is! = How beautiful the flower is!",
          translation: "这朵花多么漂亮啊！",
          note: "强调 flower 用 What；强调 beautiful 用 How。",
          highlights: ["What", "flower", "How", "beautiful"],
          tone: "contrast",
        },
      ],
    },
  ],
  常用限定词辨析: [
    {
      title: "一、all 与 both：三个以上和两个",
      points: ["both 表示“两者都”；all 表示“三者或三者以上都”。"],
      highlights: ["both", "all", "两者", "三者或三者以上"],
      examples: [
        {
          label: "数量决定用词",
          sentence: "Both girls are students. / All three girls are students.",
          translation: "两个女孩都是学生。/三个女孩都是学生。",
          note: "两个用 both，三个及以上用 all。",
          highlights: ["Both", "All three"],
          tone: "contrast",
        },
      ],
    },
    {
      title: "二、either、neither 与 each、every",
      points: [
        "either 表示“两者中的任意一个”，neither 表示“两者都不”。",
        "each 强调逐个；every 强调整体中的每一个，后面都接可数名词单数。",
      ],
      highlights: ["either", "neither", "each", "every", "可数名词单数"],
      examples: [
        {
          label: "肯定与否定",
          sentence: "Either answer is OK, but neither answer is mine.",
          translation: "两个答案中任何一个都可以，但两个答案都不是我的。",
          note: "either 和 neither 作主语时，谓语通常用单数 is。",
          highlights: ["Either", "neither", "is"],
          tone: "contrast",
        },
      ],
    },
    {
      title: "三、few / a few 与 little / a little",
      points: [
        "few / a few 修饰可数名词复数；little / a little 修饰不可数名词。",
        "不带 a 表示“几乎没有”；带 a 表示“有一点、还有一些”。",
      ],
      highlights: ["few", "a few", "little", "a little", "几乎没有", "有一点"],
      examples: [
        {
          label: "意思相反的一组",
          sentence: "I have few friends here, but I have a little time.",
          translation: "我在这里几乎没有朋友，但我还有一点时间。",
          note: "friends 可数用 few；time 不可数用 a little。",
          highlights: ["few friends", "a little time"],
          tone: "contrast",
        },
      ],
    },
    {
      title: "四、another、other、others 与 the other",
      points: [
        "another 表示“另一个”；other 后接名词；others 单独使用；the other 表示两者中的另一个。",
      ],
      highlights: ["another", "other", "others", "the other"],
      examples: [
        {
          label: "四种形式",
          sentence: "I have two pens. One is blue; the other is red.",
          translation: "我有两支笔，一支是蓝色的，另一支是红色的。",
          note: "范围只有两个，固定搭配是 one ... the other ...。",
          highlights: ["One", "the other"],
          tone: "correct",
        },
      ],
    },
  ],
  反意疑问句: [
    {
      title: "一、基本规则：前肯后否，前否后肯",
      points: ["陈述部分肯定，附加问句用否定；陈述部分否定，附加问句用肯定。"],
      highlights: ["前肯后否", "前否后肯"],
      examples: [
        {
          label: "肯定陈述",
          sentence: "She is a student, isn't she?",
          translation: "她是一名学生，对吗？",
          note: "前面 is 肯定，后面用 isn't。",
          highlights: ["is", "isn't she"],
          tone: "correct",
        },
        {
          label: "否定陈述",
          sentence: "He doesn't swim, does he?",
          translation: "他不游泳，对吗？",
          note: "前面 doesn't 否定，后面恢复肯定 does。",
          highlights: ["doesn't", "does he"],
          tone: "contrast",
        },
      ],
    },
    {
      title: "二、附加问句要找原句中的帮手",
      points: [
        "原句有 be 或情态动词就直接使用；实义动词句用 do / does / did。",
      ],
      highlights: ["be", "情态动词", "do", "does", "did"],
      examples: [
        {
          label: "三类帮手",
          sentence: "They can swim, can't they? / Tom left, didn't he?",
          translation: "他们会游泳，对吗？/汤姆离开了，对吗？",
          note: "can 对应 can't；过去式 left 对应 didn't。",
          highlights: ["can", "can't they", "left", "didn't he"],
          tone: "contrast",
        },
      ],
    },
    {
      title: "三、There be 与祈使句",
      points: ["There be 的附加主语仍用 there；肯定祈使句常用 will you。"],
      highlights: ["There be", "there", "祈使句", "will you"],
      examples: [
        {
          label: "特殊主语",
          sentence: "There is a book here, isn't there?",
          translation: "这里有一本书，对吗？",
          note: "不能改成 isn't it，附加部分仍然使用 there。",
          highlights: ["There is", "isn't there", "isn't it"],
          tone: "wrong",
        },
        {
          label: "祈使句",
          sentence: "Open the door, will you?",
          translation: "把门打开，好吗？",
          highlights: ["Open", "will you"],
          tone: "correct",
        },
      ],
    },
  ],
  双宾语与宾语补足语: [
    {
      title: "一、双宾语：给谁什么",
      points: ["结构是动词 + 人 + 物；人是间接宾语，物是直接宾语。"],
      highlights: ["动词 + 人 + 物", "间接宾语", "直接宾语"],
      examples: [
        {
          label: "结构拆解",
          sentence: "She gave me a book.",
          translation: "她给了我一本书。",
          note: "me 是“给谁”，a book 是“给什么”。",
          highlights: ["gave", "me", "a book"],
          tone: "correct",
        },
      ],
    },
    {
      title: "二、双宾语可以改成 to / for",
      points: ["give、show、send 常用 to；buy、make、cook 常用 for。"],
      highlights: ["to", "for", "give", "buy"],
      examples: [
        {
          label: "两种句型互换",
          sentence: "She gave me a book. = She gave a book to me.",
          translation: "她给了我一本书。",
          note: "物提前后，要在“人”前补 to。",
          highlights: ["gave me a book", "gave a book to me", "to"],
          tone: "contrast",
        },
        {
          label: "for 结构",
          sentence: "Dad bought me a bike. = Dad bought a bike for me.",
          translation: "爸爸给我买了一辆自行车。",
          highlights: ["bought me a bike", "for me"],
          tone: "contrast",
        },
      ],
    },
    {
      title: "三、宾语补足语：说明宾语怎么样",
      points: [
        "结构是动词 + 宾语 + 补足语；补足语用来说明宾语的身份、状态或动作。",
      ],
      highlights: ["动词 + 宾语 + 补足语", "身份", "状态", "动作"],
      examples: [
        {
          label: "状态补充",
          sentence: "The news made me happy.",
          translation: "这个消息让我开心。",
          note: "happy 说明宾语 me 的状态。",
          highlights: ["made", "me", "happy"],
          tone: "correct",
        },
        {
          label: "身份补充",
          sentence: "We call him Tom.",
          translation: "我们叫他汤姆。",
          note: "Tom 说明宾语 him 的称呼。",
          highlights: ["call", "him", "Tom"],
          tone: "correct",
        },
      ],
    },
  ],
  简短回答与附和表达: [
    {
      title: "一、简短回答要沿用问句中的助动词",
      points: ["问句用 be、do 或情态动词，回答就使用同一类词。"],
      highlights: ["be", "do", "情态动词", "同一类词"],
      examples: [
        {
          label: "一般疑问句",
          sentence: "Do you like English? — Yes, I do.",
          translation: "你喜欢英语吗？——是的，我喜欢。",
          note: "问句用 Do，简短回答也用 do。",
          highlights: ["Do", "Yes, I do"],
          tone: "correct",
        },
        {
          label: "be 动词问句",
          sentence: "Is she ready? — No, she isn't.",
          translation: "她准备好了吗？——没有。",
          highlights: ["Is", "No, she isn't"],
          tone: "contrast",
        },
      ],
    },
    {
      title: "二、肯定附和：So + 助动词 + 主语",
      points: ["表示“某人也一样”，前句是肯定句时使用 So。"],
      highlights: ["So + 助动词 + 主语", "So"],
      examples: [
        {
          label: "我也是",
          sentence: "I like music. — So do I.",
          translation: "我喜欢音乐。——我也是。",
          note: "前句是实义动词 like，所以附和时使用 do。",
          highlights: ["like", "So do I"],
          tone: "correct",
        },
      ],
    },
    {
      title: "三、否定附和：Neither + 助动词 + 主语",
      points: [
        "前句是否定句时，用 Neither 表示“某人也不”。口语中也可以说 Me neither。",
      ],
      highlights: ["Neither + 助动词 + 主语", "Me neither"],
      examples: [
        {
          label: "我也不会",
          sentence: "I can't swim. — Neither can I.",
          translation: "我不会游泳。——我也不会。",
          note: "原句有情态动词 can，附和时继续使用 can。",
          highlights: ["can't", "Neither can I"],
          tone: "contrast",
        },
      ],
    },
  ],
  使役动词与感官动词: [
    {
      title: "一、make、let、have 后接动词原形",
      points: ["主动句结构：make / let / have + 人 + 动词原形。"],
      highlights: ["make", "let", "have", "人 + 动词原形"],
      examples: [
        {
          label: "使役结构",
          sentence: "The teacher made us clean the room.",
          translation: "老师让我们打扫房间。",
          note: "主动句中 made us 后面直接接 clean，不加 to。",
          highlights: ["made", "us", "clean", "不加 to"],
          tone: "correct",
        },
      ],
    },
    {
      title: "二、感官动词：do 看全过程，doing 看正在发生",
      points: [
        "see / hear / watch + 人 + do 表示看见完整过程；+ doing 表示看见动作正在进行。",
      ],
      highlights: [
        "see",
        "hear",
        "watch",
        "do",
        "doing",
        "完整过程",
        "正在进行",
      ],
      examples: [
        {
          label: "动作含义对比",
          sentence: "I saw him cross the road. / I saw him crossing the road.",
          translation: "我看见他过了马路。/我看见他正在过马路。",
          note: "cross 强调全过程；crossing 强调当时正在发生。",
          highlights: ["saw him cross", "saw him crossing"],
          tone: "contrast",
        },
      ],
    },
    {
      title: "三、变成被动语态时，make 后要恢复 to",
      points: [
        "主动语态 make sb do 中没有 to；变成被动语态 sb be made to do 时必须补回 to。",
      ],
      highlights: ["make sb do", "be made to do", "补回 to"],
      examples: [
        {
          label: "主动变被动",
          sentence: "They made him wait. → He was made to wait.",
          translation: "他们让他等待。→ 他被要求等待。",
          note: "被动句不能说 He was made wait。",
          highlights: ["made him wait", "was made to wait", "was made wait"],
          tone: "wrong",
        },
      ],
    },
  ],
};
const supplementalGrammarHighlights = Object.fromEntries(
  Object.entries(supplementalGrammarKnowledge).map(([title, sections]) => [
    title,
    [...new Set(sections.flatMap((section) => section.highlights || []))],
  ])
);
const grammarTopicAdditions = {
  特殊疑问词: {
    knowledgeTitle: "补充：选择疑问句",
    rules: [
      "选择疑问句提供两个或多个选项，常用 or 连接：Do you want tea or coffee?",
      "回答时选择具体项目，通常不用简单回答 yes 或 no。",
      "朗读时 or 前通常用升调，最后一个选项用降调。",
    ],
    examples: [
      [
        "Is your bag red or blue?",
        "你的书包是红色还是蓝色？",
        "回答 red 或 blue，而不是只回答 Yes。",
      ],
    ],
  },
  量词与数量短语: {
    title: "数词、量词与数量表达",
    knowledgeTitle: "补充：数词与完整数量表达",
    rules: [
      "基数词表示数量，序数词表示顺序：three/third。",
      "日期通常使用序数词，年份按数字组合朗读。",
      "分数由基数词作分子、序数词作分母；分子大于一时分母常加 s。",
      "百分数使用 percent，小数点读 point。",
      "倍数基础可用 twice、three times 等表达。",
    ],
    examples: [
      [
        "Two thirds of the students passed.",
        "三分之二的学生通过了。",
        "分子 two 大于一，分母 third 要变成 thirds。",
      ],
      [
        "The price rose by 12.5 percent.",
        "价格上涨了百分之十二点五。",
        "小数点读 point，百分数后使用 percent。",
      ],
    ],
  },
  句子结构与长难句入门: {
    knowledgeTitle: "补充：插入语识别",
    rules: [
      "插入语补充说话人的态度或说明，去掉后句子主干仍然完整。",
      "常见插入语有 I think、in fact、of course、for example 等。",
      "分析长句时先暂时括起插入语，再寻找主语、谓语和宾语。",
    ],
    examples: [
      [
        "This plan, I think, will work.",
        "我认为这个计划会奏效。",
        "括起 I think 后，主干是 This plan will work。",
      ],
    ],
  },
  同位语从句: {
    knowledgeTitle: "补充：普通同位语与同位语从句",
    rules: [
      "普通同位语是名词短语，用来说明前面名词的身份。",
      "同位语从句是完整句子，用来解释 fact、news、idea、hope 等抽象名词的具体内容。",
      "判断时看说明部分有没有自己的主语和谓语。",
    ],
    examples: [
      [
        "Tom, my best friend, is here.",
        "汤姆——我最好的朋友——在这里。",
        "my best friend 是名词短语，属于普通同位语。",
      ],
      [
        "The fact that he left surprised me.",
        "他离开的事实让我惊讶。",
        "that he left 有主语和谓语，是同位语从句。",
      ],
    ],
  },
  名词单复数: {
    knowledgeTitle: "补充：复数词尾的拼写与读音",
    rules: [
      "-s 在清辅音后常读 /s/，在浊辅音和元音后常读 /z/。",
      "-es 在 s、x、sh、ch 等音后通常读 /ɪz/。",
      "学习复数时要同时记拼写、读音和不规则形式。",
    ],
    examples: [
      [
        "cats /s/, dogs /z/, buses /ɪz/",
        "猫、狗、公共汽车的复数读音。",
        "词尾前一个音决定 -s/-es 的常见读音。",
      ],
    ],
  },
  一般现在时: {
    knowledgeTitle: "补充：第三人称单数的拼写与读音",
    rules: [
      "一般动词加 -s；s、x、sh、ch、o 结尾常加 -es；辅音+y 变 ies。",
      "第三人称单数词尾的读音规律与名词复数 -s/-es 基本相同。",
    ],
    examples: [
      [
        "works /s/, plays /z/, watches /ɪz/",
        "工作、玩、观看的第三人称单数读音。",
        "拼写变化和读音需要一起记忆。",
      ],
    ],
  },
  现在进行时: {
    knowledgeTitle: "补充：-ing 的拼写规则",
    rules: [
      "一般直接加 -ing；不发音 e 结尾通常去 e 加 -ing。",
      "重读闭音节常双写末字母再加 -ing；ie 结尾常变 ie 为 y。",
    ],
    examples: [
      [
        "read → reading; write → writing; run → running; lie → lying",
        "四类常见 -ing 变化。",
        "先判断词尾结构，再决定直接加、去 e、双写或变 y。",
      ],
    ],
  },
  一般过去时: {
    knowledgeTitle: "补充：-ed 的拼写与读音",
    rules: [
      "一般加 -ed；以 e 结尾加 -d；辅音+y 变 ied；部分重读闭音节双写末字母。",
      "-ed 在 /t/、/d/ 后读 /ɪd/，清辅音后常读 /t/，其他情况常读 /d/。",
    ],
    examples: [
      [
        "wanted /ɪd/, washed /t/, played /d/",
        "想要、清洗、玩的过去式读音。",
        "先看动词原形末尾的发音，再判断 -ed 读音。",
      ],
    ],
  },
  "形容词、副词比较等级": {
    knowledgeTitle: "补充：-er/-est 的拼写规则",
    rules: [
      "一般加 -er/-est；以 e 结尾只加 -r/-st。",
      "辅音+y 变 i 再加 er/est；部分重读闭音节双写末字母。",
    ],
    examples: [
      [
        "tall → taller; nice → nicer; happy → happier; big → bigger",
        "四类比较级拼写变化。",
        "比较级变化要根据词尾选择正确规则。",
      ],
    ],
  },
  词性与句子成分: {
    knowledgeTitle: "补充：完整句子的书写规范",
    rules: [
      "句首字母大写，句尾使用句号、问号或感叹号。",
      "人名、地名、国家、星期和月份等专有名词首字母大写。",
      "两个完整句子不能只用逗号连接，要使用连词、分号或分成两句。",
    ],
    examples: [
      [
        "Tom lives in Beijing. He goes there on Monday.",
        "汤姆住在北京。他星期一去那里。",
        "Tom、Beijing、Monday 都需要首字母大写。",
      ],
    ],
  },
  时间与地点介词: {
    knowledgeTitle: "补充：常用介词辨析",
    rules: [
      "in/on/at 分别常用于较大范围、具体日期或表面、具体时刻或地点。",
      "by 表示不迟于，until 表示动作持续到某时。",
      "between 常用于两者，among 常用于三者或以上。",
      "across 强调从表面穿过，through 强调从内部穿过。",
      "beside 表示在旁边，except 表示除……之外。",
    ],
    examples: [
      [
        "Finish it by Friday. I will stay here until Friday.",
        "周五前完成；我会待到周五。",
        "by 强调截止点，until 强调持续到该时间。",
      ],
      [
        "He walked across the road and through the tunnel.",
        "他穿过马路并穿过隧道。",
        "across 是表面横穿，through 是内部穿过。",
      ],
    ],
  },
  动词形式辨析: {
    knowledgeTitle: "补充：介词与动词固定搭配",
    rules: [
      "介词后通常接名词、代词宾格或动名词。",
      "固定搭配要整体记忆，如 be interested in、depend on、look forward to。",
      "look forward to 中的 to 是介词，后接 doing 而不是动词原形。",
    ],
    examples: [
      [
        "I look forward to seeing you.",
        "我期待见到你。",
        "to 是介词，因此 see 要变成 seeing。",
      ],
    ],
  },
};
function getGrammarTopicAddition(title) {
  return (
    grammarTopicAdditions[title] ||
    Object.values(grammarTopicAdditions).find(
      (addition) => addition.title === title
    )
  );
}
const grammarAdditionHighlightMap = {
  特殊疑问词: ["or", "tea or coffee", "yes", "no"],
  "数词、量词与数量表达": [
    "a pair of",
    "two kilos of",
    "three",
    "third",
    "Two thirds",
    "12.5 percent",
    "point",
    "twice",
    "three times",
  ],
  句子结构与长难句入门: ["I think", "in fact", "of course", "for example"],
  同位语从句: ["my best friend", "that he left", "主语", "谓语"],
  名词单复数: ["-s", "-es", "/s/", "/z/", "/ɪz/"],
  一般现在时: ["-s", "-es", "works", "plays", "watches"],
  现在进行时: ["-ing", "reading", "writing", "running", "lying"],
  一般过去时: ["-ed", "/ɪd/", "/t/", "/d/", "wanted", "washed", "played"],
  "形容词、副词比较等级": [
    "-er",
    "-est",
    "taller",
    "nicer",
    "happier",
    "bigger",
  ],
  词性与句子成分: ["Tom", "Beijing", "Monday"],
  时间与地点介词: [
    "in",
    "on",
    "at",
    "by",
    "until",
    "between",
    "among",
    "across",
    "through",
    "beside",
    "except",
  ],
  动词形式辨析: ["be interested in", "depend on", "look forward to", "seeing"],
};
function getGrammarAdditionHighlights(title) {
  const addition = getGrammarTopicAddition(title);
  const originalTitle = Object.keys(grammarTopicAdditions).find(
    (key) => grammarTopicAdditions[key] === addition
  );
  return (
    grammarAdditionHighlightMap[title] ||
    grammarAdditionHighlightMap[originalTitle] ||
    []
  );
}
function mergeGrammarTopic(topic) {
  const addition = grammarTopicAdditions[topic.title];
  if (!addition) return topic;
  return {
    ...topic,
    title: addition.title || topic.title,
    rules: [...topic.rules, ...addition.rules],
    examples: [...topic.examples, ...(addition.examples || [])],
  };
}
const supplementalGrammarInsertions = {
  grade7: [
    { after: "how 引导的问句", topic: supplementalGrammarTopics.exclamation },
  ],
  grade8: [
    { after: "疑问词组", topic: supplementalGrammarTopics.shortResponses },
    {
      after: "可数与不可数名词量化",
      topic: supplementalGrammarTopics.determiners,
    },
    { after: "宾语从句入门", topic: supplementalGrammarTopics.tagQuestion },
    { after: "动词形式辨析", topic: supplementalGrammarTopics.doubleObject },
  ],
  grade9: [
    {
      after: "直接引语与间接引语",
      topic: supplementalGrammarTopics.causativePerception,
    },
  ],
};
function buildGrammarTopics(level) {
  const topics = level.topics.map(mergeGrammarTopic),
    insertions = supplementalGrammarInsertions[level.id] || [];
  insertions.forEach(({ after, topic }) => {
    const index = topics.findIndex((item) => item.title === after);
    topics.splice(index < 0 ? topics.length : index + 1, 0, {
      ...topic,
      knowledge: supplementalGrammarKnowledge[topic.title],
    });
  });
  return topics;
}
const duplicateGrammarTopics = {
  grade7: new Set([
    "be 动词的四种句型",
    "名词与复数",
    "一般现在时",
    "现在进行时",
    "一般过去时",
  ]),
  grade12: new Set(["定语从句高级辨析"]),
};
const grammarCurriculum = D.map((level) => ({
  ...level,
  topics: buildGrammarTopics(level).filter(
    (topic) => !duplicateGrammarTopics[level.id]?.has(topic.title)
  ),
}));
function Ce({ speak: n }) {
  const [g, j] = x.useState("bridge"),
    [r, c] = x.useState(""),
    [i, a] = x.useState(0),
    [p, l] = x.useState(""),
    [m, o] = x.useState(!1),
    [h, v] = x.useState({}),
    [z, y] = x.useState({}),
    [w, b] = x.useState({}),
    I = grammarCurriculum.find((s) => s.id === g),
    q = [...new Set(I.topics.map((s) => s.term).filter(Boolean))],
    F = q.length > 0,
    C = F ? I.topics.filter((s) => s.term === r) : I.topics,
    baseTopic = C[i] || C[0],
    u = {
      ...baseTopic,
      ...getGrammarEnhancement(baseTopic.title, baseTopic),
    },
    topicHighlights =
      g === "bridge"
        ? bridgeGrammarHighlights[baseTopic.title] || []
        : supplementalGrammarHighlights[baseTopic.title] ||
          getGrammarAdditionHighlights(baseTopic.title),
    practiceItems = u.practice || u.examples,
    hasCustomKnowledgeCards = Boolean(
      supplementalGrammarKnowledge[u.title] || getGrammarTopicAddition(u.title)
    );
  function O() {
    l(""), o(!1), v({}), y({}), b({});
  }
  function d(s) {
    const k = grammarCurriculum.find((L) => L.id === s),
      f = [...new Set(k.topics.map((L) => L.term).filter(Boolean))];
    j(s), c(f[0] || ""), a(0), O();
  }
  function S(s) {
    a(s), O();
  }
  function E(s) {
    c(s), a(0), O();
  }
  return e.jsxs("section", {
    className: "page-view grammar-view",
    children: [
      e.jsxs("div", {
        className: "page-heading",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "分级语法课程",
              }),
              e.jsx("h2", { children: "看懂规则，再放进句子里练习" }),
            ],
          }),
          e.jsxs("span", {
            className: "grammar-total",
            children: [
              grammarCurriculum.reduce((s, k) => s + k.topics.length, 0),
              " 个核心知识点",
            ],
          }),
        ],
      }),
      e.jsx("div", {
        className: "grammar-levels",
        role: "tablist",
        children: grammarCurriculum.map((s) =>
          e.jsxs(
            "button",
            {
              className: g === s.id ? "active" : "",
              onClick: () => d(s.id),
              children: [
                s.label,
                e.jsxs("small", {
                  children: [s.range, " · ", s.topics.length, "课"],
                }),
              ],
            },
            s.id
          )
        ),
      }),
      F &&
        e.jsx("div", {
          className: "grammar-terms",
          role: "tablist",
          children: q.map((s) =>
            e.jsxs(
              "button",
              {
                className: r === s ? "active" : "",
                onClick: () => E(s),
                children: [
                  s === "上册" || s === "下册" ? `${I.label}${s}` : s,
                  e.jsxs("small", {
                    children: [
                      I.topics.filter((k) => k.term === s).length,
                      " 个知识点",
                    ],
                  }),
                ],
              },
              s
            )
          ),
        }),
      e.jsxs("div", {
        className: "grammar-workspace",
        children: [
          e.jsxs("aside", {
            className: "grammar-topics",
            children: [
              e.jsxs("div", {
                className: "grammar-list-head",
                children: [
                  e.jsxs("span", {
                    children: [I.label, u.term ? ` · ${u.term}` : ""],
                  }),
                  e.jsxs("strong", { children: [i + 1, "/", C.length] }),
                ],
              }),
              C.map((s, k) =>
                e.jsxs(
                  "button",
                  {
                    className: i === k ? "active" : "",
                    onClick: () => S(k),
                    children: [
                      e.jsx("span", {
                        children: String(k + 1).padStart(2, "0"),
                      }),
                      e.jsx("strong", { children: s.title }),
                      e.jsx(T, { size: 16 }),
                    ],
                  },
                  s.title
                )
              ),
            ],
          }),
          e.jsxs("article", {
            className: "grammar-lesson",
            children: [
              e.jsxs("header", {
                children: [
                  e.jsxs("span", {
                    className: "section-label",
                    children: [
                      I.label,
                      u.term ? ` · ${u.term}` : "",
                      " · 第 ",
                      i + 1,
                      " 课",
                    ],
                  }),
                  e.jsx("h3", { children: u.title }),
                  e.jsx("p", { children: u.summary }),
                ],
              }),
              u.concept &&
                e.jsxs("section", {
                  className: "grammar-concept",
                  children: [
                    e.jsx("span", {
                      className: "section-label",
                      children: "先弄懂概念",
                    }),
                    e.jsx("h4", { children: u.concept.title }),
                    e.jsx("p", { children: u.concept.text }),
                    u.concept.items &&
                      e.jsx("dl", {
                        className: "grammar-concept-list",
                        children: u.concept.items.map(([s, k]) =>
                          e.jsxs(
                            "div",
                            {
                              children: [
                                e.jsx("dt", { children: s }),
                                e.jsx("dd", { children: k }),
                              ],
                            },
                            s
                          )
                        ),
                      }),
                  ],
                }),
              u.knowledge &&
                e.jsx("section", {
                  className:
                    g === "bridge"
                      ? "grammar-knowledge is-bridge"
                      : "grammar-knowledge",
                  children: u.knowledge.map((s, k) =>
                    e.jsxs(
                      "article",
                      {
                        children: [
                          e.jsx("h4", { children: s.title }),
                          e.jsx("ul", {
                            children: s.points.map((f) =>
                              e.jsx(
                                "li",
                                {
                                  children: renderGrammarText(f, [
                                    ...(s.highlights || []),
                                    ...topicHighlights,
                                  ]),
                                },
                                f
                              )
                            ),
                          }),
                          (s.examples || bridgeSectionExamples[u.title]?.[k]) &&
                            e.jsx("div", {
                              className: "grammar-rule-examples",
                              children: (
                                s.examples ||
                                bridgeSectionExamples[u.title]?.[k]
                              ).map((f, exampleIndex) =>
                                e.jsxs(
                                  "div",
                                  {
                                    className: `grammar-rule-example ${
                                      f.tone ? `is-${f.tone}` : ""
                                    }`,
                                    children: [
                                      f.label &&
                                        e.jsx("span", {
                                          className:
                                            "grammar-rule-example-label",
                                          children: f.label,
                                        }),
                                      e.jsxs("div", {
                                        className:
                                          "grammar-rule-example-en-row",
                                        children: [
                                          e.jsx("p", {
                                            className:
                                              "grammar-rule-example-en",
                                            children: renderGrammarText(
                                              f.sentence,
                                              [
                                                ...(f.highlights ||
                                                  s.highlights ||
                                                  []),
                                                ...topicHighlights,
                                              ]
                                            ),
                                          }),
                                          e.jsx("button", {
                                            type: "button",
                                            className:
                                              "grammar-rule-example-audio",
                                            "aria-label": "朗读例句",
                                            title: "朗读例句",
                                            onClick: () =>
                                              playGrammarExampleAudio(
                                                f.sentence
                                              ),
                                            children: e.jsx(U, { size: 14 }),
                                          }),
                                        ],
                                      }),
                                      f.translation &&
                                        e.jsx("p", {
                                          className: "grammar-rule-example-zh",
                                          children: f.translation,
                                        }),
                                      f.note &&
                                        e.jsx("p", {
                                          className:
                                            "grammar-rule-example-note",
                                          children: renderGrammarText(f.note, [
                                            ...(f.highlights ||
                                              s.highlights ||
                                              []),
                                            ...topicHighlights,
                                          ]),
                                        }),
                                    ],
                                  },
                                  `${f.sentence}-${exampleIndex}`
                                )
                              ),
                            }),
                        ],
                      },
                      `${s.title}-${k}`
                    )
                  ),
                }),
              !hasCustomKnowledgeCards &&
                e.jsxs("div", {
                  className: "grammar-learning-path",
                  "aria-label": "本课学习步骤",
                  children: [
                    e.jsxs("span", {
                      children: [
                        e.jsx("strong", { children: "1" }),
                        " 看懂 ",
                        u.examples.length,
                        " 个例句",
                      ],
                    }),
                    e.jsxs("span", {
                      children: [
                        e.jsx("strong", { children: "2" }),
                        " 发现语法规则",
                      ],
                    }),
                    e.jsxs("span", {
                      children: [
                        e.jsx("strong", { children: "3" }),
                        " 自己翻译并检测",
                      ],
                    }),
                  ],
                }),
              !hasCustomKnowledgeCards &&
                e.jsxs("section", {
                  className: "grammar-section",
                  children: [
                    e.jsxs("div", {
                      className: "grammar-section-title",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", {
                              className: "section-label",
                              children: "先看懂，再模仿",
                            }),
                            e.jsx("h4", { children: "例句怎么用" }),
                          ],
                        }),
                        e.jsxs("small", {
                          children: [u.examples.length, " 个例句"],
                        }),
                      ],
                    }),
                    e.jsx("div", {
                      className: "grammar-examples",
                      children: u.examples.map(([s, k, f], L) =>
                        e.jsxs(
                          "article",
                          {
                            children: [
                              e.jsxs("div", {
                                className: "grammar-example-head",
                                children: [
                                  e.jsxs("span", {
                                    children: ["例句 ", L + 1],
                                  }),
                                  e.jsx("button", {
                                    onClick: () => n(s),
                                    "aria-label": `朗读例句 ${L + 1}`,
                                    title: "朗读例句",
                                    children: e.jsx(U, { size: 17 }),
                                  }),
                                ],
                              }),
                              e.jsx("strong", {
                                children: renderGrammarText(s, topicHighlights),
                              }),
                              e.jsx("p", { children: k }),
                              f &&
                                e.jsx("div", {
                                  className: "grammar-example-note",
                                  children: renderGrammarText(
                                    f,
                                    topicHighlights
                                  ),
                                }),
                            ],
                          },
                          s
                        )
                      ),
                    }),
                  ],
                }),
              !u.knowledge &&
                e.jsxs("section", {
                  className: "grammar-section",
                  children: [
                    e.jsxs("div", {
                      className: "grammar-section-title",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", {
                              className: "section-label",
                              children: "从例句中找规律",
                            }),
                            e.jsx("h4", { children: "这几条要看懂" }),
                          ],
                        }),
                        e.jsxs("small", {
                          children: [u.rules.length, " 条规则"],
                        }),
                      ],
                    }),
                    e.jsx("ol", {
                      children: u.rules.map((s) =>
                        e.jsx("li", { children: s }, s)
                      ),
                    }),
                  ],
                }),
              e.jsxs("section", {
                className: "grammar-section grammar-translation-practice",
                children: [
                  e.jsxs("div", {
                    className: "grammar-section-title",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsx("span", {
                            className: "section-label",
                            children: "轮到你来写",
                          }),
                          e.jsx("h4", { children: "把中文翻译成英文" }),
                        ],
                      }),
                      e.jsxs("small", {
                        children: [practiceItems.length, " 道练习"],
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className: "grammar-translation-list",
                    children: practiceItems.map(([s, k], f) => {
                      var B;
                      const L = !!z[f],
                        M = L && K(h[f] || "") === K(s);
                      return e.jsxs(
                        "article",
                        {
                          children: [
                            e.jsxs("div", {
                              className: "grammar-practice-number",
                              children: [
                                e.jsx(xe, { size: 16 }),
                                e.jsxs("span", { children: ["练习 ", f + 1] }),
                              ],
                            }),
                            e.jsx("p", { children: k }),
                            w[f] &&
                              e.jsxs("div", {
                                className: "grammar-word-hint",
                                children: [e.jsx(W, { size: 15 }), ke(s)],
                              }),
                            e.jsxs("div", {
                              className: "grammar-translation-input",
                              children: [
                                e.jsx("input", {
                                  value: h[f] || "",
                                  disabled: L,
                                  placeholder: "在这里写出英文句子",
                                  onChange: (t) =>
                                    v((N) => ({ ...N, [f]: t.target.value })),
                                  onKeyDown: (t) => {
                                    var N;
                                    t.key === "Enter" &&
                                      (N = h[f]) != null &&
                                      N.trim() &&
                                      y((R) => ({ ...R, [f]: !0 }));
                                  },
                                }),
                                e.jsx("button", {
                                  className: "hint-button",
                                  onClick: () =>
                                    b((t) => ({ ...t, [f]: !t[f] })),
                                  "aria-label": w[f]
                                    ? "隐藏词语提示"
                                    : "显示词语提示",
                                  title: w[f] ? "隐藏词语提示" : "显示词语提示",
                                  children: e.jsx(W, { size: 17 }),
                                }),
                                L
                                  ? e.jsx("button", {
                                      className: "retry-translation",
                                      onClick: () => {
                                        v((t) => ({ ...t, [f]: "" })),
                                          y((t) => ({ ...t, [f]: !1 }));
                                      },
                                      "aria-label": "重新作答",
                                      title: "重新作答",
                                      children: e.jsx(me, { size: 17 }),
                                    })
                                  : e.jsx("button", {
                                      className: "check-translation",
                                      disabled: !(
                                        (B = h[f]) != null && B.trim()
                                      ),
                                      onClick: () =>
                                        y((t) => ({ ...t, [f]: !0 })),
                                      children: "检查",
                                    }),
                              ],
                            }),
                            L &&
                              e.jsxs("div", {
                                className: `grammar-translation-feedback ${
                                  M ? "correct" : "wrong"
                                }`,
                                children: [
                                  e.jsx("strong", {
                                    children: M ? "写对了" : "再对照一次",
                                  }),
                                  e.jsx("span", { children: s }),
                                  e.jsx("button", {
                                    onClick: () => n(s),
                                    "aria-label": "朗读参考答案",
                                    title: "朗读参考答案",
                                    children: e.jsx(U, { size: 16 }),
                                  }),
                                ],
                              }),
                          ],
                        },
                        s
                      );
                    }),
                  }),
                ],
              }),
              e.jsxs("section", {
                className: "grammar-mistake",
                children: [
                  e.jsx("span", { children: "易错提醒" }),
                  e.jsx("p", { children: u.mistake }),
                ],
              }),
              e.jsxs("section", {
                className: "grammar-check",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsx("span", {
                        className: "section-label",
                        children: "最后测一题",
                      }),
                      e.jsx("h4", { children: u.question.prompt }),
                    ],
                  }),
                  e.jsx("div", {
                    className: "grammar-choices",
                    children: u.question.choices.map((s) =>
                      e.jsxs(
                        "button",
                        {
                          className: `${p === s ? "selected" : ""} ${
                            m && s === u.question.answer ? "correct" : ""
                          } ${
                            m && p === s && s !== u.question.answer
                              ? "wrong"
                              : ""
                          }`,
                          onClick: () => !m && l(s),
                          children: [
                            s,
                            m &&
                              s === u.question.answer &&
                              e.jsx(A, { size: 17 }),
                          ],
                        },
                        s
                      )
                    ),
                  }),
                  m &&
                    e.jsx("p", {
                      className: "grammar-feedback",
                      children: u.question.explanation,
                    }),
                  e.jsxs("button", {
                    className: "primary-action grammar-submit",
                    disabled: !p || m,
                    onClick: () => o(!0),
                    children: [
                      m ? "已完成" : "检查答案",
                      m ? e.jsx(A, { size: 17 }) : e.jsx(T, { size: 17 }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function shuffleQuizItems(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}
function getQuizPool(words, stageId) {
  return stageId === "all"
    ? words
    : words.filter((word) => word.stageId === stageId);
}
function createQuizSession(words, stageId, previousSession = null, count = 10) {
  const pool = getQuizPool(words, stageId),
    questionCount = Math.min(count, pool.length),
    previousWords = new Set(
      previousSession?.round.map((question) => question.target.word) || []
    );
  let deck =
    previousSession?.stageId === stageId ? [...previousSession.deck] : [];
  const selected = [],
    selectedWords = new Set();
  while (selected.length < questionCount) {
    if (!deck.length) {
      const freshWords = pool.filter((word) => !previousWords.has(word.word)),
        recentWords = pool.filter((word) => previousWords.has(word.word));
      deck = [
        ...shuffleQuizItems(freshWords),
        ...shuffleQuizItems(recentWords),
      ];
    }
    const nextWord = deck.shift();
    if (!nextWord || selectedWords.has(nextWord.word)) continue;
    selected.push(nextWord), selectedWords.add(nextWord.word);
  }
  const round = selected.map((target) => {
    const distractors = Array.from(
      new Map(
        shuffleQuizItems(
          pool.filter(
            (word) =>
              word.word !== target.word && word.meaning !== target.meaning
          )
        ).map((word) => [word.meaning, word])
      ).values()
    ).slice(0, 3);
    return {
      target,
      choices: shuffleQuizItems([target, ...distractors]),
    };
  });
  return { stageId, deck, round };
}
function ze({
  words: n,
  onMaster: g,
  speak: j,
  questionCount = 10,
  delay = 3,
  autoPlay = true,
  showPhonetic = true,
}) {
  const [stageId, setStageId] = x.useState("all"),
    [session, setSession] = x.useState(() =>
      createQuizSession(n, "all", null, questionCount)
    ),
    [r, c] = x.useState(0),
    [i, a] = x.useState(""),
    [p, l] = x.useState(!1),
    [m, o] = x.useState(0),
    question = session.round[r],
    h = question?.target,
    z = question?.choices || [],
    questionTotal = session.round.length,
    quizRanges = [
      { id: "all", label: `全部阶段（${n.length}词）` },
      ...coreStages.map((stage) => ({
        id: stage.id,
        label: `${stage.label}（${
          n.filter((word) => word.stageId === stage.id).length
        }词）`,
      })),
    ];
  function y(answer) {
    if (p && i === h.meaning) return;
    a(answer),
      l(!0),
      answer === h.meaning && (autoPlay && j(h.word), o(m + 1), g(h.word));
  }
  function restartQuiz() {
    setSession((current) =>
      createQuizSession(n, stageId, current, questionCount)
    ),
      c(0),
      a(""),
      l(!1),
      o(0);
  }
  function changeQuizRange(nextStageId) {
    setStageId(nextStageId),
      setSession(createQuizSession(n, nextStageId, null, questionCount)),
      c(0),
      a(""),
      l(!1),
      o(0);
  }
  x.useEffect(() => {
    if (!p || i !== h.meaning) return;
    const timer = window.setTimeout(() => {
      c((current) => current + 1), a(""), l(!1);
    }, delay * 1000);
    return () => window.clearTimeout(timer);
  }, [p, r, i, h?.meaning, delay]);
  if (r >= questionTotal)
    return e.jsxs("section", {
      className: "quiz-page",
      children: [
        e.jsxs("div", {
          className: "quiz-range",
          children: [
            e.jsx("span", { children: "闯关范围" }),
            e.jsx("div", {
              className: "quiz-range-options",
              children: quizRanges.map((range) =>
                e.jsx(
                  "button",
                  {
                    type: "button",
                    className: stageId === range.id ? "active" : "",
                    onClick: () => changeQuizRange(range.id),
                    "aria-pressed": stageId === range.id,
                    children: range.label,
                  },
                  range.id
                )
              ),
            }),
          ],
        }),
        e.jsxs("div", {
          className: "quiz-meta",
          children: [
            e.jsx("span", { children: "闯关完成" }),
            e.jsxs("strong", {
              children: [questionTotal, " / ", questionTotal],
            }),
            e.jsxs("span", { children: ["得分 ", m] }),
          ],
        }),
        e.jsxs("div", {
          className: "quiz-card",
          children: [
            e.jsx(A, { size: 36 }),
            e.jsx("h2", { children: "本轮练习完成" }),
            e.jsxs("p", {
              children: [
                "你答对了 ",
                m,
                " 道题，共 ",
                questionTotal,
                " 道题。",
              ],
            }),
            e.jsxs("button", {
              className: "primary-action",
              onClick: restartQuiz,
              children: ["再来一轮", e.jsx(T, { size: 18 })],
            }),
          ],
        }),
      ],
    });
  return e.jsxs("section", {
    className: "quiz-page",
    children: [
      e.jsxs("div", {
        className: "quiz-range",
        children: [
          e.jsx("span", { children: "闯关范围" }),
          showPhonetic &&
            e.jsx("div", {
              className: "quiz-range-options",
              children: quizRanges.map((range) =>
                e.jsx(
                  "button",
                  {
                    type: "button",
                    className: stageId === range.id ? "active" : "",
                    onClick: () => changeQuizRange(range.id),
                    "aria-pressed": stageId === range.id,
                    children: range.label,
                  },
                  range.id
                )
              ),
            }),
        ],
      }),
      e.jsxs("div", {
        className: "quiz-meta",
        children: [
          e.jsx("span", { children: "构词闯关" }),
          e.jsxs("strong", { children: [r + 1, " / ", questionTotal] }),
          e.jsxs("span", { children: ["得分 ", m] }),
        ],
      }),
      e.jsxs("div", {
        className: "quiz-card",
        children: [
          e.jsx(je, { size: 28 }),
          e.jsx("p", { children: "根据拆词线索，选择正确词义" }),
          e.jsxs("button", {
            className: "quiz-word",
            onClick: () => j(h.word),
            children: [h.word, e.jsx(U, { size: 19 })],
          }),
          e.jsx("div", {
            className: "quiz-phonetic",
            children: `/${(quizPhonetics[h.word] || h.phonetic).replace(
              /^\/|\/$/g,
              ""
            )}/`,
          }),
          e.jsx("div", {
            className: "quiz-parts",
            children: h.parts.map((b) => b.text).join(" + "),
          }),
          e.jsx("div", {
            className: "choices",
            children: z.map((b) =>
              e.jsxs(
                "button",
                {
                  className: `${i === b.meaning ? "selected" : ""} ${
                    p && i === h.meaning && b.meaning === h.meaning
                      ? "correct"
                      : ""
                  } ${p && i === b.meaning && i !== h.meaning ? "wrong" : ""}`,
                  onClick: () => y(b.meaning),
                  children: [
                    $(b.meaning),
                    p &&
                      i === h.meaning &&
                      b.meaning === h.meaning &&
                      e.jsx(A, { size: 18 }),
                  ],
                },
                b.meaning
              )
            ),
          }),
          p &&
            e.jsx("p", {
              className: "quiz-explain",
              children:
                i === h.meaning ? $(h.explanation) : "选错了，请再试一次。",
            }),
        ],
      }),
    ],
  });
}
const helpRoutes = [
  {
    id: "starter",
    label: "零基础入门",
    note: "先建立声音和短句能力",
    path: ["启蒙基础", "音标表", "构词入门", "闯关练习"],
  },
  {
    id: "words",
    label: "提升词汇",
    note: "从拆词理解到练习巩固",
    path: ["学习地图", "词根库", "扩展词典", "闯关练习"],
  },
  {
    id: "grammar",
    label: "学习语法",
    note: "先懂词性，再进入句子结构",
    path: ["启蒙语法", "基础语法", "进阶语法", "专项练习"],
  },
  {
    id: "exam",
    label: "考试备考",
    note: "词汇与语法同步查漏补缺",
    path: ["进阶英语", "备考英语", "备考强化", "学习记录"],
  },
];
const helpTopics = [
  {
    id: "morpheme",
    index: "01",
    title: "构词法入门",
    summary: "认识前缀、词根、后缀，学会拆单词。",
    steps: [
      ["先找核心", "词根或基础词承载单词最主要的意思，例如 happy 表示“开心”。"],
      ["再看前后", "前缀常改变意思，后缀常改变词性或形式，例如 un + happy。"],
      ["合起来理解", "unhappy 就是“不开心的”。先理解结构，再记完整词义。"],
    ],
  },
  {
    id: "sound",
    index: "02",
    title: "发音怎么学",
    summary: "分清字母、自然拼读和国际音标。",
    steps: [
      ["先听", "点击喇叭听完整单词，不急着只看字母猜发音。"],
      ["再确认", "自然拼读帮助你尝试拼读，音标帮助你确认准确读音。"],
      ["最后跟读", "看着音标跟读两遍，再把声音和中文意思联系起来。"],
    ],
  },
  {
    id: "grammar",
    index: "03",
    title: "语法怎么学",
    summary: "从词性开始，理解单词怎样组成句子。",
    steps: [
      ["看规则", "先弄清本课只解决哪个问题，不要一次背很多术语。"],
      ["看例句", "观察规则在真实句子中的位置和变化。"],
      ["马上练", "完成一道小练习，用错误提示找到还没理解的部分。"],
    ],
  },
  {
    id: "modules",
    index: "04",
    title: "模块怎么选",
    summary: "系统学习用地图，快速查询用词根库。",
    steps: [
      ["系统学习", "进入学习地图，按阶段认识构词组、派生词和例句。"],
      ["临时查询", "进入词根库或扩展词典，快速查找需要的内容。"],
      ["检查掌握", "进入闯关练习验证，再到学习记录查看进度。"],
    ],
  },
  {
    id: "routine",
    index: "05",
    title: "五步学习法",
    summary: "听、看、拆、读、练，完成一次有效学习。",
    steps: [
      ["听与看", "先听发音，再看音标，建立单词声音。"],
      ["拆与读", "观察单词拆解，阅读词义和例句。"],
      ["练与复习", "进入闯关；选对后再听一遍，并记录掌握状态。"],
    ],
  },
  {
    id: "questions",
    index: "06",
    title: "遇到不会怎么办",
    summary: "不会读、看不懂、总选错，都有对应方法。",
    steps: [
      ["不会读", "重复播放本地发音，对照音标慢慢跟读。"],
      ["看不懂", "先看拆解和核心意思，再使用扩展词典补充查询。"],
      ["总选错", "回到学习地图重看例句，不要只重复猜答案。"],
    ],
  },
];
const helpModules = [
  ["starter", "启蒙基础", "从字母、拼读和短句开始"],
  ["phonetics", "音标表", "学习48个国际音标"],
  ["learn", "学习地图", "按阶段系统学习构词"],
  ["library", "词根库", "快速查找构词和派生词"],
  ["grammar", "语法学习", "理解单词怎样组成句子"],
  ["dictionary", "扩展词典", "查询课程外的单词"],
  ["quiz", "闯关练习", "检验词义和拆词掌握"],
  ["records", "学习记录", "查看掌握与复习进度"],
];
const starterHelpTopics = [
  {
    id: "letters",
    index: "01",
    title: "先认识字母",
    summary: "认识字母名称、大小写和基本字母音。",
    steps: [
      ["先听字母名", "点击字母卡片听发音，先建立字母形状和声音的联系。"],
      ["再认大小写", "把 A 和 a 作为同一个字母来认识，不必一次默写全部字母。"],
      ["最后开口读", "跟读两遍，再进入下一个字母；容易混淆的字母单独复习。"],
    ],
  },
  {
    id: "phonics",
    index: "02",
    title: "自然拼读入门",
    summary: "学习字母在单词中的常见声音。",
    steps: [
      ["听清字母音", "字母名称和字母音不同，先听清音，再观察示例单词。"],
      ["尝试拼合", "把几个声音慢慢连起来，例如 c-a-t，再读成完整单词。"],
      ["不过度猜读", "拼读规律有例外，拿不准时点击喇叭确认。"],
    ],
  },
  {
    id: "starter-ipa",
    index: "03",
    title: "音标入门",
    summary: "先学常用音，再逐步认识完整音标表。",
    steps: [
      ["先学元音", "从常见短元音和长元音开始，观察口形并听标准发音。"],
      ["再学辅音", "把辅音和熟悉的字母、例词联系起来。"],
      ["用来确认", "看到新单词时先听，再用音标确认，不要求一次背完48个音标。"],
    ],
  },
  {
    id: "sight-words",
    index: "04",
    title: "认识常用小词",
    summary: "先掌握句子里最常见的基础词。",
    steps: [
      ["整词听读", "常用小词先按整体声音和意思记忆。"],
      ["放进短句", "在 I am、This is 等短句中理解单词的用法。"],
      ["少量重复", "每次学习少量词，隔天再听读一次。"],
    ],
  },
  {
    id: "starter-sentence",
    index: "05",
    title: "开口读短句",
    summary: "把已学声音和单词放进简单句子。",
    steps: [
      ["先听整句", "先感受整句节奏，不急着逐词翻译。"],
      ["分段跟读", "把句子分成短小语块，一段一段模仿。"],
      ["替换练习", "替换一个熟悉单词，练习表达相似意思。"],
    ],
  },
  {
    id: "starter-check",
    index: "06",
    title: "准备学习单词",
    summary: "确认能听、能读，再进入学习地图。",
    steps: [
      ["检查声音", "能听辨常见字母音，并愿意开口跟读即可。"],
      ["开始构词", "进入学习地图的构词入门，不需要先学完所有音标。"],
      ["穿插复习", "遇到不会读的词，再回音标表或启蒙基础复习。"],
    ],
  },
];
const grammarHelpTopics = [
  {
    id: "parts-of-speech",
    index: "01",
    title: "先认识词性",
    summary: "分清名词、动词、形容词等基本角色。",
    steps: [
      ["看单词角色", "先判断单词表示人、事物、动作还是特征。"],
      ["放进句子", "观察同一个词在句子中的位置和作用。"],
      ["完成小练习", "先判断词性，再查看解释校正理解。"],
    ],
  },
  {
    id: "sentence-parts",
    index: "02",
    title: "句子基本成分",
    summary: "找到谁、做什么以及补充信息。",
    steps: [
      ["先找谓语", "先找到句子中的核心动作或状态。"],
      ["再找主语", "判断是谁执行动作或处于这个状态。"],
      ["补充成分", "最后识别宾语、表语和修饰语。"],
    ],
  },
  {
    id: "basic-tense",
    index: "03",
    title: "理解基础时态",
    summary: "用时间线理解现在、过去和将来。",
    steps: [
      ["先看时间", "圈出 yesterday、now、tomorrow 等时间线索。"],
      ["再看动词", "观察动词原形、过去式和助动词的变化。"],
      ["对比例句", "用同一句话切换时间，比较形式变化。"],
    ],
  },
  {
    id: "nouns-verbs",
    index: "04",
    title: "名词和动词变化",
    summary: "掌握复数、第三人称和过去式。",
    steps: [
      ["先懂用途", "先明确变化是在表示多个、第三人称还是过去。"],
      ["学习规则", "学习 -s、-es、-ed 等规则与发音。"],
      ["单独记例外", "不规则形式少量分组记忆，不和规则形式混在一起。"],
    ],
  },
  {
    id: "complex-sentence",
    index: "05",
    title: "进入复杂句",
    summary: "逐步理解并列句、从句和非谓语。",
    steps: [
      ["先拆主干", "先保留主语和谓语，找出句子核心意思。"],
      ["再看连接", "利用 and、because、who 等词判断关系。"],
      ["最后还原", "把修饰内容放回主干，读懂完整句意。"],
    ],
  },
  {
    id: "grammar-review",
    index: "06",
    title: "语法怎样复习",
    summary: "用错题定位知识点，不机械重读。",
    steps: [
      ["记录错误", "标记自己错在词性、形式还是语序。"],
      ["回看规则", "只回看对应知识点和例句。"],
      ["重新应用", "换一个新句子验证是否真正理解。"],
    ],
  },
];
const examHelpTopics = [
  {
    id: "exam-scope",
    index: "01",
    title: "明确考试范围",
    summary: "先选择考试阶段，再安排学习内容。",
    steps: [
      ["选择目标", "明确是中高考、四六级、考研还是留学考试。"],
      ["查看范围", "确认对应词汇阶段和语法课程。"],
      ["设定节奏", "按可完成的每日数量学习，避免一次铺开全部内容。"],
    ],
  },
  {
    id: "exam-vocab",
    index: "02",
    title: "优先高频词汇",
    summary: "先掌握高频核心词，再扩展低频词。",
    steps: [
      ["先会核心义", "先记考试中最常见的含义。"],
      ["再看构词", "利用词根词缀关联派生词和词性。"],
      ["结合发音", "听读单词，避免只记中文形状。"],
    ],
  },
  {
    id: "exam-grammar",
    index: "03",
    title: "补齐核心语法",
    summary: "按薄弱点学习，不平均分配时间。",
    steps: [
      ["先做判断", "从容易出错的语法类型开始。"],
      ["理解规则", "结合例句理解形式为什么变化。"],
      ["马上验证", "学完一个知识点立即完成对应练习。"],
    ],
  },
  {
    id: "exam-mistakes",
    index: "04",
    title: "整理易错内容",
    summary: "把错误转化成下一轮复习任务。",
    steps: [
      ["分清错误", "区分不认识、记混、读错和语法判断错误。"],
      ["回到来源", "返回对应词根、单词或语法课程。"],
      ["隔天重测", "不要当场反复猜，间隔后再检测一次。"],
    ],
  },
  {
    id: "exam-quiz",
    index: "05",
    title: "进行闯关检测",
    summary: "用限量题目检测真实掌握情况。",
    steps: [
      ["先独立作答", "不要先看解释或只凭选项形状判断。"],
      ["答对再听", "答对后听一次发音并阅读拆解提示。"],
      ["错题不放过", "选错时留在当前题，理解后再选正确答案。"],
    ],
  },
  {
    id: "exam-records",
    index: "06",
    title: "查看记录复盘",
    summary: "根据学习记录安排下一次复习。",
    steps: [
      ["看掌握数量", "检查已掌握和学习中的单词数量。"],
      ["找薄弱模块", "比较词汇与语法进度，优先补短板。"],
      ["调整计划", "根据正确率和剩余时间调整每日目标。"],
    ],
  },
];
const helpContentByRoute = {
  starter: {
    topics: starterHelpTopics,
    modules: helpModules.filter(([id]) =>
      ["starter", "phonetics", "learn", "quiz"].includes(id)
    ),
  },
  words: {
    topics: helpTopics,
    modules: helpModules.filter(([id]) =>
      ["learn", "library", "dictionary", "quiz", "records"].includes(id)
    ),
  },
  grammar: {
    topics: grammarHelpTopics,
    modules: helpModules.filter(([id]) =>
      ["grammar", "records", "help"].includes(id)
    ),
  },
  exam: {
    topics: examHelpTopics,
    modules: helpModules.filter(([id]) =>
      ["learn", "grammar", "dictionary", "quiz", "records"].includes(id)
    ),
  },
};
function HelpPage({ onNavigate: n }) {
  const [g, j] = x.useState(helpRoutes[0].id),
    [r, c] = x.useState(starterHelpTopics[0].id),
    i = helpRoutes.find((a) => a.id === g) || helpRoutes[0],
    routeContent = helpContentByRoute[g] || helpContentByRoute.starter,
    topics = routeContent.topics,
    modules = routeContent.modules,
    a = topics.find((p) => p.id === r) || topics[0];
  return e.jsxs("section", {
    className: "page-view help-page",
    children: [
      e.jsxs("header", {
        className: "help-hero",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "学习导航",
              }),
              e.jsx("h2", { children: "不知道从哪里开始？先选一个目标" }),
              e.jsx("p", {
                children:
                  "从字母启蒙到考试词汇，用正确顺序学习3291个单词和150个语法知识点。",
              }),
            ],
          }),
          e.jsxs("div", {
            className: "help-stats",
            children: [
              e.jsxs("strong", {
                children: ["3291", e.jsx("small", { children: "单词" })],
              }),
              e.jsxs("strong", {
                children: ["150", e.jsx("small", { children: "语法点" })],
              }),
              e.jsxs("strong", {
                children: ["48", e.jsx("small", { children: "音标" })],
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "help-route-panel",
        children: [
          e.jsx("div", {
            className: "help-route-tabs",
            children: helpRoutes.map((p) =>
              e.jsx(
                "button",
                {
                  type: "button",
                  className: g === p.id ? "active" : "",
                  onClick: () => {
                    j(p.id);
                    c(helpContentByRoute[p.id].topics[0].id);
                  },
                  children: p.label,
                },
                p.id
              )
            ),
          }),
          e.jsxs("div", {
            className: "help-route-result",
            children: [
              e.jsx("span", { children: i.note }),
              e.jsx("div", {
                children: i.path.map((p, l) =>
                  e.jsxs(
                    X.Fragment,
                    {
                      children: [
                        l > 0 && e.jsx("b", { children: "→" }),
                        e.jsx("strong", { children: p }),
                      ],
                    },
                    p
                  )
                ),
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "help-workspace",
        children: [
          e.jsx("div", {
            className: "help-topic-grid",
            children: topics.map((p) =>
              e.jsxs(
                "button",
                {
                  type: "button",
                  className: r === p.id ? "active" : "",
                  onClick: () => c(p.id),
                  children: [
                    e.jsx("span", { children: p.index }),
                    e.jsx("strong", { children: p.title }),
                    e.jsx("small", { children: p.summary }),
                  ],
                },
                p.id
              )
            ),
          }),
          e.jsxs("article", {
            className: "help-detail",
            children: [
              e.jsx("span", {
                className: "section-label",
                children: `知识卡 ${a.index}`,
              }),
              e.jsx("h3", { children: a.title }),
              e.jsx("p", {
                className: "help-detail-summary",
                children: a.summary,
              }),
              e.jsx("ol", {
                children: a.steps.map(([p, l], m) =>
                  e.jsxs(
                    "li",
                    {
                      children: [
                        e.jsx("span", { children: m + 1 }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("strong", { children: p }),
                            e.jsx("p", { children: l }),
                          ],
                        }),
                      ],
                    },
                    p
                  )
                ),
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "help-module-section",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("span", {
                className: "section-label",
                children: "快速入口",
              }),
              e.jsx("h3", { children: "每个模块是做什么的" }),
            ],
          }),
          e.jsx("div", {
            className: "help-module-grid",
            children: modules.map(([p, l, m]) =>
              e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => n(p),
                  children: [
                    e.jsxs("span", {
                      children: [
                        e.jsx("strong", { children: l }),
                        e.jsx("small", { children: m }),
                      ],
                    }),
                    e.jsx(T, { size: 17 }),
                  ],
                },
                p
              )
            ),
          }),
        ],
      }),
    ],
  });
}
function Ie({ progress: n, total: g }) {
  const j = Object.entries(n).filter(([, i]) => i === "mastered"),
    r = Object.entries(n).filter(([, i]) => i === "learning"),
    c = Math.round((j.length / g) * 100);
  return e.jsxs("section", {
    className: "page-view",
    children: [
      e.jsx("div", {
        className: "page-heading",
        children: e.jsxs("div", {
          children: [
            e.jsx("span", { className: "section-label", children: "学习记录" }),
            e.jsx("h2", { children: "每一次拆词，都在积累词汇能力" }),
          ],
        }),
      }),
      e.jsxs("div", {
        className: "record-summary",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("span", { children: "总掌握率" }),
              e.jsxs("strong", { children: [c, "%"] }),
              e.jsx("div", {
                className: "progress-track",
                children: e.jsx("i", { style: { width: `${c}%` } }),
              }),
            ],
          }),
          e.jsxs("div", {
            children: [
              e.jsx("span", { children: "已掌握" }),
              e.jsx("strong", { children: j.length }),
              e.jsx("small", { children: "个单词" }),
            ],
          }),
          e.jsxs("div", {
            children: [
              e.jsx("span", { children: "学习中" }),
              e.jsx("strong", { children: r.length }),
              e.jsx("small", { children: "个单词" }),
            ],
          }),
          e.jsxs("div", {
            children: [
              e.jsx("span", { children: "词库总量" }),
              e.jsx("strong", { children: g }),
              e.jsx("small", { children: "个核心词" }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "record-list",
        children: [
          e.jsx("div", {
            className: "panel-head",
            children: e.jsxs("div", {
              children: [
                e.jsx("span", {
                  className: "section-label",
                  children: "最近进度",
                }),
                e.jsx("h2", { children: "正在积累的单词" }),
              ],
            }),
          }),
          Object.entries(n).length
            ? Object.entries(n)
                .reverse()
                .map(([i, a]) =>
                  e.jsxs(
                    "div",
                    {
                      children: [
                        e.jsx("span", {
                          className: `learning-mark ${a}`,
                          children:
                            a === "mastered" ? e.jsx(A, { size: 14 }) : "·",
                        }),
                        e.jsx("strong", { children: i }),
                        e.jsx("span", {
                          children:
                            a === "mastered"
                              ? "已掌握"
                              : a === "learning"
                              ? "学习中"
                              : "需复习",
                        }),
                      ],
                    },
                    i
                  )
                )
            : e.jsxs("div", {
                className: "empty-state",
                children: [
                  e.jsx(H, { size: 30 }),
                  e.jsx("p", {
                    children: "完成第一个单词后，记录会出现在这里",
                  }),
                ],
              }),
        ],
      }),
    ],
  });
}
function Le({ word: n, nextWord: g }) {
  const [j, r] = x.useState(""),
    [c, i] = x.useState(!1);
  x.useEffect(() => {
    r(""), i(!1);
  }, [n.word]);
  const a = [n.meaning, "向前移动", "快速书写", "重新开始"].sort((p, l) =>
    p.localeCompare(l)
  );
  return e.jsxs("div", {
    className: "mini-quiz",
    children: [
      e.jsx("div", {
        className: "panel-head",
        children: e.jsxs("div", {
          children: [
            e.jsx("span", { className: "section-label", children: "随堂小测" }),
            e.jsx("h2", { children: "这个词是什么意思？" }),
          ],
        }),
      }),
      e.jsx("strong", { className: "question-word", children: n.word }),
      e.jsx("div", {
        className: "mini-options",
        children: a.map((p) =>
          e.jsxs(
            "button",
            {
              className: `${j === p ? "selected" : ""} ${
                c && p === n.meaning ? "correct" : ""
              }`,
              onClick: () => !c && r(p),
              children: [$(p), c && p === n.meaning && e.jsx(A, { size: 15 })],
            },
            p
          )
        ),
      }),
      e.jsxs("button", {
        className: "primary-action small",
        disabled: !j,
        onClick: () => (c ? g() : i(!0)),
        children: [c ? "继续学习" : "检查答案", e.jsx(T, { size: 17 })],
      }),
    ],
  });
}
function P({ label: n, value: g, unit: j }) {
  return e.jsxs("div", {
    className: "stat",
    children: [
      e.jsx("span", { children: n }),
      e.jsx("strong", { children: g }),
      e.jsx("small", { children: j }),
    ],
  });
}
ne.createRoot(document.getElementById("root")).render(e.jsx(be, {}));
