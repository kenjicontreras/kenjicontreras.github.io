/**
 * The WebGL light layer of the vector-spectra story (see _shared/gl-layer.ts).
 *
 * Two things are drawn, each a single draw call, each driven by a number in
 * `GlState` that scene.ts tweens on the story timeline:
 *
 *   flash   the laser pulse hitting the sample                     step 3
 *   points  one point per spectrum (826 + 309), scattered at       steps 6 and 7
 *           first, then gathered into one island per species
 *           (counts are real, positions are illustrative)
 *
 * All positions are in stage units (the SVG viewBox, 800 × 600, y down), so
 * the layer lines up with the SVG underneath. Points are moved in the vertex
 * shader; no per-point work happens in JavaScript after setup.
 */
import { mountLayer, type LayerScene } from '../_shared/gl-layer';
import embedding from './data/embedding.json';

export type GlState = {
  /** brightness of the laser flash */
  flash: number;
  /** how many of the points have appeared */
  show: number;
  /** 0 = scattered, 1 = gathered into islands */
  mix: number;
  /** overall brightness of the points */
  points: number;
};

export type GlInput = {
  /** where the laser hits the sample */
  flashAt: [number, number];
  colors: { mosq: string; tick: string; laser: string };
  onState?: (on: boolean) => void;
};

const PROJECT = /* glsl */ `
  // stage units (y down) to clip space
  vec4 project(vec2 p) {
    return vec4((p.x - 400.0) / 400.0, (300.0 - p.y) / 300.0, 0.0, 1.0);
  }
`;

const rgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function mountGl(host: HTMLElement, state: GlState, input: GlInput) {
  return mountLayer(host, { viewWidth: 800, onState: input.onState }, (THREE): LayerScene => {
    let seed = 100071;
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

    // ── flash: the laser pulse on the sample ────────────────────────────
    const flashMaterial = new THREE.ShaderMaterial({
      ...additive,
      uniforms: {
        uAmount: { value: 0 },
        uAt: { value: new THREE.Vector3(input.flashAt[0], input.flashAt[1], 0) },
        uColor: { value: vec3(input.colors.laser) },
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
        uniform float uAmount;
        uniform vec3 uAt, uColor;
        varying vec2 vP;
        void main() {
          float d = length(vP - uAt.xy);
          float a = uAmount * (exp(-d * 0.045) * 0.7 + exp(-d * 0.012) * 0.16);
          gl_FragColor = vec4(mix(uColor, vec3(1.0), exp(-d * 0.09)) * a, 0.0);
        }
      `,
    });
    const flash = add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), flashMaterial));

    // ── points: one per spectrum ────────────────────────────────────────
    const list = embedding.points;
    const pointsGeometry = new THREE.BufferGeometry();
    {
      const from = new Float32Array(list.length * 3);
      const to = new Float32Array(list.length * 2);
      const seeds = new Float32Array(list.length * 2);
      const family = new Float32Array(list.length);
      list.forEach((p, i) => {
        from.set([p.a[0], p.a[1], 0], i * 3);
        to.set(p.b, i * 2);
        seeds.set([rand(), rand()], i * 2);
        family[i] = p.f === 'm' ? 0 : 1;
      });
      attr(pointsGeometry, 'position', from, 3);
      attr(pointsGeometry, 'aTo', to, 2);
      attr(pointsGeometry, 'aSeed', seeds, 2);
      attr(pointsGeometry, 'aFamily', family, 1);
    }
    const pointsMaterial = new THREE.ShaderMaterial({
      ...additive,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uShow: { value: 0 },
        uMix: { value: 0 },
        uPoints: { value: 0 },
        uMosq: { value: vec3(input.colors.mosq) },
        uTick: { value: vec3(input.colors.tick) },
      },
      vertexShader: /* glsl */ `
        uniform float uTime, uScale, uShow, uMix, uPoints;
        attribute vec2 aTo, aSeed;
        attribute float aFamily;
        varying float vA;
        varying float vFamily;
        ${PROJECT}
        void main() {
          // each spectrum leaves for its island at a slightly different moment
          float t = clamp(uMix * 1.4 - aSeed.x * 0.4, 0.0, 1.0);
          t = t * t * (3.0 - 2.0 * t);
          vec2 p = mix(position.xy, aTo, t);
          float free = 1.0 - t;
          p += free * 3.0 * vec2(sin(uTime * 0.6 + aSeed.y * 40.0), cos(uTime * 0.5 + aSeed.x * 40.0));
          vFamily = aFamily;
          vA = uPoints * smoothstep(aSeed.y * 0.85, aSeed.y * 0.85 + 0.15, uShow);
          gl_PointSize = (4.4 + 1.0 * aSeed.x) * uScale;
          gl_Position = project(p);
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform vec3 uMosq, uTick;
        varying float vA;
        varying float vFamily;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          gl_FragColor = vec4(mix(uMosq, uTick, vFamily) * vA * 0.6 * smoothstep(0.5, 0.36, d), 0.0);
        }
      `,
    });
    const points = add(new THREE.Points(pointsGeometry, pointsMaterial));

    const lit = (v: number) => v > 0.004;
    return {
      scene,
      camera,
      signature: () => state.flash + state.show * 3 + state.mix * 7 + state.points * 11,
      // the points drift a little only while they are still scattered
      ambient: () => lit(state.points) && lit(state.show) && state.mix < 0.999,
      update: ({ time, scale }) => {
        flash.visible = lit(state.flash);
        flashMaterial.uniforms.uAmount.value = state.flash;

        points.visible = lit(state.points) && lit(state.show);
        pointsMaterial.uniforms.uTime.value = time;
        pointsMaterial.uniforms.uScale.value = scale;
        pointsMaterial.uniforms.uShow.value = state.show;
        pointsMaterial.uniforms.uMix.value = state.mix;
        pointsMaterial.uniforms.uPoints.value = state.points;
      },
    };
  });
}
