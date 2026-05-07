// 存储工具
import {
  STORAGE_KEY,
  THEME_STORAGE_KEY,
  HISTORY_STORAGE_KEY,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/peisewang/constants.js";

export function saveToStorage(
  groups,
  colors,
  nextColorId,
  nextGroupId,
  activeGroupId,
  currentFormat,
  selectedColorId
) {
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
        selectedColorId,
      })
    );
  } catch (e) {
    console.warn("保存到 localStorage 失败", e);
  }
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("从 localStorage 恢复数据失败", e);
    return null;
  }
}

export function saveHistoryToStorage(historyColors) {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyColors));
  } catch (e) { }
}

export function loadHistoryFromStorage() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      const history = JSON.parse(raw);
      return history.map((item) => ({ ...item, pinned: item.pinned || false }));
    }
  } catch (e) { }
  return [];
}

export function getSavedTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || "light";
}

export function setSavedTheme(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
