import type { StoryContent } from '../_shared/types';

export const content: StoryContent = {
  id: 'story-id',
  title: 'What was done, in plain words',
  meta: 'Client or partners, years',
  intro: 'Two sentences: the question and why the answer mattered.',
  role: 'My part: …',
  steps: [
    {
      title: 'The problem',
      body: '35 words or fewer.',
      stat: { value: '0', label: 'what the number counts' },
      points: ['Optional: two or three short supporting points from the paper.'],
      hood: 'One line for technical readers.',
    },
  ],
  stack: ['Python'],
  source: { label: 'Read the paper', href: 'https://doi.org/…' },
  credit: 'Sources of third-party material, and what is illustrative.',
  stageAlt: 'One sentence per step describing what the animation shows.',
};
