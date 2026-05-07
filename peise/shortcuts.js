// 键盘快捷键
import {
  closeAllModals,
  confirmOperate,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/modal.js";
import {
  getSelectedColorId,
  setSelectedColorId,
  deleteColor,
  getColorById,
  getColors,
  getActiveGroupId,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/colors.js";
import { openColorModal } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/modal.js";

export function initKeyboardShortcuts(onRenderComplete) {
  document.addEventListener("keydown", (e) => {
    // Esc：关闭所有模态框 / 退出多选 / 取消选中
    if (e.key === "Escape") {
      const modalsClosed = closeAllModals();

      // 检查是否有多选模式
      const multiBtn = document.getElementById("multiSelectBtn");
      const isMultiSelectMode =
        multiBtn && multiBtn.innerHTML.includes("退出多选");
      if (!modalsClosed && isMultiSelectMode) {
        document.getElementById("batchCancelBtn")?.click();
      } else if (!modalsClosed && getSelectedColorId()) {
        setSelectedColorId(null);
        if (onRenderComplete) onRenderComplete();
      }
    }

    // Delete / Backspace：删除选中色块
    if ((e.key === "Delete" || e.key === "Backspace") && getSelectedColorId()) {
      const tag = document.activeElement.tagName;
      const isEditable = document.activeElement.isContentEditable;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        isEditable
      )
        return;
      e.preventDefault();

      const c = getColorById(getSelectedColorId());
      if (c) {
        confirmOperate(`确定删除「${c.name}」？`, () => {
          deleteColor(c.id);

          // 自动选中当前分组下的第一个色块
          const colors = getColors();
          const activeGroupId = getActiveGroupId();
          const remainingInGroup = colors
            .filter((c) => c.groupId === activeGroupId)
            .sort((a, b) => a.order - b.order);
          setSelectedColorId(
            remainingInGroup.length > 0 ? remainingInGroup[0].id : null
          );

          if (onRenderComplete) onRenderComplete();
        });
      }
    }

    // N：新建色块
    if (e.key === "n" && !e.ctrlKey && !e.metaKey) {
      const tag = document.activeElement.tagName;
      const isEditable = document.activeElement.isContentEditable;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        isEditable
      )
        return;
      openColorModal(null, onRenderComplete);
    }
  });
}
