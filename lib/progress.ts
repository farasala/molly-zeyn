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
    .eq('level_id', levelId)
    // Course tests live in the same table but are not practice runs.
    .eq('kind', 'practice');

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

/** One sitting of the entry or end-of-course test. */
export type TestResult = {
  kind: 'entry' | 'final';
  score: number;
  total: number;
  /** Placement: the unit the result points at. 0 on the end-of-course test. */
  unit_n: number;
  created_at: string;
};

/**
 * The course-level tests a student has sat, newest first.
 *
 * Every attempt is kept — a placement test taken again a term later is worth
 * seeing next to the first one, not on top of it.
 */
export async function getTestResults(userId: string, levelId: string): Promise<TestResult[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('activity_results')
    .select('kind, score, total, unit_n, created_at')
    .eq('user_id', userId)
    .eq('level_id', levelId)
    .in('kind', ['entry', 'final'])
    .order('created_at', { ascending: false });

  return (data ?? []) as TestResult[];
}
