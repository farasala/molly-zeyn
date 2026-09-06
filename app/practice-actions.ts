'use server';

import { getLessonById } from '@/lib/content';
import { XP_PER_CORRECT } from '@/lib/exercises';
import { createClient } from '@/lib/supabase/server';

const LEVEL_ID = 'elementary';

export type SaveResult = { ok: boolean; message?: string };

/**
 * Records a finished practice run. Every attempt is kept; the dashboard
 * shows the best per activity and sums xp.
 *
 * The score is what the client counted, bounded here to the number of tasks
 * that lesson actually has, and xp is recalculated rather than accepted.
 * That is fine for free practice, which is not assessed. Homework is graded,
 * so in stage 5 the server owns the session and derives the score from the
 * answers it checked — do not reuse this action for it.
 */
export async function savePractice(input: {
  lessonId: string;
  score: number;
  total: number;
}): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: 'Your session has expired. Log in and try again.' };

  const found = getLessonById(LEVEL_ID, input.lessonId);
  if (!found) return { ok: false, message: 'That lesson does not exist.' };

  const available = found.lesson.ex?.length ?? 0;
  const total = Math.min(Math.max(Math.trunc(input.total), 1), available);
  const score = Math.min(Math.max(Math.trunc(input.score), 0), total);

  const { error } = await supabase.from('activity_results').insert({
    user_id: user.id,
    level_id: LEVEL_ID,
    unit_n: found.unit.n,
    lesson_id: found.lesson.id,
    kind: 'practice',
    score,
    total,
    xp: score * XP_PER_CORRECT,
  });

  if (error) {
    return { ok: false, message: 'Your score could not be saved. Check your connection.' };
  }

  return { ok: true };
}
