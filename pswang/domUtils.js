// DOM 工具函数
let toastTimeout = null;

export function showToast(txt, duration = 1800) {
    const t = document.getElementById("toastMsg");
    if (!t) return;
    t.innerText = txt;
    t.classList.add("show");
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => t.classList.remove("show"), duration);
}

export async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast("复制成功");
    } catch {
        const inp = document.createElement("input");
        inp.value = text;
        document.body.appendChild(inp);
        inp.select();
        document.execCommand("copy");
        inp.remove();
        showToast("复制成功");
    }
}