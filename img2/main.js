import {
  loadFromStorage,
  saveToStorage,
  subscribe,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/store.js";
import { initDomCache } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/dom.js";
import { loadColorNames } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/colorUtils.js";
import { renderAll } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/render.js";
import { registerEventHandlers } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/eventHandlers.js";
import { bindModalButtons } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/modals.js";
import { bindImageModalEvents } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/image.js";

async function bootstrap() {
  await loadColorNames();
  loadFromStorage();
  initDomCache();

  subscribe(() => {
    renderAll();
    saveToStorage();
  });

  registerEventHandlers();
  bindModalButtons();
  bindImageModalEvents();

  renderAll();

  if (location.protocol === "file:") {
    const warning = document.getElementById("fileProtocolWarning");
    if (warning) warning.classList.add("show");
  }

  // ==================== 首次访问欢迎弹窗 ====================
  let hasVisited = localStorage.getItem("palette_visited");
  if (!hasVisited) {
    setTimeout(() => {
      const welcomeModal = document.createElement("div");
      welcomeModal.className = "modal";
      // 初始入场前置样式（透明+缩小+上浮）
      welcomeModal.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.5s ease;
        `;

      welcomeModal.innerHTML = `
          <div class="modal-box" style="
            max-width: 420px; 
            text-align: center;
            scale: 0.8;
            translate: 0 30px;
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
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
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 14px;">
                8秒后自动关闭
            </div>
          </div>
        `;

      document.body.appendChild(welcomeModal);
      const modalBox = welcomeModal.querySelector(".modal-box");

      // 入场动画：遮罩淡入 + 弹窗放大上浮弹入
      requestAnimationFrame(() => {
        welcomeModal.style.opacity = "1";
        modalBox.style.scale = "1";
        modalBox.style.translate = "0 0";
        modalBox.style.opacity = "1";
      });

      // 统一关闭动画方法（手动关闭 / 自动超时关闭 共用）
      function closeWelcomeModal() {
        // 退场动画：遮罩淡出 + 弹窗缩小下沉透明
        welcomeModal.style.opacity = "0";
        modalBox.style.scale = "0.8";
        modalBox.style.translate = "0 30px";
        modalBox.style.opacity = "0";
        // 动画结束再移除DOM，防止突兀
        setTimeout(() => {
          welcomeModal.remove();
        }, 500);
      }

      // 8秒自动关闭
      const autoCloseTimer = setTimeout(() => {
        closeWelcomeModal();
      }, 8000);

      // 按钮关闭
      const closeBtn = welcomeModal.querySelector("#closeWelcomeBtn");
      closeBtn.onclick = () => {
        clearTimeout(autoCloseTimer);
        closeWelcomeModal();
      };

      // 点击遮罩关闭
      welcomeModal.onclick = (e) => {
        if (e.target === welcomeModal) {
          clearTimeout(autoCloseTimer);
          closeWelcomeModal();
        }
      };

      localStorage.setItem("palette_visited", "true");
    }, 500);
  }
}

bootstrap();
