// NusaData — main.js
// Titik masuk situs: router berbasis hash, pengalih tema terang/gelap, dan
// navigasi ponsel. Tidak ada permintaan jaringan: semua halaman dirender dari
// data.js dan views.js yang sudah dimuat bersama halaman ini.

import { renderHome, renderPopulation, renderEconomy, renderEducation, renderHealth, renderSources, renderNotFound, redrawAll, bindResizeOnce } from './views.js';

const ROUTES = {
  '/': renderHome,
  '/penduduk': renderPopulation,
  '/ekonomi': renderEconomy,
  '/pendidikan': renderEducation,
  '/kesehatan': renderHealth,
  '/sumber': renderSources,
};

const app = document.getElementById('app');
const nav = document.getElementById('site-nav');
const navToggle = document.getElementById('nav-toggle');
const themeToggle = document.getElementById('theme-toggle');

// Tema: simpan pilihan di penyimpanan lokal bila tersedia; bawaan mengikuti
// preferensi sistem. Mengganti tema menggambar ulang semua grafik kanvas.
function storedTheme() {
  try { return window.localStorage.getItem('nusadata-theme'); } catch { return null; }
}
function storeTheme(value) {
  try { window.localStorage.setItem('nusadata-theme', value); } catch { /* abaikan */ }
}
function applyTheme(value) {
  document.documentElement.setAttribute('data-theme', value);
  themeToggle.textContent = value === 'dark' ? '☀ Terang' : '☾ Gelap';
  themeToggle.setAttribute('aria-pressed', String(value === 'dark'));
  redrawAll();
}
function initTheme() {
  const saved = storedTheme();
  const preferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved === 'dark' || saved === 'light' ? saved : preferred);
}
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  storeTheme(next);
  applyTheme(next);
});

// Navigasi ponsel: tombol membuka/menutup menu.
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.textContent = open ? '✕ Tutup' : '☰ Menu';
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.textContent = '☰ Menu';
  }
});

// Router: hash #/penduduk -> renderPopulation, dan seterusnya.
function currentPath() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1).split('?')[0];
  return path === '' ? '/' : path;
}

function render() {
  const path = currentPath();
  const view = ROUTES[path] || renderNotFound;
  view(app);
  // Tandai tautan aktif di navigasi.
  nav.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    const active = href === '#' + path || (path === '/' && href === '#/');
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.getElementById('year').textContent = '2026';
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', () => {
  bindResizeOnce();
  initTheme();
  render();
});
// Bila skrip dimuat setelah DOMContentLoaded (misalnya dari cache), render langsung.
if (document.readyState !== 'loading') {
  bindResizeOnce();
  initTheme();
  render();
}
