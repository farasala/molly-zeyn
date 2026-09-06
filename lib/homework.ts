import { getLessonById, getUnit, type Exercise, type Lesson } from '@/lib/content';
import { shuffle, toPublicItem, type PublicItem } from '@/lib/exercises';

/**
 * Homework is assembled from the material the lesson already contains — the
 * authored exercises, the unit test, and the lesson's own word list. Nothing
 * is generated: every string a student reads was written for this course and
 * has a recording where one is needed.
 *
 * An item is stored as a reference, not a copy, so a submission stays readable
 * later. Treat a released unit's content as append-only.
 */
export type HomeworkItemRef =
  | { src: 'lesson'; i: number }
  | { src: 'test'; i: number }
  /** Word-to-meaning recall built from the lesson's vocabulary. */
  | { src: 'vocab'; words: string[] };

export type HomeworkPlan = {
  levelId: string;
  unitN: number;
  lessonId: string;
  title: string;
  items: HomeworkItemRef[];
};

const VOCAB_PER_TASK = 4;
const TEST_ITEMS = 2;

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i + size <= list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

/**
 * Builds the task list for one lesson. Deterministic in what it picks;
 * the order is shuffled so two students do not compare answers by position.
 */
export function planHomework(levelId: string, lessonId: string): HomeworkPlan | null {
  const found = getLessonById(levelId, lessonId);
  if (!found || found.lesson.locked) return null;

  const { unit, lesson } = found;
  const items: HomeworkItemRef[] = [];

  // Vocabulary recall: up to two matching tasks over the lesson's own words.
  const words = shuffle((lesson.vocab ?? []).map((entry) => entry.w));
  for (const group of chunk(words, VOCAB_PER_TASK).slice(0, 2)) {
    items.push({ src: 'vocab', words: group });
  }

  // Everything the lesson drills.
  (lesson.ex ?? []).forEach((_, index) => items.push({ src: 'lesson', i: index }));

  // A couple from the unit test, to bring back the earlier lessons.
  const test = unit.test ?? [];
  for (const index of shuffle(test.map((_, i) => i)).slice(0, TEST_ITEMS)) {
    items.push({ src: 'test', i: index });
  }

  return {
    levelId,
    unitN: unit.n,
    lessonId: lesson.id,
    title: `${lesson.id} · ${lesson.title}`,
    items: shuffle(items),
  };
}

/** Turns a stored reference back into the exercise it points at. */
export function resolveItem(
  levelId: string,
  lessonId: string,
  ref: HomeworkItemRef,
): Exercise | null {
  const found = getLessonById(levelId, lessonId);
  if (!found) return null;

  if (ref.src === 'lesson') return found.lesson.ex?.[ref.i] ?? null;
  if (ref.src === 'test') return getUnit(levelId, found.unit.n)?.test?.[ref.i] ?? null;

  return vocabExercise(found.lesson, ref.words);
}

/** A matching task over the lesson's word list — word against its meaning. */
function vocabExercise(lesson: Lesson, words: string[]): Exercise | null {
  const byWord = new Map((lesson.vocab ?? []).map((entry) => [entry.w, entry]));
  const pairs: [string, string][] = [];

  for (const word of words) {
    const entry = byWord.get(word);
    if (entry) pairs.push([entry.w, entry.def]);
  }

  return pairs.length >= 2 ? { t: 'match', pairs } : null;
}

/** The task list as the browser may see it: questions, never answers. */
export function publicItems(
  levelId: string,
  lessonId: string,
  refs: HomeworkItemRef[],
  clipPrefix: string,
): PublicItem[] {
  return refs.flatMap((ref, index) => {
    const exercise = resolveItem(levelId, lessonId, ref);
    if (!exercise) return [];
    // `i` is the position in the homework, not in the lesson: the answer is
    // looked up through the stored reference when it is checked.
    return [toPublicItem(exercise, index, clipPrefix)];
  });
}

/** Reads a stored `items` column back into refs, rejecting anything odd. */
export function parseItems(value: unknown): HomeworkItemRef[] {
  if (!Array.isArray(value)) return [];

  return value.filter((entry): entry is HomeworkItemRef => {
    if (!entry || typeof entry !== 'object') return false;
    const ref = entry as Record<string, unknown>;
    if (ref.src === 'lesson' || ref.src === 'test') return typeof ref.i === 'number';
    if (ref.src === 'vocab') {
      return Array.isArray(ref.words) && ref.words.every((word) => typeof word === 'string');
    }
    return false;
  });
}
