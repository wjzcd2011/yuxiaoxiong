// 初始化模块 - 整合所有功能
import {
  DEFAULT_ACTIVE_COLOR,
  formatList,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/constants.js";
import {
  initFormatFunctions,
  getBrightness,
  formatColorByType,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/colorUtils.js";
import {
  showToast,
  copyText,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/domUtils.js";
import {
  loadFromStorage,
  saveToStorage,
  loadHistoryFromStorage,
  saveHistoryToStorage,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/storage.js";
import {
  loadColorNames,
  getColorName,
  setColorNames,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/colorNames.js";
import {
  getGroups,
  setGroups,
  getNextGroupId,
  setNextGroupId,
  addGroup,
  renderGroups,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/groups.js";
import {
  getColors,
  setColors,
  getNextColorId,
  setNextColorId,
  getSelectedColorId,
  setSelectedColorId,
  getActiveGroupId,
  setActiveGroupId,
  getCurrentFormat,
  setCurrentFormat,
  getIsMultiSelectMode,
  setIsMultiSelectMode,
  getMultiSelectedIds,
  clearMultiSelected,
  addColor,
  updateColor,
  deleteColor,
  deleteColorsByIds,
  getColorById,
  renderColors,
  syncActiveColorFromSelection,
  setOnRenderCallback,
  syncDynamicButtons,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/colors.js";
import {
  loadHistory,
  renderHistoryPanel,
  clearUnpinnedHistory,
  clearPinnedHistory,
  addToHistory,
  reuseHistoryColor,
  getHistoryColors,
  setHistoryColors,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/history.js";
import {
  renderGradientPanel,
  cleanupGradientResize,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/gradient.js";
import {
  renderSchemePanel,
  setActiveSchemeTab,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/scheme.js";
import {
  initColorWorker,
  processUploadedImage,
  loadImageFromFile,
  renderExtractedColors,
  getSelectedExtractedColors,
  addSelectedExtractedColorsToPalette,
  openImagePickModal,
  closeImagePickModal,
  resetExtractedData,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/imageExtract.js";
import {
  exportData,
  showImportModeModal,
  setImportMode,
  getImportMode,
  getPendingImportData,
  clearPendingImportData,
  executeImport,
  openShadeExportModal,
  addAllShadesToPalette,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/exportImport.js";
import { initEyeDropper } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/dragDrop/eyeDropper.js";
import { initDragAndDrop } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/dragDrop.js";
import {
  confirmOperate,
  openColorModal,
  closeColorModal,
  saveColorFromModal,
  openHelpModal,
  closeHelpModal,
  closeAllModals,
  getConfirmCallback,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/modal.js";
import { initKeyboardShortcuts } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/shortcuts.js";
import { initTheme } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/theme.js";
import { initCvdSimulation } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/cvdSimulation.js";
import {
  initPlayer,
  updatePlayerHighlightClass,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/player.js";

// 全局渲染标志
let isRendering = false;

// 定义回调函数（放在 renderAll 外部，避免重复创建）
let handleColorClick, handleEditClick, handleDeleteClick, handleCopyClick;

// 主渲染函数
export function renderAll() {
  if (isRendering) return;
  isRendering = true;

  const groups = getGroups();
  const colors = getColors();
  const activeGroupId = getActiveGroupId();
  const selectedColorId = getSelectedColorId();
  const currentFormat = getCurrentFormat();
  const isMultiSelectMode = getIsMultiSelectMode();
  const multiSelectedIds = getMultiSelectedIds();

  // 定义回调函数（如果尚未定义或需要更新）
  handleColorClick = (colorId) => {
    if (getIsMultiSelectMode()) {
      const multiSelected = getMultiSelectedIds();
      if (multiSelected.has(colorId)) {
        multiSelected.delete(colorId);
      } else {
        multiSelected.add(colorId);
      }
      // 重新渲染时使用相同的回调函数
      renderColors(
        getGroups(),
        handleColorClick,
        handleEditClick,
        handleDeleteClick,
        handleCopyClick
      );
      // 更新批量栏显示
      const batchText = document.getElementById("batchBarText");
      if (batchText) {
        batchText.textContent = `已选 ${getMultiSelectedIds().size} 个色块`;
      }
    } else {
      setSelectedColorId(colorId);
      const clickedColor = getColorById(colorId);
      if (clickedColor) {
        addToHistory(clickedColor.hex, clickedColor.name);
      }
      renderAll();
      const colorInfo = getColorName(clickedColor.hex);
      showToast(
        `✨ 已选中「${
          colorInfo.n || clickedColor.name
        }」，可在下方查看配色方案`,
        2500
      );
    }
  };

  handleEditClick = (colorId) => {
    openColorModal(colorId, () => renderAll());
  };

  handleDeleteClick = (colorId) => {
    confirmOperate("确定删除该色块？", () => {
      deleteColor(colorId);
      // 自动选中当前分组下的第一个色块
      const remainingInGroup = getColors()
        .filter((c) => c.groupId === getActiveGroupId())
        .sort((a, b) => a.order - b.order);
      if (remainingInGroup.length > 0) {
        setSelectedColorId(remainingInGroup[0].id);
      } else {
        setSelectedColorId(null);
      }
      renderAll();
    });
  };

  handleCopyClick = (hex) => {
    const currentFormat = getCurrentFormat();
    const formatted = formatColorByType(hex, currentFormat);
    copyText(formatted);
  };

  // 渲染分组
  renderGroups(colors, activeGroupId, (groupId) => {
    setActiveGroupId(groupId);
    clearMultiSelected();

    // 自动选中新分组下的第一个色块
    const groupColors = colors
      .filter((c) => c.groupId === groupId)
      .sort((a, b) => a.order - b.order);
    if (groupColors.length > 0) {
      setSelectedColorId(groupColors[0].id);
    } else {
      setSelectedColorId(null);
    }
    renderAll();
  });

  // 渲染颜色网格（使用定义好的回调函数）
  renderColors(
    groups,
    handleColorClick,
    handleEditClick,
    handleDeleteClick,
    handleCopyClick
  );

  // 渲染渐变面板
  renderGradientPanel(
    getSelectedColorId(),
    getCurrentFormat(),
    (newFormat) => {
      setCurrentFormat(newFormat);
      renderAll();
    },
    (colorObj, shadeMap) => {
      openShadeExportModal(colorObj, shadeMap, getCurrentFormat(), (code) => {
        copyText(code);
      });
    }
  );

  // 渲染配色方案面板
  renderSchemePanel(getSelectedColorId(), getCurrentFormat(), () =>
    renderAll()
  );

  // 保存到存储
  saveToStorage(
    groups,
    colors,
    getNextColorId(),
    getNextGroupId(),
    getActiveGroupId(),
    getCurrentFormat(),
    getSelectedColorId()
  );

  // 更新播放器高亮
  updatePlayerHighlightClass();

  // 同步激活颜色和按钮样式
  syncActiveColorFromSelection();

  // 更新 body 上的选中状态
  document.body.dataset.selectedColorId = getSelectedColorId() || "";

  isRendering = false;
}

// 全局添加色阶函数
window.addAllShades = function (shadeMap, baseColor) {
  addAllShadesToPalette(shadeMap, baseColor, () => renderAll());
};

// 初始化事件监听
function initEventListeners() {
  // 新建色块按钮
  document.getElementById("addColorBtn")?.addEventListener("click", () => {
    openColorModal(null, () => renderAll());
  });

  // 添加分组按钮
  document.getElementById("addGroupBtn")?.addEventListener("click", () => {
    const inputWrap = document.getElementById("addGroupInputWrap");
    if (inputWrap) inputWrap.style.display = "flex";
  });

  // 确认添加分组
  document.getElementById("confirmAddGroup")?.addEventListener("click", () => {
    const nameInput = document.getElementById("newGroupName");
    const name = nameInput?.value.trim();
    if (!name) {
      showToast("请输入分组名称");
      return;
    }
    const newGroupId = addGroup(name);
    setActiveGroupId(newGroupId);
    setIsMultiSelectMode(false);
    clearMultiSelected();
    const multiBtn = document.getElementById("multiSelectBtn");
    if (multiBtn)
      multiBtn.innerHTML = '<i class="fas fa-check-square"></i> 多选';

    // 自动选中新分组下的第一个色块
    const firstColor = getColors()
      .filter((c) => c.groupId === newGroupId)
      .sort((a, b) => a.order - b.order)[0];
    setSelectedColorId(firstColor ? firstColor.id : null);

    if (nameInput) nameInput.value = "";
    const inputWrap = document.getElementById("addGroupInputWrap");
    if (inputWrap) inputWrap.style.display = "none";
    renderAll();
  });

  // 新分组名称输入框键盘事件
  document.getElementById("newGroupName")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("confirmAddGroup")?.click();
    if (e.key === "Escape") {
      const inputWrap = document.getElementById("addGroupInputWrap");
      if (inputWrap) inputWrap.style.display = "none";
    }
  });

  // 搜索和排序
  document
    .getElementById("searchInput")
    ?.addEventListener("input", () => renderAll());
  document
    .getElementById("sortSelect")
    ?.addEventListener("change", () => renderAll());

  // 多选按钮
  const multiBtn = document.getElementById("multiSelectBtn");
  if (multiBtn) {
    multiBtn.addEventListener("click", () => {
      const isMultiMode = !getIsMultiSelectMode();
      setIsMultiSelectMode(isMultiMode);
      clearMultiSelected();
      multiBtn.innerHTML = isMultiMode
        ? '<i class="fas fa-times-square"></i> 退出多选'
        : '<i class="fas fa-check-square"></i> 多选';
      renderAll();
    });
  }

  // 批量操作按钮
  document
    .getElementById("batchSelectAllBtn")
    ?.addEventListener("click", () => {
      const visibleIds = getColors()
        .filter((c) => c.groupId === getActiveGroupId())
        .map((c) => c.id);
      visibleIds.forEach((id) => getMultiSelectedIds().add(id));
      renderAll();
    });

  document.getElementById("batchDeleteBtn")?.addEventListener("click", () => {
    const multiSelected = getMultiSelectedIds();
    if (multiSelected.size === 0) {
      showToast("请先选择色块");
      return;
    }
    confirmOperate(`确定删除选中的 ${multiSelected.size} 个色块？`, () => {
      deleteColorsByIds(multiSelected);

      const remainingInGroup = getColors()
        .filter((c) => c.groupId === getActiveGroupId())
        .sort((a, b) => a.order - b.order);
      if (remainingInGroup.length > 0) {
        setSelectedColorId(remainingInGroup[0].id);
      } else {
        setSelectedColorId(null);
      }

      clearMultiSelected();
      setIsMultiSelectMode(false);
      const multiBtn = document.getElementById("multiSelectBtn");
      if (multiBtn)
        multiBtn.innerHTML = '<i class="fas fa-check-square"></i> 多选';

      renderAll();
      showToast("批量删除完成");
    });
  });

  document.getElementById("batchCancelBtn")?.addEventListener("click", () => {
    setIsMultiSelectMode(false);
    clearMultiSelected();
    const multiBtn = document.getElementById("multiSelectBtn");
    if (multiBtn)
      multiBtn.innerHTML = '<i class="fas fa-check-square"></i> 多选';
    renderAll();
  });

  // 导出按钮
  document.getElementById("exportBtn")?.addEventListener("click", exportData);

  // 导入文件
  const importFile = document.getElementById("importFile");
  if (importFile) {
    importFile.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      try {
        const d = JSON.parse(text);
        if (d.groups && d.colors) {
          showImportModeModal(d);
        } else {
          showToast("文件格式不正确");
        }
      } catch {
        showToast("文件格式错误");
      }
      e.target.value = "";
    });
  }

  // 导入模式选择
  document.getElementById("importMergeBtn")?.addEventListener("click", () => {
    setImportMode("merge");
    document.getElementById("importMergeBtn")?.classList.add("active");
    document.getElementById("importReplaceBtn")?.classList.remove("active");
  });
  document.getElementById("importReplaceBtn")?.addEventListener("click", () => {
    setImportMode("replace");
    document.getElementById("importReplaceBtn")?.classList.add("active");
    document.getElementById("importMergeBtn")?.classList.remove("active");
  });
  document.getElementById("importCancelBtn")?.addEventListener("click", () => {
    clearPendingImportData();
    const modal = document.getElementById("importModeModal");
    if (modal) modal.style.display = "none";
  });
  document.getElementById("importConfirmBtn")?.addEventListener("click", () => {
    executeImport(() => renderAll());
    const modal = document.getElementById("importModeModal");
    if (modal) modal.style.display = "none";
  });

  // 图片取色按钮
  const imagePickBtn = document.getElementById("imagePickBtn");
  const imagePickFile = document.getElementById("imagePickFile");
  if (imagePickBtn && imagePickFile) {
    imagePickBtn.addEventListener("click", () => {
      imagePickFile.click();
    });
    imagePickFile.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        openImagePickModal();
        loadImageFromFile(file, (img) => {
          const numColors =
            parseInt(document.getElementById("extractCountSlider")?.value) || 6;
          processUploadedImage(img, numColors);
        });
      }
      e.target.value = "";
    });
  }

  // 图片取色模态框事件
  document
    .getElementById("closeImagePickModalBtn")
    ?.addEventListener("click", closeImagePickModal);
  document
    .getElementById("extractCountSlider")
    ?.addEventListener("input", (e) => {
      const badge = document.getElementById("extractCountBadge");
      if (badge) badge.textContent = e.target.value;
    });
  document
    .getElementById("extractCountSlider")
    ?.addEventListener("change", () => {
      const img = document.getElementById("imagePreviewImg");
      if (
        img &&
        img.src &&
        img.style.display !== "none" &&
        img.complete &&
        img.naturalWidth > 0
      ) {
        const numColors = parseInt(
          document.getElementById("extractCountSlider").value
        );
        processUploadedImage(img, numColors);
      }
    });
  document.getElementById("reExtractBtn")?.addEventListener("click", () => {
    document.getElementById("imagePickFile")?.click();
  });
  // 修改后
  document
    .getElementById("selectAllExtractedBtn")
    ?.addEventListener("click", () => {
      // 通过调用模块内部的方法来全选
      if (typeof window.selectAllExtractedColors === "function") {
        window.selectAllExtractedColors();
      }
    });
  document
    .getElementById("deselectAllExtractedBtn")
    ?.addEventListener("click", () => {
      // 通过调用模块内部的方法来取消全选
      if (typeof window.deselectAllExtractedColors === "function") {
        window.deselectAllExtractedColors();
      }
    });

  document
    .getElementById("addExtractedColorsBtn")
    ?.addEventListener("click", () => {
      addSelectedExtractedColorsToPalette(() => renderAll());
      closeImagePickModal();
    });

  // 图片模态框拖放
  const imagePreviewWrap = document.getElementById("imagePreviewWrap");
  if (imagePreviewWrap) {
    imagePreviewWrap.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      imagePreviewWrap.style.borderColor = "rgba(126,184,255,0.5)";
    });
    imagePreviewWrap.addEventListener("dragleave", (e) => {
      e.preventDefault();
      e.stopPropagation();
      imagePreviewWrap.style.borderColor = "";
    });
    imagePreviewWrap.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      imagePreviewWrap.style.borderColor = "";
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        openImagePickModal();
        loadImageFromFile(file, (img) => {
          const numColors =
            parseInt(document.getElementById("extractCountSlider")?.value) || 6;
          processUploadedImage(img, numColors);
        });
      } else {
        showToast("请拖放图片文件");
      }
    });
  }

  // 全局粘贴监听
  document.addEventListener("paste", (e) => {
    const modal = document.getElementById("imagePickModal");
    if (!modal || modal.style.display === "none") return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          loadImageFromFile(file, (img) => {
            const numColors =
              parseInt(document.getElementById("extractCountSlider")?.value) ||
              6;
            processUploadedImage(img, numColors);
          });
          showToast("已粘贴剪贴板图片");
          return;
        }
      }
    }
  });

  // 帮助按钮
  document.getElementById("helpBtn")?.addEventListener("click", openHelpModal);
  document
    .getElementById("closeHelpBtn")
    ?.addEventListener("click", closeHelpModal);

  // 保存颜色模态框
  document
    .getElementById("closeModalBtn")
    ?.addEventListener("click", closeColorModal);
  document.getElementById("saveColorBtn")?.addEventListener("click", () => {
    saveColorFromModal(() => renderAll());
  });

  // 确认模态框按钮
  document.getElementById("confirmOkBtn")?.addEventListener("click", () => {
    const cb = getConfirmCallback();
    if (cb) cb();
    closeAllModals();
  });
  document.getElementById("confirmCancelBtn")?.addEventListener("click", () => {
    closeAllModals();
  });

  // 历史记录按钮
  document.getElementById("clearHistoryBtn")?.addEventListener("click", () => {
    confirmOperate("清除所有非固定历史颜色？", () => {
      clearUnpinnedHistory();
      showToast("已清除历史记录（常用色保留）");
    });
  });
  document.getElementById("clearPinnedBtn")?.addEventListener("click", () => {
    confirmOperate("清除所有固定常用色？", () => {
      clearPinnedHistory();
      showToast("已清除所有常用色");
    });
  });

  // 模态框点击外部关闭
  window.onclick = (e) => {
    const modalIds = [
      "helpModal",
      "colorModal",
      "confirmModal",
      "imagePickModal",
      "shadeExportModal",
      "importModeModal",
    ];
    modalIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el && e.target === el) el.style.display = "none";
    });
  };
  // 移动端菜单按钮（找到这段代码并替换）
  const menuToggle = document.getElementById("menuToggleBtn");
  const toolbarRight = document.getElementById("toolbarRight");
  let menuAutoCloseTimer = null;

  if (menuToggle && toolbarRight) {
    // 重置自动关闭计时器（10秒）
    function resetAutoCloseTimer() {
      if (menuAutoCloseTimer) {
        clearTimeout(menuAutoCloseTimer);
      }
      if (toolbarRight.classList.contains("open")) {
        menuAutoCloseTimer = setTimeout(() => {
          closeMenu();
        }, 10000);
      }
    }

    // 关闭菜单的函数
    function closeMenu() {
      toolbarRight.classList.remove("open");
      if (menuAutoCloseTimer) {
        clearTimeout(menuAutoCloseTimer);
        menuAutoCloseTimer = null;
      }
    }

    // 打开菜单的函数
    function openMenu() {
      toolbarRight.classList.add("open");
      resetAutoCloseTimer();
    }

    // 点击菜单按钮切换
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (toolbarRight.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // 点击页面其他位置关闭菜单
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 860 && toolbarRight.classList.contains("open")) {
        if (
          !toolbarRight.contains(e.target) &&
          !menuToggle.contains(e.target)
        ) {
          closeMenu();
        } else {
          resetAutoCloseTimer();
        }
      }
    });

    // 监听页面滚动事件
    let lastScrollTarget = null;

    // 检测滚动目标是否在 toolbar-right 内
    window.addEventListener("scroll", () => {
      if (window.innerWidth <= 860 && toolbarRight.classList.contains("open")) {
        // 获取当前滚动的事件目标
        const scrollElement =
          document.scrollingElement || document.documentElement;

        // 检查工具栏是否正在滚动（通过检查鼠标位置或触摸点）
        // 简单有效的方法：检查鼠标是否在工具栏区域内
        const isMouseInToolbar = toolbarRight.matches(":hover");

        // 触摸设备：检查最后触摸点是否在工具栏内
        let isTouchInToolbar = false;
        if (lastScrollTarget && toolbarRight.contains(lastScrollTarget)) {
          isTouchInToolbar = true;
        }

        // 如果在工具栏内滚动，重置计时器，不关闭
        if (isMouseInToolbar || isTouchInToolbar) {
          resetAutoCloseTimer();
          return;
        }

        // 否则关闭菜单
        closeMenu();
      }
    });

    // 监听触摸事件，记录触摸目标
    document.addEventListener("touchstart", (e) => {
      lastScrollTarget = e.target;
    });

    // 菜单面板内滚动时重置计时器
    toolbarRight.addEventListener("scroll", () => {
      if (toolbarRight.classList.contains("open")) {
        resetAutoCloseTimer();
      }
    });

    // 菜单面板内触摸滚动时重置计时器
    toolbarRight.addEventListener("touchstart", () => {
      if (toolbarRight.classList.contains("open")) {
        resetAutoCloseTimer();
      }
    });

    toolbarRight.addEventListener("touchmove", () => {
      if (toolbarRight.classList.contains("open")) {
        resetAutoCloseTimer();
      }
    });

    // 菜单面板内鼠标滚轮时重置计时器
    toolbarRight.addEventListener("wheel", () => {
      if (toolbarRight.classList.contains("open")) {
        resetAutoCloseTimer();
      }
    });

    // 窗口大小变化时关闭
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) {
        closeMenu();
      }
    });
  }
}

// 欢迎弹窗
function showWelcomeModal() {
  const hasVisited = localStorage.getItem("palette_visited");
  if (hasVisited) return;

  setTimeout(() => {
    const welcomeModal = document.createElement("div");
    welcomeModal.className = "modal";
    welcomeModal.style.display = "flex";
    let countdownSeconds = 8;

    welcomeModal.innerHTML = `
            <div class="modal-box" style="max-width: 420px; text-align: center;">
                <div class="modal-title" style="justify-content: center;">
                    <i class="fas fa-sparkles" style="color: var(--accent);"></i> 欢迎使用 Palette Studio
                </div>
                <div style="font-size: 14px; color: var(--text-subtle); line-height: 1.7; margin: 20px 0;">
                    <p style="margin-bottom: 16px;">🎨 你的智能色彩管理器</p>
                    <p style="margin-bottom: 12px;">🖼️ <strong>图片取色</strong>：上传图片，智能提取主要色块</p>
                    <p style="margin-bottom: 12px;">✨ <strong>导入/导出</strong>：保存你的配色方案，支持合并/覆盖两种模式</p>
                    <p style="margin-bottom: 12px;">🌈 <strong>配色推荐</strong>：选中色块，自动生成5种专业配色方案</p>
                    <p style="margin-bottom: 12px;">🎯 <strong>渐变拾色器</strong>：鼠标移动拾色，点击复制色值</p>
                    <p style="margin-bottom: 12px;">📊 <strong>WCAG对比度</strong>：实时检测文字可读性标准</p>
                    <p>☁️ <strong>自动保存</strong>：数据实时存储到本地，刷新不丢失</p>
                </div>
                <div class="modal-actions" style="margin-top: 16px;">
                    <button class="btn btn-accent" id="closeWelcomeBtn" style="flex: 1;">开始使用 →</button>
                </div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 14px;" id="countdownText">
                    ${countdownSeconds}秒后自动关闭
                </div>
            </div>
        `;

    document.body.appendChild(welcomeModal);

    const countdownText = welcomeModal.querySelector("#countdownText");
    const autoCloseTimer = setTimeout(() => {
      if (welcomeModal && welcomeModal.parentNode) welcomeModal.remove();
    }, countdownSeconds * 1000);

    const countdownTimer = setInterval(() => {
      countdownSeconds--;
      if (countdownSeconds > 0) {
        if (countdownText)
          countdownText.textContent = `${countdownSeconds}秒后自动关闭`;
      } else {
        clearInterval(countdownTimer);
      }
    }, 1000);

    const closeBtn = welcomeModal.querySelector("#closeWelcomeBtn");
    if (closeBtn) {
      closeBtn.onclick = () => {
        clearTimeout(autoCloseTimer);
        clearInterval(countdownTimer);
        welcomeModal.remove();
      };
    }

    welcomeModal.onclick = (e) => {
      if (e.target === welcomeModal) {
        clearTimeout(autoCloseTimer);
        clearInterval(countdownTimer);
        welcomeModal.remove();
      }
    };

    localStorage.setItem("palette_visited", "true");
  }, 500);
}

// 启动应用
export async function bootstrap() {
  // 检测 file:// 协议
  if (location.protocol === "file:") {
    const warning = document.getElementById("fileProtocolWarning");
    if (warning) warning.classList.add("show");
  }

  // 加载颜色名称
  await loadColorNames();

  // 初始化格式化函数
  initFormatFunctions();

  // 从存储加载数据
  const savedData = loadFromStorage();
  if (savedData) {
    if (savedData.groups && savedData.groups.length > 0) {
      setGroups(savedData.groups);
      setColors(savedData.colors);
      setNextColorId(
        savedData.nextColorId ||
          Math.max(
            ...savedData.colors.map((c) => parseInt(c.id.replace("c", ""))),
            4
          ) + 1
      );
      setNextGroupId(
        savedData.nextGroupId ||
          Math.max(
            ...savedData.groups.map(
              (g) => parseInt(g.id.replace("g", "")) || 1
            ),
            1
          ) + 1
      );
      setActiveGroupId(
        savedData.activeGroupId &&
          getGroups().find((g) => g.id === savedData.activeGroupId)
          ? savedData.activeGroupId
          : getGroups()[0].id
      );
      setCurrentFormat(savedData.currentFormat || "hex");
      if (
        savedData.selectedColorId &&
        getColors().some((c) => c.id === savedData.selectedColorId)
      ) {
        setSelectedColorId(savedData.selectedColorId);
      }
    }
  }

  // 加载历史记录
  loadHistory();
  renderHistoryPanel();

  // 如果没有选中色块，自动选中第一个
  if (!getSelectedColorId() && getColors().length > 0) {
    let groupColors = getColors().filter(
      (c) => c.groupId === getActiveGroupId()
    );
    if (groupColors.length === 0 && getGroups().length > 0) {
      const anyColor = getColors()[0];
      setActiveGroupId(anyColor.groupId);
      groupColors = getColors().filter((c) => c.groupId === getActiveGroupId());
    }
    groupColors.sort((a, b) => a.order - b.order);
    if (groupColors.length > 0) {
      setSelectedColorId(groupColors[0].id);
      const firstColor = groupColors[0];
      document.documentElement.style.setProperty(
        "--active-color",
        firstColor.hex
      );
      const brightness = getBrightness(firstColor.hex);
      document.documentElement.style.setProperty(
        "--text-color",
        brightness >= 50 ? "#000" : "#fff"
      );
    }
  }

  // 初始化各个模块
  initTheme();
  initCvdSimulation();
  initPlayer();
  initEventListeners();
  initDragAndDrop(() => renderAll());
  initKeyboardShortcuts(() => renderAll());

  // 初始化 Worker（延迟）
  setTimeout(() => {
    initColorWorker();
  }, 1000);

  // 初始化吸管工具
  initEyeDropper((hex, name) => {
    const activeGroupId = getActiveGroupId();
    const exists = getColors().some(
      (c) => c.groupId === activeGroupId && c.hex === hex
    );
    if (exists) {
      showToast(`当前分组已有颜色 ${hex}，未重复添加`);
      return;
    }
    addColor(name, hex, activeGroupId);
    addToHistory(hex, name);
    renderAll();
    showToast(`✅ 已添加「${name}」到当前分组`);
  });

  // 渲染界面
  renderAll();

  // 显示欢迎弹窗
  showWelcomeModal();

  // 同步全局渲染函数
  window.renderAll = renderAll;

  // 注册全局状态查询函数供 player 使用
  window.getActiveColorState = () => {
    return !!getSelectedColorId() && !getIsMultiSelectMode();
  };

  // 确保按钮样式正确同步（额外调用一次）
  setTimeout(() => {
    syncDynamicButtons();
  }, 100);
}

// 导出 getConfirmCallback 供 modal 使用
export { getConfirmCallback };
