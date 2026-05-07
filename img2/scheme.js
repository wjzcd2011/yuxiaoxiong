// 配色推荐面板管理
import { hexToHsl, hslToHex, formatColorByType } from '../utils/colorUtils.js';
import { copyText, showToast } from '../utils/domUtils.js';
import { schemeConfigs } from '../constants.js';
import { getColorById, addColor, getActiveGroupId, getCurrentFormat, getColors } from './colors.js';
import { getColorName } from '../colorNames.js';
import { addToHistory } from './history.js';

let activeSchemeTab = "complementary";

export function getActiveSchemeTab() { return activeSchemeTab; }
export function setActiveSchemeTab(tab) { activeSchemeTab = tab; }

export function renderSchemePanel(selectedColorId, currentFormat, onAddComplete) {
    const wrap = document.getElementById("schemeContent");
    if (!selectedColorId) {
        wrap.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-palette"></i>
                <p>选中色块后<br>查看多种配色方案</p>
            </div>
            <div id="fullPalettePreview" class="full-palette-preview"></div>
        `;
        return;
    }
    const curr = getColorById(selectedColorId);
    if (!curr) return;
    const baseHsl = hexToHsl(curr.hex);
    let tabsHtml = `<div class="scheme-tabs">`;
    let rowsHtml = ``;
    let currentSchemeColors = [];
    
    for (const [key, cfg] of Object.entries(schemeConfigs)) {
        tabsHtml += `<button class="scheme-tab ${activeSchemeTab === key ? 'active' : ''}" data-tab="${key}">${cfg.name}</button>`;
        let swatches = [];
        cfg.offsets.forEach(offset => {
            const hue = (baseHsl.h + offset + 360) % 360;
            swatches.push(hslToHex(hue, baseHsl.s, baseHsl.l));
        });
        if (activeSchemeTab === key) {
            currentSchemeColors = swatches;
        }
        rowsHtml += `
            <div class="scheme-row ${activeSchemeTab === key ? 'active' : ''}" data-row="${key}">
                <div class="scheme-desc">${cfg.desc}</div>
                <div class="scheme-swatches">
                    ${swatches.map(hex => {
                        const name = getColorName(hex);
                        return `
                            <div class="scheme-swatch-card" data-hex="${hex}">
                                <div class="scheme-swatch-color" style="background:${hex}"></div>
                                <div class="scheme-swatch-info">
                                    <div class="scheme-swatch-name">${name.n || "配色色"}</div>
                                    <div class="scheme-swatch-hex">${hex}</div>
                                </div>
                                <button class="scheme-add-btn"><i class="fas fa-plus"></i> 添加</button>
                            </div>
                        `;
                    }).join("")}
                </div>
            </div>
        `;
    }
    tabsHtml += `</div>`;
    wrap.innerHTML = `
        <div class="scheme-base-indicator">
            <div class="scheme-base-swatch" style="background:${curr.hex}"></div>
            <div class="scheme-base-text">基于主色：<span class="scheme-base-name">${curr.name || "未命名"} ${curr.hex}</span></div>
        </div>
        ${tabsHtml}
        ${rowsHtml}
        <div id="fullPalettePreview" class="full-palette-preview"></div>
    `;
    
    renderFullPalettePreview(currentSchemeColors, currentFormat);
    
    document.querySelectorAll(".scheme-tab").forEach(tab => {
        tab.onclick = () => {
            activeSchemeTab = tab.dataset.tab;
            if (onAddComplete) onAddComplete();
        };
    });
    
    document.querySelectorAll(".scheme-add-btn").forEach(btn => {
        btn.onclick = e => {
            e.stopPropagation();
            const card = btn.closest(".scheme-swatch-card");
            const hex = card.dataset.hex;
            const colorInfo = getColorName(hex);
            const activeGroupId = getActiveGroupId();
            const colors = getColors();
            const exists = colors.some(c => c.groupId === activeGroupId && c.hex.toLowerCase() === hex.toLowerCase());
            if (exists) {
                showToast(`当前分组已有颜色 ${hex}，未重复添加`);
                return;
            }
            addColor(colorInfo.n || "配色衍生色", hex, activeGroupId);
            addToHistory(hex, colorInfo.n || '配色色');
            if (onAddComplete) onAddComplete();
            showToast(`已添加${colorInfo.n || "配色颜色"}`);
        };
    });
    
    document.querySelectorAll(".scheme-swatch-card").forEach(card => {
        card.onclick = e => {
            if (e.target.closest(".scheme-add-btn")) return;
            copyText(formatColorByType(card.dataset.hex, currentFormat));
        };
    });
}

function renderFullPalettePreview(schemeColors, currentFormat) {
    const previewWrap = document.getElementById("fullPalettePreview");
    const selectedColorId = document.body.dataset.selectedColorId;
    if (!selectedColorId || !schemeColors || schemeColors.length === 0) {
        if (previewWrap) {
            previewWrap.innerHTML = "";
            previewWrap.style.display = "none";
        }
        return;
    }
    const curr = getColorById(selectedColorId);
    if (!curr) return;
    previewWrap.style.display = "flex";
    previewWrap.innerHTML = "";
    const allColors = [curr.hex, ...schemeColors];
    allColors.forEach(color => {
        const strip = document.createElement("div");
        strip.className = "palette-strip";
        strip.style.background = color;
        strip.title = `${getColorName(color).n || "配色"} - ${color}`;
        strip.onclick = (e) => {
            e.stopPropagation();
            copyText(formatColorByType(color, currentFormat));
        };
        previewWrap.appendChild(strip);
    });
}