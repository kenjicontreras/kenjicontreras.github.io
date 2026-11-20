/**
 * The WebGL light layer of the binational-manatees story (see _shared/gl-layer.ts).
 *
 * Five things are drawn, each a single draw call, each driven by a number in
 * `GlState` that scene.ts tweens on the story timeline:
 *
 *   rays    light falling through the shallow water        steps 1 and 9
 *   motes   particles drifting in the water                steps 1, 3 to 7, 9
 *   cloud   30,928 points, one per call, that gather       step 4
 *           into groups (positions are illustrative)
 *   trails  light running along the nine crossing tracks   steps 6 and 7
 *   rain    rain over the Panamanian origin                step 7
 *
 * All positions are in stage units (the SVG viewBox, 800 × 600, y down), so
 * the layer lines up with the SVG underneath. Points are moved in the vertex
 * shader; no per-point work happens in JavaScript after setup.
 */
import { mountLayer, type LayerScene } from '../_shared/gl-layer';

export type GlState = {
  /** light in the shallow water (steps 1 and 9) */
  surface: number;
  /** drifting particles in deep water */
  deep: number;
  /** how far the scene has dived: moves the particles upward */
  travel: number;
  /** how many of the calls have appeared */
  show: number;
  /** 0 = calls mixed in space, 1 = calls gathered into groups */
  mix: number;
  /** grouped calls take the "identified" colour */
  lit: number;
  /** overall brightness of the cloud */
  cloud: number;
  /** drawing progress of the nine tracks, in timeline units */
  trackT: number;
  /** brightness of the track light */
  tracks: number;
  rain: number;
};

export type GlInput = {
  /** group circles from the SVG: centre and radius */
  rings: { x: number; y: number; r: number }[];
  /** area the ungrouped calls fill */
  box: { x: number; y: number; w: number; h: number };
  /** each track as x,y pairs sampled along the SVG path, origin first */
  tracks: Float32Array[];
  /** where the crossings start: the rain falls here */
  origin: [number, number];
  colors: { sage: string; signal: string; onDeep: string };
  onState?: (on: boolean) => void;
};

/** Calls that entered the clustering stage (Guzman et al. 2025, §2.3.6). */
const CALLS = 30928;
const MOTES = 260;
const DROPS = 220;

const PROJECT = /* glsl */ `
  // stage units (y down, z towards the viewer) to clip space, with mild perspective
  vec4 project(vec3 p) {
    float k = 900.0 / (900.0 - p.z);
    return vec4((p.x - 400.0) / 400.0 * k, (300.0 - p.y) / 300.0 * k, 0.0, 1.0);
  }
`;
// soft round sprite; colour is premultiplied and alpha is 0, so it adds light
const SPRITE = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(uColor * vA * smoothstep(0.5, 0.12, d), 0.0);
  }
`;

const rgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function mountGl(host: HTMLElement, state: GlState, input: GlInput) {
  return mountLayer(host, { viewWidth: 800, onState: input.onState }, (THREE): LayerScene => {
    // deterministic, so the picture is the same on every visit
    let seed = 30928;
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

    // ── rays: light through the shallows ────────────────────────────────
    const raysMaterial = new THREE.ShaderMaterial({
      ...additive,
      uniforms: { uTime: { value: 0 }, uAmount: { value: 0 } },
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
        varying vec2 vP;
        void main() {
          float depth = (vP.y - 170.0) / 430.0;           // 0 at the waterline, 1 at the bottom
          if (depth <= 0.0) discard;
          float u = vP.x + (vP.y - 170.0) * 0.38;          // rays lean to the right as they go down
          float bands = sin(u * 0.021 + uTime * 0.11) + sin(u * 0.047 - uTime * 0.07 + 1.7) + sin(u * 0.009 + uTime * 0.05 + 4.0);
          float rays = pow(clamp(bands / 3.0 * 0.5 + 0.5, 0.0, 1.0), 3.0);
          rays *= smoothstep(0.0, 0.05, depth) * pow(1.0 - depth, 1.3);
          float ripple = sin(vP.x * 0.085 + uTime * 0.9 + sin(vP.x * 0.02 + uTime * 0.5) * 2.0) * 0.5 + 0.5;
          float fine = sin(vP.x * 0.31 - uTime * 1.3) * 0.5 + 0.5;
          float shimmer = pow(ripple, 3.0) * (0.55 + 0.45 * fine) * exp(-depth * 30.0);
          float a = uAmount * (rays * 0.34 + shimmer * 0.2);
          gl_FragColor = vec4(vec3(1.0, 0.99, 0.93) * a, 0.0);
        }
      `,
    });
    const rays = add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), raysMaterial));

    // ── motes: particles drifting in the water ──────────────────────────
    const motesGeometry = new THREE.BufferGeometry();
    {
      const position = new Float32Array(MOTES * 3);
      const seeds = new Float32Array(MOTES * 2);
      for (let i = 0; i < MOTES; i++) {
        position.set([rand() * 800, rand() * 640, (rand() - 0.5) * 300], i * 3);
        seeds.set([rand(), rand()], i * 2);
      }
      attr(motesGeometry, 'position', position, 3);
      attr(motesGeometry, 'aSeed', seeds, 2);
    }
    const motesMaterial = new THREE.ShaderMaterial({
      ...additive,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uSurface: { value: 0 },
        uDeep: { value: 0 },
        uTravel: { value: 0 },
        uColor: { value: vec3(input.colors.onDeep) },
      },
      vertexShader: /* glsl */ `
        uniform float uTime, uScale, uSurface, uDeep, uTravel;
        attribute vec2 aSeed;
        varying float vA;
        ${PROJECT}
        void main() {
          vec3 p = position;
          float rise = uTime * (4.0 + 9.0 * aSeed.x) + uTravel * (260.0 + 520.0 * aSeed.x);
          p.y = mod(p.y - rise, 640.0) - 20.0;
          p.x += sin(uTime * 0.35 + aSeed.y * 6.2832) * 9.0;
          float inWater = smoothstep(176.0, 210.0, p.y);
          float edge = smoothstep(-20.0, 30.0, p.y) * (1.0 - smoothstep(560.0, 620.0, p.y));
          vA = (uDeep * 0.26 + uSurface * 0.5 * inWater) * edge * (0.35 + 0.65 * aSeed.y);
          gl_PointSize = (2.2 + 3.2 * aSeed.x) * uScale * (900.0 / (900.0 - p.z));
          gl_Position = project(p);
        }
      `,
      fragmentShader: SPRITE,
    });
    const motes = add(new THREE.Points(motesGeometry, motesMaterial));

    // ── cloud: one point per call ───────────────────────────────────────
    const cloudGeometry = new THREE.BufferGeometry();
    {
      const from = new Float32Array(CALLS * 3);
      const to = new Float32Array(CALLS * 2);
      const seeds = new Float32Array(CALLS * 3);
      const grouped = new Float32Array(CALLS);
      const { box, rings } = input;
      const weights = rings.map((r) => r.r * r.r);
      const total = weights.reduce((a, b) => a + b, 0);
      for (let i = 0; i < CALLS; i++) {
        from.set([box.x + rand() * box.w, box.y + rand() * box.h, (rand() - 0.5) * 420], i * 3);
        seeds.set([rand(), rand(), rand()], i * 3);
        if (rand() < 0.07) {
          // calls the method leaves unassigned stay scattered
          to.set([box.x + rand() * box.w, box.y + rand() * box.h], i * 2);
          continue;
        }
        let pick = rand() * total;
        let k = 0;
        while (k < rings.length - 1 && (pick -= weights[k]) > 0) k++;
        const ring = rings[k];
        // fairly even across the group, a little denser towards the middle
        const radius = Math.sqrt(rand()) * (0.5 + 0.5 * rand()) * (ring.r - 7);
        const angle = rand() * 6.2832;
        to.set([ring.x + Math.cos(angle) * radius, ring.y + Math.sin(angle) * radius], i * 2);
        grouped[i] = 1;
      }
      attr(cloudGeometry, 'position', from, 3);
      attr(cloudGeometry, 'aTo', to, 2);
      attr(cloudGeometry, 'aSeed', seeds, 3);
      attr(cloudGeometry, 'aGroup', grouped, 1);
    }
    const cloudMaterial = new THREE.ShaderMaterial({
      ...additive,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uShow: { value: 0 },
        uMix: { value: 0 },
        uLit: { value: 0 },
        uCloud: { value: 0 },
        uSage: { value: vec3(input.colors.sage) },
        uSignal: { value: vec3(input.colors.signal) },
      },
      vertexShader: /* glsl */ `
        uniform float uTime, uScale, uShow, uMix, uLit, uCloud;
        attribute vec2 aTo;
        attribute vec3 aSeed;
        attribute float aGroup;
        varying float vA;
        varying float vLit;
        ${PROJECT}
        void main() {
          // each call leaves for its group at a slightly different moment
          float t = clamp(uMix * 1.5 - aSeed.x * 0.5, 0.0, 1.0);
          t = t * t * (3.0 - 2.0 * t);
          vec3 p = mix(position, vec3(aTo, 0.0), t);
          float free = 1.0 - uMix * uMix * (3.0 - 2.0 * uMix);
          p.xy += free * 5.0 * vec2(sin(uTime * 0.5 + aSeed.y * 40.0), cos(uTime * 0.43 + aSeed.x * 40.0));
          // while the calls are still mixed, the whole cloud turns slowly in depth
          float a = free * (0.3 + 0.55 * uShow + 0.16 * sin(uTime * 0.3));
          float dx = p.x - 400.0;
          p = vec3(400.0 + dx * cos(a) + p.z * sin(a), p.y, p.z * cos(a) - dx * sin(a));
          float appear = smoothstep(aSeed.y * 0.85, aSeed.y * 0.85 + 0.15, uShow);
          vLit = uLit * aGroup;
          vA = appear * uCloud * mix(0.45, 1.0, aSeed.z) * mix(1.0, mix(0.35, 1.0, aGroup), uLit);
          gl_PointSize = (1.5 + 1.7 * aSeed.z) * uScale * (900.0 / (900.0 - p.z));
          gl_Position = project(p);
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform vec3 uSage, uSignal;
        varying float vA;
        varying float vLit;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          vec3 color = mix(uSage, uSignal, vLit);
          gl_FragColor = vec4(color * vA * mix(0.42, 0.26, vLit) * smoothstep(0.5, 0.1, d), 0.0);
        }
      `,
    });
    const cloud = add(new THREE.Points(cloudGeometry, cloudMaterial));

    // ── trails: light running along the crossing tracks ─────────────────
    const trailsGeometry = new THREE.BufferGeometry();
    {
      const count = input.tracks.reduce((a, t) => a + t.length / 2, 0);
      const position = new Float32Array(count * 3);
      const along = new Float32Array(count * 2);
      let o = 0;
      input.tracks.forEach((track, j) => {
        const n = track.length / 2;
        for (let i = 0; i < n; i++, o++) {
          position.set([track[i * 2], track[i * 2 + 1], 0], o * 3);
          along.set([i / (n - 1), j], o * 2);
        }
      });
      attr(trailsGeometry, 'position', position, 3);
      attr(trailsGeometry, 'aAlong', along, 2);
    }
    const trailsMaterial = new THREE.ShaderMaterial({
      ...additive,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uTrackT: { value: 0 },
        uTracks: { value: 0 },
        uColor: { value: vec3(input.colors.signal) },
      },
      vertexShader: /* glsl */ `
        uniform float uTime, uScale, uTrackT, uTracks;
        attribute vec2 aAlong;   // x: position along the track 0..1, y: track number
        varying float vA;
        ${PROJECT}
        void main() {
          // the same stagger and easing as the SVG line that draws underneath (scene.ts, step 6)
          float p = clamp((uTrackT - aAlong.y * 0.02) / 0.2, 0.0, 1.0);
          p = p < 0.5 ? 2.0 * p * p : 1.0 - 2.0 * (1.0 - p) * (1.0 - p);
          float drawn = 1.0 - smoothstep(p - 0.03, p + 0.002, aAlong.x);
          float head = (1.0 - step(0.995, p)) * smoothstep(p - 0.14, p, aAlong.x);
          // afterwards a pulse of light keeps travelling from Panama to Costa Rica
          float phase = fract(aAlong.x * 1.3 - uTime * 0.1 + aAlong.y * 0.37);
          float pulse = pow(phase, 12.0);
          vA = uTracks * drawn * (0.035 + 0.3 * pulse + 0.3 * head);
          gl_PointSize = (8.0 + 7.0 * max(pulse, head)) * uScale;
          gl_Position = project(position);
        }
      `,
      fragmentShader: SPRITE,
    });
    const trails = add(new THREE.Points(trailsGeometry, trailsMaterial));

    // ── rain over the origin of the crossings ───────────────────────────
    const rainGeometry = new THREE.BufferGeometry();
    {
      const position = new Float32Array(DROPS * 3);
      const seeds = new Float32Array(DROPS * 2);
      for (let i = 0; i < DROPS; i++) {
        position.set([input.origin[0] - 88 + rand() * 96, input.origin[1] + 14, 0], i * 3);
        seeds.set([rand(), rand()], i * 2);
      }
      attr(rainGeometry, 'position', position, 3);
      attr(rainGeometry, 'aSeed', seeds, 2);
    }
    const rainMaterial = new THREE.ShaderMaterial({
      ...additive,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uRain: { value: 0 },
        uColor: { value: vec3(input.colors.onDeep) },
      },
      vertexShader: /* glsl */ `
        uniform float uTime, uScale, uRain;
        attribute vec2 aSeed;
        varying float vA;
        ${PROJECT}
        void main() {
          float fall = fract(aSeed.x + uTime * (0.55 + 0.4 * aSeed.y));
          vec3 p = position;
          p.y += -170.0 + fall * 170.0 + (aSeed.y - 0.5) * 30.0;
          p.x += 10.0 - fall * 10.0;
          vA = uRain * 0.45 * smoothstep(0.0, 0.2, fall) * (1.0 - smoothstep(0.75, 1.0, fall));
          gl_PointSize = 15.0 * uScale;
          gl_Position = project(p);
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform vec3 uColor;
        varying float vA;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float streak = smoothstep(0.05, 0.0, abs(c.x - c.y * 0.06)) * smoothstep(0.5, 0.25, abs(c.y));
          gl_FragColor = vec4(uColor * vA * streak, 0.0);
        }
      `,
    });
    const rain = add(new THREE.Points(rainGeometry, rainMaterial));

    const lit = (v: number) => v > 0.004;
    return {
      scene,
      camera,
      signature: () =>
        state.surface + state.deep * 3 + state.travel * 5 + state.show * 7 + state.mix * 11 + state.lit * 13 +
        state.cloud * 17 + state.trackT * 19 + state.tracks * 23 + state.rain * 29,
      ambient: () => lit(state.surface) || lit(state.deep) || lit(state.tracks) || lit(state.rain) || (lit(state.cloud) && lit(state.show) && state.mix < 0.999),
      update: ({ time, scale }) => {
        rays.visible = lit(state.surface);
        raysMaterial.uniforms.uTime.value = time;
        raysMaterial.uniforms.uAmount.value = state.surface;

        motes.visible = lit(state.surface) || lit(state.deep);
        motesMaterial.uniforms.uTime.value = time;
        motesMaterial.uniforms.uScale.value = scale;
        motesMaterial.uniforms.uSurface.value = state.surface;
        motesMaterial.uniforms.uDeep.value = state.deep;
        motesMaterial.uniforms.uTravel.value = state.travel;

        cloud.visible = lit(state.cloud) && lit(state.show);
        cloudMaterial.uniforms.uTime.value = time;
        cloudMaterial.uniforms.uScale.value = scale;
        cloudMaterial.uniforms.uShow.value = state.show;
        cloudMaterial.uniforms.uMix.value = state.mix;
        cloudMaterial.uniforms.uLit.value = state.lit;
        cloudMaterial.uniforms.uCloud.value = state.cloud;

        trails.visible = lit(state.tracks);
        trailsMaterial.uniforms.uTime.value = time;
        trailsMaterial.uniforms.uScale.value = scale;
        trailsMaterial.uniforms.uTrackT.value = state.trackT;
        trailsMaterial.uniforms.uTracks.value = state.tracks;

        rain.visible = lit(state.rain);
        rainMaterial.uniforms.uTime.value = time;
        rainMaterial.uniforms.uScale.value = scale;
        rainMaterial.uniforms.uRain.value = state.rain;
      },
    };
  });
}
