// 颜色历史记录管理
import {
  MAX_HISTORY_SIZE,
  HISTORY_STORAGE_KEY,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/peisewang/constants.js";
import { getColorName } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/peisewang/colorNames.js";
import { showToast } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/peisewang/domUtils.js";
import {
  saveHistoryToStorage,
  loadHistoryFromStorage,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/peisewang/storage.js";
import {
  addColor,
  getActiveGroupId,
  getColors,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/peisewang/colors.js";

let historyColors = [];

export function getHistoryColors() {
  return historyColors;
}
export function setHistoryColors(history) {
  historyColors = history;
}

export function loadHistory() {
  historyColors = loadHistoryFromStorage();
  if (!Array.isArray(historyColors)) historyColors = [];
}

export function addToHistory(hex, name) {
  if (!hex) return;
  const normalizedHex = hex.toLowerCase();
  const existingIndex = historyColors.findIndex(
    (item) => item.hex === normalizedHex
  );
  const now = Date.now();

  if (existingIndex !== -1) {
    const existing = historyColors[existingIndex];
    existing.timestamp = now;
    if (!existing.pinned) {
      const pinnedItems = historyColors.filter((i) => i.pinned);
      const unpinnedItems = historyColors.filter(
        (i) => !i.pinned && i.hex !== normalizedHex
      );
      unpinnedItems.unshift(existing);
      historyColors = [...pinnedItems, ...unpinnedItems];
    } else {
      historyColors.sort(
        (a, b) => b.pinned - a.pinned || b.timestamp - a.timestamp
      );
    }
  } else {
    const newItem = {
      hex: normalizedHex,
      name: name || getColorName(normalizedHex).n || hex,
      timestamp: now,
      pinned: false,
    };
    const pinnedItems = historyColors.filter((i) => i.pinned);
    let unpinnedItems = historyColors.filter((i) => !i.pinned);
    unpinnedItems.unshift(newItem);
    if (unpinnedItems.length > MAX_HISTORY_SIZE) {
      unpinnedItems = unpinnedItems.slice(0, MAX_HISTORY_SIZE);
    }
    historyColors = [...pinnedItems, ...unpinnedItems];
  }
  saveHistoryToStorage(historyColors);
  renderHistoryPanel();
}

export function removeFromHistory(hex, onlyIfUnpinned = false) {
  const idx = historyColors.findIndex((i) => i.hex === hex);
  if (idx === -1) return;
  if (onlyIfUnpinned && historyColors[idx].pinned) return;
  historyColors.splice(idx, 1);
  saveHistoryToStorage(historyColors);
  renderHistoryPanel();
}

export function togglePinHistory(hex) {
  const item = historyColors.find((i) => i.hex === hex);
  if (item) {
    item.pinned = !item.pinned;
    const pinned = historyColors
      .filter((i) => i.pinned)
      .sort((a, b) => b.timestamp - a.timestamp);
    const unpinned = historyColors
      .filter((i) => !i.pinned)
      .sort((a, b) => b.timestamp - a.timestamp);
    historyColors = [...pinned, ...unpinned];
    saveHistoryToStorage(historyColors);
    renderHistoryPanel();
  }
}

export function clearUnpinnedHistory() {
  historyColors = historyColors.filter((i) => i.pinned);
  saveHistoryToStorage(historyColors);
  renderHistoryPanel();
}

export function clearPinnedHistory() {
  historyColors = historyColors.filter((i) => !i.pinned);
  saveHistoryToStorage(historyColors);
  renderHistoryPanel();
}

export function reuseHistoryColor(hex, onAddComplete) {
  const activeGroupId = getActiveGroupId();
  const colors = getColors();
  const exists = colors.some(
    (c) =>
      c.groupId === activeGroupId && c.hex.toLowerCase() === hex.toLowerCase()
  );
  if (exists) {
    showToast(`当前分组已有颜色 ${hex}，未重复添加`);
    return false;
  }
  const colorInfo = getColorName(hex);
  const name = colorInfo.n || `重用-${hex.slice(1, 7)}`;
  addColor(name, hex, activeGroupId);
  if (onAddComplete) onAddComplete();
  showToast(`✅ 已添加「${name}」到当前分组`);
  return true;
}

export function renderHistoryPanel() {
  const container = document.getElementById("historyList");
  if (!container) return;

  if (historyColors.length === 0) {
    container.innerHTML = `<div class="history-empty">暂无历史颜色<br>点击色块或添加颜色后记录</div>`;
    return;
  }

  const pinnedItems = historyColors.filter((i) => i.pinned);
  const unpinnedItems = historyColors.filter((i) => !i.pinned);

  let html = "";
  if (pinnedItems.length) {
    html += `<div class="history-group-title"><i class="fas fa-thumbtack"></i> 常用色</div>`;
    pinnedItems.forEach((item) => {
      html += makeHistoryItemHtml(item);
    });
  }
  if (unpinnedItems.length) {
    html += `<div class="history-group-title"><i class="fas fa-history"></i> 最近</div>`;
    unpinnedItems.forEach((item) => {
      html += makeHistoryItemHtml(item);
    });
  }
  container.innerHTML = html;

  // 绑定历史项事件
  document.querySelectorAll(".history-item").forEach((el) => {
    const hex = el.dataset.hex;
    if (!hex) return;
    el.addEventListener("click", (e) => {
      if (e.target.closest(".history-pin") || e.target.closest(".history-del"))
        return;
      reuseHistoryColor(hex, () => {
        if (typeof window.renderAll === "function") window.renderAll();
      });
    });
  });
  document.querySelectorAll(".history-pin").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const hex = btn.closest(".history-item").dataset.hex;
      if (hex) togglePinHistory(hex);
    });
  });
  document.querySelectorAll(".history-del").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const hex = btn.closest(".history-item").dataset.hex;
      if (hex) removeFromHistory(hex);
    });
  });
}

function makeHistoryItemHtml(item) {
  const name = item.name || getColorName(item.hex).n || item.hex;
  return `
    <div class="history-item" data-hex="${item.hex}">
      <div class="history-color" style="background: ${item.hex}"></div>
      <div class="history-info">
        <div class="history-name" title="${escapeHtml(name)}">${escapeHtml(
    name
  )}</div>
        <div class="history-hex">${item.hex}</div>
      </div>
      <div class="history-actions">
        <button class="history-pin ${item.pinned ? "pinned" : ""}" title="${item.pinned ? "取消固定" : "固定"
    }">
          <i class="fas fa-thumbtack"></i>
        </button>
        <button class="history-del" title="从历史中移除">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `;
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
