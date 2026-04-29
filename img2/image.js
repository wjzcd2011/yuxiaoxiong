import { getDom } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/dom.js";
import {
  getState,
  setExtractedColorsData,
  setSelectedExtractedIndices,
  setCurrentImageDataUrl,
  addColor,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/store.js";
import { extractColorsFromImage } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/algorithm.js";
import {
  getColorName,
  showToast,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/colorUtils.js";

function renderExtractedColors() {
  const dom = getDom();
  const { extractedColorsData, selectedExtractedIndices } = getState();
  if (extractedColorsData.length === 0) {
    dom.extractedColorsGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:24px;"><i class="fas fa-arrow-up"></i> 请先上传图片</div>`;
    dom.selectedCountText.textContent = "已选 0 色";
    return;
  }
  dom.extractedColorsGrid.innerHTML = "";
  extractedColorsData.forEach((hex, idx) => {
    const name = getColorName(hex).n || `提取色-${idx + 1}`;
    const chip = document.createElement("div");
    chip.className = `extracted-color-chip ${
      selectedExtractedIndices.has(idx) ? "selected" : ""
    }`;
    chip.innerHTML = `<div class="chip-preview" style="background:${hex}"></div><div class="chip-hex">${hex}</div><div class="chip-name">${name}</div>`;
    chip.onclick = () => {
      const newSet = new Set(selectedExtractedIndices);
      if (newSet.has(idx)) newSet.delete(idx);
      else newSet.add(idx);
      setSelectedExtractedIndices(newSet);
      renderExtractedColors();
    };
    dom.extractedColorsGrid.appendChild(chip);
  });
  dom.selectedCountText.textContent = `已选 ${selectedExtractedIndices.size} 色`;
}

function processUploadedImage(imgEl) {
  const num = parseInt(getDom().extractCountSlider.value) || 6;
  const colors = extractColorsFromImage(imgEl, num);
  setExtractedColorsData(colors);
  setSelectedExtractedIndices(new Set(colors.map((_, i) => i)));
  renderExtractedColors();
}

export function loadImageFromFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    showToast("请选择有效的图片文件");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const url = e.target.result;
    setCurrentImageDataUrl(url);
    const dom = getDom();
    dom.imagePreviewImg.src = url;
    dom.imagePreviewImg.style.display = "block";
    dom.noImageText.style.display = "none";
    dom.imagePreviewImg.onload = () =>
      processUploadedImage(dom.imagePreviewImg);
  };
  reader.readAsDataURL(file);
}

export function bindImageModalEvents() {
  const dom = getDom();
  dom.imagePickBtn.onclick = () => dom.imagePickFile.click();
  dom.imagePickFile.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dom.imagePickModal.style.display = "flex";
      loadImageFromFile(file);
    }
    e.target.value = "";
  };
  dom.closeImagePickModalBtn.onclick = () =>
    (dom.imagePickModal.style.display = "none");
  dom.extractCountSlider.oninput = () => {
    dom.extractCountBadge.textContent = dom.extractCountSlider.value;
  };
  dom.extractCountSlider.onchange = () => {
    const img = dom.imagePreviewImg;
    if (
      img &&
      img.src &&
      img.style.display !== "none" &&
      img.complete &&
      img.naturalWidth
    )
      processUploadedImage(img);
  };
  dom.reExtractBtn.onclick = () => {
    const img = dom.imagePreviewImg;
    if (
      img &&
      img.src &&
      img.style.display !== "none" &&
      img.complete &&
      img.naturalWidth
    ) {
      processUploadedImage(img);
      showToast("已重新提取");
    } else showToast("请先上传图片");
  };
  dom.selectAllExtractedBtn.onclick = () => {
    const { extractedColorsData } = getState();
    setSelectedExtractedIndices(new Set(extractedColorsData.map((_, i) => i)));
    renderExtractedColors();
  };
  dom.deselectAllExtractedBtn.onclick = () => {
    setSelectedExtractedIndices(new Set());
    renderExtractedColors();
  };
  dom.addExtractedColorsBtn.onclick = () => {
    const { extractedColorsData, selectedExtractedIndices, activeGroupId } =
      getState();
    if (!extractedColorsData.length) {
      showToast("没有可添加的颜色");
      return;
    }
    if (!selectedExtractedIndices.size) {
      showToast("请至少选择一个颜色");
      return;
    }
    selectedExtractedIndices.forEach((idx) => {
      const hex = extractedColorsData[idx];
      const name = getColorName(hex).n || `提取色-${idx + 1}`;
      addColor({ name, hex, groupId: activeGroupId, order: Date.now() + idx });
    });
    dom.imagePickModal.style.display = "none";
    import(
      "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/render.js"
    ).then(({ renderAll }) => renderAll());
    showToast(`已添加 ${selectedExtractedIndices.size} 个颜色`);
  };

  dom.imagePreviewWrap.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dom.imagePreviewWrap.style.borderColor = "rgba(126,184,255,0.5)";
  });
  dom.imagePreviewWrap.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dom.imagePreviewWrap.style.borderColor = "";
  });
  dom.imagePreviewWrap.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dom.imagePreviewWrap.style.borderColor = "";
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) loadImageFromFile(file);
    else showToast("请拖放图片文件");
  });
  document.addEventListener("paste", (e) => {
    if (dom.imagePickModal.style.display !== "flex") return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          loadImageFromFile(file);
          showToast("已粘贴剪贴板图片");
          return;
        }
      }
    }
  });
}
