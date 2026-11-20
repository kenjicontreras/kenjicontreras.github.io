# Storyboard: vector-spectra

Spine: one leg → one spectrum of about 52,000 values → 1,136 spectra of 30 species → a map where
each species is an island → 99 % and 93 % named correctly. Nothing is shown under the stage.

| # | Headline | What the reader learns | Stage (layers) | Motion | Data and assets |
|---|---|---|---|---|---|
| 1 | Small animals, serious diseases | Mosquitoes and ticks carry disease; control starts with the species | `table` light: `hero-m`, `hero-t`, `s1-item` name and disease tags | tags appear | hero SVGs |
| 2 | Look-alikes | Identified by eye, slowly; some species look the same | `lens`: two near-identical silhouettes under a lens, `lens-item` | heroes leave, lens closes in, question marks | `mosquito-mini.svg` |
| 3 | A protein fingerprint | Laser, flight tube, lighter molecules first, spectrum | `bench` dark: `plate`, `laser`, `tube`, `ion` ×14, `detector`, `trace` | laser fires, ions fly at different speeds, the spectrum draws | `bench-back.svg`, `bench-front.svg` (ions fly between them); `spectra.json` (illustrative) |
| 4 | The data | 826 + 310 spectra, 30 species, very uneven | `data`: `bar-m` ×12, `bar-t` ×18, counters | bars grow on one common scale | `species.json` (real) |
| 5 | Learn to compare, not to memorise | Same species close, different species far | `compare`: three spectrum cards, the shared network, a space with three points | cards feed the network, the points move: one pulled in, one pushed out | `spectra.json` cards |
| 6 | A map where species form islands | Every spectrum is a point; species gather | `islands`: two panels, `pt` points, `isle` rings | points appear scattered, then gather into 12 and 18 islands | `embedding.json` (illustrative positions, real counts) |
| 7 | How well it works | A new spectrum is named by its neighbours; 99 % and 93 % | `newpt`, `nn` lines, `name`, `acc` ×2 | a new point lands, its neighbours link, the name appears, then the two numbers | |
| 8 | Why it matters | Fast, repeatable identification that can grow | `table` again with `done` tags | back to the specimens, each with its name confirmed | hero SVGs |

## Light layer

| Effect | Steps | Real or illustrative |
|---|---|---|
| Laser flash at the sample | 3 | atmosphere |
| The spectra as points of light, one per spectrum | 6, 7 | counts real, positions illustrative |

The SVG stage is complete without it: it draws every fourth point itself.


Legibility pass (2026-11-19): step 4 key "one bar per species: how many spectra it has"; step 5 panel caption "same species: pulled close / other species: pushed away"; step 6 key "one spectrum · one species"; step 7 key "a new spectrum, named after its neighbours".
