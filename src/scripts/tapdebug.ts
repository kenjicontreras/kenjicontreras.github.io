// Temporary tap diagnostic, loaded only when the URL has ?tapdebug (see Base.astro).
// Red dot: where the finger went down. Blue dot: where the browser reported the click.
// Green box: the element the click went to. Links are not followed while it runs.
// Remove once the Android tap-offset report is resolved.

const t0 = performance.now();
const layer = document.createElement('div');
layer.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none';
const panel = document.createElement('pre');
panel.style.cssText =
  'position:fixed;left:8px;right:8px;top:72px;margin:0;padding:8px 10px;font:12px/1.35 ui-monospace,monospace;' +
  'background:rgba(0,0,0,.82);color:#fff;border-radius:8px;white-space:pre-wrap;pointer-events:none;z-index:2147483647';
panel.textContent = 'tapdebug on: tap anything';
document.body.append(layer, panel);

const mark = (x: number, y: number, color: string) => {
  const d = document.createElement('div');
  d.style.cssText = `position:fixed;left:${x - 7}px;top:${y - 7}px;width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 0 2px #fff`;
  layer.append(d);
};
const box = (r: DOMRect) => {
  const d = document.createElement('div');
  d.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;outline:2px solid #16a34a`;
  layer.append(d);
};
const describe = (el: Element | null) =>
  el ? `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).trim().split(/\s+/).join('.') : ''} "${(el.textContent || '').trim().slice(0, 28)}"` : 'none';

let down: { x: number; y: number; t: number; sy: number } | null = null;
addEventListener(
  'pointerdown',
  (e) => {
    layer.replaceChildren();
    down = { x: e.clientX, y: e.clientY, t: performance.now(), sy: scrollY };
    mark(e.clientX, e.clientY, '#dc2626');
  },
  true,
);
addEventListener(
  'click',
  (e) => {
    const target = (e.target as Element).closest('a, button') || (e.target as Element);
    if ((e.target as Element).closest('a')) e.preventDefault();
    mark(e.clientX, e.clientY, '#2563eb');
    const r = target.getBoundingClientRect();
    box(r);
    const vv = window.visualViewport;
    panel.textContent = [
      `down  x=${down?.x.toFixed(0)} y=${down?.y.toFixed(0)}   click x=${e.clientX.toFixed(0)} y=${e.clientY.toFixed(0)}   dy=${down ? (e.clientY - down.y).toFixed(0) : '?'}`,
      `hit   ${describe(target)}  box y ${r.top.toFixed(0)}-${r.bottom.toFixed(0)}`,
      `at down: ${describe(down ? document.elementFromPoint(down.x, down.y) : null)}`,
      `scrollY ${down?.sy.toFixed(0)} -> ${scrollY.toFixed(0)}   innerH ${innerHeight}   vv top ${vv?.offsetTop.toFixed(1)} h ${vv?.height.toFixed(0)} scale ${vv?.scale.toFixed(2)}`,
      `dpr ${devicePixelRatio}   ${((performance.now() - t0) / 1000).toFixed(1)} s since load   ${navigator.userAgent.match(/Android [\d.]+|Chrome\/[\d]+|iPhone OS [\d_]+/g)?.join(' ') || ''}`,
    ].join('\n');
  },
  true,
);
