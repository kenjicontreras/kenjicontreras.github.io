import type { Scene } from '../../src/scenes/types';
import { createStory } from '../_shared/story';
import { glAllowed } from '../_shared/gl-layer';
import type { GlInput, GlState } from './gl';

/**
 * Timeline for the vector-spectra story. Step k of the text owns the time
 * span [k-1, k]; `at(k, f)` is the position a fraction f into step k.
 * Each step changes the stage in its first ~60 to 85 % and then holds.
 * Layers come from Stage.astro and are addressed by data-l="name".
 *
 * `glow` is the state of the optional WebGL light layer (gl.ts). It is tweened
 * on the same timeline whether or not the layer exists, so the layer can join
 * at any moment and the SVG stage is a complete fallback without it.
 */
const scene: Scene = (ctx) => {
  const glow: GlState = { flash: 0, show: 0, mix: 0, points: 0 };
  let glInput: GlInput | undefined;
  let stopGl: (() => void) | null = null;
  let stopped = false;

  const stopStory = createStory(ctx, (tl, { $, at, stage }) => {
    const { gsap } = ctx;
    const all = (name: string) => $<SVGGraphicsElement>(`[data-l="${name}"]`);
    const one = (name: string) => all(name)[0];
    const token = (name: string) => getComputedStyle(stage.querySelector('.vs')!).getPropertyValue(name).trim();
    const xy = (el: Element, key: string) => (el as SVGElement).dataset[key]!.split(',').map(Number);

    // ── 1 · the two animals and what they carry
    tl.fromTo(all('s1-item'), { y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.2 }, at(1, 0.12));

    // ── 2 · look-alikes: the specimens leave, two near-identical ones sit under a lens
    const shadow = $<SVGGraphicsElement>('[data-l="table"] > ellipse');
    tl.to([one('heroes'), ...all('s1-item'), ...shadow], { autoAlpha: 0, duration: 0.14 }, at(2, 0))
      .fromTo(one('lens'), { scale: 1.25, transformOrigin: '50% 45%' }, { autoAlpha: 1, scale: 1, duration: 0.24 }, at(2, 0.1))
      .fromTo(all('lens-item'), { y: 8 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.1 }, at(2, 0.36));

    // ── 3 · the fingerprint: laser, flight, spectrum
    const ions = all('ion');
    const flight = [0.2, 0.32, 0.46]; // light, medium, heavy: time to cross the tube
    gsap.set(one('wipe'), { attr: { width: 0 } });
    tl.to(one('dark'), { autoAlpha: 1, duration: 0.14 }, at(3, 0))
      .to(one('lens'), { autoAlpha: 0, duration: 0.02 }, at(3, 0.14))
      .to(one('bench'), { autoAlpha: 1, duration: 0.14 }, at(3, 0.06))
      .to(one('beam'), { autoAlpha: 1, duration: 0.03 }, at(3, 0.2))
      .to(one('spark'), { autoAlpha: 0.9, duration: 0.03 }, at(3, 0.21))
      .to(glow, { flash: 1, duration: 0.03 }, at(3, 0.21))
      .to(one('spark'), { autoAlpha: 0, duration: 0.1 }, at(3, 0.3))
      .to(one('beam'), { opacity: 0.35, duration: 0.1 }, at(3, 0.3))
      .to(glow, { flash: 0, duration: 0.12 }, at(3, 0.28));
    ions.forEach((ion) => {
      const start = at(3, 0.24) + Number(ion.dataset.lag);
      const dur = flight[Number(ion.dataset.size)];
      tl.to(ion, { autoAlpha: 1, duration: 0.02 }, start)
        .to(ion, { x: 462, duration: dur, ease: 'none' }, start)
        .to(ion, { autoAlpha: 0, duration: 0.02 }, start + dur - 0.01);
    });
    tl.to(one('first'), { autoAlpha: 1, duration: 0.1 }, at(3, 0.4))
      .to(one('sorted'), { autoAlpha: 1, duration: 0.1 }, at(3, 0.72))
      .to(one('wipe'), { attr: { width: 480 }, duration: 0.36, ease: 'none' }, at(3, 0.46))
      .to(all('axis'), { autoAlpha: 1, duration: 0.1 }, at(3, 0.5));

    // ── 4 · the data: spectra per species, both families on one scale
    const bars = all('bar');
    const count = { mosq: 0, tick: 0 };
    const paint = () => {
      one('n-mosq').textContent = String(Math.round(count.mosq));
      one('n-tick').textContent = String(Math.round(count.tick));
    };
    tl.to(one('bench'), { autoAlpha: 0, duration: 0.12 }, at(4, 0))
      .to(one('data'), { autoAlpha: 1, duration: 0.12 }, at(4, 0.06))
      .to(count, { mosq: 826, duration: 0.3, ease: 'power1.out', onUpdate: paint }, at(4, 0.1))
      .to(count, { tick: 310, duration: 0.3, ease: 'power1.out', onUpdate: paint }, at(4, 0.3))
      .to(bars.slice(0, 12), { attr: { width: (i: number) => Number(bars[i].dataset.w) }, duration: 0.16, stagger: 0.016 }, at(4, 0.1))
      .to(bars.slice(12), { attr: { width: (i: number) => Number(bars[12 + i].dataset.w) }, duration: 0.16, stagger: 0.012 }, at(4, 0.3))
      .to(all('bar-note'), { autoAlpha: 1, duration: 0.1, stagger: 0.06 }, at(4, 0.56));

    // ── 5 · compare: three spectra go through one network; the points move
    const ptPos = one('pt-pos');
    const ptNeg = one('pt-neg');
    const linkPos = one('link-pos');
    const linkNeg = one('link-neg');
    gsap.set(ptPos, { x: xy(ptPos, 'from')[0], y: xy(ptPos, 'from')[1] });
    gsap.set(ptNeg, { x: xy(ptNeg, 'from')[0], y: xy(ptNeg, 'from')[1] });
    tl.to(one('data'), { autoAlpha: 0, duration: 0.12 }, at(5, 0))
      .to(one('compare'), { autoAlpha: 1, duration: 0.04 }, at(5, 0.06))
      .fromTo(all('feed'), { x: -14 }, { autoAlpha: 1, x: 0, duration: 0.12, stagger: 0.1 }, at(5, 0.08))
      .to(all('same-net'), { autoAlpha: 1, duration: 0.1 }, at(5, 0.34))
      .to(one('space'), { autoAlpha: 1, duration: 0.12 }, at(5, 0.36))
      .to(one('margin'), { autoAlpha: 1, duration: 0.1 }, at(5, 0.5))
      .to(one('space-note'), { autoAlpha: 1, duration: 0.1 }, at(5, 0.5))
      .to(ptPos, { x: xy(ptPos, 'to')[0], y: xy(ptPos, 'to')[1], duration: 0.22, ease: 'power2.inOut' }, at(5, 0.54))
      .to(linkPos, { attr: { x2: xy(linkPos, 'to')[0], y2: xy(linkPos, 'to')[1] }, duration: 0.22, ease: 'power2.inOut' }, at(5, 0.54))
      .to(ptNeg, { x: xy(ptNeg, 'to')[0], y: xy(ptNeg, 'to')[1], duration: 0.22, ease: 'power2.inOut' }, at(5, 0.6))
      .to(linkNeg, { attr: { x2: xy(linkNeg, 'to')[0], y2: xy(linkNeg, 'to')[1] }, duration: 0.22, ease: 'power2.inOut' }, at(5, 0.6));

    // ── 6 · the map: every spectrum a point, scattered, then one island per species
    const pts = all('pt');
    gsap.set(pts, { x: (i) => xy(pts[i], 'a')[0], y: (i) => xy(pts[i], 'a')[1] });
    tl.to(one('compare'), { autoAlpha: 0, duration: 0.12 }, at(6, 0))
      .to(one('islands'), { autoAlpha: 1, duration: 0.12 }, at(6, 0.06))
      .to(pts, { autoAlpha: 0.9, duration: 0.04, stagger: { amount: 0.16, from: 'random' } }, at(6, 0.12))
      .to(pts, { x: (i) => xy(pts[i], 'b')[0], y: (i) => xy(pts[i], 'b')[1], duration: 0.3, ease: 'power2.inOut' }, at(6, 0.36))
      .fromTo(all('isle'), { scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 0.7, scale: 1, duration: 0.08, stagger: 0.01 }, at(6, 0.64))
      .to(all('cap'), { autoAlpha: 1, duration: 0.1 }, at(6, 0.7));
    tl.to(glow, { points: 1, duration: 0.02 }, at(6, 0.1))
      .to(glow, { show: 1, duration: 0.2, ease: 'none' }, at(6, 0.12))
      .to(glow, { mix: 1, duration: 0.32, ease: 'power1.inOut' }, at(6, 0.34));

    // ── 7 · a new spectrum lands, is named after its neighbours; then the two results
    const newpt = one('newpt');
    const landing = xy(newpt, 'to');
    gsap.set(newpt, { x: landing[0] + 40, y: 30 });
    tl.to(all('cap'), { autoAlpha: 0, duration: 0.1 }, at(7, 0))
      .to(newpt, { autoAlpha: 1, duration: 0.04 }, at(7, 0.06))
      .to(newpt, { x: landing[0], y: landing[1], duration: 0.2, ease: 'power2.inOut' }, at(7, 0.06))
      .to(all('nn'), { autoAlpha: 0.9, duration: 0.06, stagger: 0.03 }, at(7, 0.26))
      .to(one('new-key'), { autoAlpha: 1, duration: 0.1 }, at(7, 0.26))
      .to(one('name'), { autoAlpha: 1, duration: 0.1 }, at(7, 0.42))
      .fromTo(all('acc'), { y: 8 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.14 }, at(7, 0.54));

    // ── 8 · back to the specimens, each one identified
    tl.to(glow, { points: 0, duration: 0.12 }, at(8, 0));
    tl.to([one('islands'), one('dark')], { autoAlpha: 0, duration: 0.2 }, at(8, 0))
      .to([one('heroes'), ...shadow], { autoAlpha: 1, duration: 0.2 }, at(8, 0.04))
      .fromTo(all('done'), { y: 12 }, { autoAlpha: 1, y: 0, duration: 0.16, stagger: 0.18 }, at(8, 0.24));

    const vs = stage.querySelector<HTMLElement>('.vs')!;
    glInput = {
      flashAt: [128, 264],
      colors: { mosq: token('--vs-mosq'), tick: token('--vs-tick'), laser: token('--vs-laser') },
      // while the layer draws the spectra, the SVG stand-in points are hidden (Stage.astro)
      onState: (on) => vs.toggleAttribute('data-gl', on),
    };
  });

  // Three.js and the layer load only for readers who will see them.
  const host = ctx.stage.querySelector<HTMLElement>('.vs-canvas');
  if (host && glInput && glAllowed()) {
    const input = glInput;
    import('./gl')
      .then((m) => m.mountGl(host, glow, input))
      .then((stop) => {
        if (stopped) stop?.();
        else stopGl = stop;
      })
      .catch(() => {});
  }

  return () => {
    stopped = true;
    stopStory();
    stopGl?.();
  };
};

export default scene;
