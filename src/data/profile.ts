// Personal details, taken from the CV of 2026-11-17
// (~/Documents/Kenji Contreras Ynao - CV_core_skills_updated.docx).
// Leave a field empty ("") to hide it.

export const profile = {
  name: 'Kenji Contreras',
  role: 'Data Scientist & Researcher',
  location: 'Panama City, Panama',
  headline: 'AI for data that’s hard to work with.',
  intro:
    'I turn messy data into clear answers and build AI tools that automate repetitive work. Over five years of work in research and business, with methods published in peer-reviewed journals.',
  availability: 'Taking projects in data science, AI tools and workflow automation. Remote, in English or Spanish.',
  email: 'kcinao@gmail.com',
  links: {
    linkedin: '', // https://www.linkedin.com/in/<handle>
    github: '', // https://github.com/<username>
    researchgate: 'https://www.researchgate.net/profile/Kenji-Contreras',
    scholar: 'https://scholar.google.com/citations?user=p3oOFIcAAAAJ&hl=en',
  },
  /** Public CV (no address, phone or references' contacts), in public/. */
  cv: 'Kenji-Contreras-CV.pdf',
};

export const partners = [
  'Smithsonian Tropical Research Institute',
  'Universidad Tecnológica de Panamá',
  'CID Gallup',
  'INDICASAT-AIP',
  'SENACYT',
];

/** Story ids, as used in animations/<id>/content.ts and the project tabs. */
export type StoryId = 'binational-manatees' | 'drone-manatees' | 'vector-spectra' | 'watermelon-varieties' | 'survey-nlp';

export type Skill = {
  name: string;
  line: string;
  /** Project tabs that show this skill. */
  seenIn?: StoryId[];
  /** Experience entry that shows it, when no story does. */
  seenAt?: { label: string; href: string };
  /** Real tool icons (files in public/icons) with their names. */
  tools?: { name: string; icon?: string }[];
};

// The core skills, in plain words.
export const skills: Skill[] = [
  {
    name: 'Machine learning',
    line: 'Implementing and optimising models for scientific, business and field data, even when it’s noisy, scarce or unlabelled.',
    seenIn: ['binational-manatees', 'drone-manatees', 'vector-spectra', 'watermelon-varieties', 'survey-nlp'],
  },
  {
    name: 'AI automation',
    line: 'Generative AI tools that read, sort and summarise text, draft reports and automate repetitive work, with people reviewing the results and data kept under your control.',
    seenIn: ['survey-nlp'],
  },
  {
    name: 'Computer vision',
    line: 'Detecting and classifying objects in photos and video, from drone wildlife surveys to fruit variety recognition.',
    seenIn: ['drone-manatees', 'watermelon-varieties'],
  },
  {
    name: 'Audio and signal processing',
    line: 'Cleaning and analysing sound and instrument data to separate meaningful signals from noise.',
    seenIn: ['binational-manatees', 'vector-spectra'],
  },
  {
    name: 'Data analysis and visualisation',
    line: 'Statistics, data pipelines and interactive dashboards, in Power BI or as custom web tools.',
    seenIn: ['survey-nlp', 'binational-manatees'],
  },
  {
    name: 'Applied research',
    line: 'Peer-reviewed research with field specialists in bioacoustics, entomology, agriculture and Spanish-language text, published in journals and presented at engineering conferences.',
    seenIn: ['binational-manatees', 'vector-spectra', 'watermelon-varieties', 'survey-nlp'],
  },
  {
    name: 'Programming and tools',
    line: 'Python (TensorFlow, PyTorch, OpenCV) for models; JavaScript, HTML and CSS for web tools; Power BI and SPSS for analytics.',
    tools: [
      { name: 'Python', icon: '/icons/python.svg' },
      { name: 'JavaScript', icon: '/icons/javascript.svg' },
      { name: 'HTML and CSS', icon: '/icons/html-5.svg' },
      { name: 'Power BI', icon: '/icons/power-bi.svg' },
      { name: 'SPSS', icon: '/icons/spss.png' },
    ],
  },
];

export const venues = [
  'Scientific Reports',
  'Neurocomputing',
  'Frontiers in Marine Science',
  'Frontiers in Artificial Intelligence',
  'Drones',
  'Artificial Intelligence in the Life Sciences',
];

export const about = {
  paragraphs: [
    'I trained as a telecommunications engineer, but nature has always pulled me in. I found it fascinating how numbers and statistics could make sense of something as complex as animal sounds or the lives of insects. Most of the data I’ve worked with since has been noisy, scarce or recorded in the field, so I learned to build AI that works in exactly those conditions.',
    'Outside work, I’ve practised martial arts for ten years and now teach classes to people of all ages. The training and its philosophy give me balance that complements the way I work. Additionally, I love learning languages: besides Spanish and English, I’ve picked up a few others along the way to broaden my cultural background and communication skills.',
  ],
  education: [
    { title: 'Bachelor’s degree in Telecommunications Engineering', place: 'Universidad Tecnológica de Panamá', years: '2016 to 2022' },
    { title: 'Goethe-Zertifikat A1 (German)', place: 'Instituto Cultural Alemán', years: '2013' },
  ],
  teaching: {
    title: 'Martial arts instructor, black belt in Taekwondo and Haidong Gumdo (Korean sword)',
    place: 'Academia de Artes Marciales León',
    years: '2023 to now',
  },
  languages: ['Spanish, native', 'English, advanced', 'German, basic', 'Japanese, basic'],
};

