// 图片取色功能（含 Worker 版本）
import { rgbToHex, hexToHsl } from "../utils/colorUtils.js";
import { showToast } from "../utils/domUtils.js";
import { addColor, getActiveGroupId } from "./colors.js";
import { getColorName } from "../colorNames.js";
import { addToHistory } from "./history.js";

let extractedColorsData = [];
let selectedExtractedIndices = new Set();
let currentImageDataUrl = null;
let colorWorker = null;
let isExtracting = false;
let workerTimeoutId = null;

// Worker Blob 代码（内联）
function getWorkerBlob() {
  const workerCode = `
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return { h, s: s * 100, l: l * 100 };
}

function medianCut(pixels, numColors) {
    if (pixels.length === 0) return [];
    if (numColors <= 0) return [];
    let buckets = [pixels.slice()];
    while (buckets.length < numColors) {
        let maxRange = -1;
        let maxBucketIndex = 0;
        let bucketsExhausted = true;
        buckets.forEach((bucket, index) => {
            if (bucket.length < 2) return;
            bucketsExhausted = false;
            let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
            bucket.forEach(p => {
                if (p[0] < minR) minR = p[0];
                if (p[0] > maxR) maxR = p[0];
                if (p[1] < minG) minG = p[1];
                if (p[1] > maxG) maxG = p[1];
                if (p[2] < minB) minB = p[2];
                if (p[2] > maxB) maxB = p[2];
            });
            const range = Math.max(maxR - minR, maxG - minG, maxB - minB);
            if (range > maxRange) {
                maxRange = range;
                maxBucketIndex = index;
            }
        });
        if (bucketsExhausted || maxRange <= 0) break;
        const bucket = buckets[maxBucketIndex];
        let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
        bucket.forEach(p => {
            if (p[0] < minR) minR = p[0];
            if (p[0] > maxR) maxR = p[0];
            if (p[1] < minG) minG = p[1];
            if (p[1] > maxG) maxG = p[1];
            if (p[2] < minB) minB = p[2];
            if (p[2] > maxB) maxB = p[2];
        });
        const rRange = maxR - minR;
        const gRange = maxG - minG;
        const bRange = maxB - minB;
        let channel = 0;
        if (gRange >= rRange && gRange >= bRange) channel = 1;
        else if (bRange >= rRange && bRange >= gRange) channel = 2;
        bucket.sort((a, b) => a[channel] - b[channel]);
        const mid = Math.floor(bucket.length / 2);
        if (mid === 0 || mid >= bucket.length) break;
        const bucket1 = bucket.slice(0, mid);
        const bucket2 = bucket.slice(mid);
        buckets.splice(maxBucketIndex, 1, bucket1, bucket2);
    }
    const resultColors = buckets.map(bucket => {
        if (bucket.length === 0) return [0, 0, 0];
        let sumR = 0, sumG = 0, sumB = 0;
        bucket.forEach(p => {
            sumR += p[0];
            sumG += p[1];
            sumB += p[2];
        });
        return [
            Math.round(sumR / bucket.length),
            Math.round(sumG / bucket.length),
            Math.round(sumB / bucket.length)
        ];
    });
    resultColors.sort((a, b) => {
        const ha = hexToHsl(rgbToHex(a[0], a[1], a[2])).h;
        const hb = hexToHsl(rgbToHex(b[0], b[1], b[2])).h;
        return ha - hb;
    });
    return resultColors;
}

function extractPixelsFromImageData(imageData, alphaThreshold = 64) {
    const pixels = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        if (a < alphaThreshold) continue;
        pixels.push([r, g, b]);
    }
    return pixels;
}

function processImageExtraction(payload) {
    const { imageData, numColors } = payload;
    self.postMessage({ type: 'progress', value: 10, message: '正在解析图像数据...' });
    const pixels = extractPixelsFromImageData(imageData, 64);
    if (pixels.length === 0) {
        self.postMessage({ type: 'error', message: '图片中没有有效像素（可能全透明）' });
        return;
    }
    self.postMessage({ type: 'progress', value: 30, message: \`已提取 \${pixels.length} 个有效像素，正在进行颜色聚类...\` });
    const rgbColors = medianCut(pixels, numColors);
    self.postMessage({ type: 'progress', value: 90, message: '正在生成色值...' });
    const hexColors = rgbColors.map(([r, g, b]) => rgbToHex(r, g, b));
    self.postMessage({ type: 'progress', value: 100, message: '提取完成！' });
    self.postMessage({ type: 'result', colors: hexColors, stats: { pixelCount: pixels.length, clusterCount: rgbColors.length } });
}

self.addEventListener('message', (e) => {
    const { type, payload } = e.data;
    if (type === 'extract') {
        processImageExtraction(payload);
    } else if (type === 'cancel') {
        self.postMessage({ type: 'cancelled' });
    }
});
self.postMessage({ type: 'ready' });
    `;
  return new Blob([workerCode], { type: "application/javascript" });
}

export function initColorWorker() {
  if (colorWorker) {
    colorWorker.terminate();
  }
  if (typeof Worker === "undefined") {
    console.warn("[主线程] 当前浏览器不支持 Web Worker");
    return null;
  }
  try {
    const workerBlob = getWorkerBlob();
    const workerURL = URL.createObjectURL(workerBlob);
    colorWorker = new Worker(workerURL);
    colorWorker.addEventListener("message", (e) => {
      const { type, colors, progress, message, error } = e.data;
      if (workerTimeoutId) {
        clearTimeout(workerTimeoutId);
        workerTimeoutId = null;
      }
      if (type === "progress") {
        updateExtractProgress(progress, message);
      } else if (type === "result") {
        isExtracting = false;
        hideExtractLoading();
        handleExtractedColors(colors);
      } else if (type === "error") {
        console.error("[主线程] Worker 返回错误:", error);
        isExtracting = false;
        hideExtractLoading();
        showToast(`提取失败：${error || "未知错误"}`);
      }
    });
    colorWorker.addEventListener("error", (err) => {
      console.error("[主线程] Worker 运行时错误:", err);
      if (workerTimeoutId) clearTimeout(workerTimeoutId);
      isExtracting = false;
      hideExtractLoading();
      showToast("颜色提取服务异常，请刷新页面重试");
    });
  } catch (err) {
    console.error("[主线程] 创建 Worker 失败:", err);
    return null;
  }
  return colorWorker;
}

function updateExtractProgress(percent, message) {
  const grid = document.getElementById("extractedColorsGrid");
  if (grid && percent < 100 && percent > 0) {
    grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:32px;">
                <i class="fas fa-spinner fa-pulse" style="font-size:24px; margin-bottom:12px; display:block;"></i>
                ${message || `处理中 ${percent}%`}
            </div>
        `;
  }
}

function hideExtractLoading() {
  const previewWrap = document.getElementById("imagePreviewWrap");
  if (previewWrap) {
    const progressEl = previewWrap.querySelector(".extract-progress");
    if (progressEl) progressEl.style.display = "none";
  }
}

function handleExtractedColors(hexColors) {
  extractedColorsData = hexColors;
  selectedExtractedIndices = new Set(hexColors.map((_, i) => i));
  renderExtractedColors();
  if (hexColors.length === 0) {
    showToast("未能提取到有效颜色，请尝试其他图片");
  } else {
    showToast(`成功提取 ${hexColors.length} 种主要颜色`);
  }
}

function simpleColorExtraction(imageElement, numColors) {
  const MAX_DIM = 180;
  let sw = imageElement.naturalWidth;
  let sh = imageElement.naturalHeight;
  const scale = Math.min(1, MAX_DIM / Math.max(sw, sh));
  const dw = Math.round(sw * scale);
  const dh = Math.round(sh * scale);
  const canvas = document.createElement("canvas");
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imageElement, 0, 0, dw, dh);
  const imageData = ctx.getImageData(0, 0, dw, dh);
  const pixels = [];
  const step = 4;
  for (let i = 0; i < imageData.data.length; i += 4 * step) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    if (a < 64) continue;
    pixels.push([r, g, b]);
  }
  if (pixels.length === 0) return [];
  const colorMap = new Map();
  pixels.forEach((pixel) => {
    const [r, g, b] = pixel;
    const hex = rgbToHex(r, g, b);
    const hsl = hexToHsl(hex);
    const hueGroup = Math.floor(hsl.h / (360 / numColors));
    if (!colorMap.has(hueGroup)) {
      colorMap.set(hueGroup, { sum: [0, 0, 0], count: 0 });
    }
    const entry = colorMap.get(hueGroup);
    entry.sum[0] += r;
    entry.sum[1] += g;
    entry.sum[2] += b;
    entry.count++;
  });
  const colors = Array.from(colorMap.values()).map((entry) => ({
    r: Math.round(entry.sum[0] / entry.count),
    g: Math.round(entry.sum[1] / entry.count),
    b: Math.round(entry.sum[2] / entry.count),
  }));
  colors.sort((a, b) => {
    const sa = Math.max(a.r, a.g, a.b) - Math.min(a.r, a.g, a.b);
    const sb = Math.max(b.r, b.g, b.b) - Math.min(b.r, b.g, b.b);
    return sb - sa;
  });
  return colors.slice(0, numColors).map((c) => rgbToHex(c.r, c.g, c.b));
}

export function processUploadedImage(imageElement, numColors) {
  const MAX_DIM = 360;
  let sw = imageElement.naturalWidth;
  let sh = imageElement.naturalHeight;
  const scale = Math.min(1, MAX_DIM / Math.max(sw, sh));
  const dw = Math.round(sw * scale);
  const dh = Math.round(sh * scale);
  const canvas = document.createElement("canvas");
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imageElement, 0, 0, dw, dh);
  const imageData = ctx.getImageData(0, 0, dw, dh);

  if (colorWorker && typeof Worker !== "undefined") {
    isExtracting = true;
    if (workerTimeoutId) clearTimeout(workerTimeoutId);
    workerTimeoutId = setTimeout(() => {
      if (isExtracting) {
        console.warn("[主线程] Worker 提取超时，切换到降级方案");
        isExtracting = false;
        const fallbackColors = simpleColorExtraction(imageElement, numColors);
        handleExtractedColors(fallbackColors);
        showToast("使用兼容模式完成提取", 2000);
      }
    }, 15000);

    const grid = document.getElementById("extractedColorsGrid");
    if (grid) {
      grid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:32px;">
                    <i class="fas fa-spinner fa-pulse" style="font-size:24px; margin-bottom:12px; display:block;"></i>
                    正在分析图片颜色...<br>
                    <span style="font-size:12px;">使用智能算法提取主要色值</span>
                </div>
            `;
    }
    colorWorker.postMessage({
      type: "extract",
      payload: {
        imageData: { width: dw, height: dh, data: Array.from(imageData.data) },
        numColors: numColors,
      },
    });
  } else {
    console.warn("[主线程] Worker 不可用，使用主线程降级方案");
    showToast("使用兼容模式提取颜色...", 1500);
    setTimeout(() => {
      const hexColors = simpleColorExtraction(imageElement, numColors);
      handleExtractedColors(hexColors);
    }, 50);
  }
}

export function loadImageFromFile(file, onImageLoad) {
  if (!file || !file.type.startsWith("image/")) {
    showToast("请选择有效的图片文件");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    currentImageDataUrl = dataUrl;
    const img = document.getElementById("imagePreviewImg");
    const noText = document.getElementById("noImageText");
    img.src = dataUrl;
    img.style.display = "block";
    if (noText) noText.style.display = "none";
    img.onload = function () {
      if (onImageLoad) onImageLoad(img);
    };
    img.onerror = function () {
      showToast("图片加载失败，请重试");
    };
  };
  reader.readAsDataURL(file);
}

export function renderExtractedColors() {
  const grid = document.getElementById("extractedColorsGrid");
  const countText = document.getElementById("selectedCountText");
  if (extractedColorsData.length === 0) {
    grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; color:var(--text-muted); font-size:13px; padding:24px;">
                <i class="fas fa-arrow-up"></i> 请先上传图片
            </div>`;
    if (countText) countText.textContent = "已选 0 色";
    return;
  }
  grid.innerHTML = "";
  extractedColorsData.forEach((hex, index) => {
    const colorInfo = getColorName(hex);
    const name = colorInfo.n || `提取色-${index + 1}`;
    const chip = document.createElement("div");
    chip.className = `extracted-color-chip ${
      selectedExtractedIndices.has(index) ? "selected" : ""
    }`;
    chip.innerHTML = `
            <div class="chip-preview" style="background:${hex};"></div>
            <div class="chip-hex">${hex}</div>
            <div class="chip-name" title="${name}">${name}</div>
        `;
    chip.addEventListener("click", () => {
      if (selectedExtractedIndices.has(index)) {
        selectedExtractedIndices.delete(index);
      } else {
        selectedExtractedIndices.add(index);
      }
      renderExtractedColors();
    });
    grid.appendChild(chip);
  });
  if (countText)
    countText.textContent = `已选 ${selectedExtractedIndices.size} 色`;
}

export function getSelectedExtractedColors() {
  const selected = [];
  selectedExtractedIndices.forEach((index) => {
    if (extractedColorsData[index]) selected.push(extractedColorsData[index]);
  });
  return selected;
}

export function addSelectedExtractedColorsToPalette(onComplete) {
  if (extractedColorsData.length === 0) {
    showToast("没有可添加的颜色，请先上传图片");
    return false;
  }
  if (selectedExtractedIndices.size === 0) {
    showToast("请至少选择一个颜色");
    return false;
  }
  const activeGroupId = getActiveGroupId();
  let addedCount = 0;
  selectedExtractedIndices.forEach((index) => {
    const hex = extractedColorsData[index];
    const colorInfo = getColorName(hex);
    const name = colorInfo.n || `提取色-${index + 1}`;
    addColor(name, hex, activeGroupId);
    addToHistory(hex, name);
    addedCount++;
  });
  if (onComplete) onComplete();
  showToast(`已添加 ${addedCount} 个颜色到当前分组`);
  return true;
}

export function openImagePickModal() {
  const modal = document.getElementById("imagePickModal");
  if (modal) modal.style.display = "flex";
}

export function closeImagePickModal() {
  const modal = document.getElementById("imagePickModal");
  if (modal) modal.style.display = "none";
}

export function resetExtractedData() {
  extractedColorsData = [];
  selectedExtractedIndices.clear();
  currentImageDataUrl = null;
}
// 全选所有提取的颜色
window.selectAllExtractedColors = function () {
  selectedExtractedIndices.clear();
  extractedColorsData.forEach((_, index) => {
    selectedExtractedIndices.add(index);
  });
  renderExtractedColors();
  // 更新计数显示
  const countText = document.getElementById("selectedCountText");
  if (countText)
    countText.textContent = `已选 ${selectedExtractedIndices.size} 色`;
};

// 取消全选所有提取的颜色
window.deselectAllExtractedColors = function () {
  selectedExtractedIndices.clear();
  renderExtractedColors();
  // 更新计数显示
  const countText = document.getElementById("selectedCountText");
  if (countText)
    countText.textContent = `已选 ${selectedExtractedIndices.size} 色`;
};
