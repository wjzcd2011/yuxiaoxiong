// 颜色处理工具函数
import { formatList } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/constants.js";

// 获取拼音首字母的辅助函数
function toPinyinSlug(chineseName) {
  if (!chineseName) return "color";

  // 使用 pinyin-pro 库
  if (typeof window !== "undefined" && window.pinyinPro) {
    try {
      const pinyinArr = window.pinyinPro.pinyin(chineseName, {
        toneType: "none",
        type: "array",
      });
      return pinyinArr.map((p) => p.charAt(0).toLowerCase()).join("");
    } catch (e) {
      console.warn("拼音转换失败", e);
    }
  }

  // 降级方案：简单映射
  const pinyinMap = {
    红: "hong",
    粉: "fen",
    蓝: "lan",
    绿: "lv",
    黄: "huang",
    紫: "zi",
    黑: "hei",
    白: "bai",
    灰: "hui",
    橙: "cheng",
    青: "qing",
    棕: "zong",
    褐: "he",
    金: "jin",
    银: "yin",
    深: "shen",
    浅: "qian",
    暗: "an",
    亮: "liang",
    淡: "dan",
    浓: "nong",
    标准: "bz",
    复古: "fg",
    莫兰迪: "mld",
    马卡龙: "mkl",
    薄雾: "bw",
    云雾: "yw",
    冰川: "bc",
    水: "shui",
    玉: "yu",
    石: "shi",
    墨: "mo",
    鼠: "shu",
    茶: "cha",
    杏: "xing",
    桃: "tao",
    樱: "ying",
    玫: "mei",
    豆: "dou",
    藕: "ou",
    香: "xiang",
    奶: "nai",
    蜜: "mi",
    柚: "you",
    柠: "ning",
    草: "cao",
    竹: "zhu",
    松: "song",
    柳: "liu",
    荷: "he",
    苔: "tai",
    藤: "teng",
    萝: "luo",
    薇: "wei",
    槿: "jin",
    莲: "lian",
    翡翠: "fc",
    薄荷: "bh",
    草莓: "cm",
    西瓜: "xg",
    蜜桃: "mt",
    樱桃: "yt",
    番茄: "fq",
    爱丽丝: "als",
    巴黎: "bl",
    北京: "bj",
  };

  let result = "";
  for (let i = 0; i < chineseName.length; ) {
    let matched = false;
    for (let len = Math.min(3, chineseName.length - i); len >= 1; len--) {
      const word = chineseName.substr(i, len);
      if (pinyinMap[word]) {
        result += pinyinMap[word];
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const char = chineseName[i];
      result += pinyinMap[char] || char;
      i++;
    }
  }
  return result || "color";
}

export function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hexToHsl(hex) {
  let { r, g, b } = hexToRgb(hex);
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb(hue, s, l) {
  hue %= 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;
  if (hue < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (hue < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (hue < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (hue < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (hue < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function hslToHex(hue, s, l) {
  const { r, g, b } = hslToRgb(hue, s, l);
  return rgbToHex(r, g, b);
}

export function interpolateColor(startHex, endHex, ratio) {
  const s = hexToRgb(startHex);
  const e = hexToRgb(endHex);
  const r = Math.round(s.r + (e.r - s.r) * ratio);
  const g = Math.round(s.g + (e.g - s.g) * ratio);
  const b = Math.round(s.b + (e.b - s.b) * ratio);
  return rgbToHex(r, g, b);
}

export function getRelativeLuminance(r, g, b) {
  [r, g, b] = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function calcContrastRatio(hex1, hex2) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const l1 = getRelativeLuminance(c1.r, c1.g, c1.b);
  const l2 = getRelativeLuminance(c2.r, c2.g, c2.b);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

export function getWcagLevel(ratio) {
  return { aa: ratio >= 4.5, aaa: ratio >= 7 };
}

export function generateTintShade(baseHex) {
  const baseHsl = hexToHsl(baseHex);
  const result = {};
  result[50] = hslToHex(baseHsl.h, baseHsl.s, 96);
  result[100] = hslToHex(baseHsl.h, baseHsl.s, 90);
  result[200] = hslToHex(baseHsl.h, baseHsl.s, 80);
  result[300] = hslToHex(baseHsl.h, baseHsl.s, 70);
  result[400] = hslToHex(baseHsl.h, baseHsl.s, 60);
  result[500] = baseHex;
  result[600] = hslToHex(baseHsl.h, baseHsl.s, 48);
  result[700] = hslToHex(baseHsl.h, baseHsl.s, 36);
  result[800] = hslToHex(baseHsl.h, baseHsl.s, 24);
  result[900] = hslToHex(baseHsl.h, baseHsl.s, 16);
  result[950] = hslToHex(baseHsl.h, baseHsl.s, 8);
  return result;
}

export function colorDifference(h1, h2) {
  const r1 = hexToRgb(h1),
    r2 = hexToRgb(h2);
  return Math.hypot(r1.r - r2.r, r1.g - r2.g, r1.b - r2.b);
}

export function getBrightness(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 / 2.55;
}

export function initFormatFunctions() {
  formatList.forEach((item) => {
    if (item.key === "hex") item.fn = (h) => h.toUpperCase();
    else if (item.key === "rgb")
      item.fn = (h) => {
        const { r, g, b } = hexToRgb(h);
        return `rgb(${r}, ${g}, ${b})`;
      };
    else if (item.key === "rgba")
      item.fn = (h) => {
        const { r, g, b } = hexToRgb(h);
        return `rgba(${r}, ${g}, ${b}, 1)`;
      };
    else if (item.key === "hsl")
      item.fn = (h) => {
        const { h: hue, s, l } = hexToHsl(h);
        return `hsl(${Math.round(hue)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
      };
    else if (item.key === "hsla")
      item.fn = (h) => {
        const { h: hue, s, l } = hexToHsl(h);
        return `hsla(${Math.round(hue)}, ${Math.round(s)}%, ${Math.round(
          l
        )}%, 1)`;
      };
    else if (item.key === "css") {
      item.fn = (h, colorName = "") => {
        const namePart = colorName ? toPinyinSlug(colorName) : h.slice(1);
        return `--color-${namePart}: ${h};`;
      };
    } else if (item.key === "tw") {
      item.fn = (h, colorName = "") => {
        const namePart = colorName ? toPinyinSlug(colorName) : h.slice(1);
        return `'${namePart}': '${h}',`;
      };
    }
  });
}

export function formatColorByType(hex, currentFormat, colorName = "") {
  const item = formatList.find((f) => f.key === currentFormat) || formatList[0];
  if (item.key === "css" || item.key === "tw") {
    return item.fn(hex, colorName);
  }
  return item.fn(hex);
}
export { toPinyinSlug };
