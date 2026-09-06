import { audioSlug } from '@/lib/audio';
import type { Exercise } from '@/lib/content';

/**
 * The answer key never leaves the server. Everything here that touches a
 * correct answer is used by server actions and route handlers only; the
 * browser receives PublicItem, which carries the question and nothing else.
 */

export const XP_PER_CORRECT = 10;

/**
 * Answer comparison, per CLAUDE.md: lowercase, straighten quotes, strip
 * . , ! ? ; : " — collapse spaces, trim. Apostrophes stay: "I'm" and "Im"
 * are not the same answer in a beginner course.
 */
export function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”‟″]/g, '"')
    .replace(/[.,!?;:"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sameAnswer(given: string, expected: string): boolean {
  return normalizeAnswer(given) === normalizeAnswer(expected);
}

/** Fisher-Yates, retried so the result is never the order it came in. */
export function shuffle<T>(input: readonly T[]): T[] {
  if (input.length < 2) return [...input];

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const out = [...input];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    if (out.some((value, index) => value !== input[index])) return out;
  }

  // Every element identical — no arrangement differs, so order is moot.
  return [...input];
}

/** What the browser is allowed to see. `i` is the task's position in the run. */
export type PublicItem =
  | { i: number; t: 'mc'; q: string; o: string[] }
  | { i: number; t: 'gap'; q: string; hint?: string }
  | { i: number; t: 'order'; chips: string[] }
  | { i: number; t: 'transform'; instr: string; q: string }
  | { i: number; t: 'match'; lefts: string[]; rights: string[] }
  | { i: number; t: 'dictation'; clip: string }
  | { i: number; t: 'listen'; q: string; o: string[]; clip: string };

/**
 * Strips an exercise down to what the student needs to answer it.
 *
 * Dictation and listening clips are addressed by position, not by their slug:
 * the slug is built from the text being dictated, so a plain file URL would
 * hand over the answer. `clipPrefix` says which route resolves that position —
 * the lesson for free practice, the homework for an assignment.
 */
export function toPublicItem(exercise: Exercise, i: number, clipPrefix: string): PublicItem {
  const clip = `${clipPrefix}/${i}`;

  switch (exercise.t) {
    case 'mc':
      return { i, t: 'mc', q: exercise.q, o: exercise.o };
    case 'gap':
      return { i, t: 'gap', q: exercise.q, hint: exercise.hint };
    case 'order':
      return { i, t: 'order', chips: shuffle(exercise.a.split(/\s+/)) };
    case 'transform':
      return { i, t: 'transform', instr: exercise.instr, q: exercise.q };
    case 'match':
      return {
        i,
        t: 'match',
        lefts: exercise.pairs.map((pair) => pair[0]),
        rights: shuffle(exercise.pairs.map((pair) => pair[1])),
      };
    case 'dictation':
      return { i, t: 'dictation', clip };
    case 'listen':
      return { i, t: 'listen', q: exercise.q, o: exercise.o, clip };
  }
}

/** The slug of the recording an exercise needs, or null when it needs none. */
export function clipSlugFor(exercise: Exercise): string | null {
  if (exercise.t === 'dictation') return audioSlug(exercise.a);
  if (exercise.t === 'listen') return audioSlug(exercise.text);
  return null;
}

export type CheckResult = {
  correct: boolean;
  /** Shown after answering, right or wrong. */
  expected: string;
};

/**
 * Checks one answer against the key. `given` is the raw student input;
 * for `mc` and `listen` it is the chosen option's index as a string, and for
 * `match` a JSON array of [left, right] pairs.
 */
export function checkExercise(exercise: Exercise, given: string): CheckResult {
  switch (exercise.t) {
    case 'mc':
    case 'listen': {
      const chosen = Number.parseInt(given, 10);
      return { correct: chosen === exercise.a, expected: exercise.o[exercise.a] };
    }
    case 'gap':
      return { correct: sameAnswer(given, exercise.a), expected: exercise.a };
    case 'order':
      return { correct: sameAnswer(given, exercise.a), expected: exercise.a };
    case 'dictation':
      return { correct: sameAnswer(given, exercise.a), expected: exercise.a };
    case 'transform': {
      const correct = exercise.a.some((option) => sameAnswer(given, option));
      return { correct, expected: exercise.a[0] };
    }
    case 'match': {
      const expected = exercise.pairs.map(([left, right]) => `${left} — ${right}`).join(' · ');
      let submitted: unknown;
      try {
        submitted = JSON.parse(given);
      } catch {
        return { correct: false, expected };
      }
      if (!Array.isArray(submitted) || submitted.length !== exercise.pairs.length) {
        return { correct: false, expected };
      }
      const truth = new Map(exercise.pairs.map(([left, right]) => [left, right]));
      const correct = submitted.every(
        (pair) =>
          Array.isArray(pair) &&
          typeof pair[0] === 'string' &&
          typeof pair[1] === 'string' &&
          truth.get(pair[0]) === pair[1],
      );
      return { correct, expected };
    }
  }
}

/** One-line description of a task type, for the practice intro. */
export const EXERCISE_NAMES: Record<Exercise['t'], string> = {
  mc: 'multiple choice',
  gap: 'gap fill',
  order: 'word order',
  transform: 'transformation',
  match: 'matching',
  dictation: 'dictation',
  listen: 'listening',
};
