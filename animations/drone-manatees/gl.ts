/**
 * The WebGL light layer of the drone-manatees story (see _shared/gl-layer.ts).
 *
 * Three things are drawn, each a single draw call, each driven by a number in
 * `GlState` that scene.ts tweens on the story timeline:
 *
 *   glitter  sun glitter on the water            steps 1 and 8 (faint on the drawn photo, 4 and 5)
 *   scan     glow of the tile being read         step 5
 *   trail    light along the flight route        step 3
 *
 * All positions are in stage units (the SVG viewBox, 800 × 600, y down), so
 * the layer lines up with the SVG underneath. Nothing here carries meaning by
 * itself: the SVG stage is complete without it.
 */
import { mountLayer, type LayerScene } from '../_shared/gl-layer';

export type GlState = {
  /** sun glitter over the daylight scene */
  sun: number;
  /** faint glitter inside the drawn photo */
  photo: number;
  /** brightness of the scan glow */
  scan: number;
  /** offset of the tile being read from the first tile, in stage units */
  scanX: number;
  scanY: number;
  /** brightness of the route light */
  trail: number;
  /** how much of the route has been flown, 0 to 1 */
  trailT: number;
};

export type GlInput = {
  /** the flight route as x,y pairs sampled along the SVG path */
  route: Float32Array;
  /** the first tile: top-left corner and size */
  tile: { x: number; y: number; size: number };
  /** the drawn photo */
  photo: { x: number; y: number; w: number; h: number };
  /** daylight glitter only appears below this y (the shore is above it) */
  waterline: number;
  colors: { glare: string; find: string; on: string };
  onState?: (on: boolean) => void;
};

const GLINTS = 520;

const PROJECT = /* glsl */ `
  // stage units (y down) to clip space
  vec4 project(vec2 p) {
    return vec4((p.x - 400.0) / 400.0, (300.0 - p.y) / 300.0, 0.0, 1.0);
  }
`;
// soft round sprite; colour is premultiplied and alpha is 0, so it adds light
const SPRITE = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(uColor * vA * smoothstep(0.5, 0.08, d), 0.0);
  }
`;

const rgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function mountGl(host: HTMLElement, state: GlState, input: GlInput) {
  return mountLayer(host, { viewWidth: 800, onState: input.onState }, (THREE): LayerScene => {
    let seed = 9040230;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera(); // unused: shaders project stage units themselves
    const additive = {
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
    } as const;
    const vec3 = (hex: string) => new THREE.Vector3(...rgb(hex));
    const attr = (geometry: InstanceType<typeof THREE.BufferGeometry>, name: string, data: Float32Array, size: number) =>
      geometry.setAttribute(name, new THREE.BufferAttribute(data, size));
    const add = (object: InstanceType<typeof THREE.Object3D>) => {
      object.frustumCulled = false;
      scene.add(object);
      return object;
    };

    // ── glitter: points that flash as small waves catch the sun ─────────
    const glitterGeometry = new THREE.BufferGeometry();
    {
      const position = new Float32Array(GLINTS * 3);
      const seeds = new Float32Array(GLINTS * 3);
      for (let i = 0; i < GLINTS; i++) {
        position.set([rand() * 800, rand() * 600, 0], i * 3);
        seeds.set([rand(), rand(), rand()], i * 3);
      }
      attr(glitterGeometry, 'position', position, 3);
      attr(glitterGeometry, 'aSeed', seeds, 3);
    }
    const { photo } = input;
    const glitterMaterial = new THREE.ShaderMaterial({
      ...additive,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uSun: { value: 0 },
        uPhoto: { value: 0 },
        uWaterline: { value: input.waterline },
        uBox: { value: new THREE.Vector3(photo.x, photo.y, photo.x + photo.w) },
        uBoxBottom: { value: photo.y + photo.h },
        uColor: { value: vec3(input.colors.glare) },
      },
      vertexShader: /* glsl */ `
        uniform float uTime, uScale, uSun, uPhoto, uWaterline, uBoxBottom;
        uniform vec3 uBox;
        attribute vec3 aSeed;
        varying float vA;
        ${PROJECT}
        void main() {
          vec2 p = position.xy;
          p.x += sin(uTime * 0.2 + aSeed.y * 6.2832) * 6.0;
          // each point flashes briefly, at its own rhythm
          float flash = pow(max(0.0, sin(uTime * (0.6 + 1.5 * aSeed.x) + aSeed.z * 6.2832)), 14.0);
          // the glitter gathers in a broad sun path that drifts across the lake
          float path = exp(-pow((p.x - 430.0 - 60.0 * sin(uTime * 0.05)) / 300.0, 2.0));
          float day = uSun * smoothstep(uWaterline, uWaterline + 50.0, p.y) * (0.35 + 0.65 * path);
          float inside = step(uBox.x + 6.0, p.x) * step(p.x, uBox.z - 6.0) * step(uBox.y + 6.0, p.y) * step(p.y, uBoxBottom - 6.0);
          float frame = uPhoto * inside * 0.3;
          vA = flash * max(day, frame) * (0.5 + 0.5 * aSeed.y);
          gl_PointSize = (3.0 + 5.0 * aSeed.x) * uScale;
          gl_Position = project(p);
        }
      `,
      fragmentShader: SPRITE,
    });
    const glitter = add(new THREE.Points(glitterGeometry, glitterMaterial));

    // ── scan: a soft glow on the tile the model is reading ──────────────
    const scanMaterial = new THREE.ShaderMaterial({
      ...additive,
      uniforms: {
        uTime: { value: 0 },
        uAmount: { value: 0 },
        uTile: { value: new THREE.Vector3(input.tile.x, input.tile.y, input.tile.size) },
        uColor: { value: vec3(input.colors.find) },
      },
      vertexShader: /* glsl */ `
        varying vec2 vP;
        void main() {
          vP = vec2(position.x * 400.0 + 400.0, 300.0 - position.y * 300.0);
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform float uTime, uAmount;
        uniform vec3 uTile, uColor;
        varying vec2 vP;
        void main() {
          vec2 c = uTile.xy + uTile.z * 0.5;
          vec2 q = abs(vP - c) - uTile.z * 0.5;       // > 0 outside the tile
          float outside = length(max(q, 0.0));
          float inside = -min(max(q.x, q.y), 0.0);
          float halo = exp(-outside * 0.07) * step(0.0, max(q.x, q.y));
          float rim = exp(-inside * 0.16) * (1.0 - step(0.0, max(q.x, q.y)));
          // a line of light sweeps down the tile while it is read
          float sweep = (1.0 - step(0.0, max(q.x, q.y))) * exp(-abs(vP.y - (uTile.y + fract(uTime * 1.6) * uTile.z)) * 0.14);
          float a = uAmount * (halo * 0.34 + rim * 0.22 + sweep * 0.16);
          gl_FragColor = vec4(uColor * a, 0.0);
        }
      `,
    });
    const scan = add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), scanMaterial));

    // ── trail: light along the part of the route already flown ──────────
    const trailGeometry = new THREE.BufferGeometry();
    {
      const n = input.route.length / 2;
      const position = new Float32Array(n * 3);
      const along = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        position.set([input.route[i * 2], input.route[i * 2 + 1], 0], i * 3);
        along[i] = i / (n - 1);
      }
      attr(trailGeometry, 'position', position, 3);
      attr(trailGeometry, 'aAlong', along, 1);
    }
    const trailMaterial = new THREE.ShaderMaterial({
      ...additive,
      uniforms: {
        uScale: { value: 1 },
        uTrail: { value: 0 },
        uTrailT: { value: 0 },
        uColor: { value: vec3(input.colors.on) },
      },
      vertexShader: /* glsl */ `
        uniform float uScale, uTrail, uTrailT;
        attribute float aAlong;
        varying float vA;
        ${PROJECT}
        void main() {
          float flown = 1.0 - step(uTrailT, aAlong);
          float head = smoothstep(uTrailT - 0.06, uTrailT, aAlong) * flown;
          vA = uTrail * flown * (0.045 + 0.1 * head);
          gl_PointSize = (7.0 + 5.0 * head) * uScale;
          gl_Position = project(position.xy);
        }
      `,
      fragmentShader: SPRITE,
    });
    const trail = add(new THREE.Points(trailGeometry, trailMaterial));

    const lit = (v: number) => v > 0.004;
    return {
      scene,
      camera,
      signature: () =>
        state.sun + state.photo * 3 + state.scan * 5 + state.scanX * 0.007 + state.scanY * 0.011 + state.trail * 13 + state.trailT * 17,
      ambient: () => lit(state.sun) || lit(state.photo) || lit(state.scan),
      update: ({ time, scale }) => {
        glitter.visible = lit(state.sun) || lit(state.photo);
        glitterMaterial.uniforms.uTime.value = time;
        glitterMaterial.uniforms.uScale.value = scale;
        glitterMaterial.uniforms.uSun.value = state.sun;
        glitterMaterial.uniforms.uPhoto.value = state.photo;

        scan.visible = lit(state.scan);
        scanMaterial.uniforms.uTime.value = time;
        scanMaterial.uniforms.uAmount.value = state.scan;
        scanMaterial.uniforms.uTile.value.set(input.tile.x + state.scanX, input.tile.y + state.scanY, input.tile.size);

        trail.visible = lit(state.trail);
        trailMaterial.uniforms.uScale.value = scale;
        trailMaterial.uniforms.uTrail.value = state.trail;
        trailMaterial.uniforms.uTrailT.value = state.trailT;
      },
    };
  });
}
