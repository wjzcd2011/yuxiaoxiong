import { getDom } from './dom.js';
import { getState, addColor, updateColor, deleteGroup, setActiveGroupId, setSelectedColorId, setCurrentFormat, setActiveSchemeTab } from './store.js';
import { getColorName, copyText, showToast, formatColorByType, generateTintShade, shadeLevels, setCurrentFormat as setColorUtilsFormat } from './colorUtils.js';

let editColorId = null;
let confirmCallback = null;
let shadeExportColorName = '';
let shadeExportMap = {};
let shadeExportFmt = 'css';

// ---------- 新增：自动命名相关变量 ----------
let nameManuallyEdited = false;   // 用户是否手动编辑过名称
let isAutoFilling = false;        // 是否正在自动填充中（用于避免触发手动编辑标志）

export function openColorModal(editId = null) {
    editColorId = editId;
    const dom = getDom();
    const { groups, activeGroupId } = getState();
    dom.modalGroupSelect.innerHTML = groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('');

    // 重置手动编辑标志（每次打开模态框都重置）
    nameManuallyEdited = false;

    if (editId) {
        const c = getState().colors.find(x => x.id === editId);
        dom.modalTitle.innerHTML = `<i class="fas fa-edit"></i> 编辑色块`;
        dom.colorName.value = c.name || '';
        dom.colorPicker.value = c.hex;
        dom.colorHex.value = c.hex;
        dom.modalGroupSelect.value = c.groupId;
    } else {
        dom.modalTitle.innerHTML = `<i class="fas fa-palette"></i> 添加色块`;
        dom.colorName.value = '';
        dom.colorPicker.value = '#3b82f6';
        dom.colorHex.value = '#3b82f6';
        dom.modalGroupSelect.value = activeGroupId;
    }
    dom.colorModal.style.display = 'flex';
}

export function confirmOperate(msg, cb) {
    const dom = getDom();
    dom.confirmMessage.innerText = msg;
    dom.confirmModal.style.display = 'flex';
    confirmCallback = cb;
}

// ---------- 新增：根据色值自动填充名称的函数（仅当用户未手动编辑时执行） ----------
function autoFillColorName(hex) {
    if (nameManuallyEdited) return;      // 用户已手动编辑过，不再自动覆盖
    const info = getColorName(hex);
    if (info && info.n) {
        const dom = getDom();
        // 临时标记为自动填充，避免触发 input 事件中的手动编辑标志
        isAutoFilling = true;
        dom.colorName.value = info.n;
        isAutoFilling = false;
        // 可选：给出提示（降低打扰，可不加）
        // showToast(`🎨 自动命名：${info.n}`, 800);
    }
}

function generateShadeCode(name, map, fmt) {
    const safe = name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '-').toLowerCase();
    const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    if (fmt === 'css') return `:root {\n` + levels.map(l => `  --color-${safe}-${l}: ${map[l]};`).join('\n') + '\n}';
    if (fmt === 'tailwind') return `'${safe}': {\n` + levels.map(l => `  ${l}: '${map[l]}',`).join('\n') + '\n},';
    return `$${safe}: (\n` + levels.map(l => `  ${l}: ${map[l]},`).join('\n') + '\n);';
}

export function openShadeExportModal(colorObj, map) {
    shadeExportColorName = colorObj.name;
    shadeExportMap = map;
    shadeExportFmt = 'css';
    const dom = getDom();
    dom.shadeExportCode.textContent = generateShadeCode(shadeExportColorName, map, 'css');
    dom.shadeExportModal.style.display = 'flex';
}

export function bindModalButtons() {
    const dom = getDom();

    // ---------- 监听名称输入框的手动编辑事件 ----------
    dom.colorName.addEventListener('input', () => {
        if (!isAutoFilling) {
            nameManuallyEdited = true;
        }
    });

    // 色盘选择变化
    dom.colorPicker.oninput = e => {
        const hex = e.target.value;
        dom.colorHex.value = hex;
        // 自动填充名称（如果用户未手动编辑过）
        autoFillColorName(hex);
    };

    // HEX 输入变化
    dom.colorHex.oninput = e => {
        let val = e.target.value.trim();
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            dom.colorPicker.value = val;
            autoFillColorName(val);
        } else {
            // 非合法 HEX 时不自动填充名称，但不清空已有名称
            if (val.length === 0) autoFillColorName(dom.colorPicker.value);
        }
    };

    dom.closeModalBtn.onclick = () => dom.colorModal.style.display = 'none';
    dom.saveColorBtn.onclick = () => {
        let name = dom.colorName.value.trim();
        const hex = dom.colorHex.value.trim();
        const gid = dom.modalGroupSelect.value;
        if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) { showToast('请输入合法HEX色值'); return; }
        if (!name) {
            const info = getColorName(hex);
            name = info.n || `颜色-${hex.slice(1, 7)}`;
        }
        if (editColorId) updateColor(editColorId, { name, hex, groupId: gid });
        else addColor({ name, hex, groupId: gid, order: Date.now() });
        dom.colorModal.style.display = 'none';
        import('./render.js').then(({ renderAll }) => renderAll());
        showToast(editColorId ? `已更新「${name}」` : `已添加「${name}」`);
    };

    dom.confirmOkBtn.onclick = () => { confirmCallback && confirmCallback(); dom.confirmModal.style.display = 'none'; };
    dom.confirmCancelBtn.onclick = () => dom.confirmModal.style.display = 'none';

    dom.helpBtn.onclick = () => dom.helpModal.style.display = 'flex';
    dom.closeHelpBtn.onclick = () => dom.helpModal.style.display = 'none';

    document.querySelectorAll('.shade-export-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.shade-export-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            shadeExportFmt = tab.dataset.fmt;
            dom.shadeExportCode.textContent = generateShadeCode(shadeExportColorName, shadeExportMap, shadeExportFmt);
        };
    });
    dom.copyShadeCodeBtn.onclick = () => copyText(dom.shadeExportCode.textContent);
    dom.closeShadeExportBtn.onclick = () => dom.shadeExportModal.style.display = 'none';
}