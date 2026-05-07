// 分组管理
import {
  renderColors,
  bindCardEvents,
  getColors,
  getSelectedColorId,
  setSelectedColorId,
  getActiveGroupId,
  setActiveGroupId,
  getIsMultiSelectMode,
  setIsMultiSelectMode,
  clearMultiSelected,
  getMultiSelectedIds,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/colors.js";
import { showToast } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/domUtils.js";
import { saveToStorage } from ".https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/storage.js";

let groups = [{ id: "default", name: "默认分组" }];
let nextGroupId = 2;

export function getGroups() {
  return groups;
}
export function setGroups(newGroups) {
  groups = newGroups;
}
export function getNextGroupId() {
  return nextGroupId;
}
export function setNextGroupId(id) {
  nextGroupId = id;
}

export function addGroup(name) {
  const newGroupId = "g" + nextGroupId++;
  groups.push({ id: newGroupId, name });
  return newGroupId;
}

export function removeGroup(id) {
  groups = groups.filter((x) => x.id !== id);
  return groups;
}

export function renameGroup(id, newName) {
  const group = groups.find((x) => x.id === id);
  if (group) group.name = newName;
}

export function renderGroups(colors, activeGroupId, onGroupClick) {
  const wrap = document.getElementById("groupList");
  if (!wrap) return;
  wrap.innerHTML = "";
  groups.forEach((g) => {
    const cnt = colors.filter((c) => c.groupId === g.id).length;
    const item = document.createElement("div");
    item.className = `group-item ${g.id === activeGroupId ? "active" : ""}`;
    item.innerHTML = `
            <span class="group-name-label">${escapeHtml(g.name)}</span>
            <div style="display:flex;gap:4px;align-items:center">
                <span class="group-count">${cnt}</span>
                <span class="rename-group" data-id="${
                  g.id
                }" title="重命名"><i class="fas fa-pen"></i></span>
                ${
                  g.id !== "default"
                    ? `<span class="del-group" data-id="${g.id}"><i class="fas fa-trash-alt"></i></span>`
                    : ""
                }
            </div>
        `;
    item.addEventListener("click", (e) => {
      if (e.target.closest(".del-group") || e.target.closest(".rename-group"))
        return;
      if (onGroupClick) onGroupClick(g.id);
    });
    wrap.appendChild(item);

    // 为分组项添加 data-group-id 属性
    const existingDel = item.querySelector(".del-group");
    if (existingDel && existingDel.dataset.id) {
      item.setAttribute("data-group-id", existingDel.dataset.id);
    }
  });

  // 绑定重命名和删除事件
  document.querySelectorAll(".rename-group").forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      const id = el.dataset.id;
      const groupItem = el.closest(".group-item");
      const label = groupItem.querySelector(".group-name-label");
      const g = groups.find((x) => x.id === id);
      const input = document.createElement("input");
      input.className = "group-rename-input";
      input.value = g.name;
      label.replaceWith(input);
      input.focus();
      input.select();
      const commit = () => {
        const newName = input.value.trim();
        if (newName && newName !== g.name) {
          g.name = newName;
          if (onGroupClick) onGroupClick(id);
        }
        renderGroups(colors, activeGroupId, onGroupClick);
      };
      input.onblur = commit;
      input.onkeydown = (ev) => {
        if (ev.key === "Enter") input.blur();
        if (ev.key === "Escape") {
          input.value = g.name;
          input.blur();
        }
      };
    };
  });

  document.querySelectorAll(".del-group").forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      const id = el.dataset.id;
      if (confirm("确定删除该分组及内部所有色块？")) {
        groups = groups.filter((x) => x.id !== id);
        if (activeGroupId === id && onGroupClick) onGroupClick("default");
        if (onGroupClick) onGroupClick(activeGroupId);
      }
    };
  });
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
