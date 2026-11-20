import type { Scene } from '../../src/scenes/types';
import { createStory } from '../_shared/story';

/**
 * Timeline for the survey-nlp story. Step k of the text owns the time span
 * [k-1, k]; `at(k, f)` is the position a fraction f into step k. Each step
 * changes the stage in its first ~60 to 85 %, then holds. Layers come from
 * Stage.astro (data-l="name"). No WebGL layer.
 */
const scene: Scene = (ctx) =>
  createStory(ctx, (tl, { $, at, stage }) => {
    const { gsap } = ctx;
    const all = (name: string) => $<SVGGraphicsElement>(`[data-l="${name}"]`);
    const one = (name: string) => all(name)[0];
    const token = (name: string) => getComputedStyle(stage.querySelector('.sn')!).getPropertyValue(name).trim();
    const xy = (el: Element, key: string) => (el as SVGElement).dataset[key]!.split(',').map(Number);
    const num = (el: Element, key: string) => Number((el as SVGElement).dataset[key]);

    // ── 1 · three separate projects, joined by one thread
    tl.fromTo(one('ov-thread'), { y: 8 }, { autoAlpha: 1, y: 0, duration: 0.16 }, at(1, 0.2));

    // the project bar: which project is on screen (1 from step 2, 2 from step 5, 3 from step 7)
    const pb = all('pb-on');
    tl.to(one('pbar'), { autoAlpha: 1, duration: 0.1 }, at(2, 0.06))
      .to(pb[0], { autoAlpha: 1, duration: 0.1 }, at(2, 0.06))
      .to(pb[0], { autoAlpha: 0, duration: 0.1 }, at(5, 0.02))
      .to(pb[1], { autoAlpha: 1, duration: 0.1 }, at(5, 0.02))
      .to(pb[1], { autoAlpha: 0, duration: 0.1 }, at(7, 0.02))
      .to(pb[2], { autoAlpha: 1, duration: 0.1 }, at(7, 0.02));

    // ── 2 · the parliament archive, one tile per text
    const texts = { n: 0 };
    const nEl = one('n-texts');
    const clip = one('tiles-clip');
    tl.to(one('archive'), { autoAlpha: 1, duration: 0.16 }, at(2, 0))
      .to(clip, { attr: { height: 360 }, duration: 0.4, ease: 'none' }, at(2, 0.14))
      .to(texts, { n: 2086, duration: 0.4, ease: 'none', onUpdate: () => (nEl.textContent = Math.round(texts.n).toLocaleString('en-US')) }, at(2, 0.14))
      .to(one('tiles-note'), { autoAlpha: 1, duration: 0.1 }, at(2, 0.58));

    // ── 3 · LDA word bags; BERTopic points gather into clusters
    const pts = all('pt');
    const others = pts.filter((p) => p.dataset.k !== '1');
    const health = pts.filter((p) => p.dataset.k === '1');
    gsap.set(pts, { x: (i) => xy(pts[i], 'a')[0], y: (i) => xy(pts[i], 'a')[1] });
    tl.to(one('archive'), { autoAlpha: 0, duration: 0.1 }, at(3, 0))
      .to(one('night'), { autoAlpha: 1, duration: 0.12 }, at(3, 0))
      .to(one('lda'), { autoAlpha: 1, duration: 0.08 }, at(3, 0.08))
      .fromTo(all('bag'), { y: 10 }, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.07 }, at(3, 0.1))
      .to(one('bert'), { autoAlpha: 1, duration: 0.1 }, at(3, 0.12))
      .to(pts, { x: (i) => xy(pts[i], 'b')[0], y: (i) => xy(pts[i], 'b')[1], duration: 0.3, ease: 'power2.inOut' }, at(3, 0.3))
      .to([one('b-label0'), ...all('b-label')], { autoAlpha: 1, duration: 0.08, stagger: 0.04 }, at(3, 0.58))
      .to([one('lda-total'), one('b-total')], { autoAlpha: 1, duration: 0.1, stagger: 0.08 }, at(3, 0.62));

    // ── 4 · one topic over time: the health cluster spreads along the years
    tl.to([one('lda'), one('b-meta'), one('b-label0'), ...all('b-label'), one('b-total'), ...others], { autoAlpha: 0, duration: 0.12 }, at(4, 0))
      .to(one('dtm'), { autoAlpha: 1, duration: 0.12 }, at(4, 0.08))
      .to(health, { x: (i) => xy(health[i], 'c')[0], y: (i) => xy(health[i], 'c')[1], duration: 0.3, ease: 'power2.inOut' }, at(4, 0.1))
      .fromTo(all('word'), { y: 14 }, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.07 }, at(4, 0.4));

    // ── 5 · a poll question: answers → key phrases → codebook
    tl.to(one('code'), { autoAlpha: 1, duration: 0.14 }, at(5, 0))
      .to([one('bert'), one('dtm')], { autoAlpha: 0, duration: 0.01 }, at(5, 0.14))
      .fromTo(all('answer'), { x: -10 }, { autoAlpha: 1, x: 0, duration: 0.08, stagger: 0.05 }, at(5, 0.1))
      .fromTo(all('phrase'), { x: -10 }, { autoAlpha: 1, x: 0, duration: 0.08, stagger: 0.05 }, at(5, 0.32))
      .to(one('codebook'), { autoAlpha: 1, duration: 0.1 }, at(5, 0.52))
      .to(all('cb-row'), { autoAlpha: 1, duration: 0.06, stagger: 0.05 }, at(5, 0.58))
      .to(all('a-dot'), { autoAlpha: 1, duration: 0.06, stagger: 0.03 }, at(5, 0.72))
      .to(one('code-note'), { autoAlpha: 1, duration: 0.1 }, at(5, 0.74));

    // ── 6 · four signals score one answer; the result becomes columns
    const sig = all('sig-bar');
    const mixBars = all('mix-bar');
    tl.to(one('code'), { autoAlpha: 0, duration: 0.14 }, at(6, 0))
      .to(one('score'), { autoAlpha: 1, duration: 0.1 }, at(6, 0.06))
      .to(all('signal'), { autoAlpha: 1, duration: 0.08, stagger: 0.05 }, at(6, 0.1))
      .to(sig, { attr: { width: (i: number) => num(sig[i], 'w') }, duration: 0.18, stagger: 0.015 }, at(6, 0.16))
      .to(one('weights'), { autoAlpha: 1, duration: 0.08 }, at(6, 0.4))
      .to(mixBars, { attr: { width: (i: number) => num(mixBars[i], 'w') }, duration: 0.16, stagger: 0.03 }, at(6, 0.44))
      .fromTo(one('sheet'), { y: 10 }, { autoAlpha: 1, y: 0, duration: 0.1 }, at(6, 0.64));

    // ── 7 · entropy: two respondents; a meter shows how varied each one is
    const hist = all('hist');
    const meters = all('meter');
    tl.to(one('score'), { autoAlpha: 0, duration: 0.12 }, at(7, 0))
      .to(one('ent'), { autoAlpha: 1, duration: 0.1 }, at(7, 0.06))
      .fromTo(all('resp'), { y: 10 }, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.12 }, at(7, 0.1))
      .to(hist, { attr: { height: (i: number) => num(hist[i], 'h'), y: (i: number) => Number(hist[i].getAttribute('y')) - num(hist[i], 'h') }, duration: 0.16, stagger: 0.012 }, at(7, 0.32));
    tl.to(one('hist-head'), { autoAlpha: 1, duration: 0.08 }, at(7, 0.3));
    tl.to(meters, { attr: { width: (i: number) => num(meters[i], 'w') }, duration: 0.16 }, at(7, 0.46))
      .to(all('meter-label'), { autoAlpha: 1, duration: 0.08 }, at(7, 0.6))
      .fromTo(all('straight'), { scale: 0.9, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.08 }, at(7, 0.64)).to(one('ent-max'), { autoAlpha: 1, duration: 0.1 }, at(7, 0.68));

    // ── 8 · four features against the batch, then one score; top third in amber
    const fdots = all('fdot');
    const outs = fdots.filter((d) => d.dataset.out);
    const review = all('sdot').filter((d) => d.dataset.review);
    tl.to(one('ent'), { autoAlpha: 0, duration: 0.12 }, at(8, 0))
      .to(one('rank'), { autoAlpha: 1, duration: 0.1 }, at(8, 0.06))
      .to(all('feat'), { autoAlpha: 1, duration: 0.08, stagger: 0.04 }, at(8, 0.08))
      .to(fdots, { attr: { cx: (i: number) => num(fdots[i], 'x') }, duration: 0.24, ease: 'power2.out' }, at(8, 0.14))
      .to(outs, { attr: { r: 6 }, fill: token('--sn-on'), opacity: 1, duration: 0.06 }, at(8, 0.4))
      .to(one('out-key'), { autoAlpha: 1, duration: 0.06 }, at(8, 0.4))
      .fromTo(one('score-row'), { y: 10 }, { autoAlpha: 1, y: 0, duration: 0.1 }, at(8, 0.5))
      .to(review, { fill: token('--sn-flag'), duration: 0.08 }, at(8, 0.66))
      .to(one('cut'), { autoAlpha: 1, duration: 0.08 }, at(8, 0.66));

    // ── 9 · the review list, the reason for each rank, by interviewer
    const pBars = all('p-bar');
    tl.to(one('queue'), { autoAlpha: 1, duration: 0.14 }, at(9, 0))
      .fromTo(all('q-row'), { x: -10 }, { autoAlpha: 1, x: 0, duration: 0.06, stagger: 0.03 }, at(9, 0.1))
      .to(one('q-gap'), { autoAlpha: 1, duration: 0.06 }, at(9, 0.26))
      .to(one('q-cut'), { autoAlpha: 1, duration: 0.08 }, at(9, 0.42))
      .to(one('q-side'), { autoAlpha: 1, duration: 0.12 }, at(9, 0.5))
      .to(pBars, { attr: { width: (i: number) => num(pBars[i], 'w') }, duration: 0.14, stagger: 0.02 }, at(9, 0.58));
  });

export default scene;
