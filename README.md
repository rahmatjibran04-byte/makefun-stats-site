[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/rahmatjibran04-byte/makefun-stats-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/rahmatjibran04-byte/makefun-stats-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# NusaData — Statistik Indonesia

Situs statistik nasional tentang Indonesia yang berjalan sepenuhnya dari berkas
statis, tanpa jaringan: beranda dengan sembilan angka kunci 2024, halaman
Penduduk, Ekonomi, Pendidikan, Kesehatan, serta Sumber & Metode — semuanya
dengan grafik batang/garis yang digambar kanvas murni, tabel yang bisa dicari
dan diurutkan, pencarian indikator, pengalih tema terang/gelap, dan tata letak
ponsel yang berfungsi.

Setiap angka menampilkan sumber dan tahunnya. Data dikutip dari publikasi
resmi [BPS](https://www.bps.go.id) dan [World Bank](https://data.worldbank.org)
(World Development Indicators), misalnya: penduduk 281,6 juta jiwa (BPS,
2024), PDB US$ 1,40 triliun (World Bank, 2024), PDB per kapita US$ 4.925
(World Bank, 2024), inflasi 1,57% (BPS, 2024), pengangguran terbuka 4,91%
(BPS, Agustus 2024), penduduk miskin 8,57% (BPS, September 2024), dan IPM
75,02 (BPS, 2024).

## Menjalankan

```sh
node serve.ts        # sajikan app/ di http://localhost:8080
```

Buka `http://localhost:8080` di peramban desktop atau ponsel. Tidak ada
langkah build dan tidak ada permintaan jaringan.

## Menyerahkan (program entri)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `app/` dan `screenshots/` ke direktori keluaran dan menulis
`dossier.json` dengan `buildDossier` dari `vendor/makefun-frontend.ts`.

## Struktur

- `app/index.html` — kerangka halaman (header, navigasi, footer)
- `app/style.css` — seluruh gaya, termasuk tema gelap dan tata letak ponsel
- `app/data.js` — semua angka beserta sumber dan tahunnya
- `app/charts.js` — grafik batang/garis di atas kanvas, tanpa library
- `app/views.js` — satu fungsi render per halaman + kontrolnya
- `app/main.js` — router hash, tema, dan navigasi ponsel
- `screenshots/` — 4 tangkapan layar situs yang sedang berjalan
- `vendor/makefun-frontend.ts` — pustaka make.fun dari kit (tidak diubah)

## Kompetisi

Entri untuk [Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
di make.fun. Lisensi: MIT.
