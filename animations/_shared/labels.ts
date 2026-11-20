/**
 * Labels drawn inside a story's stage, in the page language. Each story keeps
 * a Spanish dictionary keyed by the English text (animations/<id>/labels.ts);
 * the Stage wraps its labels in `tx('…')`. A label with no entry stays in
 * English, and an empty string hides it (a gloss that would repeat the word).
 * Only words change: coordinates, classes and data-l names stay the same.
 */
export type Lang = 'en' | 'es';

export const translator =
  (lang: Lang, es: Record<string, string>) =>
  (english: string): string =>
    lang === 'es' ? (es[english] ?? english) : english;
