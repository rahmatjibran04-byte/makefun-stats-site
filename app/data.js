// NusaData — data.js
// Seluruh angka di situs ini. Setiap indikator membawa nilai, satuan, tahun, dan
// sumbernya, sehingga setiap angka yang tampil di layar selalu bisa dilacak.
// Angka-angka di bawah ini diverifikasi dari publikasi BPS dan World Bank
// (World Development Indicators) sebelum ditulis ke sini; bila satu angka tidak
// bisa diverifikasi, indikator itu tidak dimasukkan.

export const META = {
  siteName: 'NusaData',
  tagline: 'Statistik Indonesia, dibaca dengan jelas',
  country: 'Indonesia',
  updatedNote: 'Data terakhir diperbarui dari rilis BPS dan World Bank tahun 2024–2025.',
};

// Seri tahunan. `years` sejajar dengan `values` (indeks sama).
export const SERIES = {
  populationWb: {
    id: 'populationWb',
    title: 'Jumlah penduduk',
    unit: 'juta jiwa',
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [258.4, 261.6, 264.7, 267.7, 270.6, 273.5, 276.4, 279.1, 282.1, 285.1],
    source: 'World Bank, World Development Indicators',
    year: 2024,
    note: 'Estimasi World Bank. Angka resmi BPS untuk 2024 adalah 281,6 juta jiwa; selisihnya berasal dari metode proyeksi yang berbeda.',
  },
  gdpGrowth: {
    id: 'gdpGrowth',
    title: 'Pertumbuhan PDB (riil)',
    unit: '% per tahun',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [-2.07, 3.69, 5.31, 5.05, 5.03],
    source: 'BPS — Berita Resmi Statistik',
    year: 2024,
    note: 'Laju pertumbuhan PDB harga konstan, year-on-year.',
  },
  gdpPerCapita: {
    id: 'gdpPerCapita',
    title: 'PDB per kapita',
    unit: 'US$',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [3872, 4293, 4726, 4860, 4925],
    source: 'World Bank, World Development Indicators',
    year: 2024,
    note: 'PDB per kapita nominal, dolar AS berjalan.',
  },
  inflation: {
    id: 'inflation',
    title: 'Inflasi (IHK, rata-rata tahunan)',
    unit: '% per tahun',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [1.68, 1.87, 5.51, 2.61, 1.57],
    source: 'BPS — Indeks Harga Konsumen',
    year: 2024,
    note: 'Rata-rata inflasi tahunan berdasarkan IHK.',
  },
  unemployment: {
    id: 'unemployment',
    title: 'Tingkat pengangguran terbuka',
    unit: '% angkatan kerja',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [7.07, 6.49, 5.86, 5.32, 4.91],
    source: 'BPS — Survei Angkatan Kerja Nasional (Sakernas), Agustus',
    year: 2024,
    note: 'Diukur setiap Agustus melalui Sakernas.',
  },
  poverty: {
    id: 'poverty',
    title: 'Penduduk miskin',
    unit: '% penduduk',
    years: [2021, 2022, 2023, 2024],
    values: [9.7, 9.6, 9.4, 8.6],
    source: 'BPS — Profil Kemiskinan',
    year: 2024,
    note: 'September 2024: 8,57% atau sekitar 24,06 juta jiwa.',
  },
  hdi: {
    id: 'hdi',
    title: 'Indeks Pembangunan Manusia (IPM)',
    unit: 'skor 0–100',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [72.81, 73.16, 73.77, 74.39, 75.02],
    source: 'BPS — Indeks Pembangunan Manusia',
    year: 2024,
    note: 'Kategori “tinggi” menurut klasifikasi BPS.',
  },
  lifeExpectancy: {
    id: 'lifeExpectancy',
    title: 'Angka harapan hidup saat lahir',
    unit: 'tahun',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [73.37, 73.46, 73.7, 73.93, 74.15],
    source: 'BPS — komponen IPM',
    year: 2024,
    note: 'World Bank (metode berbeda) mencatat 71,3 tahun untuk 2024.',
  },
  expectedSchooling: {
    id: 'expectedSchooling',
    title: 'Harapan lama sekolah',
    unit: 'tahun',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [12.98, 13.08, 13.1, 13.15, 13.21],
    source: 'BPS — komponen IPM',
    year: 2024,
    note: 'Untuk penduduk usia 7 tahun ke atas.',
  },
  meanSchooling: {
    id: 'meanSchooling',
    title: 'Rata-rata lama sekolah',
    unit: 'tahun',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [8.48, 8.54, 8.69, 8.77, 8.85],
    source: 'BPS — komponen IPM',
    year: 2024,
    note: 'Untuk penduduk usia 25 tahun ke atas.',
  },
  expenditure: {
    id: 'expenditure',
    title: 'Pengeluaran riil per kapita (disesuaikan)',
    unit: 'Rp ribu per tahun',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [11013, 11156, 11479, 11899, 12341],
    source: 'BPS — komponen IPM',
    year: 2024,
    note: 'Pengeluaran per kapita per tahun yang disesuaikan, dalam ribu rupiah.',
  },
};

// Kartu KPI di beranda: nilai terbaru + sumber + tahun.
export const KPIS = [
  { label: 'Jumlah penduduk', value: '281,6 jt', sub: 'jiwa', series: 'populationWb', source: 'BPS', year: 2024, detail: 'Estimasi resmi BPS 2024; sensus 2020 mencatat 270,2 juta jiwa.' },
  { label: 'PDB', value: 'US$ 1,40 trln', sub: '', series: 'gdpPerCapita', source: 'World Bank', year: 2024, detail: 'PDB nominal 2024: US$ 1.396,3 miliar.' },
  { label: 'PDB per kapita', value: 'US$ 4.925', sub: '', series: 'gdpPerCapita', source: 'World Bank', year: 2024, detail: 'Naik dari US$ 3.872 pada 2020.' },
  { label: 'Pertumbuhan ekonomi', value: '5,03%', sub: 'per tahun', series: 'gdpGrowth', source: 'BPS', year: 2024, detail: 'Tumbuh di atas 5% tiga tahun berturut-turut (2022–2024).' },
  { label: 'Inflasi', value: '1,57%', sub: 'per tahun', series: 'inflation', source: 'BPS', year: 2024, detail: 'Turun dari 5,51% pada 2022.' },
  { label: 'Pengangguran terbuka', value: '4,91%', sub: 'angkatan kerja', series: 'unemployment', source: 'BPS, Sakernas Agustus', year: 2024, detail: 'Terendah sejak sebelum pandemi.' },
  { label: 'Penduduk miskin', value: '8,57%', sub: 'penduduk', series: 'poverty', source: 'BPS', year: 2024, detail: 'September 2024; sekitar 24,06 juta jiwa.' },
  { label: 'Indeks Pembangunan Manusia', value: '75,02', sub: 'skor 0–100', series: 'hdi', source: 'BPS', year: 2024, detail: 'Naik 0,63 poin dari 74,39 pada 2023.' },
  { label: 'Harapan hidup', value: '74,15', sub: 'tahun', series: 'lifeExpectancy', source: 'BPS', year: 2024, detail: 'Naik 0,22 tahun dari 2023.' },
];

// Provinsi terpadat, estimasi BPS 2024 (juta jiwa).
export const PROVINCES = [
  { name: 'Jawa Barat', population: 50.3, capital: 'Bandung', island: 'Jawa' },
  { name: 'Jawa Timur', population: 41.1, capital: 'Surabaya', island: 'Jawa' },
  { name: 'Jawa Tengah', population: 38.5, capital: 'Semarang', island: 'Jawa' },
  { name: 'Sumatera Utara', population: 15.6, capital: 'Medan', island: 'Sumatera' },
  { name: 'Banten', population: 12.6, capital: 'Serang', island: 'Jawa' },
  { name: 'DKI Jakarta', population: 11.35, capital: 'Jakarta', island: 'Jawa' },
  { name: 'Sulawesi Selatan', population: 9.5, capital: 'Makassar', island: 'Sulawesi' },
  { name: 'Lampung', population: 9.2, capital: 'Bandar Lampung', island: 'Sumatera' },
];

// Indikator pendidikan & kesehatan sekali ukur (bukan seri tahunan).
export const SNAPSHOTS = {
  literacy: { label: 'Angka melek huruf dewasa', value: '96%', year: 2020, source: 'World Bank, WDI', note: 'Penduduk usia 15 tahun ke atas yang bisa membaca dan menulis.' },
  enrollmentPrimary: { label: 'Partisipasi sekolah dasar (APM)', value: '100,0%', year: 2024, source: 'World Bank, WDI', note: 'Angka partisipasi murni jenjang SD.' },
  enrollmentSecondary: { label: 'Partisipasi sekolah menengah (APM)', value: '98,8%', year: 2024, source: 'World Bank, WDI', note: 'Angka partisipasi murni jenjang SMP/SMA.' },
  enrollmentTertiary: { label: 'Partisipasi pendidikan tinggi', value: '44,9%', year: 2023, source: 'World Bank, WDI', note: 'Angka partisipasi kasar jenjang perguruan tinggi.' },
  educationSpending: { label: 'Belanja pendidikan pemerintah', value: '1,3%', year: 2023, source: 'World Bank, WDI', note: 'Persen dari PDB.' },
  fertility: { label: 'Angka kelahiran total', value: '2,12', year: 2024, source: 'World Bank, WDI', note: 'Anak per perempuan usia subur.' },
  maternalMortality: { label: 'Kematian ibu melahirkan', value: '140', year: 2023, source: 'World Bank, WDI', note: 'Per 100.000 kelahiran hidup.' },
  urbanShare: { label: 'Penduduk perkotaan', value: '59,2%', year: 2024, source: 'World Bank, WDI', note: 'Persen dari total penduduk.' },
  internetUsers: { label: 'Pengguna internet', value: '72,8%', year: 2024, source: 'World Bank, WDI', note: 'Persen penduduk yang memakai internet.' },
  gniPerCapita: { label: 'PNDB per kapita (metode Atlas)', value: 'US$ 4.910', year: 2024, source: 'World Bank, WDI', note: 'Pendapatan nasional bruto per kapita.' },
  gdpPpp: { label: 'PDB (paritas daya beli)', value: 'US$ 4,66 trln', year: 2024, source: 'World Bank, WDI', note: 'PDB dalam dolar internasional.' },
  populationGrowth: { label: 'Laju pertumbuhan penduduk', value: '1,0%', year: 2024, source: 'World Bank, WDI', note: 'Per tahun.' },
};

// Daftar sumber lengkap untuk halaman Sumber & Metode.
export const SOURCES = [
  { name: 'Badan Pusat Statistik (BPS)', ref: 'bps.go.id', what: 'Jumlah penduduk, pertumbuhan PDB, inflasi, pengangguran (Sakernas), kemiskinan, IPM beserta komponennya, dan estimasi penduduk provinsi.' },
  { name: 'World Bank — World Development Indicators', ref: 'data.worldbank.org', what: 'PDB dan PDB per kapita, seri penduduk, harapan hidup, angka melek huruf, partisipasi sekolah, belanja pendidikan, fertilitas, kematian ibu, penduduk perkotaan, dan pengguna internet.' },
  { name: 'Bank Indonesia', ref: 'bi.go.id', what: 'Konteks target inflasi 2,5% ± 1% dan rilis inflasi bulanan.' },
  { name: 'Survei Angkatan Kerja Nasional (Sakernas)', ref: 'bps.go.id', what: 'Buku saku Sakernas Agustus 2024, katalog 2303014, rilis 20 Desember 2024.' },
  { name: 'BPS — Berita Resmi Statistik IPM 2024', ref: 'bps.go.id', what: 'IPM 2024 sebesar 75,02 (No. 85/11/Th.XXVII, 15 November 2024) dan IPM 2025 (No. 104/11/Th.XXVIII, 5 November 2025).' },
];

// Topik navigasi utama situs.
export const TOPICS = [
  { route: '#/penduduk', title: 'Penduduk', blurb: 'Berapa banyak kita, di mana tinggalnya, dan seberapa cepat bertambah.', accent: 'teal' },
  { route: '#/ekonomi', title: 'Ekonomi', blurb: 'PDB, pertumbuhan, inflasi, pekerjaan, dan kemiskinan.', accent: 'amber' },
  { route: '#/pendidikan', title: 'Pendidikan', blurb: 'Sekolah, melek huruf, dan pembangunan manusia.', accent: 'coral' },
  { route: '#/kesehatan', title: 'Kesehatan', blurb: 'Harapan hidup, kelahiran, dan kesehatan ibu.', accent: 'green' },
];

// Semua indikator yang bisa dicari: gabungan seri + snapshot + KPI.
export function allIndicators() {
  const list = [];
  for (const key of Object.keys(SERIES)) {
    const s = SERIES[key];
    list.push({ title: s.title, value: formatValue(s), unit: s.unit, source: s.source, year: s.year, route: routeForSeries(key) });
  }
  for (const key of Object.keys(SNAPSHOTS)) {
    const s = SNAPSHOTS[key];
    list.push({ title: s.label, value: s.value, unit: '', source: s.source, year: s.year, route: routeForSnapshot(key) });
  }
  return list;
}

export function routeForSeries(key) {
  if (key === 'populationWb') return '#/penduduk';
  if (key === 'gdpGrowth' || key === 'gdpPerCapita' || key === 'inflation' || key === 'unemployment' || key === 'poverty') return '#/ekonomi';
  if (key === 'hdi' || key === 'expectedSchooling' || key === 'meanSchooling' || key === 'expenditure') return '#/pendidikan';
  return '#/kesehatan';
}

export function routeForSnapshot(key) {
  if (key === 'literacy' || key.startsWith('enrollment') || key === 'educationSpending') return '#/pendidikan';
  if (key === 'fertility' || key === 'maternalMortality') return '#/kesehatan';
  if (key === 'urbanShare' || key === 'internetUsers' || key === 'populationGrowth') return '#/penduduk';
  return '#/ekonomi';
}

// Nilai terakhir sebuah seri, diformat dengan koma desimal Indonesia.
export function formatValue(series) {
  const v = series.values[series.values.length - 1];
  return String(v).replace('.', ',');
}

// Format angka Indonesia: ribuan dipisah titik, desimal koma.
export function formatId(n, decimals = 0) {
  return n.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
