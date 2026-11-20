// All copy and numbers for the story. Every figure is traced in brief.md.
import type { StoryContent } from '../_shared/types';

export const content: StoryContent = {
  id: 'vector-spectra',
  title: 'Identifying disease-carrying mosquitoes and ticks by their protein fingerprint',
  meta: 'UTP, INDICASAT-AIP and Smithsonian Tropical Research Institute, 2022 to 2023',
  steps: [
    {
      title: 'Small animals, serious diseases',
      body: 'Some mosquitoes transmit malaria, and some ticks transmit spotted fever. Such diseases are held back mainly by monitoring and controlling the animals that carry them, and that starts with knowing which species is there.',
      points: [
        'Panama has more described species of mosquitoes and hard ticks than any other country in Central America.',
        'Most studies have looked at a few of them. The great majority remain unstudied.',
      ],
      stat: { value: '265', label: 'mosquito species have been recorded in Panama' },
    },
    {
      title: 'Look-alikes',
      body: 'Species are told apart by a specialist with a microscope and an identification key. It is slow work, and some species look so alike that they are easily confused with one another.',
      points: [
        'These are called cryptic species: nearly the same body, different evolutionary lines.',
        'Accurate, reliable and affordable alternatives to identification by eye have been missing.',
      ],
    },
    {
      title: 'A protein fingerprint',
      body: 'A mass spectrometer offers another way. A laser frees proteins from a sample of the animal’s legs and sends them down a tube, where lighter molecules arrive first. The arrival times form a spectrum: a fingerprint of the species.',
      points: [
        'The same technique is already used to identify bacteria and other microorganisms by their proteins.',
        'Each specimen was measured three times.',
        'A spectrum here is a curve of about 52,000 values.',
      ],
      hood: 'MALDI-TOF: matrix-assisted laser desorption/ionisation, time of flight. Field-collected specimens: mosquitoes dry-frozen, ticks stored for years in 70% ethanol.',
    },
    {
      title: 'The data: 1,136 spectra, 30 species',
      body: 'Two collections from earlier studies in Panama, each specimen first identified by a specialist. Some species are well represented. Others have only six spectra.',
      points: [
        'They cover about 70% of the malaria-mosquito group and 50% of the hard ticks reported for Panama.',
        'Earlier work cleaned every spectrum in several tuned steps before classifying it. Here the spectra go in raw.',
      ],
      facts: [
        { value: '826', label: 'spectra from 12 mosquito species' },
        { value: '310', label: 'spectra from 18 hard tick species' },
      ],
      factsLayout: 'list',
      hood: 'About 70% of anopheline and 50% of hard-tick taxa reported for Panama. 24 to 192 spectra per mosquito species, 6 to 60 per tick species; class weights for the imbalance.',
    },
    {
      title: 'Learn to compare, not to memorise',
      body: 'With so few examples of some species, memorising each one is fragile. The network learns a single skill instead: put spectra of the same species close together, and spectra of different species far apart.',
      points: [
        'One version sees two spectra at a time and judges “same” or “different”.',
        'Another sees three: a reference, one of the same species and one of another. It trains on the hardest cases, the look-alikes.',
        'One small network reads every spectrum, with no cleaning step.',
      ],
      hood: 'Metric learning with a Siamese network (contrastive loss) and a triplet network (triplet loss with hard-negative mining). Both share a compact 1D convolutional encoder that maps each spectrum to a normalised embedding.',
    },
    {
      title: 'A map where species form islands',
      body: 'The network turns each spectrum into a point. Before training, the spectra of one species lie anywhere on the map. After training they sit together, and species with similar spectra become neighbours.',
      points: [
        'Every point is one spectrum. The map is flattened to two dimensions for the eye.',
        'Mosquitoes and ticks were trained separately, so there are two maps.',
      ],
      hood: 'Embeddings projected with PaCMAP. Points per island are real counts; positions are illustrative.',
    },
    {
      title: 'How well it works',
      body: 'A new spectrum is named after its nearest neighbours on the map. With the three-at-a-time version, 99% of the mosquito spectra and 93% of the tick spectra held back for testing received the right species.',
      points: [
        'Among the mosquitoes, every test spectrum but one was named correctly.',
        'Ticks are harder: fewer spectra per species, and years in ethanol degrade the proteins.',
        'For ticks the earlier, hand-tuned method was about as accurate (94%). The gain is that nothing has to be prepared by hand.',
      ],
      facts: [
        { value: '99%', label: 'mosquitoes' },
        { value: '93%', label: 'ticks' },
      ],
      hood: 'K-NN on the triplet embeddings, Monte Carlo cross-validation: accuracy 99.8% for mosquitoes and 93.2% for ticks. Siamese networks: 91.9% and 91.5%.',
    },
    {
      title: 'Why it matters',
      body: 'A measurement and a trained model can name a specimen quickly and consistently. That makes it practical to keep watch on the species that carry disease, including rare ones.',
      points: [
        'The same approach worked for two very different groups of animals.',
        'It learns similarity rather than a fixed list, so it can grow as spectra of more species are added.',
        'Limits: the specimens came from the field, and the cause of the few errors is still to be studied.',
      ],
      hood: 'Published open access in Artificial Intelligence in the Life Sciences (Elsevier), 2023.',
    },
  ],
  stack: ['Python', 'TensorFlow', 'scikit-learn', 'Siamese networks', 'Triplet loss', 'K-NN', 'PaCMAP'],
  source: {
    label: 'Read the paper in Artificial Intelligence in the Life Sciences',
    href: 'https://doi.org/10.1016/j.ailsci.2023.100071',
  },
  related: [
    {
      authors: 'Merchan, Contreras et al. 2023',
      title: 'Deep metric learning for the classification of MALDI-TOF spectral signatures from multiple species of neotropical disease vectors',
      venue: 'Artificial Intelligence in the Life Sciences',
      href: 'https://doi.org/10.1016/j.ailsci.2023.100071',
    },
  ],
  credit:
    'Species and spectrum counts from Merchan et al. 2023 (Tables 1 and 2). The drawings, the spectrum curves and the positions of the points on the maps are illustrative; they are not the paper’s figures or measured data.',
  stageAlt:
    'Animated diagram in eight stages: a mosquito and a tick with the diseases they carry; two near-identical mosquitoes under a lens; a laser hitting a sample, molecules flying down a tube at different speeds, and a spectrum being drawn; bars showing how many spectra each of 12 mosquito and 18 tick species has; three spectra passing through one network, which pulls two of the same species together and pushes the third away; two maps of points gathering into one island per species; a new point named after its nearest neighbours, with 99% and 93% accuracy; and the mosquito and tick again, each identified.',
};
