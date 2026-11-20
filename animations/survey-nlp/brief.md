# Brief: survey-nlp

## Sources and licence
- **Paper (public):** Contreras, Verbel, Sánchez, Sánchez-Galán 2022, *Using Topic Modelling for
  Analyzing Panamanian Parliamentary Proceedings with Neural and Statistical Methods*, IEEE CONCAPAN
  XL 2022. © IEEE. Kenji is first author. No figure is reused; everything on the stage is drawn.
- **CID Gallup work (confidential):** described only by `../nlp/nlp_systems.md`, which Kenji wrote
  from his notebooks. **Nothing about CID Gallup on the stage or in the copy goes beyond that file**:
  no model or vendor names except Gemini, which drafts the codebook (named in the step 5 hood at Kenji's request, 2026-11-19), no weights, no client, no questionnaire, no real answers or counts.
- **Political-poll examples:** invented for the story at Kenji's request (generic opinion poll; no
  real parties, people, results or CID Gallup questions).

## Audience
Non-technical clients (pollsters, research teams, NGOs) who should see a product; technical readers
who should see that the product rests on peer-reviewed NLP and simple, explainable statistics.

## One-sentence message
Three separate projects with one thread, finding patterns in what people say: published research on
parliament topics, then two tools for a pollster, one that sorts open answers into themes and one that
ranks interviews for a second look.

## What a lay reader leaves with
- Open answers can be counted without losing the respondent's words.
- "Entropy" is a plain idea: how varied someone's answers are. It becomes a ranked review list a
  supervisor can act on.
- The tool says why an interview was flagged and does not accuse anyone.

## What a technical reader notices
LDA vs BERTopic on 2,086 texts with Cv evaluation; KeyBERT + LLM codebook with question context;
hybrid scoring (embeddings, BM25, fuzzy, sentiment) with multi-label output; Shannon entropy,
battery detection, capped |z| composite, top-third queue.

## Author's role
First author of the paper. Designed and built both CID Gallup systems. Story in the first person.

## Fact sheet

| Fact | Value | Source |
|---|---|---|
| Corpus | 2,086 Spanish texts | paper, abstract and §II |
| Collected before filtering | 2,791 documents (empty sessions removed by hand) | §II.A |
| Period | 2005 to early 2020 | §II.A |
| LDA | tested 1 to 20 topics; best coherence below 0.20 at 17 topics | §IV.A |
| BERTopic | 33 topics (noise excluded); coherence above 0.45 at diversity 0.5 | §IV.A |
| Coherence measure | Cv, 0 to 1 | §III.C |
| BERTopic stages | Spanish BERT embeddings → UMAP → HDBSCAN → c-TF-IDF; MMR for diversity | §III.B–C |
| LDA word bags shown | salud, médico, caja · transporte, ambiente, ambiental · electoral, partido, político | Table I |
| BERTopic words shown | radiología, dietilenglicol · asuntos indígenas, tierra colectivo · plenipotenciario, diplomático | Table I |
| Dynamic topic: health | first half: "salud pública", "cirugía"; second half: "dietilenglicol", "río (La) Villa", "humo" | §IV.B |
| Dynamic topic method | c-TF-IDF per timestep, global or evolutionary | §III.B.6 |
| Codebook pipeline | Excel export, one question at a time; cleaning; KeyBERT phrases; generative model with question context proposes a codebook; predefined topics optional | md |
| Classifier signals | Spanish sentence embeddings (meaning), BM25 (shared terms), fuzzy matching (wording vs labels), Spanish sentiment (tone); configurable weights; top category or several when close | md |
| Outputs | processed answers, topic labels, numeric codes, a binary column per topic, codebook in the same workbook | md |
| Audit features | duration (minutes); nonresponse share (missing, don't know, no response); Shannon entropy of answer labels; straightlining share of detected batteries (≥2 valid answers, all equal) | md |
| Batteries | adjacent, nonbinary items sharing the same observed options | md |
| Score | absolute distance from batch mean in SD, capped at 3, scaled, averaged | md |
| Queue | roughly the top third, plus a report by interviewer | md |
| Entropy formula | H = −Σ p log₂ p; base 2 confirmed in the notebook | md + notebook |
| Max entropy, 5 options | log₂ 5 = 2.32 bits | arithmetic |
| Respondent A / B | 2.24 bits / 0 bits | illustrative, `data/entropy.json` |
| Batch | 60 interviews, 19 to review | illustrative, `data/batch.json` |

## Care points
- The audit score **prioritises**; it never proves fabrication (md: recontact needed). Say "a queue,
  not a verdict".
- Legitimate skips can look like nonresponse; the same numeric label can mean different things
  across questions (md).
- The paper says themes were interpretable "despite not achieving very high coherence scores";
  never call 0.45 "high accuracy".
- Signal values in step 6 are drawn as bars without numbers: illustrative.
- The years of the health words are not given in the paper; show only "first half" and "second half".
- Keep CID Gallup to what the md says. The weights in the code and the model names are not shown.
