import type { Scene } from '../../src/scenes/types';
import { createStory } from '../_shared/story';
import { glAllowed } from '../_shared/gl-layer';
import type { GlInput, GlState } from './gl';

/**
 * Timeline for the drone-manatees story. Step k of the text owns the time
 * span [k-1, k]; `at(k, f)` is the position a fraction f into step k.
 * Each step changes the stage in its first ~60 to 85 % and then holds.
 * Layers come from Stage.astro and are addressed by data-l="name".
 *
 * `glow` is the state of the optional WebGL light layer (gl.ts). It is tweened
 * on the same timeline whether or not the layer exists, so the layer can join
 * at any moment and the SVG stage is a complete fallback without it.
 */
const scene: Scene = (ctx) => {
  const glow: GlState = { sun: 1, photo: 0, scan: 0, scanX: 0, scanY: 0, trail: 0, trailT: 0 };
  let glInput: GlInput | undefined;
  let stopGl: (() => void) | null = null;
  let stopped = false;

  const stopStory = createStory(ctx, (tl, { $, at, stage }) => {
    const { gsap } = ctx;
    const all = (name: string) => $<SVGGraphicsElement>(`[data-l="${name}"]`);
    const one = (name: string) => all(name)[0];
    const token = (name: string) => getComputedStyle(stage.querySelector('.dm')!).getPropertyValue(name).trim();
    const find = token('--dm-find');
    const other = token('--dm-other');

    // ── 1 · manatees in the Canal: the two facts appear over the lake
    tl.fromTo(all('s1-item'), { y: -10 }, { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.22 }, at(1, 0.12));

    // ── 2 · the lake: the daylight scene gives way to the map; 44 areas light up
    const polys = all('poly');
    tl.to(glow, { sun: 0, duration: 0.14 }, at(2, 0));
    tl.to(one('s1'), { autoAlpha: 0, duration: 0.12 }, at(2, 0))
      .fromTo(one('map'), { scale: 1.08, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.26 }, at(2, 0.04))
      .to(one('lab436'), { autoAlpha: 1, duration: 0.14 }, at(2, 0.24))
      .to(one('scalebar'), { autoAlpha: 1, duration: 0.14 }, at(2, 0.24))
      .to(polys, { autoAlpha: 1, duration: 0.06, stagger: { amount: 0.36 } }, at(2, 0.3));

    // ── 3 · the flights: one area, flown line by line, a photo every few seconds
    const routePath = one('route') as unknown as SVGPathElement;
    const routeLength = routePath.getTotalLength();
    const drone = one('drone');
    const snaps = all('snap');
    const flight = { p: 0 };
    const count = { flights: 0, hours: 0, photos: 0 };
    const paint = () => {
      one('n-flights').textContent = String(Math.round(count.flights));
      one('n-hours').textContent = Math.round(count.hours) + ' h';
      one('n-photos').textContent = Math.round(count.photos).toLocaleString('en-US');
    };
    const place = () => {
      const pt = routePath.getPointAtLength(flight.p * routeLength);
      gsap.set(drone, { x: pt.x, y: pt.y });
    };
    place();
    gsap.set(routePath, { strokeDasharray: '2 7' });
    const flown = all('flown');
    tl.to(one('night'), { autoAlpha: 1, duration: 0.14 }, at(3, 0))
      .to(one('flight'), { autoAlpha: 1, duration: 0.14 }, at(3, 0.06))
      .to(drone, { autoAlpha: 1, duration: 0.06 }, at(3, 0.14))
      .to(flight, { p: 1, duration: 0.56, ease: 'none', onUpdate: place }, at(3, 0.16))
      .to(snaps, { autoAlpha: 1, duration: 0.02, ease: 'none', stagger: { amount: 0.54 } }, at(3, 0.17))
      .to(flown[0], { autoAlpha: 1, duration: 0.1 }, at(3, 0.2))
      .to(count, { flights: 65, duration: 0.3, ease: 'power1.out', onUpdate: paint }, at(3, 0.2))
      .to(flown[1], { autoAlpha: 1, duration: 0.1 }, at(3, 0.36))
      .to(count, { hours: 221, duration: 0.3, ease: 'power1.out', onUpdate: paint }, at(3, 0.36))
      .to(flown[2], { autoAlpha: 1, duration: 0.1 }, at(3, 0.56))
      .to(one('flight-key'), { autoAlpha: 1, duration: 0.1 }, at(3, 0.3));
    tl.to(glow, { trail: 1, duration: 0.04 }, at(3, 0.14))
      .to(glow, { trailT: 1, duration: 0.56, ease: 'none' }, at(3, 0.16));

    // ── 4 · the photos: a wall of them, then one, in which the animal is a speck
    const wall = all('wall-photo');
    const insets = all('inset');
    tl.to(glow, { trail: 0, duration: 0.08 }, at(4, 0));
    tl.to(one('flight'), { autoAlpha: 0, duration: 0.1 }, at(4, 0))
      .to(wall, { autoAlpha: 1, duration: 0.03, stagger: { amount: 0.24, from: 'random' } }, at(4, 0.06))
      .to(one('strip-photos'), { autoAlpha: 1, duration: 0.08 }, at(4, 0.06))
      .to(count, { photos: 57332, duration: 0.3, ease: 'power1.out', onUpdate: paint }, at(4, 0.06))
      .to(one('strip-seen'), { autoAlpha: 1, duration: 0.1 }, at(4, 0.34))
      .fromTo(one('photo'), { scale: 0.03, svgOrigin: '349 213' }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'power2.inOut' }, at(4, 0.4))
      .to(one('wall'), { autoAlpha: 0, duration: 0.12 }, at(4, 0.5))
      .to(glow, { photo: 1, duration: 0.12 }, at(4, 0.56))
      .fromTo(insets, { scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.12, stagger: 0.12 }, at(4, 0.62));

    // ── 5 · tiles: the photo is cut up, each tile is read, finds are marked
    const tiles = all('tile');
    const scan = one('scan');
    const boxes = all('box');
    const slots = scan.dataset.tiles!.split(';').map((s) => s.split(',').map(Number));
    const scanFrom = 0.24;
    const scanStep = 0.36 / slots.length;
    tl.to(tiles, { autoAlpha: 1, duration: 0.05, stagger: 0.012 }, at(5, 0.04))
      .to(scan, { autoAlpha: 1, duration: 0.03 }, at(5, scanFrom))
      .to(glow, { scan: 1, duration: 0.03 }, at(5, scanFrom));
    slots.forEach(([x, y], i) => {
      const t = at(5, scanFrom + i * scanStep);
      tl.set(scan, { x, y }, t).set(glow, { scanX: x, scanY: y }, t);
    });
    boxes.forEach((box) => {
      const t = at(5, scanFrom + (Number(box.dataset.tile) + 0.6) * scanStep);
      tl.fromTo(box, { scale: 1.5, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.05 }, t);
    });
    const manateeBox = boxes.find((b) => b.querySelector('rect')!.getAttribute('stroke')!.includes('find'))!;
    tl.to(one('inset-ring-manatee'), { stroke: find, duration: 0.05 }, at(5, scanFrom + (Number(manateeBox.dataset.tile) + 0.6) * scanStep))
      .to(one('inset-ring-log'), { stroke: other, duration: 0.05 }, at(5, scanFrom + (Number(boxes[1].dataset.tile) + 0.6) * scanStep))
      .to([scan, ...tiles], { autoAlpha: 0, duration: 0.1 }, at(5, scanFrom + 0.4))
      .to(glow, { scan: 0, duration: 0.1 }, at(5, scanFrom + 0.4));

    // ── 6 · one, a pair or a group: the find is compared with five descriptions
    const bars = all('score-bar');
    const scores = all('score');
    tl.to(glow, { photo: 0, duration: 0.1 }, at(6, 0));
    tl.to(one('classify'), { autoAlpha: 1, duration: 0.14 }, at(6, 0.02))
      .to(one('strip'), { autoAlpha: 0, duration: 0.1 }, at(6, 0.02))
      .to(one('pair-y'), { autoAlpha: 1, duration: 0.16 }, at(6, 0.2))
      .fromTo(one('prompt'), { y: 10 }, { autoAlpha: 1, y: 0, duration: 0.12 }, at(6, 0.34))
      .fromTo(scores, { x: 12 }, { autoAlpha: 1, x: 0, duration: 0.08, stagger: 0.05 }, at(6, 0.44))
      .to(bars, { attr: { width: (i: number) => Number(bars[i].dataset.w) }, duration: 0.2, ease: 'power2.out', stagger: 0.05 }, at(6, 0.46));

    // ── 7 · how well: back over the lake, each sequence found or missed
    tl.to([one('classify'), one('photo'), one('night')], { autoAlpha: 0, duration: 0.14 }, at(7, 0))
      .to([one('lab436'), one('scalebar')], { autoAlpha: 0, duration: 0.02 }, at(7, 0))
      .to(polys, { opacity: 0.3, duration: 0.1 }, at(7, 0.04))
      .to(one('maplabel'), { opacity: 0.45, duration: 0.1 }, at(7, 0.04))
      .fromTo(all('seq-train'), { scale: 0.2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.06, stagger: { amount: 0.2 } }, at(7, 0.14))
      .to(all('res')[0], { autoAlpha: 1, duration: 0.1 }, at(7, 0.18))
      .to(one('legend'), { autoAlpha: 1, duration: 0.1 }, at(7, 0.22))
      .fromTo(all('seq-test'), { scale: 0.2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.06, stagger: { amount: 0.16 } }, at(7, 0.44))
      .to(all('res')[1], { autoAlpha: 1, duration: 0.1 }, at(7, 0.48));

    // ── 8 · the survey, repeated: daylight again, a drone passes over the pair
    const drone8 = one('drone8');
    gsap.set(drone8, { x: -80, y: 610 });
    tl.to([one('map'), one('results')], { autoAlpha: 0, duration: 0.2 }, at(8, 0))
      .to(glow, { sun: 1, duration: 0.2 }, at(8, 0.06))
      .to(drone8, { autoAlpha: 1, duration: 0.04 }, at(8, 0.14))
      .to(drone8, { x: 676, y: 124, duration: 0.5, ease: 'power1.inOut' }, at(8, 0.14))
      .fromTo(one('box8'), { scale: 1.12, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.1 }, at(8, 0.42));

    // what the light layer needs to line up with the SVG
    const n = Math.ceil(routeLength / 3);
    const route = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const pt = routePath.getPointAtLength((i / (n - 1)) * routeLength);
      route.set([pt.x, pt.y], i * 2);
    }
    const scanBox = (scan as unknown as SVGRectElement);
    const dm = stage.querySelector<HTMLElement>('.dm')!;
    glInput = {
      route,
      tile: { x: +scanBox.getAttribute('x')!, y: +scanBox.getAttribute('y')!, size: +scanBox.getAttribute('width')! },
      photo: { x: 40, y: 40, w: 720, h: 450 },
      waterline: 190,
      colors: { glare: token('--dm-glare'), find, on: token('--dm-on') },
      onState: (on) => dm.toggleAttribute('data-gl', on),
    };
  });

  // Three.js and the layer load only for readers who will see them.
  const host = ctx.stage.querySelector<HTMLElement>('.dm-canvas');
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
