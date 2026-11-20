# drone-manatees

Scroll story for the CV project "Deep Learning Detection and Classification of Antillean Manatees
in Drone Imagery". Eight steps, all seen from above: the manatees of the Panama Canal, the lake and
its 44 survey areas, the flights, the photos, the tiles, the zero-shot grouping, the results, and
what the survey is for.

- **Source:** Sanchez-Galan, Contreras, Denoce, Poveda, Merchan, Guzmán 2025, Drones 9(4):230,
  <https://doi.org/10.3390/drones9040230>, CC BY 4.0. Copy in `resources/papers/`.
- **Preview:** `npm run dev`, then <http://localhost:4321/animations/drone-manatees>
  (`?step=5` jumps to a step, `?nogl` turns the light layer off).
- **Scene key:** `dronemanatees` in `src/scenes/index.ts`.
- **Not on the landing page yet.** It is meant for the "Finding manatees in drone footage" case
  study (`drone-detection` in `src/data/work.ts`, whose scene key `drone` is still a placeholder).

## Files

| File | What |
|---|---|
| `brief.md` | source, audience, message, fact sheet (every number with its place in the paper), care points |
| `storyboard.md` | the eight steps: what the reader learns, layers, motion, data |
| `style.md`, `tokens.css` | palette (`--dm-*`), shapes, type, asset rules and asset table |
| `content.ts` | all copy and numbers |
| `Stage.astro` | the SVG stage, a layer per step |
| `scene.ts` | the timeline |
| `gl.ts` | the light layer: sun glitter, scan glow, flight trail |
| `data/lake.json` | lake outline, canal, 44 areas, sequence positions |
| `tools/build-lake.py`, `tools/preview-lake.py` | regenerate and preview `lake.json` |
| `tools/build-photos.py` | cut the photo crops from the paper's figures |

## What is real, digitised or illustrative

| Item | Status |
|---|---|
| Every number in `content.ts` | real, traced in `brief.md` |
| Lake outline, canal, 44 survey areas | digitised from Fig. 1 (CC BY); approximate. Areas 7, 8 and 11 to 16 overlap in the figure and were split into neighbours |
| Sequence dots (step 7) | digitised from Figs 12 and 13. The 15 test sequences are all there (11 found, 4 missed). Of the 30 training sequences only 22 dots can be separated (19 found, 3 missed): the rest sit on top of others in the figure. The text gives the true counts, 27 of 30 and 11 of 15 |
| Photo of three manatees (step 6) and its five scores | real: Fig. 8A / Fig. 18C and Table 7 of the paper |
| Insets "a manatee" and "a log" (steps 4 and 5) | real crops of Fig. 2B |
| The survey area and flight lines of step 3 | illustrative shape |
| The drawn photo, its specks, tiles and boxes (steps 4 and 5) | illustrative |
| The daylight scenes (steps 1 and 8) | illustration |

## Assets and licences

| Asset | Origin | Licence |
|---|---|---|
| `assets/svg/*.svg` | drawn for this story | own work |
| `assets/img/pair.webp`, `pair-y.webp`, `crop-manatee.webp`, `crop-log.webp` | crops of Figs 2 and 8 of the paper; `pair-y` is the luminance channel computed from `pair` | CC BY 4.0, credited in the story footer |
| `data/lake.json` | digitised from Figs 1, 12, 13 | CC BY 4.0, credited |

Six line icons (`icon-*.svg`) were drawn but are not used on the stage at present.

## Open points

- The discussion of the paper says 28 of 30 training sequences were detected; its Table 4 and
  Fig. 12 show 27. The story uses 27.
- Real GPS positions of the 45 sequences would replace the digitised dots and restore the eight
  that overlap.
- Steps 1 and 8 were redrawn on 2026-11-17 (brief: `tools/air-scene-brief.md`): realistic mother and
  calf, a fishing cayuco instead of the container ship (which was smaller than a manatee), new shore,
  hyacinth and logs, all to one scale. The tail paddle still looks slightly squared at 2x.
- Performance of the light layer was measured on the development Mac only.
