import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
// Null under reduced motion, where the browser scrolls natively.
export const lenis: Lenis | null = reduced ? null : new Lenis({ autoRaf: false, anchors: { offset: -80 } });

if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/** Scroll so `el`'s top sits `offset` px below the top of the viewport. */
export function scrollToEl(el: HTMLElement, offset = 0, immediate = false) {
  // A number, not the element: given an element, Lenis also subtracts the
  // page's scroll-padding-top.
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
  if (lenis) lenis.scrollTo(top, { duration: 0.9, immediate, force: true });
  else window.scrollTo({ top });
}
