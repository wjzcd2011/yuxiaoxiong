// 颜色名称数据
import { BUILTIN_COLOR_NAMES } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/pswang/constants.js";
import { colorDifference } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/pswang/colorUtils.js";

let colorNames = { ...BUILTIN_COLOR_NAMES };

export function getColorName(hex) {
  hex = hex.toLowerCase();
  if (colorNames[hex]) return { n: colorNames[hex] };
  let minDiff = Infinity,
    closestName = "";
  for (const [k, n] of Object.entries(colorNames)) {
    const d = colorDifference(hex, k);
    if (d < minDiff) {
      minDiff = d;
      closestName = n;
    }
  }
  return minDiff < 25 ? { n: closestName } : { n: "" };
}

export async function loadColorNames() {
  try {
    const resp = await fetch(
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/pswang/colorName.json"
    );
    if (resp.ok) {
      colorNames = await resp.json();
      console.log(
        `✅ 颜色名称数据加载成功，共 ${Object.keys(colorNames).length} 条记录`
      );
    } else {
      console.warn("⚠️ colorNames.json 加载失败，使用内置后备数据");
    }
  } catch (err) {
    console.warn(
      "⚠️ 无法加载 colorNames.json，使用内置后备数据。",
      err.message
    );
  }
}

export function setColorNames(names) {
  colorNames = names;
}
