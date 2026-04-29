import { getDom } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/dom.js";
import {
  getState,
  setMultiSelectMode,
  clearMultiSelected,
  addColor,
  deleteColors,
  setSelectedColorId,
  setActiveGroupId,
  addGroup,
  updateGroup,
  deleteGroup,
  setMultiSelectedIds,
  setPendingImportData,
  applyImport,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/store.js";
import {
  copyText,
  showToast,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/colorUtils.js";
import {
  openColorModal,
  confirmOperate,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/modals.js";

export function registerEventHandlers() {
    const dom = getDom();

    dom.addColorBtn.onclick = () => openColorModal();
    dom.addGroupBtn.onclick = () => { dom.addGroupInputWrap.style.display = 'flex'; dom.newGroupName.focus(); };
    dom.confirmAddGroup.onclick = () => {
        const name = dom.newGroupName.value.trim();
        if (!name) { showToast('请输入分组名称'); return; }
        addGroup({ name });
        dom.newGroupName.value = '';
        dom.addGroupInputWrap.style.display = 'none';
    };
    dom.newGroupName.onkeydown = e => { if (e.key === 'Enter') dom.confirmAddGroup.click(); if (e.key === 'Escape') dom.addGroupInputWrap.style.display = 'none'; };
    dom.searchInput.oninput = () => import('./render.js').then(({ renderColors }) => renderColors());
    dom.sortSelect.onchange = () => import('./render.js').then(({ renderColors }) => renderColors());

    dom.multiSelectBtn.onclick = () => {
        const { isMultiSelectMode } = getState();
        setMultiSelectMode(!isMultiSelectMode);
        clearMultiSelected();
        dom.multiSelectBtn.innerHTML = !isMultiSelectMode ? '<i class="fas fa-times-square"></i> 退出多选' : '<i class="fas fa-check-square"></i> 多选';
        import('./render.js').then(({ renderColors }) => renderColors());
    };
    dom.batchSelectAllBtn.onclick = () => {
        const { colors, activeGroupId } = getState();
        const ids = colors.filter(c => c.groupId === activeGroupId).map(c => c.id);
        setMultiSelectedIds(new Set(ids));
        import('./render.js').then(({ renderColors }) => renderColors());
    };
    dom.batchDeleteBtn.onclick = () => {
        const { multiSelectedIds } = getState();
        if (multiSelectedIds.size === 0) { showToast('请先选择色块'); return; }
        confirmOperate(`确定删除选中的 ${multiSelectedIds.size} 个色块？`, () => {
            deleteColors(multiSelectedIds);
            setMultiSelectMode(false);
            dom.multiSelectBtn.innerHTML = '<i class="fas fa-check-square"></i> 多选';
            import('./render.js').then(({ renderAll }) => renderAll());
            showToast('批量删除完成');
        });
    };
    dom.batchCancelBtn.onclick = () => {
        setMultiSelectMode(false);
        clearMultiSelected();
        dom.multiSelectBtn.innerHTML = '<i class="fas fa-check-square"></i> 多选';
        import('./render.js').then(({ renderColors }) => renderColors());
    };

    dom.exportBtn.onclick = () => {
        const { groups, colors } = getState();
        const blob = new Blob([JSON.stringify({ groups, colors }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = '配色方案_导出.json'; a.click();
        URL.revokeObjectURL(url);
        showToast('导出成功');
    };
    dom.importFile.onchange = async e => {
        const file = e.target.files[0];
        if (!file) return;
        const text = await file.text();
        try {
            const d = JSON.parse(text);
            if (d.groups && d.colors) {
                setPendingImportData(d);
                dom.importModeModal.style.display = 'flex';
            } else showToast('文件格式不正确');
        } catch { showToast('文件格式错误'); }
        e.target.value = '';
    };
    dom.importMergeBtn.onclick = () => { dom.importMergeBtn.classList.add('active'); dom.importReplaceBtn.classList.remove('active'); };
    dom.importReplaceBtn.onclick = () => { dom.importReplaceBtn.classList.add('active'); dom.importMergeBtn.classList.remove('active'); };
    dom.importConfirmBtn.onclick = () => {
        const mode = dom.importMergeBtn.classList.contains('active') ? 'merge' : 'replace';
        applyImport(mode);
        dom.importModeModal.style.display = 'none';
        import('./render.js').then(({ renderAll }) => renderAll());
        showToast(mode === 'merge' ? '合并导入成功' : '覆盖导入成功');
    };
    dom.importCancelBtn.onclick = () => { dom.importModeModal.style.display = 'none'; setPendingImportData(null); };
}
