// NusaData — views.js
// Satu fungsi render per halaman. Setiap halaman dirender dari data.js dan
// memasang kontrolnya sendiri (tab, pengalih grafik, pengurutan tabel, pencarian)
// sehingga semua tombol di layar benar-benar melakukan sesuatu.

import { SERIES, KPIS, PROVINCES, SNAPSHOTS, SOURCES, TOPICS, allIndicators, formatId } from './data.js';
import { drawBarChart, drawLineChart, redrawAll } from './charts.js';

export { redrawAll };

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sourceLine(source, year) {
  return `<p class="source">Sumber: ${esc(source)} · ${year}</p>`;
}

function kpiCard(k) {
  return `<article class="kpi">
    <p class="kpi-label">${esc(k.label)}</p>
    <p class="kpi-value">${esc(k.value)}${k.sub ? ` <span class="kpi-sub">${esc(k.sub)}</span>` : ''}</p>
    <p class="kpi-detail">${esc(k.detail)}</p>
    <p class="source">Sumber: ${esc(k.source)} · ${k.year}</p>
  </article>`;
}

function chartCard(id, title, subtitle, source, year, note) {
  return `<section class="chart-card">
    <div class="chart-head">
      <div><h3>${esc(title)}</h3><p class="muted">${esc(subtitle)}</p></div>
    </div>
    <div class="chart-wrap"><canvas id="${id}" data-chart role="img" aria-label="Grafik ${esc(title)}"></canvas></div>
    ${note ? `<p class="note">${esc(note)}</p>` : ''}
    ${sourceLine(source, year)}
  </section>`;
}

function mountChart(id, drawFn) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const run = () => drawFn(canvas);
  canvas._draw = run;
  run();
}

function onResizeRedraw() {
  let t = null;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(redrawAll, 150);
  });
}
let resizeBound = false;
export function bindResizeOnce() {
  if (!resizeBound) { onResizeRedraw(); resizeBound = true; }
}

// ---------------- Beranda ----------------

export function renderHome(root) {
  const featured = SERIES.populationWb;
  const growth = SERIES.gdpGrowth;
  root.innerHTML = `
  <section class="hero">
    <p class="eyebrow">Situs statistik nasional · Indonesia</p>
    <h1>Indonesia dalam angka, <span>tanpa berbelit.</span></h1>
    <p class="lede">NusaData merangkum angka-angka resmi tentang penduduk, ekonomi, pendidikan,
    dan kesehatan Indonesia — setiap angka disertai sumber dan tahunnya, supaya Anda bisa
    mengutipnya dengan percaya diri.</p>
    <form class="search" id="home-search" role="search">
      <label for="q">Cari indikator</label>
      <input id="q" name="q" type="search" placeholder="Misalnya: inflasi, kemiskinan, melek huruf…" autocomplete="off">
      <button type="submit">Cari</button>
    </form>
    <div id="search-results" class="search-results" aria-live="polite"></div>
    <p class="hero-meta">38 provinsi · 280+ juta penduduk · Data BPS &amp; World Bank 2024</p>
  </section>

  <section aria-labelledby="kpi-title">
    <h2 id="kpi-title">Sekilas Indonesia, 2024</h2>
    <p class="section-intro">Sembilan angka yang paling sering dicari — semuanya dari rilis resmi terbaru.</p>
    <div class="kpi-grid">${KPIS.map(kpiCard).join('')}</div>
  </section>

  <section aria-labelledby="charts-title">
    <h2 id="charts-title">Dua grafik yang menceritakan satu dekade</h2>
    <div class="chart-grid">
      ${chartCard('home-pop', featured.title, 'Juta jiwa, 2015–2024', featured.source, featured.year, featured.note)}
      ${chartCard('home-growth', growth.title, 'Persen per tahun, 2020–2024', growth.source, growth.year, growth.note)}
    </div>
  </section>

  <section aria-labelledby="topics-title">
    <h2 id="topics-title">Jelajahi menurut topik</h2>
    <div class="topic-grid">
      ${TOPICS.map((t) => `<a class="topic topic-${t.accent}" href="${t.route}">
        <h3>${esc(t.title)}</h3><p>${esc(t.blurb)}</p><span class="topic-link">Buka halaman →</span>
      </a>`).join('')}
      <a class="topic topic-slate" href="#/sumber">
        <h3>Sumber &amp; Metode</h3><p>Dari mana setiap angka berasal dan bagaimana cara membacanya.</p><span class="topic-link">Buka halaman →</span>
      </a>
    </div>
  </section>

  <section aria-labelledby="latest-title">
    <h2 id="latest-title">Tabel data terbaru</h2>
    <p class="section-intro">Nilai terkini untuk indikator utama. Klik nama indikator untuk membuka halamannya.</p>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Indikator</th><th>Nilai terbaru</th><th>Tahun</th><th>Sumber</th></tr></thead>
      <tbody>
        ${allIndicators().map((ind) => `<tr>
          <td><a href="${ind.route}">${esc(ind.title)}</a></td>
          <td class="num"><strong>${esc(ind.value)}</strong> ${esc(ind.unit)}</td>
          <td class="num">${ind.year}</td><td>${esc(ind.source)}</td></tr>`).join('')}
      </tbody>
    </table></div>
    <p class="note">Semua angka di halaman ini dikutip dari publikasi resmi. Lihat
    <a href="#/sumber">Sumber &amp; Metode</a> untuk daftar lengkap dan catatan metodologi.</p>
  </section>`;

  mountChart('home-pop', (c) => drawLineChart(c, featured, { color: '#0e4f4a', height: 300 }));
  mountChart('home-growth', (c) => drawBarChart(c, growth, { color: '#2a7a72', height: 300 }));

  // Pencarian indikator di beranda: memfilter daftar dan menampilkan hasil.
  const form = document.getElementById('home-search');
  const input = document.getElementById('q');
  const box = document.getElementById('search-results');
  const runSearch = () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { box.innerHTML = ''; return; }
    const hits = allIndicators().filter((ind) => ind.title.toLowerCase().includes(q));
    if (hits.length === 0) {
      box.innerHTML = `<p class="no-result">Tidak ada indikator yang cocok dengan “${esc(input.value.trim())}”. Coba kata lain, misalnya “inflasi” atau “sekolah”.</p>`;
      return;
    }
    box.innerHTML = `<ul class="result-list">${hits.map((ind) => `<li>
      <a href="${ind.route}"><strong>${esc(ind.title)}</strong> — ${esc(ind.value)} ${esc(ind.unit)} · ${esc(ind.source)}, ${ind.year}</a>
    </li>`).join('')}</ul>`;
  };
  form.addEventListener('submit', (e) => { e.preventDefault(); runSearch(); });
  input.addEventListener('input', runSearch);
}

// ---------------- Penduduk ----------------

export function renderPopulation(root) {
  const s = SERIES.populationWb;
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow">Topik · Penduduk</p>
    <h1>Penduduk Indonesia</h1>
    <p class="lede">Indonesia adalah negara terpadat keempat di dunia. Lebih dari separuh penduduknya
    tinggal di Pulau Jawa, dan jumlahnya masih bertambah sekitar 1% setiap tahun.</p>
  </section>

  <section class="kpi-row">
    ${kpiCard(KPIS[0])}
    <article class="kpi"><p class="kpi-label">${esc(SNAPSHOTS.populationGrowth.label)}</p>
      <p class="kpi-value">${esc(SNAPSHOTS.populationGrowth.value)}</p>
      <p class="kpi-detail">Sekitar 2,8 juta jiwa bertambah setiap tahun.</p>
      ${sourceLine(SNAPSHOTS.populationGrowth.source, SNAPSHOTS.populationGrowth.year)}</article>
    <article class="kpi"><p class="kpi-label">${esc(SNAPSHOTS.urbanShare.label)}</p>
      <p class="kpi-value">${esc(SNAPSHOTS.urbanShare.value)}</p>
      <p class="kpi-detail">Hampir tiga dari lima penduduk tinggal di kota.</p>
      ${sourceLine(SNAPSHOTS.urbanShare.source, SNAPSHOTS.urbanShare.year)}</article>
    <article class="kpi"><p class="kpi-label">${esc(SNAPSHOTS.fertility.label)}</p>
      <p class="kpi-value">${esc(SNAPSHOTS.fertility.value)}</p>
      <p class="kpi-detail">Anak per perempuan — mendekati tingkat pengganti 2,1.</p>
      ${sourceLine(SNAPSHOTS.fertility.source, SNAPSHOTS.fertility.year)}</article>
  </section>

  <section class="chart-card">
    <div class="chart-head">
      <div><h3>${esc(s.title)}</h3><p class="muted">Juta jiwa · ${s.years[0]}–${s.years[s.years.length - 1]}</p></div>
      <div class="controls" role="group" aria-label="Pengaturan grafik">
        <div class="seg" id="pop-type">
          <button type="button" data-type="line" class="active" aria-pressed="true">Garis</button>
          <button type="button" data-type="bar" aria-pressed="false">Batang</button>
        </div>
        <div class="seg" id="pop-range">
          <button type="button" data-range="all" class="active" aria-pressed="true">2015–2024</button>
          <button type="button" data-range="recent" aria-pressed="false">2020–2024</button>
        </div>
      </div>
    </div>
    <div class="chart-wrap"><canvas id="pop-chart" data-chart role="img" aria-label="Grafik jumlah penduduk"></canvas></div>
    <p class="note">${esc(s.note)}</p>
    ${sourceLine(s.source, s.year)}
  </section>

  <section aria-labelledby="prov-title">
    <h2 id="prov-title">Provinsi terpadat</h2>
    <p class="section-intro">Delapan provinsi dengan penduduk terbanyak, estimasi BPS 2024. Jawa Barat sendiri
    berpenduduk lebih banyak daripada kebanyakan negara di dunia.</p>
    <div class="table-tools">
      <label>Cari provinsi <input id="prov-q" type="search" placeholder="Misalnya: Jawa, Sumatera…" autocomplete="off"></label>
      <button type="button" id="prov-sort" class="btn">Urutkan: terbanyak ↓</button>
    </div>
    <div class="table-wrap"><table class="data-table" id="prov-table">
      <thead><tr><th>#</th><th>Provinsi</th><th>Ibu kota</th><th>Pulau</th><th class="num">Penduduk (juta)</th></tr></thead>
      <tbody id="prov-body"></tbody>
    </table></div>
    <p id="prov-empty" class="no-result" hidden>Tidak ada provinsi yang cocok. Hapus kata pencarian untuk melihat semua.</p>
    ${sourceLine('BPS — Estimasi Penduduk menurut Provinsi', 2024)}
  </section>`;

  // Grafik penduduk dengan pengalih jenis + rentang.
  let chartType = 'line';
  let chartRange = 'all';
  const sliceSeries = () => {
    if (chartRange === 'recent') {
      const i = s.years.indexOf(2020);
      return { ...s, years: s.years.slice(i), values: s.values.slice(i) };
    }
    return s;
  };
  const drawPop = () => {
    const canvas = document.getElementById('pop-chart');
    if (!canvas) return;
    const series = sliceSeries();
    if (chartType === 'bar') drawBarChart(canvas, series, { color: '#0e4f4a', height: 320 });
    else drawLineChart(canvas, series, { color: '#0e4f4a', height: 320 });
  };
  const popCanvas = document.getElementById('pop-chart');
  popCanvas._draw = drawPop;
  drawPop();
  document.getElementById('pop-type').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    chartType = btn.dataset.type;
    document.querySelectorAll('#pop-type button').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    drawPop();
  });
  document.getElementById('pop-range').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    chartRange = btn.dataset.range;
    document.querySelectorAll('#pop-range button').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    drawPop();
  });

  // Tabel provinsi: cari + urutkan.
  let sortDesc = true;
  let query = '';
  const body = document.getElementById('prov-body');
  const empty = document.getElementById('prov-empty');
  const sortBtn = document.getElementById('prov-sort');
  const renderRows = () => {
    const rows = PROVINCES.filter((p) => (p.name + ' ' + p.capital + ' ' + p.island).toLowerCase().includes(query))
      .sort((a, b) => (sortDesc ? b.population - a.population : a.population - b.population));
    body.innerHTML = rows.map((p, i) => `<tr>
      <td class="num">${i + 1}</td><td><strong>${esc(p.name)}</strong></td>
      <td>${esc(p.capital)}</td><td>${esc(p.island)}</td>
      <td class="num"><strong>${formatId(p.population, p.population % 1 ? 2 : 0)}</strong></td></tr>`).join('');
    empty.hidden = rows.length > 0;
  };
  renderRows();
  document.getElementById('prov-q').addEventListener('input', (e) => {
    query = e.target.value.trim().toLowerCase();
    renderRows();
  });
  sortBtn.addEventListener('click', () => {
    sortDesc = !sortDesc;
    sortBtn.textContent = sortDesc ? 'Urutkan: terbanyak ↓' : 'Urutkan: tersedikit ↑';
    renderRows();
  });
}

// ---------------- Ekonomi ----------------

const ECON_TABS = [
  { id: 'growth', series: 'gdpGrowth', label: 'Pertumbuhan PDB', color: '#2a7a72', kind: 'bar' },
  { id: 'percapita', series: 'gdpPerCapita', label: 'PDB per kapita', color: '#0e4f4a', kind: 'line' },
  { id: 'inflation', series: 'inflation', label: 'Inflasi', color: '#d9552c', kind: 'bar' },
];

export function renderEconomy(root) {
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow">Topik · Ekonomi</p>
    <h1>Ekonomi Indonesia</h1>
    <p class="lede">Ekonomi terbesar di Asia Tenggara: PDB sekitar US$ 1,40 triliun pada 2024, tumbuh
    5,03%, dengan inflasi yang kembali rendah setelah lonjakan 2022.</p>
  </section>

  <section class="kpi-row">
    ${kpiCard(KPIS[1])}
    ${kpiCard(KPIS[2])}
    ${kpiCard(KPIS[3])}
    ${kpiCard(KPIS[4])}
  </section>

  <section class="chart-card">
    <div class="chart-head">
      <div><h3 id="econ-title">${esc(SERIES.gdpGrowth.title)}</h3>
      <p class="muted" id="econ-sub">Persen per tahun, 2020–2024</p></div>
      <div class="tabs" role="tablist" aria-label="Pilih grafik ekonomi">
        ${ECON_TABS.map((t, i) => `<button type="button" role="tab" data-tab="${t.id}"
          class="${i === 0 ? 'active' : ''}" aria-selected="${i === 0}">${t.label}</button>`).join('')}
      </div>
    </div>
    <div class="chart-wrap"><canvas id="econ-chart" data-chart role="img" aria-label="Grafik ekonomi"></canvas></div>
    <p class="note" id="econ-note">${esc(SERIES.gdpGrowth.note)}</p>
    <p class="source" id="econ-source">Sumber: ${esc(SERIES.gdpGrowth.source)} · ${SERIES.gdpGrowth.year}</p>
  </section>

  <section aria-labelledby="labor-title">
    <h2 id="labor-title">Pekerjaan &amp; kemiskinan</h2>
    <div class="chart-grid">
      ${chartCard('econ-unemp', SERIES.unemployment.title, 'Persen angkatan kerja, Agustus 2020–2024', SERIES.unemployment.source, SERIES.unemployment.year, SERIES.unemployment.note)}
      ${chartCard('econ-poverty', SERIES.poverty.title, 'Persen penduduk, 2021–2024', SERIES.poverty.source, SERIES.poverty.year, SERIES.poverty.note)}
    </div>
  </section>

  <section aria-labelledby="econ-table-title">
    <h2 id="econ-table-title">Ringkasan tahunan</h2>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Tahun</th><th class="num">Pertumbuhan PDB (%)</th><th class="num">PDB per kapita (US$)</th><th class="num">Inflasi (%)</th><th class="num">Pengangguran (%)</th></tr></thead>
      <tbody>
        ${[2020, 2021, 2022, 2023, 2024].map((y) => {
          const at = (key) => { const s = SERIES[key]; const i = s.years.indexOf(y); return i === -1 ? '—' : formatId(s.values[i], key === 'gdpGrowth' || key === 'inflation' ? 2 : 0); };
          return `<tr><td><strong>${y}</strong></td><td class="num">${at('gdpGrowth')}</td><td class="num">${at('gdpPerCapita')}</td><td class="num">${at('inflation')}</td><td class="num">${at('unemployment')}</td></tr>`;
        }).join('')}
      </tbody>
    </table></div>
    <p class="note">PDB per kapita dan inflasi: World Bank dan BPS. Pengangguran diukur setiap Agustus (Sakernas).</p>
  </section>`;

  let active = ECON_TABS[0];
  const drawEcon = () => {
    const canvas = document.getElementById('econ-chart');
    if (!canvas) return;
    const s = SERIES[active.series];
    if (active.kind === 'bar') drawBarChart(canvas, s, { color: active.color, height: 320 });
    else drawLineChart(canvas, s, { color: active.color, height: 320 });
  };
  const econCanvas = document.getElementById('econ-chart');
  econCanvas._draw = drawEcon;
  drawEcon();
  document.querySelectorAll('.tabs [data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      active = ECON_TABS.find((t) => t.id === btn.dataset.tab);
      document.querySelectorAll('.tabs [data-tab]').forEach((b) => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', String(on));
      });
      const s = SERIES[active.series];
      document.getElementById('econ-title').textContent = s.title;
      document.getElementById('econ-sub').textContent = `${s.unit}, ${s.years[0]}–${s.years[s.years.length - 1]}`;
      document.getElementById('econ-note').textContent = s.note;
      document.getElementById('econ-source').textContent = `Sumber: ${s.source} · ${s.year}`;
      drawEcon();
    });
  });

  mountChart('econ-unemp', (c) => drawBarChart(c, SERIES.unemployment, { color: '#3f7d4e', height: 280 }));
  mountChart('econ-poverty', (c) => drawBarChart(c, SERIES.poverty, { color: '#d9552c', height: 280 }));
}

// ---------------- Pendidikan ----------------

export function renderEducation(root) {
  const hdi = SERIES.hdi;
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow">Topik · Pendidikan</p>
    <h1>Pendidikan Indonesia</h1>
    <p class="lede">Hampir semua anak bersekolah dasar, melek huruf dewasa mencapai 96%, dan Indeks
    Pembangunan Manusia naik setiap tahun sejak 2020 — tapi rata-rata lama sekolah baru 8,85 tahun.</p>
  </section>

  <section class="kpi-row">
    ${kpiCard(KPIS[7])}
    <article class="kpi"><p class="kpi-label">${esc(SNAPSHOTS.literacy.label)}</p>
      <p class="kpi-value">${esc(SNAPSHOTS.literacy.value)}</p>
      <p class="kpi-detail">${esc(SNAPSHOTS.literacy.note)}</p>
      ${sourceLine(SNAPSHOTS.literacy.source, SNAPSHOTS.literacy.year)}</article>
    <article class="kpi"><p class="kpi-label">${esc(SNAPSHOTS.enrollmentTertiary.label)}</p>
      <p class="kpi-value">${esc(SNAPSHOTS.enrollmentTertiary.value)}</p>
      <p class="kpi-detail">${esc(SNAPSHOTS.enrollmentTertiary.note)}</p>
      ${sourceLine(SNAPSHOTS.enrollmentTertiary.source, SNAPSHOTS.enrollmentTertiary.year)}</article>
    <article class="kpi"><p class="kpi-label">${esc(SNAPSHOTS.educationSpending.label)}</p>
      <p class="kpi-value">${esc(SNAPSHOTS.educationSpending.value)}</p>
      <p class="kpi-detail">${esc(SNAPSHOTS.educationSpending.note)}</p>
      ${sourceLine(SNAPSHOTS.educationSpending.source, SNAPSHOTS.educationSpending.year)}</article>
  </section>

  <section class="chart-grid">
    ${chartCard('edu-hdi', hdi.title, 'Skor 0–100, 2020–2024', hdi.source, hdi.year, hdi.note)}
    ${chartCard('edu-school', SERIES.expectedSchooling.title, 'Tahun, 2020–2024', SERIES.expectedSchooling.source, SERIES.expectedSchooling.year, SERIES.expectedSchooling.note)}
  </section>

  <section aria-labelledby="enroll-title">
    <h2 id="enroll-title">Partisipasi sekolah menurut jenjang</h2>
    <p class="section-intro">Angka partisipasi murni/kasar terbaru dari World Bank. Partisipasi dasar sudah
    menyeluruh; kesenjangan terbesar ada di jenjang perguruan tinggi.</p>
    <div class="meter-list">
      ${[['Sekolah dasar', SNAPSHOTS.enrollmentPrimary], ['Sekolah menengah', SNAPSHOTS.enrollmentSecondary], ['Pendidikan tinggi', SNAPSHOTS.enrollmentTertiary]].map(([label, s]) => {
        const pct = parseFloat(String(s.value).replace(',', '.'));
        return `<div class="meter">
          <div class="meter-head"><span><strong>${label}</strong> — ${esc(s.value)}</span><span class="muted">${s.year} · ${esc(s.source)}</span></div>
          <div class="meter-track"><div class="meter-fill" style="width:${pct}%"></div></div>
          <p class="muted">${esc(s.note)}</p>
        </div>`;
      }).join('')}
    </div>
  </section>

  <section aria-labelledby="hdi-comp-title">
    <h2 id="hdi-comp-title">Apa yang membentuk IPM 2024?</h2>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Komponen IPM</th><th class="num">2024</th><th class="num">2020</th><th>Sumber</th></tr></thead>
      <tbody>
        <tr><td>Angka harapan hidup</td><td class="num"><strong>74,15 tahun</strong></td><td class="num">73,37 tahun</td><td>BPS</td></tr>
        <tr><td>Harapan lama sekolah</td><td class="num"><strong>13,21 tahun</strong></td><td class="num">12,98 tahun</td><td>BPS</td></tr>
        <tr><td>Rata-rata lama sekolah</td><td class="num"><strong>8,85 tahun</strong></td><td class="num">8,48 tahun</td><td>BPS</td></tr>
        <tr><td>Pengeluaran riil per kapita</td><td class="num"><strong>Rp 12.341 ribu/thn</strong></td><td class="num">Rp 11.013 ribu/thn</td><td>BPS</td></tr>
      </tbody>
    </table></div>
    ${sourceLine('BPS — Indeks Pembangunan Manusia 2024', 2024)}
  </section>`;

  mountChart('edu-hdi', (c) => drawLineChart(c, hdi, { color: '#d9552c', height: 300 }));
  mountChart('edu-school', (c) => drawLineChart(c, SERIES.expectedSchooling, { color: '#0e4f4a', height: 300 }));
}

// ---------------- Kesehatan ----------------

export function renderHealth(root) {
  const le = SERIES.lifeExpectancy;
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow">Topik · Kesehatan</p>
    <h1>Kesehatan Indonesia</h1>
    <p class="lede">Bayi yang lahir pada 2024 diperkirakan hidup 74,15 tahun menurut BPS — naik hampir
    satu tahun sejak 2020. Angka kelahiran total turun mendekati tingkat pengganti.</p>
  </section>

  <section class="kpi-row">
    ${kpiCard(KPIS[8])}
    <article class="kpi"><p class="kpi-label">${esc(SNAPSHOTS.fertility.label)}</p>
      <p class="kpi-value">${esc(SNAPSHOTS.fertility.value)}</p>
      <p class="kpi-detail">${esc(SNAPSHOTS.fertility.note)}</p>
      ${sourceLine(SNAPSHOTS.fertility.source, SNAPSHOTS.fertility.year)}</article>
    <article class="kpi"><p class="kpi-label">${esc(SNAPSHOTS.maternalMortality.label)}</p>
      <p class="kpi-value">${esc(SNAPSHOTS.maternalMortality.value)}</p>
      <p class="kpi-detail">${esc(SNAPSHOTS.maternalMortality.note)}</p>
      ${sourceLine(SNAPSHOTS.maternalMortality.source, SNAPSHOTS.maternalMortality.year)}</article>
    <article class="kpi"><p class="kpi-label">Kesehatan dalam IPM</p>
      <p class="kpi-value">74,15 <span class="kpi-sub">tahun</span></p>
      <p class="kpi-detail">Harapan hidup adalah satu dari tiga dimensi IPM, bersama pendidikan dan standar hidup layak.</p>
      ${sourceLine('BPS — IPM 2024', 2024)}</article>
  </section>

  <section class="chart-grid">
    ${chartCard('health-le', le.title, 'Tahun, 2020–2024', le.source, le.year, le.note)}
    <section class="chart-card">
      <div class="chart-head"><div><h3>Harapan hidup vs dunia</h3><p class="muted">Tahun, 2024</p></div></div>
      <div class="compare">
        <div class="compare-row"><span>Indonesia (BPS)</span><div class="compare-track"><div class="compare-fill" style="width:88%;background:#0e4f4a"></div></div><strong>74,15</strong></div>
        <div class="compare-row"><span>Indonesia (World Bank)</span><div class="compare-track"><div class="compare-fill" style="width:85%;background:#2a7a72"></div></div><strong>71,3</strong></div>
        <div class="compare-row"><span>Rata-rata dunia</span><div class="compare-track"><div class="compare-fill" style="width:87%;background:#e8a100"></div></div><strong>73,5</strong></div>
      </div>
      <p class="note">Dua angka Indonesia berbeda karena metode: BPS memakai data Susenas dan proyeksi
      penduduk nasional, World Bank memakai proyeksi PBB. Keduanya dikutip apa adanya di sini.</p>
      ${sourceLine('BPS & World Bank, WDI', 2024)}
    </section>
  </section>

  <section aria-labelledby="health-read-title">
    <h2 id="health-read-title">Cara membaca angka ini</h2>
    <div class="read-grid">
      <article class="read"><h3>Harapan hidup naik, tapi pelan</h3>
        <p>Dari 73,37 tahun (2020) ke 74,15 tahun (2024) — kenaikan 0,78 tahun dalam lima tahun.
        Kenaikan ini mendorong IPM dari 72,81 ke 75,02 pada periode yang sama.</p></article>
      <article class="read"><h3>Kelahiran mendekati pengganti</h3>
        <p>Angka kelahiran total 2,12 anak per perempuan (2024) hampir sama dengan tingkat pengganti
        2,1 — artinya pertumbuhan penduduk akan melambat dalam satu-dua dekade ke depan.</p></article>
      <article class="read"><h3>Kesehatan ibu masih jadi pekerjaan rumah</h3>
        <p>Rasio kematian ibu 140 per 100.000 kelahiran hidup (2023) masih jauh di atas rata-rata
        negara berpendapatan menengah-atas, meski sudah jauh membaik dari dua dekade lalu.</p></article>
    </div>
    ${sourceLine('BPS — IPM 2024; World Bank, WDI', 2024)}
  </section>`;

  mountChart('health-le', (c) => drawLineChart(c, le, { color: '#3f7d4e', height: 300 }));
}

// ---------------- Sumber & Metode ----------------

export function renderSources(root) {
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow">Tentang data</p>
    <h1>Sumber &amp; Metode</h1>
    <p class="lede">Setiap angka di NusaData berasal dari publikasi resmi dan dikutip dengan sumber
    serta tahunnya. Halaman ini merangkum semuanya di satu tempat.</p>
  </section>

  <section aria-labelledby="src-list-title">
    <h2 id="src-list-title">Sumber data</h2>
    <div class="source-list">
      ${SOURCES.map((s) => `<article class="source-item">
        <h3>${esc(s.name)}</h3>
        <p class="source-ref">${esc(s.ref)}</p>
        <p>${esc(s.what)}</p>
      </article>`).join('')}
    </div>
  </section>

  <section aria-labelledby="method-title">
    <h2 id="method-title">Catatan metode</h2>
    <div class="read-grid">
      <article class="read"><h3>Angka resmi, bukan estimasi kami</h3>
        <p>NusaData tidak menghitung ulang angka apa pun. Nilai yang ditampilkan adalah nilai
        yang diterbitkan sumbernya; bila dua sumber berbeda (misalnya penduduk 2024: BPS 281,6 juta
        vs World Bank 285,1 juta), keduanya ditampilkan beserta penjelasannya.</p></article>
      <article class="read"><h3>Tahun yang dikutip adalah tahun data</h3>
        <p>“2024” berarti data untuk tahun 2024, bukan tahun publikasi. Beberapa indikator
        (misalnya melek huruf 2020) memakai tahun terakhir yang tersedia dari sumbernya.</p></article>
      <article class="read"><h3>Tidak ada data yang diunduh saat dibuka</h3>
        <p>Semua angka tersimpan di dalam berkas situs ini. Situs berjalan tanpa jaringan:
        tidak ada permintaan ke server mana pun saat halaman dibuka.</p></article>
      <article class="read"><h3>Pemutakhiran</h3>
        <p>${esc('Data terakhir diperbarui dari rilis BPS dan World Bank tahun 2024–2025.')}</p></article>
    </div>
  </section>

  <section aria-labelledby="all-ind-title">
    <h2 id="all-ind-title">Seluruh indikator dalam satu tabel</h2>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Indikator</th><th>Nilai</th><th>Tahun</th><th>Sumber</th><th>Halaman</th></tr></thead>
      <tbody>
        ${allIndicators().map((ind) => `<tr>
          <td><a href="${ind.route}">${esc(ind.title)}</a></td>
          <td class="num"><strong>${esc(ind.value)}</strong> ${esc(ind.unit)}</td>
          <td class="num">${ind.year}</td><td>${esc(ind.source)}</td>
          <td><a href="${ind.route}">${ind.route === '#/penduduk' ? 'Penduduk' : ind.route === '#/ekonomi' ? 'Ekonomi' : ind.route === '#/pendidikan' ? 'Pendidikan' : 'Kesehatan'}</a></td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </section>

  <section aria-labelledby="about-title">
    <h2 id="about-title">Tentang NusaData</h2>
    <p>NusaData adalah situs statistik independen — bukan situs resmi BPS atau lembaga
    pemerintah mana pun. Nama, desain, dan teksnya orisinal. Angka-angka yang dikutip tetap
    milik sumbernya masing-masing dan dicantumkan sebagaimana diterbitkan.</p>
    <p class="muted">Dibuat untuk lomba “Make the best national statistics site” di make.fun, November 2026.</p>
  </section>`;
}

// ---------------- 404 ----------------

export function renderNotFound(root) {
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow">Halaman tidak ditemukan</p>
    <h1>Halaman itu tidak ada di sini.</h1>
    <p class="lede">Tautan yang Anda buka tidak mengarah ke halaman NusaData. Coba salah satu topik di bawah ini.</p>
    <p><a class="btn" href="#/">Kembali ke Beranda</a></p>
    <div class="topic-grid">
      ${TOPICS.map((t) => `<a class="topic topic-${t.accent}" href="${t.route}">
        <h3>${esc(t.title)}</h3><p>${esc(t.blurb)}</p><span class="topic-link">Buka halaman →</span>
      </a>`).join('')}
    </div>
  </section>`;
}
