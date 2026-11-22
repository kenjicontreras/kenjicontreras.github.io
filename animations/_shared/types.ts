/** Content model shared by every scroll story in /animations. */

export type Stat = { value: string; label: string };

export type Step = {
  /** Optional label for stories that tell several projects, shown beside the step count (e.g. 'Project 2 · Open answers'). */
  part?: string;
  /** Short headline, sentence case. */
  title: string;
  /** Plain-language message, 35 words or fewer. */
  body: string;
  /** Two or three short supporting points (about 20 words each), shown as a list under the body. */
  points?: string[];
  /** The one number this step is about. */
  stat?: Stat;
  /** Extra figures shown as a compact list (use sparingly). */
  facts?: Stat[];
  /** 'row' (default) sets facts side by side; 'list' stacks them, for longer labels. */
  factsLayout?: 'row' | 'list';
  /** One line for technical readers: methods, parameters, validation. Optional. */
  hood?: string;
};

export type StoryContent = {
  /** Used as the section id and anchor. */
  id: string;
  title: string;
  /** Client or partners, and years. */
  meta: string;
  /** Optional lead-in beside the title. Leave out to show the title alone. */
  intro?: string;
  /** What the author personally did. */
  role?: string;
  steps: Step[];
  /** Tools, shown as chips. */
  stack: string[];
  /** The publication behind the story. */
  source?: { label: string; shortLabel?: string; href: string };
  /** Other papers from the same line of work, listed under the story. */
  related?: { authors: string; title: string; venue: string; href: string; lead?: boolean }[];
  /** Attribution for third-party material shown on the stage. */
  credit?: string;
  /** Text alternative for the animated stage. */
  stageAlt: string;
};
