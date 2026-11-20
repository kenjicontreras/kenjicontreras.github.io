# Animations

Scroll-driven stories that turn one research item into a section of the landing page.
Each story is a self-contained folder: its brief, storyboard, style, copy, data, assets, the tools
that made the assets, and the code. `_shared/` holds what every story reuses; `_template/` is the
starting point for a new one.

```
animations/
  _shared/      ScrollStory.astro (layout) · story.ts (timeline + scroll logic) · types.ts (content model)
                gl-layer.ts + three-lite.ts (optional WebGL light layer, Three.js)
  _template/    copy this folder to start a story
  _tools/       scripts to look at a story before it ships (screenshots, scroll-back test, timing)
  binational-manatees/   Guzman et al. 2025: manatees identified by voice across a border
  drone-manatees/        Sanchez-Galan et al. 2025: manatees found in drone photos
  vector-spectra/        Merchan et al. 2023: mosquitoes and ticks named from mass spectra
  watermelon-varieties/  Contreras et al. 2022: watermelon varieties told apart from photos
  survey-nlp/            three projects: parliament topics (CONCAPAN 2022), open answers and interview audits (CID Gallup)
  PROJECTS.md   which CV project, papers and licence each story belongs to
```

A story is: a **stage** that stays in view (one SVG, drawn at build time) and **steps** of text that
scroll past it. Each step owns one unit of a single GSAP timeline, so the picture always matches the
text beside it, forwards and backwards. The site's existing scene loader (`src/scripts/motion.ts`)
loads the story's code only when the reader gets near it.

## How to make a new story

Work through these in order. Steps 1 to 4 are thinking and writing; do not open an SVG editor before
the storyboard exists.

### 1. Read the source and write the brief (`brief.md`)
- Read the paper in full. Note the one result a stranger would repeat to someone else.
- Fill in: source and licence, audience, **one-sentence message**, what a lay reader should leave
  with, what a technical reader should notice, and the author's actual role.
- Build the **fact sheet**: every number you might show, its exact value and where it is in the
  paper. Add a "care points" list for anything the paper hedges (for example "presumed individuals").
- Optional grounding with NotebookLM (`notebooklm` skill): create a notebook with the paper as the
  only source, ask it to list each figure with its section, and compare with your fact sheet. Use it
  for fact-checking, a key-figures table, a mind map and a plain-language draft. Do not expect
  animation assets from it: its images are flat PNGs with baked-in text. See
  `binational-manatees/tools/notebooklm.sh` for a script to adapt.

### 2. Write the storyboard (`storyboard.md`)
- **5 to 9 steps, one idea each.** Give a transformation that needs time to read (data turning into a result) a step of its own rather than squeezing it into the end of another. A good default arc: problem → how data was collected → scale →
  what the system does (one or two steps) → finding → consequence.
- For each step write: a headline, a plain message of 35 words or fewer, **one number**, and one
  **"Under the hood"** line (method, parameters, validation) for technical readers. Two or three
  short `points` per step (each traced in the brief) fill the text column beside the stage without
  adding paragraphs.
- If the authors have already published a plain-language summary (a press release, a social
  carousel), **follow its order, headlines and numbers**: it is the version they signed off.
  Add paper-only detail sparingly, and cut anything incidental.
- Find the **spine**: the handful of headline numbers the whole piece builds up (here, from
  1.9 million audio files to nine animals and a 984 km corridor). Show it under the stage.
- For each step, describe the picture and the change, and list the data and assets it needs.

### 3. Define the style (`style.md`, `tokens.css`)
- Start from the site tokens in `src/styles/global.css`. Add at most 8 to 10 story colours, sampled
  from the reference material, and give each **one job**.
- Any colour that tells categories apart must pass the dataviz skill's validator on every surface
  it appears on:
  `node <dataviz-skill>/scripts/validate_palette.js "#hex,#hex" --mode dark --surface "#0b2230"`
- Fix the stage geometry (viewBox 800 × 600, minimum label size 22 units) and, if there is a map, the
  projection formula, so separately made assets line up.

### 4. Write the copy and data (`content.ts`, `data/`)
- All text and numbers go in `content.ts` (type `StoryContent`). Nothing is hard-coded in the stage
  except short labels.
- Every file in `data/` starts with a `status` line saying whether it is **real**, **digitised**
  from a figure, or **illustrative**.

### 5. Make the assets (`assets/`, `tools/`)
- Illustrations: hand-written SVG that follows the "SVG asset rules" in `style.md`
  (`currentColor`, no ids, no styles, small).
- Figures from an open-access paper may be cropped and recoloured with attribution; keep the script
  in `tools/` so the result can be regenerated. Third-party artwork (social posts, stock) is
  reference only and stays in `resources/`.
- Asset work is independent, so it can be delegated to subagents in parallel (illustration, map,
  figure extraction). Give each one `style.md`, exact file names and view boxes, a size budget, and
  an instruction to **render the result and look at it** before reporting. Review every result
  yourself.

### 6. Build the stage and the scene (`Stage.astro`, `scene.ts`)
- `Stage.astro` draws every layer at build time and tags it `data-l="name"`. Layers that appear
  later get `class="off"`. The first frame must work as a still image: it is what readers see with
  JavaScript off.
- `scene.ts` is one call to `createStory(ctx, (tl, { $, at }) => { … })`. Put each step's tweens at
  `at(k, fraction)`; keep the change inside the first ~60 % of the step.
- Counters: tween a plain object and write `textContent` in `onUpdate`, so scrolling back works.
- Looping details are CSS animations, never timeline tweens.
- HTML under the stage (legends, number strips) can react to progress: give an element `data-from="k"`
  and it receives the class `is-on` once step k has mostly played.

### 7. Register and preview
- Add one line to `src/scenes/index.ts`:
  `mystory: () => import('../../animations/my-story/scene').then((m) => m.default),`
- Add a preview page `src/pages/animations/my-story.astro` (copy the existing one).
- `npm run dev`, open `/animations/my-story`. `?step=3` jumps to a step.

### 8. Check before it goes on the landing page
- [ ] Every number in `content.ts` has a row in the fact sheet.
- [ ] Each step reads correctly with the stage hidden, and the stage reads with the text hidden.
- [ ] Desktop (1440 px) and phone (390 px): no clipped or overlapping labels at any step.
- [ ] Layout is compact: the stage fills the space beside the text, and no step leaves more than
      about a third of the screen empty.
- [ ] Reduced motion: the stage jumps between end states, nothing tweens or loops.
- [ ] Scroll backwards through the whole story: every step restores cleanly.
- [ ] If the story has a light layer: it still reads correctly with `?nogl` in the URL, and the
      layer is absent under reduced motion.
- [ ] Credit line (shown once, in the story footer) names every third-party source and says what is illustrative.
- [ ] `npm run build` passes; story images total under 400 KB.

### Tools for step 8 (`_tools/`)

All need Python with `playwright` (and its Chromium) and Pillow, and the dev server running
(`npx astro dev --background`; stop it with `npx astro dev stop`).

```
python3 animations/_tools/shots.py <story-id> <outdir> 1440 900            # one full-page shot per step
python3 animations/_tools/shots.py <story-id> <outdir> 390 844             # phone
python3 animations/_tools/shots.py <story-id> <outdir> 1280 720 --reduce   # reduced motion
python3 animations/_tools/shots.py <story-id> <outdir> 1440 900 --stage --fractions 0.4,0.97   # stage only, mid-step and end, WebGL on
python3 animations/_tools/shots.py <story-id> <outdir> 1440 900 --stage --suffix '?nogl'       # SVG fallback
python3 animations/_tools/sheet.py <outdir> s1,s2,s3,s4 <out.png> 2        # join shots into one image to look at
python3 animations/_tools/scrollback.py <story-id> <layer,layer,...>       # scroll to the end and back; every layer must restore
python3 animations/_tools/perf.py <story-id>                               # frame timing with and without the light layer
python3 animations/_tools/render-svg.py <out.png> '<background>' <file.svg> ...   # look at SVG assets large and small
```

Look at every image. The scripts only say that nothing crashed; clipped labels, collisions and
empty space are found by eye.

### Licences decide what can be shown

- **CC BY** (most open-access journals): figures may be cropped, recoloured and redrawn with
  credit. Real photographs and digitised maps make a story more convincing than drawings.
- **CC BY-NC-ND**: no adapted figures on a commercial page. Quote facts (numbers, species lists)
  and draw everything else; say in the credit line that the drawings are illustrative.
- **Publisher copyright (IEEE and similar)**: authors may usually reuse portions of their own
  paper with the copyright notice. Keep it to what a drawing cannot replace, and record it in
  the story README so it can be confirmed.

### 9. Put it on the landing page
The landing page shows the stories as tabs (`src/components/ProjectTabs.astro`), one story
mounted at a time. To add one:

1. Add an entry to `projects` in `src/data/work.ts`: the story id, a short tab label and its
   scene key.
2. In `ProjectTabs.astro`, import its `Stage` and `content` and add them to `stories`.

The tab controller mounts the scene when its tab opens and calls the scene's cleanup when another
tab opens, then restores the stage's original markup, so a story always restarts at step 1.
Scenes inside `[data-tabs]` are skipped by `src/scripts/motion.ts` and by the reduced-motion
script in `ScrollStory.astro`. Inside the tabs `--header-h` includes the sticky tab bar, so the
stage pins below it. `#<story-id>` in the URL opens that tab.

## Optional: a light layer in WebGL (`_shared/gl-layer.ts`)

A story can lay ONE Three.js canvas over its SVG stage to draw what SVG is poor at: tens of
thousands of points, glow, moving water, rain. `binational-manatees/gl.ts` is the worked example.

Rules that keep it cheap and keep the story readable:

- **Light only.** Shaders write premultiplied colour with zero alpha, so the canvas adds light on
  top of the SVG. Text, maps and icons stay in the SVG. Never put text or shapes that carry meaning
  on the canvas alone.
- **The SVG stage must be complete without it.** The layer is skipped for reduced motion, data
  saver, missing WebGL and `?nogl`, and it removes itself if the context is lost. If the layer
  replaces SVG marks (the manatee story hides its stand-in dots), hide them with a
  `[data-gl]` selector that the layer's `onState` callback toggles.
- **State lives on the story timeline.** `scene.ts` owns a plain object of numbers (`glow`) and
  tweens it like any other target; the layer only reads it. Tween it whether or not the layer
  exists, so the layer can join at any moment.
- **Stage units.** Positions are the SVG viewBox units (y down); the shared `project()` shader
  function maps them to the screen, so the layer lines up with the SVG at every size. Read
  positions from the SVG itself (circle centres, `getPointAtLength`) rather than repeating numbers.
- **Move points in the vertex shader.** Give each point its start and end as attributes and blend
  with a uniform. No per-point JavaScript after setup.
- **One draw call per effect, no post-processing.** Glow is a soft additive sprite, not bloom.
- **Let the layer decide when to draw.** `gl-layer.ts` draws at full rate only while the state is
  changing, at ~30 fps for self-running motion (`ambient()`), and not at all when nothing is lit
  or the stage is off screen. Pixel density is capped at 1.5.
- **Download.** Three.js loads on demand and only the classes named in `three-lite.ts` (about
  128 KB compressed). Add a class there when a new layer needs it.

## How the scroll logic works (`_shared/story.ts`)

- An **anchor line** sits at a fraction of the viewport height (`--story-anchor` in
  `ScrollStory.astro`: 0.56 on desktop, 0.86 on phones, where the stage is pinned to the top).
  Steps are top-aligned and about half a screen tall, so the active step's text sits beside the
  stage and the next step is already visible below it.
- A step's progress is how far its box has passed that line (0 to 1). The timeline time is the sum
  of all step progresses, so step k plays over the time span k−1 … k.
- Step 1 waits until the stage is within a third of a screen of its pinned position, so its
  change is never played while the stage is still mostly out of view.
- Normal motion: the timeline eases toward the target time. Reduced motion: it jumps to the end
  state of the active step.
