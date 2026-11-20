# Brief: drone-manatees

## Source

- **Primary:** Sanchez-Galan JE, Contreras K, Denoce A, Poveda H, Merchan F, Guzmán HM (2025).
  *Drone-Based Detection and Classification of Greater Caribbean Manatees in the Panama Canal
  Basin.* Drones 9(4):230. <https://doi.org/10.3390/drones9040230> · CC BY 4.0 ·
  local copy `resources/papers/sanchez-galan-2025-drones-9-230.pdf`
- **No public summary** (press release, carousel) was found for this paper, so the story follows
  the kit's default arc: problem → data → scale → what the system does → result → use.
- CV project: "Deep Learning Detection and Classification of Antillean Manatees in Drone Imagery".

## Audience and message

- **Readers:** potential clients from any background. Some have ML expertise.
- **One sentence:** *We taught software to find manatees, a few pixels wide, in tens of thousands
  of drone photos of the Panama Canal's lake, and to say whether it sees one animal, a mother and
  calf, or a group.*
- **Lay reader should leave with:** there are manatees in the Canal; they are nearly impossible to
  count by eye from the air; cutting photos into tiles lets a model find them; it works, with
  honest limits.
- **Technical reader should notice:** small-object detection with sliced inference, a hard
  negative class (logs), a train/test split by pilot and by sequence, zero-shot classification
  with text prompts, and results reported with their weak points.
- **Kenji's role (CRediT):** data curation, methodology, software, writing of the original draft.

## Fact sheet

Every number shown in the story. "§" is the section of the paper.

| Fact | Value | Where |
|---|---|---|
| Species | Greater Caribbean (Antillean) manatee, *Trichechus manatus manatus*; IUCN endangered | §1 |
| Legal protection in Panama | since 1967 | §1 |
| Lake | Gatún Lake, about 436 km², created in 1913 as the Canal's water reservoir | §2.1 |
| Water plants | an invasion of hyacinth reported in 1913 | §2.1 |
| Introduction | June 1964: nine Greater Caribbean manatees and one Amazonian manatee, to control aquatic plants and help against malaria mosquitoes | §2.1 |
| Outcome | the project did not reach its objectives; the animals escaped the enclosure and the experiment was ended | §2.1 |
| Population today | approximately 20 to 25 individuals in the Canal basin | §1 |
| Why not planes | crewed aerial surveys are costly and logistically hard over turbid water with dense vegetation | §1 |
| Survey areas | 44 polygons of 48 to 856 ha covering the lake; they avoid the main shipping channel (overflight restrictions of the Canal Authority) | §2.2 |
| Flight plan | pre-programmed lines, 25 % forward and 40 % lateral overlap, 5 to 12 m/s, 60 to 100 m altitude | §2.2 |
| Schedule | every 15 days, 8:00 to 11:00, February 2023 to April 2024 | §2.2 |
| Drones | DJI Mavic 3 Enterprise (20 MP), DJI Matrice 200 (24 MP); a licensed pilot each | §2.2 |
| Photo interval | every 3 to 5 s | §2.2 |
| Effort | 65 flights, 220.9 flight hours, about 26,678 ha | §2.3 |
| Focus | polygons sampled biweekly until the most-used areas were found, then effort focused there | §2.3 |
| Photos reviewed by eye | 57,332 images; 76 manatees observed | §2.3 |
| Mother and calf pairs | 16 pairs on nine sampling days (179 images) | §2.3 |
| Collections | pilot 1: 64,240 images, pilot 2: 15,458, later pilot 1 flights: 22,336 (held out) | §2.3 |
| Image sizes | 3840 × 2160 up to 9504 × 6336 pixels | §2.3 |
| Sequences | images of the same animals grouped into sequences so similar images do not straddle train/validation/test; 30 training sequences (pilot 1), 15 test sequences (pilot 2) | §2.3, Tables 4–5 |
| Logs | a second class: widely present because droughts lower the water; silhouettes like manatees caused errors | §2.7 |
| Detector | YOLOv8s fine-tuned; classes "manatee" and "logs" | §2.5 |
| Tiles | 640 × 640 crops with SAHI; 20 % overlap for training, 10 % at inference | §2.5, §3.2 |
| Why overlap | objects at a tile edge would otherwise be split | §1 |
| Training | 10-fold cross-validation, 40 epochs, batches of eight, early stopping | §2.8, §3.1 |
| Best fold (Model 9) | precision 0.930, recall 0.858, mAP50 0.922, mAP50-95 0.652 | Table 2 |
| Unseen pilot, per image | manatee class: precision 0.862, recall 0.438, F1 0.581 | Table 3 |
| Sequences found, training set | 27 of 30 by Table 4 (S01, S02, S07 not detected) | Table 4 |
| Sequences found, test set | 11 of 15 | Table 5, §4 |
| What explains misses | few images of the animal (fewer than three), complex scenery, glare; "not related to altitude" | §3.2, §4 |
| Second model | AltCLIP, zero-shot: image and text in one embedding space, cosine similarity, softmax | §2.6 |
| Pre-processing | luminance (Y) channel only, resized to 224 × 224 | §2.6 |
| Classes and prompts | one manatee, mother–calf pair, many manatees, logs, background; manatees described as "the shape of a fish" | Table 1 |
| Zero-shot test set | 316 crops: 113 one manatee, 61 mother–calf, 20 many, 70 logs, 52 background | Table 6 |
| Zero-shot result | top-1 accuracy 0.706, top-2 accuracy 0.889 | Table 6 |
| Per class recall | one manatee 0.894, mother–calf 0.377, many manatees 0.350 | Table 6 |
| The example shown | Fig. 18C (the image of Fig. 8): a mother–calf pair plus a single manatee; predicted "many manatees"; scores logs 0.195, mother–calf 0.205, many 0.206, one 0.201, background 0.193 | Fig. 18, Table 7 |
| Hardware | Ryzen 9 5950X, RTX 3080 (10 GB), 128 GB RAM | §2.9 |
| Why YOLOv8 | compatible with SAHI; small enough for a future embedded, real-time system on the drone | §2.4, §4 |
| Significance | first comprehensive insight into the manatee population of the Canal basin | §4 |
| Next steps | better detection of adult–calf pairs (reproduction); avoiding duplicate counts by tracking | §4 |

## Care points

- **27 or 28 of 30.** The discussion says manatees were detected in 28 of 30 training sequences;
  Table 4 lists 27 detected and three not (S01, S02, S07), and Fig. 12 shows three red dots. The
  story uses the table: 27.
- **"More than 57,000 images"** (abstract) is the manually analysed set of 57,332. The three
  collections listed in §2.3 add up to more (64,240 + 15,458 + 22,336). The story says 57,332
  photos were reviewed by eye and does not give a total.
- **Recall on unseen flights is low (44 %)** and the paper says so. The story states it next to the
  precision; it must not be softened.
- The 93 % precision is the best of ten cross-validation folds, on tiles from the training pilot;
  it is not a field accuracy. It appears only in an "Under the hood" line, labelled as such.
- The zero-shot scores of the example are nearly tied (0.193 to 0.206). The bars are drawn on a
  true zero-based scale so the tie is visible; they are not stretched.
- Altitudes in Tables 4–5 (65 to 328 m) are GPS altitudes and do not match the 60 to 100 m of the
  flight plan; the story quotes the flight plan only.
- "Endangered": the paper's wording is "was considered an endangered species by the IUCN". The
  subspecies' current Red List status (Endangered, 2024) was confirmed for the first story.
- The lake outline, the 44 areas and the sequence positions are digitised from the paper's
  figures and are approximate. The drawn photo with its specks, tiles and boxes is illustrative.

## Fact check, 2026-11-16

Every sentence of `content.ts` was re-read against the paper's text and tables. Statements about
the history of the Gatún manatees were also checked outside the paper.

- **Confirmed outside the paper.** The 1964 introduction of ten manatees (one Amazonian, nine
  West Indian from Bocas del Toro) for aquatic-plant control, its abandonment a few years later
  after animals escaped, and an estimate of 20 to 25 animals in the lake are reported by the
  Smithsonian (2022), the IUCN Marine Mammal Protected Areas Task Force (Lake Gatun and Panama
  Canal IMMA fact sheet) and a Rufford Foundation project report. The 20 to 25 estimate dates
  from a 2015 survey; the story says "are thought to live", not "were counted".
- **Corrected while checking.** The detected training sequences are 27 (Table 4), not the 28 of
  the discussion. The photo total is 57,332 reviewed images, not a grand total.
- **Kept honest.** Recall 44 % on unseen flights is stated beside precision 86 %. The 93 % figure
  is labelled as the best cross-validation fold.
