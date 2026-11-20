# Storyboard: survey-nlp

Three separate projects in one story, each step labelled with its project (`part`) and a project bar at the top of the stage from step 2.
Project 1, parliament topics (research, steps 2–4) · Project 2, open answers (CID Gallup, steps 5–6) · Project 3, interview audits (CID Gallup, steps 7–9).

Spine: three projects, one thread → 2,086 parliament texts → two topic models → a health topic
over time → one codebook per question → four signals per answer → entropy → four features, one score
→ top third to review. Nothing is shown under the stage.

| # | Headline | Stage (layers) | Motion | Data and assets |
|---|---|---|---|---|
| 1 | Three projects, one thread | `overview` cream: three numbered cards (proceedings, form, field hero); `ov-thread` arrow from card 1 to card 2, then 3 ("built on it", "then") | the thread appears | all three heroes |
| 2 | What does a parliament talk about? | `archive` cream: proceedings hero, counter, 2,086 tiles | tiles reveal row by row with the counter | `proceedings-stack.svg`, `topics.json` |
| 3 | Two ways to find a topic | `night`; `lda` three word bags; `bert` points gather into three clusters and grey noise | bags appear; points move from scattered to clustered; totals | `topics.json` (words real, points illustrative) |
| 4 | Language that changes over time | `dtm`: the health cluster spreads along a timeline; words rise in their half | other clusters fade; points slide; words rise | `topics.json` |
| 5 | What did people say? | `code` cream: question, five answer cards, phrase chips, codebook | answers, then chips, then codebook rows | invented answers |
| 6 | Four checks, one theme | `score` dark: answer, four signal rows, weighted bars, workbook | rows fill, bars grow, one row of the sheet lights | illustrative bars |
| 7 | Which interviews deserve a second look? | `ent`: scale legend, two respondents' dots, histograms, bits, formula | dots, then bars, then counters; B gets the straightlining tag | `entropy.json` |
| 8 | Four warning signs, one ranking | `rank`: four strips of 60 dots by z, then the score row; top third amber | dots slide in; outliers ringed; score row; amber | `batch.json` |
| 9 | What it is for | `queue` cream: top rows with reason bars; field hero; by-interviewer bars | rows enter; bars grow | `batch.json`, `field-interview.svg` |

No light layer.

`pbar` (all steps from 2): three pills aligned with the overview cards; `pb-on` highlights project 1 at step 2, 2 at step 5, 3 at step 7.

Legibility pass (2026-11-19): every Spanish word on the stage from the paper has an English gloss under it (steps 3 and 4); keys say what a dot is (a passage in 3 and 4, an interview in 8, with "unusual" for the ringed ones); column labels in 5 ("answers", "key phrases"), 6 ("match with each theme") and 7 ("how often each answer"); the review-priority axis in 8 is scaled to the batch's highest score; step 9 labels the score column and the cut-off line, and counts read "6 of 12".
