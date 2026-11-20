/**
 * An optional WebGL layer for a story stage, drawn with Three.js.
 *
 * The layer is ONE transparent canvas laid over the SVG stage. It only ever
 * adds light (glow, particles, rays): shaders write premultiplied colour with
 * zero alpha, so the browser composites the canvas additively over the SVG.
 * Text, maps and icons stay in the SVG underneath and stay sharp.
 *
 * Cost controls, all in this file:
 * - Three.js is imported here, dynamically and only the classes listed in
 *   three-lite.ts, so it downloads only when a story with a layer comes near
 *   the screen, and never for readers who are excluded by `glAllowed()`.
 * - Pixel density is capped (soft light does not need more).
 * - Nothing is drawn while the stage is off screen.
 * - A frame is drawn at full rate only while the story state is changing
 *   (the reader is scrolling); self-running motion is drawn at ~30 fps;
 *   when nothing is lit, nothing is drawn.
 * - If WebGL is missing or the context is lost, the layer removes itself and
 *   the SVG stage carries the story alone.
 */
import type * as Three from 'three';

/** The subset of Three.js that is bundled (see three-lite.ts). */
export type ThreeLite = typeof import('./three-lite');

/** False for readers who should get the plain SVG stage. `?nogl` forces it off (for testing). */
export function glAllowed(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const connection = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return false;
  if (new URLSearchParams(location.search).has('nogl')) return false;
  return true;
}

export type LayerFrame = {
  /** Seconds since the layer was mounted. */
  time: number;
  /** Drawing-buffer pixels per stage unit (stage units are the SVG viewBox units). */
  scale: number;
};

export type LayerScene = {
  /** A number that changes whenever the story state changes. */
  signature: () => number;
  /** True while something on the layer moves by itself. */
  ambient: () => boolean;
  /** Update uniforms for this frame. The layer renders right after. */
  update: (frame: LayerFrame) => void;
  scene: Three.Scene;
  camera: Three.Camera;
};

export type LayerOptions = {
  /** Width of the SVG viewBox the layer is registered to. */
  viewWidth: number;
  /** Upper limit for device pixel ratio. */
  maxPixelRatio?: number;
  /** Called when the layer has drawn its first frame, and again if it has to give up. */
  onState?: (on: boolean) => void;
};

/**
 * Mounts the layer in `host` (the element that holds the stage SVG).
 * Resolves to a cleanup function, or null if WebGL is not available.
 */
export async function mountLayer(
  host: HTMLElement,
  options: LayerOptions,
  build: (three: ThreeLite) => LayerScene,
): Promise<(() => void) | null> {
  const three = await import('./three-lite');

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  });

  let renderer: Three.WebGLRenderer;
  try {
    renderer = new three.WebGLRenderer({
      canvas,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.maxPixelRatio ?? 1.5));

  const layer = build(three);
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  host.appendChild(canvas);

  let scale = 1;
  let resized = true;
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    scale = renderer.domElement.width / options.viewWidth;
    resized = true;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const t0 = performance.now();
  let raf = 0;
  let lastDraw = 0;
  let lastSignature = NaN;
  let announced = false;
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const signature = layer.signature();
    const changed = signature !== lastSignature || resized;
    if (!changed && (!layer.ambient() || now - lastDraw < 32)) return;
    lastSignature = signature;
    lastDraw = now;
    resized = false;
    layer.update({ time: (now - t0) / 1000, scale });
    renderer.render(layer.scene, layer.camera);
    if (!announced) {
      announced = true;
      options.onState?.(true);
    }
  };

  // run only while the stage is on screen
  const io = new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(raf);
    raf = 0;
    if (entry.isIntersecting) {
      resized = true;
      raf = requestAnimationFrame(tick);
    }
  });
  io.observe(host);

  let dead = false;
  const destroy = () => {
    if (dead) return;
    dead = true;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    canvas.removeEventListener('webglcontextlost', lost);
    layer.scene.traverse((o) => {
      const mesh = o as Three.Mesh;
      mesh.geometry?.dispose();
      (mesh.material as Three.Material | undefined)?.dispose();
    });
    renderer.dispose();
    canvas.remove();
    options.onState?.(false);
  };
  // a lost context is not worth restoring for a decorative layer: fall back to SVG
  const lost = (event: Event) => {
    event.preventDefault();
    destroy();
  };
  canvas.addEventListener('webglcontextlost', lost);

  return destroy;
}
