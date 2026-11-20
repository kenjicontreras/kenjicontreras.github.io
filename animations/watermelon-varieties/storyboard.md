# Storyboard: watermelon-varieties

Spine: three look-alike varieties → 330 photos at 40 × 40 pixels → two methods → 84 % and 81 %
→ Joya is the hard one → a camera over a conveyor belt. Nothing is shown under the stage.

| # | Headline | What the reader learns | Stage (layers) | Motion | Data and assets |
|---|---|---|---|---|---|
| 1 | An export fruit, sorted by eye | Varieties are sorted by people looking at each fruit | `shed` cream: crates of fruit, a whole fruit and a slice, `s1-item` question tags | tags appear on the crates | hero SVGs |
| 2 | Three varieties | Anna, Joya, Quetzali look much alike | `varieties`: three real photographs, names, photo counts | photos arrive one by one, then names | `var-*.webp` (paper, © IEEE) |
| 3 | Only 330 photos | Tiny, uneven data; 40 × 40 pixels | `count`: 330 squares in three groups; `pixel` one real patch enlarged | squares fill with the counter; the patch grows, pixels showing | `patch-*.webp`; `results.json` (real) |
| 4 | Method 1: borrow a trained eye | Frozen pre-trained network plus a small trained head | `transfer` dark: patch → frozen block → small head → three names; backbone chips | data flows left to right; chips appear, one stays lit | icons |
| 5 | Method 2: learn what "similar" means | Photos of one variety placed together; Joya overlaps | `metric`: 100 points, three group rings, legend | points appear mixed, then gather; wrong ones stay ringed | `embedding.json` (counts real) |
| 6 | The result | 84 % and 81 %; Joya is hardest in both | `result`: two panels, three bars each, direct labels | bars grow; the Joya rows are marked | `results.json` (real) |
| 7 | Where it leads | Feasible; more photos next; goal is a belt with a camera | `belt` cream: conveyor, camera arch, fruit moving, name tags | fruit moves under the camera, tags appear after it | hero SVGs |

No light layer.


Legibility pass (2026-11-19): step 3 key "one photo"; step 4 "✓ kept" beside EfficientNetB0; step 5 key "a test photo, coloured by variety"; step 6 panels named "Method 1: borrowed eye" and "Method 2: similarity map" (the text and facts use the same names; "transfer" and "metric learning" stay in the hood).
