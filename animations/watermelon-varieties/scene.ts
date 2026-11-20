import type { Scene } from '../../src/scenes/types';
import { createStory } from '../_shared/story';

/**
 * Timeline for the watermelon-varieties story. Step k of the text owns the
 * time span [k-1, k]; `at(k, f)` is the position a fraction f into step k.
 * Each step changes the stage in its first ~60 to 85 % and then holds.
 * Layers come from Stage.astro and are addressed by data-l="name".
 * This story has no WebGL layer.
 */
const scene: Scene = (ctx) =>
  createStory(ctx, (tl, { $, at, stage }) => {
    const { gsap } = ctx;
    const all = (name: string) => $<SVGGraphicsElement>(`[data-l="${name}"]`);
    const one = (name: string) => all(name)[0];
    const token = (name: string) => getComputedStyle(stage.querySelector('.wv')!).getPropertyValue(name).trim();
    const xy = (el: Element, key: string) => (el as SVGElement).dataset[key]!.split(',').map(Number);

    // ── 1 · the shed: which variety is in each crate?
    tl.fromTo(all('s1-item'), { scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.16, stagger: 0.16 }, at(1, 0.14));

    // ── 2 · the three varieties, photographed
    tl.to(one('varieties'), { autoAlpha: 1, duration: 0.16 }, at(2, 0))
      .fromTo(all('variety'), { y: 16 }, { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.16 }, at(2, 0.12))
      .to(one('variety-note'), { autoAlpha: 1, duration: 0.12 }, at(2, 0.62));

    // ── 3 · 330 photos, one square each; then one of them at 40 × 40 pixels
    const squares = all('sq');
    const count = { photos: 0 };
    const paint = () => (one('n-photos').textContent = String(Math.round(count.photos)));
    tl.to(one('count'), { autoAlpha: 1, duration: 0.14 }, at(3, 0))
      .to(squares, { autoAlpha: 1, duration: 0.02, ease: 'none', stagger: { amount: 0.34 } }, at(3, 0.1))
      .to(count, { photos: 330, duration: 0.36, ease: 'none', onUpdate: paint }, at(3, 0.1))
      .fromTo(all('group-label'), { x: -8 }, { autoAlpha: 1, x: 0, duration: 0.1, stagger: 0.11 }, at(3, 0.16))
      .to(one('sq-key'), { autoAlpha: 1, duration: 0.1 }, at(3, 0.4))
      .fromTo(one('pixel'), { scale: 0.2, svgOrigin: '635 265' }, { autoAlpha: 1, scale: 1, duration: 0.2 }, at(3, 0.54));

    // ── 4 · transfer learning: a photo goes through a frozen network and a small trained part
    const parts = all('t-part');
    const outs = all('t-out');
    const chips = all('t-chip');
    const kept = stage.querySelector('[data-kept]')!;
    tl.to(one('night'), { autoAlpha: 1, duration: 0.14 }, at(4, 0))
      .to(one('transfer'), { autoAlpha: 1, duration: 0.1 }, at(4, 0.06))
      .fromTo(parts, { x: -12 }, { autoAlpha: 1, x: 0, duration: 0.12, stagger: 0.1 }, at(4, 0.08))
      .to(one('t-pulse'), { autoAlpha: 1, duration: 0.02 }, at(4, 0.44))
      .to(one('t-pulse'), { x: 490, duration: 0.18, ease: 'power1.inOut' }, at(4, 0.44))
      .to(one('t-pulse'), { autoAlpha: 0, duration: 0.02 }, at(4, 0.62))
      .fromTo(outs[0], { scale: 1 }, { scale: 1.12, transformOrigin: '0% 50%', duration: 0.06 }, at(4, 0.62))
      .to(chips, { autoAlpha: 1, duration: 0.08, stagger: 0.06 }, at(4, 0.66))
      .to(kept, { fill: token('--wv-panel-2'), stroke: token('--wv-on'), duration: 0.08 }, at(4, 0.86))
      .to(one('t-kept'), { autoAlpha: 1, duration: 0.08 }, at(4, 0.86));

    // ── 5 · metric learning: the test photos gather into three groups
    const pts = all('m-pt');
    const wrong = pts.filter((p) => p.dataset.wrong);
    gsap.set(pts, { x: (i) => xy(pts[i], 'a')[0], y: (i) => xy(pts[i], 'a')[1] });
    tl.to(one('transfer'), { autoAlpha: 0, duration: 0.12 }, at(5, 0))
      .to(one('metric'), { autoAlpha: 1, duration: 0.1 }, at(5, 0.06))
      .to(pts, { autoAlpha: 1, duration: 0.04, stagger: { amount: 0.14, from: 'random' } }, at(5, 0.1))
      .to(pts, { x: (i) => xy(pts[i], 'b')[0], y: (i) => xy(pts[i], 'b')[1], duration: 0.3, ease: 'power2.inOut' }, at(5, 0.34))
      .to(all('m-ring'), { autoAlpha: 1, duration: 0.1, stagger: 0.05 }, at(5, 0.6))
      .to(wrong, { stroke: token('--wv-on'), attr: { 'stroke-width': 3 }, duration: 0.08 }, at(5, 0.74))
      .to(one('m-legend'), { autoAlpha: 1, duration: 0.1 }, at(5, 0.74));

    // ── 6 · the result: per variety, for both methods
    const bars = all('r-bar');
    tl.to(one('metric'), { autoAlpha: 0, duration: 0.12 }, at(6, 0))
      .to(one('result'), { autoAlpha: 1, duration: 0.04 }, at(6, 0.06))
      .fromTo(all('r-panel'), { y: 10 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.22 }, at(6, 0.08))
      .to(bars.slice(0, 3), { attr: { width: (i: number) => Number(bars[i].dataset.w) }, duration: 0.2, stagger: 0.04 }, at(6, 0.14))
      .to(bars.slice(3), { attr: { width: (i: number) => Number(bars[3 + i].dataset.w) }, duration: 0.2, stagger: 0.04 }, at(6, 0.36))
      .to(one('r-note'), { autoAlpha: 1, duration: 0.12 }, at(6, 0.64));

    // ── 7 · the goal: fruit passes under the camera and gets its name
    const fruit = one('fruit');
    gsap.set(fruit, { x: -230 });
    tl.to(one('belt'), { autoAlpha: 1, duration: 0.18 }, at(7, 0))
      .to(fruit, { x: 0, duration: 0.5, ease: 'power1.inOut' }, at(7, 0.1))
      .fromTo(all('b-tag'), { y: 8 }, { autoAlpha: 1, y: 0, duration: 0.08, stagger: -0.12 }, at(7, 0.42))
      .fromTo(all('b-crate'), { y: 14 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.08 }, at(7, 0.58));
  });

export default scene;
