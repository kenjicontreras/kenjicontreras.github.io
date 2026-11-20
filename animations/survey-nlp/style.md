# Style spec: survey-nlp

A polling office: cream questionnaire paper, navy ink, one dark navy "analysis" stage for the model
steps. Colour means a **topic**; amber means **goes to review**. It sits on the landing page's tokens.

## Palette

Site tokens reused: `--paper #f7fafb` · `--rule #d3e0e4` · `--ink #0e2a3a` · `--slate #4e6874` ·
`--teal #0a7c7e`.

Story tokens (in `tokens.css`, scoped to `.sn`):

| Token | Hex | Job |
|---|---|---|
| `--sn-cream` | `#f5f1e8` | light stage: paper, forms, the field |
| `--sn-card` | `#fffdf8` | cards and forms on cream |
| `--sn-night` | `#0f2130` | dark stage for the model steps |
| `--sn-panel` / `--sn-panel-2` | `#1a3244` / `#2a4a60` | cards on the dark stage; rules, empty bars |
| `--sn-on` / `--sn-on-2` | `#eaf2f5` / `#a9bfca` | text on the dark stage |
| `--sn-t1` / `--sn-t2` / `--sn-t3` | `#a77bd6` / `#d9695c` / `#2ea3b5` | **the three topics** on the dark stage: Corrupción, Costo de vida, Seguridad |
| `--sn-t1-light` / `--sn-t2-light` / `--sn-t3-light` | `#7f4fb5` / `#c4503f` / `#0086a3` | the same trio on cream |
| `--sn-flag` / `--sn-flag-light` | `#e8a33a` / `#a8700f` | "goes to review" (dark / cream) |
| `--sn-l1` … `--sn-l5` | `#34536a` `#4f7590` `#6f98b2` `#97bcd2` `#c3dce9` | the 5-point answer scale, Ninguna → Mucha (ordinal, one hue) |
| `--sn-dk` | `#6d7f8a` | "No sabe / No responde" |

Colour rules
- Topic colour means the topic, always with its name: violet = Corrupción, coral = Costo de vida,
  cyan = Seguridad. In the parliament steps the same three colours mark three BERTopic clusters
  (with their real words as labels), so the eye links "topic" across both halves.
- The trio passes the dataviz validator on `--sn-night` and `--sn-panel` (deutan ΔE 13.8, tritan
  16.2) and the light trio passes on `--sn-cream`.
- Amber never encodes a topic; it marks only the review queue and the "flag" accents.
- The answer scale is one hue, light = more confidence. It is ordinal, never categorical.

## Assets

| File | What | Kind | viewBox | Budget |
|---|---|---|---|---|
| `survey-form.svg` | clipboard with a printed poll questionnaire: header band, a few blank text lines, a large empty open-answer box, a 5-column tick grid of 5 rows, a small ballot-box mark in the header | hero, ids `snf-` | 360 × 460 | 6 KB |
| `proceedings-stack.svg` | a stack of bound session records / transcripts, three-quarter view, a couple of loose pages on top with grey text lines; generic, no crest, no building | hero, ids `snp-` | 400 × 300 | 6 KB |
| `field-interview.svg` | an interviewer standing at the door of a simple tropical concrete house, holding a tablet; a resident in the doorway. Simplified figures: no facial features, no logos | hero, ids `snt-` | 420 × 340 | 7 KB |
| `doc-mini.svg` | a small page with a folded corner and text lines | single colour, opacity tones | 40 × 52 | 1 KB |
| `icon-*.svg` | clock, blank, entropy, grid, magnifier, sheet, tag, spark, scale, people | line icons | 24 × 24 | 1 KB |

No light layer.

## Shapes

- Flat vector. Silhouettes are filled shapes with **no outline**; at most one inner tone made
  with opacity. No drop shadows, no textures.
- **Hero drawings are the exception**: shaded illustrations (a gradient lit from above, a rim of
  light, real construction detail), still vector and calm. Ids carry the prefix in the asset table.
- Nothing is a cartoon character: no faces, no eyes, no smiles, no motion lines.
- Line icons: 1.5 px stroke at 24 px, round caps and joins, no fill.
- Corners 8 px on panels and cards, 4 px on small tiles.

## Type

- Family: Archivo Variable (loaded by the site). Numbers: tabular, expanded, weight 680.
- Inside the SVG stage (viewBox 800 × 600) no label is smaller than **22 units**. Spanish survey
  text on the stage is set in italic, as a quotation.
- Text never takes a topic colour; a dot or bar beside it carries the colour.

## Stage geometry

- One SVG, `viewBox="0 0 800 600"` (4:3). Safe area: 40 units of padding on each side.

## Motion

- Driven by scroll position (one GSAP timeline, `../_shared/story.ts`). Each step's change plays in
  its first ~60 to 85 %, then holds. Easing `power2.out`; no bounce, no overshoot.
- Reduced motion: the stage jumps to each step's end state.

## SVG asset rules (for anything in `assets/svg/`)

- One file per asset, `xmlns` + `viewBox` only on the root; no `width`/`height`, no `<style>`,
  no `<script>`, no external references, no embedded raster, no `<text>`.
- **Single-colour art** uses `fill="currentColor"` (or `stroke="currentColor"` for line icons) so the
  stage can recolour it; a second tone is the same colour with `opacity`. No `id` attributes.
- **Hero art** uses fixed hex colours from the palette above (plus lighter and darker tones of them,
  and a neutral skin/clothing range for the figures), may use gradients and `clipPath`, and prefixes
  every id.
- Paths to 1 decimal place. Every drawing is original.
