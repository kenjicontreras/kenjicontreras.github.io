# Style spec: binational-manatees

The look follows the seven reference slides in `resources/manatees/` (airy, cream and sage,
underwater) but is rebuilt on the landing page's own tokens so it sits inside the site.
The story reuses the slides' structure and pictogram vocabulary (weight, threats, numbered
pipeline, weather, actions); every drawing is original, nothing is traced or copied.

## Palette

Site tokens (from `src/styles/global.css`, reuse as is):
`--paper #f7fafb` · `--panel #ecf4f5` · `--lagoon #ddf1ef` · `--rule #d3e0e4` · `--ink / --navy #0e2a3a` ·
`--slate #4e6874` · `--teal #0a7c7e` · `--teal-deep #075e60`

Story tokens (defined in `tokens.css`, scoped to `.bm`):

| Token | Hex | Job |
|---|---|---|
| `--bm-deep` | `#0b2230` | dark stage background (steps 2 to 6) |
| `--bm-water` | `#123c4d` | land on the dark map, recording tiles |
| `--bm-water-2` | `#1b5266` | rivers and light accents on dark |
| `--bm-moss` | `#5f7355` | mangrove, corridor band |
| `--bm-reed` | `#3a4535` | darkest vegetation |
| `--bm-sage` | `#9eb3a5` | manatee silhouettes and secondary marks on dark |
| `--bm-sand` | `#f6f3ea` | cream cards, the surface scene sky |
| `--bm-shallow` | `#cfe6e2` | surface water in light scenes |
| `--bm-signal` | `#d7e26a` | a manatee call; "identified" highlight |
| `--bm-alert` | `#c8452f` | Endangered badge and the four threat icons. Nothing else. |
| `--bm-cr` / `--bm-pa` | `#2e93b8` / `#c4832a` | Costa Rica / Panama on the dark stage |
| `--bm-cr-light` / `--bm-pa-light` | `#1f7fa3` / `#b3741a` | the same pair on light surfaces |
| `--bm-on-deep` / `--bm-on-deep-2` | `#e9f3f4` / `#a9c3c8` | text on the dark stage |

Colour rules
- Colour means one thing: blue = Costa Rica, amber = Panama, yellow-green = a manatee call or an
  identified individual, red = endangered / threat. Clusters are **not** given their own hues;
  grouping is shown by position and a ring, so no hue is reused with a second meaning.
- The country pair passes the dataviz validator (lightness band, chroma floor, colour-blind
  separation ΔE 18.8, contrast ≥ 3:1) on `#0b2230`, and the light pair passes on `#f6f3ea`.
  Countries are always labelled in words as well.
- Spectrogram ramp (low → high energy): `#0b2230 → #0a7c7e → #569486 → #d7e26a`.
- Text never takes a data colour. On dark use `--bm-on-deep`; on light use `--ink` / `--slate`.

## Shapes

- Flat vector. Silhouettes are filled shapes with **no outline**; at most one inner tone made
  with opacity (belly shade, flipper). No gradients inside fauna, no drop shadows, no textures.
- Line icons: 1.5 px stroke at 24 px, round caps and joins, no fill.
- Corners 8 px on panels and cards, 4 px on small tiles.
- **Exception: the mother and calf of the opening and closing scene** (`manatee-pair-detailed.svg`)
  are a shaded illustration, because they are the one place the reader meets the animal: a skin
  gradient lit from above (`#7d989d` → `#55747c` → `#24434d`), a rim of light on the back, skin
  folds at the neck and tail, the blunt bristled muzzle, a small eye, flippers with nails, a broad
  tail paddle, and on the mother algae patches and pale propeller scars. Still vector, still calm.
  Its ids are prefixed `bmp-` so they cannot collide when the file is inlined.
- Manatees are drawn calm and anatomically plain: rounded body, paddle tail, small flippers,
  blunt snout. Not cartoon characters: no eyes with highlights, no smiles.

## Type

- Family: Archivo Variable (already loaded by the site). Headlines `font-stretch: 116–122%`,
  weight 650–680. Body 100% width.
- Numbers: `font-variant-numeric: tabular-nums`, expanded width, weight 680.
- Inside the SVG stage (viewBox 800 × 600) no label is smaller than **22 units**, so it stays
  readable when the stage is 360 px wide on a phone. Small print goes in HTML outside the SVG.

## Stage geometry

- One SVG, `viewBox="0 0 800 600"` (4:3). Safe area: 40 units of padding on each side.
- Map projection (so every map asset lines up):
  `x = (lon + 84.5) × 0.9848 × 214.3` · `y = (11.3 − lat) × 214.3`
  Frame: longitude −84.50 … −80.76, latitude 11.30 … 8.50. The Caribbean Sea is the upper right.

## Motion

- Everything is driven by scroll position (one GSAP timeline scrubbed by the section).
  Each step owns one unit of timeline time: its change plays in the first ~60 %, then holds.
- Easing `power2.out`; no bounce, no overshoot, no rotation for decoration.
- Looping details (hydrophone pulse) are CSS animations and stop under `prefers-reduced-motion`.
- Reduced motion: no tweening at all; the stage jumps to each step's end state as the step
  becomes active.

## Light layer (WebGL)

- The canvas over the stage adds light and nothing else: no shapes, no text, no 3D models.
  The flat illustration underneath stays the picture; the light is atmosphere and scale.
- Colours come from the same tokens: `--bm-sage` for unassigned calls, `--bm-signal` for grouped
  calls and track light, `--bm-on-deep` for particles and rain, warm white for sunlight.
- Keep it quiet. Light must never lower the contrast of a label or hide a mark; steps that are
  mostly text or a light map (2, 5, 8) get little or none.
- Self-running motion is slow (drift, shimmer, a pulse every few seconds). The story still
  advances only by scrolling.

## SVG asset rules (for anything in `assets/svg/`)

- One file per asset, `xmlns` + `viewBox` only on the root; no `width`/`height`, no `<style>`,
  no `<script>`, no `id` attributes, no external references, no embedded raster.
- Single-colour art uses `fill="currentColor"` (or `stroke="currentColor"` for line icons) so the
  stage can recolour it; a second tone is the same colour with `opacity`.
- Keep paths short: 1 decimal place, each file under 6 KB.
