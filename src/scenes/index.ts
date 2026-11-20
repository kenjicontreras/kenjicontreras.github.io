import type { Scene } from './types';

/**
 * Scene registry: story `scene` id -> lazy loader. Each scene (and any data it
 * needs) downloads only when the reader approaches that story.
 */
export const scenes: Record<string, () => Promise<Scene>> = {
  // Full scroll stories; each lives with its assets in /animations (see animations/README.md).
  binational: () => import('../../animations/binational-manatees/scene').then((m) => m.default),
  dronemanatees: () => import('../../animations/drone-manatees/scene').then((m) => m.default),
  vectorspectra: () => import('../../animations/vector-spectra/scene').then((m) => m.default),
  surveynlp: () => import('../../animations/survey-nlp/scene').then((m) => m.default),
  watermelon: () => import('../../animations/watermelon-varieties/scene').then((m) => m.default),
};
