# Brief: the daylight lake scene (steps 1 and 8), remade

Binding for every asset of the `air` layer in `drone-manatees/Stage.astro`. Read
`drone-manatees/style.md` first; this brief overrides it where they differ.

## Why it is being remade

The first version looked ridiculous: the manatees were bowling-pin shapes with no anatomy, and a
container ship was drawn smaller than the mother manatee. The new scene is the same flat-shaded
vector illustration, seen straight down from a drone, but **refined and realistic**: true
anatomy, true relative scale, water that behaves like murky green lake water.

## The view

- Orthographic, straight down. Sun high and slightly upper-left: light falls on the upper-left
  of forms, soft shadows land a few units to the lower-right on the water.
- Stage scale: **about 90 units per metre**. Adult manatee 3 m ≈ 270 units, calf 1.5 m ≈ 140
  units, cayuco 3.6 m ≈ 320 units, tree crowns 6–12 m ≈ 500–1000 units (so the shore shows only
  the edge of the forest, crowns cut by the top of the frame).
- Real references for the animals' look: `drone-manatees/assets/img/pair.webp` and
  `crop-manatee.webp` (the paper's drone photos). Look at them, do not trace them. In them the
  manatees are pale grey-green, soft-edged, partly veiled by the water, the flanks melting into
  green.

## Style

- Refined vector illustration: layered gradients, soft volumes, a light rim on the sunlit side,
  real construction detail. Calm and precise, never cartoon: no outlines, no faces, no eyes, no
  smiles, no motion lines, no drop-shadow effects stuck on top.
- Allowed: `linearGradient`, `radialGradient`, `clipPath`, `mask`, and `filter` with
  `feGaussianBlur` only (for submerged edges and soft water shadows). Every id carries the file's
  prefix. No `<style>`, `<script>`, `<text>`, raster, external refs, width/height on the root.
- Coordinates to 1 decimal. Keep within the byte budget given per asset.

## Palette (fixed hex; tones in between are fine)

| Thing | Colours |
|---|---|
| Lake water, shallow to deep | `#6faea3` `#5f9e94` `#4a857c` `#3c7168` |
| Water shadow (multiply-like) | `#14332f` at 0.15–0.35 opacity |
| Manatee skin above water | `#c9ccbe` `#b3b7a8` `#9da393` (dorsal ridge lighter: `#d8dacd`) |
| Manatee skin seen through water | the same mixed toward `#5f9e94` |
| Algae patches, scars | `#7d8a70` at low opacity; pale scars `#e3e4d8` |
| Forest canopy | `#22402c` `#2f5138` `#3e6443` `#4d7350` `#6a8f5e`; pale crowns `#8fae73` |
| Bank, mud | `#6d6a4a` `#857c57` |
| Water hyacinth | `#5d8c43` `#7fae5a` `#a5c97a`, shadow `#2f5a3a` |
| Wood | `#6f5a3e` `#8a7150` `#a88d68`, weathered top `#bfae8c` |
| Foam, glints | `#eef4f0` |

No violet anywhere.
