import {
  hexToRgb,
  rgbToHex,
  hexToHsl,
} from "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/img2/pscolorUtils.js";

export function medianCut(pixels, numColors) {
  if (pixels.length === 0 || numColors <= 0) return [];
  let buckets = [pixels.slice()];
  while (buckets.length < numColors) {
    let maxRange = -1,
      maxIdx = 0,
      exhausted = true;
    buckets.forEach((bucket, idx) => {
      if (bucket.length < 2) return;
      exhausted = false;
      let minR = 255,
        maxR = 0,
        minG = 255,
        maxG = 0,
        minB = 255,
        maxB = 0;
      bucket.forEach((p) => {
        if (p[0] < minR) minR = p[0];
        if (p[0] > maxR) maxR = p[0];
        if (p[1] < minG) minG = p[1];
        if (p[1] > maxG) maxG = p[1];
        if (p[2] < minB) minB = p[2];
        if (p[2] > maxB) maxB = p[2];
      });
      let range = Math.max(maxR - minR, maxG - minG, maxB - minB);
      if (range > maxRange) {
        maxRange = range;
        maxIdx = idx;
      }
    });
    if (exhausted || maxRange <= 0) break;
    let bucket = buckets[maxIdx];
    let minR = 255,
      maxR = 0,
      minG = 255,
      maxG = 0,
      minB = 255,
      maxB = 0;
    bucket.forEach((p) => {
      if (p[0] < minR) minR = p[0];
      if (p[0] > maxR) maxR = p[0];
      if (p[1] < minG) minG = p[1];
      if (p[1] > maxG) maxG = p[1];
      if (p[2] < minB) minB = p[2];
      if (p[2] > maxB) maxB = p[2];
    });
    let rR = maxR - minR,
      gR = maxG - minG,
      bR = maxB - minB;
    let channel = 0;
    if (gR >= rR && gR >= bR) channel = 1;
    else if (bR >= rR && bR >= gR) channel = 2;
    bucket.sort((a, b) => a[channel] - b[channel]);
    let mid = Math.floor(bucket.length / 2);
    if (mid === 0 || mid >= bucket.length) break;
    let left = bucket.slice(0, mid),
      right = bucket.slice(mid);
    buckets.splice(maxIdx, 1, left, right);
  }
  return buckets
    .map((b) => {
      let sumR = 0,
        sumG = 0,
        sumB = 0;
      b.forEach((p) => {
        sumR += p[0];
        sumG += p[1];
        sumB += p[2];
      });
      return [
        Math.round(sumR / b.length),
        Math.round(sumG / b.length),
        Math.round(sumB / b.length),
      ];
    })
    .sort(
      (a, b) =>
        hexToHsl(rgbToHex(a[0], a[1], a[2])).h -
        hexToHsl(rgbToHex(b[0], b[1], b[2])).h
    );
}

export function extractColorsFromImage(imgEl, numColors) {
  const MAX = 180;
  let sw = imgEl.naturalWidth,
    sh = imgEl.naturalHeight;
  let scale = Math.min(1, MAX / Math.max(sw, sh));
  let dw = Math.round(sw * scale),
    dh = Math.round(sh * scale);
  let canvas = document.createElement("canvas");
  canvas.width = dw;
  canvas.height = dh;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(imgEl, 0, 0, dw, dh);
  let imgData = ctx.getImageData(0, 0, dw, dh);
  let pixels = [];
  for (let i = 0; i < imgData.data.length; i += 4) {
    let a = imgData.data[i + 3];
    if (a < 64) continue;
    pixels.push([imgData.data[i], imgData.data[i + 1], imgData.data[i + 2]]);
  }
  if (pixels.length === 0) return [];
  let clusters = medianCut(pixels, numColors);
  return clusters.map(([r, g, b]) => rgbToHex(r, g, b));
}
