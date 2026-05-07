// 屏幕取色器功能
import { showToast } from '../utils/domUtils.js';
import { addColor, getActiveGroupId } from './colors.js';
import { addToHistory } from './history.js';
import { getColorName } from '../colorNames.js';

export async function initEyeDropper(onColorAdded) {
    const eyeBtn = document.getElementById('eyeDropperBtn');
    if (!eyeBtn) return;

    const supportsEyeDropper = 'EyeDropper' in window;
    if (!supportsEyeDropper) {
        eyeBtn.disabled = true;
        eyeBtn.title = '当前浏览器不支持屏幕取色，请使用 Chrome/Edge 最新版';
        eyeBtn.style.opacity = '0.5';
        eyeBtn.style.cursor = 'not-allowed';
        eyeBtn.addEventListener('click', () => {
            showToast('⚠️ 您的浏览器不支持 EyeDropper API，请使用 Chrome 或 Edge 浏览器');
        });
        return;
    }

    const eyeDropper = new EyeDropper();

    eyeBtn.addEventListener('click', async () => {
        try {
            const result = await eyeDropper.open();
            const hexColor = result.sRGBHex.toLowerCase();
            
            const activeGroupId = getActiveGroupId();
            // 重复检查需要在调用处进行，因为需要访问 colors
            const colorInfo = getColorName(hexColor);
            let colorName = colorInfo.n || `取色-${hexColor.slice(1, 7)}`;
            
            if (onColorAdded) {
                onColorAdded(hexColor, colorName);
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('取色器出错:', err);
                showToast('取色失败，请重试');
            }
        }
    });
}