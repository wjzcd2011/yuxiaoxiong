// 拖拽排序和移动功能
import {
  reorderColorsInGroup,
  moveColorToGroup,
  getColors,
  getSelectedColorId,
  setSelectedColorId,
  getActiveGroupId,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/pswang/colors.js";
import { getGroups } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/pswang/groups.js";
import { showToast } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/pswang/domUtils.js";

let dragSourceId = null;

export function initDragAndDrop(onRenderComplete) {
  // 全局监听拖拽开始
  document.addEventListener("dragstart", (e) => {
    const preview = e.target.closest(".color-preview");
    if (!preview) return;
    const card = preview.closest(".color-card");
    if (!card) return;
    const id = card.dataset.id;
    if (!id) return;

    dragSourceId = id;
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    card.style.opacity = "0.5";
  });

  document.addEventListener("dragend", (e) => {
    document
      .querySelectorAll(".color-card")
      .forEach((c) => (c.style.opacity = ""));
    dragSourceId = null;
  });

  // 色块网格放置
  const colorGrid = document.getElementById("colorGrid");
  if (colorGrid) {
    colorGrid.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    colorGrid.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!dragSourceId) return;

      const targetCard = e.target.closest(".color-card");
      if (!targetCard) return;

      const targetId = targetCard.dataset.id;
      if (!targetId || dragSourceId === targetId) return;

      const colors = getColors();
      const sourceColor = colors.find((c) => c.id === dragSourceId);
      const targetColor = colors.find((c) => c.id === targetId);
      if (!sourceColor || !targetColor) return;

      if (sourceColor.groupId !== targetColor.groupId) return;

      const success = reorderColorsInGroup(
        sourceColor.groupId,
        dragSourceId,
        targetId
      );
      if (success) {
        const wasSelected = getSelectedColorId() === dragSourceId;
        if (onRenderComplete) onRenderComplete();
        if (wasSelected) setSelectedColorId(dragSourceId);
        showToast("色块顺序已更新");
      }
    });
  }

  // 分组列表放置（移动颜色到其他分组）
  const groupList = document.getElementById("groupList");
  if (groupList) {
    groupList.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    groupList.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!dragSourceId) return;

      let targetGroupId = null;
      const groupItem = e.target.closest(".group-item");
      if (!groupItem) return;

      // 获取分组 ID
      const delBtn = groupItem.querySelector(".del-group");
      if (delBtn && delBtn.dataset.id) {
        targetGroupId = delBtn.dataset.id;
      } else {
        const groupName =
          groupItem.querySelector(".group-name-label")?.innerText;
        if (groupName) {
          const groups = getGroups();
          const found = groups.find((g) => g.name === groupName);
          if (found) targetGroupId = found.id;
        }
      }
      if (!targetGroupId) return;

      const colors = getColors();
      const sourceColor = colors.find((c) => c.id === dragSourceId);
      if (!sourceColor) return;
      if (sourceColor.groupId === targetGroupId) {
        showToast("已经在当前分组中");
        return;
      }

      const success = moveColorToGroup(dragSourceId, targetGroupId);
      if (success) {
        const groups = getGroups();
        const targetGroup = groups.find((g) => g.id === targetGroupId);
        if (onRenderComplete) onRenderComplete();
        showToast(`已移动到 ${targetGroup?.name}`);
      }
    });
  }
}
