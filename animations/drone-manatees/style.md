# Style spec: drone-manatees

The story is seen **from the air**: every scene is a top-down view, as the drone sees the lake.
Colours are sampled from the paper's own drone photographs of Gatún Lake (green lake water, pale
animals, brown logs, sun glare) and sit on the landing page's tokens.

## Palette

Site tokens reused: `--paper #f7fafb` · `--rule #d3e0e4` · `--ink #0e2a3a` · `--slate #4e6874` ·
`--teal #0a7c7e` · `--teal-deep #075e60`.

Story tokens (in `tokens.css`, scoped to `.dm`):

| Token | Hex | Job |
|---|---|---|
| `--dm-night` | `#0f2422` | dark stage: the map and the photo viewer |
| `--dm-land` | `#16302b` | land on the dark map |
| `--dm-water` | `#1c4744` | lake on the map; water of the drawn photo |
| `--dm-water-2` | `#2a615c` | ripples, tile lines |
| `--dm-shallow` / `--dm-shallow-2` | `#5f9e94` / `#4a857c` | the lake in the daylight scenes (steps 1 and 8) |
| `--dm-canopy` / `--dm-canopy-2` | `#2f5138` / `#4d7350` | forest from above |
| `--dm-hyacinth` | `#7fae5a` | floating water plants |
| `--dm-hide` | `#cfd2c4` | a manatee seen from the air |
| `--dm-log` | `#8a7150` | floating logs |
| `--dm-sand` | `#f3f1e6` | cream cards |
| `--dm-glare` | `#fff6d8` | sun glitter (light layer only) |
| `--dm-find` | `#c4832a` | **the model says "manatee"**: detection boxes, found sequences |
| `--dm-other` | `#2e93b8` | **the model says "log"** |
| `--dm-on` / `--dm-on-2` | `#eaf3ee` / `#a8c4b8` | text on the dark stage |

Colour rules
- Colour means one thing: amber = the model says manatee, blue = the model says log. A sequence
  the model missed is a hollow ring in `--dm-on`, not a third hue.
- The pair passes the dataviz validator (lightness band, chroma floor, colour-blind separation
  ΔE 18.8, normal-vision ΔE 23.2) on `--dm-night` and `--dm-water`. On `--dm-water` the blue has a
  contrast of 2.94:1, just under 3:1, so every box carries its word ("manatee", "log").
- Photographs from the paper keep their own colours and are never tinted.

## Assets

| File | What | Kind | viewBox | Budget |
|---|---|---|---|---|
| `manatee-top-pair.svg` | mother and calf swimming, seen from directly above | hero, ids `dmp-` | 640 × 360 | 7 KB |
| `drone-top.svg` | quadcopter seen from above | hero, ids `dmd-` | 240 × 240 | 5 KB |
| `boat-top.svg` | fishing cayuco with outboard, fisherman and wake (steps 1, 8); replaces `ship-top.svg`, which is no longer used | hero, ids `dmb-` | 640 × 160 | 10 KB |
| `shore-hero.svg` | forest edge from above, layered crowns, mud banks, canopy shadow (steps 1, 8) | hero, ids `dmsh-` | 800 × 220 | 18 KB |
| `hyacinth-hero.svg` | mat of water hyacinth rosettes (steps 1, 8) | hero, ids `dmh-` | 240 × 160 | 9 KB |
| `log-hero.svg` | weathered floating log, one end submerged (steps 1, 8) | hero, ids `dml-` | 160 × 40 | 2.5 KB |
| `manatee-top.svg` | one adult from above | single colour | 240 × 110 | 2 KB |
| `log-top.svg` | floating log from above | single colour | 160 × 40 | 1 KB |
| `hyacinth.svg` | mat of floating water hyacinth from above | single colour, opacity tones | 240 × 160 | 4 KB |
| `shore.svg` | forest shoreline from above, as a band along the top of the stage | single colour, opacity tones | 800 × 220 | 6 KB |
| `icon-*.svg` | camera, clock, route, tiles, prompt, eye | line icons | 24 × 24 | 1 KB |
| `assets/img/*.webp` | crops of the paper's drone photos (CC BY 4.0) | raster | | 60 KB each |

## Light layer (WebGL)

- Light only: sun glitter on the water in the daylight scenes, and the glow of the tile scan.
- Warm white (`--dm-glare`) for glitter, `--dm-find` for the scan. It must never cover a label,
  a box or a photograph.

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
