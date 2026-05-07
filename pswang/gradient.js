// 渐变面板管理
import {
  hexToHsl,
  hslToHex,
  interpolateColor,
  generateTintShade,
  calcContrastRatio,
  getWcagLevel,
  formatColorByType,
  toPinyinSlug,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/pswang/colorUtils.js";
import {
  copyText,
  showToast,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/pswang/domUtils.js";
import {
  shadeLevels,
  formatList,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/pswang/constants.js";
import {
  getCurrentFormat,
  setCurrentFormat,
  getColorById,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/pswang/colors.js";
import { getColorName } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/pswang/colorNames.js";

let currentGradientBaseColor = null;
let gradientResizeHandler = null;
let tooltipElement = null;

// 创建或获取 tooltip 元素
function getTooltip() {
  if (!tooltipElement) {
    tooltipElement = document.createElement("div");
    tooltipElement.id = "gradient-tooltip";
    tooltipElement.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(12px);
            color: #fff;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-family: 'DM Mono', monospace;
            pointer-events: none;
            z-index: 10000;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.15);
            transition: opacity 0.15s ease;
            opacity: 0;
        `;
    document.body.appendChild(tooltipElement);
  }
  return tooltipElement;
}

// 显示 tooltip
function showTooltip(x, y, html) {
  const tooltip = getTooltip();
  tooltip.innerHTML = html;
  tooltip.style.opacity = "1";

  // 计算位置，防止超出屏幕
  let left = x + 15;
  let top = y - 30;

  const rect = tooltip.getBoundingClientRect();
  if (left + rect.width > window.innerWidth - 10) {
    left = x - rect.width - 15;
  }
  if (top < 10) {
    top = y + 20;
  }
  if (top + rect.height > window.innerHeight - 10) {
    top = y - rect.height - 10;
  }

  tooltip.style.left = left + "px";
  tooltip.style.top = top + "px";
}

// 隐藏 tooltip
function hideTooltip() {
  const tooltip = getTooltip();
  tooltip.style.opacity = "0";
}

// 导出色阶代码 - 使用拼音名称
function generateShadeCode(colorName, map, fmt) {
  const pinyinName = toPinyinSlug(colorName || "color");
  const safeName = pinyinName.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
  const finalName = safeName || "color";
  const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  if (fmt === "css") {
    return (
      `:root {\n` +
      levels
        .map((lv) => `  --color-${finalName}-${lv}: ${map[lv]};`)
        .join("\n") +
      "\n}"
    );
  } else if (fmt === "tailwind") {
    const entries = levels
      .map((lv, idx) => {
        const comma = idx === levels.length - 1 ? "" : ",";
        return `  ${lv}: '${map[lv]}'${comma}`;
      })
      .join("\n");
    return `'${finalName}': {\n${entries}\n},`;
  } else if (fmt === "scss") {
    return (
      `$${finalName}: (\n` +
      levels.map((lv) => `  ${lv}: ${map[lv]},`).join("\n") +
      "\n);"
    );
  }
  return "";
}

// 根据 hex 获取颜色名称（拼音格式用于CSS变量展示）
function getColorNameForHex(hex) {
  if (!hex) return null;
  const colorInfo = getColorName(hex);
  if (colorInfo && colorInfo.n) {
    return toPinyinSlug(colorInfo.n);
  }
  return hex.replace("#", "").toLowerCase();
}

export function renderGradientPanel(
  selectedColorId,
  currentFormat,
  onFormatChange,
  onShadeExport
) {
  const wrap = document.getElementById("gradientContent");
  if (!selectedColorId) {
    wrap.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-wand-magic-sparkles"></i>
                <p>选中任意色块<br>自动启用色彩工具集</p>
            </div>
        `;
    return;
  }
  const currColor = getColorById(selectedColorId);
  if (!currColor) return;
  const baseHex = currColor.hex;
  const baseHsl = hexToHsl(baseHex);
  const complementHex = hslToHex((baseHsl.h + 180) % 360, baseHsl.s, baseHsl.l);

  const gradientHtml = `
        <div class="gradient-area" id="gradientCanvasArea" style="position: relative;">
            <canvas id="gradientCanvas" class="gradient-canvas" width="800" height="72"></canvas>
        </div>
    `;
  const ratioWhite = calcContrastRatio(baseHex, "#ffffff");
  const ratioBlack = calcContrastRatio(baseHex, "#000000");
  const wLevel = getWcagLevel(ratioWhite);
  const bLevel = getWcagLevel(ratioBlack);
  const shadeMap = generateTintShade(baseHex);
  let shadeHtml = `<div class="shade-row">`;
  shadeLevels.forEach((lv) => {
    shadeHtml += `
            <div class="shade-swatch" style="background:${shadeMap[lv]}"
                 data-hex="${shadeMap[lv]}" data-lv="${lv}">
            </div>
        `;
  });
  shadeHtml += `</div>`;

  wrap.innerHTML = `
        ${gradientHtml}
        <div class="color-readout">
            <div class="readout-swatch" id="readoutSwatch" style="background:${baseHex}"></div>
            <div class="readout-info">
                <div class="readout-label">当前悬停颜色 (CSS变量名)</div>
                <div class="readout-value" id="currentColorValue" style="font-family: monospace; font-size: 13px;">--color-${getColorNameForHex(
    baseHex
  )}: ${baseHex};</div>
            </div>
            <div class="format-wrap">
                <select class="format-select" id="formatSelect">
                    ${formatList
      .map(
        (f) =>
          `<option value="${f.key}" ${currentFormat === f.key ? "selected" : ""
          }>${f.name}</option>`
      )
      .join("")}
                </select>
            </div>
            <button class="copy-readout-btn" id="copyFormatBtn"><i class="fas fa-copy"></i> 复制</button>
        </div>
        <div class="contrast-panel">
            <div class="panel-title" style="margin-bottom:12px">
                <span>WCAG 无障碍对比度</span>
            </div>
            <div class="contrast-row">
                <div class="contrast-card">
                    <div style="font-size:12px;color:var(--text-muted)">白色背景</div>
                    <div class="contrast-value">${ratioWhite.toFixed(
        2
      )} : 1</div>
                    <div>
                        <span class="contrast-tag ${wLevel.aa ? "tag-pass" : "tag-fail"
    }">AA ${wLevel.aa ? "合规" : "不通过"}</span>
                        <span class="contrast-tag ${wLevel.aaa ? "tag-pass" : "tag-warn"
    }">AAA ${wLevel.aaa ? "合规" : "不通过"}</span>
                    </div>
                </div>
                <div class="contrast-card">
                    <div style="font-size:12px;color:var(--text-muted)">黑色背景</div>
                    <div class="contrast-value">${ratioBlack.toFixed(
      2
    )} : 1</div>
                    <div>
                        <span class="contrast-tag ${bLevel.aa ? "tag-pass" : "tag-fail"
    }">AA ${bLevel.aa ? "合规" : "不通过"}</span>
                        <span class="contrast-tag ${bLevel.aaa ? "tag-pass" : "tag-warn"
    }">AAA ${bLevel.aaa ? "合规" : "不通过"}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="shade-panel">
            <div class="panel-title" style="margin-bottom:8px">
                <span>色阶 / Tints & Shades（50~950）</span>
                <div style="display:flex;gap:6px;">
                    <button class="btn btn-ghost btn-sm" id="exportShadeBtn"><i class="fas fa-code"></i> 导出代码</button>
                    <button class="btn btn-ghost btn-sm" id="addAllShadeBtn">一键全部添加</button>
                </div>
            </div>
            ${shadeHtml}
        </div>
    `;

  const canvas = document.getElementById("gradientCanvas");
  const ctx = canvas.getContext("2d");

  function drawGradient() {
    const width = canvas.parentElement.clientWidth;
    canvas.width = width;
    canvas.height = 72;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, baseHex);
    gradient.addColorStop(1, complementHex);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, 72);
  }

  if (gradientResizeHandler) {
    window.removeEventListener("resize", gradientResizeHandler);
  }
  gradientResizeHandler = drawGradient;
  window.addEventListener("resize", gradientResizeHandler);
  drawGradient();

  let currentHoverColor = baseHex;

  function getColorAtPosition(clientX) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    if (x >= 0 && x <= rect.width) {
      const ratio = Math.min(1, Math.max(0, x / rect.width));
      return interpolateColor(baseHex, complementHex, ratio);
    }
    return null;
  }

  // 更新显示区域：显示 CSS 变量格式的颜色名
  function updateReadoutColor(color) {
    if (!color) return;
    currentHoverColor = color;
    const swatch = document.getElementById("readoutSwatch");
    const valueSpan = document.getElementById("currentColorValue");

    if (swatch) swatch.style.backgroundColor = color;

    const colorSlug = getColorNameForHex(color);

    if (valueSpan) {
      valueSpan.innerHTML = `<span style="color: var(--accent);">--color-${colorSlug}</span>: ${color};`;
    }
  }

  // 鼠标移动：更新底部面板 + 显示浮动 tooltip
  canvas.addEventListener("mousemove", (e) => {
    const color = getColorAtPosition(e.clientX);
    if (color) {
      updateReadoutColor(color);

      // 获取颜色名称（用于 tooltip 显示）
      const colorInfo = getColorName(color);
      const chineseName = colorInfo.n || "未知颜色";
      const colorSlug = getColorNameForHex(color);

      // 显示浮动提示框
      showTooltip(
        e.clientX,
        e.clientY,
        `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 24px; height: 24px; border-radius: 6px; background: ${color}; border: 1px solid rgba(255,255,255,0.2);"></div>
                    <div>
                        <div style="font-weight: 600; color: #fff;">${chineseName}</div>
                        <div style="font-size: 10px; color: #aaa; font-family: monospace;">${color}</div>
                        <div style="font-size: 10px; color: var(--accent);">--color-${colorSlug}</div>
                    </div>
                </div>
            `
      );
    }
  });

  // 鼠标离开 canvas 时隐藏 tooltip
  canvas.addEventListener("mouseleave", () => {
    hideTooltip();
  });

  canvas.addEventListener("click", (e) => {
    const color = getColorAtPosition(e.clientX);
    if (color) {
      const colorSlug = getColorNameForHex(color);
      const cssVarLine = `--color-${colorSlug}: ${color};`;
      copyText(cssVarLine);
      showToast(`已复制: ${cssVarLine}`);
    }
  });

  const formatSelect = document.getElementById("formatSelect");
  if (formatSelect) {
    formatSelect.onchange = (e) => {
      const newFormat = e.target.value;
      if (onFormatChange) onFormatChange(newFormat);
      const formatted = formatColorByType(
        currentHoverColor || baseHex,
        newFormat,
        currColor.name
      );
      const valueSpan = document.getElementById("currentColorValue");
      if (valueSpan && newFormat === "css") {
        const colorSlug = getColorNameForHex(currentHoverColor || baseHex);
        valueSpan.innerHTML = `<span style="color: var(--accent);">--color-${colorSlug}</span>: ${currentHoverColor || baseHex
          };`;
      } else if (valueSpan) {
        valueSpan.textContent = formatted;
      }
    };
  }

  const copyBtn = document.getElementById("copyFormatBtn");
  if (copyBtn) {
    copyBtn.onclick = () => {
      const currentFormatValue = getCurrentFormat();
      if (currentFormatValue === "css") {
        const colorSlug = getColorNameForHex(currentHoverColor);
        const cssVarLine = `--color-${colorSlug}: ${currentHoverColor};`;
        copyText(cssVarLine);
        showToast(`已复制: ${cssVarLine}`);
      } else {
        copyText(
          formatColorByType(
            currentHoverColor,
            currentFormatValue,
            currColor.name
          )
        );
      }
    };
  }

  document.querySelectorAll(".shade-swatch").forEach((el) => {
    el.onclick = () => {
      const hex = el.dataset.hex;
      const currentFormatValue = getCurrentFormat();
      if (currentFormatValue === "css") {
        const colorSlug = getColorNameForHex(hex);
        copyText(`--color-${colorSlug}: ${hex};`);
      } else {
        copyText(formatColorByType(hex, currentFormatValue, currColor.name));
      }
    };

    // 色阶色块也支持 hover 提示
    el.addEventListener("mousemove", (e) => {
      const hex = el.dataset.hex;
      const colorInfo = getColorName(hex);
      const chineseName = colorInfo.n || "未知颜色";
      const colorSlug = getColorNameForHex(hex);
      showTooltip(
        e.clientX,
        e.clientY,
        `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 24px; height: 24px; border-radius: 6px; background: ${hex}; border: 1px solid rgba(255,255,255,0.2);"></div>
                    <div>
                        <div style="font-weight: 600; color: #fff;">${chineseName}</div>
                        <div style="font-size: 10px; color: #aaa; font-family: monospace;">${hex}</div>
                        <div style="font-size: 10px; color: var(--accent);">--color-${colorSlug}</div>
                    </div>
                </div>
            `
      );
    });
    el.addEventListener("mouseleave", hideTooltip);
  });

  // 一键添加所有色阶
  const addAllBtn = document.getElementById("addAllShadeBtn");
  if (addAllBtn) {
    addAllBtn.onclick = () => {
      if (typeof window.addAllShades === "function") {
        window.addAllShades(shadeMap, currColor);
      } else {
        console.error("addAllShades 函数未定义");
        showToast("批量添加功能暂时不可用");
      }
    };
  }

  // 导出代码按钮
  const exportBtn = document.getElementById("exportShadeBtn");
  if (exportBtn && onShadeExport) {
    exportBtn.onclick = () => {
      onShadeExport(currColor, shadeMap);
    };
  }
}

export function cleanupGradientResize() {
  if (gradientResizeHandler) {
    window.removeEventListener("resize", gradientResizeHandler);
    gradientResizeHandler = null;
  }
  if (tooltipElement) {
    tooltipElement.remove();
    tooltipElement = null;
  }
}
