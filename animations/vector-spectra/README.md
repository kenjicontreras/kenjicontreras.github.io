# vector-spectra

Scroll story for the CV project "Deep Metric Learning for Disease-Vector Species Identification
from Mass Spectra". Eight steps: why the species matters, look-alikes, the protein fingerprint,
the data, learning to compare, the map of islands, the results, and why it matters.

- **Source:** Merchan, Contreras, Gittens, Loaiza, Sanchez-Galan 2023, Artificial Intelligence in
  the Life Sciences 3:100071, <https://doi.org/10.1016/j.ailsci.2023.100071>, open access under
  CC BY-NC-ND. Copy in `resources/papers/`.
- **Preview:** `npm run dev`, then <http://localhost:4321/animations/vector-spectra>
  (`?step=6` jumps to a step, `?nogl` turns the light layer off).
- **Scene key:** `vectorspectra` in `src/scenes/index.ts`.
- **Not on the landing page yet.** In `src/data/work.ts` this project is the `maldi` entry of `more`.

## Files

| File | What |
|---|---|
| `brief.md` | source, audience, message, fact sheet, care points |
| `storyboard.md` | the eight steps |
| `style.md`, `tokens.css` | palette (`--vs-*`), shapes, type, asset rules and asset table |
| `content.ts` | all copy and numbers |
| `Stage.astro` | the SVG stage |
| `scene.ts` | the timeline |
| `gl.ts` | the light layer: laser flash, and one point per spectrum |
| `data/species.json` | species and spectrum counts (real) |
| `data/spectra.json` | drawn spectrum curves (illustrative) |
| `data/embedding.json` | the points of the two maps (counts real, positions illustrative) |
| `tools/make-data.mjs` | regenerates the three data files |

## What is real, digitised or illustrative

| Item | Status |
|---|---|
| Every number in `content.ts` | real, traced in `brief.md` |
| Bars of step 4 | real: spectra per species from Tables 1 and 2, one scale for both families |
| Number of points per island (steps 6 and 7) | real: one point per spectrum (826 + 309; see care points) |
| Positions of the points and islands | illustrative. Mosquito islands are apart and tick islands crowd in the middle, as in the paper's Figs 10B and 11B, but no coordinate is taken from them |
| Spectrum curves | illustrative drawings in the general form of a raw spectrum |
| The instrument of step 3 | schematic |
| The triplet of step 5 | schematic |

## Assets and licences

| Asset | Origin | Licence |
|---|---|---|
| `assets/svg/*.svg` | drawn for this story | own work |
| `data/species.json` | facts quoted from Tables 1 and 2 | facts; source credited in the footer |

Nothing from the paper's figures is reproduced: its licence (CC BY-NC-ND) does not allow adapted
figures on a commercial page.

## Open points

- The Siamese accuracies are inconsistent inside the paper (abstract, results text and Table 8
  give three different pairs). The story says "91 to 94%" only. The CV sentence follows the
  abstract; worth checking with the co-authors.
- Table 2 adds up to 309 tick spectra, the text says 310.
- Table 1's abbreviations do not match its species names, so the stage names only
  *Anopheles albimanus*.
- With the real embedding coordinates and a few raw spectra (Kenji's own data), the maps and
  curves could be real instead of illustrative.
- The three unused icons (`icon-microscope`, `icon-clock`, `icon-network`) are kept for later.
