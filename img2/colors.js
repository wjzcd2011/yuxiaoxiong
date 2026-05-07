// 颜色管理核心
import {
  hexToHsl,
  formatColorByType,
  getBrightness,
} from "../utils/colorUtils.js";
import { copyText, showToast } from "../utils/domUtils.js";
import { saveToStorage } from "../utils/storage.js";
import { getColorName } from "../colorNames.js";
import { getGroups } from "./groups.js";
import { addToHistory } from "./history.js";
import { DEFAULT_ACTIVE_COLOR } from "../constants.js";

let colors = [
  { id: "c1", name: "天空蓝", hex: "#3b82f6", groupId: "default", order: 0 },
  { id: "c2", name: "玫瑰粉", hex: "#ec4899", groupId: "default", order: 1 },
  { id: "c3", name: "翠绿色", hex: "#10b981", groupId: "default", order: 2 },
  { id: "c4", name: "苏木色", hex: "#AE506B", groupId: "default", order: 3 },
  { id: "c5", name: "藤萝紫", hex: "#8076a3", groupId: "default", order: 4 },
  { id: "c6", name: "正红", hex: "#ff0000", groupId: "default", order: 5 },
  { id: "c7", name: "正金黄", hex: "#ffc500", groupId: "default", order: 6 },
  { id: "c8", name: "栀子", hex: "#FAC13D", groupId: "default", order: 7 },
  { id: "c9", name: "踯躅色", hex: "#ef5b9c", groupId: "default", order: 8 },
  { id: "c10", name: "中国红", hex: "#c60000", groupId: "default", order: 9 },
  { id: "c11", name: "黝色", hex: "#6b6882", groupId: "default", order: 10 },
  { id: "c12", name: "远山灰", hex: "#748E96", groupId: "default", order: 11 },
  { id: "c13", name: "元气粉", hex: "#fd79a8", groupId: "default", order: 12 },
  { id: "c14", name: "鸢蓝", hex: "#3949ab", groupId: "default", order: 13 },
  { id: "c15", name: "玉色", hex: "#2edfa3", groupId: "default", order: 14 },
  { id: "c16", name: "暖阳橙", hex: "#ffcc80", groupId: "default", order: 15 },
  { id: "c17", name: "玉绿", hex: "#00a86b", groupId: "default", order: 16 },
  { id: "c18", name: "幽绀紫", hex: "#23007a", groupId: "default", order: 17 },
];

let nextColorId = 19;
let selectedColorId = null;
let activeGroupId = "default";
let currentFormat = "hex";
let isMultiSelectMode = false;
let multiSelectedIds = new Set();

// 全局渲染回调
let onRenderCallback = null;

// ==================== Getter/Setter ====================
export function getColors() {
  return colors;
}
export function setColors(newColors) {
  colors = newColors;
}
export function getNextColorId() {
  return nextColorId;
}
export function setNextColorId(id) {
  nextColorId = id;
}
export function getSelectedColorId() {
  return selectedColorId;
}
export function setSelectedColorId(id) {
  selectedColorId = id;
}
export function getActiveGroupId() {
  return activeGroupId;
}
export function setActiveGroupId(id) {
  activeGroupId = id;
}
export function getCurrentFormat() {
  return currentFormat;
}
export function setCurrentFormat(fmt) {
  currentFormat = fmt;
}
export function getIsMultiSelectMode() {
  return isMultiSelectMode;
}
export function setIsMultiSelectMode(mode) {
  isMultiSelectMode = mode;
}
export function getMultiSelectedIds() {
  return multiSelectedIds;
}
export function clearMultiSelected() {
  multiSelectedIds.clear();
}
export function addMultiSelectedId(id) {
  multiSelectedIds.add(id);
}
export function removeMultiSelectedId(id) {
  multiSelectedIds.delete(id);
}
export function toggleMultiSelectedId(id) {
  if (multiSelectedIds.has(id)) multiSelectedIds.delete(id);
  else multiSelectedIds.add(id);
}
export function setOnRenderCallback(callback) {
  onRenderCallback = callback;
}

// ==================== 颜色 CRUD ====================
export function addColor(name, hex, groupId, order = Date.now()) {
  // 检查当前分组是否已存在相同 HEX 的颜色
  const existingInGroup = colors.some(
    (c) => c.groupId === groupId && c.hex.toLowerCase() === hex.toLowerCase()
  );

  if (existingInGroup) {
    showToast(`当前分组已存在颜色 ${hex}，未重复添加`);
    return null;
  }

  const newColor = {
    id: "c" + nextColorId++,
    name: name,
    hex: hex,
    groupId: groupId,
    order: order,
  };
  colors.push(newColor);
  addToHistory(hex, name);
  if (onRenderCallback) onRenderCallback();
  return newColor;
}

export function updateColor(id, name, hex, groupId) {
  // 检查更新后的颜色是否在当前分组重复
  const existingInGroup = colors.some(
    (c) =>
      c.id !== id &&
      c.groupId === groupId &&
      c.hex.toLowerCase() === hex.toLowerCase()
  );

  if (existingInGroup) {
    showToast(`当前分组已存在颜色 ${hex}，无法更新`);
    return false;
  }

  const idx = colors.findIndex((x) => x.id === id);
  if (idx !== -1) {
    colors[idx] = { ...colors[idx], name, hex, groupId };
  }
  if (onRenderCallback) onRenderCallback();
  return true;
}

export function deleteColor(id) {
  colors = colors.filter((x) => x.id !== id);
  if (onRenderCallback) onRenderCallback();
}

export function deleteColorsByIds(ids) {
  colors = colors.filter((c) => !ids.has(c.id));
  if (onRenderCallback) onRenderCallback();
}

export function getColorById(id) {
  return colors.find((c) => c.id === id);
}

export function getColorsByGroupId(groupId) {
  return colors.filter((c) => c.groupId === groupId);
}

// ==================== 排序和移动 ====================
export function reorderColorsInGroup(groupId, sourceId, targetId) {
  const groupColors = colors
    .filter((c) => c.groupId === groupId)
    .sort((a, b) => a.order - b.order);
  const sourceIndex = groupColors.findIndex((c) => c.id === sourceId);
  const targetIndex = groupColors.findIndex((c) => c.id === targetId);
  if (sourceIndex === -1 || targetIndex === -1) return false;
  const [moved] = groupColors.splice(sourceIndex, 1);
  groupColors.splice(targetIndex, 0, moved);
  groupColors.forEach((c, idx) => {
    c.order = idx;
  });
  return true;
}

export function moveColorToGroup(colorId, targetGroupId) {
  const color = colors.find((c) => c.id === colorId);
  if (!color) return false;
  if (color.groupId === targetGroupId) return false;

  // 检查目标分组是否已存在相同颜色
  const existingInTarget = colors.some(
    (c) =>
      c.groupId === targetGroupId &&
      c.hex.toLowerCase() === color.hex.toLowerCase()
  );
  if (existingInTarget) {
    showToast(`目标分组已存在颜色 ${color.hex}，无法移动`);
    return false;
  }

  color.groupId = targetGroupId;
  const targetGroupColors = colors.filter((c) => c.groupId === targetGroupId);
  const maxOrder =
    targetGroupColors.length > 0
      ? Math.max(...targetGroupColors.map((c) => c.order))
      : -1;
  color.order = maxOrder + 1;
  return true;
}

// ==================== 统一管理所有 dynamic-btn 类的添加/移除 ====================
export function syncDynamicButtons() {
  const hasActiveColor = !!selectedColorId && !isMultiSelectMode;
  const elementsToToggle = [
    document.getElementById("addColorBtn"),
    document.getElementById("saveColorBtn"),
    document.getElementById("imagePickBtn"),
    document.getElementById("closeHelpBtn"),
    document.getElementById("playPauseBtn"),
    document.getElementById("eyeDropperBtn"),
    ...document.querySelectorAll(".scheme-add-btn"),
  ].filter((el) => el !== null);

  elementsToToggle.forEach((el) => {
    if (hasActiveColor) {
      el.classList.add("dynamic-btn");
    } else {
      el.classList.remove("dynamic-btn");
    }
  });
}

// ==================== 同步激活颜色 ====================
export function syncActiveColorFromSelection() {
  let activeColor;
  if (isMultiSelectMode || !selectedColorId) {
    activeColor = DEFAULT_ACTIVE_COLOR;
  } else {
    const colorObj = colors.find((c) => c.id === selectedColorId);
    activeColor = colorObj ? colorObj.hex : DEFAULT_ACTIVE_COLOR;
  }
  document.documentElement.style.setProperty("--active-color", activeColor);
  const brightness = getBrightness(activeColor);
  const textColor = brightness >= 50 ? "#000" : "#fff";
  document.documentElement.style.setProperty("--text-color", textColor);

  // 同步按钮样式
  syncDynamicButtons();
}

// ==================== 卡片渲染 ====================
export function makeColorCard(
  c,
  isMultiSelectMode,
  multiSelectedIds,
  selectedColorId,
  currentFormat,
  onCardClick
) {
  const card = document.createElement("div");
  const isSelected = selectedColorId === c.id && !isMultiSelectMode;
  const isMultiSel = multiSelectedIds.has(c.id);
  card.className = `color-card ${isSelected ? "selected" : ""} ${
    isMultiSel ? "multi-selected" : ""
  }`;
  card.dataset.id = c.id;
  card.dataset.hex = c.hex;
  card.innerHTML = `
          <div class="color-preview" draggable="true" style="background:${
            c.hex
          }; cursor:grab"></div>
          <div class="color-info">
              <div class="color-name">${escapeHtml(
                c.name || "未命名颜色"
              )}</div>
              <div class="color-hex">${c.hex}</div>
              <div class="card-actions">
                  <button class="copy-btn-sm" data-hex="${
                    c.hex
                  }"><i class="fas fa-copy"></i> 复制</button>
                  <button class="edit-btn" data-id="${
                    c.id
                  }"><i class="fas fa-edit"></i></button>
                  <button class="del-btn" data-id="${
                    c.id
                  }"><i class="fas fa-trash"></i></button>
              </div>
          </div>
      `;

  const preview = card.querySelector(".color-preview");
  if (preview) {
    preview.setAttribute("draggable", "true");
  }

  card.addEventListener("click", (e) => {
    if (e.target.closest(".card-actions")) return;
    if (onCardClick) onCardClick(c.id);
  });

  return card;
}

function escapeHtml(str) {
  if (!str) return str;
  return str.replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

export function bindCardEvents(onEditClick, onDeleteClick, onCopyClick) {
  document.querySelectorAll(".copy-btn-sm").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      if (onCopyClick) onCopyClick(btn.dataset.hex);
    };
  });
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      if (onEditClick) onEditClick(btn.dataset.id);
    };
  });
  document.querySelectorAll(".del-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      if (onDeleteClick) onDeleteClick(btn.dataset.id);
    };
  });
}

export function renderColors(
  groups,
  onColorClick,
  onEditClick,
  onDeleteClick,
  onCopyClick
) {
  const wrap = document.getElementById("colorGrid");
  if (!wrap) return;

  const searchKey =
    document.getElementById("searchInput")?.value.toLowerCase().trim() || "";
  const sortVal = document.getElementById("sortSelect")?.value || "default";

  const batchBar = document.getElementById("batchBar");
  const batchText = document.getElementById("batchBarText");
  if (isMultiSelectMode) {
    batchBar?.classList.add("active");
    if (batchText)
      batchText.textContent = `已选 ${multiSelectedIds.size} 个色块`;
  } else {
    batchBar?.classList.remove("active");
    multiSelectedIds.clear();
  }

  if (searchKey) {
    const allMatched = colors.filter(
      (c) =>
        c.name.toLowerCase().includes(searchKey) ||
        c.hex.toLowerCase().includes(searchKey)
    );
    if (allMatched.length === 0) {
      wrap.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><div>未找到匹配的颜色</div></div>`;
      return;
    }
    wrap.innerHTML = "";
    const byGroup = {};
    allMatched.forEach((c) => {
      if (!byGroup[c.groupId]) byGroup[c.groupId] = [];
      byGroup[c.groupId].push(c);
    });
    Object.entries(byGroup).forEach(([gid, list]) => {
      const gName = groups.find((g) => g.id === gid)?.name || gid;
      const label = document.createElement("div");
      label.className = "search-group-label";
      label.textContent = `${gName} (${list.length})`;
      wrap.appendChild(label);
      list.forEach((c) => {
        const card = makeColorCard(
          c,
          isMultiSelectMode,
          multiSelectedIds,
          selectedColorId,
          currentFormat,
          onColorClick
        );
        wrap.appendChild(card);
      });
    });
    bindCardEvents(onEditClick, onDeleteClick, onCopyClick);
    return;
  }

  let list = colors.filter((c) => c.groupId === activeGroupId);
  if (sortVal === "hue") {
    list.sort((a, b) => hexToHsl(a.hex).h - hexToHsl(b.hex).h);
  } else if (sortVal === "lightness") {
    list.sort((a, b) => hexToHsl(b.hex).l - hexToHsl(a.hex).l);
  } else if (sortVal === "saturation") {
    list.sort((a, b) => hexToHsl(b.hex).s - hexToHsl(a.hex).s);
  } else {
    list.sort((a, b) => a.order - b.order);
  }

  if (list.length === 0) {
    wrap.innerHTML = `<div class="empty-state"><i class="fas fa-palette"></i><div>当前分组暂无色块<br>点击「新建色块」添加</div></div>`;
    return;
  }

  wrap.innerHTML = "";
  list.forEach((c) => {
    const card = makeColorCard(
      c,
      isMultiSelectMode,
      multiSelectedIds,
      selectedColorId,
      currentFormat,
      onColorClick
    );
    wrap.appendChild(card);
  });
  bindCardEvents(onEditClick, onDeleteClick, onCopyClick);
}
