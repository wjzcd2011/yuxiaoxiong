// psstore.js
let groups = [{ id: "default", name: "默认分组" }];
let colors = [
  { id: "c1", name: "天空蓝", hex: "#3b82f6", groupId: "default", order: 0 },
  { id: "c2", name: "玫瑰粉", hex: "#ec4899", groupId: "default", order: 1 },
  { id: "c3", name: "翠绿色", hex: "#10b981", groupId: "default", order: 2 },
  { id: "c4", name: "暖橙色", hex: "#f97316", groupId: "default", order: 3 },
  { id: "c5", name: "香芋紫", hex: "#e9d5ff", groupId: "default", order: 4 },
  { id: "c6", name: "朱砂", hex: "#a82621", groupId: "default", order: 5 },
  { id: "c7", name: "莓果红", hex: "#ff477e", groupId: "default", order: 6 },
  { id: "c8", name: "浅柔红", hex: "#ff8888", groupId: "default", order: 7 },
  { id: "c9", name: "牡丹粉", hex: "#f48fb1", groupId: "default", order: 8 },
];
let activeGroupId = "default";
let selectedColorId = null;
let nextColorId = 5;
let nextGroupId = 2;
let currentFormat = "hex";
let isMultiSelectMode = false;
let multiSelectedIds = new Set();
let extractedColorsData = [];
let selectedExtractedIndices = new Set();
let currentImageDataUrl = null;
let pendingImportData = null;
let activeSchemeTab = "complementary";

const subscribers = [];
function notify() {
  subscribers.forEach((cb) => cb());
}
export function subscribe(cb) {
  subscribers.push(cb);
}

export function getState() {
  return {
    groups,
    colors,
    activeGroupId,
    selectedColorId,
    nextColorId,
    nextGroupId,
    currentFormat,
    isMultiSelectMode,
    multiSelectedIds,
    extractedColorsData,
    selectedExtractedIndices,
    currentImageDataUrl,
    pendingImportData,
    activeSchemeTab,
  };
}

export function setGroups(newGroups) {
  groups = newGroups;
  notify();
}
export function setColors(newColors) {
  colors = newColors;
  notify();
}

// 修改：切换分组时重置选中的颜色、清空多选、退出多选模式
export function setActiveGroupId(id) {
  activeGroupId = id;
  selectedColorId = null;
  multiSelectedIds.clear();
  isMultiSelectMode = false;
  notify();
}

export function setSelectedColorId(id) {
  selectedColorId = id;
  notify();
}
export function setCurrentFormat(fmt) {
  currentFormat = fmt;
  notify();
}
export function setMultiSelectMode(mode) {
  isMultiSelectMode = mode;
  notify();
}
export function setMultiSelectedIds(ids) {
  multiSelectedIds = ids;
  notify();
}
export function addMultiSelectedId(id) {
  multiSelectedIds.add(id);
  notify();
}
export function removeMultiSelectedId(id) {
  multiSelectedIds.delete(id);
  notify();
}
export function clearMultiSelected() {
  multiSelectedIds.clear();
  notify();
}
export function setExtractedColorsData(data) {
  extractedColorsData = data;
  notify();
}
export function setSelectedExtractedIndices(indices) {
  selectedExtractedIndices = indices;
  notify();
}
export function setCurrentImageDataUrl(url) {
  currentImageDataUrl = url;
}
export function setPendingImportData(data) {
  pendingImportData = data;
}
export function setActiveSchemeTab(tab) {
  activeSchemeTab = tab;
  notify();
}

export function addColor(color) {
  colors.push({ ...color, id: "c" + nextColorId++ });
  notify();
}
export function updateColor(id, updates) {
  const idx = colors.findIndex((c) => c.id === id);
  if (idx !== -1) {
    colors[idx] = { ...colors[idx], ...updates };
    notify();
  }
}
export function deleteColor(id) {
  colors = colors.filter((c) => c.id !== id);
  if (selectedColorId === id) selectedColorId = null;
  notify();
}
export function deleteColors(ids) {
  colors = colors.filter((c) => !ids.has(c.id));
  if (selectedColorId && ids.has(selectedColorId)) selectedColorId = null;
  notify();
}

// 修改：添加分组后自动激活新分组（内部会重置选中状态）
export function addGroup(group) {
  const newGroup = { ...group, id: "g" + nextGroupId++ };
  groups.push(newGroup);
  setActiveGroupId(newGroup.id);
}

// 修改：删除分组时，如果删除的是当前分组则切换到默认分组并重置；
// 即使删除的不是当前分组，也重置选中状态（避免残留引用）
export function deleteGroup(id) {
  groups = groups.filter((g) => g.id !== id);
  colors = colors.filter((c) => c.groupId !== id);
  if (activeGroupId === id) {
    setActiveGroupId("default");
  } else {
    // 虽然不是当前分组，但可能选中的颜色属于被删分组
    selectedColorId = null;
    multiSelectedIds.clear();
    isMultiSelectMode = false;
    notify();
  }
}

export function updateGroup(id, name) {
  const g = groups.find((g) => g.id === id);
  if (g) g.name = name;
  notify();
}

export function applyImport(mode) {
  const d = pendingImportData;
  if (!d) return;
  if (mode === "replace") {
    groups = d.groups;
    colors = d.colors;
    nextColorId =
      Math.max(...colors.map((c) => +c.id.replace("c", "") || 0), 5) + 1;
    nextGroupId =
      Math.max(...groups.map((g) => +g.id.replace("g", "") || 0), 2) + 1;
    activeGroupId = groups[0].id;
    selectedColorId = null;
    multiSelectedIds.clear();
    isMultiSelectMode = false;
  } else {
    const groupNameMap = {};
    d.groups.forEach((g) => {
      let exist = groups.find((eg) => eg.name === g.name);
      if (exist) groupNameMap[g.id] = exist.id;
      else {
        let newId = "g" + nextGroupId++;
        groups.push({ id: newId, name: g.name });
        groupNameMap[g.id] = newId;
      }
    });
    const existKey = new Set();
    colors.forEach((c) => existKey.add(`${c.groupId}:${c.hex.toLowerCase()}`));
    d.colors.forEach((c) => {
      let ngid = groupNameMap[c.groupId] || activeGroupId;
      let key = `${ngid}:${c.hex.toLowerCase()}`;
      if (!existKey.has(key)) {
        colors.push({
          ...c,
          id: "c" + nextColorId++,
          groupId: ngid,
          order: Date.now(),
        });
        existKey.add(key);
      }
    });
    // 合并导入后不清空选中状态，但为避免显示问题，可以重置（可选）
    selectedColorId = null;
    multiSelectedIds.clear();
    isMultiSelectMode = false;
  }
  pendingImportData = null;
  notify();
}

const STORAGE_KEY = "palette_studio_data";
export function saveToStorage() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        groups,
        colors,
        nextColorId,
        nextGroupId,
        activeGroupId,
        currentFormat,
      })
    );
  } catch (e) {}
}
export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d.groups && d.colors) {
      groups = d.groups;
      colors = d.colors;
      nextColorId =
        d.nextColorId ||
        Math.max(...colors.map((c) => +c.id.replace("c", "")), 4) + 1;
      nextGroupId =
        d.nextGroupId ||
        Math.max(...groups.map((g) => +g.id.replace("g", "") || 0), 1) + 1;
      activeGroupId = groups.find((g) => g.id === d.activeGroupId)
        ? d.activeGroupId
        : groups[0].id;
      currentFormat = d.currentFormat || "hex";
      selectedColorId = null;
      multiSelectedIds.clear();
      isMultiSelectMode = false;
    }
  } catch (e) {}
}
