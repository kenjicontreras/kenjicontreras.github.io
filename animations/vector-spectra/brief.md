# Brief: vector-spectra

## Source

- **Primary:** Merchan F, Contreras K, Gittens RA, Loaiza JR, Sanchez-Galan JE (2023). *Deep metric
  learning for the classification of MALDI-TOF spectral signatures from multiple species of
  neotropical disease vectors.* Artificial Intelligence in the Life Sciences 3:100071.
  <https://doi.org/10.1016/j.ailsci.2023.100071> · open access, CC BY-NC-ND, © 2023 the authors ·
  local copy `resources/papers/merchan-2023-ailsci-3-100071.pdf`
- **Data sets (earlier work, not Kenji's):** Loaiza et al. (anopheline mosquitoes), Gittens et al.
  (hard ticks); both cited in the paper as the source of the spectra.
- **No public summary** was found, so the story follows the kit's default arc.
- **Licence consequence:** CC BY-NC-ND does not allow adapted figures on a commercial page. No
  figure of the paper is reused. Species names and counts (facts) are quoted from its tables;
  spectra and maps on the stage are original drawings, labelled illustrative.
- CV project: "Deep Metric Learning for Disease-Vector Species Identification from Mass Spectra".

## Audience and message

- **Readers:** potential clients from any background. Some have ML expertise.
- **One sentence:** *We trained neural networks to name 30 species of mosquitoes and ticks from the
  protein fingerprint of a leg, by teaching them what "similar" means instead of memorising
  each species.*
- **Lay reader should leave with:** which species is present matters for disease control; experts
  with microscopes are slow and look-alikes fool them; a machine measures a fingerprint; software
  learned to match fingerprints.
- **Technical reader should notice:** metric learning (Siamese, triplet) on raw 1-D spectra, no
  pre-processing, small and unbalanced classes, hard-negative mining, K-NN on embeddings, and an
  honest comparison with the earlier PCA/LDA results.
- **Kenji's role:** second author. The paper has no CRediT statement, so the story does not state
  a role.

## Fact sheet

Every number shown in the story. "§" is the section of the paper.

| Fact | Value | Where |
|---|---|---|
| Why it matters | vector-borne diseases are mitigated only by eliminating and monitoring vector populations | §1 |
| Diseases named | malaria (*Plasmodium*, mosquitoes); Rocky Mountain spotted fever (*Rickettsia*, ticks) | §1 |
| Panama | largest number of described mosquito and hard tick species in Central America | §1 |
| Species recorded in Panama | 265 mosquito species (and "23 Ixodid tick species that can parasitize wildlife and humans") | §1 |
| Unstudied | most studies cover a few species; the vast majority remain unstudied | §1 |
| Identification today | morphological keys; no accurate, reliable, cost-effective alternative | §1 |
| Cryptic species | similar morphology, different evolutionary units, easily confused | §1 |
| Technique | MALDI-TOF: matrix-assisted laser desorption/ionisation, time of flight | §1 |
| Mass fingerprints | protein profiles used to identify microorganisms and, more recently, arthropods | §1 |
| Sample | protein extracted from the legs; three technical replicates per specimen | §2.1 |
| Storage | mosquitoes dry-frozen; ticks several years in 70 % ethanol | §2.1 |
| Field-collected | specimens were gathered in the field, not reared in a laboratory | §4 |
| Spectrum size | 52,570 values (mosquitoes) and 52,906 (ticks); m/z 0 to 50,000 Da | §2.3, Fig. 2 |
| Data | 826 spectra from 12 mosquito species; 310 spectra from 18 hard tick species | Abstract, Tables 1–2 |
| Counts per species | mosquitoes 24 to 192; ticks 6 to 60 | Tables 1–2 |
| Coverage | about 70 % of anopheline taxa and 50 % of hard tick taxa reported for Panama | §4 |
| Earlier method | PCA and LDA after smoothing and baseline correction: 93.3 % (mosquitoes), 94.2 % (ticks) | §1, §4 |
| No pre-processing | CNNs trained on raw spectra; only truncation to a common length | §2.3 |
| Unbalanced classes | handled with class weights | §2.2 |
| Network | 1-D CNN after LeNet: three convolution blocks (32, 16, 8 filters), batch normalisation, dense 32 and 16 with dropout, L2-normalised embedding, Adam | §2.2 |
| Siamese | pairs, contrastive loss, margin α = 0.55; 5-fold cross-validation, 30 epochs | §2.2.1, §2.3 |
| Triplet | anchor / positive / negative, triplet loss, α = 0.4, online mining of hard negatives; K-NN on the embeddings | §2.2.2, §2.3 |
| Triplet validation | Monte Carlo cross-validation, 20 iterations of 32 epochs; split 80/20 (mosquitoes), 70/30 (ticks) | §2.3 |
| Triplet result | accuracy 0.9979 (mosquitoes), 0.9325 (ticks) | Table 9; abstract "99 % and 93 %" |
| Mosquito errors | all test spectra correct except one (*An. albimanus*) | §3.2 |
| Siamese result | 91 to 94 % | Abstract, §3.1, Table 8 (see care points) |
| Embedding figure | PaCMAP; before training a species is anywhere on the map, after training it clusters | §3.3 |
| Two models | mosquitoes and ticks were trained and evaluated as two separate data sets | §2.3, Figs 10–11 |
| Why ticks are harder | ethanol degrades proteins; fewer specimens per species; lower-quality spectra | §4 |
| Honest comparison | triplet improved mosquitoes (93.3 → 99 %) and slightly lowered ticks (94.2 → 93 %); the gain is no manual preparation, speed | §4 |
| Open question | what caused the remaining misclassifications | §4 |
| Tools | TensorFlow, SciPy, scikit-learn, Google Colab | §2.5 |

## Care points

- **Siamese accuracies disagree inside the paper.** Abstract and discussion: 91.22 % ticks,
  94.46 % mosquitoes. Results text (§3.1): the reverse. Table 8: 91.88 % mosquitoes, 91.47 %
  ticks. The story gives only the range "91 to 94 %" and assigns nothing. The CV sentence
  ("94–99 % for mosquitoes and 91–93 % for ticks") follows the abstract.
- **Table 2 adds up to 309**, the text says 310 tick spectra. The story says 310; the map draws
  309 tick points and 826 mosquito points.
- **Table 1's abbreviations do not line up with its species names** (e.g. "Anowd" beside
  *An. pseudopunctipennis*, used in the text for *An. oswaldoi*). The stage therefore shows no
  per-species labels except *Anopheles albimanus*, which is unambiguous.
- Species names are spelled as in current taxonomy (*A. cajennense*, *A. calcaratum*,
  *A. sabanerae*, *Haemaphysalis juxtakochi*); the paper's table has typos.
- Mosquitoes and ticks are **two models and two maps**. The stage keeps them in two panels.
- 99 % and 93 % are test-set accuracies on these collections, from specimens already identified
  by specialists. The story does not claim field performance on unknown material.
- For ticks the new method did **not** beat the earlier one; the story says so.
- **The tick count is left out of step 1.** The introduction gives 23 ixodid species for Panama,
  while the discussion says the 18 species studied are "roughly 50 %" of the hard tick taxa
  reported for the country. The story shows only the mosquito figure (265) and, in step 4, the
  paper's own coverage estimate (70 % and 50 %).
- "Hospitals use MALDI-TOF for bacteria" is true but not in the paper; the story says only that
  the technique is used to identify microorganisms, as the paper does.

## Fact check, 2026-11-16

Every sentence of `content.ts` was re-read against the paper. Results of the check:

- Three internal inconsistencies of the paper were found and kept out of the story: the Siamese
  accuracies, the tick total (309 or 310) and the number of tick species in Panama (see care
  points). None affects a number that is shown.
- The headline results (99 % and 93 %) match the abstract, the discussion and Table 9.
- The comparison with the earlier method (93.3 % and 94.2 %) is quoted from the discussion,
  including the fact that ticks did not improve.
- General statements (malaria and spotted fever as vector-borne diseases, MALDI-TOF used to
  identify microorganisms, cryptic species) are worded as in the paper's introduction.
