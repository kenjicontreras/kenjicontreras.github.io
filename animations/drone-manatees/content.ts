// All copy and numbers for the story. Every figure is traced in brief.md.
import type { StoryContent } from '../_shared/types';

export const content: StoryContent = {
  id: 'drone-manatees',
  title: 'Finding manatees in drone photos of the Panama Canal',
  meta: 'Smithsonian Tropical Research Institute and UTP, 2023 to 2025',
  steps: [
    {
      title: 'Manatees in the Panama Canal',
      body: 'In 1964, nine Caribbean manatees and one Amazonian manatee were released in Gatún Lake to eat water weeds. The experiment was abandoned. The animals escaped their enclosure and stayed.',
      points: [
        'The lake was created in 1913 as the Canal’s water reservoir, and floating plants soon spread across it.',
        'The hope was that grazing manatees would clear the plants and help against malaria mosquitoes.',
        'They are Greater Caribbean manatees, an endangered subspecies protected in Panama since 1967.',
      ],
      stat: { value: '20 to 25', label: 'manatees are thought to live in the Canal basin today' },
    },
    {
      title: 'A lake too big to watch',
      body: 'Gatún Lake covers about 436 km², with a shipping channel through the middle. Surveys from crewed planes are costly and hard to run over murky water and dense floating plants.',
      points: [
        'The team divided the whole lake into 44 survey areas of 48 to 856 hectares.',
        'The areas keep clear of the main shipping channel, where the Canal Authority restricts flights.',
        'Small drones are an affordable, non-invasive alternative.',
      ],
      stat: { value: '436 km²', label: 'of lake, divided into 44 survey areas' },
    },
    {
      title: 'So we flew',
      body: 'Two drones flew pre-programmed lines over each area at 60 to 100 m, taking a photo every 3 to 5 seconds. Flights ran in the morning, about every 15 days, from February 2023 to April 2024.',
      points: [
        'Photos overlap, so an animal at the surface usually appears in several frames in a row.',
        'After the first rounds, effort went to the areas the manatees used most.',
      ],
      facts: [
        { value: '65', label: 'flights' },
        { value: '221 h', label: 'in the air' },
        { value: '26,678 ha', label: 'covered' },
      ],
      hood: 'Two DJI drones flew pre-programmed morning transects, each with a licensed pilot. Consecutive frames overlap, so the same animal can be followed across a sequence of photos.',
    },
    {
      title: 'A few pixels in thousands of photos',
      body: 'We first looked through 57,332 photos and found 76 manatees. From the air a manatee is a pale speck in a wide frame of water, and a floating log can look much the same.',
      points: [
        'Sixteen mother and calf pairs were seen, on nine survey days.',
        'Droughts lower the lake and expose many logs, some with the outline of a manatee.',
        'Reflections on the water and patterns on the lake bed fool the eye, and a model, too.',
      ],
      stat: { value: '57,332', label: 'photos reviewed by eye; 76 manatees seen' },
      hood: 'Frames up to 9,504 × 6,336 px, split by sequence so near-duplicate frames never cross the train/test split.',
    },
    {
      title: 'Cut each photo into tiles',
      body: 'In a whole photo the animal is too small for a detector to see. So each photo is cut into overlapping tiles, the model looks at every tile, and its finds are put back on the full frame.',
      points: [
        'The model learned two things to find: manatees, and the logs it must not mistake for them.',
        'Tiles overlap so that an animal on the edge of a tile is not cut in two.',
        'It learned from one pilot’s photos and was tested on the other’s, which were harder: fainter animals in worse light.',
      ],
      stat: { value: '640 px', label: 'tiles, read one by one' },
      hood: 'A YOLOv8 object detector, fine-tuned with sliced inference (SAHI): each photo is cut into overlapping tiles, and the detections are merged back onto the full frame. In ten-fold cross-validation the best fold reached 93% precision and 92% mAP50.',
    },
    {
      title: 'One, a pair, or a group?',
      body: 'A count needs more than “manatee here”. Is it one animal, a mother with her calf, or a group? A second model compares each find with five written descriptions and picks the closest.',
      points: [
        'It needs no training photos: the classes are described in words. Seen from above, a manatee is “the shape of a fish”.',
        'Colour is removed first, so the tint of the water and the light matter less.',
        'In this example, a mother and calf with a third manatee, the top two answers are nearly tied, and both are reasonable.',
      ],
      hood: 'Zero-shot classification with AltCLIP, a vision–language model: each greyscale crop is scored against the five text prompts, with no training images. Shown: an example from the paper with its published scores.',
    },
    {
      title: 'How well it works',
      body: 'Following each animal through its sequence of photos, the system found the manatees in 27 of 30 sequences from the flights it learned from, and in 11 of 15 from flights it had never seen.',
      points: [
        'Photo by photo on the unseen flights it is cautious: 86% of what it flags really is a manatee, but it catches only 44 of every 100.',
        'Misses came mostly where an animal shows in only one or two photos, or in glare and cluttered water.',
        'Grouping: the right answer is among its top two 89% of the time. Single animals are easy, pairs and groups are hard.',
      ],
      facts: [
        { value: '27 of 30', label: 'sequences found, flights it learned from' },
        { value: '11 of 15', label: 'sequences found, unseen flights' },
      ],
      factsLayout: 'list',
      hood: 'On the unseen pilot’s photos, precision was 86.2% and recall 43.8%. Zero-shot grouping, tested on 316 crops, was right first time in 70.6% of cases and within the top two in 88.9%; single manatees were easy, mother and calf pairs hard.',
    },
    {
      title: 'What it is for',
      body: 'This is the first detailed look at the manatees of the Canal basin, and a survey that can be repeated without capturing or disturbing an animal: fly the lake and let software screen the photos.',
      points: [
        'Next: better detection of mother and calf pairs, which show whether the population is breeding.',
        'Recognising the same animal across photos, so that none is counted twice.',
        'The model is small on purpose: the aim is a system that runs on the drone in real time.',
      ],
      hood: 'Published open access in Drones (MDPI), 2025.',
    },
  ],
  stack: ['Python', 'YOLOv8', 'SAHI', 'AltCLIP', 'OpenCV', 'PyTorch'],
  source: {
    label: 'Read the paper in Drones',
    href: 'https://doi.org/10.3390/drones9040230',
  },
  related: [
    {
      authors: 'Sanchez-Galan, Contreras et al. 2025',
      title: 'Drone-Based Detection and Classification of Greater Caribbean Manatees in the Panama Canal Basin',
      venue: 'Drones',
      href: 'https://doi.org/10.3390/drones9040230',
    },
  ],
  credit:
    'Lake outline, survey areas, sequence positions and drone photographs after Sanchez-Galan et al. 2025, Drones 9:230, CC BY 4.0 (photographs cropped; positions approximate; sequences recorded at the same spot are drawn as one dot). The drawn scenes, and the specks, tiles and boxes on the drawn photo, are illustrative.',
  stageAlt:
    'Animated diagram in eight stages, all seen from above: a mother manatee and calf in Gatún Lake beside a fisherman’s canoe and floating plants; a map of the lake divided into 44 survey areas; a drone flying survey lines over one area and taking photos; a wall of thousands of photos, then one photo in which a manatee and several logs are small specks; the photo cut into overlapping tiles that are read one by one, with boxes marking a manatee and logs; a real drone photo of three manatees scored against five written descriptions, with two answers nearly tied; the map again with the sequences the system found and missed; and a drone passing over the mother and calf.',
};
