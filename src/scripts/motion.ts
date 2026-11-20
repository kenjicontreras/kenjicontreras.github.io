import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './scroll';
import { scenes } from '../scenes';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header gets a rule once the page scrolls.
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  ScrollTrigger.create({
    start: 24,
    end: 'max',
    onToggle: (self) => header.classList.toggle('is-scrolled', self.isActive),
  });
}

// Case study scenes: lazy-load when the reader gets close. Skipped entirely
// for reduced motion, where the static stage stays as is.
if (!reduced) {
  document.querySelectorAll<HTMLElement>('[data-scene]').forEach((stage) => {
    // Stories inside the project tabs are mounted by the tab controller.
    if (stage.closest('[data-tabs]')) return;
    const load = scenes[stage.dataset.scene || ''];
    const section = stage.closest<HTMLElement>('[data-case]');
    if (!load || !section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom+=50%',
      once: true,
      onEnter: async () => {
        const scene = await load();
        scene({ stage, section, gsap, ScrollTrigger });
        ScrollTrigger.refresh();
      },
    });
  });
}

document.fonts?.ready.then(() => ScrollTrigger.refresh());
