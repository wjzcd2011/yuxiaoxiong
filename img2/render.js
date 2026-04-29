// js/render.js
import {
  getState,
  setActiveGroupId,
  clearMultiSelected,
  addColor,
  setCurrentFormat,
  setSelectedColorId,
  setMultiSelectedIds,
  addMultiSelectedId,
  removeMultiSelectedId,
  setActiveSchemeTab,
  updateGroup,
  deleteGroup,
  deleteColor,
} from "./store.js";
import { getDom } from "./dom.js";
import {
  getColorName,
  hexToHsl,
  hslToHex,
  calcContrastRatio,
  getWcagLevel,
  generateTintShade,
  formatList,
  shadeLevels,
  schemeConfigs,
  formatColorByType,
  interpolateColor,
  copyText,
  showToast,
} from "./colorUtils.js";
import {
  openShadeExportModal,
  openColorModal,
  confirmOperate,
} from "./modals.js";

let gradientResizeHandler = null;

export function renderGroups() {
  const { groups, colors, activeGroupId } = getState();
  const wrap = getDom().groupList;
  wrap.innerHTML = "";
  groups.forEach((g) => {
    const cnt = colors.filter((c) => c.groupId === g.id).length;
    const item = document.createElement("div");
    item.className = `group-item ${g.id === activeGroupId ? "active" : ""}`;
    item.innerHTML = `
            <span class="group-name-label">${g.name}</span>
            <div style="display:flex;gap:4px;align-items:center">
                <span class="group-count">${cnt}</span>
                <span class="rename-group" data-id="${g.id
      }" title="重命名"><i class="fas fa-pen"></i></span>
                ${g.id !== "default"
        ? `<span class="del-group" data-id="${g.id}"><i class="fas fa-trash-alt"></i></span>`
        : ""
      }
            </div>
        `;
    item.addEventListener("click", (e) => {
      if (e.target.closest(".del-group") || e.target.closest(".rename-group"))
        return;
      setActiveGroupId(g.id);
      clearMultiSelected();
    });
    wrap.appendChild(item);
  });

  document.querySelectorAll(".rename-group").forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      const id = el.dataset.id;
      const groupItem = el.closest(".group-item");
      const label = groupItem.querySelector(".group-name-label");
      const g = getState().groups.find((x) => x.id === id);
      const input = document.createElement("input");
      input.className = "group-rename-input";
      input.value = g.name;
      label.replaceWith(input);
      input.focus();
      input.select();
      const commit = () => {
        const newName = input.value.trim();
        if (newName && newName !== g.name) updateGroup(id, newName);
        renderGroups();
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
      confirmOperate("确定删除该分组及内部所有色块？", () => deleteGroup(id));
    };
  });
}

function makeColorCard(c) {
  const { selectedColorId, isMultiSelectMode, multiSelectedIds } = getState();
  const isSelected = selectedColorId === c.id && !isMultiSelectMode;
  const isMultiSel = multiSelectedIds.has(c.id);
  const card = document.createElement("div");
  card.className = `color-card ${isSelected ? "selected" : ""} ${isMultiSel ? "multi-selected" : ""
    }`;
  card.dataset.id = c.id;
  card.dataset.hex = c.hex;
  card.innerHTML = `
        <div class="color-preview" style="background:${c.hex}"></div>
        <div class="color-info">
            <div class="color-name">${c.name || "未命名颜色"}</div>
            <div class="color-hex">${c.hex}</div>
            <div class="card-actions">
                <button class="copy-btn-sm" data-hex="${c.hex
    }"><i class="fas fa-copy"></i> 复制</button>
                <button class="edit-btn" data-id="${c.id
    }"><i class="fas fa-edit"></i></button>
                <button class="del-btn" data-id="${c.id
    }"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
  card.addEventListener("click", (e) => {
    if (e.target.closest(".card-actions")) return;
    const id = card.dataset.id;
    const {
      isMultiSelectMode: currentMultiMode,
      multiSelectedIds: currentSelected,
    } = getState();
    if (currentMultiMode) {
      if (currentSelected.has(id)) removeMultiSelectedId(id);
      else addMultiSelectedId(id);
      renderColors();
    } else {
      setSelectedColorId(id);
      renderGradientPanel();
      renderSchemePanel();
      const color = getState().colors.find((x) => x.id === id);
      if (color) {
        const info = getColorName(color.hex);
        showToast(
          `✨ 已选中「${info.n || color.name}」，可在下方查看配色方案`,
          2500
        );
      }
    }
  });
  return card;
}

function bindCardButtons() {
  document.querySelectorAll(".copy-btn-sm").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      copyText(btn.dataset.hex);
    };
  });
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      openColorModal(btn.dataset.id);
    };
  });
  document.querySelectorAll(".del-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      confirmOperate("确定删除该色块？", () => deleteColor(btn.dataset.id));
    };
  });
}

export function renderColors() {
  const { colors, activeGroupId, isMultiSelectMode, multiSelectedIds } =
    getState();
  const dom = getDom();
  const searchKey = dom.searchInput.value.toLowerCase().trim();
  const sortVal = dom.sortSelect.value;
  if (isMultiSelectMode) {
    dom.batchBar.classList.add("active");
    dom.batchBarText.textContent = `已选 ${multiSelectedIds.size} 个色块`;
  } else {
    dom.batchBar.classList.remove("active");
  }
  let list = colors.filter((c) => c.groupId === activeGroupId);
  if (searchKey) {
    const matched = colors.filter(
      (c) =>
        c.name.toLowerCase().includes(searchKey) || c.hex.includes(searchKey)
    );
    if (matched.length === 0) {
      dom.colorGrid.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><div>未找到匹配的颜色</div></div>`;
      return;
    }
    dom.colorGrid.innerHTML = "";
    const byGroup = {};
    matched.forEach((c) => {
      if (!byGroup[c.groupId]) byGroup[c.groupId] = [];
      byGroup[c.groupId].push(c);
    });
    Object.entries(byGroup).forEach(([gid, arr]) => {
      const gName = getState().groups.find((g) => g.id === gid)?.name || gid;
      const label = document.createElement("div");
      label.className = "search-group-label";
      label.textContent = gName;
      dom.colorGrid.appendChild(label);
      arr.forEach((c) => dom.colorGrid.appendChild(makeColorCard(c)));
    });
    bindCardButtons();
    return;
  }
  if (sortVal === "hue")
    list.sort((a, b) => hexToHsl(a.hex).h - hexToHsl(b.hex).h);
  else if (sortVal === "lightness")
    list.sort((a, b) => hexToHsl(b.hex).l - hexToHsl(a.hex).l);
  else if (sortVal === "saturation")
    list.sort((a, b) => hexToHsl(b.hex).s - hexToHsl(a.hex).s);
  else list.sort((a, b) => a.order - b.order);
  if (list.length === 0) {
    dom.colorGrid.innerHTML = `<div class="empty-state"><i class="fas fa-palette"></i><div>当前分组暂无色块<br>点击「新建色块」添加</div></div>`;
    return;
  }
  dom.colorGrid.innerHTML = "";
  list.forEach((c) => dom.colorGrid.appendChild(makeColorCard(c)));
  bindCardButtons();
}

export function renderGradientPanel() {
  const { selectedColorId, colors, currentFormat } = getState();
  const dom = getDom();
  const curr = colors.find((c) => c.id === selectedColorId);
  if (!curr) {
    dom.gradientContent.innerHTML = `<div class="placeholder"><i class="fas fa-wand-magic-sparkles"></i><p>选中任意色块<br>自动启用色彩工具集</p></div>`;
    return;
  }
  const baseHex = curr.hex;
  const baseHsl = hexToHsl(baseHex);
  const complementHex = hslToHex((baseHsl.h + 180) % 360, baseHsl.s, baseHsl.l);
  const ratioWhite = calcContrastRatio(baseHex, "#ffffff");
  const ratioBlack = calcContrastRatio(baseHex, "#000000");
  const wl = getWcagLevel(ratioWhite),
    bl = getWcagLevel(ratioBlack);
  const shadeMap = generateTintShade(baseHex);
  let shadeHtml = `<div class="shade-row">`;
  shadeLevels.forEach((lv) => {
    shadeHtml += `<div class="shade-swatch" style="background:${shadeMap[lv]}" data-hex="${shadeMap[lv]}" data-lv="${lv}"></div>`;
  });
  shadeHtml += `</div>`;

  const currentFormatItem =
    formatList.find((f) => f.key === currentFormat) || formatList[0];
  const initialDisplayValue = currentFormatItem.fn(baseHex);

  dom.gradientContent.innerHTML = `
        <div class="gradient-area"><canvas id="gradientCanvas" width="800" height="72"></canvas></div>
        <div class="color-readout">
            <div class="readout-swatch" id="readoutSwatch" style="background:${baseHex}"></div>
            <div class="readout-info"><div class="readout-label">当前选中颜色 (${currentFormatItem.name
    })</div><div class="readout-value" id="currentColorValue">${initialDisplayValue}</div></div>
            <div class="format-wrap"><select class="format-select" id="formatSelect">${formatList
      .map(
        (f) =>
          `<option value="${f.key}" ${currentFormat === f.key ? "selected" : ""
          }>${f.name}</option>`
      )
      .join("")}</select></div>
            <button class="copy-readout-btn" id="copyFormatBtn"><i class="fas fa-copy"></i> 复制</button>
        </div>
        <div class="contrast-panel"><div class="panel-title"><span>WCAG 无障碍对比度</span></div>
            <div class="contrast-row"><div class="contrast-card"><div>白色背景</div><div class="contrast-value">${ratioWhite.toFixed(
        2
      )} : 1</div><div><span class="contrast-tag ${wl.aa ? "tag-pass" : "tag-fail"
    }">AA ${wl.aa ? "合规" : "不通过"}</span><span class="contrast-tag ${wl.aaa ? "tag-pass" : "tag-warn"
    }">AAA ${wl.aaa ? "合规" : "不通过"}</span></div></div>
            <div class="contrast-card"><div>黑色背景</div><div class="contrast-value">${ratioBlack.toFixed(
      2
    )} : 1</div><div><span class="contrast-tag ${bl.aa ? "tag-pass" : "tag-fail"
    }">AA ${bl.aa ? "合规" : "不通过"}</span><span class="contrast-tag ${bl.aaa ? "tag-pass" : "tag-warn"
    }">AAA ${bl.aaa ? "合规" : "不通过"}</span></div></div></div></div>
        <div class="shade-panel"><div class="panel-title"><span>色阶 / Tints & Shades</span><div><button class="btn btn-ghost btn-sm" id="exportShadeBtn">导出代码</button><button class="btn btn-ghost btn-sm" id="addAllShadeBtn">一键全部添加</button></div></div>${shadeHtml}</div>
    `;

  const canvas = document.getElementById("gradientCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (gradientResizeHandler)
    window.removeEventListener("resize", gradientResizeHandler);
  function draw() {
    const w = canvas.parentElement.clientWidth;
    canvas.width = w;
    canvas.height = 72;
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, baseHex);
    grad.addColorStop(1, complementHex);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, 72);
  }
  draw();
  gradientResizeHandler = draw;
  window.addEventListener("resize", gradientResizeHandler);

  let hoverColor = baseHex;

  // 辅助函数：根据当前选中的格式格式化颜色值
  const formatColorByCurrentSelect = (colorHex) => {
    const fmtSelect = document.getElementById("formatSelect");
    const fmtKey = fmtSelect
      ? fmtSelect.value
      : getState().currentFormat || "hex";
    const fmtItem = formatList.find((f) => f.key === fmtKey) || formatList[0];
    return fmtItem.fn(colorHex);
  };

  function updateDisplayColor(color) {
    if (!color) return;
    hoverColor = color;
    const swatch = document.getElementById("readoutSwatch");
    const valueSpan = document.getElementById("currentColorValue");
    if (swatch) swatch.style.backgroundColor = color;
    if (valueSpan) {
      const fmtSelect = document.getElementById("formatSelect");
      const fmtKey = fmtSelect ? fmtSelect.value : currentFormat;
      const fmtItem = formatList.find((f) => f.key === fmtKey) || formatList[0];
      valueSpan.textContent = fmtItem.fn(color);
    }
  }
  function getColorAtX(clientX) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    if (x >= 0 && x <= rect.width)
      return interpolateColor(baseHex, complementHex, x / rect.width);
    return null;
  }
  canvas.addEventListener("mousemove", (e) => {
    const col = getColorAtX(e.clientX);
    if (col) updateDisplayColor(col);
  });
  canvas.addEventListener("mouseleave", () => {
    // 可恢复显示基色（可选，当前未恢复，保留体验）
  });
  canvas.addEventListener("click", (e) => {
    const col = getColorAtX(e.clientX);
    if (col) {
      const formatted = formatColorByCurrentSelect(col);
      copyText(formatted);
    }
  });

  const formatSelect = document.getElementById("formatSelect");
  if (formatSelect) {
    formatSelect.onchange = (e) => {
      const newFmt = e.target.value;
      setCurrentFormat(newFmt);
      const fmtItem = formatList.find((f) => f.key === newFmt) || formatList[0];
      const valueSpan = document.getElementById("currentColorValue");
      if (valueSpan) valueSpan.textContent = fmtItem.fn(hoverColor);
      const labelSpan = document.querySelector(".readout-label");
      if (labelSpan) labelSpan.textContent = `当前选中颜色 (${fmtItem.name})`;
    };
  }
  const copyBtn = document.getElementById("copyFormatBtn");
  if (copyBtn) {
    copyBtn.onclick = () => {
      const formatted = formatColorByCurrentSelect(hoverColor);
      copyText(formatted);
    };
  }

  // 色阶色块复制（同样跟随格式）
  document.querySelectorAll(".shade-swatch").forEach((el) => {
    el.onclick = () => {
      const hex = el.dataset.hex;
      const formatted = formatColorByCurrentSelect(hex);
      copyText(formatted);
    };
  });

  const addAllBtn = document.getElementById("addAllShadeBtn");
  if (addAllBtn) {
    addAllBtn.onclick = () => {
      shadeLevels.forEach((lv) => {
        const hex = shadeMap[lv];
        const info = getColorName(hex);
        addColor({
          name: info.n ? `${curr.name}-${lv}(${info.n})` : `${curr.name}-${lv}`,
          hex,
          groupId: getState().activeGroupId,
          order: Date.now() + lv,
        });
      });
    };
  }
  const exportBtn = document.getElementById("exportShadeBtn");
  if (exportBtn) exportBtn.onclick = () => openShadeExportModal(curr, shadeMap);
}

export function renderSchemePanel() {
  const { selectedColorId, colors, activeSchemeTab } = getState();
  const dom = getDom();
  const curr = colors.find((c) => c.id === selectedColorId);
  if (!curr) {
    dom.schemeContent.innerHTML = `<div class="placeholder"><i class="fas fa-palette"></i><p>选中色块后<br>查看多种配色方案</p></div><div id="fullPalettePreview"></div>`;
    return;
  }
  const baseHsl = hexToHsl(curr.hex);
  let tabs = `<div class="scheme-tabs">`,
    rows = "",
    currentSchemeColors = [];
  for (const [key, cfg] of Object.entries(schemeConfigs)) {
    tabs += `<button class="scheme-tab ${activeSchemeTab === key ? "active" : ""
      }" data-tab="${key}">${cfg.name}</button>`;
    const swatches = cfg.offsets.map((off) =>
      hslToHex((baseHsl.h + off + 360) % 360, baseHsl.s, baseHsl.l)
    );
    if (activeSchemeTab === key) currentSchemeColors = swatches;
    rows += `<div class="scheme-row ${activeSchemeTab === key ? "active" : ""
      }" data-row="${key}"><div class="scheme-desc">${cfg.desc
      }</div><div class="scheme-swatches">${swatches
        .map((hex) => {
          const name = getColorName(hex);
          return `<div class="scheme-swatch-card" data-hex="${hex}"><div class="scheme-swatch-color" style="background:${hex}"></div><div class="scheme-swatch-info"><div class="scheme-swatch-name">${name.n || "配色色"
            }</div><div class="scheme-swatch-hex">${hex}</div></div><button class="scheme-add-btn"><i class="fas fa-plus"></i> 添加</button></div>`;
        })
        .join("")}</div></div>`;
  }
  tabs += `</div>`;
  dom.schemeContent.innerHTML = `<div class="scheme-base-indicator"><div class="scheme-base-swatch" style="background:${curr.hex
    }"></div><div class="scheme-base-text">基于主色：<span class="scheme-base-name">${curr.name || "未命名"
    } ${curr.hex
    }</span></div></div>${tabs}${rows}<div id="fullPalettePreview" class="full-palette-preview"></div>`;

  document.querySelectorAll(".scheme-tab").forEach((tab) => {
    tab.onclick = (e) => {
      const key = e.currentTarget.dataset.tab;
      setActiveSchemeTab(key);
      renderSchemePanel();
    };
  });
  document.querySelectorAll(".scheme-swatch-card").forEach((card) => {
    const addBtn = card.querySelector(".scheme-add-btn");
    if (addBtn) {
      addBtn.onclick = (e) => {
        e.stopPropagation();
        const hex = card.dataset.hex;
        const name = getColorName(hex).n || "配色衍生色";
        addColor({
          name,
          hex,
          groupId: getState().activeGroupId,
          order: Date.now(),
        });
        showToast(`已添加${name}`);
      };
    }
    card.onclick = (e) => {
      if (e.target.closest(".scheme-add-btn")) return;
      copyText(card.dataset.hex);
    };
  });
  const preview = document.getElementById("fullPalettePreview");
  if (preview && currentSchemeColors.length) {
    preview.style.display = "flex";
    preview.innerHTML = "";
    [curr.hex, ...currentSchemeColors].forEach((c) => {
      const strip = document.createElement("div");
      strip.className = "palette-strip";
      strip.style.background = c;
      strip.onclick = () => copyText(c);
      preview.appendChild(strip);
    });
  }
}

export function renderAll() {
  renderGroups();
  renderColors();
  renderGradientPanel();
  renderSchemePanel();
}
