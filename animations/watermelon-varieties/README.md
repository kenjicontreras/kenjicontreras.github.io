# watermelon-varieties

Scroll story for the CV project "Identifying Watermelon Varieties from Photos with Machine Learning
techniques". Seven steps: the sorting problem, the three varieties, the small data set, transfer
learning, metric learning, the result, and where it leads.

- **Source:** Contreras, Henry, Cáceres-Hernández, Sanchez-Galan 2022, IEEE ISIE,
  <https://doi.org/10.1109/ISIE51582.2022.9831572>, © 2022 IEEE. Copy in `resources/papers/`.
- **Preview:** `npm run dev`, then <http://localhost:4321/animations/watermelon-varieties>
  (`?step=5` jumps to a step).
- **Scene key:** `watermelon` in `src/scenes/index.ts`.
- **Not on the landing page yet.**
- Kenji is first author, so this story is written in the first person.

## Files

| File | What |
|---|---|
| `brief.md` | source, audience, message, fact sheet, care points |
| `storyboard.md` | the seven steps |
| `style.md`, `tokens.css` | palette (`--wv-*`), shapes, type, asset rules and asset table |
| `content.ts` | all copy and numbers |
| `Stage.astro` | the SVG stage |
| `scene.ts` | the timeline (no WebGL layer) |
| `data/results.json` | photo counts, accuracies, both confusion matrices (real) |
| `data/embedding.json` | the 100 points of step 5 (counts real, positions illustrative) |
| `tools/make-data.mjs` | regenerates the two data files |
| `tools/build-photos.py` | cuts the variety photos and rind patches from the paper's Fig. 1 |

## What is real, digitised or illustrative

| Item | Status |
|---|---|
| Every number in `content.ts` | real, traced in `brief.md` |
| Photographs of the varieties and the rind patches | real: Fig. 1 of the paper |
| Bars of step 6 | real: the diagonals of the confusion matrices in Fig. 8 |
| Points of step 5 | one per test photo (100). Colour is the true variety; the group a point sits in is the variety the model gave it, so the wrong ones match the confusion matrix. Positions are illustrative |
| The 330 squares of step 3 | real counts (120, 90, 120); the shades of green are decoration |
| Network diagram, packing shed, conveyor | illustration |

## Assets and licences

| Asset | Origin | Licence |
|---|---|---|
| `assets/svg/*.svg` | drawn for this story | own work |
| `assets/img/var-*.webp`, `patch-*.webp` | crops of Fig. 1 of the paper, cut and resized only | © 2022 IEEE; reused by the first author with the copyright notice in the story footer |

## Open points

- **Reuse of the Fig. 1 photographs** relies on IEEE's author reuse terms. If Kenji prefers not to
  rely on that, his own copies of the photographs would replace the crops with no other change
  (same file names).
- "Sorting relies on manual inspection" comes from the CV summary; the paper states only the goal
  of an automatic system.
- The metric-learning test set in Fig. 8 has 100 photos, not the 132 a 40 % split would give. The
  story reports the figure.
- Five unused icons are kept for later.
