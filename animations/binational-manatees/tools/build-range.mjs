#!/usr/bin/env node
/*
 * build-range.mjs — regenerates the small distribution map of the Greater Caribbean manatee
 * (Trichechus manatus manatus) for the binational-manatees animation.
 *
 * Writes (relative to animations/binational-manatees/):
 *   data/range.json       land, range lines (mainland coast + Greater Antilles), study frame, labels
 *   assets/svg/range.svg  standalone preview (documentation only)
 *
 * Projection (binding), viewBox 0 0 800 470 (the top 470 units of the 800 x 600 stage):
 *   x = (lon + 100) * 11.9      y = (29 - lat) * 11.9
 * Clip frame: lon -100.0 ... -32.773, lat 29.0 ... -10.496.
 *
 * Data: Natural Earth 1:50m land (public domain). Download into a temp directory, NOT the project:
 *
 *   D=$(mktemp -d) && cd "$D" && curl -sSLO https://naciscdn.org/naturalearth/50m/physical/ne_50m_land.zip \
 *     && mkdir -p ne_50m_land && unzip -oq ne_50m_land.zip -d ne_50m_land
 *
 * Run (Node >= 18; mapshaper is fetched on the fly with npx, nothing is added to the project):
 *
 *   node animations/binational-manatees/tools/build-range.mjs "$D"
 *
 * The range line is SCHEMATIC: it is the Natural Earth mainland coast between two end points
 * (Veracruz, Mexico and Alagoas, Brazil — the subspecies' range "from southern Mexico to
 * northern Brazil" after the IUCN description), with inlets, estuaries and lagoons cut across.
 * It is not a surveyed distribution.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const NE = process.argv[2];
if (!NE || !existsSync(join(NE, 'ne_50m_land', 'ne_50m_land.shp'))) {
  console.error('usage: node build-range.mjs <dir containing ne_50m_land/ne_50m_land.shp>');
  process.exit(1);
}
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------- projection & frame
const K = 11.9, W = 800, H = 470;
const LON0 = -100, LAT0 = 29;
const LON1 = LON0 + W / K, LAT1 = LAT0 - H / K; // -32.773, -10.496
const px = (lon) => (lon - LON0) * K;
const py = (lat) => (LAT0 - lat) * K;
const proj = ([lon, lat]) => [px(lon), py(lat)];
const r1 = (v) => Math.round(v * 10) / 10;

// ---------------------------------------------------------------- named constants
// Simplification of the land (Douglas-Peucker tolerance, stage units) and the smallest island
// kept (area in square stage units; 1 unit ~ 9.3 km, so 4 units^2 ~ 350 km^2).
const LAND_TOL = 0.7;
const MIN_ISLAND_AREA = 4;

// End points of the mainland range line (nearest coast vertex is used).
const RANGE_START = [-96.2, 19.5]; // Veracruz, Gulf of Mexico
const RANGE_END = [-36.0, -10.0];  // Alagoas, north-east Brazil

// Inlet cutting: walking along the coast, whenever the line comes back within GAP units of an
// earlier point (within WIN resampled steps), everything in between is skipped (river mouths,
// lagoons, Lake Maracaibo's strait...).
const GAP = 7, WIN = 1600, FINE_STEP = 0.5;
// Explicit shortcuts for wide estuaries the GAP rule cannot close: the coast between the two
// vertices nearest these points is replaced by a straight line.
const SHORTCUTS = [
  ['Gulf of Venezuela + Lake Maracaibo (Guajira tip to Paraguana tip)', [-71.65, 12.45], [-70.2, 12.15]],
  ['Amazon & Para estuary (Marajo is an island)', [-50.0, 1.75], [-47.9, -0.65]],
];
// Final spacing of the range points and light smoothing passes (1-2-1 kernel).
const RANGE_STEP = 4.2, SMOOTH_PASSES = 2;

// Islands outlined as part of the range: the land ring containing each reference point.
const ISLANDS = [
  ['cuba', [-79.5, 22.0]],
  ['jamaica', [-77.3, 18.15]],
  ['hispaniola', [-71.5, 19.0]],
  ['puerto-rico', [-66.5, 18.25]],
];

// Study frame (Costa Rica - Panama), lon/lat corners.
const STUDY = { lonW: -84.5, lonE: -80.7, latN: 11.3, latS: 8.5 };

// Label anchors (centre of the word; use text-anchor="middle").
const LABELS = {
  mexico: [-95.3, 17.2],
  antilles: [-68.6, 21.3],
  brazil: [-46.0, -6.0],
  caribbean: [-76.5, 14.6],
};

// ---------------------------------------------------------------- Natural Earth via mapshaper
const TMP = mkdtempSync(join(tmpdir(), 'bm-range-'));
const BBOX = [LON0, LAT1, LON1, LAT0].map((v) => v.toFixed(5)).join(',');
const out = join(TMP, 'land.json');
execFileSync('npx', ['-y', 'mapshaper', join(NE, 'ne_50m_land', 'ne_50m_land.shp'), '-clip', `bbox=${BBOX}`,
  '-o', 'format=geojson', 'precision=0.00001', out], { stdio: ['ignore', 'ignore', 'inherit'] });
const landF = JSON.parse(readFileSync(out, 'utf8')).features || [];
const polys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);

// ---------------------------------------------------------------- geometry helpers
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
  let t = L ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}
function dp(pts, tol) {
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const st = [[0, pts.length - 1]];
  while (st.length) {
    const [i, j] = st.pop(); let m = -1, md = tol;
    for (let k = i + 1; k < j; k++) { const d = segDist(pts[k], pts[i], pts[j]); if (d > md) { md = d; m = k; } }
    if (m > 0) { keep[m] = 1; st.push([i, m], [m, j]); }
  }
  return pts.filter((_, k) => keep[k]);
}
function ringArea(r) { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; }
function inRing(p, r) {
  let c = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j];
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
function resample(pts, step) {
  const o = [pts[0]]; let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], L = dist(a, b); let t = step - carry;
    while (t <= L) { o.push([a[0] + (b[0] - a[0]) * t / L, a[1] + (b[1] - a[1]) * t / L]); t += step; }
    carry = L - (t - step);
  }
  if (dist(o[o.length - 1], pts[pts.length - 1]) > step * 0.4) o.push(pts[pts.length - 1]);
  else o[o.length - 1] = pts[pts.length - 1];
  return o;
}
const fmt = (p) => `${r1(p[0])} ${r1(p[1])}`;
const lineD = (pts) => 'M' + pts.map(fmt).join('L');
const ringD = (pts) => 'M' + pts.map(fmt).join('L') + 'Z';
const onFrame = ([x, y]) => x < 0.05 || x > W - 0.05 || y < 0.05 || y > H - 0.05;

// ---------------------------------------------------------------- land
// Projected rings (unsimplified) and their simplified versions.
const rawRings = [];
for (const f of landF) for (const poly of polys(f.geometry)) for (const ring of poly) {
  let r = ring.map(proj);
  if (dist(r[0], r[r.length - 1]) < 1e-9) r = r.slice(0, -1);
  rawRings.push(r);
}
function simplifyRing(r) {
  let s = dp([...r, r[0]], LAND_TOL).slice(0, -1);
  s = s.map((p) => [r1(p[0]), r1(p[1])]).filter((p, i, a) => i === 0 || fmt(p) !== fmt(a[i - 1]));
  return s.length >= 3 ? s : null;
}
const keptRings = rawRings.filter((r) => Math.abs(ringArea(r)) >= MIN_ISLAND_AREA).map(simplifyRing).filter(Boolean);
const land = keptRings.map(ringD).join('');

// islands
const islands = ISLANDS.map(([id, ll]) => {
  const p = proj(ll);
  const r = keptRings.find((k) => inRing(p, k));
  if (!r) throw new Error(`island ${id} not found`);
  return { id, d: ringD(r) };
});

// ---------------------------------------------------------------- mainland range line
const mainRing = rawRings.reduce((a, b) => (Math.abs(ringArea(b)) > Math.abs(ringArea(a)) ? b : a));
const nearestIdx = (ring, p) => ring.reduce((bi, q, i) => (dist(q, p) < dist(ring[bi], p) ? i : bi), 0);
const n = mainRing.length;
const i0 = nearestIdx(mainRing, proj(RANGE_START)), i1 = nearestIdx(mainRing, proj(RANGE_END));
const walk = (dir) => { const o = []; for (let i = i0; ; i = (i + dir + n) % n) { o.push(mainRing[i]); if (i === i1) break; } return o; };
// of the two ways round the ring, take the one that never touches the frame (the other one runs
// up the Gulf coast to the frame edge and back down the Pacific side)
let path = [walk(1), walk(-1)].map((w) => ({ w, f: w.filter(onFrame).length })).sort((a, b) => a.f - b.f || a.w.length - b.w.length)[0].w;
// explicit estuary shortcuts
for (const [, a, b] of SHORTCUTS) {
  const ia = nearestIdx(path, proj(a)), ib = nearestIdx(path, proj(b));
  const [lo, hi] = ia < ib ? [ia, ib] : [ib, ia];
  path = [...path.slice(0, lo + 1), ...path.slice(hi)];
}
// generic inlet cutting
const fine = resample(path, FINE_STEP);
const cut = [];
for (let i = 0; i < fine.length;) {
  cut.push(fine[i]);
  let jump = -1;
  for (let j = Math.min(fine.length - 1, i + WIN); j > i + Math.ceil(GAP / FINE_STEP) * 2; j--) if (dist(fine[i], fine[j]) < GAP) { jump = j; break; }
  i = jump > 0 ? jump : i + 1;
}
let rangePts = resample(dp(cut, 0.5), RANGE_STEP);
for (let it = 0; it < SMOOTH_PASSES; it++) {
  rangePts = rangePts.map((p, i, a) => (i === 0 || i === a.length - 1) ? p
    : [(a[i - 1][0] + 2 * p[0] + a[i + 1][0]) / 4, (a[i - 1][1] + 2 * p[1] + a[i + 1][1]) / 4]);
}
rangePts = rangePts.map((p) => [r1(p[0]), r1(p[1])]);
// sanity: no self-intersection, no doubling back
function segX(a, b, c, d) {
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return o(a, b, c) !== o(a, b, d) && o(c, d, a) !== o(c, d, b);
}
let crossings = 0;
for (let i = 0; i < rangePts.length - 1; i++) for (let j = i + 2; j < rangePts.length - 1; j++)
  if (segX(rangePts[i], rangePts[i + 1], rangePts[j], rangePts[j + 1])) crossings++;
let sharp = 0;
for (let i = 1; i < rangePts.length - 1; i++) {
  const a = rangePts[i - 1], b = rangePts[i], c = rangePts[i + 1];
  const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - b[0], c[1] - b[1]];
  if ((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v)) < -0.5) sharp++;
}
if (crossings) console.warn(`WARNING: range polyline has ${crossings} self-crossings`);
if (sharp) console.warn(`WARNING: range polyline has ${sharp} turns sharper than 120 degrees`);

// ---------------------------------------------------------------- assemble
const studyArea = {
  x: r1(px(STUDY.lonW)), y: r1(py(STUDY.latN)),
  width: r1(px(STUDY.lonE) - px(STUDY.lonW)), height: r1(py(STUDY.latS) - py(STUDY.latN)),
};
const labels = Object.fromEntries(Object.entries(LABELS).map(([k, ll]) => [k, proj(ll).map(r1)]));
const range = {
  status: 'Land is real Natural Earth 1:50m data (simplified to about 0.7 units); the range line is SCHEMATIC (the coasts within the subspecies\' range from Veracruz to Alagoas plus the Greater Antilles, after the IUCN description and the lab\'s public summary, with estuaries and inlets cut across), not a surveyed distribution.',
  source: 'Natural Earth (public domain)',
  viewBox: [0, 0, W, H],
  projection: 'x=(lon+100)*11.9; y=(29-lat)*11.9',
  land,
  range: [{ id: 'mainland', d: lineD(rangePts), points: rangePts }, ...islands],
  studyArea,
  labels,
};
writeFileSync(join(ROOT, 'data/range.json'), JSON.stringify(range));

// ---------------------------------------------------------------- preview SVG
const L = labels;
const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">`,
  `<rect width="${W}" height="${H}" fill="#d9ece8"/>`,
  `<path d="${land}" fill="#f6f3ea" stroke="#9eb3a5" stroke-width="0.6" stroke-linejoin="round" fill-rule="evenodd"/>`,
  `<g fill="none" stroke="#0a7c7e" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" stroke-opacity="0.85">${range.range.map((r) => `<path d="${r.d}"/>`).join('')}</g>`,
  `<rect x="${studyArea.x}" y="${studyArea.y}" width="${studyArea.width}" height="${studyArea.height}" fill="none" stroke="#0e2a3a" stroke-width="1.5"/>`,
  `<g font-family="sans-serif" font-size="15" fill="#4e6874" text-anchor="middle">`,
  `<text x="${L.mexico[0]}" y="${L.mexico[1]}" dominant-baseline="middle">Mexico</text>`,
  `<text x="${L.antilles[0]}" y="${L.antilles[1]}" dominant-baseline="middle">Antilles</text>`,
  `<text x="${L.brazil[0]}" y="${L.brazil[1]}" dominant-baseline="middle">Brazil</text>`,
  `<text x="${L.caribbean[0]}" y="${L.caribbean[1]}" dominant-baseline="middle" font-style="italic">Caribbean Sea</text></g>`,
  '</svg>',
].join('\n');
writeFileSync(join(ROOT, 'assets/svg/range.svg'), svg + '\n');

const kb = (p) => (readFileSync(join(ROOT, p)).length / 1024).toFixed(1) + ' KB';
console.log(`range.json ${kb('data/range.json')}, range.svg ${kb('assets/svg/range.svg')}; land rings ${keptRings.length}`);
console.log(`mainland points: ${rangePts.length}, start ${rangePts[0]}, end ${rangePts[rangePts.length - 1]}, crossings ${crossings}, sharp turns ${sharp}`);
