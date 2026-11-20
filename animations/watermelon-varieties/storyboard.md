# Storyboard: watermelon-varieties

Spine: three look-alike varieties → 330 photos at 40 × 40 pixels → two methods → 84 % and 81 %
→ Joya is the hard one → a camera over a conveyor belt. Nothing is shown under the stage.

| # | Headline | What the reader learns | Stage (layers) | Motion | Data and assets |
|---|---|---|---|---|---|
| 1 | An export fruit, sorted by eye | Varieties are sorted by people looking at each fruit | `shed` cream: crates of fruit, a whole fruit and a slice, `s1-item` question tags | tags appear on the crates | hero SVGs |
| 2 | Three varieties | Anna, Joya, Quetzali look much alike | `varieties`: three real photographs, names, photo counts | photos arrive one by one, then names | `var-*.webp` (paper, © IEEE) |
| 3 | Only 330 photos | Tiny, uneven data; 40 × 40 pixels | `count`: 330 squares in three groups; `pixel` one real patch enlarged | squares fill with the counter; the patch grows, pixels showing | `patch-*.webp`; `results.json` (real) |
| 4 | Method 1: borrow a trained eye | A network learned edges, textures and shapes from everyday photos and is locked; only a small part learns the varieties | `transfer` dark: (a) everyday-photo tiles `t-every` fly into the block and its 3×3 detector tiles `t-tile` (edges, textures, shapes) form, `t-lock`; (b) the rind patch `t-photo` goes in and lights the tiles by `data-act`; (c) `t-link` lines from the last column to the trained head `t-head`, Anna lit; `t-key` | tiles form, dim, then light; links weighted | original drawings; activations illustrative |
| 5 | Method 2: learn what "similar" means | Trained on three photos at a time: same variety pulled closer, other pushed away; photos end up grouped; a new photo is named after its neighbours | `metric`: (a) `m-trip` anchor, `m-same` and `m-other` patches move together/apart with arrows `m-push`; (b) 100 points gather, rings, wrong ones ringed; (c) `m-new` a new photo with lines to its 4 nearest Anna points | triplet moves, points gather, new photo appears | `embedding.json` (counts real) |
| 6 | The result | 84 % and 81 %; Joya is hardest in both | `result`: two panels, three bars each, direct labels | bars grow; the Joya rows are marked | `results.json` (real) |
| 7 | Where it leads | Feasible; more photos next; goal is a belt with a camera | `belt` cream: conveyor, camera arch, fruit moving, name tags | fruit moves under the camera, tags appear after it | hero SVGs |

No light layer.


Legibility pass (2026-11-19): step 3 key "one photo"; step 4 "✓ kept" beside EfficientNetB0; step 5 key "a test photo, coloured by variety"; step 6 panels named "Method 1: borrowed eye" and "Method 2: similarity map" (the text and facts use the same names; "transfer" and "metric learning" stay in the hood).

Redesign of steps 4 and 5 (2026-11-20, Kenji: the old diagrams were hard to follow for non-ML readers): step 4 shows what the borrowed network learned (edges, textures, shapes) and how the small part uses it; step 5 shows one training round of three photos before the map, and the nearest-neighbour naming at the end. The chips VGG19 / ResNet50 / EfficientNetB0 left the stage; the networks stay in the text and the hood.
