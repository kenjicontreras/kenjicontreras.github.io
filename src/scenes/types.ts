import type { gsap as GSAP } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';

/** `stage` is the sticky visual; `section` is the case study that drives it. */
export type SceneContext = {
  stage: HTMLElement;
  section: HTMLElement;
  gsap: typeof GSAP;
  ScrollTrigger: typeof ST;
};

/** A scene sets itself up and returns a cleanup function. */
export type Scene = (ctx: SceneContext) => () => void;
