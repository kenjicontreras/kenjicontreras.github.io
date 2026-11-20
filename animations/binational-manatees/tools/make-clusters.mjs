// Generates data/clusters.json: an ILLUSTRATIVE scatter for the "calls sort
// into individuals" step. It is not research data. To show the real result,
// replace the file with 2-D coordinates of the PaCMAP embedding and the
// HDBSCAN labels (cluster -1 = outlier), keeping the same shape.
//
//   node animations/binational-manatees/tools/make-clusters.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

let seed = 20251016; // paper's publication date, so the layout is stable
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());

// cluster centres in a unit box (x right, y down) and their sizes
const centres = [
  [0.16, 0.26, 13], [0.47, 0.17, 11], [0.8, 0.28, 14],
  [0.27, 0.72, 12], [0.58, 0.62, 13], [0.86, 0.76, 11],
];
const points = [];
centres.forEach(([cx, cy, n], cluster) => {
  for (let i = 0; i < n; i++) {
    points.push({ x: +(cx + gauss() * 0.038).toFixed(4), y: +(cy + gauss() * 0.05).toFixed(4), cluster });
  }
});
// outliers: calls that fit no dense group (HDBSCAN leaves them unassigned)
const far = (x, y) => centres.every(([cx, cy]) => Math.hypot(x - cx, (y - cy)) > 0.15);
while (points.filter((p) => p.cluster === -1).length < 10) {
  const x = 0.05 + rand() * 0.9, y = 0.05 + rand() * 0.9;
  if (far(x, y)) points.push({ x: +x.toFixed(4), y: +y.toFixed(4), cluster: -1 });
}
const out = {
  status: 'ILLUSTRATIVE. Synthetic points (seeded), not the study embedding. Swap in real PaCMAP coordinates and HDBSCAN labels to show the actual clusters.',
  clusters: centres.map(([x, y, n], id) => ({ id, x, y, n })),
  points,
};
const file = fileURLToPath(new URL('../data/clusters.json', import.meta.url));
writeFileSync(file, JSON.stringify(out));
console.log(`${points.length} points, ${centres.length} clusters -> ${file}`);
