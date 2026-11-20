# Spanish-language NLP and survey quality at CID Gallup and in parliamentary research

At CID Gallup, I built tools for two recurring decisions in survey research. An analyst reading an open-ended answer needs to decide which ideas to count. A field supervisor reviewing completed interviews needs to decide which records deserve a closer look. The first system uses Spanish-language natural language processing (NLP) to code what people said. The second uses statistical features of the interview process to prioritize audits. In my published research on Panama’s parliamentary proceedings, I used topic models to study a related question at the level of a document collection: which subjects recur, and how does the language used to discuss them change over time?

## Coding open-ended survey responses

A respondent can express several ideas in a sentence and use different words from everyone else who shares the same concern. Consider two illustrative responses to a question about household expenses: *“La comida está carísima”* and *“Ya no alcanza para el supermercado.”* An analyst might count both under food costs. Searching for *comida* would recover only the first. I designed the coding pipeline to use both the respondent’s wording and its meaning, while giving analysts a common set of categories they can inspect.

The pipeline processes an Excel export one survey question at a time. It cleans the responses and uses KeyBERT to extract representative words and phrases. It passes those phrases and the question context to a generative model to propose a codebook, the list of categories used to code that question. Analysts can also supply predefined topics to guide codebook generation. Keeping the question attached matters: a phrase such as *“más seguridad”* can refer to public safety in one questionnaire and job security in another.

Once the codebook exists, the system scores each answer against its candidate categories. Spanish sentence embeddings measure similarity in meaning. BM25 gives weight to shared terms, fuzzy matching compares the wording with category labels, and a Spanish sentiment model supplies an additional signal about tone. The classifier combines these signals with configurable weights. It can assign the highest-ranked category or retain more than one when scores are close, allowing a single answer to contribute to several themes.

For each question, the pipeline exports the processed answers, topic labels, numeric codes, and a binary indicator for each topic, alongside the codebook in the same workbook. An analyst can use those columns to count mentions or compare groups, then return to the original wording to review an ambiguous assignment. The codebook also records what a category meant for that particular question.

## Prioritizing field interviews for audit

For survey quality control, I developed a screening system that ranks completed interviews for review. It reads a survey export, identifies candidate closed-ended questions, and looks for groups of adjacent, nonbinary items that share the same observed response options. It uses those groups to look for *straightlining*, where a respondent selects the same option throughout a question battery.

The system calculates four features for each interview:

| Feature | What the system measures |
| --- | --- |
| Interview duration | Elapsed interview time in minutes. |
| Nonresponse | The share of selected questions recorded as missing, “don’t know,” or “no response.” |
| Response diversity | Shannon entropy of the answer labels used across selected questions. Repeated use of a few labels produces lower entropy. |
| Straightlining | The share of detected batteries in which all valid answers match, with at least two valid answers required. |

For each available feature, the system measures how far the interview lies from the batch average in standard deviations. It uses the absolute distance, caps each contribution at three standard deviations, and averages the scaled contributions. The implementation exports roughly the highest-scoring third of interviews and a second report grouped by interviewer. Reviewers can inspect the individual measurements behind a rank to see whether timing, omissions, repeated answers, or a combination drove the selection.

The one-third selection sets the size of the review queue. Establishing fabrication requires independent evidence, such as a respondent recontact. Questionnaire design also matters when interpreting the features. A legitimate skip can appear as missing, and the same numeric label can carry different meanings across questions. The reports give supervisors a starting point for deciding what to verify.

## Topic modelling in Panama’s parliamentary proceedings

I was first author of *Using Topic Modelling for Analyzing Panamanian Parliamentary Proceedings with Neural and Statistical Methods*, with Gabriel Verbel, José Sánchez, and Javier E. Sánchez-Galán. Published at IEEE CONCAPAN 2022, the study compared two unsupervised methods on a corpus of 2,086 Spanish-language parliamentary texts. We examined whether the methods could recover interpretable subjects from legislative records without requiring researchers to label each text beforehand. [Conference proceedings](https://www.proceedings.com/content/066/066993webtoc.pdf) · [ResearchGate profile](https://www.researchgate.net/profile/Kenji-Contreras) · [Indexed abstract](https://jglobal.jst.go.jp/detail?JGLOBAL_ID=202302211226130953)

Latent Dirichlet allocation (LDA) represents a document as a mixture of topics and characterizes each topic by the words likely to occur in it. BERTopic starts with neural embeddings of documents, reduces their dimensionality, and groups documents in dense regions of that space. These approaches give a reader two ways to explore the same archive: inspect words that tend to occur together, or examine groups of passages that are close in meaning.

Both methods recovered interpretable themes, at different levels of abstraction. We also used BERTopic’s dynamic topic analysis to examine health-related discussion, comparing word frequencies across the corpus with their evolution over time. This gave the study a concrete political-text application: a researcher could follow changes in the vocabulary of a subject even when its broad label stayed the same. We identified model tuning as an avenue for improving topic coherence and interpretation. [Indexed abstract and findings](https://jglobal.jst.go.jp/detail?JGLOBAL_ID=202302211226130953)
