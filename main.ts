// NusaData — main.ts (Node 22, standard library only)
// Program penyerahan entri: menyalin app/ dan screenshots/ dari samping berkas
// ini ke direktori keluaran, lalu menulis dossier.json dengan buildDossier dari
// vendor/makefun-frontend.ts (salinan kit yang tidak diubah).
//
//   MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Di dalam grader, MAKEFUN_OUTPUT_DIR tidak diset dan keluaran ditulis ke
// /output. Program ini deterministik: dua kali jalan menulis byte yang sama,
// dan tidak pernah mengubah mode direktori keluaran.

import { chmodSync, cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const APP_LIMITS = { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 };

// Samakan mode hasil tulisan agar selalu terbaca siapa pun yang memeriksa:
// berkas 0644, direktori 0755. Direktori keluaran itu sendiri TIDAK PERNAH
// disentuh — platform yang memilikinya — hanya isi di dalamnya.
function normalizeModes(root) {
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const p = join(root, entry.name);
    if (entry.isDirectory()) {
      chmodSync(p, 0o755);
      normalizeModes(p);
    } else if (entry.isFile()) {
      chmodSync(p, 0o644);
    }
  }
}

function handIn() {
  mkdirSync(out, { recursive: true });
  cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
  mkdirSync(join(out, 'screenshots'), { recursive: true });
  if (existsSync(join(here, 'screenshots'))) {
    cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
  }
  const dossier = buildDossier(out, APP_LIMITS);
  writeFileSync(join(out, 'dossier.json'), dossier);
  normalizeModes(join(out, 'app'));
  normalizeModes(join(out, 'screenshots'));
  chmodSync(join(out, 'app'), 0o755);
  chmodSync(join(out, 'screenshots'), 0o755);
  chmodSync(join(out, 'dossier.json'), 0o644);
  const countFiles = (dir) => readdirSync(dir, { recursive: true })
    .filter((p) => statSync(join(dir, p)).isFile()).length;
  console.log(`NusaData handed in to ${out} (${countFiles(join(out, 'app'))} app files, dossier ${dossier.length} bytes)`);
}

handIn();
