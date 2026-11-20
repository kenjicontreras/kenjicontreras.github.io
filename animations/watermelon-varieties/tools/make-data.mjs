// Builds the data files of the watermelon-varieties story.
//   node tools/make-data.mjs
//
// data/results.json    REAL: photo counts per variety (Fig. 1), test accuracies (Table II) and the
//                      two confusion matrices (Fig. 8) of Contreras et al. 2022, IEEE ISIE.
// data/embedding.json  ILLUSTRATIVE positions, REAL counts: one point per test photo of the metric
//                      learning experiment (100 photos). A point's colour is its true variety; the
//                      group it lands in is the variety the model gave it, so the number of points
//                      in the wrong group equals the paper's confusion matrix.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
let seed = 9831572;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const r1 = (v) => Math.round(v * 10) / 10;

const varieties = ['anna', 'joya', 'quetzali'];
const results = {
  status: 'real: Fig. 1, Table II and Fig. 8 of Contreras et al. 2022 (IEEE ISIE)',
  photos: { anna: 120, joya: 90, quetzali: 120 },
  accuracy: { transfer: 0.84, metric: 0.81 },
  // rows: true variety; columns: predicted Anna, Joya, Quetzali (EfficientNetB0 in both)
  confusion: {
    transfer: { anna: [17, 1, 2], joya: [3, 14, 1], quetzali: [1, 2, 25] },
    metric: { anna: [29, 2, 0], joya: [5, 26, 4], quetzali: [3, 5, 26] },
  },
};
writeFileSync(join(out, 'results.json'), JSON.stringify(results, null, 1));

// group centres on the stage (viewBox 800 × 600): Joya sits between the other two
const groups = { anna: { x: 214, y: 214, r: 104 }, joya: { x: 400, y: 356, r: 104 }, quetzali: { x: 586, y: 214, r: 104 } };
const points = [];
for (const truth of varieties) {
  results.confusion.metric[truth].forEach((n, k) => {
    const said = varieties[k];
    const g = groups[said];
    for (let i = 0; i < n; i++) {
      // points given the wrong name sit on the side of the group that faces their own
      const own = groups[truth];
      const lean = said === truth ? 0 : Math.atan2(own.y - g.y, own.x - g.x);
      const rad = said === truth ? Math.sqrt(rand()) * (g.r - 14) : (0.45 + 0.4 * rand()) * (g.r - 14);
      const ang = said === truth ? rand() * 6.2832 : lean + (rand() - 0.5) * 1.1;
      points.push({
        truth,
        said,
        a: [r1(70 + rand() * 660), r1(84 + rand() * 384)],
        b: [r1(g.x + Math.cos(ang) * rad), r1(g.y + Math.sin(ang) * rad)],
      });
    }
  });
}
writeFileSync(
  join(out, 'embedding.json'),
  JSON.stringify({ status: 'positions illustrative; counts per group from the metric-learning confusion matrix (Fig. 8)', groups, points }),
);
console.log('points', points.length, 'wrong', points.filter((p) => p.truth !== p.said).length);
