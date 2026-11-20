# Style spec: watermelon-varieties

A packing shed in daylight: cream paper, wooden crates, dark striped fruit, one red accent for the
cut flesh. The model steps happen on a dark green stage. It sits on the landing page's tokens.

## Palette

Site tokens reused: `--paper #f7fafb` · `--rule #d3e0e4` · `--ink #0e2a3a` · `--slate #4e6874` ·
`--teal #0a7c7e`.

Story tokens (in `tokens.css`, scoped to `.wv`):

| Token | Hex | Job |
|---|---|---|
| `--wv-cream` | `#f6f2e6` | light stage |
| `--wv-night` | `#14231a` | dark stage for the model steps |
| `--wv-panel` / `--wv-panel-2` | `#1e3326` / `#2d4a37` | cards on the dark stage; grid lines |
| `--wv-rind` / `--wv-rind-2` / `--wv-stripe` | `#2b5a34` / `#5d8f47` / `#17351f` | watermelon rind, light stripes, dark stripes |
| `--wv-flesh` | `#e4485a` | cut fruit: the single warm accent |
| `--wv-crate` / `--wv-crate-2` | `#c9a36b` / `#a37f4c` | wood, wood in shade |
| `--wv-belt` | `#3b4a44` | conveyor belt and machine parts |
| `--wv-anna` / `--wv-joya` / `--wv-quetzali` | `#2e93b8` / `#c4832a` / `#a06fc8` | **the three varieties** on the dark stage |
| `--wv-anna-light` / `--wv-joya-light` / `--wv-quetzali-light` | `#1f7fa3` / `#b3741a` / `#8a4fa8` | the same trio on cream |
| `--wv-on` / `--wv-on-2` | `#edf3ea` / `#adc0ae` | text on the dark stage |

Colour rules
- Colour means the variety: blue = Anna, amber = Joya, violet = Quetzali, always in that order and
  always with the name. None of them is green, because every fruit is green.
- The trio passes the dataviz validator on `--wv-night` and `--wv-panel` (colour-blind ΔE 18.8,
  tritan 10.6) and the light trio passes on `--wv-cream`.
- The red of the flesh is decoration only; it never encodes data.

## Assets

| File | What | Kind | viewBox | Budget |
|---|---|---|---|---|
| `melon-whole.svg` | a whole striped watermelon, side view | hero, ids `wvm-` | 400 × 320 | 6 KB |
| `melon-slice.svg` | a cut wedge with flesh and seeds | hero, ids `wvs-` | 320 × 200 | 4 KB |
| `melon-mini.svg` | small striped watermelon for rows and belts | single colour, opacity tones | 120 × 96 | 2 KB |
| `crate.svg` | wooden crate, front view, open top | hero, ids `wvc-` | 320 × 200 | 4 KB |
| `camera-arch.svg` | inspection camera on a gantry over a belt, side view | hero, ids `wva-` | 320 × 260 | 4 KB |
| `icon-*.svg` | lock, spark, camera, box, eye, scale | line icons | 24 × 24 | 1 KB |
| `assets/img/*.webp` | variety photos from the paper (© 2022 IEEE, reused by the author) | raster | | 60 KB each |

No light layer: nothing in this story needs one.

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
