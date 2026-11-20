# Brief: watermelon-varieties

## Source

- **Primary:** Contreras K, Henry A, Cáceres-Hernández D, Sanchez-Galan JE (2022). *Comparing
  Convolutional Neural Networks and Deep Metric Learning Methods for Classification of Export
  Watermelon (Citrullus lanatus) Varieties.* 2022 IEEE 31st International Symposium on Industrial
  Electronics (ISIE). <https://doi.org/10.1109/ISIE51582.2022.9831572> · © 2022 IEEE ·
  local copy `resources/papers/contreras-2022-ieee-isie-watermelon.pdf`
- **Context:** Cáceres-Hernández D et al. (2023), *Recent advances in automatic feature detection
  and classification of fruits including with a special emphasis on Watermelon: A review*,
  Neurocomputing 526:62–79 (same group; not used for facts here).
- **No public summary** was found, so the story follows the kit's default arc.
- **Licence consequence:** the paper is IEEE copyright. Kenji is first author; IEEE lets authors
  reuse portions of their own paper with the copyright notice and citation. The story reuses
  crops of Fig. 1 (the variety photographs) on that basis, and nothing else. All diagrams are
  original drawings.
- CV project: "Identifying Watermelon Varieties from Photos with Machine Learning techniques".

## Audience and message

- **Readers:** potential clients from any background. Some have ML expertise.
- **One sentence:** *With only 330 photos, I compared two ways of teaching a model to tell three
  look-alike watermelon varieties apart; both reached about 80 to 85 %, and both showed where
  more data is needed.*
- **Lay reader should leave with:** varieties look alike; the data was tiny; two sensible methods
  were compared honestly; it is feasible, not finished.
- **Technical reader should notice:** small-data discipline (frozen backbones, cross-validation,
  model choice by consistency rather than best fold), metric learning as a second route, the
  error analysis by class.
- **Kenji's role:** first author. The story speaks in the first person.

## Fact sheet

Every number shown in the story. "§" is the section of the paper.

| Fact | Value | Where |
|---|---|---|
| Export crop | watermelon is considered one of Panama's main export activities | §I |
| Manual sorting | "Watermelon sorting in Panama relies heavily on manual inspection" | Kenji's CV summary; the paper states only the goal of an automatic system |
| Goal | a recognition strategy usable in an automatic system on a conveyor belt | §I, §V |
| Earlier work | the same group used traditional feature extraction and machine learning on the same varieties | §II |
| Varieties | Anna Hybrid, Quetzali, Joya Hybrid: distinctive markings, shape and depth of colour | §II-A |
| Photos | 330 in total: 120 Anna, 90 Joya, 120 Quetzali | Abstract, Fig. 1 |
| Capture | RGB, 360 × 270 pixels, white background | §II-B |
| Input | sub-sampled, cropped and resized to 40 × 40 pixels | §II-B |
| Splits | 80/20 for transfer learning, 60/40 for metric learning | §II-B |
| Why not from scratch | the data set is too small; a custom CNN would overfit | §III |
| Backbones | VGG19, ResNet50, EfficientNetB0, pre-trained (ImageNet), frozen | §III |
| Head | global average pooling, dense 8, dense 12, dropout 0.3, softmax over 3 classes; Adam | §III-B |
| Tuning | grid search with 5-fold cross-validation; 70 epochs, batch 16 | §III-A, §V-A |
| Cross-validation accuracy | VGG19 89.78 %, ResNet50 94.33 %, EfficientNetB0 90.56 % | Table I |
| Model choice | ResNet50 looked best but showed heavy overfitting; EfficientNetB0 was consistent | §V-C |
| Augmentation | rotations, flips and shifts did not improve results | §V-C |
| Metric learning | triplet network, online semi-hard negative mining, margin 0.3, 16-D embedding, batch normalisation, K-NN; 8 epochs, batch 8 | §IV, §V-B |
| Picture of the embedding | PCA, first two components, convex hull per variety; Joya overlaps the others | §V-B, Fig. 6 |
| Test accuracy, transfer learning | EfficientNetB0 0.84, ResNet50 0.83, VGG19 0.60 | Table II |
| Test accuracy, metric learning | EfficientNetB0 0.81 | Table II, abstract |
| Confusion, transfer learning | Anna 17 of 20, Joya 14 of 18, Quetzali 25 of 28 | Fig. 8 |
| Confusion, metric learning | Anna 29 of 31, Joya 26 of 35, Quetzali 26 of 34 | Fig. 8 |
| Reading | slight overfitting; most misclassified samples belong to Joya | Abstract, §V-C |
| Why metric learning anyway | can be trained to recognise varieties from very few samples (few-shot) | §V-C, §VI |
| Next steps | more images; attention-based networks; generative models; few-shot learning | §V-C, §VI |
| Tools | Python, Keras, Google Colaboratory | §V-A |

## Care points

- 84 % and 81 % come from **small test sets** (66 and 100 photos). The story gives the counts.
- The metric-learning confusion matrix sums to 100 photos, although a 40 % split of 330 would be
  132. The story reports what the figure shows and does not explain the difference.
- "Sorting relies on manual inspection" is from the CV summary, not the paper.
- The paper says both methods are "feasible" and that results "leave space for improvement".
  The story must not present this as a finished sorting system.
- Variety names: the paper writes "Joya Hybrid (also written Hoya)" and "Anna Hybrid"; the story
  uses Anna, Joya, Quetzali.
- Positions of the points on the map are illustrative; how many land in each group is real.

## Fact check, 2026-11-16

Every sentence of `content.ts` was re-read against the paper. Results of the check:

- The two overall accuracies (0.84 and 0.81) match Table II and the abstract; the per-variety
  counts were read from the confusion matrices of Fig. 8 at full resolution and add up to them
  (56 of 66 = 84.8 %, 81 of 100 = 81 %).
- "ResNet50 scored highest during training (94%)" is the cross-validation average of Table I;
  "it was memorising" is the paper's "heavy signs of overfitting".
- The DOI was confirmed in Crossref (10.1109/ISIE51582.2022.9831572).
- One statement does not come from the paper: that sorting depends on manual inspection (CV
  summary). It is marked in the fact sheet.
