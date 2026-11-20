# Kenji Contreras, freelance AI engineer

Static portfolio site for GitHub Pages, with room for scroll-driven case study animations.

## Stack
| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 7** (static output) | Ships zero JS by default; HTML is pre-rendered, ideal for GitHub Pages. |
| Scroll animation | **GSAP 3 + ScrollTrigger** | Pinning, scrubbing and timelines tied to scroll. All plugins free. |
| Smooth scroll | **Lenis** | Light smooth scroll, driven by GSAP's ticker so triggers stay in sync. |
| Styling | Plain CSS + custom properties | Design tokens in `src/styles/global.css`. |
| Fonts | Fontsource (self-hosted) | Archivo variable; its width axis is expanded for headlines, normal for body. No Google requests. |
| Hosting | GitHub Pages via Actions | `.github/workflows/deploy.yml` builds and deploys on push to `main`. |

## Develop
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
```

## Deploy to GitHub Pages
1. Create a repo (name it `<username>.github.io` for a root URL, or anything else for `<username>.github.io/<repo>`).
2. Push this folder to `main`.
3. In the repo: **Settings → Pages → Source: GitHub Actions**.

The workflow passes the correct `SITE` and `BASE_PATH` automatically, so both URL styles work.

## Edit content
- `src/data/profile.ts`: name, headline, email and links (empty fields are hidden), services, process, about text.
- `src/data/work.ts`: featured case studies and the "more projects" list.
- `src/components/Specimen.astro`: the four input → system → output examples in the hero.
- Photo: save it as `src/assets/kenji.jpg`. It is resized and converted to AVIF/WebP at build time.

## Adding a real scroll animation (scenes)
Each featured case study has a sticky visual stage (`<figure data-scene="…">`) next to its text.
`src/scripts/motion.ts` lazy-loads that case study's scene from `src/scenes/index.ts` when the reader gets close.

1. Create `src/scenes/acoustic.ts`:
   ```ts
   import type { Scene } from './types';
   const scene: Scene = ({ stage, section, gsap, ScrollTrigger }) => {
     const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1 } });
     // build the animation inside `stage` here
     return () => tl.scrollTrigger?.kill();
   };
   export default scene;
   ```
2. In `src/scenes/index.ts`, change `acoustic: placeholder` to `acoustic: () => import('./acoustic').then(m => m.default)`.
3. Put scene data (spectrogram JSON, GeoJSON tracks, image sequences) in `public/scenes/<id>/` and load it inside the scene, so it only downloads when needed.

Planned scenes are described in `visualNote` for each case study in `src/data/work.ts`.

Visitors with *reduce motion* turned on get no smooth scroll and no scenes; the page stays fully readable.

## Scroll stories (`animations/`)
Full-width, scroll-driven case studies live in `animations/`, one folder per research item, with
their own assets, data and docs. `animations/README.md` is the step-by-step procedure for making a
new one. There are four stories, one per project of the CV (`animations/PROJECTS.md` maps projects to
papers, licences and status): `binational-manatees`, `drone-manatees`, `vector-spectra` and
`watermelon-varieties`. Preview pages are listed at `/animations/`; none is on the landing page yet.
A story may add a WebGL light layer drawn with Three.js; it loads on demand and the SVG stage works without it.
