import type { SceneContext } from '../../src/scenes/types';

type Timeline = ReturnType<SceneContext['gsap']['timeline']>;

export type StoryApi = {
  /** The sticky stage element. */
  stage: HTMLElement;
  /** Query inside the stage. */
  $: <T extends Element = SVGElement>(selector: string) => T[];
  /**
   * Timeline position for a step. Step k owns the time span [k-1, k]:
   * `at(3)` is where step 3 begins, `at(3, 0.5)` is halfway through it.
   */
  at: (step: number, fraction?: number) => number;
  /** True when the reader asked for reduced motion. */
  reduced: boolean;
};

export type StoryBuild = (tl: Timeline, api: StoryApi) => void;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Turns a section made with ScrollStory.astro into a scroll-driven story.
 *
 * `build` fills ONE timeline in which each text step owns one unit of time.
 * As a step scrolls past the anchor line its unit plays, forwards or
 * backwards, so the stage always matches the text beside it.
 *
 * - Elements inside the stage with `data-from="k"` get the class `is-on`
 *   once step k has mostly played (useful for HTML legends and counters).
 * - Reduced motion: nothing tweens; the stage jumps to the end state of the
 *   active step.
 * - `?step=k` in the URL scrolls to step k on load (used for screenshots).
 */
export function createStory(ctx: SceneContext, build: StoryBuild): () => void {
  const { stage, section, gsap, ScrollTrigger } = ctx;
  const steps = Array.from(section.querySelectorAll<HTMLElement>('[data-step-item]'));
  const n = steps.length;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gated = Array.from(stage.querySelectorAll<HTMLElement>('[data-from]'));
  const debugStep = Number(new URLSearchParams(location.search).get('step')) || 0;

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.4 } });
  build(tl, {
    stage,
    $: (selector) => Array.from(stage.querySelectorAll(selector)) as never,
    at: (step, fraction = 0) => step - 1 + fraction,
    reduced,
  });
  tl.set({}, {}, n); // make the timeline exactly n units long

  // The element that sticks is the stage itself (desktop) or its column
  // (phone layout); `body` is the non-sticky box both columns start in.
  const body = steps[0].parentElement!.parentElement!;
  const sticky = getComputedStyle(stage).position === 'sticky' ? stage : stage.parentElement!;

  section.classList.add('is-live');
  let active = -1;
  let reached = -1;

  const apply = () => {
    // The anchor line is a fraction of the viewport height, set in CSS so it
    // can differ between the desktop and phone layouts.
    const frac = parseFloat(getComputedStyle(section).getPropertyValue('--story-anchor')) || 0.6;
    const anchor = window.innerHeight * frac;
    // Step 1 must not start until the stage has reached its sticky position,
    // otherwise its change plays while the stage is still scrolling into view.
    // `lead` is how far past the anchor step 1 already is at that moment.
    const pinTop = parseFloat(getComputedStyle(sticky).top) || 0;
    const first = steps[0].getBoundingClientRect();
    // (A third of a screen early is fine: most of the stage is in view by then.)
    const early = window.innerHeight * 0.35;
    const lead = Math.max(0, anchor - (first.top - (body.getBoundingClientRect().top - pinTop) + early));
    let t = 0;
    let done = 0;
    steps.forEach((step, i) => {
      const r = i ? step.getBoundingClientRect() : first;
      const skip = i ? 0 : Math.min(lead, r.height * 0.8);
      const p = clamp01((anchor - r.top - skip) / (r.height - skip));
      t += p;
      if (p >= 0.55) done++;
    });
    const idx = Math.max(0, Math.min(n - 1, Math.ceil(t - 1e-6) - 1));
    if (reduced) {
      done = t > 0 ? idx + 1 : 0;
      tl.time(done);
    } else if (debugStep) {
      tl.time(t);
    } else {
      gsap.to(tl, { time: t, duration: 0.45, ease: 'power2.out', overwrite: true });
    }
    if (idx !== active) {
      active = idx;
      steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      stage.dataset.step = String(idx + 1);
    }
    if (done !== reached) {
      reached = done;
      gated.forEach((el) => el.classList.toggle('is-on', done >= Number(el.dataset.from)));
    }
  };

  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: apply,
    onRefresh: apply,
  });
  apply();

  if (debugStep >= 1 && debugStep <= n) {
    const jump = () => {
      const el = steps[debugStep - 1];
      const frac = parseFloat(getComputedStyle(section).getPropertyValue('--story-anchor')) || 0.6;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + el.offsetHeight * 0.97 - window.innerHeight * frac);
      apply();
    };
    requestAnimationFrame(() => requestAnimationFrame(jump));
  }

  return () => {
    st.kill();
    tl.kill();
    section.classList.remove('is-live');
  };
}
