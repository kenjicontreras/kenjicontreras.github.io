// Builds the data files of the vector-spectra story.
//   node tools/make-data.mjs
//
// data/species.json    REAL: species, abbreviations and spectrum counts copied from Tables 1 and 2
//                      of Merchan et al. 2023 (Artif. Intell. Life Sci. 3:100071).
// data/spectra.json    ILLUSTRATIVE: drawn spectrum curves (a decaying baseline with peaks), in the
//                      general form of the paper's Fig. 2. They are not measured spectra.
// data/embedding.json  ILLUSTRATIVE: one point per spectrum (826 + 310), scattered at first and
//                      then gathered into one island per species. The number of points per island
//                      is the real spectrum count; the positions are invented. As in the paper,
//                      mosquitoes and ticks are two separate maps (one model per data set).
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
let seed = 100071;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(6.2832 * rand());
const r1 = (v) => Math.round(v * 10) / 10;

// ── species (real) ─────────────────────────────────────────────────────────
const mosquitoes = [
  ['Anopheles albimanus', 119], ['Anopheles apicimacula', 110], ['Anopheles aquasalis', 56],
  ['Anopheles darlingi', 40], ['Anopheles malefactor', 39], ['Anopheles nuneztovari', 192],
  ['Anopheles pseudopunctipennis', 45], ['Anopheles punctimacula', 81], ['Anopheles strodei', 49],
  ['Anopheles triannulatus', 26], ['Anopheles neivai', 24], ['Chagasia bathana', 45],
];
const ticks = [
  ['Amblyomma cajennense', 6], ['Amblyomma calcaratum', 15], ['Amblyomma dissimile', 9],
  ['Amblyomma geayi', 12], ['Amblyomma nodosum', 10], ['Amblyomma oblongoguttatum', 8],
  ['Amblyomma ovale', 11], ['Amblyomma pecarium', 11], ['Amblyomma sabanerae', 11],
  ['Amblyomma varium', 9], ['Amblyomma naponense', 9], ['Amblyomma tapirellum', 56],
  ['Dermacentor nitens', 60], ['Haemaphysalis juxtakochi', 6], ['Ixodes affinis', 9],
  ['Ixodes boliviensis', 11], ['Rhipicephalus microplus', 50], ['Rhipicephalus sanguineus', 6],
];
const species = {
  status: 'real: Tables 1 and 2 of Merchan et al. 2023. The tick counts in Table 2 add up to 309; the paper gives 310 in total.',
  totals: { mosquitoes: 826, ticks: 310 },
  mosquitoes: mosquitoes.map(([name, n]) => ({ name, n })),
  ticks: ticks.map(([name, n]) => ({ name, n })),
};
writeFileSync(join(out, 'species.json'), JSON.stringify(species, null, 1));

// ── spectra (illustrative) ─────────────────────────────────────────────────
// A curve in a w × h box: x = mass, y = intensity (up). `peaks` are [position 0..1, height 0..1].
function spectrum(w, h, peaks, noise = 0.03, n = 220) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let v = 0.2 * Math.exp(-t * 2.6) + 0.035; // baseline falling with mass
    for (const [p, a] of peaks) v += a * Math.exp(-(((t - p) / 0.006) ** 2));
    v += noise * (0.4 + 0.6 * Math.exp(-t * 2)) * gauss() * 0.5;
    v = Math.max(0.01, Math.min(1, v));
    d += `${i ? 'L' : 'M'}${r1(t * w)},${r1(h - v * h)}`;
  }
  return d;
}
const jitter = (peaks, dx, da) => peaks.map(([p, a]) => [p + dx * gauss(), Math.max(0.05, a * (1 + da * gauss()))]);
const speciesA = [[0.11, 0.3], [0.2, 0.22], [0.29, 0.86], [0.345, 0.18], [0.47, 0.3], [0.62, 0.55], [0.71, 0.14], [0.86, 0.1]];
const speciesB = [[0.08, 0.5], [0.17, 0.75], [0.26, 0.2], [0.41, 0.6], [0.52, 0.16], [0.58, 0.34], [0.77, 0.4], [0.9, 0.12]];
const spectra = {
  status: 'illustrative: drawn curves in the general form of a raw MALDI-TOF spectrum (compare Fig. 2 of the paper); not measured data',
  main: { w: 470, h: 150, d: spectrum(470, 150, speciesA, 0.035, 320) },
  cards: {
    w: 180,
    h: 62,
    anchor: spectrum(180, 62, jitter(speciesA, 0.002, 0.08), 0.05, 120),
    positive: spectrum(180, 62, jitter(speciesA, 0.004, 0.22), 0.06, 120),
    negative: spectrum(180, 62, jitter(speciesB, 0.002, 0.08), 0.05, 120),
  },
};
writeFileSync(join(out, 'spectra.json'), JSON.stringify(spectra));

// ── embedding (illustrative) ───────────────────────────────────────────────
// Each family has its own panel on the stage (stage units, viewBox 800 × 600).
const panels = { m: { x: 40, y: 96, w: 350, h: 380 }, t: { x: 410, y: 96, w: 350, h: 380 } };
// Island centres in units from the panel's top-left corner. Mosquito islands are well apart;
// several tick islands crowd together in the middle, as in the paper's Fig. 11B. The top 50
// units of the mosquito panel are kept free for the name tag of step 7.
const centres = {
  m: [[70, 110], [280, 112], [176, 92], [48, 214], [304, 218], [176, 204], [110, 170], [262, 300], [100, 306], [246, 172], [182, 330], [40, 340]],
  t: [[150, 170], [60, 80], [182, 196], [286, 66], [204, 160], [166, 214], [296, 170], [134, 196], [50, 200], [198, 226], [176, 62], [80, 312], [272, 304], [222, 190], [56, 140], [304, 236], [176, 318], [146, 236]],
};
const points = [];
const islands = [];
for (const [f, list] of [['m', mosquitoes], ['t', ticks]]) {
  const panel = panels[f];
  list.forEach(([name, n], s) => {
    const cx = panel.x + centres[f][s][0];
    const cy = panel.y + centres[f][s][1];
    const r = 5 + 2.6 * Math.sqrt(n); // island radius grows with the number of spectra
    islands.push({ f, s, name, n, x: r1(cx), y: r1(cy), r: r1(r) });
    for (let i = 0; i < n; i++) {
      const rad = Math.sqrt(rand()) * (r - 4);
      const ang = rand() * 6.2832;
      points.push({
        f,
        s,
        a: [r1(panel.x + 10 + rand() * (panel.w - 20)), r1(panel.y + 10 + rand() * (panel.h - 20))],
        b: [r1(cx + Math.cos(ang) * rad), r1(cy + Math.sin(ang) * rad)],
      });
    }
  });
}
writeFileSync(
  join(out, 'embedding.json'),
  JSON.stringify({
    status: 'illustrative: point counts per species are real (Tables 1 and 2), positions are invented',
    panels,
    islands,
    points,
  }),
);
console.log('species', mosquitoes.length + ticks.length, 'points', points.length, 'islands', islands.length);
