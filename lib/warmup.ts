import { audioSlug, audioUrl } from '@/lib/audio';
import { getCourse, getLessonById, hasAudio, type Exercise, type Lesson } from '@/lib/content';
import {
  EXERCISE_NAMES,
  isPlayable,
  shuffle,
  toPublicItem,
  type PublicItem,
} from '@/lib/exercises';
import { vocabExercise } from '@/lib/homework';

/**
 * Revision before the next lesson: a handful of tasks pulled back from
 * lessons already covered, mixed in type, so a student walks into class
 * having just touched a few of the earlier words and rules again.
 *
 * Nothing here is generated — every item is a reference into a lesson the
 * student has already been through, the same idea as lib/homework.ts. And
 * nothing here is graded or saved: this is a warm-up, not an assessment, so
 * there is no score to disagree with and no attempt count to argue over.
 */

export type WarmupRef =
  | { src: 'lesson'; lessonId: string; i: number }
  | { src: 'vocab'; lessonId: string; words: string[] };

export type WarmupItem =
  | { kind: 'task'; label: string; ref: WarmupRef; item: PublicItem }
  | {
      kind: 'speak';
      label: string;
      prompt: string;
      model: string;
      audio: string | null;
    };

const LOOKBACK_LESSONS = 6;
const MAX_ITEMS = 12;

function urlFor(slug: string): string | null {
  return hasAudio(slug) ? audioUrl(slug) : null;
}

/**
 * Lessons before this one, most recent first. For a student that is capped
 * to what they have actually unlocked — this is revision, not a preview of
 * what is still shut — and to a handful of lessons, so it reads as "the
 * last two units," not the whole course so far. A teacher gets every earlier
 * lesson: they already see everything, everywhere else.
 */
function priorLessons(
  levelId: string,
  lessonId: string,
  openLessonIds: Set<string> | null,
): Lesson[] {
  const course = getCourse(levelId);
  if (!course) return [];

  const flat = course.units.flatMap((unit) => unit.lessons);
  const at = flat.findIndex((lesson) => lesson.id === lessonId);
  if (at <= 0) return [];

  const before = flat.slice(0, at).reverse();
  const reachable = before.filter((lesson) => {
    if (lesson.locked) return false;
    return openLessonIds ? openLessonIds.has(lesson.id) : true;
  });

  return reachable.slice(0, LOOKBACK_LESSONS);
}

export function planWarmup(
  levelId: string,
  lessonId: string,
  openLessonIds: Set<string> | null,
): WarmupItem[] {
  const sources = priorLessons(levelId, lessonId, openLessonIds);
  if (sources.length === 0) return [];

  const pool: WarmupItem[] = [];

  for (const lesson of sources) {
    const clipPrefix = `/api/clip/${lesson.id}`;

    // A word or two back from this lesson's list.
    const vocab = lesson.vocab ?? [];
    if (vocab.length >= 2) {
      const words = shuffle(vocab)
        .slice(0, 4)
        .map((entry) => entry.w);
      const exercise = vocabExercise(lesson, words);
      if (exercise) {
        pool.push({
          kind: 'task',
          label: `${lesson.id} · matching`,
          ref: { src: 'vocab', lessonId: lesson.id, words },
          item: toPublicItem(exercise, 0, clipPrefix),
        });
      }
    }

    // A couple of the lesson's own drills, whatever has a recording.
    const candidates = (lesson.ex ?? [])
      .map((exercise, index) => ({ exercise, index }))
      .filter(({ exercise }) => isPlayable(exercise));

    for (const { exercise, index } of shuffle(candidates).slice(0, 2)) {
      pool.push({
        kind: 'task',
        label: `${lesson.id} · ${EXERCISE_NAMES[exercise.t]}`,
        ref: { src: 'lesson', lessonId: lesson.id, i: index },
        item: toPublicItem(exercise, index, clipPrefix),
      });
    }

    // One speaking prompt, with its model answer ready to reveal.
    const speak = lesson.speak ?? [];
    if (speak.length > 0) {
      const prompt = speak[Math.floor(Math.random() * speak.length)];
      pool.push({
        kind: 'speak',
        label: `${lesson.id} · speaking`,
        prompt: prompt.p,
        model: prompt.model,
        audio: urlFor(audioSlug(prompt.model)),
      });
    }
  }

  return shuffle(pool).slice(0, MAX_ITEMS);
}

export function isWarmupRef(value: unknown): value is WarmupRef {
  if (!value || typeof value !== 'object') return false;
  const ref = value as Record<string, unknown>;
  if (typeof ref.lessonId !== 'string') return false;
  if (ref.src === 'lesson') return typeof ref.i === 'number';
  if (ref.src === 'vocab') {
    return Array.isArray(ref.words) && ref.words.every((word) => typeof word === 'string');
  }
  return false;
}

/** Turns a warm-up reference back into the exercise it points at. */
export function resolveWarmupRef(levelId: string, ref: WarmupRef): Exercise | null {
  const found = getLessonById(levelId, ref.lessonId);
  if (!found) return null;

  if (ref.src === 'lesson') return found.lesson.ex?.[ref.i] ?? null;
  return vocabExercise(found.lesson, ref.words);
}
