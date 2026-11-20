// Picks the page data for a language: the English files, or their Spanish text.
import { profile, skills, about, partners, venues } from '../data/profile';
import { profileEs, skillsEs, aboutEs } from '../data/profile.es';
import { projects, experience } from '../data/work';
import { projectsEs, experienceEs } from '../data/work.es';
import type { Lang } from './ui';

export const dataFor = (lang: Lang) =>
  lang === 'es'
    ? { profile: profileEs, skills: skillsEs, about: aboutEs, projects: projectsEs, experience: experienceEs, partners, venues }
    : { profile, skills, about, projects, experience, partners, venues };
