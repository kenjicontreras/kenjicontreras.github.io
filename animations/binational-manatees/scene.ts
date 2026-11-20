import type { Scene } from '../../src/scenes/types';
import { createStory } from '../_shared/story';
import { glAllowed } from '../_shared/gl-layer';
import type { GlInput, GlState } from './gl';

/**
 * Timeline for the binational-manatees story. Step k of the text owns the
 * time span [k-1, k]; `at(k, f)` is the position a fraction f into step k.
 * Each step changes the stage in its first ~60 to 85 % and then holds.
 * Layers come from Stage.astro and are addressed by data-l="name".
 * The nine steps follow the lab's public summary slide by slide; the last one
 * is "Why it matters" (the summary's "What can you do?" cards are kept, hidden).
 *
 * `glow` is the state of the optional WebGL light layer (gl.ts). It is tweened
 * on the same timeline whether or not the layer exists, so the layer can join
 * at any moment and the SVG stage is a complete fallback without it.
 */
const scene: Scene = (ctx) => {
  const glow: GlState = { surface: 1, deep: 0, travel: 0, show: 0, mix: 0, lit: 0, cloud: 1, trackT: 0, tracks: 0, rain: 0 };
  let glInput: GlInput | undefined;
  let stopGl: (() => void) | null = null;
  let stopped = false;

  const stopStory = createStory(ctx, (tl, { $, at, stage }) => {
    const { gsap } = ctx;
    const all = (name: string) => $<SVGGraphicsElement>(`[data-l="${name}"]`);
    const one = (name: string) => all(name)[0];
    const token = (name: string) => getComputedStyle(stage.querySelector('.bm')!).getPropertyValue(name).trim();
    const xy = (el: Element, key: string) => (el as SVGElement).dataset[key]!.split(',').map(Number);
    const draw = (path: SVGGraphicsElement) => {
      const length = (path as unknown as SVGPathElement).getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      return path;
    };

    const signal = token('--bm-signal');
    const moss = token('--bm-moss');
    const slate = '#4e6874';

    // ── 1 · who they are: name, length and weight appear on the wetland scene
    tl.fromTo(all('s1-item'), { y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.16 }, at(1, 0.1));

    // ── 2 · endangered: the range draws from Mexico to Brazil, then the threats
    tl.to(glow, { surface: 0, duration: 0.14 }, at(2, 0));
    tl.to(one('s1'), { autoAlpha: 0, duration: 0.12 }, at(2, 0))
      .to(one('range'), { autoAlpha: 1, duration: 0.25 }, at(2, 0.04))
      .to(draw(one('range-line')), { strokeDashoffset: 0, duration: 0.4, ease: 'power1.inOut' }, at(2, 0.18))
      .to(all('range-label'), { autoAlpha: 1, duration: 0.12, stagger: 0.06 }, at(2, 0.22))
      .to(all('range-island'), { autoAlpha: 0.85, duration: 0.15 }, at(2, 0.38))
      .to(one('endangered'), { autoAlpha: 1, duration: 0.15 }, at(2, 0.46))
      .to(one('study-box'), { autoAlpha: 1, duration: 0.12 }, at(2, 0.56))
      .fromTo(all('threat'), { y: 10 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.07 }, at(2, 0.6));

    // ── 3 · fingerprint: four manatees, each calling, each above two of its calls
    const columns = all('column');
    const arcs = all('call-arcs');
    const cards = all('card');
    const callers = all('caller');
    gsap.set(all('wipe'), { attr: { width: 0 } });
    tl.to(glow, { deep: 1, duration: 0.2 }, at(3, 0.06))
      .to(glow, { travel: 1, duration: 0.55, ease: 'power3.out' }, at(3, 0.02));
    tl.to(one('deep'), { autoAlpha: 1, duration: 0.14 }, at(3, 0))
      .to(one('range'), { autoAlpha: 0, duration: 0.02 }, at(3, 0.14))
      .to(columns, { autoAlpha: 0.55, duration: 0.12, stagger: 0.04 }, at(3, 0.1))
      .fromTo(callers, { y: -10 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.04 }, at(3, 0.12))
      .fromTo(arcs, { y: -6 }, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.04 }, at(3, 0.22))
      .to(cards, { autoAlpha: 1, duration: 0.06, stagger: 0.04 }, at(3, 0.28))
      .to(all('wipe'), { attr: { width: 150 }, duration: 0.18, ease: 'none', stagger: 0.04 }, at(3, 0.28))
      .to(one('spec-note'), { autoAlpha: 1, duration: 0.1 }, at(3, 0.5));

    // ── 4 · voices to individuals: each call becomes a dot, the dots of many
    // manatees mix, dots that sound alike gather, and each group gets its manatee
    const dots = all('dot');
    const known = dots.filter((d) => d.dataset.known);
    const others = dots.filter((d) => !d.dataset.known);
    const grouped = dots.filter((d) => d.dataset.cluster !== '-1');
    const stray = dots.filter((d) => d.dataset.cluster === '-1');
    const fly = (el: Element) => (el as SVGElement).dataset.fly!.split(',').map(Number);
    gsap.set(dots, { x: (i) => xy(dots[i], 'a')[0], y: (i) => xy(dots[i], 'a')[1] });
    callers.forEach((c) => gsap.set(c, { svgOrigin: `${fly(c)[3]} ${fly(c)[4]}` }));
    tl.to([...columns, ...arcs, one('spec-note')], { autoAlpha: 0, duration: 0.1 }, at(4, 0.02))
      .to(cards, { scale: 0.04, autoAlpha: 0, transformOrigin: '50% 50%', duration: 0.12, ease: 'power2.in' }, at(4, 0.02))
      .to(known, { autoAlpha: 1, duration: 0.04 }, at(4, 0.12))
      .to(callers, { opacity: 0.3, duration: 0.1 }, at(4, 0.16))
      .to(others, { autoAlpha: 0.9, duration: 0.04, stagger: { amount: 0.12, from: 'random' } }, at(4, 0.18))
      .to(known, { x: (i) => xy(known[i], 'b')[0], y: (i) => xy(known[i], 'b')[1], duration: 0.14 }, at(4, 0.2))
      .to(dots, { x: (i) => xy(dots[i], 'c')[0], y: (i) => xy(dots[i], 'c')[1], duration: 0.22, ease: 'power2.inOut' }, at(4, 0.38))
      .to(grouped.filter((d) => !d.dataset.known), { fill: signal, duration: 0.08 }, at(4, 0.58))
      .to(stray, { opacity: 0.25, duration: 0.08 }, at(4, 0.58))
      .fromTo(all('ring'), { scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 0.7, scale: 1, duration: 0.08, stagger: 0.012 }, at(4, 0.6))
      .to(callers, { x: (i) => fly(callers[i])[0], y: (i) => fly(callers[i])[1], scale: (i) => fly(callers[i])[2], opacity: 1, duration: 0.16, ease: 'power2.inOut' }, at(4, 0.64))
      .to(all('who'), { autoAlpha: 1, duration: 0.08, stagger: 0.03 }, at(4, 0.74))
      .to(one('cloud-key'), { autoAlpha: 1, duration: 0.1 }, at(4, 0.74))
      .to(grouped, { opacity: 0.35, duration: 0.08 }, at(4, 0.76));
    tl.to(glow, { show: 1, duration: 0.18, ease: 'none' }, at(4, 0.16))
      .to(glow, { mix: 1, duration: 0.24, ease: 'power1.inOut' }, at(4, 0.36))
      .to(glow, { lit: 1, duration: 0.08 }, at(4, 0.58))
      .to(glow, { cloud: 0.42, duration: 0.08 }, at(4, 0.76));

    // ── 5 · step by step: five stages on the left, three numbers on the right
    const count = { files: 0, hours: 0, accuracy: 0 };
    const paint = () => {
      one('n-files').textContent = Math.round(count.files).toLocaleString('en-US');
      one('n-hours').textContent = '> ' + (Math.round(count.hours / 100) * 100).toLocaleString('en-US');
      one('n-accuracy').textContent = count.accuracy.toFixed(2) + '%';
    };
    const rows = all('pipe-row');
    const results = all('result');
    tl.to(glow, { cloud: 0, deep: 0.45, duration: 0.12 }, at(5, 0));
    tl.to(one('cloud'), { autoAlpha: 0, duration: 0.12 }, at(5, 0))
      .to(one('pipe-line'), { autoAlpha: 1, duration: 0.1 }, at(5, 0.08))
      .fromTo(rows, { x: -14 }, { autoAlpha: 1, x: 0, duration: 0.12, stagger: 0.11 }, at(5, 0.08))
      .to(results[0], { autoAlpha: 1, duration: 0.1 }, at(5, 0.24))
      .to(count, { files: 1931079, duration: 0.3, ease: 'power1.out', onUpdate: paint }, at(5, 0.24))
      .to(results[1], { autoAlpha: 1, duration: 0.1 }, at(5, 0.36))
      .to(count, { hours: 64000, duration: 0.26, ease: 'power1.out', onUpdate: paint }, at(5, 0.36))
      .to(results[2], { autoAlpha: 1, duration: 0.1 }, at(5, 0.6))
      .to(count, { accuracy: 83.75, duration: 0.22, ease: 'power1.out', onUpdate: paint }, at(5, 0.6));

    // ── 6 · discovery: hydrophones, then the individuals, then nine crossings
    const pop = all('pop');
    const popPA = pop.filter((p) => p.dataset.country === 'PA');
    const popCR = pop.filter((p) => p.dataset.country === 'CR');
    const tracks = all('track') as unknown as SVGPathElement[];
    const swimmers = all('swimmer');
    tl.to(glow, { deep: 0.8, duration: 0.2 }, at(6, 0.04))
      .to(glow, { tracks: 1, duration: 0.02 }, at(6, 0.58))
      .to(glow, { trackT: 0.2 + (tracks.length - 1) * 0.02, duration: 0.2 + (tracks.length - 1) * 0.02, ease: 'none' }, at(6, 0.58));
    tl.to(one('pipe'), { autoAlpha: 0, duration: 0.12 }, at(6, 0))
      .fromTo(one('map'), { scale: 1.07, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.22 }, at(6, 0.04))
      .to(all('station'), { autoAlpha: 1, duration: 0.08, stagger: 0.012 }, at(6, 0.14))
      .to(one('cap5'), { autoAlpha: 1, duration: 0.1 }, at(6, 0.16))
      .to(all('station'), { opacity: 0.4, duration: 0.15 }, at(6, 0.36))
      .to(one('cap5'), { autoAlpha: 0, duration: 0.1 }, at(6, 0.36))
      .to(popPA, { autoAlpha: 1, duration: 0.05, stagger: { amount: 0.16 } }, at(6, 0.34))
      .to(popCR, { autoAlpha: 1, duration: 0.05, stagger: { amount: 0.16 } }, at(6, 0.38))
      .to([one('lab61'), one('lab49'), one('pop-key')], { autoAlpha: 1, duration: 0.1 }, at(6, 0.5));
    tracks.forEach((track, j) => {
      const length = track.getTotalLength();
      const start = at(6, 0.58) + j * 0.02;
      const swim = { p: 0 };
      const origin = popPA.find((p) => p.dataset.origin === String(j));
      const dest = popCR.find((p) => p.dataset.dest === String(j));
      gsap.set(track, { strokeDasharray: length, strokeDashoffset: length });
      const place = () => {
        const pt = track.getPointAtLength(swim.p * length);
        gsap.set(swimmers[j], { x: pt.x, y: pt.y });
      };
      place();
      tl.to(track, { autoAlpha: 0.75, duration: 0.02 }, start)
        .to(track, { strokeDashoffset: 0, duration: 0.2, ease: 'power1.inOut' }, start)
        .to(swim, { p: 1, duration: 0.2, ease: 'power1.inOut', onUpdate: place }, start)
        .to(swimmers[j], { autoAlpha: 1, duration: 0.02 }, start)
        .to(swimmers[j], { autoAlpha: 0, duration: 0.03 }, start + 0.2);
      if (origin) tl.to(origin, { fill: signal, attr: { r: 5 }, duration: 0.04 }, start);
      if (dest) tl.to(dest, { fill: signal, attr: { r: 5 }, duration: 0.04 }, start + 0.19);
    });
    tl.to([one('lab9'), one('cross-key')], { autoAlpha: 1, duration: 0.1 }, at(6, 0.84));

    // ── 7 · when: the conditions that went with the crossings
    tl.to([one('lab61'), one('lab49'), one('lab9')], { autoAlpha: 0, duration: 0.12 }, at(7, 0))
      .to(glow, { rain: 1, duration: 0.16 }, at(7, 0.1))
      .fromTo(all('weather-item'), { x: 14 }, { autoAlpha: 1, x: 0, duration: 0.14, stagger: 0.16 }, at(7, 0.1));

    // ── 8 · corridor: the map turns light and the band is drawn
    const corridor = draw(one('corridor'));
    tl.to(glow, { rain: 0, tracks: 0, deep: 0, duration: 0.12 }, at(8, 0));
    tl.to([one('weather'), ...tracks, ...all('station'), one('pop-key'), one('cross-key')], { autoAlpha: 0, duration: 0.12 }, at(8, 0))
      .to(one('light'), { autoAlpha: 1, duration: 0.3 }, at(8, 0.06))
      .to(one('land'), { fill: token('--bm-sand'), duration: 0.3 }, at(8, 0.06))
      .to(all('river'), { stroke: '#7fb6b4', duration: 0.3 }, at(8, 0.06))
      .to(all('border'), { stroke: slate, duration: 0.3 }, at(8, 0.06))
      .to(one('coastline'), { stroke: moss, opacity: 0.9, duration: 0.3 }, at(8, 0.06))
      .to(all('maplabel'), { fill: slate, duration: 0.3 }, at(8, 0.06))
      .to(popPA, { fill: token('--bm-pa-light'), attr: { r: 3.6 }, opacity: 0.4, duration: 0.3 }, at(8, 0.06))
      .to(popCR, { fill: token('--bm-cr-light'), attr: { r: 3.6 }, opacity: 0.4, duration: 0.3 }, at(8, 0.06))
      .to(corridor, { autoAlpha: 0.5, duration: 0.04 }, at(8, 0.28))
      .to(corridor, { strokeDashoffset: 0, duration: 0.4, ease: 'power1.inOut' }, at(8, 0.28))
      .to(one('lab984'), { autoAlpha: 1, duration: 0.12 }, at(8, 0.6));

    // ── 9 · why it matters: back at the surface with the mother and calf, but the
    // water turns murky and they all but disappear. Two hydrophones, one per
    // country, listen; a call spreads through the water; each station's card
    // draws the same voice print, and a link says it is the same voice.
    // The "what you can do" cards (data-l="action") stay in Stage.astro, hidden;
    // to show them again, restore the manatee shift and the card tween below.
    tl.to([one('lab984'), one('map'), one('people'), one('deep')], { autoAlpha: 0, duration: 0.25 }, at(9, 0.02))
      .to(glow, { surface: 1, duration: 0.1 }, at(9, 0.06))
      .to(one('murk'), { autoAlpha: 0.82, duration: 0.18 }, at(9, 0.18))
      .to(glow, { surface: 0.3, duration: 0.18 }, at(9, 0.18))
      .fromTo(all('why-station'), { y: 12 }, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.05 }, at(9, 0.28));
    // the call spreads out from the mother (set + to, so scrolling back hides it again)
    all('why-wave').forEach((wave, i) => {
      tl.set(wave, { autoAlpha: 0.9 }, at(9, 0.36 + i * 0.06))
        .to(wave, { attr: { r: 430 }, autoAlpha: 0, duration: 0.2, ease: 'power1.out' }, at(9, 0.36 + i * 0.06));
    });
    const whyCards = all('why-card');
    const whyVoices = all('why-voice').map(draw);
    whyCards.forEach((card, i) => {
      tl.to(card, { autoAlpha: 1, duration: 0.06 }, at(9, 0.44 + i * 0.08))
        .to(whyVoices[i], { strokeDashoffset: 0, duration: 0.12, ease: 'none' }, at(9, 0.46 + i * 0.08));
    });
    tl.to(one('why-link'), { autoAlpha: 1, duration: 0.1 }, at(9, 0.66));
    // tl.to(one('manatee'), { y: 112, duration: 0.02 }, at(9, 0));
    // tl.fromTo(all('action'), { y: 12 }, { autoAlpha: 1, y: 0, duration: 0.14, stagger: 0.1 }, at(9, 0.22));

    // what the light layer needs to line up with the SVG: groups, tracks, origin
    const sampled = tracks.map((track) => {
      const length = track.getTotalLength();
      const n = Math.max(2, Math.ceil(length / 2.4));
      const points = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) {
        const pt = track.getPointAtLength((i / (n - 1)) * length);
        points.set([pt.x, pt.y], i * 2);
      }
      return points;
    });
    const bm = stage.querySelector<HTMLElement>('.bm')!;
    glInput = {
      rings: all('ring').map((r) => ({ x: +r.getAttribute('cx')!, y: +r.getAttribute('cy')!, r: +r.getAttribute('r')! })),
      box: { x: 90, y: 70, w: 620, h: 400 },
      tracks: sampled,
      origin: [
        sampled.reduce((a, t) => a + t[0], 0) / sampled.length,
        sampled.reduce((a, t) => a + t[1], 0) / sampled.length,
      ],
      colors: { sage: token('--bm-sage'), signal, onDeep: token('--bm-on-deep') },
      // while the layer draws the calls, the SVG stand-in dots are hidden (Stage.astro)
      onState: (on) => bm.toggleAttribute('data-gl', on),
    };
  });

  // Three.js and the layer load only for readers who will see them.
  const host = ctx.stage.querySelector<HTMLElement>('.bm-canvas');
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
