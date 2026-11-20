// All copy and numbers for the story. Every figure is traced in brief.md.
import type { StoryContent } from '../_shared/types';

export const content: StoryContent = {
  id: 'watermelon-varieties',
  title: 'Telling watermelon varieties apart from a photo',
  meta: 'Universidad Tecnológica de Panamá, 2021 to 2022',
  steps: [
    {
      title: 'An export fruit, sorted by eye',
      body: 'Watermelon is one of Panama’s export crops, and sorting the fruit by variety depends on people inspecting each one. The goal was to test whether a machine learning model could identify the variety from a photo and automate part of that work.',
      points: [
        'The aim: a recognition step that could work on a conveyor belt in a packing line.',
        'Earlier work by the same group used hand-designed image features. This study lets neural networks find their own.',
      ],
    },
    {
      title: 'Three varieties',
      body: 'Anna, Joya and Quetzali are the three export varieties in the study. They differ in their markings, their shape and the depth of their green, but not by much.',
      points: [
        'These are photographs of the fruit used in the study.',
        'Each fruit was photographed against a white background.',
      ],
      facts: [
        { value: '120', label: 'photos of Anna' },
        { value: '90', label: 'of Joya' },
        { value: '120', label: 'of Quetzali' },
      ],
    },
    {
      title: 'Only 330 photos',
      body: 'For a neural network that is a very small data set, and the three groups are uneven. Each photo was cropped to a patch of rind and reduced to 40 by 40 pixels.',
      points: [
        'With so few examples, a network trained from nothing would memorise them rather than learn the varieties.',
        'Flipping and rotating the photos to create more examples did not help: the markings that identify a variety should not be distorted.',
      ],
      stat: { value: '330', label: 'photos, each reduced to 40 × 40 pixels' },
      hood: 'Photos at 360 × 270 px. Splits: 80/20 for transfer learning, 60/40 for metric learning.',
    },
    {
      title: 'Method 1: borrow a trained eye',
      body: 'Networks that have already learned to see from a very large collection of everyday photos are reused as they are. Only a small final part is trained to tell the three varieties apart.',
      points: [
        'The study compared three well-known networks of this kind.',
        'One scored highest during training (94%), but it was memorising the photos. The most consistent one was kept.',
      ],
      hood: 'Transfer learning: VGG19, ResNet50 and EfficientNetB0, pretrained on ImageNet, each with a small new classification head, tuned by grid search and 5-fold cross-validation. ResNet50 scored highest (94.33%) but overfitted, so EfficientNetB0 (90.56%) was kept.',
    },
    {
      title: 'Method 2: learn what “similar” means',
      body: 'The second method does not ask “which variety?” directly. It learns to place photos of the same variety close together on a map, and then names a new photo after its neighbours.',
      points: [
        'It trains on triplets: a photo, another of the same variety, and one of a different variety.',
        'A model of this kind can later learn a new variety from very few examples, which matters when photos are scarce.',
        'On the map, Joya overlaps both of the others.',
      ],
      hood: 'Metric learning with a triplet loss: each photo becomes a compact embedding, and K-NN gives a new photo the variety of its nearest neighbours. Group counts for the 100 test photos are from the paper; positions are illustrative.',
    },
    {
      title: 'The result',
      body: 'On photos that neither model had seen, Method 1 named 84% correctly and Method 2 81%. Both work, and both stumble on the same variety: Joya.',
      points: [
        'Most mistakes were Joya fruit taken for one of the others, or the others taken for Joya.',
        'An older network reached only 60% with the same recipe.',
      ],
      facts: [
        { value: '84%', label: 'Method 1: borrowed eye' },
        { value: '81%', label: 'Method 2: similarity map' },
      ],
      hood: 'Both methods use EfficientNetB0, tested on 66 photos (transfer learning) and 100 (metric learning); VGG19 reached only 60% with transfer learning. The counts shown come from the paper’s confusion matrices.',
    },
    {
      title: 'Where it leads',
      body: 'Both approaches are feasible, and both leave room to improve. The next steps are more photos and a better way to capture what makes Joya different. The goal is a camera over a conveyor belt that names each fruit as it passes.',
      points: [
        'The paper’s own reading: slight overfitting, caused by too little data.',
        'Ideas named for the next round: attention-based networks, generated images to enlarge the data set, and few-shot learning.',
      ],
      hood: 'Presented at the IEEE International Symposium on Industrial Electronics (ISIE), 2022.',
    },
  ],
  stack: ['Python', 'Keras', 'EfficientNet', 'Triplet loss', 'K-NN'],
  source: {
    label: 'Read the paper on IEEE Xplore (lead author)',
    href: 'https://doi.org/10.1109/ISIE51582.2022.9831572',
  },
  related: [
    {
      authors: 'Contreras et al. 2022',
      title: 'Comparing Convolutional Neural Networks and Deep Metric Learning Methods for Classification of Export Watermelon (Citrullus lanatus) Varieties',
      venue: 'Conference paper, IEEE ISIE 2022',
      href: 'https://doi.org/10.1109/ISIE51582.2022.9831572',
      lead: true,
    },
    {
      authors: 'Contreras et al. 2022',
      title: 'Classification of Multiple Panamanian Watermelon Varieties Using Convolutional Neural Networks with Transfer Learning',
      venue: 'Poster, LatinX in AI workshop at ICCV 2022',
      href: 'https://doi.org/10.52591/lxai202209223',
      lead: true,
    },
    {
      authors: 'Cáceres-Hernández et al. 2023',
      title: 'Recent advances in automatic feature detection and classification of fruits, with a special emphasis on watermelon: a review',
      venue: 'Neurocomputing',
      href: 'https://doi.org/10.1016/j.neucom.2023.01.005',
    },
  ],
  credit:
    'Photographs of the three varieties and of the rind patches are from Contreras et al. 2022 (© 2022 IEEE), reused by the author. The points on the map are illustrative, but how many fall in each group follows the paper’s confusion matrix. The packing and conveyor scenes are drawings.',
  stageAlt:
    'Animated diagram in seven stages: crates of watermelons with question tags; photographs of the three varieties, Anna, Joya and Quetzali, which look much alike; 330 small squares, one per photo, and one photo enlarged to show its 40 by 40 pixels; a photo passing through a large frozen network and a small trained part that names the variety; 100 points gathering into three groups, with the Joya group overlapping the other two; bars comparing the two methods for each variety, 84% and 81% overall; and watermelons passing under a camera on a conveyor belt and receiving name tags.',
};
