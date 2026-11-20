# binational-manatees

A nine-step scroll story about the Greater Caribbean manatee: who it is, how individuals were
identified by voice, and the discovery that they move between Panama and Costa Rica. It follows the
lab's public summary (Instagram carousel) slide by slide. Built from Guzman, Estévez, Contreras et al. (2025),
*Frontiers in Marine Science* 12:1661294 (CC BY 4.0). The method for making stories like this is in
`../README.md`.

- **Preview:** `npm run dev`, then <http://localhost:4321/animations/binational-manatees>
  (`?step=1` … `?step=9` jumps to a step). End states of each step are in `frames/`.
- **Status:** working on desktop, phone and with reduced motion. **Not on the landing page yet.**

## Files

| File | What it is |
|---|---|
| `brief.md` | Source, audience, message, and the fact sheet every number comes from |
| `storyboard.md` | The nine steps: slide, message, picture, motion, assets |
| `style.md`, `tokens.css` | Palette and style rules; the colour tokens (scoped to `.bm`) |
| `content.ts` | All copy and numbers |
| `Stage.astro` | The stage: one SVG drawn at build time |
| `scene.ts` | The timeline that animates the stage |
| `gl.ts` | The optional WebGL light layer (Three.js): water light, drifting particles, the cloud of calls, light on the tracks, rain. See "Light layer" below |
| `data/` | See below |
| `assets/svg/`, `assets/img/` | Illustrations and recoloured figure crops |
| `assets/notebooklm/` | NotebookLM outputs (**not generated yet**, see its README) |
| `tools/` | Scripts that regenerate data and assets |
| `frames/` | Rendered end state of each step, for reference |

## Data: what is real

| File | Status | Source |
|---|---|---|
| `data/key-numbers.json` (not shown at present; the strip of headline numbers under the stage was removed on 2026-11-16) | **Real** | Paper text and the lab's summary (see fact sheet) |
| `data/range.json` | Land **real** (Natural Earth 1:50m). The range line is **schematic**: the coast from Veracruz to Alagoas plus the Greater Antilles. | `tools/build-range.mjs` |
| `data/map.json` | **Real** coast, countries, borders (Natural Earth 1:10m, public domain). Six small rivers traced from the paper's Fig. 1. Coast lightly smoothed. | `tools/build-map.mjs` |
| `data/stations.json` | **Digitised** from Fig. 1, about ±2 km | `tools/build-map.mjs` |
| `data/spectrograms.json` + `assets/img/spec-*.webp` | **Real** spectrograms cropped from Fig. 2; colour ramp changed, data unchanged | `tools/build-spectrograms.py` |
| `data/crossings.json` | **Digitised** from Fig. 5, to the month. The nine gaps average 332 days (paper: 340). Used for the order of the tracks and each animal's entry point. | `tools/digitise-crossings.py` |
| `data/clusters.json` | **Illustrative** synthetic scatter | `tools/make-clusters.mjs` |
| Dots for individuals (in `Stage.astro`) | Counts **real** (61 and 49). Positions, and the 30 / 12 / 7 split between Costa Rican station groups, are **illustrative**. | — |

To replace an approximation with real data, keep the file's shape: `clusters.json` takes 2-D
embedding points with a cluster id (−1 for outliers); `crossings.json` takes Supplementary Table S5.

## Light layer (`gl.ts`)

One Three.js canvas over the SVG, adding light only (see `../README.md`, "Optional: a light layer").

| Effect | Steps | What it shows | Real or illustrative |
|---|---|---|---|
| Rays and surface shimmer | 1, 9 | Light falling through the shallow water | Decorative |
| Drifting particles | 1, 3 to 7, 9 | Water. They rush upward as the scene dives at step 3 | Decorative |
| Cloud of calls | 4 | 30,928 points, one per call that entered clustering, turning slowly and gathering into the six groups | The **count is real** (paper §2.3.6). Positions and the six groups are **illustrative**, as in `data/clusters.json` |
| Light on the tracks | 6, 7 | A glow that draws with each track, then pulses from Panama to Costa Rica | Decorative, on the digitised tracks |
| Rain | 7 | Rain over the Panamanian origin of the crossings | Illustrates the 12.3 mm vs 8.3 mm result |

Without the layer (reduced motion, data saver, no WebGL, or `?nogl`) the SVG stage shows the same
story with 84 stand-in dots. Measured on the development Mac, scrolling the whole story held
120 frames per second with and without the layer, also with the CPU slowed four times; it has not
been measured on real phones.

## Assets and licences

| Asset | Origin | Licence |
|---|---|---|
| `assets/svg/manatee-*.svg`, `hydrophone.svg`, `mangrove.svg`, `seagrass.svg`, `icon-*.svg` (22 icons) | Drawn for this project | Yours |
| `assets/svg/manatee-pair-detailed.svg` | Shaded mother and calf used in steps 1 and 9 (the flat `manatee-pair.svg` is kept as the simple version) | Drawn for this project. Yours |
| `assets/svg/range.svg`, `_range-preview.png` | Preview of `range.json` (documentation only) | Natural Earth, public domain |
| `assets/svg/coast.svg`, `_coast-preview.png` | Preview of `map.json` (documentation only) | Natural Earth, public domain |
| `assets/img/spec-*.webp` | Guzman et al. 2025, Fig. 2, recoloured | CC BY 4.0: keep the credit line (shown once, in the story footer) |
| `resources/manatees/*.png` (outside this folder) | Instagram slides whose structure and numbers the story follows | Third party: artwork not used, not published |

Spare, not on the stage yet: `manatee-graze`, `manatee-top`, `icon-length`, `icon-calendar`,
`icon-sea-temp`, `icon-river`.

## Putting it on the landing page

It is designed to replace the "Counting endangered manatees by their voices" case study:

1. In `src/pages/index.astro`, import `ScrollStory`, `Stage` and `content` (see `../README.md`, step 9)
   and render the story as the first item of "Selected work", before `<div class="cases">`.
2. Remove the `acoustic-monitoring` entry from `featured` in `src/data/work.ts`, and the unused
   `acoustic` line in `src/scenes/index.ts`.
3. Decide whether the preview page `src/pages/animations/binational-manatees.astro` should stay
   (it is public once deployed).

## Open points

- **Corridor area** is not shown: the slides say 2,270 km², the paper 2,631 km² (its two country
  figures sum to 2,541). Confirm before adding.
- **"110 manatees identified"** follows the lab's summary; in the paper these are 61 + 49 presumed
  individuals and the nine border-crossers were matched across both sets (see `brief.md`).
- **Facts from the slides only** (600 kg, 3 to 4 m, the threat list, seasonal floods) are not in the
  paper; they are marked in the fact sheet.
- **Step 9 ("What can you do?")** mirrors the post's last slide. It is one entry in `content.ts`
  and one block in `Stage.astro` / `scene.ts` if you prefer the story to end on the corridor.
- **NotebookLM** outputs are pending a login (`tools/notebooklm.sh`).
