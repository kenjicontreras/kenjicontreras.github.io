// Regenerates the data files of the survey-nlp story:
//   node animations/survey-nlp/tools/make-data.mjs
// topics.json is real (Contreras et al. 2022, CONCAPAN). batch.json and
// entropy.json are illustrative: a synthetic batch of poll interviews scored
// with the same formulas as the audit system described in ../../nlp/nlp_systems.md.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const save = (name, obj) => writeFileSync(join(out, name), JSON.stringify(obj, null, 1) + '\n');
const r2 = (v) => Math.round(v * 100) / 100;

// ── real: from the paper ──────────────────────────────────────────────────
save('topics.json', {
  status: 'real: Contreras, Verbel, Sanchez, Sanchez-Galan 2022, IEEE CONCAPAN (Sections II and IV, Table I)',
  corpus: { texts: 2086, collected: 2791, from: 2005, to: 2020 },
  lda: { topics: 17, coherence: '< 0.20', bags: [['salud', 'médico', 'caja'], ['transporte', 'ambiente', 'ambiental'], ['electoral', 'partido', 'político']] },
  bertopic: {
    topics: 33,
    coherence: '> 0.45',
    diversity: 0.5,
    clusters: [
      ['radiología', 'dietilenglicol'],
      ['asuntos indígenas', 'tierra colectivo'],
      ['plenipotenciario', 'diplomático'],
    ],
  },
  // Section IV.B: which words were frequent in each half of the timeline (no exact years given)
  health: { first: ['salud pública', 'cirugía'], second: ['dietilenglicol', 'río La Villa', 'humo'] },
});

// ── illustrative: Shannon entropy of two respondents' answers ─────────────
const H = (vals) => {
  const valid = vals.filter((v) => v !== 0); // 0 = No sabe / No responde
  if (valid.length < 2) return null;
  const c = {};
  valid.forEach((v) => (c[v] = (c[v] || 0) + 1));
  return -Object.values(c).reduce((s, n) => s + (n / valid.length) * Math.log2(n / valid.length), 0) + 0;
};
const straight = (vals) => {
  const valid = vals.filter((v) => v !== 0);
  return valid.length > 1 && valid.every((v) => v === valid[0]);
};
const A = [2, 4, 3, 5, 1, 3, 4];
const B = [1, 1, 1, 1, 1, 1, 1];
save('entropy.json', {
  status: 'illustrative: two invented respondents; entropy computed exactly (log base 2, No sabe/No responde excluded)',
  institutions: ['la Asamblea', 'los partidos', 'la policía', 'los tribunales', 'los medios', 'el gobierno', 'los municipios'],
  scale: ['Ninguna', 'Poca', 'Algo', 'Bastante', 'Mucha'],
  max: r2(Math.log2(5)),
  respondents: [
    { name: 'A', answers: A, bits: r2(H(A)), straight: straight(A) },
    { name: 'B', answers: B, bits: r2(H(B)), straight: straight(B) },
  ],
});

// ── illustrative: a batch of 60 interviews, scored like the audit system ──
let seed = 2086;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
const pick = (p) => {
  let u = rand();
  for (let i = 0; i < p.length; i++) if ((u -= p[i]) <= 0) return i + 1;
  return p.length;
};

const N = 60;
const interviewers = ['A', 'B', 'C', 'D', 'E', 'F'];
// two batteries of 7 items on the 5-point scale, plus 10 other closed questions
const interviews = Array.from({ length: N }, (_, i) => {
  const kind = [7, 19, 33, 46].includes(i) ? 'straight' : [12, 40].includes(i) ? 'fast' : [25, 52].includes(i) ? 'dk' : 'normal';
  const lean = [0.1 + rand() * 0.2, 0.2, 0.25, 0.2, 0.15];
  const s = lean.reduce((a, b) => a + b, 0);
  const p = lean.map((v) => v / s);
  const dkRate = kind === 'dk' ? 0.45 : 0.04 + rand() * 0.06;
  const ans = () => (rand() < dkRate ? 0 : pick(p));
  const battery = () => {
    if (kind === 'straight') {
      const v = pick(p);
      return Array(7).fill(v);
    }
    return Array.from({ length: 7 }, ans);
  };
  const b1 = battery();
  const b2 = kind === 'straight' && i % 2 ? Array.from({ length: 7 }, ans) : battery();
  const other = Array.from({ length: 10 }, ans);
  const all = [...b1, ...b2, ...other];
  const minutes = kind === 'fast' ? 9 + rand() * 3 : kind === 'straight' ? 17 + rand() * 4 : 24 + gauss() * 4;
  return {
    id: `E${String(i + 1).padStart(3, '0')}`,
    interviewer: interviewers[i === 7 || i === 19 || i === 33 ? 3 : Math.floor(rand() * 6)],
    minutes: r2(minutes),
    nonresponse: r2(all.filter((v) => v === 0).length / all.length),
    entropy: r2(H(all)),
    straightlining: r2([b1, b2].filter(straight).length / 2),
  };
});

const feats = ['minutes', 'nonresponse', 'entropy', 'straightlining'];
const stats = Object.fromEntries(
  feats.map((f) => {
    const v = interviews.map((x) => x[f]);
    const m = v.reduce((a, b) => a + b, 0) / v.length;
    const sd = Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1)) || 1;
    return [f, { mean: r2(m), sd: r2(sd) }];
  }),
);
interviews.forEach((x) => {
  // signed z for the strip position; |z| / 3, capped at 1, averaged for the score
  x.z = feats.map((f) => r2((x[f] - stats[f].mean) / stats[f].sd));
  x.part = x.z.map((z) => r2(Math.min(Math.abs(z) / 3, 1)));
  x.score = r2(x.part.reduce((a, b) => a + b, 0) / feats.length);
});
const ranked = [...interviews].sort((a, b) => b.score - a.score);
const top = Math.max(1, Math.floor(N * 0.33));
ranked.forEach((x, k) => (x.review = k < top));
const byInterviewer = interviewers.map((name) => ({ name, flagged: ranked.filter((x) => x.review && x.interviewer === name).length, total: interviews.filter((x) => x.interviewer === name).length }));

save('batch.json', {
  status: 'illustrative: 60 synthetic interviews (seeded); features, z-scores and score computed with the formulas of the audit system',
  features: feats,
  stats,
  top,
  byInterviewer,
  interviews: ranked,
});
console.log('top', top, 'scores', ranked.slice(0, 5).map((x) => x.score), 'A bits', H(A));
