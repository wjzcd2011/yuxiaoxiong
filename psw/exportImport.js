// 导出/导入功能
import { showToast } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/psw/domUtils.js";
import {
  getGroups,
  setGroups,
  getNextGroupId,
  setNextGroupId,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/psw/groups.js";
import {
  getColors,
  setColors,
  getNextColorId,
  setNextColorId,
  setActiveGroupId,
  addColor,
  getActiveGroupId,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/psw/colors.js";
import { shadeLevels } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/psw/constants.js";
import { getColorName } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/psw/colorNames.js";
import { toPinyinSlug } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/psw/colorUtils.js";

let pendingImportData = null;
let importMode = "merge";

export function exportData() {
  const groups = getGroups();
  const colors = getColors();
  const data = { groups, colors };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "配色方案_导出.json";
  a.click();
  URL.revokeObjectURL(url);
  showToast("导出成功");
}

export function showImportModeModal(data) {
  pendingImportData = data;
  importMode = "merge";
  const modal = document.getElementById("importModeModal");
  if (modal) {
    document.getElementById("importMergeBtn")?.classList.add("active");
    document.getElementById("importReplaceBtn")?.classList.remove("active");
    modal.style.display = "flex";
  }
}

export function setImportMode(mode) {
  importMode = mode;
}

export function getImportMode() {
  return importMode;
}

export function getPendingImportData() {
  return pendingImportData;
}

export function clearPendingImportData() {
  pendingImportData = null;
}

export function executeImport(onComplete) {
  if (!pendingImportData) return false;
  const d = pendingImportData;
  const groups = getGroups();
  const colors = getColors();
  let nextColorId = getNextColorId();
  let nextGroupId = getNextGroupId();

  if (importMode === "replace") {
    setGroups(d.groups);
    setColors(d.colors);
    const maxColorId = Math.max(
      ...d.colors.map((c) => parseInt(c.id.replace("c", "")) || 0),
      5
    );
    setNextColorId(maxColorId + 1);
    const maxGroupId = Math.max(
      ...d.groups.map((g) => parseInt(g.id.replace("g", "")) || 0),
      2
    );
    setNextGroupId(maxGroupId + 1);
    setActiveGroupId(d.groups[0].id);
    showToast("覆盖导入成功");
  } else {
    // 合并：分组去重（按名称）
    const existingGroupNames = new Set(groups.map((g) => g.name));
    const groupIdMap = {};
    d.groups.forEach((g) => {
      const existing = groups.find((eg) => eg.name === g.name);
      if (existing) {
        groupIdMap[g.id] = existing.id;
      } else {
        const newId = "g" + nextGroupId++;
        groupIdMap[g.id] = newId;
        groups.push({ id: newId, name: g.name });
      }
    });
    setGroups(groups);
    setNextGroupId(nextGroupId);

    const existingHexInGroup = {};
    colors.forEach((c) => {
      const key = `${c.groupId}:${c.hex.toLowerCase()}`;
      existingHexInGroup[key] = true;
    });

    let addedCount = 0;
    const activeGroupId = getActiveGroupId();
    d.colors.forEach((c) => {
      const newGroupId = groupIdMap[c.groupId] || activeGroupId;
      const key = `${newGroupId}:${c.hex.toLowerCase()}`;
      if (!existingHexInGroup[key]) {
        addColor(
          c.name || getColorName(c.hex).n || `颜色-${c.hex.slice(1, 7)}`,
          c.hex,
          newGroupId,
          Date.now() + addedCount
        );
        existingHexInGroup[key] = true;
        addedCount++;
      }
    });
    showToast(`合并导入成功，新增 ${addedCount} 个色块`);
  }
  clearPendingImportData();
  if (onComplete) onComplete();
  return true;
}

// 生成色阶代码（已修改：使用拼音转换）
function generateShadeCode(colorName, map, fmt) {
  // 使用 toPinyinSlug 将中文转换为拼音
  const pinyinName = toPinyinSlug(colorName || "color");
  const safeName = pinyinName.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
  const finalName = safeName || "color";
  const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  if (fmt === "css") {
    return (
      `:root {\n` +
      levels
        .map((lv) => `  --color-${finalName}-${lv}: ${map[lv]};`)
        .join("\n") +
      "\n}"
    );
  } else if (fmt === "tailwind") {
    const entries = levels
      .map((lv, idx) => {
        const comma = idx === levels.length - 1 ? "" : ",";
        return `  ${lv}: '${map[lv]}'${comma}`;
      })
      .join("\n");
    return `'${finalName}': {\n${entries}\n},`;
  } else if (fmt === "scss") {
    return (
      `$${finalName}: (\n` +
      levels.map((lv) => `  ${lv}: ${map[lv]},`).join("\n") +
      "\n);"
    );
  }
  return "";
}

export function openShadeExportModal(
  colorObj,
  shadeMap,
  currentFormat,
  onCopy
) {
  const modal = document.getElementById("shadeExportModal");
  if (!modal) return;

  // 修复：添加空值检查，使用默认值
  let shadeExportColorName =
    colorObj && colorObj.name ? colorObj.name : "color";
  let shadeExportMap = shadeMap;
  let shadeExportFmt = "css";

  function updateCode() {
    const codeEl = document.getElementById("shadeExportCode");
    if (codeEl) {
      codeEl.textContent = generateShadeCode(
        shadeExportColorName,
        shadeExportMap,
        shadeExportFmt
      );
    }
  }

  // 重置 tab 激活状态
  document
    .querySelectorAll(".shade-export-tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelector('.shade-export-tab[data-fmt="css"]')
    ?.classList.add("active");

  const codeEl = document.getElementById("shadeExportCode");
  if (codeEl)
    codeEl.textContent = generateShadeCode(
      shadeExportColorName,
      shadeMap,
      "css"
    );

  document.querySelectorAll(".shade-export-tab").forEach((tab) => {
    // 移除旧监听，避免重复绑定
    tab.removeEventListener("click", tab._handler);
    const handler = () => {
      document
        .querySelectorAll(".shade-export-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      shadeExportFmt = tab.dataset.fmt;
      updateCode();
    };
    tab._handler = handler;
    tab.addEventListener("click", handler);
  });

  const copyBtn = document.getElementById("copyShadeCodeBtn");
  if (copyBtn) {
    // 移除旧监听
    copyBtn.removeEventListener("click", copyBtn._handler);
    const copyHandler = () => {
      if (codeEl && onCopy) onCopy(codeEl.textContent);
    };
    copyBtn._handler = copyHandler;
    copyBtn.addEventListener("click", copyHandler);
  }

  const closeBtn = document.getElementById("closeShadeExportBtn");
  if (closeBtn) {
    closeBtn.removeEventListener("click", closeBtn._handler);
    const closeHandler = () => {
      modal.style.display = "none";
    };
    closeBtn._handler = closeHandler;
    closeBtn.addEventListener("click", closeHandler);
  }

  modal.style.display = "flex";
}

export function addAllShadesToPalette(shadeMap, baseColor, onComplete) {
  const shadeLevelsList = [
    50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
  ];
  const activeGroupId = getActiveGroupId();
  // 添加空值检查，防止 baseColor 为 null
  const baseColorName = baseColor && baseColor.name ? baseColor.name : "color";
  shadeLevelsList.forEach((lv) => {
    const hex = shadeMap[lv];
    if (hex) {
      const colorInfo = getColorName(hex);
      const name = colorInfo.n || `${baseColorName}-${lv}`;

      addColor(name, hex, activeGroupId, Date.now() + lv);
    }
  });
  if (onComplete) onComplete();
  showToast("已批量添加全部色阶");
}
