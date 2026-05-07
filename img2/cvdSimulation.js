// 色盲模拟功能
import { showToast } from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/domUtils.js";

let cvdButtons = null;
let areasToFilter = [];

export function initCvdSimulation() {
  cvdButtons = document.querySelectorAll(".cvd-btn");
  const colorGrid = document.getElementById("colorGrid");
  const schemePanel = document.getElementById("schemePanel");
  const gradientPanel = document.getElementById("gradientPanel");
  areasToFilter = [colorGrid, schemePanel, gradientPanel];

  if (!cvdButtons.length) return;

  function setCvdFilter(value) {
    const filterValue = value === "none" ? "none" : `url(#${value})`;
    areasToFilter.forEach((area) => {
      if (area) area.style.filter = filterValue;
    });
    document
      .querySelectorAll(".shade-swatch, .scheme-swatch-color, .color-preview")
      .forEach((el) => (el.style.filter = filterValue));

    cvdButtons.forEach((btn) => {
      const btnVal = btn.getAttribute("data-cvd");
      if (btnVal === value) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const selectedText =
      Array.from(cvdButtons).find(
        (btn) => btn.getAttribute("data-cvd") === value
      )?.innerText || "正常视觉";
    showToast(value === "none" ? "恢复正常视觉" : `已开启 ${selectedText}`);
  }

  cvdButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-cvd");
      setCvdFilter(value);
      localStorage.setItem("cvd_simulation", value);
    });
  });

  const savedCvd = localStorage.getItem("cvd_simulation");
  if (
    savedCvd &&
    ["none", "protanopia", "deuteranopia", "tritanopia"].includes(savedCvd)
  ) {
    setCvdFilter(savedCvd);
  } else {
    setCvdFilter("none");
  }
}
