# Storyboard: binational-manatees

Nine steps that follow the lab's public summary (the Instagram carousel in `resources/manatees/`)
slide by slide, with a few details added from the paper. Each step owns one unit of timeline time
in `scene.ts` (`at(k)` … `at(k + 1)`). Copy lives in `content.ts`; layer names are the `data-l`
values in `Stage.astro`. Rendered end states are in `frames/`.

Nothing is shown under the stage: the picture credit appears once, in the story footer.

| # | Slide | Headline | What the reader learns | Stage (layers) | Motion | Data and assets |
|---|---|---|---|---|---|---|
| 1 | 2 | Who are the Greater Caribbean manatees? | A large aquatic mammal and ecosystem engineer: up to 600 kg, 3 to 4 m. | `surface`, `manatee`, `s1-item` | Scientific name, a length bracket over the mother, and the weight appear on the wetland scene. | `manatee-pair`, `mangrove`, `seagrass`, `icon-weight` |
| 2 | 2 | Endangered, and hard to count | Range from Mexico to Brazil; fewer than 2,500 adults; four threats; murky water. | `range`, `range-line`, `range-island`, `endangered`, `study-box`, `threat` | The range draws along the coast from Mexico to Brazil, the Endangered badge and the study area appear, then the four threat icons. | `data/range.json`, `icon-net`, `icon-wetland`, `icon-pollution`, `icon-boat` |
| 3 | 3 | An acoustic fingerprint | Each manatee has its own intonation; a spectrogram is a picture of a call. | `deep`, `column`, `caller`, `call-arcs`, `card`, `wipe` | The scene dives to dark water. Four columns, one per animal: a manatee calls (sound arcs) and two of its spectrograms draw below it. No text on the stage: the drawing shows whose calls they are. | `assets/img/spec-*.webp`, `manatee-side` |
| 4 | 3 | From voices to individuals | Software groups calls that sound alike; each group is one manatee, with no labels and no fixed number. | `dot`, `ring`, `caller`, `who` | Each spectrogram shrinks to a dot; calls from many more manatees join and mix; the dots gather into groups and rings appear; each column's manatee flies into the group holding its two calls, and new manatees appear in the remaining groups. | `data/clusters.json` (illustrative), `manatee-side` |
| 5 | 4 | How we did it, step by step | Call → hydrophones → audio review → neural network → identity; the three headline numbers. | `pipe-row`, `pipe-line`, `result`, `n-files`, `n-hours`, `n-accuracy` | Five numbered stages appear in turn on the left; on the right the counters run up to 1,931,079, > 64,000 and 83.75 %. | `hydrophone`, `icon-audio-review`, `icon-neural`, `icon-fingerprint`, `icon-waveform`, `icon-clock`, `icon-target` |
| 6 | 5 | What we discovered | 110 identified (61 Panama, 49 Costa Rica); nine crossed the border; long stays. | `map`, `station`, `pop`, `track`, `swimmer`, `lab61`, `lab49`, `lab9` | The coast and its hydrophones appear, then the individuals off each station group, then nine tracks from Changuinola to Costa Rica in the order the animals arrived. | `data/map.json`, `data/stations.json`, `data/crossings.json` |
| 7 | 7 | When do they travel? | More rain and warmer air at the origin; seasonal floods open routes. | `weather-item` | The tracks stay; three conditions appear beside them. | `icon-rain`, `icon-thermo`, `icon-flood` |
| 8 | 8 | Key proposal: a binational corridor | A 984 km corridor across both countries. | `light`, `land`, `corridor`, `lab984` | The map turns light and the corridor band draws along the coast. | `map.coast`, `map.borders` |
| 9 | — | Why it matters | First acoustic evidence that manatees connect the two countries; listening works where watching fails. | `surface`, `manatee`, `murk`, `why-station`, `why-wave`, `why-card`, `why-voice`, `why-link` | Back to the opening wetland scene; the water turns murky and the mother and calf all but vanish; a hydrophone in each country appears, a call spreads through the water, each station's card draws the same voice print, and a "same voice" link joins them. (The summary's "What can you do?" cards, `action`, are kept in the stage, hidden.) | `hydrophone`; the voice print is a hill-shaped contour (a hi-squeak), schematic |

## Light layer (`gl.ts`, optional)

Where WebGL is available the stage gains: sunlight and particles in the water (1, 9); particles
that rush upward as the scene dives (3); the calls of step 4 drawn as 30,928 points that turn
slowly in depth and gather into the groups; a glow that draws with each track and then pulses from
Panama to Costa Rica (6, 7); and rain over the Panamanian origin (7). Steps 2, 5 and 8 are left
plain. The table above describes the SVG, which is the whole story where the layer is off.

## Design decisions worth keeping

- **Follow the published summary.** Order, headlines and numbers match the lab's slides, so the
  page never says more than the authors did. Paper-only detail goes in "Under the hood".
- **One idea per step.** No incidental detail (an earlier version showed rejected bird calls; it was cut).
- **The stage never carries small print.** Inside the SVG, labels are 22 units or larger; the
  credit line is HTML in the story footer.
- **Colour has four meanings only** (see `style.md`): blue and amber are the two countries,
  yellow-green is a call or an identified animal, red is endangered or a threat.
- **Dive and resurface.** Light for the species (1, 2), dark water for the method and the finding
  (3 to 7), light again for the proposal (8), and back to the opening scene for why it matters (9), where
  murky water hides the animals and only listening finds them.
- **Honest marks.** Anything illustrative or schematic is said so in the credit line in the story
  footer and in the `status` field of its data file.


Legibility pass (2026-11-19): step 3 caption "each column: one manatee and two of its calls" (cards 190 high, y 132 + row × 202, to make room); step 4 key "one call · one manatee: calls that sound alike"; steps 6–7 key "one manatee · heard in both countries" (hidden at step 8).
