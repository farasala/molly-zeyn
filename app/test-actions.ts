'use server';

import { getCourseTest, markTest, type TestKind } from '@/lib/coursetest';
import { createClient } from '@/lib/supabase/server';

const LEVEL_ID = 'elementary';

export type TestOutcome = {
  ok: boolean;
  message?: string;
  score?: number;
  total?: number;
  startAt?: number;
  passed?: boolean;
  perUnit?: { unit: number; right: number; asked: number }[];
};

/**
 * Marks a whole paper server-side and records it.
 *
 * The client sends what was written and gets back a result. It never held the
 * answers, and because everything is marked in one request there is no way to
 * probe the key question by question.
 */
export async function submitTest(input: {
  kind: TestKind;
  answers: { index: number; given: string }[];
}): Promise<TestOutcome> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'Your session has expired. Log in and try again.' };

  const test = getCourseTest(LEVEL_ID, input.kind);
  if (!test) return { ok: false, message: 'That test does not exist.' };

  const answers: Record<number, string> = {};
  for (const row of input.answers) {
    if (typeof row?.index === 'number' && typeof row?.given === 'string') {
      answers[row.index] = row.given;
    }
  }

  const marked = markTest(test, answers);

  const { error } = await supabase.from('activity_results').insert({
    user_id: user.id,
    level_id: LEVEL_ID,
    // The unit the result points at: where to start after a placement test.
    // The end-of-course test points at no single unit, so it stores 0.
    unit_n: input.kind === 'entry' ? marked.startAt : 0,
    lesson_id: null,
    kind: input.kind,
    score: marked.score,
    total: marked.total,
    // No XP: a test measures what is there, it is not practice to be rewarded.
    xp: 0,
  });

  if (error) {
    return { ok: false, message: 'Your result could not be saved. Check your connection.' };
  }

  return { ok: true, ...marked };
}
