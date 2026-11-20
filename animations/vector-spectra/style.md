# Style spec: vector-spectra

The story moves from a specimen on a light table into a laboratory instrument at night: a dark
bench, steel parts, one violet laser, pale spectrum traces. It sits on the landing page's tokens.

## Palette

Site tokens reused: `--paper #f7fafb` · `--rule #d3e0e4` · `--ink #0e2a3a` · `--slate #4e6874` ·
`--teal #0a7c7e`.

Story tokens (in `tokens.css`, scoped to `.vs`):

| Token | Hex | Job |
|---|---|---|
| `--vs-bench` | `#101a2b` | dark stage |
| `--vs-panel` / `--vs-panel-2` | `#1a2942` / `#263a5c` | cards and instrument parts; grid lines |
| `--vs-steel` | `#8fa0b8` | metal: plate, flight tube, detector |
| `--vs-paper` | `#f4f1ea` | light opening scenes (steps 1 and 2) |
| `--vs-trace` | `#9be8d8` | a mass spectrum. Nothing else. |
| `--vs-laser` | `#c79bff` | the laser pulse and the ions it frees |
| `--vs-mosq` / `--vs-tick` | `#2e93b8` / `#c4832a` | **mosquitoes / ticks** on the dark stage |
| `--vs-mosq-light` / `--vs-tick-light` | `#1f7fa3` / `#b3741a` | the same pair on light surfaces |
| `--vs-alert` | `#c8452f` | disease names only |
| `--vs-on` / `--vs-on-2` | `#e8eef7` / `#a7b6cc` | text on the dark stage |

Colour rules
- Colour separates the two **families** only: blue = mosquitoes, amber = ticks. The 30 species are
  never given 30 hues; a species is a position (an island of points) and a name.
- The pair passes the dataviz validator on `--vs-bench` and `--vs-panel` (colour-blind ΔE 18.8),
  and the light pair passes on `--vs-paper`. Families are always named in words as well.

## Assets

| File | What | Kind | viewBox | Budget |
|---|---|---|---|---|
| `mosquito.svg` | female *Anopheles* mosquito, side view, resting | hero, ids `vsm-` | 640 × 420 | 8 KB |
| `tick.svg` | hard tick (*Amblyomma*), seen from above | hero, ids `vst-` | 480 × 480 | 7 KB |
| `mosquito-mini.svg` | mosquito silhouette, side view | single colour | 120 × 80 | 2 KB |
| `tick-mini.svg` | tick silhouette, from above | single colour | 100 × 100 | 2 KB |
| `leg.svg` | one detached, segmented insect leg | single colour | 160 × 60 | 1 KB |
| `plate.svg` | steel sample plate (no longer used; replaced by `bench-back.svg`) | hero, ids `vsp-` | 240 × 160 | 3 KB |
| `bench-back.svg` | step 3 instrument in stage coordinates: laser head, target plate with matrix spots and leg, extraction grids, cut-away flight tube with flanges, MCP detector | hero, ids `vsb-` | 800 × 400 | 22 KB |
| `bench-front.svg` | step 3 glass streaks, flange lips and grid fronts drawn over the ions | hero, ids `vsf-` | 800 × 400 | 8 KB |
| `icon-*.svg` | microscope, clock, check, network | line icons | 24 × 24 | 1 KB |

## Light layer (WebGL)

- Light only: the laser flash, the ions in flight, and the 1,136 spectra as points that settle
  into islands. `--vs-laser` for laser and ions; the family pair for the points.

## Shapes

- Flat vector. Silhouettes are filled shapes with **no outline**; at most one inner tone made
  with opacity. No drop shadows, no textures.
- **Hero drawings are the exception** (listed in the asset table as "hero"): the one or two places
  where the reader meets the subject. They are shaded illustrations: a gradient lit from above,
  a rim of light, real anatomy or construction detail, still vector and still calm. Their ids
  carry the prefix given in the asset table so they cannot collide when the file is inlined.
- Nothing is a cartoon character: no faces, no eyes with highlights, no smiles, no motion lines.
- Line icons: 1.5 px stroke at 24 px, round caps and joins, no fill.
- Corners 8 px on panels and cards, 4 px on small tiles.

## Type

- Family: Archivo Variable (loaded by the site). Headlines `font-stretch: 116–122%`, weight
  650–680. Body 100% width. Numbers: tabular, expanded, weight 680.
- Inside the SVG stage (viewBox 800 × 600) no label is smaller than **22 units**. Small print goes
  in HTML outside the SVG.
- Text never takes a data colour.

## Stage geometry

- One SVG, `viewBox="0 0 800 600"` (4:3). Safe area: 40 units of padding on each side.

## Motion

- Everything is driven by scroll position (one GSAP timeline, see `../_shared/story.ts`). Each step
  owns one unit of timeline time: its change plays in the first ~60 to 85 %, then holds.
- Easing `power2.out`; no bounce, no overshoot, no decorative rotation.
- Looping details are CSS animations and stop under `prefers-reduced-motion`.
- Reduced motion: the stage jumps to each step's end state.

## SVG asset rules (for anything in `assets/svg/`)

- One file per asset, `xmlns` + `viewBox` only on the root; no `width`/`height`, no `<style>`,
  no `<script>`, no external references, no embedded raster, no `<text>`.
- **Single-colour art** uses `fill="currentColor"` (or `stroke="currentColor"` for line icons) so the
  stage can recolour it; a second tone is the same colour with `opacity`. No `id` attributes.
- **Hero art** uses fixed hex colours taken from the palette above (plus lighter and darker tones
  of them), may use `linearGradient`/`radialGradient`/`clipPath`, and prefixes every id.
- Keep paths short: 1 decimal place. Size budget per file is in the asset table.
- Every drawing is original. Nothing is traced from a photograph or from the papers' figures.
