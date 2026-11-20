import type { Scene } from '../../src/scenes/types';
import { createStory } from '../_shared/story';

// Step k owns the time span [k-1, k]. Keep each step's change in its first ~60 %.
const scene: Scene = (ctx) =>
  createStory(ctx, (tl, { $, at }) => {
    const one = (name: string) => $(`[data-l="${name}"]`)[0];

    // 1 · …
    tl.to(one('hello'), { autoAlpha: 1, duration: 0.3 }, at(1, 0.1));

    // 2 · …
  });

export default scene;
