// All copy and numbers for the story. Every figure is traced in brief.md.
// The CID Gallup part stays within ../nlp/nlp_systems.md; poll examples are invented.
// Written for non-technical clients: plain words in the text, method names only "under the hood".
// Three separate projects, told in sequence; `part` labels each step with its project.
import type { StoryContent } from '../_shared/types';

const P1 = 'Project 1 · Parliament topics';
const P2 = 'Project 2 · Open answers';
const P3 = 'Project 3 · Interview audits';

export const content: StoryContent = {
  id: 'survey-nlp',
  title: 'Finding patterns in what people say, from parliament to survey research',
  meta: 'Universidad Tecnológica de Panamá, 2022 · CID Gallup, 2024 to 2026',
  steps: [
    {
      title: 'Three projects, one thread',
      body: 'All three find patterns in what people say. It began with my published research on Panama’s parliament. At CID Gallup, a polling and market research firm working across Latin America, I built on it for a tool that sorts open survey answers, then a second one that checks survey interview quality.',
      points: [
        'Project 1 is published research. Projects 2 and 3 are tools I built for survey analysts and field supervisors.',
        'The survey data at CID Gallup is confidential, so every survey example here is invented.',
      ],
    },
    {
      part: P1,
      title: 'What does a parliament talk about?',
      body: 'In my published research, I used machine learning to identify the topics debated in Panama’s National Assembly over fifteen years, directly from the transcripts and without labelling them by hand first.',
      points: [
        'Spanish political language, full of local expressions, is harder for tools built mostly for English.',
        'I collected 2,791 documents and kept the 2,086 that recorded actual debate.',
      ],
      stat: { value: '2,086', label: 'parliamentary texts, 2005 to 2020' },
      hood: 'Scraped from the Assembly website; extracted, cleaned and lemmatised in Python.',
    },
    {
      part: P1,
      title: 'Two ways to find a topic',
      body: 'One method looks for words that tend to appear together. The other groups passages that mean similar things, even when they use different words. The second found sharper, more specific topics.',
      points: [
        'Broad themes such as health, transport or elections, against specific cases such as a poisoning scandal or indigenous land rights.',
        'The second method also sets aside passages that fit no topic, instead of forcing them into one.',
      ],
      facts: [
        { value: '17', label: 'topics, words that appear together' },
        { value: '33', label: 'topics, passages with similar meaning' },
      ],
      factsLayout: 'list',
      hood: 'LDA vs BERTopic, compared by coherence score: below 0.20 vs above 0.45.',
    },
    {
      part: P1,
      title: 'Language that changes over time',
      body: 'The same tools can follow one subject through the years. In the health debates, the words shifted from routine matters to specific crises. Reading text for its meaning, not just its words, is what I took to CID Gallup.',
      points: [
        'Early on: “salud pública” and “cirugía”.',
        'Later: the diethylene glycol poisonings, the La Villa river and smoke from the Cerro Patacón landfill.',
      ],
      hood: 'Dynamic topic modelling with BERTopic. Presented at IEEE CONCAPAN, 2022.',
    },
    {
      part: P2,
      title: 'What did people say?',
      body: 'At CID Gallup I faced a similar question: what are people talking about? This time the text was open survey answers, written in people’s own words. My tool picks out the key phrases, and AI turns them into a list of themes for analysts to review and adjust.',
      points: [
        '“Se roban la plata del pueblo” never says “corruption”, but that is what it means. A word search would miss it.',
        'The tool also reads the question, because “más seguridad” means something different in a question about jobs.',
        'As with the parliament topics, the themes come from the answers themselves. Analysts can also add their own.',
      ],
      hood: 'KeyBERT extracts the key phrases; an AI agent built on Gemini drafts the codebook from those phrases and the survey question.',
    },
    {
      part: P2,
      title: 'Four checks, one theme',
      body: 'Each answer is compared with every theme in four ways: meaning, shared words, similar spelling and tone. The four results are combined to choose the theme.',
      points: [
        'An answer can count towards more than one theme when the results are close.',
        'The output is ordinary spreadsheet columns, ready to count, with the original words alongside.',
      ],
      hood: 'A hybrid text classifier: sentence embeddings, BM25, fuzzy matching and sentiment analysis, combined with adjustable weights; it can assign more than one theme when scores are close.',
    },
    {
      part: P3,
      title: 'Which interviews deserve a second look?',
      body: 'The second tool looks for patterns in how each interview was answered, not in what was said. One clue is entropy, a measure of variety. Real opinions vary. Giving the same answer every time shows almost no variety.',
      points: [
        'Respondent A trusts some institutions more than others, which is a natural spread.',
        'Respondent B answers “Ninguna” (none) seven times in a row: zero variety, worth a check.',
      ],
      hood: 'Shannon entropy measures how varied each respondent’s answers are: 2.24 bits for A and 0 for B, out of a maximum of 2.32 for five options.',
    },
    {
      part: P3,
      title: 'Four warning signs, one ranking',
      body: 'Each interview is checked for four warning signs: finished unusually fast, many unanswered questions, little variety, and the same answer repeated down a list. The interviews that stand out move up.',
      points: [
        'No single sign decides on its own. The four are combined into one score.',
        'Each sign is measured against the rest of the same batch, so what counts as unusual fits each survey.',
      ],
      hood: 'Each signal is scored by its distance from the batch average in standard deviations, and the four are averaged into one ranking. Shown: 60 invented interviews.',
    },
    {
      part: P3,
      title: 'What it is for',
      body: 'The top third goes to supervisors, listed by interview and by interviewer, with the warning sign behind each one. The tool shows where to look first. A call back to the respondent confirms.',
      points: [
        'Supervisors spend their time on the interviews most likely to need it.',
        'A question skipped on purpose can look like a missing answer, so the questionnaire is read alongside the score.',
      ],
      stat: { value: '⅓', label: 'of interviews go to review' },
      hood: 'Built at CID Gallup, 2024 to 2026. Client data and results are confidential.',
    },
  ],
  stack: ['Python', 'LDA', 'BERTopic', 'KeyBERT', 'Generative AI', 'Sentence embeddings', 'BM25'],
  source: {
    label: 'Read the Project 1 paper on IEEE Xplore (lead author)',
    href: 'https://doi.org/10.1109/CONCAPAN48024.2022.9997766',
  },
  related: [
    {
      authors: 'Contreras et al. 2022',
      title: 'Using Topic Modelling for Analyzing Panamanian Parliamentary Proceedings with Neural and Statistical Methods',
      venue: 'IEEE CONCAPAN',
      href: 'https://doi.org/10.1109/CONCAPAN48024.2022.9997766',
      lead: true,
    },
  ],
  credit:
    'Project 1: topic counts and topic words are from Contreras et al. 2022 (IEEE CONCAPAN). Projects 2 and 3 used confidential client data at CID Gallup, so the poll, its answers, the respondents and the 60 interviews are invented. The variety and review scores are calculated from them the same way the tools do. All drawings are illustrations.',
  stageAlt:
    'Animated diagram in nine stages covering three projects. An overview shows three cards, parliament topics, open answers and interview audits, joined by an arrow: the research leads to the open-answer tool, then to the interview audits. Project 1: a stack of parliamentary records becomes 2,086 small tiles; three lists of words that appear together sit beside points gathering into three groups of similar meaning; the health topic is spread along a timeline from 2005 to 2020 with its words. Project 2: invented poll answers are turned into key phrases and a list of three themes; one answer is checked four ways and written into spreadsheet columns. Project 3: two respondents’ answers, one varied and one the same seven times, with a variety meter; 60 interviews are placed by four warning signs and combined into one ranking; a review list marks the top third, beside an interviewer at a door. A bar at the top of the stage shows which project is on screen.',
};
