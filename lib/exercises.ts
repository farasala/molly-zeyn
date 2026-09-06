import { audioSlug } from '@/lib/audio';
import type { Exercise } from '@/lib/content';

/**
 * The answer key never leaves the server. Everything here that touches a
 * correct answer is used by server actions and route handlers only; the
 * browser receives PublicItem, which carries the question and nothing else.
 */

export const XP_PER_CORRECT = 10;

/**
 * Contractions, written out. Both the student's answer and the key go through
 * this, so "I'm", "I am" and even "Im" all land on the same string.
 *
 * The list is explicit rather than a clever `n't` rule, because that rule turns
 * "doesn't" into "doesn not". Elementary uses a small, closed set.
 * Order matters: the negatives must run before the 's rule.
 */
const CONTRACTIONS: [RegExp, string][] = [
  [/\blet'?s\b/g, 'let us'],
  [/\bcan'?t\b/g, 'can not'],
  [/\bcannot\b/g, 'can not'],
  [/\bwon'?t\b/g, 'will not'],
  [/\bdon'?t\b/g, 'do not'],
  [/\bdoesn'?t\b/g, 'does not'],
  [/\bdidn'?t\b/g, 'did not'],
  [/\bisn'?t\b/g, 'is not'],
  [/\baren'?t\b/g, 'are not'],
  [/\bwasn'?t\b/g, 'was not'],
  [/\bweren'?t\b/g, 'were not'],
  [/\bhasn'?t\b/g, 'has not'],
  [/\bhaven'?t\b/g, 'have not'],
  [/\bcouldn'?t\b/g, 'could not'],
  [/\bshouldn'?t\b/g, 'should not'],
  [/\bwouldn'?t\b/g, 'would not'],
  [/\bi'?m\b/g, 'i am'],
  [/\b(you|we|they)'?re\b/g, '$1 are'],
  [/\b(i|you|we|they)'?ve\b/g, '$1 have'],
  [/\b(i|you|we|they|he|she|it)'?ll\b/g, '$1 will'],
  [/\b(he|she|it|that|this|there|what|who|where)'?s\b/g, '$1 is'],
];

/**
 * Answer comparison. Lowercase, straighten quotes, fold accents, strip
 * punctuation, collapse spaces, trim — and by default write contractions out,
 * so a missing apostrophe or "I am" for "I'm" is not counted as a mistake.
 *
 * `expandContractions: false` is for the handful of tasks where the
 * contraction is the thing being tested; see checkExercise.
 */
export function normalizeAnswer(value: string, expandContractions = true): string {
  let text = value
    .toLowerCase()
    .normalize('NFD')
    // café and cafe are the same answer at this level.
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”‟″]/g, '"')
    .replace(/[.,!?;:"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (expandContractions) {
    for (const [pattern, replacement] of CONTRACTIONS) {
      text = text.replace(pattern, replacement);
    }
  }

  // Anything left, like a stray apostrophe, stops mattering here.
  return text.replace(/'/g, '').replace(/\s+/g, ' ').trim();
}

function sameAnswer(given: string, expected: string, expandContractions = true): boolean {
  return (
    normalizeAnswer(given, expandContractions) === normalizeAnswer(expected, expandContractions)
  );
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
      // "Write the contraction." is the one place where writing it out in
      // full is the wrong answer, so leniency is switched off there.
      const testsContraction = /contraction/i.test(exercise.instr);
      const correct = exercise.a.some((option) =>
        sameAnswer(given, option, !testsContraction),
      );
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

/**
 * A task written out for the teacher's review screen: what was asked, and
 * what the right answer was. Only ever rendered to a teacher.
 */
export function describeExercise(exercise: Exercise): { prompt: string; answer: string } {
  switch (exercise.t) {
    case 'mc':
      return { prompt: exercise.q, answer: exercise.o[exercise.a] };
    case 'listen':
      return { prompt: `Listening — ${exercise.q}`, answer: exercise.o[exercise.a] };
    case 'gap':
      return { prompt: exercise.q, answer: exercise.a };
    case 'order':
      return { prompt: 'Word order', answer: exercise.a };
    case 'transform':
      return { prompt: `${exercise.instr} ${exercise.q}`, answer: exercise.a[0] };
    case 'dictation':
      return { prompt: 'Dictation', answer: exercise.a };
    case 'match':
      return {
        prompt: `Matching — ${exercise.pairs.map((pair) => pair[0]).join(', ')}`,
        answer: exercise.pairs.map(([left, right]) => `${left} — ${right}`).join(' · '),
      };
  }
}

/** The student's raw answer, turned back into something readable. */
export function describeGiven(exercise: Exercise, given: string): string {
  if (exercise.t === 'mc' || exercise.t === 'listen') {
    const chosen = Number.parseInt(given, 10);
    return exercise.o[chosen] ?? given;
  }

  if (exercise.t === 'match') {
    try {
      const pairs = JSON.parse(given) as [string, string][];
      return Array.isArray(pairs)
        ? pairs.map(([left, right]) => `${left} — ${right}`).join(' · ')
        : given;
    } catch {
      return given;
    }
  }

  return given;
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
