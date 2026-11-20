// All copy and numbers for the story. It follows the lab's public summary
// (the Instagram carousel in resources/manatees) slide by slide, with a few
// details added from the paper. Every figure is traced in brief.md.
import type { StoryContent } from '../_shared/types';
import numbers from './data/key-numbers.json';

export const content: StoryContent = {
  id: 'binational-manatees',
  title: 'Tracking endangered manatees across borders by their calls',
  meta: 'Smithsonian Tropical Research Institute and UTP, 2021 to now',
  steps: [
    {
      title: 'Who are the Greater Caribbean manatees?',
      body: 'Trichechus manatus manatus is a large aquatic mammal and an ecosystem engineer: by grazing, it shapes the vegetation and the wetlands where it feeds.',
      points: [
        'A subspecies of the American manatee, once called the Antillean manatee.',
        'It lives in brackish coasts, rivers and lagoons, among seagrass beds and mangroves.',
        'Mothers and calves recognise each other by their calls when they meet again.',
      ],
      facts: [
        { value: 'Up to 600 kg', label: 'in weight' },
        { value: '3 to 4 m', label: 'long' },
      ],
    },
    {
      title: 'Endangered, and hard to count',
      body: 'They live from southern Mexico to northern Brazil, threatened by fishing nets, wetland loss, water pollution and boat collisions. In murky wetland water they can barely be seen, let alone counted.',
      points: [
        'A further 20% decline is projected over the next two generations.',
        'Populations are small and isolated, and many have barely been studied.',
        'So the team listened instead of watching, with underwater microphones.',
      ],
      stat: { value: '< 2,500', label: 'mature individuals estimated in the wild. IUCN Red List: Endangered.' },
      hood: 'IUCN status for T. m. manatus: fewer than 2,500 mature individuals, projected 20% decline over two generations (Guzman et al. 2025, §1). Range, size and threats: the lab’s public summary.',
    },
    {
      title: 'An acoustic fingerprint',
      body: 'Each manatee communicates with its own intonation. A spectrogram turns a call into a picture: one animal’s calls vary, but they share features that set it apart from the others.',
      points: [
        'On average, a manatee calls about once or twice every five minutes.',
        'Calls differ in pitch, range and shape. The study used two clear types: squeaks (flat) and hi-squeaks (hill-shaped).',
        'An individual’s calls can stay recognisable for years.',
      ],
      hood: 'Spectrograms (short-time Fourier transform): time on x, frequency on y, energy as brightness. Calls differ in frequency, bandwidth and contour. Each column: two calls from one manatee, two known individuals and two identified in Panama.',
    },
    {
      title: 'From calls to individuals',
      body: 'The software compares thousands of calls and groups the ones that sound alike. Each group is taken to be one manatee, found without being told who is who, or how many there are.',
      points: [
        'Tested first on 23 captured manatees recorded in a floating cage, it estimated 24.',
        'Groups were merged, checked by hand and filtered; any doubtful group was discarded.',
        'Groups from both countries were then compared to find the same caller twice.',
      ],
      hood: 'Each call is described with scattering wavelet features, projected into a low-dimensional space with PaCMAP and grouped by density-based clustering (HDBSCAN), so the number of individuals is not set in advance. Near-duplicate clusters are merged and reviewed by hand, then matched across the two countries. The method comes from Merchan et al. 2024, where it was validated on 23 captive manatees: 24 clusters, 83.75% of calls correctly assigned.',
    },
    {
      title: 'How we did it, step by step',
      body: 'A manatee calls. Hydrophones record. The audio is cleaned and screened, a neural network confirms each call, and the algorithm assigns it to an individual.',
      points: [
        'Up to 15 hydrophones record 2 minutes every 8 to 10 minutes: Panama since 2015, Costa Rica since 2020.',
        'Played back to back, the recordings would last more than seven years.',
      ],
      stat: { value: '1,931,079', label: 'audio files analysed: more than 64,000 hours of recording' },
      facts: [{ value: '83.75%', label: 'of calls assigned to the right manatee, in tests with known animals' }],
      hood: 'The recordings are filtered and denoised, an autocorrelation detector (ACF-RMS) flags candidate calls, and a convolutional network (MobileNet, fine-tuned by transfer learning) confirms which ones are manatees. The 30,928 confirmed calls go on to clustering.',
    },
    {
      title: 'What we discovered',
      body: 'From their calls, the study identified 61 manatees in Panama and 49 in Costa Rica. Nine were heard in both, revealing a connection between the two countries. Most stayed in one region for long periods.',
      points: [
        'The first acoustic evidence that manatees connect Panama and Costa Rica.',
        'All nine left Panama through the Changuinola river; most entered Costa Rica at Barra del Colorado.',
      ],
      stat: { value: '9', label: 'individuals made cross-border movements' },
      facts: [
        { value: '1,059 days', label: 'average stay in Panama' },
        { value: '292 days', label: 'average stay in Costa Rica' },
        { value: '340 days', label: 'on average between detections in the two countries' },
      ],
      factsLayout: 'list',
      hood: 'Individuals are presumed, since identity is inferred from calls alone. The nine crossers count in both country totals, and the longest stays were 3,026 days in Panama and 1,160 in Costa Rica.',
    },
    {
      title: 'When do they travel?',
      body: 'Crossings coincided with wetter, warmer spells: periods with crossings had more rain and warmer air than periods without. Seasonal floods may open routes to wetlands and feeding areas.',
      points: [
        'Remote-sensing climate data for 2020 to 2024, compared between periods with and without crossings.',
        'Both countries are highly vulnerable to climate change: warmer temperatures, shifting rain, extreme weather.',
      ],
      facts: [
        { value: '12.3 mm', label: 'of rain at the origin during crossings, against 8.3 mm' },
        { value: '+0.97 °C', label: 'air temperature anomaly, against +0.80 °C' },
      ],
      factsLayout: 'list',
      hood: 'Satellite climate data, compared in 15-day periods, show more rain and warmer air during crossings (p < 0.0001) and a slightly lower sea level, while sea-surface temperature showed no link. This is an association, not a proven cause.',
    },
    {
      title: 'Key proposal: a binational corridor',
      body: 'The movement data show that manatees do not recognise borders. The study proposes that conservation should not either: one protected corridor along the Caribbean coast of both countries.',
      points: [
        '220 km of coast in Costa Rica and 764 km in Panama, linking existing protected areas.',
        'It keeps feeding and breeding wetlands connected for animals that move between them.',
        'Connected populations keep their genetic diversity, which shields small groups from inbreeding.',
      ],
      stat: { value: '984 km', label: 'proposed binational corridor' },
      facts: [
        { value: '18', label: 'protected areas' },
        { value: '4', label: 'Ramsar wetlands' },
        { value: '57+', label: 'rivers' },
      ],
      hood: 'The corridor spans coastal marine and wetland ecosystems out to the 20 m isobath, crossed by 57 rivers, and joins 18 protected areas and four Ramsar sites. Next come satellite telemetry and acoustic capture–recapture, to estimate population size.',
    },
    {
      title: 'Why it matters',
      body: 'This is the first acoustic evidence that manatees connect Panama and Costa Rica. It gives both countries a shared reason, and shared data, to protect them together.',
      points: [
        'Listening works where watching fails: day and night, in murky water, without catching or disturbing an animal.',
        'The same recordings will be used to estimate how many manatees live in the area, a figure that doesn’t exist yet.',
        'The method can follow other animals that are heard more easily than they’re seen.',
      ],
    },
  ],
  stack: ['Python', 'TensorFlow', 'MobileNet', 'Scattering wavelets (Kymatio)', 'PaCMAP', 'HDBSCAN'],
  source: {
    label: 'Read the paper in Frontiers in Marine Science',
    href: 'https://doi.org/10.3389/fmars.2025.1661294',
  },
  related: [
    {
      authors: 'Guzman, Estévez, Contreras et al. 2025',
      title: 'Year-round residency and movement behavior of Greater Caribbean manatees (Trichechus manatus manatus) in Panama and Costa Rica',
      venue: 'Frontiers in Marine Science',
      href: 'https://doi.org/10.3389/fmars.2025.1661294',
    },
    {
      authors: 'Contreras et al. 2023',
      title: 'Construction of a data integration platform for the passive monitoring of the Antillean manatee in Panama',
      venue: 'IEEE LATINCOM',
      href: 'https://doi.org/10.1109/LATINCOM59467.2023.10361860',
      lead: true,
    },
    {
      authors: 'Merchan, Contreras et al. 2024',
      title: 'Unsupervised identification of Greater Caribbean manatees using scattering wavelet transform and hierarchical density clustering from underwater bioacoustics recordings',
      venue: 'Frontiers in Marine Science',
      href: 'https://doi.org/10.3389/fmars.2024.1416247',
    },
    {
      authors: 'Merchan, Contreras et al. 2025',
      title: 'Demographic identification of Greater Caribbean manatees via acoustic feature learning',
      venue: 'Frontiers in Artificial Intelligence',
      href: 'https://doi.org/10.3389/frai.2025.1660388',
    },
  ],
  credit:
    'Maps from Natural Earth; the species range is simplified. Hydrophone positions and spectrograms are adapted from Guzman et al. 2025 (CC BY 4.0), with the spectrograms recoloured. The dots for calls and individuals, and the voice prints in the last step, are illustrative.',
  stageAlt:
    'Animated diagram in nine stages: a manatee and calf with their size and weight; a map of the species’ range from Mexico to Brazil with its main threats; spectrograms of two calls from each of four manatees; the calls of many manatees sorted into groups, one per animal; the five-step method with its key numbers; a map of Costa Rica and Panama with 49 and 61 identified manatees and nine tracks across the border; the weather conditions during crossings; the proposed 984 km protected corridor; and the mother and calf back in the wetland, where the water turns murky and hides them while hydrophones in Costa Rica and Panama record the same voice.',
};

/** Headline numbers. Not shown at present: the strip under the stage was removed. */
export const keyNumbers = numbers.nodes;
