// Projects shown as tabs on the landing page, and the work history from the CV.
// Each project is a scroll story in /animations/<id> (see animations/README.md);
// the story's own content.ts holds its title, steps and credits.

import type { StoryId } from './profile';

export type Project = {
  id: StoryId;
  /** Short label for the tab. */
  tab: string;
  /** Key in src/scenes/index.ts. */
  scene: string;
};

export const projects: Project[] = [
  { id: 'binational-manatees', tab: 'Tracking manatees by voice', scene: 'binational' },
  { id: 'survey-nlp', tab: 'Finding patterns in what people say', scene: 'surveynlp' },
  { id: 'drone-manatees', tab: 'Detecting manatees from the air', scene: 'dronemanatees' },
  { id: 'vector-spectra', tab: 'Mosquito and tick fingerprints', scene: 'vectorspectra' },
  { id: 'watermelon-varieties', tab: 'Automating watermelon sorting', scene: 'watermelon' },
];

export type Role = {
  title: string;
  org: string;
  /** One line on what each organisation is, for clients outside Panama. */
  orgNote?: string;
  years: string;
  summary: string;
  /** Optional line above the items, e.g. who funded them. */
  itemsHead?: string;
  /** label leads; codes are the funder's grant numbers, one per line, shown small. */
  items: { label?: string; text: string; codes?: string[] }[];
};

export const experience: Role[] = [
  {
    title: 'Research Data Scientist',
    org: 'Universidad Tecnológica de Panamá and Smithsonian Tropical Research Institute',
    orgNote:
      'Panama’s national engineering university and the Smithsonian’s research centre in Panama, with INDICASAT-AIP, Panama’s public institute for scientific research and technology.',
    years: 'Jan 2021 to now',
    summary:
      'Research and development of software to organise, clean and prepare data for training and optimising machine learning models, mainly in Python, with data visualisations in HTML, CSS and JavaScript. Drafting scientific manuscripts to publish the results in indexed journals. Working mainly with researchers at UTP and STRI, and with external institutions such as INDICASAT-AIP.',
    itemsHead: 'Research projects funded by SENACYT, Panama’s National Secretariat for Science, Technology and Innovation',
    items: [
      {
        label: 'Manatee acoustic monitoring',
        text: 'Real-time acoustic monitoring of manatees in Panama’s wetlands, first as a LoRa-based system, then automated end to end.',
        codes: ['Grant FID18-076 · LoRa-based monitoring system', 'Grant FID23-106 · Automated monitoring system'],
      },
      { label: 'Watermelon classification', text: 'An image-processing system that classifies export watermelons by variety.', codes: ['Grant FID18-060'] },
      { label: 'Disease-vector identification', text: 'Mass spectrometry (MALDI-TOF) to identify mosquitoes and ticks by species.', codes: ['Grant GRID15-002'] },
    ],
  },
  {
    title: 'Data Analyst and AI Consultant',
    org: 'CID Gallup, Panama',
    orgNote: 'A polling and market research firm working across Latin America.',
    years: 'Nov 2024 to Jan 2026',
    summary:
      'Analysis of survey data in SPSS, with insights presented to clients in Power BI dashboards. Development of AI-powered tools that automate data processing and internal procedures, such as survey validation, drawing on my earlier research on Spanish-language text.',
    items: [
      {
        label: 'Open answers',
        text: 'A pipeline that proposes a codebook for each open question and tags every answer, so analysts can count themes and still read the original words.',
      },
      {
        label: 'Interview audits',
        text: 'A score that ranks completed interviews by duration, missing answers, answer variety and straightlining, so supervisors know which records to check first.',
      },
    ],
  },
];
