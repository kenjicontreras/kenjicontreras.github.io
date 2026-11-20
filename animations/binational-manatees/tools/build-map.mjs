#!/usr/bin/env node
/*
 * build-map.mjs — regenerates the stage map for the binational-manatees animation.
 *
 * Writes (relative to animations/binational-manatees/):
 *   data/map.json        land, countries, borders, rivers, Caribbean coast line, places, labels
 *   data/stations.json   hydrophones digitised from Guzman et al. 2025, Fig. 1
 *   assets/svg/coast.svg standalone preview
 *
 * Projection (binding, see style.md "Stage geometry"), viewBox 0 0 800 600:
 *   x = (lon + 84.5) * 0.9848 * 214.3      y = (11.3 - lat) * 214.3
 * The clip frame is the whole viewBox: lon -84.5 ... -80.709, lat 11.3 ... 8.5.
 * (x = 800 is lon -80.709; the -80.767 quoted elsewhere omits the 0.9848 factor and would
 * leave an empty 12-unit strip on the right of the stage.)
 *
 * Data: Natural Earth 1:10m (public domain). Download into a temp directory, NOT the project:
 *
 *   D=$(mktemp -d) && cd "$D" && for u in physical/ne_10m_coastline physical/ne_10m_land \
 *     cultural/ne_10m_admin_0_countries physical/ne_10m_rivers_lake_centerlines; do \
 *     curl -sSLO "https://naciscdn.org/naturalearth/10m/$u.zip"; \
 *     n=$(basename $u); mkdir -p $n && unzip -oq $n.zip -d $n; done
 *
 * Run (Node >= 18; mapshaper is fetched on the fly with npx, nothing is added to the project):
 *
 *   node animations/binational-manatees/tools/build-map.mjs "$D"
 *
 * The small rivers and the stations are not in Natural Earth: they are hand-digitised from
 * Figure 1 of Guzman et al. 2025 (Front. Mar. Sci. 12:1661294, CC BY 4.0) as pixel positions
 * in the full-resolution embedded figure (3265 x 2646 px; `pdfimages -png -f 3 -l 3 <pdf>`),
 * georeferenced with the panel tick marks measured below.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const NE = process.argv[2];
if (!NE || !existsSync(NE)) {
  console.error('usage: node build-map.mjs <natural-earth-download-dir>');
  process.exit(1);
}
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------- projection & frame
const KX = 0.9848 * 214.3, KY = 214.3;
const W = 800, H = 600;
const LON0 = -84.5, LAT0 = 11.3;
const LON1 = LON0 + W / KX, LAT1 = LAT0 - H / KY; // -80.709, 8.5
const px = (lon) => (lon - LON0) * KX;
const py = (lat) => (LAT0 - lat) * KY;
const proj = ([lon, lat]) => [px(lon), py(lat)];
const r1 = (v) => Math.round(v * 10) / 10;

// ---------------------------------------------------------------- Figure 1 georeference
// Measured on the 3265 x 2646 px figure. Both panels are plate carree (same px per minute
// on both axes, checked on the Costa Rica panel which has two ticks on each axis).
// Costa Rica panel: 83°40'W at x=417, 83°W at x=1566; 11°N at y=497, 10°N at y=2219.5.
// Panama panel:     82°40'W at x=1752;  9°40'N at y=300.5, 9°20'N at y=1873.
const CRP = { lon0: -(83 + 40 / 60), x0: 417, lat0: 11, y0: 497, ppm: (1566 - 417) / 40 };
const PAP = { lon0: -(82 + 40 / 60), x0: 1752, lat0: 9 + 40 / 60, y0: 300.5, ppm: (1873 - 300.5) / 20 };
const fig = (P, [fx, fy]) => [P.lon0 + (fx - P.x0) / P.ppm / 60, P.lat0 - (fy - P.y0) / P.ppm / 60];

// Hydrophone dot centres (colour-blob centroids; S8/S9 overlap, split by eye).
const STATIONS = [
  ['CR', 'S1', 'Barra del Colorado', [480, 746]],
  ['CR', 'S2', 'Barra del Colorado', [516, 850]],
  ['CR', 'S3', 'Barra del Colorado', [567, 997]],
  ['CR', 'S4', 'Barra del Colorado', [550, 865]],
  ['CR', 'S5', 'Barra del Colorado', [469, 870]],
  ['CR', 'S6', 'Tortuguero', [758, 1448]],
  ['CR', 'S7', 'Tortuguero', [821, 1572]],
  ['CR', 'S8', 'Pacuare', [1095, 1888]],
  ['CR', 'S9', 'Pacuare', [1082, 1894]],
  // Panama: S1, S2, S4, S5 = Changuinola river system, S3 = San San (paper §2.2, Table 1)
  ['PA', 'S1', 'Changuinola', [2659, 1276]],
  ['PA', 'S2', 'Changuinola', [2735, 1194]],
  ['PA', 'S3', 'San San', [2396, 1121]],
  ['PA', 'S4', 'Changuinola', [2603, 1223]],
  ['PA', 'S5', 'Changuinola', [2558, 1210]],
];

// Rivers traced from Figure 1, listed from inland to the mouth (figure pixels).
const FIG_RIVERS = [
  ['Río Colorado', CRP, [[250, 890], [300, 925], [360, 935], [400, 958], [440, 970], [480, 955], [510, 930], [538, 900], [553, 872]]],
  ['Río Tortuguero', CRP, [[470, 1282], [530, 1278], [565, 1268], [600, 1248], [632, 1218], [662, 1205]]],
  ['Río Jaloba', CRP, [[740, 1722], [775, 1712], [812, 1692], [850, 1655], [883, 1617]]],
  ['Río Matina', CRP, [[1000, 2110], [1060, 2097], [1105, 2075], [1135, 2040], [1180, 2010], [1232, 2037]]],
  ['Río San San', PAP, [[2299, 1115], [2352, 1107], [2404, 1088], [2454, 1062], [2494, 1025], [2499, 980], [2454, 942], [2409, 908]]],
  ['Río Changuinola', PAP, [[2299, 1895], [2367, 1820], [2404, 1700], [2419, 1580], [2457, 1497], [2532, 1445], [2622, 1400], [2712, 1377], [2772, 1332], [2802, 1272], [2779, 1227]]],
];

const PLACES = [
  ['Barra del Colorado', -83.590, 10.785],
  ['Tortuguero', -83.5024, 10.5427],
  ['Limón', -83.0359, 9.9907],
  ['Changuinola', -82.5167, 9.4306],
  ['Bocas del Toro', -82.2420, 9.3403],
];
const LABELS = { CR: [-84.05, 10.25], PA: [-81.75, 8.78], sea: [-81.75, 10.55] };

// ---------------------------------------------------------------- Natural Earth via mapshaper
const TMP = mkdtempSync(join(tmpdir(), 'bm-map-'));
const BBOX = [LON0, LAT1, LON1, LAT0].map((v) => v.toFixed(5)).join(',');
function clip(layer, extra = []) {
  const shp = join(NE, layer, `${layer}.shp`);
  const out = join(TMP, `${layer}.json`);
  execFileSync('npx', ['-y', 'mapshaper', shp, ...extra, '-clip', `bbox=${BBOX}`,
    '-o', 'format=geojson', 'precision=0.00001', out], { stdio: ['ignore', 'ignore', 'inherit'] });
  const g = JSON.parse(readFileSync(out, 'utf8'));
  return g.features || [];
}
const polys = (geom) => (geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : []);
const lines = (geom) => (geom.type === 'LineString' ? [geom.coordinates] : geom.type === 'MultiLineString' ? geom.coordinates : []);

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
function resample(pts, step) {
  const out = [pts[0]]; let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], L = dist(a, b); let t = step - carry;
    while (t <= L) { out.push([a[0] + (b[0] - a[0]) * t / L, a[1] + (b[1] - a[1]) * t / L]); t += step; }
    carry = L - (t - step);
  }
  if (dist(out[out.length - 1], pts[pts.length - 1]) > step * 0.4) out.push(pts[pts.length - 1]);
  else out[out.length - 1] = pts[pts.length - 1];
  return out;
}
const fmt = (p) => `${r1(p[0])} ${r1(p[1])}`;
const lineD = (pts) => 'M' + pts.map(fmt).join('L');
const ringD = (pts) => 'M' + pts.map(fmt).join('L') + 'Z';
function cleanRing(ring, tol, minArea) {
  let r = ring.map(proj);
  if (dist(r[0], r[r.length - 1]) < 1e-9) r = r.slice(0, -1);
  if (Math.abs(ringArea(r)) < minArea) return null;
  r = dp([...r, r[0]], tol).slice(0, -1);
  // drop duplicate points after rounding
  r = r.filter((p, i) => i === 0 || fmt(p) !== fmt(r[i - 1]));
  return r.length >= 3 ? r : null;
}
function polyD(features, tol, minArea) {
  const parts = [];
  for (const f of features) for (const poly of polys(f.geometry)) for (const ring of poly) {
    const r = cleanRing(ring, tol, minArea); if (r) parts.push(ringD(r));
  }
  return parts.join('');
}

// ---------------------------------------------------------------- land & countries
const landF = clip('ne_10m_land');
const ctyF = clip('ne_10m_admin_0_countries', ['-filter', "['NI','CR','PA'].indexOf(ISO_A2) > -1"]);
const LAND_TOL = 0.55, CTY_TOL = 0.9, MIN_AREA = 0.6;
const land = polyD(landF, LAND_TOL, MIN_AREA);
const NAMES = { NI: 'Nicaragua', CR: 'Costa Rica', PA: 'Panama' };
const countries = ['NI', 'CR', 'PA'].map((id) => {
  const f = ctyF.filter((x) => x.properties.ISO_A2 === id);
  return { id, name: NAMES[id], d: polyD(f, CTY_TOL, MIN_AREA) };
});

// borders = runs of vertices shared by two country rings
const onFrame = ([x, y]) => x < 0.05 || x > W - 0.05 || y < 0.05 || y > H - 0.05;
function border(a, b) {
  const key = (p) => p[0].toFixed(5) + ',' + p[1].toFixed(5);
  const ringsOf = (id) => ctyF.filter((x) => x.properties.ISO_A2 === id).flatMap((f) => polys(f.geometry).flat());
  const setB = new Set(ringsOf(b).flat().map(key));
  let best = [];
  for (const ring of ringsOf(a)) {
    const n = ring.length - 1, sh = ring.slice(0, n).map((p) => setB.has(key(p)));
    const start = sh.indexOf(false); if (start < 0) continue;
    let run = [];
    for (let k = 1; k <= n; k++) {
      const i = (start + k) % n;
      if (sh[i]) run.push(ring[i]); else { if (run.length > best.length) best = run; run = []; }
    }
    if (run.length > best.length) best = run;
  }
  let pts = best.map(proj);
  while (pts.length > 2 && onFrame(pts[0]) && onFrame(pts[1])) pts.shift();
  while (pts.length > 2 && onFrame(pts[pts.length - 1]) && onFrame(pts[pts.length - 2])) pts.pop();
  return dp(pts, 0.6);
}
const bNICR = border('CR', 'NI'), bCRPA = border('CR', 'PA');
const borders = [{ id: 'NI-CR', d: lineD(bNICR) }, { id: 'CR-PA', d: lineD(bCRPA) }];

// ---------------------------------------------------------------- rivers
const rivF = clip('ne_10m_rivers_lake_centerlines');
const rivers = [];
for (const f of rivF) {
  const nm = f.properties.name || '';
  if (!/San Juan/.test(nm)) continue; // keep the border river only; the rest come from Fig. 1
  for (const l of lines(f.geometry)) rivers.push({ name: 'Río San Juan', d: lineD(dp(l.map(proj), 0.6)), source: 'natural-earth' });
}
// The Sixaola is the CR-PA border; Natural Earth has no centreline, so reuse the admin border.
rivers.push({ name: 'Río Sixaola', d: lineD(bCRPA), source: 'natural-earth' });

// ---------------------------------------------------------------- Caribbean coast line
// Mainland coastline pieces from ne_10m_coastline, stitched; keep the one that enters at the
// top edge (Nicaragua) and runs to the east edge (Panama).
const coastF = clip('ne_10m_coastline');
let pieces = coastF.flatMap((f) => lines(f.geometry)).map((l) => l.map(proj));
let main = pieces.find((l) => (l[0][1] < 0.5 && l[l.length - 1][0] > W - 0.5) || (l[l.length - 1][1] < 0.5 && l[0][0] > W - 0.5));
if (!main) throw new Error('mainland Caribbean coast not found as a single piece');
if (main[0][1] > 0.5) main = main.reverse(); // NW -> E
// 1. resample densely, then cut out narrow inlets / spits / loops: whenever the line comes back
//    within GAP units of an earlier point, skip what lies between (river mouths, lagoon inlets).
let fine = resample(main, 0.5);
const GAP = 3.2, WIN = 1200;
const cut = [];
for (let i = 0; i < fine.length;) {
  cut.push(fine[i]);
  let jump = -1;
  for (let j = Math.min(fine.length - 1, i + WIN); j > i + 8; j--) if (dist(fine[i], fine[j]) < GAP) { jump = j; break; }
  i = jump > 0 ? jump : i + 1;
}
// 2. resample to the working spacing and smooth lightly (endpoints fixed on the frame)
let coastPts = resample(dp(cut, 0.4), 6.5);
for (let it = 0; it < 2; it++) {
  coastPts = coastPts.map((p, i, a) => (i === 0 || i === a.length - 1) ? p
    : [(a[i - 1][0] + 2 * p[0] + a[i + 1][0]) / 4, (a[i - 1][1] + 2 * p[1] + a[i + 1][1]) / 4]);
}
coastPts = coastPts.map((p) => [r1(p[0]), r1(p[1])]);
// sanity: no self-intersection
function segX(a, b, c, d) {
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return o(a, b, c) !== o(a, b, d) && o(c, d, a) !== o(c, d, b);
}
let crossings = 0;
for (let i = 0; i < coastPts.length - 1; i++) for (let j = i + 2; j < coastPts.length - 1; j++)
  if (segX(coastPts[i], coastPts[i + 1], coastPts[j], coastPts[j + 1])) crossings++;
if (crossings) console.warn(`WARNING: coast polyline has ${crossings} self-crossings`);

// Figure-1 rivers; the mouth is snapped onto the Natural Earth coastline when it is within
// 8 units, so the hand tracing meets the real coast.
for (const [name, P, pts] of FIG_RIVERS) {
  const q = pts.map((v) => proj(fig(P, v)));
  const end = q[q.length - 1];
  let best = null, bd = 8;
  for (let i = 1; i < main.length; i++) {
    const a = main[i - 1], b = main[i], dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
    const t = L ? Math.max(0, Math.min(1, ((end[0] - a[0]) * dx + (end[1] - a[1]) * dy) / L)) : 0;
    const c = [a[0] + t * dx, a[1] + t * dy], d = dist(end, c);
    if (d < bd) { bd = d; best = c; }
  }
  if (best && bd > 0.3) q.push(best);
  rivers.push({ name, d: lineD(q), source: 'redrawn-fig1' });
}

// ---------------------------------------------------------------- assemble
const places = PLACES.map(([name, lon, lat]) => ({ name, x: r1(px(lon)), y: r1(py(lat)) }));
const labels = Object.fromEntries(Object.entries(LABELS).map(([k, [lon, lat]]) => [k, [r1(px(lon)), r1(py(lat))]]));
const map = {
  status: 'Land, countries, borders, the Caribbean coast line and the Río San Juan are real Natural Earth 1:10m data (simplified to about 0.5 units); the six smaller rivers are approximate tracings from Guzman et al. 2025 Fig. 1 (source "redrawn-fig1"), the Río Sixaola is the Natural Earth CR-PA border, and the coast line is smoothed (inlets under about 1.5 km closed) for animation.',
  source: 'Natural Earth 1:10m (public domain); rivers and stations after Guzman et al. 2025, Fig. 1 (CC BY 4.0)',
  viewBox: [0, 0, W, H],
  projection: 'x=(lon+84.5)*0.9848*214.3; y=(11.3-lat)*214.3',
  land,
  countries,
  borders,
  rivers,
  coast: { d: lineD(coastPts), points: coastPts },
  places,
  labels,
};
const stations = {
  status: 'Positions digitised from Guzman et al. 2025, Fig. 1; approximate (about ±2 km).',
  stations: STATIONS.map(([c, s, system, q]) => {
    const [lon, lat] = fig(c === 'CR' ? CRP : PAP, q);
    return { id: `${c}-${s}`, label: s, country: c, system, lon: Math.round(lon * 1e4) / 1e4, lat: Math.round(lat * 1e4) / 1e4, x: r1(px(lon)), y: r1(py(lat)) };
  }),
};
writeFileSync(join(ROOT, 'data/map.json'), JSON.stringify(map));
writeFileSync(join(ROOT, 'data/stations.json'), JSON.stringify(stations, null, 1) + '\n');

// ---------------------------------------------------------------- preview SVG
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">',
  '<rect width="800" height="600" fill="#0b2230"/>',
  `<path d="${land}" fill="#123c4d" fill-rule="evenodd"/>`,
  `<g fill="none" stroke="#1b5266" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${rivers.map((r) => `<path d="${r.d}"/>`).join('')}</g>`,
  `<g fill="none" stroke="#9eb3a5" stroke-opacity="0.5" stroke-width="1" stroke-dasharray="4 3">${borders.map((b) => `<path d="${b.d}"/>`).join('')}</g>`,
  `<path d="${map.coast.d}" fill="none" stroke="#9eb3a5" stroke-width="1" stroke-linejoin="round"/>`,
  `<g>${stations.stations.map((s) => `<circle cx="${s.x}" cy="${s.y}" r="4" fill="${s.country === 'CR' ? '#2e93b8' : '#c4832a'}"/>`).join('')}</g>`,
  `<g font-family="sans-serif" font-size="14" fill="#a9c3c8">${places.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="1.5"/><text x="${r1(p.x + 7)}" y="${r1(p.y + 4)}">${p.name}</text>`).join('')}`,
  `<text x="${labels.CR[0]}" y="${labels.CR[1]}" text-anchor="middle" letter-spacing="2">COSTA RICA</text>`,
  `<text x="${labels.PA[0]}" y="${labels.PA[1]}" text-anchor="middle" letter-spacing="2">PANAMA</text>`,
  `<text x="${labels.sea[0]}" y="${labels.sea[1]}" text-anchor="middle" font-style="italic">Caribbean Sea</text></g>`,
  '</svg>',
].join('\n');
writeFileSync(join(ROOT, 'assets/svg/coast.svg'), svg + '\n');

const kb = (p) => (readFileSync(join(ROOT, p)).length / 1024).toFixed(1) + ' KB';
console.log(`map.json ${kb('data/map.json')}, stations.json ${kb('data/stations.json')}, coast.svg ${kb('assets/svg/coast.svg')}`);
console.log(`coast points: ${coastPts.length}, crossings: ${crossings}, borders NI-CR ${bNICR.length} pts, CR-PA ${bCRPA.length} pts`);
