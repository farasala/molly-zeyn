import { createClient } from '@/lib/supabase/server';

/**
 * Totals for the signed-in student, read straight from `activity_results`.
 * Every attempt is kept, so XP is the sum of what was earned and the score
 * shown per lesson is the best one.
 *
 * Stage 7 builds the full cabinet on top of this; for now it is what proves
 * a finished practice run survives a log out and a different device.
 */
export type Totals = {
  xp: number;
  activities: number;
  lessonsPractised: number;
  best: Map<string, { score: number; total: number }>;
};

export async function getTotals(userId: string, levelId: string): Promise<Totals> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('activity_results')
    .select('lesson_id, score, total, xp')
    .eq('user_id', userId)
    .eq('level_id', levelId);

  const empty: Totals = { xp: 0, activities: 0, lessonsPractised: 0, best: new Map() };
  if (error || !data) return empty;

  const best = new Map<string, { score: number; total: number }>();
  let xp = 0;

  for (const row of data) {
    xp += row.xp ?? 0;
    const lessonId = row.lesson_id;
    if (!lessonId) continue;

    const current = best.get(lessonId);
    const share = row.total > 0 ? row.score / row.total : 0;
    const currentShare = current && current.total > 0 ? current.score / current.total : -1;
    if (share > currentShare) best.set(lessonId, { score: row.score, total: row.total });
  }

  return { xp, activities: data.length, lessonsPractised: best.size, best };
}
