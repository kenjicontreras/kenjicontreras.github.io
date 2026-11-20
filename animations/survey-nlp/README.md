# survey-nlp

Scroll story for the CV project "Natural Language Processing concepts applied to survey data analysis
at CID Gallup". Three separate projects told as one story (Kenji's request, 2026-11-18): an overview, then Project 1
parliament topics (research; steps 2–4), Project 2 open answers (CID Gallup; steps 5–6), Project 3
interview audits (CID Gallup; steps 7–9). Each step carries a `part` label (new optional field in
`_shared/types.ts`, shown beside the step count) and the stage has a project bar from step 2.

- **Sources:** Contreras, Verbel, Sánchez, Sánchez-Galán 2022, IEEE CONCAPAN (© IEEE, first author;
  nothing reused, all drawn) and `../nlp/nlp_systems.md` for the CID Gallup tools.
- **Confidentiality rule:** nothing about CID Gallup goes beyond `nlp_systems.md`: no model or vendor
  names, no weights, no client, questionnaire, answers or counts. Every poll example is invented
  (a generic political opinion poll, at Kenji's request).
- **Preview:** `npm run dev`, then <http://localhost:4321/animations/survey-nlp> (`?step=7` jumps to a step).
- **Scene key:** `surveynlp` in `src/scenes/index.ts`.
- **On the landing page** (2026-11-18) as tab 5, "Text and survey analysis" (`src/data/work.ts`, `ProjectTabs.astro`); the skills Machine learning, Generative AI and automation, and Applied research link to it (`src/data/profile.ts`).
- First person: Kenji is first author of the paper and built both tools.

## What is real, digitised or illustrative

| Item | Status |
|---|---|
| 2,086 texts, 2005–2020, 17 / 33 topics, coherence, topic words, health words by half | real: the paper (`brief.md` fact sheet) |
| Positions of the BERTopic points and the 2,086 tiles | illustrative (one tile per text is a real count) |
| Poll question, answers, codebook, the trust battery, respondents A and B | invented |
| Entropy values 2.24 and 0 bits | computed exactly from the invented answers (`data/entropy.json`) |
| Signal and weighted-mix bars of step 6 | illustrative, no numbers shown |
| 60 interviews, z-scores, scores, the top 19, the by-interviewer counts | synthetic batch scored with the md's formulas (`tools/make-data.mjs`, seeded) |
| Drawings | own work, made for this story |

## Files

`brief.md` (fact sheet, care points) · `storyboard.md` · `style.md`, `tokens.css` (`--sn-*`) ·
`content.ts` · `Stage.astro` · `scene.ts` (no WebGL layer) · `data/*.json` · `tools/make-data.mjs`
(regenerates all three data files) · `assets/svg/` (3 hero drawings, 10 icons, `doc-mini.svg` unused).

## Open points

- The paper's PDF was read from an Outlook attachment that has since left the cache; put a copy in
  `resources/papers/contreras-2022-concapan-topic-modelling.pdf`. The source link points to the
  J-GLOBAL indexed abstract; replace with the IEEE Xplore DOI if Kenji has it.
- "Costo de vida" is used instead of "costo de la vida" so it fits the codebook card.
- 2026-11-18: copy rewritten for non-technical readers at Kenji's request (method names, SD, bits and "straightlining" moved to "Under the hood"; the stage shows a variety meter instead of bits).
