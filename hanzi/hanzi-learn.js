var apiKey = localStorage.getItem("bl_key") || "";
var stars = +localStorage.getItem("bl_stars") || 0;
var streak = +localStorage.getItem("bl_streak") || 0;
var todayCount = +localStorage.getItem("bl_today") || 0;
var learned = JSON.parse(localStorage.getItem("bl_learned") || "[]");
var dictHistory = JSON.parse(localStorage.getItem("bl_dict_hist") || "[]");
var weekData = JSON.parse(localStorage.getItem("bl_week") || "[0,0,0,0,0,0,0]");
var quizRound = 1,
  quizStreak = 0,
  currentAnswer = "",
  quizIdx = 0;
var currentQuizGrade = "一年级";
var QUIZ_GRADES = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"];
var writeIdx = 0,
  ctx,
  isDrawing = false,
  writeTarget = "";
var currentPhonicsTab = "shengmu";
var phonicsAudio = null;
var currentCategory = "全部";

// ----- 场景分类数据 -----

var currentWriteGrade = "一年级";

var PHONICS = {
  shengmu: {
    label: "声母",
    items: [
      { py: "b", words: ["爸", "本", "白"] },
      { py: "p", words: ["苹", "跑", "朋"] },
      { py: "m", words: ["妈", "门", "米"] },
      { py: "f", words: ["风", "飞", "发"] },
      { py: "d", words: ["大", "地", "读"] },
      { py: "t", words: ["天", "兔", "田"] },
      { py: "n", words: ["你", "鸟", "牛"] },
      { py: "l", words: ["来", "了", "乐"] },
      { py: "g", words: ["个", "国", "高"] },
      { py: "k", words: ["可", "口", "看"] },
      { py: "h", words: ["好", "花", "红"] },
      { py: "j", words: ["家", "就", "鸡"] },
      { py: "q", words: ["去", "球", "气"] },
      { py: "x", words: ["小", "学", "星"] },
      { py: "zh", words: ["这", "知", "中"] },
      { py: "ch", words: ["吃", "出", "春"] },
      { py: "sh", words: ["是", "书", "山"] },
      { py: "r", words: ["人", "日", "热"] },
      { py: "z", words: ["在", "自", "字"] },
      { py: "c", words: ["从", "草", "才"] },
      { py: "s", words: ["是", "说", "水"] },
    ],
  },
  yunmu: {
    label: "韵母",
    items: [
      { py: "a", words: ["啊", "阿", "爸"] },
      { py: "o", words: ["哦", "婆", "波"] },
      { py: "e", words: ["额", "河", "和"] },
      { py: "i", words: ["一", "衣", "鱼"] },
      { py: "u", words: ["乌", "五", "无"] },
      { py: "ü", words: ["鱼", "雨", "玉"] },
      { py: "ai", words: ["爱", "白", "来"] },
      { py: "ei", words: ["飞", "北", "黑"] },
      { py: "ao", words: ["好", "高", "跑"] },
      { py: "ou", words: ["走", "口", "后"] },
      { py: "an", words: ["安", "山", "天"] },
      { py: "en", words: ["们", "门", "很"] },
      { py: "ang", words: ["忙", "想", "方"] },
      { py: "ing", words: ["星", "明", "听"] },
      { py: "ong", words: ["红", "动", "公"] },
    ],
  },
  zhengtiyinjie: {
    label: "整体认读",
    items: [
      { py: "zhi", words: ["知", "之", "直"] },
      { py: "chi", words: ["吃", "尺", "池"] },
      { py: "shi", words: ["是", "时", "石"] },
      { py: "ri", words: ["日", "热"] },
      { py: "zi", words: ["字", "自", "子"] },
      { py: "ci", words: ["此", "次", "词"] },
      { py: "si", words: ["四", "思", "丝"] },
      { py: "yi", words: ["一", "以", "已"] },
      { py: "wu", words: ["五", "无", "物"] },
      { py: "yu", words: ["鱼", "雨", "玉"] },
      { py: "ye", words: ["也", "夜", "页"] },
      { py: "yue", words: ["月", "越", "乐"] },
    ],
  },
};

var BADGES = [
  {
    id: "first",
    iconImg:
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_beginner.png",
    label: "初学者",
    req: 1,
    desc: "学会第1个字",
  },
  {
    id: "ten",
    iconImg:
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_crossword_expert.png",
    label: "十字达人",
    req: 10,
    desc: "学会10个字",
  },
  {
    id: "thirty",
    iconImg:
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_character_hero.png",
    label: "汉字小将",
    req: 30,
    desc: "学会30个字",
  },
  {
    id: "hundred",
    iconImg:
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_character_master.png",
    label: "汉字高手",
    req: 100,
    desc: "学会100个字",
  },
  {
    id: "streak3",
    iconImg:
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_daily_checkin.png",
    label: "坚持三天",
    req: 3,
    desc: "连续学习3天",
    type: "streak",
  },
  {
    id: "quiz10",
    iconImg:
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_quiz_master.png",
    label: "答题王",
    req: 10,
    desc: "答对10道题",
    type: "quiz",
  },
  {
    id: "story",
    iconImg:
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_story_lover.png",
    label: "故事迷",
    req: 1,
    desc: "读完一个成语故事",
    type: "story",
  },
];

var DAILY_TASKS = [
  {
    id: "scene",
    iconImg:
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_daily_scene.png",
    name: "场景认字一次",
    stars: 3,
  },
  {
    id: "quiz3",
    iconImg:
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_daily_quiz.png",
    name: "闯关答对3题",
    stars: 5,
  },
  {
    id: "dict1",
    iconImg:
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_daily_dict.png",
    name: "查一个AI字典",
    stars: 2,
  },
  {
    id: "write1",
    iconImg:
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_daily_write.png",
    name: "练习写一个字",
    stars: 4,
  },
];

var DEFAULT_VL_MODEL = "qwen3.7-plus";
var DEFAULT_TEXT_MODEL = "qwen3.6-plus";

function selectedSettingModel(selectId, storageKey, fallback) {
  var saved = localStorage.getItem(storageKey);
  var select = document.getElementById(selectId);
  if (!select) return saved || fallback;
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value === saved) return saved;
  }
  return select.value || fallback;
}

function vlModel() {
  return selectedSettingModel(
    "setting-vl-model",
    "bl_vl_model",
    DEFAULT_VL_MODEL
  );
}

function vlTextModel() {
  return selectedSettingModel(
    "setting-text-model",
    "bl_text_model",
    DEFAULT_TEXT_MODEL
  );
}

// ---- 设置面板 ----
function openSetting() {
  document.getElementById("setting-api-key").value = apiKey || "";
  document.getElementById("setting-vl-model").value = vlModel();
  document.getElementById("setting-text-model").value = vlTextModel();
  updateSettingStatus();
  document.getElementById("setting-overlay").classList.add("open");
}

function closeSetting() {
  document.getElementById("setting-overlay").classList.remove("open");
}

function updateSettingStatus() {
  var el = document.getElementById("setting-status");
  var key = document.getElementById("setting-api-key").value.trim();
  if (!key) {
    el.className = "status empty";
    el.textContent = "未配置";
  } else if (key.startsWith("sk-")) {
    el.className = "status ok";
    el.textContent = "已配置 ✓";
  } else {
    el.className = "status err";
    el.textContent = "格式不对";
  }
}

function saveSetting() {
  var key = document.getElementById("setting-api-key").value.trim();
  if (!key.startsWith("sk-")) {
    updateSettingStatus();
    return;
  }
  apiKey = key;
  localStorage.setItem("bl_key", key);
  localStorage.setItem(
    "bl_vl_model",
    document.getElementById("setting-vl-model").value
  );
  localStorage.setItem(
    "bl_text_model",
    document.getElementById("setting-text-model").value
  );
  updateSettingStatus();
  toast("✅ 设置已保存");
  closeSetting();
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("setting-api-key")
    .addEventListener("input", updateSettingStatus);
});

function setStatus(t, txt) {
  var el = document.getElementById("api-status");
  if (el) {
    el.className = "api-status " + t;
    el.textContent = txt;
  }
}

// async function callAIStream(prompt, sys, onChunk) {
//   if (!apiKey) {
//     onChunk("请先点击⚙️设置百炼 API Key 哦～ 🔑");
//     return;
//   }
//   var formatRule =
//     "统一版式要求：使用纯文本；不要 Markdown；不要 ** 加粗；不要开场白；不要把多个要点挤在一行；每个编号要点必须单独换行；编号统一使用 ①②③④⑤⑥⑦⑧⑨；标题最多一行。";
//   var system =
//     (sys ||
//       "你是专门帮助1-6年级小朋友学习汉字的老师郑老师。用简单生动的语言，多用比喻和小故事。回答控制在200字以内。") +
//     formatRule;
//   try {
//     var r = await fetch(
//       "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + apiKey,
//         },
//         body: JSON.stringify({
//           model: vlTextModel(),
//           messages: [
//             { role: "system", content: system },
//             { role: "user", content: prompt },
//           ],
//           max_tokens: 400,
//           temperature: 0.85,
//           stream: true,
//         }),
//       }
//     );
//     if (!r.ok) {
//       onChunk("❌ API错误 " + r.status);
//       return;
//     }
//     var reader = r.body.getReader();
//     var dec = new TextDecoder();
//     var buf = "";
//     while (true) {
//       var res = await reader.read();
//       if (res.done) break;
//       buf += dec.decode(res.value, { stream: true });
//       var lines = buf.split("\n");
//       buf = lines.pop();
//       for (var i = 0; i < lines.length; i++) {
//         var line = lines[i];
//         if (!line.startsWith("data:")) continue;
//         var json = line.slice(5).trim();
//         if (json === "[DONE]") return;
//         try {
//           var o = JSON.parse(json);
//           var d =
//             o.choices &&
//             o.choices[0] &&
//             o.choices[0].delta &&
//             o.choices[0].delta.content;
//           if (d) onChunk(d);
//         } catch (e) {}
//       }
//     }
//   } catch (e) {
//     onChunk("\n❌ 网络错误");
//   }
// }

const WORKER_URL = "https://yuwen-api-vwrbnprcpt.cn-hangzhou.fcapp.run";
async function callAIStream(prompt, sys, onChunk) {
  const system = sys || "你是专门帮助1-6年级小朋友学习汉字的老师郑老师。";

  try {
    const response = await fetch(`${WORKER_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        stream: true,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") return;

        try {
          const json = JSON.parse(data);
          const content =
            json.choices &&
            json.choices[0] &&
            json.choices[0].delta &&
            json.choices[0].delta.content;
          if (content) onChunk(content);
        } catch (e) { }
      }
    }
  } catch (error) {
    console.error("AI调用失败:", error);
    onChunk(`❌ 请求失败: ${error.message}`);
  }
}

function aiCard(sid) {
  return (
    '<div class="ai-card"><div class="ai-hd"><div class="ai-avatar">🌟</div><span class="ai-name">郑老师</span><button class="ai-tts-btn" type="button" onclick="playAIText(\'' +
    sid +
    '\', this)">🔊 朗读</button></div><div class="ai-text" id="' +
    sid +
    '"><div class="typing-dots"><span></span><span></span><span></span></div></div></div>'
  );
}

function cleanAIText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/^#{1,6}\s*/gm, "");
}

function formatAIText(text) {
  return cleanAIText(text)
    .replace(/\r\n/g, "\n")
    .replace(/1️⃣|1⃣/g, "①")
    .replace(/2️⃣|2⃣/g, "②")
    .replace(/3️⃣|3⃣/g, "③")
    .replace(/4️⃣|4⃣/g, "④")
    .replace(/5️⃣|5⃣/g, "⑤")
    .replace(/6️⃣|6⃣/g, "⑥")
    .replace(/7️⃣|7⃣/g, "⑦")
    .replace(/8️⃣|8⃣/g, "⑧")
    .replace(/9️⃣|9⃣/g, "⑨")
    .replace(/(^|\n)\s*([1-9])[.、]\s*/g, function (_, lineStart, n) {
      return lineStart + "①②③④⑤⑥⑦⑧⑨".charAt(Number(n) - 1) + " ";
    })
    .replace(/[ \t]+\n/g, "\n")
    .replace(/([^\n])([①②③④⑤⑥⑦⑧⑨])/g, "$1\n$2")
    .replace(/([。！？~～])\s*(?=[①②③④⑤⑥⑦⑧⑨])/g, "$1\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function setAIText(el, text) {
  var formatted = formatAIText(text);
  el.textContent = formatted;
  el.dataset.ttsText = formatted;
}

var currentTtsAudio = null;
var ttsAudioCache = new Map();
var TTS_CACHE_LIMIT = 20;

function getTtsCacheKey(text) {
  return text.slice(0, 800);
}

function saveTtsCache(key, audioUrl) {
  if (ttsAudioCache.has(key)) return;
  ttsAudioCache.set(key, audioUrl);

  if (ttsAudioCache.size > TTS_CACHE_LIMIT) {
    var firstKey = ttsAudioCache.keys().next().value;
    var oldUrl = ttsAudioCache.get(firstKey);
    URL.revokeObjectURL(oldUrl);
    ttsAudioCache.delete(firstKey);
  }
}

async function playAIText(textId, btn) {
  var el = document.getElementById(textId);
  var text = (el && (el.dataset.ttsText || el.textContent || "")).trim();
  if (!text) {
    toast("还没有可以朗读的内容");
    return;
  }

  if (currentTtsAudio) {
    currentTtsAudio.pause();
    currentTtsAudio = null;
  }

  var oldText = btn ? btn.textContent : "";
  var cacheKey = getTtsCacheKey(text);
  var cachedUrl = ttsAudioCache.get(cacheKey);

  if (btn) {
    btn.disabled = true;
    btn.textContent = cachedUrl ? "播放中..." : "生成中...";
  }

  try {
    var audioUrl = cachedUrl;

    if (!audioUrl) {
      var response = await fetch(`${WORKER_URL}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cacheKey }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      var blob = await response.blob();
      audioUrl = URL.createObjectURL(blob);
      saveTtsCache(cacheKey, audioUrl);
    }

    currentTtsAudio = new Audio(audioUrl);
    currentTtsAudio.onended = function () {
      if (btn) {
        btn.disabled = false;
        btn.textContent = oldText;
      }
    };
    currentTtsAudio.onerror = function () {
      if (btn) {
        btn.disabled = false;
        btn.textContent = oldText;
      }
      toast("朗读播放失败");
    };
    await currentTtsAudio.play();
  } catch (e) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = oldText;
    }
    toast("朗读生成失败");
  }
}

function closeAll() {
  if (typeof closeCoursewarePdf === "function") closeCoursewarePdf();
  document.querySelectorAll(".overlay").forEach(function (o) {
    o.classList.remove("open");
  });
}

function openModal(id) {
  document.getElementById(id).classList.add("open");
}

function toast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function () {
    t.classList.remove("show");
  }, 2200);
}

function addStar(n) {
  stars += n;
  localStorage.setItem("bl_stars", stars);
  document.getElementById("star-num").textContent = stars;
  burst(n);
}

function burst(n) {
  var e = document.createElement("div");
  e.className = "star-burst";
  e.textContent = n >= 3 ? "🌟🌟🌟" : n >= 2 ? "⭐⭐" : "⭐";
  document.body.appendChild(e);
  setTimeout(function () {
    e.remove();
  }, 900);
}

function markLearned(char) {
  if (!learned.includes(char)) {
    learned.push(char);
    if (todayCount < 10) todayCount++;
    weekData[6]++;
    localStorage.setItem("bl_learned", JSON.stringify(learned));
    localStorage.setItem("bl_today", todayCount);
    localStorage.setItem("bl_week", JSON.stringify(weekData));
    updateProgress();
    checkBadges();
    renderNBCount();
  }
}

function updateProgress() {
  document.getElementById("today-count").textContent = todayCount;
  document.getElementById("hero-count").textContent = todayCount;
  document.getElementById("hero-left").textContent = Math.max(
    0,
    10 - todayCount
  );
  document.getElementById("progress").style.width =
    (todayCount / 10) * 100 + "%";
}

function renderNBCount() {
  var el = document.getElementById("nb-count");
  if (el) el.textContent = learned.length;
}

function checkBadges() {
  var ul = JSON.parse(localStorage.getItem("bl_badges") || "[]");
  BADGES.forEach(function (b) {
    if (ul.includes(b.id)) return;
    var ok = false;
    if (b.type === "streak") ok = streak >= b.req;
    else if (b.type === "quiz")
      ok = (+localStorage.getItem("bl_quiz_correct") || 0) >= b.req;
    else if (b.type === "story")
      ok = (+localStorage.getItem("bl_story_count") || 0) >= b.req;
    else ok = learned.length >= b.req;
    if (ok) {
      ul.push(b.id);
      toast("🎉 解锁成就：" + b.label + "！");
    }
  });
  localStorage.setItem("bl_badges", JSON.stringify(ul));
  renderBadges();
}

function renderBadges() {
  var ul = JSON.parse(localStorage.getItem("bl_badges") || "[]");
  document.getElementById("achieve-row").innerHTML = BADGES.map(function (b) {
    return (
      '<div class="badge-item" title="' +
      b.desc +
      '"><div class="badge-icon ' +
      (ul.includes(b.id) ? "unlocked" : "locked") +
      '">' +
      '<img src="' +
      b.iconImg +
      '" alt="" />' +
      "</div></div>"
    );
  }).join("");
}

function renderDailyQuick() {
  var done = JSON.parse(localStorage.getItem("bl_daily_done") || "[]");
  var total = DAILY_TASKS.length,
    finished = done.length;
  var earned = DAILY_TASKS.reduce(function (a, t) {
    return done.includes(t.id) ? a + t.stars : a;
  }, 0);
  var fns = {
    scene: "openScene()",
    quiz3: "openQuiz()",
    dict1: "openDict()",
    write1: "openWrite()",
  };
  document.getElementById("daily-quick").innerHTML =
    '<div class="daily-card"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;"><span style="font-size:13px;font-weight:700;color:#2D3748;">完成 ' +
    finished +
    "/" +
    total +
    ' 项任务</span><span style="font-size:12px;color:#A855F7;font-weight:700;">+' +
    earned +
    ' ⭐ 已获得</span></div><div style="display:flex;gap:6px;">' +
    DAILY_TASKS.map(function (t) {
      var d = done.includes(t.id);
      return (
        '<div style="flex:1;text-align:center;cursor:pointer;" onclick="' +
        (!d ? fns[t.id] : "") +
        '"><div style="' +
        (d ? "filter:grayscale(.6);opacity:.6" : "") +
        '"><img src="' +
        t.iconImg +
        '" alt="" style="width:80px;height:80px;object-fit:contain;display:block;margin:0 auto;"></div><div style="font-size:10px;color:' +
        (d ? "#94A3B8" : "#4A5568") +
        ';margin-top:2px;font-weight:700;">' +
        (d ? "✓完成" : "去做") +
        "</div></div>"
      );
    }).join("") +
    "</div></div>";
}

function completeTask(id) {
  var done = JSON.parse(localStorage.getItem("bl_daily_done") || "[]");
  if (!done.includes(id)) {
    done.push(id);
    localStorage.setItem("bl_daily_done", JSON.stringify(done));
    var t = DAILY_TASKS.find(function (t) {
      return t.id === id;
    });
    if (t) {
      addStar(t.stars);
      toast("✅ 任务完成：" + t.name + " +" + t.stars + "⭐");
    }
    renderDailyQuick();
  }
}

var currentScene = 0;

function openScene() {
  currentScene = 0;
  currentCategory = "全部";
  renderSceneTabs();
  renderSceneCategories();
  renderSceneObjects();
  document.getElementById("scene-ai").innerHTML = "";
  openModal("ov-scene");
}

function renderSceneTabs() {
  document.getElementById("scene-tabs").innerHTML = SCENES.map(function (s, i) {
    return (
      '<div class="scene-tab ' +
      (i === currentScene ? "active" : "") +
      '" onclick="switchScene(' +
      i +
      ')">' +
      '<img src="' +
      s.img +
      '" class="scene-img" alt="' +
      s.name +
      '" />' +
      "</div>"
    );
  }).join("");
  scrollActiveSceneTabIntoView();
}

function scrollSceneTabs(direction) {
  var tabs = document.getElementById("scene-tabs");
  if (!tabs) return;
  tabs.scrollBy({
    left: direction * Math.max(160, Math.floor(tabs.clientWidth * 0.75)),
    behavior: "smooth",
  });
}

function scrollActiveSceneTabIntoView() {
  setTimeout(function () {
    var active = document.querySelector("#scene-tabs .scene-tab.active");
    if (active) {
      active.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, 0);
}

// 渲染分类标签
function renderSceneCategories() {
  var bar = document.getElementById("scene-category-bar");
  var cats = getSceneCategories(SCENES[currentScene]);
  bar.innerHTML = cats
    .map(function (cat) {
      return (
        '<div class="scene-category ' +
        (cat.id === currentCategory ? "active" : "") +
        '" onclick="filterSceneCategory(\'' +
        cat.id +
        "')\">" +
        cat.icon +
        " " +
        cat.label +
        "</div>"
      );
    })
    .join("");
}

function getSceneCategories(scene) {
  var ids = ["全部"];
  scene.objects.forEach(function (obj) {
    if (
      obj.category &&
      obj.category !== "全部" &&
      !ids.includes(obj.category)
    ) {
      ids.push(obj.category);
    }
  });
  return ids.map(function (id) {
    return SCENE_CATEGORY_META[id] || { id: id, icon: "📌", label: id };
  });
}

// 根据分类筛选显示物品
function filterSceneCategory(catId) {
  currentCategory = catId;
  renderSceneCategories();
  renderSceneObjects();
}

function switchScene(i) {
  currentScene = i;
  currentCategory = "全部";
  renderSceneTabs();
  renderSceneCategories();
  renderSceneObjects();
  document.getElementById("scene-ai").innerHTML = "";
}

function renderSceneObjects() {
  var s = SCENES[currentScene];
  var objects = s.objects;

  // 根据分类筛选
  if (currentCategory !== "全部") {
    objects = objects.filter(function (o) {
      return o.category === currentCategory;
    });
  }

  var container = document.getElementById("scene-objects");
  if (objects.length === 0) {
    container.innerHTML =
      '<div style="padding:20px;color:#94a3b8;font-size:14px;">这个分类下还没有物品哦 🌟</div>';
    return;
  }

  container.innerHTML = objects
    .map(function (o, i) {
      var pinyin = getScenePinyin(o.char);
      var chars = String(o.label || o.char || "").match(/[\u4e00-\u9fa5]/g) || [
        o.char,
      ];
      return (
        '<div class="scene-tab scene-word-card" id="sobj-' +
        i +
        '" title="' +
        escapeHtml(o.label) +
        '" onclick="learnSceneChar(\'' +
        o.char +
        "','" +
        o.label +
        "'," +
        i +
        ')">' +
        '<div class="scene-word-pinyin">' +
        escapeHtml(pinyin) +
        "</div>" +
        '<div class="scene-word-grid scene-word-main-grid">' +
        '<span class="tc">' +
        escapeHtml(o.char) +
        "</span>" +
        "</div>" +
        '<div class="scene-word-copybook">' +
        '<div class="scene-word-pinyin scene-word-copy-pinyin">' +
        escapeHtml(pinyin) +
        "</div>" +
        '<div class="scene-word-grid scene-word-copy-grid scene-word-grid-' +
        Math.min(chars.length, 4) +
        '">' +
        chars
          .slice(0, 4)
          .map(function (ch) {
            return '<span class="tc">' + escapeHtml(ch) + "</span>";
          })
          .join("") +
        "</div>" +
        "</div>" +
        "</div>"
      );
    })
    .join("");
}

var scenePinyinCache = {};
var scenePinyinMap = null;

function getScenePinyin(char) {
  char = String(char || "").charAt(0);
  if (!char) return "";
  if (scenePinyinCache[char]) return scenePinyinCache[char];

  if (window.pinyinPro && typeof window.pinyinPro.pinyin === "function") {
    scenePinyinCache[char] = window.pinyinPro.pinyin(char, {
      toneType: "symbol",
    });
    return scenePinyinCache[char];
  }

  if (!scenePinyinMap) {
    scenePinyinMap = {};
    [window.QUIZ_DATA, window.DAILY_CHARS, window.STROKE_DATA].forEach(
      function (list) {
        if (!Array.isArray(list)) return;
        list.forEach(function (item) {
          if (item && item.char && item.pinyin && !scenePinyinMap[item.char]) {
            scenePinyinMap[item.char] = item.pinyin;
          }
        });
      }
    );
    if (window.WRITE_CHAR_GROUPS) {
      Object.keys(window.WRITE_CHAR_GROUPS).forEach(function (grade) {
        window.WRITE_CHAR_GROUPS[grade].forEach(function (item) {
          if (item && item.char && item.pinyin && !scenePinyinMap[item.char]) {
            scenePinyinMap[item.char] = item.pinyin;
          }
        });
      });
    }
  }

  scenePinyinCache[char] = scenePinyinMap[char] || "";
  return scenePinyinCache[char];
}

// 修复：去掉多余的 category 参数
async function learnSceneChar(char, label, idx) {
  document.querySelectorAll("#scene-objects .scene-tab").forEach(function (e) {
    e.classList.remove("active");
  });
  var el = document.getElementById("sobj-" + idx);
  if (el) el.classList.add("active");

  var aiEl = document.getElementById("scene-ai");
  aiEl.innerHTML = aiCard("scene-stream");
  var textEl = document.getElementById("scene-stream");
  textEl.innerHTML = "";
  var full = "";
  await callAIStream(
    "请严格按下面固定版式介绍汉字「" +
    char +
    "」（" +
    label +
    "）：\n认识「" +
    char +
    "」字，小朋友\n① 字形：像什么，用一句话说明\n② 拼音：拼音和声调\n③ 例句：一个生动例句\n④ 记忆：一个记忆小技巧\n⑤ 笔画部首：总笔画、偏旁部首、部首含义\n⑥ 组词：两个生活常用组词\n⑦ 生活：生活中哪里能看见\n⑧ 近反义：有近义词/反义词就写，没有就写“没有常用近反义词”",
    null,
    function (chunk) {
      full += chunk;
      setAIText(textEl, full);
    }
  );
  markLearned(char);
  addStar(1);
  completeTask("scene");
}
function getQuizDataPool() {
  if (currentQuizGrade === "全部") return QUIZ_DATA;
  var data = QUIZ_DATA.filter(function (q) {
    return q.grade === currentQuizGrade;
  });
  return data.length ? data : QUIZ_DATA;
}

function renderQuizGradeTabs() {
  var wrap = document.getElementById("quiz-grade-tabs");
  wrap.innerHTML = QUIZ_GRADES.map(function (grade) {
    return (
      '<div class="tab' +
      (grade === currentQuizGrade ? " active" : "") +
      '" onclick="switchQuizGrade(\'' +
      grade +
      "')\">" +
      grade +
      "</div>"
    );
  }).join("");
}

function switchQuizGrade(grade) {
  currentQuizGrade = grade;
  quizIdx = 0;
  quizRound = 1;
  quizStreak = 0;
  renderQuizGradeTabs();
  renderQuiz();
}

function openQuiz() {
  renderQuizGradeTabs();
  renderQuiz();
  openModal("ov-quiz");
}

function renderQuiz() {
  var data = getQuizDataPool();
  var q = data[quizIdx] || QUIZ_DATA[0];
  var quizRoundEl = document.getElementById("quiz-round");
  if (quizRoundEl) quizRoundEl.textContent = quizRound;
  document.getElementById("quiz-char").textContent = q.char;
  document.getElementById("quiz-pinyin").textContent = q.pinyin;
  document.getElementById("quiz-q").textContent = q.q;
  document.getElementById("quiz-ai").innerHTML = "";
  document.getElementById("quiz-streak").textContent =
    quizStreak >= 3 ? "🔥 连对" + quizStreak + "题！" : "";
  currentAnswer = q.ans;
  var opts = q.opts.slice().sort(function () {
    return Math.random() - 0.5;
  });
  document.getElementById("quiz-opts").innerHTML = opts
    .map(function (o) {
      return (
        '<div class="quiz-opt" onclick="answerQuiz(this,\'' +
        o +
        "')\">" +
        o +
        "</div>"
      );
    })
    .join("");
}

async function answerQuiz(el, choice) {
  document.querySelectorAll(".quiz-opt").forEach(function (o) {
    o.onclick = null;
  });
  var ok = choice === currentAnswer;
  el.classList.add(ok ? "right" : "wrong");
  if (!ok)
    document.querySelectorAll(".quiz-opt").forEach(function (o) {
      if (o.textContent === currentAnswer) o.classList.add("right");
    });
  var data = getQuizDataPool();
  var q = data[quizIdx] || QUIZ_DATA[0];
  markLearned(q.char);
  if (ok) {
    quizStreak++;
    addStar(2);
    quizRound++;
    var correct = +localStorage.getItem("bl_quiz_correct") || 0;
    localStorage.setItem("bl_quiz_correct", correct + 1);
    if (correct + 1 >= 3) completeTask("quiz3");
    checkBadges();
  } else {
    quizStreak = 0;
  }
  var aiEl = document.getElementById("quiz-ai");
  aiEl.innerHTML = aiCard("quiz-stream");
  var textEl = document.getElementById("quiz-stream");
  textEl.innerHTML = "";
  var full = "";
  await callAIStream(
    ok
      ? "小朋友答对了！「" +
      q.char +
      "」(" +
      q.pinyin +
      ") 意思是「" +
      q.ans +
      "」，夸夸他，再补充一个有趣知识或例句。"
      : "小朋友答错了，「" +
      q.char +
      "」(" +
      q.pinyin +
      ") 正确答案是「" +
      q.ans +
      "」，温柔鼓励并解释，举一个例句帮助记忆。",
    null,
    function (chunk) {
      full += chunk;
      setAIText(textEl, full);
    }
  );
  setTimeout(function () {
    var data = getQuizDataPool();
    quizIdx = (quizIdx + 1) % data.length;
    renderQuiz();
  }, 5000);
}

function openDict() {
  renderDictHistory();
  openModal("ov-dict");
  setTimeout(function () {
    document.getElementById("dict-input").focus();
  }, 300);
}

function renderDictHistory() {
  document.getElementById("dict-history").innerHTML = dictHistory
    .slice(-8)
    .reverse()
    .map(function (c) {
      return (
        '<div class="dict-hist-chip" onclick="quickLookup(\'' +
        c +
        "')\">" +
        c +
        "</div>"
      );
    })
    .join("");
}

async function doDict() {
  var char = document.getElementById("dict-input").value.trim();
  if (!char) return;
  if (!dictHistory.includes(char)) {
    dictHistory.push(char);
    localStorage.setItem("bl_dict_hist", JSON.stringify(dictHistory));
    renderDictHistory();
  }
  var resultEl = document.getElementById("dict-result");
  resultEl.innerHTML = aiCard("dict-stream");
  var textEl = document.getElementById("dict-stream");
  textEl.innerHTML = "";
  var full = "";
  await callAIStream(
    "请严格按下面固定版式介绍汉字「" +
    char +
    "」：\n认识「" +
    char +
    "」字,小朋友\n① 字形：像什么，用一句话说明\n② 拼音：拼音和声调\n③ 例句：一个生动例句\n④ 记忆：一个记忆小技巧\n⑤ 笔画部首：总笔画、偏旁部首、部首含义\n⑥ 组词：两个生活常用组词",
    "你是专为1-6年级小朋友服务的汉字老师郑老师，温暖生动，控制在250字以内。",
    function (chunk) {
      full += chunk;
      setAIText(textEl, full);
    }
  );
  markLearned(char);
  addStar(1);
  completeTask("dict1");
}

async function quickLookup(char) {
  closeAll();
  document.getElementById("dict-input").value = char;
  requestAnimationFrame(() => {
    openModal("ov-dict");
    renderDictHistory();
    doDict();
  });
}

function openWrite() {
  renderWriteGradeTabs();
  var data = getWriteDataPool();
  writeIdx = Math.floor(Math.random() * data.length);
  renderWriteTarget();
  document.getElementById("write-result").innerHTML = "";
  openModal("ov-write");
  setTimeout(initCanvas, 120);
}

function getWriteDataPool() {
  var data = WRITE_CHAR_GROUPS[currentWriteGrade] || [];
  return data.length ? data : WRITE_CHARS;
}

function renderWriteGradeTabs() {
  var wrap = document.getElementById("write-grade-tabs");
  wrap.innerHTML = WRITE_GRADES.map(function (grade) {
    return (
      '<div class="tab' +
      (grade === currentWriteGrade ? " active" : "") +
      '" onclick="switchWriteGrade(\'' +
      grade +
      "')\">" +
      grade +
      "</div>"
    );
  }).join("");
}

function switchWriteGrade(grade) {
  currentWriteGrade = grade;
  writeIdx = 0;
  renderWriteGradeTabs();
  renderWriteTarget();
  clearCanvas();
  document.getElementById("write-result").innerHTML = "";
}

function renderWriteTarget() {
  var data = getWriteDataPool();
  var wc = data[writeIdx] || WRITE_CHARS[0];
  writeTarget = wc.char;
  document.getElementById("write-target").textContent = wc.char;
  document.getElementById("write-pinyin").textContent = wc.pinyin;
}

function prevWriteChar() {
  var data = getWriteDataPool();
  writeIdx = (writeIdx - 1 + data.length) % data.length;
  renderWriteTarget();
  clearCanvas();
  document.getElementById("write-result").innerHTML = "";
}

function nextWriteChar() {
  var data = getWriteDataPool();
  writeIdx = (writeIdx + 1) % data.length;
  renderWriteTarget();
  clearCanvas();
  document.getElementById("write-result").innerHTML = "";
}

function initCanvas() {
  var canvas = document.getElementById("write-canvas");
  ctx = canvas.getContext("2d");
  var size = Math.min(window.innerWidth - 48, 300);
  canvas.width = size;
  canvas.height = size;
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";
  clearCanvas();
  canvas.onmousedown = function (e) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo.apply(ctx, getPos(e, canvas));
  };
  canvas.onmousemove = function (e) {
    if (!isDrawing) return;
    ctx.lineTo.apply(ctx, getPos(e, canvas));
    ctx.stroke();
  };
  canvas.onmouseup = canvas.onmouseleave = function () {
    isDrawing = false;
  };
  canvas.ontouchstart = function (e) {
    e.preventDefault();
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo.apply(ctx, getPos(e.touches[0], canvas));
  };
  canvas.ontouchmove = function (e) {
    e.preventDefault();
    if (!isDrawing) return;
    ctx.lineTo.apply(ctx, getPos(e.touches[0], canvas));
    ctx.stroke();
  };
  canvas.ontouchend = function () {
    isDrawing = false;
  };
}

function getPos(e, canvas) {
  var r = canvas.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top];
}

function clearCanvas() {
  if (!ctx) return;
  var c = document.getElementById("write-canvas");
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.save();
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  var w = c.width,
    h = c.height;
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.moveTo(0, 0);
  ctx.lineTo(w, h);
  ctx.moveTo(w, 0);
  ctx.lineTo(0, h);
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = "#667EEA";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash([]);
}

async function submitWrite() {
  var canvas = document.getElementById("write-canvas");
  var b64 = canvas.toDataURL("image/png").split(",")[1];
  var rEl = document.getElementById("write-result");
  rEl.innerHTML = aiCard("write-stream");
  document.getElementById("write-stream").innerHTML = "";
  try {
    var r = await fetch(`${WORKER_URL}/api/vision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_base64: b64,
        mime_type: "image/png",
        model: vlModel(),
        prompt:
          "小朋友在米字格中练写汉字「" +
          writeTarget +
          "」（蓝色线手写）。请：①判断是否写对 ②给出1-5颗星评分 ③温柔具体指出写得好的地方和需要改进的笔画，语言适合小学生，加emoji鼓励。",
      }),
    });
    if (!r.ok) {
      var err = await r.json().catch(function () {
        return {};
      });
      document.getElementById("write-stream").textContent =
        "API错误：" +
        ((err.error && err.error.message) || r.status) +
        "\n提示：请确认当前视觉模型已开通图片输入权限";
      return;
    }
    var d = await r.json();
    setAIText(
      document.getElementById("write-stream"),
      (d.choices &&
        d.choices[0] &&
        d.choices[0].message &&
        d.choices[0].message.content) ||
      "无法评分"
    );
    markLearned(writeTarget);
    addStar(2);
    completeTask("write1");
  } catch (e) {
    document.getElementById("write-stream").textContent = "❌ 网络错误，请重试";
  }
}

function openStory() {
  currentStorySearch = "";
  currentStoryInitial = "";
  storyVisibleCount = 40;
  loadIdiomStories().then(renderStoryList);
  openModal("ov-story");
}

var currentStorySearch = "";
var currentStoryInitial = "";
var storyVisibleCount = 40;
var idiomStories = null;
var currentStoryResults = [];
var isStoryListView = false;
var storyScrollBound = false;
var STORY_INITIALS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
var CHENGYU_BASE_URL =
  "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/chengyu/";
var idiomDetailChunks = {};

async function loadIdiomStories() {
  if (idiomStories) return idiomStories;
  document.getElementById("story-body").innerHTML =
    '<div class="story-empty">正在加载成语故事库...</div>';
  try {
    var res = await fetch(CHENGYU_BASE_URL + "search-index.json");
    if (!res.ok) throw new Error("load failed");
    idiomStories = await res.json();
  } catch (e) {
    idiomStories = STORIES.map(function (s) {
      return {
        title: s.title,
        pinyin: "",
        chars: s.chars,
        meaning: s.preview,
        detail: s.preview,
        usage: "",
        source: "",
        structure: "",
        examples: [],
        memoryTip: "",
        ageExamples: {},
        prompt: s.prompt,
      };
    });
  }
  return idiomStories;
}

async function loadStoryDetail(i) {
  var item = idiomStories[i];
  if (!item || item.detailLoaded || !item.detailFile) return item;
  if (!idiomDetailChunks[item.detailFile]) {
    var res = await fetch(CHENGYU_BASE_URL + item.detailFile);
    if (!res.ok) throw new Error("detail load failed");
    idiomDetailChunks[item.detailFile] = await res.json();
  }
  var detail = idiomDetailChunks[item.detailFile][item.detailIndex];
  idiomStories[i] = Object.assign({}, item, detail, { detailLoaded: true });
  return idiomStories[i];
}

function storyMatchesSearch(s, keyword) {
  if (!keyword) return true;
  var chars = Array.isArray(s.chars) ? s.chars.join("") : "";
  return (
    s.title.indexOf(keyword) !== -1 ||
    (s.pinyin || "").toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
    (s.meaning || "").indexOf(keyword) !== -1 ||
    (s.detail || "").indexOf(keyword) !== -1 ||
    chars.indexOf(keyword) !== -1
  );
}

function normalizePinyinInitial(pinyin) {
  var plain = String(pinyin || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ü/g, "v");
  var match = plain.match(/[a-z]/);
  return match ? match[0].toUpperCase() : "";
}

function storyMatchesInitial(s, initial) {
  if (!initial) return true;
  return normalizePinyinInitial(s.pinyin) === initial;
}

function filterStoryInitial(initial) {
  currentStoryInitial = currentStoryInitial === initial ? "" : initial;
  storyVisibleCount = 60;
  renderStoryList();
}

function renderStoryInitialFilter() {
  return (
    '<div class="story-initial-filter">' +
    STORY_INITIALS.map(function (letter) {
      return (
        '<button class="story-initial-btn' +
        (currentStoryInitial === letter ? " active" : "") +
        '" onclick="filterStoryInitial(\'' +
        letter +
        "')\">" +
        letter +
        "</button>"
      );
    }).join("") +
    "</div>"
  );
}

function filterStoryList(input) {
  currentStorySearch = input.value.trim();
  storyVisibleCount = 60;
  renderStoryList();
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderStoryList() {
  if (!idiomStories) {
    loadIdiomStories().then(renderStoryList);
    return;
  }
  isStoryListView = true;
  var list = idiomStories
    .map(function (s, i) {
      return { story: s, index: i };
    })
    .filter(function (item) {
      return (
        storyMatchesInitial(item.story, currentStoryInitial) &&
        storyMatchesSearch(item.story, currentStorySearch)
      );
    });
  currentStoryResults = list;
  var visible = list.slice(0, storyVisibleCount);
  var body = document.getElementById("story-body");
  var oldScrollTop = body.scrollTop;
  body.innerHTML =
    '<div class="story-toolbar">' +
    renderStoryInitialFilter() +
    '<input class="story-search" value="' +
    escapeAttr(currentStorySearch) +
    '" placeholder="搜索成语、拼音、汉字或释义" oninput="filterStoryList(this)" /></div>' +
    '<div class="story-meta">共 ' +
    list.length +
    " 条，当前显示 " +
    Math.min(visible.length, list.length) +
    " 条</div>" +
    '<div class="story-grid">' +
    (visible.length
      ? visible
        .map(function (item) {
          var s = item.story;
          var chars = Array.isArray(s.chars)
            ? s.chars
            : String(s.title || "").split("");
          return (
            '<div class="story-card" onclick="openStoryDetail(' +
            item.index +
            ')">' +
            '<div class="story-title">' +
            escapeHtml(s.title) +
            "</div>" +
            '<div class="story-meta">' +
            escapeHtml(s.pinyin || "") +
            "</div>" +
            '<div class="story-chars">' +
            chars
              .slice(0, 4)
              .map(function (c) {
                return (
                  '<div class="story-char-badge">' + escapeHtml(c) + "</div>"
                );
              })
              .join("") +
            "</div>" +
            '<div class="story-preview">' +
            escapeHtml(s.meaning || s.detail || "") +
            "</div></div>"
          );
        })
        .join("")
      : '<div class="story-empty">没有找到相关成语</div>') +
    "</div>" +
    (list.length > storyVisibleCount
      ? '<div style="text-align:center;margin-top:12px;"><button class="btn-ghost" onclick="loadMoreStories()">查看更多</button></div>'
      : "");
  if (currentStorySearch) {
    var input = document.querySelector("#story-body .story-search");
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
  requestAnimationFrame(function () {
    body.scrollTop = oldScrollTop;
    bindStoryAutoLoad();
  });
}

function loadMoreStories() {
  storyVisibleCount += 40;
  renderStoryList();
}

function bindStoryAutoLoad() {
  if (storyScrollBound) return;
  var body = document.getElementById("story-body");
  body.addEventListener("scroll", function () {
    if (!isStoryListView) return;
    if (currentStoryResults.length <= storyVisibleCount) return;
    var nearBottom =
      body.scrollTop + body.clientHeight >= body.scrollHeight - 160;
    if (!nearBottom) return;
    storyVisibleCount += 40;
    renderStoryList();
  });
  storyScrollBound = true;
}

function storySection(title, text) {
  if (!text) return "";
  return (
    '<div class="story-section"><div class="story-section-title">' +
    title +
    '</div><div class="story-section-text">' +
    escapeHtml(text) +
    "</div></div>"
  );
}

async function openStoryDetail(i) {
  isStoryListView = false;
  var body = document.getElementById("story-body");
  body.innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><button class="btn-ghost" style="padding:6px 12px;font-size:12px;" onclick="renderStoryList()">← 返回</button></div>' +
    '<div class="story-empty">正在加载成语详情...</div>';
  var s;
  try {
    s = await loadStoryDetail(i);
  } catch (e) {
    body.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><button class="btn-ghost" style="padding:6px 12px;font-size:12px;" onclick="renderStoryList()">← 返回</button></div>' +
      '<div class="story-empty">成语详情加载失败，请稍后再试</div>';
    return;
  }
  var chars = Array.isArray(s.chars)
    ? s.chars
    : String(s.title || "").split("");
  var examples = Array.isArray(s.examples) ? s.examples : [];
  var ageExamples = s.ageExamples || {};
  var ageHtml = Object.keys(ageExamples)
    .map(function (key) {
      var labelMap = {
        primary: "小学",
        middle: "初中",
        high: "高中",
        college: "大学",
      };
      return (
        "<li>" +
        (labelMap[key] || key) +
        "：" +
        escapeHtml(ageExamples[key]) +
        "</li>"
      );
    })
    .join("");
  body.innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><button class="btn-ghost" style="padding:6px 12px;font-size:12px;" onclick="renderStoryList()">← 返回</button></div>' +
    '<div class="story-detail-card"><div class="story-detail-title">' +
    escapeHtml(s.title) +
    '</div><div class="story-meta">' +
    escapeHtml(s.pinyin || "") +
    '</div><div class="story-chars" style="margin-bottom:12px;">' +
    chars
      .map(function (c) {
        return '<div class="story-char-badge">' + escapeHtml(c) + "</div>";
      })
      .join("") +
    "</div>" +
    storySection("字义解析", s.meaning) +
    storySection("深度详解", s.detail) +
    storySection("字词用法", s.usage) +
    storySection("字源溯源", s.source) +
    storySection("字形构造", s.structure) +
    storySection("识记小方法", s.memoryTip) +
    (examples.length
      ? '<div class="story-section"><div class="story-section-title">基础例句</div><ul class="story-example-list">' +
      examples
        .map(function (ex) {
          return "<li>" + escapeHtml(ex) + "</li>";
        })
        .join("") +
      "</ul></div>"
      : "") +
    (ageHtml
      ? '<div class="story-section"><div class="story-section-title">分层范文句</div><ul class="story-example-list">' +
      ageHtml +
      "</ul></div>"
      : "") +
    '</div><div style="text-align:center;margin:12px 0;"><button class="btn-primary" onclick="analyzeStory(' +
    i +
    ')">AI 分析</button></div><div id="story-ai"></div>';
  chars.forEach(function (c) {
    markLearned(c);
  });
  var sc = +localStorage.getItem("bl_story_count") || 0;
  localStorage.setItem("bl_story_count", sc + 1);
  checkBadges();
}

async function analyzeStory(i) {
  var s = await loadStoryDetail(i);
  document.getElementById("story-ai").innerHTML = aiCard("story-stream");
  document.getElementById("story-stream").innerHTML = "";
  var full = "";
  await callAIStream(
    "请分析成语「" +
    s.title +
    "」。资料：释义=" +
    (s.meaning || "") +
    "；详细解释=" +
    (s.detail || "") +
    "；出处=" +
    (s.source || "") +
    "；用法=" +
    (s.usage || "") +
    "。请按顺序讲清楚：①意思 ②故事或来源 ③小朋友怎么用 ④它告诉我们的道理。",
    "你是专门帮小朋友学成语的郑老师，讲解生动，适合小学生。回答要规范分条，控制在300字以内。",
    function (chunk) {
      full += chunk;
      setAIText(document.getElementById("story-stream"), full);
    }
  );
  addStar(3);
  toast("🎉 学完成语 +3⭐");
}

function openPhonics() {
  switchPhonicsTab("shengmu");
  openModal("ov-phonics");
}

function switchPhonicsTab(tab, el) {
  currentPhonicsTab = tab;
  document.querySelectorAll("#phonics-tabs .tab").forEach(function (t) {
    t.classList.remove("active");
  });
  if (el) el.classList.add("active");
  else {
    var tabs = document.querySelectorAll("#phonics-tabs .tab");
    if (tabs[0]) tabs[0].classList.add("active");
  }
  document.getElementById("phonics-display").style.display = "none";
  var data = PHONICS[tab];
  document.getElementById("phonics-grid-wrap").innerHTML =
    '<div class="phonics-grid">' +
    data.items
      .map(function (it) {
        return (
          '<div class="phonics-btn" data-py="' +
          it.py +
          '" data-words="' +
          encodeURIComponent(JSON.stringify(it.words)) +
          '"><div class="py">' +
          it.py +
          '</div><div class="py-label">' +
          it.words[0] +
          "</div></div>"
        );
      })
      .join("") +
    "</div>";
  document
    .querySelectorAll("#phonics-grid-wrap .phonics-btn")
    .forEach(function (btn) {
      btn.addEventListener("click", function () {
        var py = btn.getAttribute("data-py");
        var words = JSON.parse(
          decodeURIComponent(btn.getAttribute("data-words"))
        );
        playPhonicsAudio(py);
        showPhonics(py, words, btn);
      });
    });
}

function getPhonicsAudioPath(py) {
  var folderMap = {
    shengmu: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/声母/",
    yunmu: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/韵母/",
    zhengtiyinjie:
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/整体认读音节/",
  };
  var fileName = py.replace("ü", "v");
  if (currentPhonicsTab === "zhengtiyinjie") fileName += "1";
  return folderMap[currentPhonicsTab] + fileName + ".mp3";
}

function playPhonicsAudio(py) {
  if (!phonicsAudio) {
    phonicsAudio = document.createElement("audio");
    phonicsAudio.id = "phonics-audio";
    phonicsAudio.preload = "auto";
    document.body.appendChild(phonicsAudio);
  }
  phonicsAudio.pause();
  phonicsAudio.currentTime = 0;
  phonicsAudio.src = getPhonicsAudioPath(py);
  phonicsAudio.load();
  phonicsAudio.play().catch(function () {
    console.warn("拼音音频播放失败", py, phonicsAudio.src, phonicsAudio.error);
    toast("音频播放失败：" + py);
  });
}

async function showPhonics(py, words, el) {
  document.querySelectorAll(".phonics-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  if (el) el.classList.add("active");
  var disp = document.getElementById("phonics-display");
  disp.style.display = "block";
  document.getElementById("phonics-big").textContent = py;
  document.getElementById("phonics-words").innerHTML = words
    .map(function (w) {
      return (
        '<div class="phonics-word" onclick="quickLookup(\'' +
        w +
        "')\">" +
        w +
        "</div>"
      );
    })
    .join("");
  document.getElementById("phonics-ai").innerHTML = aiCard("phonics-stream");
  document.getElementById("phonics-stream").innerHTML = "";
  var full = "";
  await callAIStream(
    "教小朋友学拼音「" +
    py +
    "」的发音：①怎么发音（口型）②举2-3个含这个音的字 ③一个记忆发音的小技巧，生动活泼适合小学生。",
    null,
    function (chunk) {
      full += chunk;
      setAIText(document.getElementById("phonics-stream"), full);
    }
  );
}

function openNoteBook() {
  renderNoteBook("");
  openModal("ov-notebook");
}

function filterNB() {
  renderNoteBook(document.getElementById("nb-input").value.trim());
}

function renderNoteBook(filter) {
  var show = filter
    ? learned.filter(function (c) {
      return c.includes(filter);
    })
    : learned;
  var nbCountEl = document.getElementById("nb-count");
  if (nbCountEl) nbCountEl.textContent = learned.length;
  if (!show.length) {
    document.getElementById("nb-grid").innerHTML =
      '<div class="nb-empty">还没有记录哦，快去学汉字吧 🌟</div>';
    return;
  }
  document.getElementById("nb-grid").innerHTML = show
    .slice()
    .reverse()
    .map(function (c) {
      return (
        '<div class="nb-char" onclick="quickLookup(\'' +
        c +
        '\')"><span class="c">' +
        c +
        "</span></div>"
      );
    })
    .join("");
}

function openRadicals() {
  renderRadicals();
  openModal("ov-radical");
}

function renderRadicals() {
  document.getElementById("radical-body").innerHTML =
    '<div class="radical-summary">共 ' +
    RADICALS_201.length +
    " 个部首。点击部首可以查看常见字，再让 AI 讲更多。</div>" +
    '<div id="radical-detail"></div>' +
    '<div class="radical-grid">' +
    RADICALS_201.map(function (item) {
      return (
        '<div class="radical-card" onclick="showRadicalDetail(\'' +
        item.radical +
        '\')" title="第' +
        item.order +
        '个部首">' +
        '<div class="radical-symbol">' +
        item.radical +
        "</div>" +
        '<div class="radical-order">#' +
        item.order +
        "</div></div>"
      );
    }).join("") +
    "</div>";
}

function showRadicalDetail(radical) {
  var info = RADICAL_EXAMPLES[radical] || {
    name: radical + "部",
    meaning: "这是汉字部首之一，可以结合具体汉字继续认识。",
    words: [],
  };
  document.querySelectorAll(".radical-card").forEach(function (card) {
    card.classList.toggle(
      "active",
      card.querySelector(".radical-symbol").textContent === radical
    );
  });
  document.getElementById("radical-detail").innerHTML =
    '<div class="radical-detail"><div class="radical-detail-head">' +
    '<div class="radical-detail-symbol">' +
    radical +
    "</div>" +
    '<div><div class="radical-detail-title">' +
    info.name +
    '</div><div class="radical-detail-text">' +
    info.meaning +
    "</div></div></div>" +
    '<div class="radical-examples">' +
    (info.words.length
      ? info.words
        .map(function (w) {
          return '<span class="radical-example">' + w + "</span>";
        })
        .join("")
      : '<span class="radical-example">暂无本地例字</span>') +
    "</div>" +
    '<button class="btn-primary" onclick="analyzeRadical(\'' +
    radical +
    "')\">AI 讲更多</button>" +
    '<div id="radical-ai"></div></div>';
}

async function analyzeRadical(radical) {
  var info = RADICAL_EXAMPLES[radical] || {
    name: radical + "部",
    meaning: "",
    words: [],
  };
  document.getElementById("radical-ai").innerHTML = aiCard("radical-stream");
  document.getElementById("radical-stream").innerHTML = "";
  var full = "";
  await callAIStream(
    "请给小学生讲解部首「" +
    radical +
    "」。名称：" +
    info.name +
    "。含义：" +
    info.meaning +
    "。本地例字：" +
    info.words.join("、") +
    "。请补充更多常见字和词语，并说明这个部首常表示什么。",
    "你是专门教1-6年级小朋友识字的郑老师。回答要分条、简洁、生动，控制在220字以内。",
    function (chunk) {
      full += chunk;
      setAIText(document.getElementById("radical-stream"), full);
    }
  );
}

function init() {
  if (apiKey) {
    document.getElementById("setting-api-key").value = apiKey;
    updateSettingStatus();
  }
  document.getElementById("star-num").textContent = stars;
  document.getElementById("streak-num").textContent = streak;
  updateProgress();
  renderBadges();
  renderDailyQuick();
  renderNBCount();
  document.querySelectorAll(".overlay").forEach(function (o) {
    o.addEventListener("click", function (e) {
      if (e.target === o) closeAll();
    });
  });
  document
    .getElementById("dict-input")
    .addEventListener("keydown", function (e) {
      if (e.key === "Enter") doDict();
    });
  document.addEventListener("keydown", handleGuoxueKeydown);
  document.addEventListener("keydown", handleCoursewareKeydown);
  initCoursewareSwipe();
  window.addEventListener("resize", handleCoursewareResize);
  document.getElementById("nb-input").addEventListener("input", filterNB);
  document
    .getElementById("setting-overlay")
    .addEventListener("click", function (e) {
      if (e.target === this) closeSetting();
    });
}
init();

function initDailyChar() {
  var day = Math.floor(Date.now() / 86400000) % DAILY_CHARS.length;
  var dc = DAILY_CHARS[day];
  document.getElementById("daily-char-wrap").innerHTML =
    '<div class="daily-char-banner" onclick="quickLookup(\'' +
    dc.char +
    "')\">" +
    '<div class="daily-char-big">' +
    dc.char +
    "</div>" +
    '<div class="daily-char-info">' +
    '<div class="daily-char-tag">今日一字</div>' +
    "<h3>" +
    dc.char +
    " · " +
    dc.pinyin +
    "</h3>" +
    "<p>" +
    dc.meaning +
    "<br>例：" +
    dc.example +
    "</p>" +
    "</div></div>";
}

var isNight = localStorage.getItem("bl_night") === "1";

function applyTheme() {
  document.body.classList.toggle("night", isNight);
}

function toggleTheme() {
  isNight = !isNight;
  localStorage.setItem("bl_night", isNight ? "1" : "0");
  applyTheme();
}

var audioCtx = null,
  musicPlaying = false,
  melodyIdx = 0,
  melodyTimer = null,
  bgGain = null;
var MELODY = [
  261, 294, 330, 349, 392, 440, 392, 349, 330, 294, 261, 0, 294, 330, 392, 440,
  494, 440, 392, 330,
];

function initAudioCtx() {
  if (!audioCtx)
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playMelodyNote() {
  if (!musicPlaying || !audioCtx) return;
  var freq = MELODY[melodyIdx % MELODY.length];
  melodyIdx++;
  if (freq > 0) {
    var osc = audioCtx.createOscillator(),
      g = audioCtx.createGain();
    osc.connect(g);
    g.connect(bgGain);
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.07, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.45);
  }
  melodyTimer = setTimeout(playMelodyNote, 500);
}

function toggleMusic() {
  initAudioCtx();
  if (audioCtx.state === "suspended") audioCtx.resume();
  musicPlaying = !musicPlaying;
  document.getElementById("music-btn").textContent = musicPlaying ? "🔇" : "🎵";
  if (musicPlaying) {
    bgGain = audioCtx.createGain();
    bgGain.gain.value = 1;
    bgGain.connect(audioCtx.destination);
    melodyIdx = 0;
    playMelodyNote();
  } else {
    clearTimeout(melodyTimer);
  }
}

function playSfx(type) {
  try {
    initAudioCtx();
    if (audioCtx.state === "suspended") audioCtx.resume();
    var osc = audioCtx.createOscillator(),
      g = audioCtx.createGain();
    osc.connect(g);
    g.connect(audioCtx.destination);
    if (type === "correct") {
      osc.type = "sine";
      osc.frequency.value = 523;
      g.gain.setValueAtTime(0.15, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === "wrong") {
      osc.type = "square";
      osc.frequency.value = 180;
      g.gain.setValueAtTime(0.08, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } else if (type === "star") {
      osc.type = "sine";
      osc.frequency.value = 880;
      g.gain.setValueAtTime(0.1, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }
  } catch (e) { }
}

var winAction = null;

function showWin(emoji, title, sub, action) {
  document.getElementById("win-emoji").textContent = emoji;
  document.getElementById("win-title").textContent = title;
  document.getElementById("win-sub").textContent = sub;
  winAction = typeof action === "function" ? action : null;
  document.getElementById("win-modal").classList.add("open");
  playSfx("star");
}

function closeWin() {
  document.getElementById("win-modal").classList.remove("open");
  if (winAction) {
    var action = winAction;
    winAction = null;
    action();
  }
}

var sentenceIdx = 0,
  sentenceAnswer = [],
  sentencePool = [];
var currentSentenceGrade = "一年级";
var SENTENCE_GRADES = [
  "一年级",
  "二年级",
  "三年级",
  "四年级",
  "五年级",
  "六年级",
];

function getSentenceDataPool() {
  if (currentSentenceGrade === "全部") return SENTENCE_DATA;
  return SENTENCE_DATA.filter(function (d) {
    return d.grade === currentSentenceGrade;
  });
}

function renderSentenceGradeTabs() {
  var wrap = document.getElementById("sentence-grade-tabs");
  wrap.innerHTML = SENTENCE_GRADES.map(function (grade) {
    return (
      '<div class="tab' +
      (grade === currentSentenceGrade ? " active" : "") +
      '" onclick="switchSentenceGrade(\'' +
      grade +
      "')\">" +
      grade +
      "</div>"
    );
  }).join("");
}

function switchSentenceGrade(grade) {
  currentSentenceGrade = grade;
  sentenceIdx = 0;
  renderSentenceGradeTabs();
  renderSentence();
}

function openSentence() {
  renderSentenceGradeTabs();
  var data = getSentenceDataPool();
  sentenceIdx = Math.floor(Math.random() * data.length);
  renderSentence();
  openModal("ov-sentence");
}

function renderSentence() {
  var data = getSentenceDataPool();
  var d = data[sentenceIdx] || SENTENCE_DATA[0];
  document.getElementById("sentence-key").textContent = d.key;
  sentenceAnswer = [];
  sentencePool = buildSentencePool(d).sort(function () {
    return Math.random() - 0.5;
  });
  document.getElementById("sentence-ai").innerHTML = "";
  renderSentenceUI();
}

function buildSentencePool(d) {
  var pool = d.words.slice();
  if (!pool.includes("，")) pool.push("，");
  if (!pool.includes("。")) pool.push("。");
  return pool;
}

function renderSentenceUI() {
  var ans = document.getElementById("sentence-answer");
  ans.innerHTML =
    sentenceAnswer
      .map(function (w, i) {
        return (
          '<div class="word-chip in-answer" onclick="removeFromAnswer(' +
          i +
          ')">' +
          w +
          "</div>"
        );
      })
      .join("") +
    (sentenceAnswer.length === 0
      ? '<span style="color:#CBD5E1;font-size:13px;">点击下面的词语放进来</span>'
      : "");
  document.getElementById("sentence-pool").innerHTML = sentencePool
    .map(function (w, i) {
      return (
        '<div class="word-chip" onclick="addToAnswer(' +
        i +
        ')">' +
        w +
        "</div>"
      );
    })
    .join("");
}

function addToAnswer(i) {
  sentenceAnswer.push(sentencePool[i]);
  sentencePool.splice(i, 1);
  renderSentenceUI();
}

function removeFromAnswer(i) {
  sentencePool.push(sentenceAnswer[i]);
  sentenceAnswer.splice(i, 1);
  renderSentenceUI();
}

function resetSentence() {
  var data = getSentenceDataPool();
  var d = data[sentenceIdx] || SENTENCE_DATA[0];
  sentenceAnswer = [];
  sentencePool = buildSentencePool(d).sort(function () {
    return Math.random() - 0.5;
  });
  renderSentenceUI();
  document.getElementById("sentence-ai").innerHTML = "";
}

function nextSentence() {
  var data = getSentenceDataPool();
  sentenceIdx = (sentenceIdx + 1) % data.length;
  renderSentence();
}

async function checkSentence() {
  if (!sentenceAnswer.length) {
    toast("请先拼出句子哦～");
    return;
  }
  if (!sentenceAnswer.includes("。")) {
    toast("完整句子要加句号哦～");
    return;
  }
  var data = getSentenceDataPool();
  var d = data[sentenceIdx] || SENTENCE_DATA[0],
    composed = sentenceAnswer.join("");
  showComposedSentence(composed);
  var aiEl = document.getElementById("sentence-ai");
  aiEl.innerHTML = aiCard("sentence-stream");
  document.getElementById("sentence-stream").innerHTML = "";
  var full = "";
  markLearned(d.key);
  await callAIStream(
    "小朋友用「" +
    d.key +
    "」造句：「" +
    composed +
    "」。请：①判断是否通顺正确 ②给出1-5星评分 ③温柔夸奖或纠正 ④给出一个更好的示范句。适合小学生，加emoji。",
    null,
    function (chunk) {
      full += chunk;
      setAIText(document.getElementById("sentence-stream"), full);
    }
  );
  addStar(2);
  playSfx("star");
}

function showComposedSentence(text) {
  var ans = document.getElementById("sentence-answer");
  ans.innerHTML = "";
  var finalText = document.createElement("div");
  finalText.className = "sentence-final-text";
  finalText.textContent = text;
  ans.appendChild(finalText);
  document.getElementById("sentence-pool").innerHTML = "";
}

var uploadedImgB64 = "";

function openImgRead() {
  document.getElementById("upload-preview").style.display = "none";
  document.getElementById("imgread-submit-wrap").style.display = "none";
  document.getElementById("imgread-result").innerHTML = "";
  document.getElementById("img-file-input").value = "";
  uploadedImgB64 = "";
  openModal("ov-imgread");
}

function handleImgUpload(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    uploadedImgB64 = e.target.result.split(",")[1];
    var prev = document.getElementById("upload-preview");
    prev.src = e.target.result;
    prev.style.display = "block";
    document.getElementById("imgread-submit-wrap").style.display = "block";
    document.getElementById("imgread-result").innerHTML = "";
  };
  reader.readAsDataURL(file);
}

async function submitImgRead() {
  if (!uploadedImgB64) {
    toast("请先上传图片～");
    return;
  }
  var resultEl = document.getElementById("imgread-result");
  resultEl.innerHTML = aiCard("imgread-stream");
  document.getElementById("imgread-stream").innerHTML = "";
  try {
    var r = await fetch(`${WORKER_URL}/api/vision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_base64: uploadedImgB64,
        mime_type: "image/jpeg",
        model: vlModel(),
        prompt:
          "这是一张图片。请：①列出图片中所有能看到的汉字 ②挑选3-5个适合小学生学习的汉字，分别解释拼音和意思 ③用生动可爱语言，适合1-6年级，加emoji。如果没有汉字就描述图片内容并教几个相关汉字。",
      }),
    });
    if (!r.ok) {
      var e2 = await r.json().catch(function () {
        return {};
      });
      document.getElementById("imgread-stream").textContent =
        "API错误：" + ((e2.error && e2.error.message) || r.status);
      return;
    }
    var d = await r.json();
    setAIText(
      document.getElementById("imgread-stream"),
      (d.choices &&
        d.choices[0] &&
        d.choices[0].message &&
        d.choices[0].message.content) ||
      "识别失败请重试"
    );
    addStar(2);
    playSfx("star");
  } catch (e) {
    document.getElementById("imgread-stream").textContent = "网络错误请重试";
  }
}

var MATCH_POOL = [
  { char: "山", meaning: "高高的地方" },
  { char: "水", meaning: "喝的液体" },
  { char: "火", meaning: "很热的光" },
  { char: "木", meaning: "树做的材料" },
  { char: "日", meaning: "太阳" },
  { char: "月", meaning: "夜晚发光" },
  { char: "人", meaning: "我们自己" },
  { char: "手", meaning: "拿东西用" },
  { char: "口", meaning: "说话的地方" },
  { char: "心", meaning: "身体里跳动" },
  { char: "目", meaning: "用来看东西" },
  { char: "耳", meaning: "用来听声音" },
  { char: "马", meaning: "可以骑的动物" },
  { char: "牛", meaning: "会哞哞叫" },
  { char: "羊", meaning: "白色毛茸茸" },
  { char: "花", meaning: "公园里很美" },
  { char: "树", meaning: "有叶子很高" },
  { char: "草", meaning: "绿色很矮小" },
  { char: "云", meaning: "天上白白的" },
  { char: "雨", meaning: "从天上掉下来的水" },
  { char: "风", meaning: "吹动树叶" },
  { char: "雪", meaning: "冬天白色的" },
];
var matchLeft = [],
  matchRight = [],
  matchSelected = null,
  matchSide = null,
  matchScore = 0,
  matchLeftIdx = null,
  matchRightIdx = null;

var BLOCK_WORD_MAP = window.BLOCK_WORD_MAP || {};

function parseBlockWord(value) {
  var parts = String(value || "").split("｜");
  return {
    word: parts[0] || "",
    tip: parts[1] || "",
  };
}

function openMatch() {
  initMatch();
  openModal("ov-match");
}

function initMatch() {
  matchScore = 0;
  matchSelected = null;
  matchSide = null;
  matchLeftIdx = null;
  matchRightIdx = null;
  document.getElementById("match-ai").innerHTML = "";
  BLOCK_WORD_MAP = window.BLOCK_WORD_MAP || BLOCK_WORD_MAP || {};
  var pool = Object.keys(BLOCK_WORD_MAP).length
    ? Object.keys(BLOCK_WORD_MAP).map(function (char) {
      return { char: char, meaning: BLOCK_WORD_MAP[char] };
    })
    : MATCH_POOL.slice();
  matchLeft = pool.map(function (p, i) {
    var blockInfo = parseBlockWord(BLOCK_WORD_MAP[p.char] || p.meaning);
    return {
      char: p.char,
      meaning: p.meaning,
      word: blockInfo.word || p.meaning,
      tip: blockInfo.tip || p.meaning,
      pinyin: getScenePinyin(p.char),
      image: getBlockImagePath(p.char, blockInfo.word || p.meaning),
      id: i,
    };
  });
  matchRight = [];
  renderMatch();
  updateMatchScore();
}

function renderMatch() {
  document.getElementById("match-left").innerHTML = matchLeft
    .map(function (item, i) {
      return (
        '<button class="match-block-card" type="button" onclick="learnBlockChar(' +
        i +
        ')">' +
        '<div class="match-block-inner">' +
        '<div class="match-block-face match-block-front">' +
        '<div class="match-block-img-wrap"><img class="match-block-img" src="' +
        escapeHtml(item.image) +
        '" alt="" onerror="this.style.display=\'none\'"></div>' +
        '<div class="match-block-bottom">' +
        '<div class="match-block-main">' +
        '<div class="match-block-pinyin">' +
        escapeHtml(item.pinyin) +
        "</div>" +
        '<div class="match-block-grid"><span>' +
        escapeHtml(item.char) +
        "</span></div>" +
        "</div>" +
        '<div class="match-block-word">' +
        escapeHtml(item.word) +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="match-block-face match-block-back">' +
        '<div class="match-block-back-pinyin">' +
        escapeHtml(item.pinyin) +
        "</div>" +
        '<div class="match-block-back-char">' +
        escapeHtml(item.char) +
        "</div>" +
        '<div class="match-block-tip">' +
        escapeHtml(item.tip) +
        "</div>" +
        "</div>" +
        "</div>" +
        "</button>"
      );
    })
    .join("");
  document.getElementById("match-right").innerHTML = "";
}

function getBlockFilePinyin(text) {
  var fileName = "";
  if (window.pinyinPro && typeof window.pinyinPro.pinyin === "function") {
    fileName = window.pinyinPro
      .pinyin(text, {
        toneType: "none",
        type: "array",
      })
      .join("");
  }
  if (!fileName) {
    fileName = Array.from(text || "")
      .map(function (char) {
        return getScenePinyin(char);
      })
      .join("")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  return fileName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function getBlockImagePath(char, word) {
  var charPinyin = getBlockFilePinyin(char);
  var wordPinyin = getBlockFilePinyin(word);
  var fileName = charPinyin;
  if (wordPinyin) {
    fileName += "-" + wordPinyin;
  }
  return "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/blocks/" + encodeURIComponent(fileName || char) + ".png";
}

async function learnBlockChar(idx) {
  var item = matchLeft[idx];
  if (!item) return;
  var box = document.getElementById("match-ai");
  box.innerHTML = aiCard("block-ai");
  var out = document.getElementById("block-ai");
  var text = "";
  await callAIStream(
    "请用儿童能听懂的话讲解汉字“" +
    item.char +
    "”，拼音是" +
    item.pinyin +
    "，组词是“" +
    item.word +
    "”。要求：①字形 ②拼音 ③组词 ④例句 ⑤记忆小技巧，每点单独换行，控制在160字以内。",
    null,
    function (chunk) {
      text += chunk;
      setAIText(out, text);
    }
  );
}

function selectMatch(side, idx) {
  if (side === "left") {
    matchLeftIdx = idx;
    matchSide = "left";
  } else {
    matchRightIdx = idx;
    matchSide = "right";
  }
  renderMatch();
  if (matchLeftIdx !== null && matchRightIdx !== null) {
    var li = matchLeftIdx,
      ri = matchRightIdx;
    matchLeftIdx = null;
    matchRightIdx = null;
    matchSide = null;
    if (matchLeft[li].id === matchRight[ri].id) {
      matchLeft[li].matched = true;
      matchRight[ri].matched = true;
      matchScore++;
      playSfx("correct");
      renderMatch();
      updateMatchScore();
      if (matchScore >= 6) {
        setTimeout(function () {
          showWin("🎉", "全部配对成功！", "你认识这6个汉字了！");
          addStar(5);
        }, 400);
      }
    } else {
      playSfx("wrong");
      var lEl = document.getElementById("match-left").children[li];
      var rEl = document.getElementById("match-right").children[ri];
      if (lEl) lEl.classList.add("wrong");
      if (rEl) rEl.classList.add("wrong");
      setTimeout(function () {
        renderMatch();
      }, 700);
    }
  }
}

function updateMatchScore() {
  document.getElementById("match-score").textContent = "点一点积木，认识汉字";
}

var POETRY_DATA_URL =
  "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img/yuyue5.json";
var SONG_POETRY_DATA_URL =
  "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/song-poems.json";
var poetryData = [];
var filteredPoetry = [];
var poetryPage = 1;
var poetryPageSize = 12;
var poetryType = "all";
var poetryKeyword = "";
var guoxueImagePages = {};

var GUOXUE_ITEMS = {
  三字经: {
    type: "image-pages",
    prefix: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/img/pg",
    suffix: ".jpg",
    pageCount: 118,
    alt: "三字经",
  },
  弟子规:
    "弟子规，圣人训。\n 首孝悌，次谨信。\n 泛爱众，而亲仁。\n 有余力，则学文。\n 父母呼，应勿缓。\n 父母命，行勿懒。\n 父母教，须敬听。\n 父母责，须顺承。\n 冬则温，夏则凊。\n 晨则省，昏则定。\n 出必告，反必面。\n 居有常，业无变。\n 事虽小，勿擅为。\n 苟擅为，子道亏。\n 物虽小，勿私藏。\n 苟私藏，亲心伤。\n 亲所好，力为具。\n 亲所恶，谨为去。\n 身有伤，贻亲忧。\n 德有伤，贻亲羞。\n 亲爱我，孝何难。\n 亲憎我，孝方贤。\n 亲有过，谏使更。\n 怡吾色，柔吾声。\n 谏不入，悦复谏。\n 号泣随，挞无怨。\n 亲有疾，药先尝。\n 昼夜侍，不离床。\n 丧三年，常悲咽。\n 居处变，酒肉绝。\n 丧尽礼，祭尽诚。\n 事死者，如事生。\n 兄道友，弟道恭。\n 兄弟睦，孝在中。\n 财物轻，怨何生。\n 言语忍，忿自泯。\n 或饮食，或坐走。\n 长者先，幼者后。\n 长呼人，即代叫。\n 人不在，己即到。\n 称尊长，勿呼名。\n 对尊长，勿见能。\n 路遇长，疾趋揖。\n 长无言，退恭立。\n 骑下马，乘下车。\n 过犹待，百步余。\n 长者立，幼勿坐。\n 长者坐，命乃坐。\n 尊长前，声要低。\n 低不闻，却非宜。\n 进必趋，退必迟。\n 问起对，视勿移。\n 事诸父，如事父。\n 事诸兄，如事兄。\n 朝起早，夜眠迟。\n 老易至，惜此时。\n 晨必盥，兼漱口。\n 便溺回，辄净手。\n 冠必正，纽必结。\n 袜与履，俱紧切。\n 置冠服，有定位。\n 勿乱顿，致污秽。\n 衣贵洁，不贵华。\n 上循分，下称家。\n 对饮食，勿拣择。\n 食适可，勿过则。\n 年方少，勿饮酒。\n 饮酒醉，最为丑。\n 步从容，立端正。\n 揖深圆，拜恭敬。\n 勿践阈，勿跛倚。\n 勿箕踞，勿摇髀。\n 缓揭帘，勿有声。\n 宽转弯，勿触棱。\n 执虚器，如执盈。\n 入虚室，如有人。\n 事勿忙，忙多错。\n 勿畏难，勿轻略。\n 斗闹场，绝勿近。\n 邪僻事，绝勿问。\n 将入门，问孰存。\n 将上堂，声必扬。\n 人问谁，对以名。\n 吾与我，不分明。\n 用人物，须明求。\n 倘不问，即为偷。\n 借人物，及时还。\n 后有急，借不难。\n 凡出言，信为先。\n 诈与妄，奚可焉。\n 话说多，不如少。\n 惟其是，勿佞巧。\n 奸巧语，秽污词。\n 市井气，切戒之。\n 见未真，勿轻言。\n 知未的，勿轻传。\n 事非宜，勿轻诺。\n 苟轻诺，进退错。\n 凡道字，重且舒。\n 勿急疾，勿模糊。\n 彼说长，此说短。\n 不关己，莫闲管。\n 见人善，即思齐。\n 纵去远，以渐跻。\n 见人恶，即内省。\n 有则改，无加警。\n 唯德学，唯才艺。\n 不如人，当自砺。\n 若衣服，若饮食。\n 不如人，勿生戚。\n 闻过怒，闻誉乐。\n 损友来，益友却。\n 闻誉恐，闻过欣。\n 直谅士，渐相亲。\n 无心非，名为错。\n 有心非，名为恶。\n 过能改，归于无。\n 倘掩饰，增一辜。\n 凡是人，皆须爱。\n 天同覆，地同载。\n 行高者，名自高。\n 人所重，非貌高。\n 才大者，望自大。\n 人所服，非言大。\n 己有能，勿自私。\n 人所能，勿轻訾。\n 勿谄富，勿骄贫。\n 勿厌故，勿喜新。\n 人不闲，勿事搅。\n 人不安，勿话扰。\n 人有短，切莫揭。\n 人有私，切莫说。\n 道人善，即是善。\n 人知之，愈思勉。\n 扬人恶，即是恶。\n 疾之甚，祸且作。\n 善相劝，德皆建。\n 过不规，道两亏。\n 凡取与，贵分晓。\n 与宜多，取宜少。\n 将加人，先问己。\n 己不欲，即速已。\n 恩欲报，怨欲忘。\n 报怨短，报恩长。\n 待婢仆，身贵端。\n 虽贵端，慈而宽。\n 势服人，心不然。\n 理服人，方无言。\n 同是人，类不齐。\n 流俗众，仁者希。\n 果仁者，人多畏。\n 言不讳，色不媚。\n 能亲仁，无限好。\n 德日进，过日少。\n 不亲仁，无限害。\n 小人进，百事坏。\n 不力行，但学文。\n 长浮华，成何人。\n 但力行，不学文。\n 任己见，昧理真。\n 读书法，有三到。\n 心眼口，信皆要。\n 方读此，勿慕彼。\n 此未终，彼勿起。\n 宽为限，紧用功。\n 工夫到，滞塞通。\n 心有疑，随札记。\n 就人问，求确义。\n 房室清，墙壁净。\n 几案洁，笔砚正。\n 墨磨偏，心不端。\n 字不敬，心先病。\n 列典籍，有定处。\n 读看毕，还原处。\n 虽有急，卷束齐。\n 有缺坏，就补之。\n 非圣书，屏勿视。\n 蔽聪明，坏心志。\n 勿自暴，勿自弃。\n 圣与贤，可驯致。\n ",
  千字文:
    "天地玄黄，宇宙洪荒。日月盈昃，辰宿列张。\n寒来暑往，秋收冬藏。闰余成岁，律吕调阳。",
};

delete GUOXUE_ITEMS["弟子规"];
delete GUOXUE_ITEMS["千字文"];

function openPoetry() {
  openModal("ov-poetry");
  loadPoetryData();
}

async function loadPoetryData() {
  renderPoetryTabs();
  document.getElementById("poetry-detail").innerHTML = "";
  document.getElementById("poetry-ai").innerHTML = "";
  if (poetryData.length) {
    applyPoetryFilter();
    return;
  }
  document.getElementById("poetry-list").innerHTML =
    '<div class="story-empty">正在加载诗词库...</div>';
  try {
    var res = await fetch(POETRY_DATA_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    poetryData = await res.json();
    var songRes = await fetch(SONG_POETRY_DATA_URL);
    if (songRes.ok) {
      poetryData = mergePoetryData(
        poetryData,
        normalizeSongPoems(await songRes.json())
      );
    }
    applyPoetryFilter();
  } catch (e) {
    document.getElementById("poetry-list").innerHTML =
      '<div class="story-empty">诗词数据加载失败，请稍后再试</div>';
  }
}

function mergePoetryData(baseList, extraList) {
  var seen = {};
  return (baseList || []).concat(extraList || []).filter(function (item) {
    var key = [item.title || "", item.author || ""].join("|");
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function normalizeSongPoems(list) {
  if (!Array.isArray(list)) return [];
  return list.map(function (item, index) {
    var lines = getSongPoemLines(item);
    return {
      id: "song-" + index,
      title: item.title || "",
      author: item.author || "",
      type: ["song"],
      content: lines,
      pinyin: lines.map(getPoetryLinePinyinParts),
      paraphrase: item.translation || item.background || "",
      annotation: item.annotation || "",
      appreciation: item.appreciation || "",
    };
  });
}

function getSongPoemLines(item) {
  return String(item.content || "")
    .split(/\n+/)
    .map(function (line) {
      return line.trim();
    })
    .filter(function (line) {
      return (
        line &&
        line !== item.title &&
        line.indexOf("作者：") !== 0 &&
        line.indexOf("作者:") !== 0
      );
    })
    .reduce(function (lines, line) {
      return lines.concat(splitSongLineByTwoSentences(line));
    }, []);
}

function splitSongLineByTwoSentences(line) {
  var sentences = String(line || "").match(/[^。！？?!]+[。！？?!]?/g) || [];
  if (sentences.length <= 2) return [line];
  var result = [];
  for (var i = 0; i < sentences.length; i += 2) {
    result.push(sentences.slice(i, i + 2).join(""));
  }
  return result;
}

function getPoetryLinePinyinParts(line) {
  return String(line || "")
    .replace(/\s/g, "")
    .split("")
    .map(function (char) {
      if (!/[\u4e00-\u9fa5]/.test(char)) return "";
      if (window.pinyinPro && typeof window.pinyinPro.pinyin === "function") {
        return window.pinyinPro.pinyin(char, { toneType: "symbol" });
      }
      return "";
    });
}

function renderPoetryTabs() {
  var tabs = [
    { type: "all", label: "全部" },
    { type: "tang", label: "唐诗" },
    { type: "song", label: "宋词" },
  ];
  document.getElementById("poetry-tabs").innerHTML = tabs
    .map(function (tab) {
      return (
        '<button class="classic-tab' +
        (poetryType === tab.type ? " active" : "") +
        '" onclick="switchPoetryType(\'' +
        tab.type +
        "')\">" +
        tab.label +
        "</button>"
      );
    })
    .join("");
}

function switchPoetryType(type) {
  poetryType = type;
  poetryPage = 1;
  renderPoetryTabs();
  applyPoetryFilter();
}

function searchPoetryList(keyword) {
  poetryKeyword = String(keyword || "").trim();
  poetryPage = 1;
  applyPoetryFilter();
}

function poemHasType(poem, type) {
  if (type === "all") return true;
  var raw = Array.isArray(poem.type)
    ? poem.type.join(",")
    : String(poem.type || "");
  return raw.indexOf(type) !== -1;
}

function poemMatchesKeyword(poem) {
  if (!poetryKeyword) return true;
  return (
    String(poem.title || "").indexOf(poetryKeyword) !== -1 ||
    String(poem.author || "").indexOf(poetryKeyword) !== -1 ||
    (poem.content || []).join("").indexOf(poetryKeyword) !== -1
  );
}

function applyPoetryFilter() {
  filteredPoetry = poetryData.filter(function (poem) {
    return poemHasType(poem, poetryType) && poemMatchesKeyword(poem);
  });
  renderPoetryList();
  renderPoetryPagination();
}

function renderPoetryList() {
  var start = (poetryPage - 1) * poetryPageSize;
  var pagePoems = filteredPoetry.slice(start, start + poetryPageSize);
  document.getElementById("poetry-detail").innerHTML = "";
  document.getElementById("poetry-ai").innerHTML = "";
  if (!pagePoems.length) {
    document.getElementById("poetry-list").innerHTML =
      '<div class="story-empty">没有找到相关诗词</div>';
    return;
  }
  document.getElementById("poetry-list").innerHTML = pagePoems
    .map(function (item) {
      var content = (item.content || []).join("").slice(0, 42);
      return (
        '<button class="classic-card poetry-card" data-poem-id="' +
        escapeHtml(String(item.id)) +
        '" onclick="showPoetryDetailByButton(this)">' +
        '<div class="classic-card-title">' +
        escapeHtml(item.title) +
        "</div>" +
        '<div class="classic-card-meta">' +
        escapeHtml(item.author) +
        "</div>" +
        '<div class="classic-card-text">' +
        escapeHtml(content) +
        "</div>" +
        "</button>"
      );
    })
    .join("");
}

function renderPoetryPagination() {
  var totalPages = Math.ceil(filteredPoetry.length / poetryPageSize);
  var el = document.getElementById("poetry-pagination");
  if (totalPages <= 1) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML =
    '<button class="btn-ghost" ' +
    (poetryPage <= 1 ? "disabled" : "") +
    ' onclick="changePoetryPage(-1)">上一页</button>' +
    "<span>第 " +
    poetryPage +
    " / " +
    totalPages +
    " 页，共 " +
    filteredPoetry.length +
    " 首</span>" +
    '<button class="btn-ghost" ' +
    (poetryPage >= totalPages ? "disabled" : "") +
    ' onclick="changePoetryPage(1)">下一页</button>';
}

function changePoetryPage(delta) {
  var totalPages = Math.max(
    1,
    Math.ceil(filteredPoetry.length / poetryPageSize)
  );
  poetryPage = Math.min(totalPages, Math.max(1, poetryPage + delta));
  renderPoetryList();
  renderPoetryPagination();
}

function renderPoetryLine(line, pinyin) {
  var chars = String(line || "")
    .replace(/\s/g, "")
    .split("");
  var pinyinParts = Array.isArray(pinyin)
    ? pinyin
    : String(pinyin || "")
      .trim()
      .split(/\s+/);
  return (
    '<div class="poetry-line">' +
    '<div class="poetry-char-line">' +
    chars
      .map(function (char, index) {
        return (
          '<span class="poetry-char-cell">' +
          '<span class="poetry-pinyin-line">' +
          escapeHtml(pinyinParts[index] || "") +
          "</span>" +
          '<span class="poetry-tianzigrid"><span>' +
          escapeHtml(char) +
          "</span></span>" +
          "</span>"
        );
      })
      .join("") +
    "</div>" +
    "</div>"
  );
}

function showPoetryDetailByButton(btn) {
  showPoetryDetail(btn.dataset.poemId);
}

function showPoetryDetail(poemId) {
  var poem = poetryData.find(function (item) {
    return String(item.id) === String(poemId);
  });
  if (!poem) return;
  var lines = poem.content || [];
  var pinyin = poem.pinyin || [];
  document.getElementById("poetry-list").innerHTML = "";
  document.getElementById("poetry-pagination").innerHTML = "";
  document.getElementById("poetry-ai").innerHTML = "";
  document.getElementById("poetry-detail").innerHTML =
    '<div class="poetry-detail-card">' +
    '<button class="btn-ghost" onclick="applyPoetryFilter()">返回列表</button>' +
    '<div class="poetry-detail-title">' +
    escapeHtml(poem.title || "") +
    "</div>" +
    '<div class="poetry-detail-meta">' +
    escapeHtml(poem.author || "") +
    "</div>" +
    '<button class="btn-primary poetry-read-btn" data-poem-id="' +
    escapeHtml(String(poem.id)) +
    '" onclick="playPoetryTextByButton(this)">朗读诗词 🔊</button>' +
    '<div class="poetry-lines">' +
    lines
      .map(function (line, index) {
        return renderPoetryLine(line, pinyin[index]);
      })
      .join("") +
    "</div>" +
    '<div class="poetry-explain"><strong>诗词小解释</strong><p>' +
    escapeHtml(poem.paraphrase || "") +
    "</p></div>" +
    '<div class="poetry-explain"><strong>诗词小注解</strong><p>' +
    escapeHtml(poem.annotation || "暂无注解") +
    "</p></div>" +
    '<button class="btn-primary" data-poem-id="' +
    escapeHtml(String(poem.id)) +
    '" onclick="analyzePoetryById(this.dataset.poemId)">AI 讲解</button>' +
    "</div>";
}

function getPoetryReadText(poem) {
  return [poem.title || "", poem.author || "", (poem.content || []).join("。")]
    .filter(Boolean)
    .join("。");
}

function playPoetryText(poemId, btn) {
  var poem = poetryData.find(function (item) {
    return String(item.id) === String(poemId);
  });
  if (!poem) return;
  var holder = document.getElementById("poetry-tts-text");
  if (!holder) {
    holder = document.createElement("span");
    holder.id = "poetry-tts-text";
    holder.style.display = "none";
    document.body.appendChild(holder);
  }
  holder.dataset.ttsText = getPoetryReadText(poem);
  holder.textContent = holder.dataset.ttsText;
  playAIText("poetry-tts-text", btn);
}

function playPoetryTextByButton(btn) {
  playPoetryText(btn.dataset.poemId, btn);
}

async function analyzePoetryById(poemId) {
  var item = poetryData.find(function (poem) {
    return String(poem.id) === String(poemId);
  });
  if (!item) return;
  document.getElementById("poetry-ai").innerHTML = aiCard("poetry-stream");
  var out = document.getElementById("poetry-stream");
  var text = "";
  await callAIStream(
    "请给1-6年级小朋友讲解古诗《" +
    item.title +
    "》：" +
    (item.content || []).join("") +
    "。要求：①诗意 ②重点字词 ③画面感 ④背诵小技巧，每点单独换行，控制在200字以内。",
    null,
    function (chunk) {
      text += chunk;
      setAIText(out, text);
    }
  );
}

function openGuoxue() {
  renderGuoxueTabs("三字经");
  openModal("ov-guoxue");
}

function padGuoxuePage(n) {
  return n < 10 ? "0" + n : String(n);
}

function getGuoxueImageSrc(item, page) {
  if (item.pages) return item.pages[page - 1] || "";
  return item.prefix + padGuoxuePage(page) + item.suffix;
}

function guoxuePageArrow(label, side, active, page, disabled) {
  return (
    '<button class="guoxue-page-arrow guoxue-page-arrow-' +
    side +
    '" aria-label="' +
    label +
    '" onclick="changeGuoxuePage(\'' +
    active +
    "', " +
    page +
    ')" ' +
    (disabled ? "disabled" : "") +
    ">" +
    (side === "left" ? "&#8249;" : "&#8250;") +
    "</button>"
  );
}

function isGuoxueSinglePage() {
  return window.matchMedia("(max-width: 720px)").matches;
}

function guoxuePageImage(active, item, page) {
  var src = getGuoxueImageSrc(item, page);
  return (
    '<div class="guoxue-page-item"><img class="guoxue-page-img" src="' +
    escapeHtml(src) +
    '" alt="' +
    escapeHtml((item.alt || active) + " 第" + page + "页") +
    "\" onerror=\"this.style.display='none';this.nextElementSibling.style.display='block'\" />" +
    '<div class="story-empty guoxue-page-error">图片没有找到：' +
    escapeHtml(src) +
    "</div></div>"
  );
}

function renderGuoxueImagePages(active, item) {
  var pageCount = item.pages ? item.pages.length : item.pageCount;
  var current = guoxueImagePages[active] || 1;
  var pageStep = isGuoxueSinglePage() ? 1 : 2;
  current = Math.max(1, Math.min(pageCount, current));
  if (pageStep === 2 && current % 2 === 0) current--;
  guoxueImagePages[active] = current;
  var lastPage = pageStep === 1 ? pageCount : pageCount - ((pageCount + 1) % 2);
  var pageLabel =
    pageStep === 2 && current < pageCount
      ? current + "-" + (current + 1)
      : String(current);
  var images = guoxuePageImage(active, item, current);
  if (pageStep === 2 && current < pageCount) {
    images += guoxuePageImage(active, item, current + 1);
  }
  document.getElementById("guoxue-body").innerHTML =
    '<div class="guoxue-page-viewer">' +
    guoxuePageArrow(
      "上一页",
      "left",
      active,
      current - pageStep,
      current === 1
    ) +
    '<div class="guoxue-page-spread">' +
    images +
    "</div>" +
    guoxuePageArrow(
      "下一页",
      "right",
      active,
      current + pageStep,
      current === lastPage
    ) +
    "</div>" +
    '<div class="guoxue-page-number">' +
    pageLabel +
    " / " +
    pageCount +
    "</div>";
}

function changeGuoxuePage(active, page) {
  var item = GUOXUE_ITEMS[active];
  if (!item || item.type !== "image-pages") return;
  var pageCount = item.pages ? item.pages.length : item.pageCount;
  guoxueImagePages[active] = Math.max(1, Math.min(pageCount, page));
  renderGuoxueTabs(active);
}

function handleGuoxueKeydown(e) {
  if (!document.getElementById("ov-guoxue").classList.contains("open")) return;
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  e.preventDefault();
  var pageStep = isGuoxueSinglePage() ? 1 : 2;
  var current = guoxueImagePages["三字经"] || 1;
  var item = GUOXUE_ITEMS["三字经"];
  var pageCount = item.pages ? item.pages.length : item.pageCount;
  var lastPage = pageStep === 1 ? pageCount : pageCount - ((pageCount + 1) % 2);
  var next = current + (e.key === "ArrowLeft" ? -pageStep : pageStep);
  changeGuoxuePage("三字经", Math.max(1, Math.min(lastPage, next)));
}

function renderGuoxueTabs(active) {
  var item = GUOXUE_ITEMS[active];
  var body = document.getElementById("guoxue-body");
  if (item && item.type === "image-pages") {
    renderGuoxueImagePages(active, item);
    return;
  }
  if (item && item.type === "image") {
    body.innerHTML =
      '<img class="guoxue-page-img" src="' +
      escapeHtml(item.src) +
      '" alt="' +
      escapeHtml(item.alt || active) +
      '" />';
    return;
  }
  body.textContent = item || "";
}

var COURSEWARE_PDFS = {
  一年级上: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/语文一年级上册.pdf",
  一年级下: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 一年级 下册.pdf",
  二年级上: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 二年级 上册.pdf",
  二年级下: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 二年级 下册.pdf",
  三年级上: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 三年级 上册.pdf",
  三年级下: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 三年级 下册.pdf",
  四年级上: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 四年级 上册.pdf",
  四年级下: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 四年级 下册.pdf",
  五年级上: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 五年级 上册.pdf",
  五年级下: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 五年级 下册.pdf",
  六年级上: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 六年级 上册.pdf",
  六年级下: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 六年级 下册.pdf",
  七年级上: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 七年级 上册.pdf",
  七年级下: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 七年级 下册.pdf",
  八年级上: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 八年级 上册.pdf",
  八年级下: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 八年级 下册.pdf",
  九年级上: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 九年级 上册.pdf",
  九年级下: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/file/义务教育教科书 语文 九年级 下册.pdf",
};
var COURSEWARE_STAGES = {
  小学: [
    "一年级上",
    "一年级下",
    "二年级上",
    "二年级下",
    "三年级上",
    "三年级下",
    "四年级上",
    "四年级下",
    "五年级上",
    "五年级下",
    "六年级上",
    "六年级下",
  ],
  初中: [
    "七年级上",
    "七年级下",
    "八年级上",
    "八年级下",
    "九年级上",
    "九年级下",
  ],
};
var currentCoursewareStage = "小学";
var coursewarePdfLibPromise = null;
var coursewarePdfDoc = null;
var coursewareRenderTasks = [];
var coursewarePage = 1;
var coursewareResizeTimer = null;

function openCourseware() {
  closeCoursewarePdf();
  currentCoursewareStage = "小学";
  renderCoursewareList();
  openModal("ov-courseware");
}

function renderCoursewareList() {
  document.getElementById("courseware-stage-tabs").innerHTML = Object.keys(
    COURSEWARE_STAGES
  )
    .map(function (stage) {
      return (
        '<button class="classic-tab' +
        (stage === currentCoursewareStage ? " active" : "") +
        '" type="button" onclick="switchCoursewareStage(\'' +
        stage +
        "')\">" +
        stage +
        (stage === "小学" ? " 1—6年级" : " 7—9年级") +
        "</button>"
      );
    })
    .join("");
  document.getElementById("courseware-list").innerHTML = COURSEWARE_STAGES[
    currentCoursewareStage
  ]
    .map(function (name) {
      var available = Boolean(COURSEWARE_PDFS[name]);
      return (
        '<button class="classic-card" ' +
        (available
          ? "onclick=\"openCoursewarePdf('" + name + "')\""
          : "disabled") +
        ">" +
        '<div class="classic-card-title">' +
        name +
        "</div>" +
        '<div class="classic-card-meta">' +
        (available ? "点击阅读电子课本" : "教材待补充") +
        "</div></button>"
      );
    })
    .join("");
}

function switchCoursewareStage(stage) {
  if (!COURSEWARE_STAGES[stage]) return;
  currentCoursewareStage = stage;
  renderCoursewareList();
}

async function openCoursewarePdf(name) {
  var path = COURSEWARE_PDFS[name];
  if (!path) return;
  document.getElementById("courseware-list-view").hidden = true;
  document.getElementById("courseware-reader").hidden = false;
  document.getElementById("courseware-pdf-title").textContent = name;
  document.getElementById("courseware-pdf-status").textContent =
    "正在加载电子课本…";
  document.getElementById("courseware-pdf-canvas").style.display = "none";
  document.getElementById("courseware-pdf-canvas-right").style.display = "none";
  coursewarePage = 1;
  updateCoursewareControls();
  try {
    if (!coursewarePdfLibPromise) {
      coursewarePdfLibPromise = import("https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/pdfjs/pdf.min.mjs").then(function (
        pdfjsLib
      ) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/pdfjs/pdf.worker.min.mjs";
        return pdfjsLib;
      });
    }
    var pdfjsLib = await coursewarePdfLibPromise;
    if (coursewarePdfDoc) await coursewarePdfDoc.destroy();
    var pdfUrl = new URL(path, window.location.href).href;
    coursewarePdfDoc = await pdfjsLib.getDocument({
      url: pdfUrl,
      cMapUrl: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/pdfjs/cmaps/",
      cMapPacked: true,
    }).promise;
    await renderCoursewarePage();
  } catch (err) {
    console.error("PDF加载失败:", err);
    document.getElementById("courseware-pdf-status").textContent =
      "电子课本加载失败，请检查PDF文件是否已部署。";
  }
}

async function renderCoursewarePage() {
  if (!coursewarePdfDoc) return;
  coursewareRenderTasks.forEach(function (task) {
    task.cancel();
  });
  coursewareRenderTasks = [];
  var wrap = document.getElementById("courseware-canvas-wrap");
  var isSingle = window.matchMedia("(max-width: 720px)").matches;
  if (!isSingle && coursewarePage % 2 === 0) coursewarePage -= 1;
  var pages = [coursewarePage];
  if (!isSingle && coursewarePage + 1 <= coursewarePdfDoc.numPages) {
    pages.push(coursewarePage + 1);
  }
  var canvases = [
    document.getElementById("courseware-pdf-canvas"),
    document.getElementById("courseware-pdf-canvas-right"),
  ];
  canvases[1].style.display = pages.length === 2 ? "block" : "none";
  document.getElementById("courseware-pdf-status").textContent =
    "正在绘制第 " + (pages.length === 2 ? pages.join("-") : pages[0]) + " 页…";
  try {
    await Promise.all(
      pages.map(function (pageNumber, index) {
        return renderCoursewareCanvas(
          pageNumber,
          canvases[index],
          pages.length
        );
      })
    );
    document.getElementById("courseware-pdf-status").textContent = "";
  } catch (err) {
    if (!err || err.name !== "RenderingCancelledException") throw err;
  }
  updateCoursewareControls();
  wrap.scrollTop = 0;
  wrap.scrollLeft = 0;
}

async function renderCoursewareCanvas(pageNumber, canvas, pageCount) {
  var page = await coursewarePdfDoc.getPage(pageNumber);
  var baseViewport = page.getViewport({ scale: 1 });
  var wrap = document.getElementById("courseware-canvas-wrap");
  var gap = pageCount === 2 ? 28 : 16;
  var availableWidth = Math.max(280, (wrap.clientWidth - gap) / pageCount);
  var availableHeight = Math.max(320, wrap.clientHeight - 16);
  var fitScale = Math.min(
    availableWidth / baseViewport.width,
    availableHeight / baseViewport.height
  );
  var viewport = page.getViewport({ scale: fitScale });
  var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  var context = canvas.getContext("2d");
  canvas.width = Math.floor(viewport.width * pixelRatio);
  canvas.height = Math.floor(viewport.height * pixelRatio);
  canvas.style.width = Math.floor(viewport.width) + "px";
  canvas.style.height = Math.floor(viewport.height) + "px";
  canvas.style.display = "block";
  var renderTask = page.render({
    canvasContext: context,
    viewport: viewport,
    transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0],
  });
  coursewareRenderTasks.push(renderTask);
  return renderTask.promise;
}

function changeCoursewarePage(step) {
  if (!coursewarePdfDoc) return;
  var pageStep = window.matchMedia("(max-width: 720px)").matches ? 1 : 2;
  var next = Math.max(
    1,
    Math.min(coursewarePdfDoc.numPages, coursewarePage + step * pageStep)
  );
  if (next === coursewarePage) return;
  coursewarePage = next;
  renderCoursewarePage();
}

function updateCoursewareControls() {
  var isSingle = window.matchMedia("(max-width: 720px)").matches;
  var pageLabel = String(coursewarePage);
  if (
    !isSingle &&
    coursewarePdfDoc &&
    coursewarePage < coursewarePdfDoc.numPages
  ) {
    pageLabel += "-" + (coursewarePage + 1);
  }
  document.getElementById("courseware-page-info").textContent =
    pageLabel + " / " + (coursewarePdfDoc ? coursewarePdfDoc.numPages : 0);
}

function closeCoursewarePdf() {
  coursewareRenderTasks.forEach(function (task) {
    task.cancel();
  });
  coursewareRenderTasks = [];
  if (coursewarePdfDoc) coursewarePdfDoc.destroy();
  coursewarePdfDoc = null;
  var list = document.getElementById("courseware-list-view");
  var reader = document.getElementById("courseware-reader");
  if (list) list.hidden = false;
  if (reader) reader.hidden = true;
}

function handleCoursewareKeydown(e) {
  var reader = document.getElementById("courseware-reader");
  if (
    !document.getElementById("ov-courseware").classList.contains("open") ||
    reader.hidden
  )
    return;
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  e.preventDefault();
  changeCoursewarePage(e.key === "ArrowLeft" ? -1 : 1);
}

function initCoursewareSwipe() {
  var wrap = document.getElementById("courseware-canvas-wrap");
  var startX = 0;
  wrap.addEventListener(
    "touchstart",
    function (e) {
      startX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  wrap.addEventListener(
    "touchend",
    function (e) {
      var distance = e.changedTouches[0].clientX - startX;
      if (Math.abs(distance) >= 60) changeCoursewarePage(distance > 0 ? -1 : 1);
    },
    { passive: true }
  );
}

function handleCoursewareResize() {
  if (!coursewarePdfDoc) return;
  clearTimeout(coursewareResizeTimer);
  coursewareResizeTimer = setTimeout(renderCoursewarePage, 150);
}

function openModernDict() {
  document.getElementById("modern-dict-input").value = "";
  document.getElementById("modern-dict-result").innerHTML = "";
  openModal("ov-modern-dict");
}

async function searchModernDict() {
  var word = document.getElementById("modern-dict-input").value.trim();
  if (!word) {
    toast("先输入要查询的字词");
    return;
  }
  document.getElementById("modern-dict-result").innerHTML =
    aiCard("modern-dict-stream");
  var out = document.getElementById("modern-dict-stream");
  var text = "";
  await callAIStream(
    "请按现代汉语词典风格解释“" +
    word +
    "”。请严格按以下格式回答，每项单独换行，不要使用①②③④⑤等数字编号：\n拼音：\n释义：\n组词或搭配：\n例句：\n近义词/反义词：\n没有的项目写“无”。内容适合小学生理解。",
    "你是严谨的现代汉语词典助手，解释要准确、简洁、适合小学生。",
    function (chunk) {
      text += chunk;
      setAIText(out, text);
    }
  );
}

var strokeCharIdx = 0,
  strokeStep = 0,
  currentStrokeGrade = "一年级",
  strokeWriter = null,
  strokeCharDataCache = {};

function openStroke() {
  strokeCharIdx = 0;
  strokeStep = 0;
  renderStrokeGradeTabs();
  renderStrokeTabs();
  renderStrokeUI();
  loadStrokeAI();
  openModal("ov-stroke");
}

function getStrokeDataPool() {
  var data = STROKE_DATA_GROUPS[currentStrokeGrade] || [];
  return data.length ? data : STROKE_DATA;
}

function getCurrentStrokeItem() {
  var data = getStrokeDataPool();
  return data[strokeCharIdx] || STROKE_DATA[0];
}

function renderStrokeGradeTabs() {
  var wrap = document.getElementById("stroke-grade-tabs");
  wrap.innerHTML = STROKE_GRADES.map(function (grade) {
    return (
      '<div class="tab' +
      (grade === currentStrokeGrade ? " active" : "") +
      '" onclick="switchStrokeGrade(\'' +
      grade +
      "')\">" +
      grade +
      "</div>"
    );
  }).join("");
}

function switchStrokeGrade(grade) {
  currentStrokeGrade = grade;
  strokeCharIdx = 0;
  strokeStep = 0;
  renderStrokeGradeTabs();
  renderStrokeTabs();
  renderStrokeUI();
  loadStrokeAI();
}

function renderStrokeTabs() {
  document.getElementById("stroke-char-tabs").innerHTML = getStrokeDataPool()
    .map(function (s, i) {
      return (
        '<div class="scene-tab' +
        (i === strokeCharIdx ? " active" : "") +
        '" onclick="switchStrokeChar(' +
        i +
        ')"><span class="tc" style="font-size:14px;">' +
        s.char +
        "</span></div>"
      );
    })
    .join("");
}

function switchStrokeChar(i) {
  strokeCharIdx = i;
  strokeStep = 0;
  renderStrokeTabs();
  renderStrokeUI();
  loadStrokeAI();
}

function renderStrokeUI() {
  var d = getCurrentStrokeItem();
  strokeWriter = null;
  updateStrokeProgress(d);
  showStrokePreview(strokeStep);
}

function createStrokeWriter(d) {
  var el = document.getElementById("stroke-char-show");
  strokeWriter = null;
  el.innerHTML = "";
  if (!window.HanziWriter) {
    el.textContent = "笔顺库加载中";
    document.getElementById("stroke-tooltip").textContent =
      "Hanzi Writer 未加载成功，请检查网络后重试";
    return;
  }
  strokeWriter = HanziWriter.create("stroke-char-show", d.char, {
    width: 180,
    height: 180,
    padding: 8,
    showOutline: true,
    showCharacter: false,
    strokeAnimationSpeed: 1,
    delayBetweenStrokes: 300,
    drawingWidth: 26,
    radicalColor: "#667eea",
    outlineColor: "#dbe3f0",
    strokeColor: "#667eea",
    highlightColor: "#f59e0b",
  });
}

function updateStrokeProgress(d) {
  document.getElementById("stroke-pinyin").innerHTML =
    d.char + "<span>" + d.pinyin + "</span>";
  document.getElementById("stroke-count-label").textContent =
    "第 " + strokeStep + " / " + d.count + " 笔";
  document.getElementById("stroke-tooltip").textContent =
    strokeStep > 0 && strokeStep <= d.strokes.length
      ? "第" + strokeStep + "笔：" + d.strokes[strokeStep - 1]
      : d.tip;
  document.getElementById("stroke-steps-row").innerHTML = d.strokes
    .map(function (s, i) {
      var done = i < strokeStep;
      var current = strokeStep === i + 1;
      return (
        '<div class="stroke-step' +
        (done ? " done" : "") +
        (current ? " current" : "") +
        '" onclick="strokeJumpTo(' +
        (i + 1) +
        ')">' +
        (i + 1) +
        "</div>"
      );
    })
    .join("");
}

function escapeSvgAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

function renderStrokePreviewSvg(charData, step) {
  var paths = (charData.strokes || [])
    .map(function (path, i) {
      var fill = "#dbe3f0";
      if (step && i < step - 1) fill = "#667eea";
      if (step && i === step - 1) fill = "#f59e0b";
      return '<path d="' + escapeSvgAttr(path) + '" fill="' + fill + '" />';
    })
    .join("");
  return (
    '<svg class="stroke-preview-svg" viewBox="0 0 1024 1024" aria-label="笔画预览">' +
    '<g transform="translate(0, 900) scale(1, -1)">' +
    paths +
    "</g></svg>"
  );
}

function applyStrokeCharacterData(d, charData) {
  var count = (charData.strokes || []).length;
  if (!d.count && count) d.count = count;
  if (!d.strokes.length && count) {
    d.strokes = Array.from({ length: count }, function (_, i) {
      return "第" + (i + 1) + "笔";
    });
  }
  strokeStep = Math.max(0, Math.min(strokeStep, d.count));
}

function showStrokePreview(step) {
  var d = getCurrentStrokeItem();
  var el = document.getElementById("stroke-char-show");
  var char = d.char;
  strokeStep = Math.max(0, Math.min(step, d.count));
  strokeWriter = null;
  updateStrokeProgress(d);

  if (!window.HanziWriter || !HanziWriter.loadCharacterData) {
    el.textContent = char;
    document.getElementById("stroke-tooltip").textContent =
      "笔画数据加载失败，请检查 Hanzi Writer 是否加载成功";
    return;
  }

  if (strokeCharDataCache[char]) {
    applyStrokeCharacterData(d, strokeCharDataCache[char]);
    updateStrokeProgress(d);
    el.innerHTML = renderStrokePreviewSvg(
      strokeCharDataCache[char],
      strokeStep
    );
    return;
  }

  el.textContent = "加载中";
  HanziWriter.loadCharacterData(char)
    .then(function (charData) {
      if (getCurrentStrokeItem().char !== char) return;
      strokeCharDataCache[char] = charData;
      applyStrokeCharacterData(d, charData);
      updateStrokeProgress(d);
      el.innerHTML = renderStrokePreviewSvg(charData, strokeStep);
    })
    .catch(function () {
      if (getCurrentStrokeItem().char !== char) return;
      el.textContent = char;
      document.getElementById("stroke-tooltip").textContent =
        "笔画数据加载失败，请检查网络后重试";
    });
}

function startStrokeQuiz() {
  var d = getCurrentStrokeItem();
  createStrokeWriter(d);
  if (!strokeWriter) return;
  strokeStep = 0;
  updateStrokeProgress(d);
  strokeWriter.quiz({
    onCorrectStroke: function () {
      strokeStep++;
      updateStrokeProgress(d);
      playSfx("correct");
    },
    onMistake: function () {
      playSfx("wrong");
    },
    onComplete: function () {
      strokeStep = d.count;
      updateStrokeProgress(d);
      showWin("✅", "描红完成！", "继续学习下一个字吧！", advanceStrokeChar);
      markLearned(d.char);
      addStar(2);
    },
  });
}

function restartStrokeQuiz() {
  var d = getCurrentStrokeItem();
  strokeStep = 0;
  createStrokeWriter(d);
  updateStrokeProgress(d);
  startStrokeQuiz();
}

function showStrokeAnimation() {
  var d = getCurrentStrokeItem();
  strokeStep = 0;
  createStrokeWriter(d);
  updateStrokeProgress(d);
  if (!strokeWriter) return;
  strokeWriter.animateCharacter({
    onComplete: function () {
      strokeStep = d.count;
      updateStrokeProgress(d);
      markLearned(d.char);
      addStar(2);
    },
  });
}

function strokeJumpTo(n) {
  showStrokePreview(n);
}

function advanceStrokeChar() {
  var data = getStrokeDataPool();
  strokeCharIdx = (strokeCharIdx + 1) % data.length;
  strokeStep = 0;
  renderStrokeTabs();
  renderStrokeUI();
  loadStrokeAI();
}

function nextStroke() {
  startStrokeQuiz();
}

function prevStroke() {
  restartStrokeQuiz();
}

function autoPlayStroke() {
  showStrokeAnimation();
}

async function loadStrokeAI() {
  var d = getCurrentStrokeItem();
  if (!d.count && window.HanziWriter && HanziWriter.loadCharacterData) {
    try {
      var charData =
        strokeCharDataCache[d.char] ||
        (await HanziWriter.loadCharacterData(d.char));
      strokeCharDataCache[d.char] = charData;
      applyStrokeCharacterData(d, charData);
      updateStrokeProgress(d);
    } catch (e) { }
  }
  document.getElementById("stroke-ai").innerHTML = aiCard("stroke-stream");
  document.getElementById("stroke-stream").innerHTML = "";
  var full = "";
  await callAIStream(
    "介绍汉字「" +
    d.char +
    "」(" +
    d.pinyin +
    ") 的笔顺：共" +
    d.count +
    "笔，依次是：" +
    d.strokes.join("、") +
    "。字形含义：" +
    d.tip +
    "。请用可爱的语言教小学生记忆这个字和笔顺，加emoji，100字以内。",
    null,
    function (chunk) {
      full += chunk;
      setAIText(document.getElementById("stroke-stream"), full);
    }
  );
}

initDailyChar();
applyTheme();
