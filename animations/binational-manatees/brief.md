# Brief: binational-manatees

## Source

- **Primary:** Guzman HM, Estévez RM, Contreras K, Poveda H, Sanchez-Galan JE, Merchan F (2025).
  *Year-round residency and movement behavior of Greater Caribbean manatees (Trichechus manatus
  manatus) in Panama and Costa Rica.* Frontiers in Marine Science 12:1661294.
  <https://doi.org/10.3389/fmars.2025.1661294> · CC BY 4.0 · local copy `~/Downloads/fmars-12-1661294.pdf`
- **Method validation:** Merchan F, Contreras K, Poveda H, Guzman HM, Sanchez-Galan JE (2024).
  *Unsupervised identification of Greater Caribbean manatees using Scattering Wavelet Transform and
  Hierarchical Density Clustering from underwater bioacoustics recordings.* Frontiers in Marine
  Science 11:1416247. <https://doi.org/10.3389/fmars.2024.1416247> · CC BY 4.0
- **Public summary followed slide by slide:** the lab's Instagram carousel "Conectividad de
  manatíes en el Gran Caribe" (@hectorguzmanlab), seven of ten slides in `resources/manatees/`.
  Its structure, wording and numbers are followed; its artwork is third-party and is not reused.

## Audience and message

- **Readers:** potential clients from any background. Some have ML expertise.
- **One sentence:** *I helped build the system that picked individual manatees out of seven years
  of underwater sound, and it showed that the animals move between two countries.*
- **Lay reader should leave with:** the problem (you cannot see them), the idea (every animal has
  a voice), the result (nine crossed the border), the consequence (a protected corridor).
- **Technical reader should notice:** the scale (1.9 M files), a multi-stage pipeline, unsupervised
  identification with no labels, validation against known animals, conservative filtering.
- **Kenji's role in the paper (CRediT):** formal analysis, software, methodology, data curation,
  review and editing. Copy says "we" for findings and "I" only for the pipeline work.

## Fact sheet

Every number shown in the story. "§" is the section of the 2025 paper unless noted.

| Fact | Value | Where |
|---|---|---|
| Role in the ecosystem | megaherbivore, "ecosystem engineer": shapes plant communities where it feeds | §1 Introduction; slide 2 |
| Weight and length | up to 600 kg, 3 to 4 m | slide 2 (not in the paper) |
| Range | southern Mexico to northern Brazil, incl. the Antilles | slide 2; §1 gives "Caribbean, Mexico, Central America and northern South America" |
| Main threats | fishing nets, wetland degradation, water pollution, boat collisions | slide 2; §1 gives "human activities and habitat degradation" |
| Mature individuals left (subspecies) | fewer than 2,500; listed Endangered | §1 Introduction |
| Why not visual surveys | poor visibility, brackish wetland water | §1, last paragraph |
| Monitoring start | Panama Sept 2015, Costa Rica Nov 2020 | §2.2 |
| Hydrophones | up to 15 instruments | §2.2 |
| Recording settings | 2-minute clips every 8 or 10 min, 96 kHz | §2.2 |
| Files analysed, Panama | 1,130,407 (37,680.23 h, 1,570 days) | §2.3 |
| Files analysed, Costa Rica | 800,672 (26,689.07 h, 1,112 days) | §2.3 |
| **Files analysed, total** | **1,931,079** (sum) | §2.3 |
| **Hours, total** | **64,369** (sum; 7.3 years of continuous sound) | §2.3 |
| Pipeline stages | denoise → detect (ACF-RMS) → classify (CNN, MobileNet transfer learning) → cluster | §2.3–2.3.4 |
| Bird calls | manatee-like bird calls discarded by manual spectrogram review | §2.3.3, §2.3.5 |
| Vocalisations entering clustering | 26,787 (Panama) + 4,141 (Costa Rica) = **30,928** | §2.3.6, §3 |
| Clustering method | Scattering Wavelet Transform (Q=128, J=7) → PaCMAP (5-D) → HDBSCAN, CDbw validation | §2.3.4 |
| Validation on known animals | 23 captured manatees → 24 estimated; 83.75 % of calls assigned to the right source; 14.05 % mean error in the number of individuals | §2.3.4 (from Merchan et al. 2024) |
| Clusters after fusion and review | 88 (Panama), 63 (Costa Rica) | §2.3.5, §3 |
| Presumed individuals kept | **61 Panama** (1,012 calls), **49 Costa Rica** (343 calls) → 1,355 calls | §3 |
| Heard in both countries | **9** presumed individuals (B1–B9), about 200 km apart | §3 |
| Route | all left Panama via the Changuinola river system; most entered Costa Rica at Barra del Colorado, two (B7, B9) via Tortuguero–Pacuare | §3.1 |
| Mean residence | 1,059 days Panama, 292 days Costa Rica | Abstract, Table 1 |
| Longest residence | 3,026 days Panama (about 8 years), 1,160 days Costa Rica | Abstract |
| Mean gap between countries | 340 days (min 25, max 1,129) | §3.2 |
| Rain at the origin | 12.3 ± 2.14 mm during crossings vs 8.3 ± 1.67 mm otherwise (p < 0.0001) | §3.4 |
| Air temperature anomaly | 0.97 ± 0.04 °C during crossings vs 0.80 ± 0.05 °C (p < 0.0001) | §3.4 |
| Sea-surface temperature | 29.5 °C in both periods, no significant difference | §3.4 |
| Seasonal floods | "can open access routes to wetlands and feeding areas" | slide 7 (interpretation; not a result in the paper) |
| Individuals identified | 110 "identified acoustically" = 61 Panama + 49 Costa Rica | slide 5; §3 |
| What people can do | boat slowly; do not feed; report injured or stranded animals; protect and visit protected areas responsibly | slide 9 |
| Subspecies name | of the American manatee, formerly called the Antillean manatee | §1 |
| Habitat | brackish coasts, rivers and lagoons; seagrass beds, mangrove-fringed lagoons | §1 |
| Mother and calf | females and calves selectively respond to each other's calls when reuniting | §1 |
| Projected decline | 20 % over the next two generations | §1 |
| Populations | small, geographically isolated, several poorly studied | §1 |
| Call rate | one to two calls per 5-minute period (Phillips et al. 2004) | §1 |
| What makes a voice individual | fundamental frequency, bandwidth, frequency range, call contour; stable for years | §1 |
| Call types used | squeaks, hi-squeaks and mixes of both | Abstract, §2.3.5 |
| Validation setting | captured animals held in a floating cage for about 8 h | §4 Discussion (Merchan et al. 2024) |
| Cluster review | fusion, manual revision, conservative discarding; matched across countries | §2.3.5 |
| Compute | 128-core Xeon server; Ryzen 5950X workstation with RTX 3080 | §2.3 |
| Detector and classifier | ACF-RMS autocorrelation detector; MobileNet with transfer learning, TensorFlow 2.9 | §2.3.2–2.3.3 |
| First evidence | first acoustic evidence of long-range connectivity between the two nations | §3.1 |
| Climate comparison | satellite and reanalysis data 2020–2024 in 15-day intervals, crossing vs non-crossing | §2.4 |
| Climate vulnerability | both countries highly vulnerable: rising temperatures, altered rain, extreme events | §2.1 |
| Corridor split | 220 km Costa Rica, 764 km Panama; links protected areas, feeding and breeding wetlands | §4 |
| Why connectivity | keeps genetic diversity, buffers small populations against inbreeding | §4 |
| Next steps | satellite telemetry; population size estimate from the acoustic data | §4, end |
| Proposed corridor | about **984 km** of coastline (220 km Costa Rica, 764 km Panama) | §4, end |
| Inside the corridor | 18 protected areas (8 CR, 10 PA), 4 Ramsar sites, over 57 rivers | §4, end |

## Care points

- The paper says **"presumed individuals"**: identity is inferred from voice, not confirmed by
  sight. The story says "identified by voice" and never claims a census.
- The story says **"110 manatees identified by voice"**, as the lab's summary does. In the paper
  these are 61 + 49 presumed individuals, and the nine border-crossers were matched across the two
  sets, so 110 counts voice profiles per country. The "Under the hood" line of step 6 says so.
- Facts marked "slide" come from the lab's summary, not the paper. They are standard for the
  species but should be checked with the authors if the story is cited.
- **Corridor area is left out.** The slide says 2,270 km², the paper says 2,631 km² (and its two
  country figures add up to 2,541). To confirm with the authors before using.
- 83.75 % is from the 2024 validation study, not from the binational data set.
- Hydrophone positions, the nine tracks and the cluster scatter are drawn from the paper's figures
  or are illustrative; each data file in `data/` says which.

## Fact check, 2026-11-16

Every biological and acoustic statement in `content.ts` and on the stage was re-read against the
paper's text; slide-only facts were checked against outside sources.

- **Confirmed outside the paper.** IUCN Red List 2024 (Morales-Vela, Quintana-Rizzo and
  Mignucci-Giannoni, e.T22105A43793924): the subspecies is Endangered (criterion C1) with an
  estimated 2,091 mature individuals, so "fewer than 2,500" holds. The paper's corridor paragraph
  calls it "recently listed vulnerable"; that is the status of the species as a whole, not the
  subspecies. The story says Endangered.
- **Size and weight are the lab's figures (slide 2) and differ from general references.** US Fish
  and Wildlife Service: adult manatees are typically 9 to 10 ft (about 3 m) and can exceed 13 ft
  (4 m); typically about 1,000 lb (450 kg), with Antillean manatees usually smaller and lighter
  than Florida ones. So "3 to 4 m" reads as typical-to-maximum, and "up to 600 kg" is a typical
  upper weight, not a record. Worth confirming the intended meaning with the lab.
- **Range.** The story keeps the slide's "southern Mexico to northern Brazil". USFWS words it as a
  patchy distribution from Mexico's Gulf coast to the north-eastern coast of Brazil, plus the
  Caribbean. Consistent.
- **"110 manatees identified".** The paper never gives 110. It gives 61 presumed individuals in
  Panama and 49 in Costa Rica, and each of the nine cross-border animals is a match between one
  Panama ID and one Costa Rica ID. Read that way the two totals cover 101 distinct voices (an
  inference; Table S5 would settle it). The step text now gives 61 and 49 and does not sum them;
  the strip that showed the lab's 110 under the stage has since been removed.
- **Call rate.** "One to two calls per 5 minutes" is the paper's citation of Phillips et al. 2004,
  measured on Florida manatees.
- **One animal's calls are not identical.** Fig. 2 shows squeaks (flat contour) and hi-squeaks
  (hill-shaped) from the same animal grouped together. The copy says calls "vary, but share
  features", not that they share one shape.
- **83.75 %** is the share of calls assigned to their true source in the 2024 validation, which
  mixed recordings of known animals; it is not accuracy on the binational data.
- **Climate data.** Only rainfall was aggregated into 15-day periods; air-temperature anomaly and
  sea-surface temperature are monthly products, and the air-temperature product is a reanalysis.
  The paper calls the set "remote sensing data"; so does the story.
- **Sea level is left out.** Results and Table 3: lower during crossings (0.087 m vs 0.115 m).
  The abstract says crossings coincided with high sea levels. Unresolved in the paper.
- **"Seasonal floods open routes"** is on slide 7 only. The paper does not mention floods.
- **Monitoring dates.** Hydrophones from September 2015 (Panama) and November 2020 (Costa Rica),
  §2.2; first retained detections December 2015 and May 2021. The abstract's "since 2016" and
  "since 2021" refer to the latter.

