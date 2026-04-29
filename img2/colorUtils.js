let colorNames = {};
const BUILTIN_COLOR_NAMES = {
    "#ff0000": "正红", "#dc2626": "朱红", "#ef4444": "珊瑚红", "#3b82f6": "天空蓝",
    "#ec4899": "玫瑰粉", "#10b981": "翠绿", "#f97316": "暖橙", "#000000": "纯黑",
    "#ffffff": "纯白", "#6b7280": "中灰", "#8b5cf6": "紫色", "#f59e0b": "琥珀色"
};

export async function loadColorNames() {
    try {
        const resp = await fetch('https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/colorUtils.json');
        if (resp.ok) colorNames = await resp.json();
        else colorNames = BUILTIN_COLOR_NAMES;
    } catch { colorNames = BUILTIN_COLOR_NAMES; }
}

function colorDifference(h1, h2) {
    const r1 = hexToRgb(h1), r2 = hexToRgb(h2);
    return Math.hypot(r1.r - r2.r, r1.g - r2.g, r1.b - r2.b);
}
export function getColorName(hex) {
    hex = hex.toLowerCase();
    if (colorNames[hex]) return { n: colorNames[hex] };
    let min = Infinity, best = '';
    for (let [k, n] of Object.entries(colorNames)) {
        let d = colorDifference(hex, k);
        if (d < min) { min = d; best = n; }
    }
    return min < 25 ? { n: best } : { n: '' };
}

export function hexToRgb(hex) {
    return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) };
}
export function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
export function hexToHsl(hex) {
    let { r, g, b } = hexToRgb(hex); r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
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
export function hslToRgb(hue, s, l) {
    hue %= 360; s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((hue / 60) % 2 - 1)), m = l - c / 2;
    let r, g, b;
    if (hue < 60) { r = c; g = x; b = 0; }
    else if (hue < 120) { r = x; g = c; b = 0; }
    else if (hue < 180) { r = 0; g = c; b = x; }
    else if (hue < 240) { r = 0; g = x; b = c; }
    else if (hue < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}
export function hslToHex(hue, s, l) {
    const { r, g, b } = hslToRgb(hue, s, l);
    return rgbToHex(r, g, b);
}
export function interpolateColor(start, end, ratio) {
    const s = hexToRgb(start), e = hexToRgb(end);
    return rgbToHex(Math.round(s.r + (e.r - s.r) * ratio), Math.round(s.g + (e.g - s.g) * ratio), Math.round(s.b + (e.b - s.b) * ratio));
}
export function getRelativeLuminance(r, g, b) {
    [r, g, b] = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function calcContrastRatio(hex1, hex2) {
    const c1 = hexToRgb(hex1), c2 = hexToRgb(hex2);
    const l1 = getRelativeLuminance(c1.r, c1.g, c1.b);
    const l2 = getRelativeLuminance(c2.r, c2.g, c2.b);
    const light = Math.max(l1, l2), dark = Math.min(l1, l2);
    return (light + 0.05) / (dark + 0.05);
}
export function getWcagLevel(ratio) {
    return { aa: ratio >= 4.5, aaa: ratio >= 7 };
}
export function generateTintShade(baseHex) {
    const { h, s, l } = hexToHsl(baseHex);
    const map = {};
    map[50] = hslToHex(h, s, 96); map[100] = hslToHex(h, s, 90); map[200] = hslToHex(h, s, 80);
    map[300] = hslToHex(h, s, 70); map[400] = hslToHex(h, s, 60); map[500] = baseHex;
    map[600] = hslToHex(h, s, 48); map[700] = hslToHex(h, s, 36); map[800] = hslToHex(h, s, 24);
    map[900] = hslToHex(h, s, 16); map[950] = hslToHex(h, s, 8);
    return map;
}

export const formatList = [
    { key: "hex", name: "HEX", fn: h => h.toUpperCase() },
    { key: "rgb", name: "RGB", fn: h => { let { r, g, b } = hexToRgb(h); return `rgb(${r}, ${g}, ${b})`; } },
    { key: "rgba", name: "RGBA", fn: h => { let { r, g, b } = hexToRgb(h); return `rgba(${r}, ${g}, ${b}, 1)`; } },
    { key: "hsl", name: "HSL", fn: h => { let { h: hue, s, l } = hexToHsl(h); return `hsl(${Math.round(hue)}, ${Math.round(s)}%, ${Math.round(l)}%)`; } },
    { key: "hsla", name: "HSLA", fn: h => { let { h: hue, s, l } = hexToHsl(h); return `hsla(${Math.round(hue)}, ${Math.round(s)}%, ${Math.round(l)}%, 1)`; } },
    { key: "css", name: "CSS变量", fn: h => { let { n } = getColorName(h); return `--color-${n || 'color'}: ${h};`; } },
    { key: "tw", name: "Tailwind", fn: h => { let { n } = getColorName(h); return `'${n || 'color'}': '${h}',`; } }
];
export const shadeLevels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
export const schemeConfigs = {
    complementary: { name: "互补色", desc: "色相环对面的颜色，强烈对比", offsets: [180] },
    splitComplementary: { name: "分裂互补", desc: "互补色的变体，对比稍柔和", offsets: [150, 210] },
    analogous: { name: "邻近色", desc: "相邻颜色，自然和谐", offsets: [-30, 30] },
    triadic: { name: "三角配色", desc: "均分三角三色，饱满活泼", offsets: [120, 240] },
    tetradic: { name: "四色方案", desc: "矩形四色，丰富有主次", offsets: [90, 180, 270] }
};

let currentFormat = 'hex';
export function setCurrentFormat(fmt) { currentFormat = fmt; }
export function formatColorByType(hex) {
    const item = formatList.find(f => f.key === currentFormat) || formatList[0];
    return item.fn(hex);
}

let toastTimer = null;
export function showToast(txt, dur = 1800) {
    const el = document.getElementById('toastMsg');
    if (!el) return;
    el.innerText = txt;
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), dur);
}
export async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('复制成功');
    } catch {
        let inp = document.createElement('input');
        inp.value = text;
        document.body.appendChild(inp);
        inp.select();
        document.execCommand('copy');
        inp.remove();
        showToast('复制成功');
    }
}
