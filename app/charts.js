// NusaData — charts.js
// Menggambar grafik batang dan garis di atas <canvas> dengan JavaScript murni,
// tanpa library eksternal. Setiap grafik dilengkapi sumbu, label nilai, dan
// keterangan sumber sehingga tetap terbaca sebagai gambar statis.

const PALETTE = {
  teal: '#0e4f4a',
  tealLight: '#2a7a72',
  amber: '#e8a100',
  coral: '#d9552c',
  green: '#3f7d4e',
  grid: 'rgba(22, 33, 31, 0.12)',
  gridDark: 'rgba(250, 246, 239, 0.16)',
  ink: '#16211f',
  inkDark: '#f2ede3',
  muted: '#5d6b68',
  mutedDark: '#a8b3ae',
};

function isDark() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function colors() {
  return isDark()
    ? { ...PALETTE, grid: PALETTE.gridDark, ink: PALETTE.inkDark, muted: PALETTE.mutedDark }
    : PALETTE;
}

// Menyiapkan kanvas untuk layar retina: ukuran CSS tetap, piksel digandakan.
function setupCanvas(canvas, cssWidth, cssHeight) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = cssWidth + 'px';
  canvas.style.height = cssHeight + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

const NICE_STEPS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

function niceCeil(max) {
  if (max <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / pow;
  const step = NICE_STEPS.find((s) => s >= n) ?? 10;
  return step * pow;
}

function niceFloor(min) {
  if (min <= 0) return 0;
  const pow = Math.pow(10, Math.floor(Math.log10(min)));
  const n = min / pow;
  const step = [...NICE_STEPS].reverse().find((s) => s <= n) ?? 1;
  return step * pow;
}

function niceStep(span) {
  const raw = span / 4;
  if (raw <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pow;
  const step = NICE_STEPS.find((s) => s >= n) ?? 10;
  return step * pow;
}

function formatTick(v) {
  if (Math.abs(v) >= 1000) return v.toLocaleString('id-ID');
  return String(v).replace('.', ',');
}

// Menggambar sumbu Y + garis grid. `ticks` adalah nilai sumbu yang ditampilkan;
// bila tidak diberikan, sumbu dibagi rata dalam 4 interval. Mengembalikan
// fungsi pemetaan nilai -> y.
function drawAxes(ctx, c, pad, plotW, plotH, min, max, ticks) {
  const values = ticks ?? [0, 1, 2, 3, 4].map((i) => min + ((max - min) * i) / 4);
  ctx.font = '11px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillStyle = c.muted;
  ctx.strokeStyle = c.grid;
  ctx.lineWidth = 1;
  for (const v of values) {
    const y = pad.top + plotH - ((v - min) / (max - min)) * plotH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + plotW, y);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatTick(Math.round(v * 100) / 100), pad.left - 8, y);
  }
  return (v) => pad.top + plotH - ((v - min) / (max - min)) * plotH;
}

// Grafik batang untuk satu seri.
export function drawBarChart(canvas, series, options = {}) {
  const color = options.color || PALETTE.teal;
  const highlightLast = options.highlightLast !== false;
  const c = colors();
  const years = series.years;
  const values = series.values;
  const cssW = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const cssH = options.height || 300;
  const ctx = setupCanvas(canvas, cssW, cssH);
  const pad = { top: 26, right: 12, bottom: 30, left: 52 };
  const plotW = cssW - pad.left - pad.right;
  const plotH = cssH - pad.top - pad.bottom;
  let min = Math.min(0, ...values) < 0 ? -niceCeil(Math.abs(Math.min(...values))) : 0;
  let max = niceCeil(Math.max(...values));
  // Jepit sumbu ke kelipatan langkah yang rapi supaya label sumbu bulat.
  const step = niceStep(max - min);
  min = Math.floor(min / step) * step;
  max = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = min; v <= max + step * 0.001; v += step) ticks.push(Math.round(v * 1000) / 1000);
  const toY = drawAxes(ctx, c, pad, plotW, plotH, min, max, ticks);

  const slot = plotW / values.length;
  const barW = Math.min(56, slot * 0.62);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  values.forEach((v, i) => {
    const x = pad.left + slot * i + (slot - barW) / 2;
    const y = toY(v);
    const zeroY = toY(0);
    const top = Math.min(y, zeroY);
    const h = Math.max(2, Math.abs(zeroY - y));
    const last = i === values.length - 1;
    ctx.fillStyle = last && highlightLast ? PALETTE.amber : color;
    ctx.beginPath();
    ctx.roundRect(x, top, barW, h, [4, 4, 0, 0]);
    ctx.fill();
    // Label nilai di atas batang.
    ctx.font = '600 12px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillStyle = c.ink;
    ctx.fillText(formatTick(v), x + barW / 2, top - 6);
    // Label tahun.
    ctx.font = '11px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillStyle = c.muted;
    ctx.textBaseline = 'top';
    ctx.fillText(String(years[i]), x + barW / 2, pad.top + plotH + 8);
    ctx.textBaseline = 'bottom';
  });
  drawZeroLine(ctx, c, pad, plotW, toY);
}

// Grafik garis untuk satu seri, dengan titik dan label nilai.
export function drawLineChart(canvas, series, options = {}) {
  const color = options.color || PALETTE.teal;
  const c = colors();
  const years = series.years;
  const values = series.values;
  const cssW = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const cssH = options.height || 300;
  const ctx = setupCanvas(canvas, cssW, cssH);
  const pad = { top: 26, right: 16, bottom: 30, left: 52 };
  const plotW = cssW - pad.left - pad.right;
  const plotH = cssH - pad.top - pad.bottom;
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  // Sumbu dibulatkan ke langkah yang rapi supaya label sumbu berupa angka bulat.
  const step = niceStep(span);
  const min = Math.floor((lo - span * 0.12) / step) * step;
  const max = Math.ceil((hi + span * 0.12) / step) * step;
  const ticks = [];
  for (let v = min; v <= max + step * 0.001; v += step) ticks.push(Math.round(v * 1000) / 1000);
  const toY = drawAxes(ctx, c, pad, plotW, plotH, min, max, ticks);
  const toX = (i) => pad.left + (plotW * i) / (values.length - 1);

  // Area di bawah garis.
  ctx.beginPath();
  ctx.moveTo(toX(0), toY(values[0]));
  values.forEach((v, i) => ctx.lineTo(toX(i), toY(v)));
  ctx.lineTo(toX(values.length - 1), pad.top + plotH);
  ctx.lineTo(toX(0), pad.top + plotH);
  ctx.closePath();
  ctx.fillStyle = color + '1f';
  ctx.fill();

  // Garis.
  ctx.beginPath();
  values.forEach((v, i) => {
    if (i === 0) ctx.moveTo(toX(i), toY(v));
    else ctx.lineTo(toX(i), toY(v));
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Titik + label.
  ctx.font = '600 12px system-ui, -apple-system, "Segoe UI", sans-serif';
  values.forEach((v, i) => {
    const x = toX(i);
    const y = toY(v);
    ctx.beginPath();
    ctx.arc(x, y, i === values.length - 1 ? 5.5 : 4, 0, Math.PI * 2);
    ctx.fillStyle = i === values.length - 1 ? PALETTE.amber : color;
    ctx.fill();
    ctx.strokeStyle = isDark() ? '#1d2b29' : '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = c.ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(formatTick(v), x, y - 10);
    ctx.font = '11px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillStyle = c.muted;
    ctx.textBaseline = 'top';
    ctx.fillText(String(years[i]), x, pad.top + plotH + 8);
    ctx.font = '600 12px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textBaseline = 'bottom';
  });
}

// Garis nol yang tegas bila ada nilai negatif.
function drawZeroLine(ctx, c, pad, plotW, toY) {
  const y0 = toY(0);
  if (y0 > pad.top && y0 < pad.top + 400) {
    ctx.strokeStyle = c.ink;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(pad.left, y0);
    ctx.lineTo(pad.left + plotW, y0);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

// Menggambar ulang semua kanvas bertanda data-chart saat tema berubah.
export function redrawAll() {
  document.querySelectorAll('canvas[data-chart]').forEach((canvas) => {
    const fn = canvas._draw;
    if (typeof fn === 'function') fn();
  });
}
