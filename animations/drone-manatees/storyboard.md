# Storyboard: drone-manatees

Spine: 436 km² of lake → 65 flights → 57,332 photos → 640-pixel tiles → 27 of 30 and 11 of 15
sequences found → a repeatable survey. Nothing is shown under the stage; the numbers live in the
text column and on the stage itself.

Every scene is seen from above, as the drone sees it.

| # | Headline | What the reader learns | Stage (layers) | Motion | Data and assets |
|---|---|---|---|---|---|
| 1 | Manatees in the Panama Canal | Released in 1964 to eat water weeds; the experiment ended, they stayed; 20 to 25 today | `air` daylight lake from above: shore, hyacinth, a fishing cayuco, mother and calf, all to one scale (about 90 units per metre); `s1-item` cards | cards appear one by one | hero SVGs |
| 2 | A lake too big to watch | 436 km², 44 survey areas | `map`: land, lake, canal, `poly` ×44, labels, `lab436` | scene dims, map fades in, areas light up in order | `data/lake.json` (digitised) |
| 3 | So we flew | 65 flights, 221 hours, a photo every 3 to 5 s | `flight`: one survey area enlarged, `route`, `drone`, `snap` frames, counters | route draws, drone follows it, frames are stamped behind it | polygon 44 from `lake.json`; `drone-top.svg` |
| 4 | A few pixels in thousands of photos | 57,332 photos, 76 manatees; a manatee is a speck, logs look alike | `wall` of tiny frames, then `photo`: one drawn frame with specks; `inset` ×2 real crops | wall fills with the counter, one frame grows to full size, the insets open | `crop-manatee.webp`, `crop-log.webp` (paper, CC BY) |
| 5 | Cut each photo into tiles | Overlapping 640-pixel tiles; the model reads each; finds are merged | `tile` ×20, `box` ×3 with words | tiles appear, a scan passes tile by tile, boxes appear where it finds something, the grid leaves | light layer: scan glow |
| 6 | One, a pair, or a group? | A second model matches the find against five written descriptions | `classify`: real photo, its luminance version, `prompt` card, `score` rows ×5 | photo loses its colour, the prompt appears, five bars grow (nearly tied), top two marked | `pair.webp`, `pair-y.webp`; Table 7 scores (real) |
| 7 | How well it works | 27 of 30 and 11 of 15 sequences; precision 86 %, recall 44 % on unseen flights | `map` again with `seq` dots, `res` labels, legend | dots appear: filled = found, ring = missed | `lake.json` sequences (digitised from Figs 12–13) |
| 8 | What it is for | A repeatable, non-invasive survey; next steps | `air` again, `drone8` crossing, `box8` on the mother and calf | drone crosses the scene, a box settles on the pair | hero SVGs |

## Light layer

| Effect | Steps | Real or illustrative |
|---|---|---|
| Sun glitter on the water | 1, 8 (faint on the drawn photo in 4 and 5) | atmosphere |
| Glow of the tile being read | 5 | illustrative: follows the scan |
| Light along the flight route | 3 | illustrative: follows the drone |

The SVG stage is complete without it.


Legibility pass (2026-11-19): step 1 card says "ten manatees released"; step 3 key "one photo · the drone’s flight line"; step 6 header "how well the photo fits each description" and the quote is labelled as the "mother and calf" description (paper Table 1); step 7 labels say "sequences found", matching the text.
