// 主题切换（深色/浅色模式）
import {
  getSavedTheme,
  setSavedTheme,
} from ".https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/psw/storage.js";

export function initTheme() {
  const themeBtn = document.getElementById("themeToggleBtn");
  if (!themeBtn) return;

  const savedTheme = getSavedTheme();
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    const icon = themeBtn.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    }
  } else {
    document.body.classList.remove("light-theme");
    const icon = themeBtn.querySelector("i");
    if (icon) {
      icon.classList.add("fa-moon");
      icon.classList.remove("fa-sun");
    }
  }

  themeBtn.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-theme");
    const icon = themeBtn.querySelector("i");
    if (isLight) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
      setSavedTheme("light");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
      setSavedTheme("dark");
    }
  });
}
