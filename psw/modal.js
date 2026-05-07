// 模态框管理
import { showToast } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/psw/domUtils.js";
import {
  addColor,
  updateColor,
  getColorById,
  getActiveGroupId,
  getColors,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/psw/colors.js";
import { getGroups } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/psw/groups.js";
import { addToHistory } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/psw/history.js";
import { getColorName } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/psw/colorNames.js";

let confirmCallback = null;
let editColorId = null;

export function confirmOperate(msg, cb) {
  const modal = document.getElementById("confirmModal");
  const messageEl = document.getElementById("confirmMessage");
  if (messageEl) messageEl.innerText = msg;
  if (modal) modal.style.display = "flex";
  confirmCallback = cb;
}

export function closeConfirmModal() {
  const modal = document.getElementById("confirmModal");
  if (modal) modal.style.display = "none";
  confirmCallback = null;
}

export function getConfirmCallback() {
  return confirmCallback;
}

export function openColorModal(editId = null, onSaveComplete) {
  editColorId = editId;
  const modal = document.getElementById("colorModal");
  const title = document.getElementById("modalTitle");
  const nameInp = document.getElementById("colorName");
  const picker = document.getElementById("colorPicker");
  const hexInp = document.getElementById("colorHex");
  const groupSel = document.getElementById("modalGroupSelect");

  const groups = getGroups();
  groupSel.innerHTML = groups
    .map((g) => `<option value="${g.id}">${escapeHtml(g.name)}</option>`)
    .join("");

  if (editId) {
    const c = getColorById(editId);
    if (c) {
      title.innerHTML = `<i class="fas fa-edit"></i> 编辑色块`;
      nameInp.value = c.name || "";
      picker.value = c.hex;
      hexInp.value = c.hex;
      groupSel.value = c.groupId;
    }
  } else {
    title.innerHTML = `<i class="fas fa-palette"></i> 添加色块`;
    nameInp.value = "";
    picker.value = "#3b82f6";
    hexInp.value = "#3b82f6";
    groupSel.value = getActiveGroupId();
  }
  modal.style.display = "flex";

  // 根据色值自动填充名称
  const autoFillName = (hexVal) => {
    const colorInfo = getColorName(hexVal);
    if (colorInfo && colorInfo.n) {
      nameInp.value = colorInfo.n;
    }
  };

  // 颜色选择器变化时
  const handleColorInput = () => {
    const hexVal = picker.value;
    hexInp.value = hexVal;
    autoFillName(hexVal);
  };

  // HEX 输入框变化时
  const handleHexInput = (e) => {
    let val = e.target.value.trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      picker.value = val;
      autoFillName(val);
    }
  };

  picker.oninput = handleColorInput;
  hexInp.oninput = handleHexInput;
}

export function closeColorModal() {
  const modal = document.getElementById("colorModal");
  if (modal) modal.style.display = "none";
  editColorId = null;
}

export function saveColorFromModal(onComplete) {
  let name = document.getElementById("colorName").value.trim();
  const hex = document.getElementById("colorHex").value.trim();
  const gid = document.getElementById("modalGroupSelect").value;

  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    showToast("请输入合法HEX色值");
    return false;
  }

  // 添加前检查当前分组是否已有相同颜色（非编辑模式）
  if (!editColorId) {
    const colors = getColors();
    const exists = colors.some(
      (c) => c.groupId === gid && c.hex.toLowerCase() === hex.toLowerCase()
    );
    if (exists) {
      showToast(`当前分组已存在颜色 ${hex}，无法重复添加`);
      return false;
    }
  }

  if (!name) {
    const colorInfo = getColorName(hex);
    if (colorInfo && colorInfo.n) {
      name = colorInfo.n;
    } else {
      name = `颜色-${hex.slice(1, 7)}`;
    }
  }

  if (editColorId) {
    updateColor(editColorId, name, hex, gid);
    showToast(`已更新「${name}」`);
  } else {
    addColor(name, hex, gid);
    addToHistory(hex, name);
    showToast(`已添加「${name}」`);
  }

  closeColorModal();
  if (onComplete) onComplete();
  return true;
}

export function openHelpModal() {
  const modal = document.getElementById("helpModal");
  if (modal) modal.style.display = "flex";
}

export function closeHelpModal() {
  const modal = document.getElementById("helpModal");
  if (modal) modal.style.display = "none";
}

export function closeAllModals() {
  const modalIds = [
    "helpModal",
    "colorModal",
    "confirmModal",
    "imagePickModal",
    "shadeExportModal",
    "importModeModal",
  ];
  let anyClosed = false;
  modalIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.style.display === "flex") {
      el.style.display = "none";
      anyClosed = true;
    }
  });
  return anyClosed;
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
