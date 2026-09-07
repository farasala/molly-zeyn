import { getCourse, type Exercise } from '@/lib/content';
import { checkExercise, isPlayable, toPublicItem, type PublicItem } from '@/lib/exercises';

/**
 * The two tests that sit above the units: a placement test a new student takes
 * before their first lesson, and the end-of-course test.
 *
 * They are not homework and not practice. A test is one pass with no feedback
 * between questions and no second attempt at an item — otherwise it measures
 * persistence rather than what the student knows. Everything is checked in a
 * single request when the paper is handed in.
 */

export type TestKind = 'entry' | 'final';

export type PlacementItem = Exercise & { unit: number };

export type CourseTest = {
  title: string;
  blurb: string;
  pass?: number;
  items: PlacementItem[];
};

export function getCourseTest(levelId: string, kind: TestKind): CourseTest | null {
  const course = getCourse(levelId) as unknown as Record<string, CourseTest | undefined>;
  const test = kind === 'entry' ? course?.entryTest : course?.finalTest;
  return test?.items?.length ? test : null;
}

/** Where the browser fetches a test recording, if a test item ever needs one. */
export function testClipPrefix(kind: TestKind): string {
  return `/api/test-clip/${kind}`;
}

/**
 * Questions only — the answers stay here. Order is kept: the paper runs from
 * unit 1 upwards, which is what makes the placement result readable.
 *
 * `i` stays the item's position in the full paper even when a task is dropped
 * for want of a recording, so what comes back still lines up with the key.
 */
export function testItems(test: CourseTest, kind: TestKind): PublicItem[] {
  const prefix = testClipPrefix(kind);
  return test.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => isPlayable(item))
    .map(({ item, index }) => toPublicItem(item, index, prefix));
}

export type MarkedTest = {
  score: number;
  total: number;
  perUnit: { unit: number; right: number; asked: number }[];
  /** Placement: the unit the student should start from. */
  startAt: number;
  passed: boolean;
};

/**
 * Marks a whole paper at once.
 *
 * Placement works band by band rather than by total score: someone who knows
 * the present simple but not the past should start where the past begins, and
 * a single lucky guess late in the paper should not push them there.
 */
export function markTest(test: CourseTest, answers: Record<number, string>): MarkedTest {
  const byUnit = new Map<number, { right: number; asked: number }>();
  let score = 0;
  let total = 0;

  test.items.forEach((item, index) => {
    // A task the student was never shown cannot count against them.
    if (!isPlayable(item)) return;
    total += 1;

    const given = answers[index];
    const correct =
      typeof given === 'string' && given.length > 0 ? checkExercise(item, given).correct : false;

    if (correct) score += 1;

    const row = byUnit.get(item.unit) ?? { right: 0, asked: 0 };
    row.asked += 1;
    if (correct) row.right += 1;
    byUnit.set(item.unit, row);
  });

  const perUnit = [...byUnit.entries()]
    .map(([unit, row]) => ({ unit, ...row }))
    .sort((a, b) => a.unit - b.unit);

  // Walk up while the student is holding: the first unit they are shaky on is
  // where the teaching should begin.
  let startAt = 1;
  for (const row of perUnit) {
    if (row.right === row.asked) startAt = row.unit + 1;
    else break;
  }

  return {
    score,
    total,
    perUnit,
    startAt: Math.min(startAt, 12),
    passed: test.pass ? score >= test.pass : score >= Math.ceil(total * 0.7),
  };
}
