import { createClient } from '@/lib/supabase/server';

/**
 * Totals for the signed-in student.
 *
 * XP is earned in two places and both count: practice runs, in
 * `activity_results`, and handed-in homework, in `homework_submissions`.
 * Reading only the first was a quiet lie — the homework screen says "+160 XP"
 * and the cabinet then showed 0.
 *
 * Every attempt is kept, so the score shown per lesson is the best one.
 */
export type Totals = {
  /** Practice and homework together — the number the student is shown. */
  xp: number;
  /** Practice runs only. Homework is counted separately; it is not practice. */
  activities: number;
  homework: number;
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

  const { data: handedIn } = await supabase
    .from('homework_submissions')
    .select('xp')
    .eq('student_id', userId)
    .eq('status', 'submitted');

  const homeworkXp = (handedIn ?? []).reduce((sum, row) => sum + (row.xp ?? 0), 0);
  const homework = handedIn?.length ?? 0;

  const empty: Totals = { xp: homeworkXp, activities: 0, homework, lessonsPractised: 0, best: new Map() };
  if (error || !data) return empty;

  const best = new Map<string, { score: number; total: number }>();
  let xp = homeworkXp;

  for (const row of data) {
    xp += row.xp ?? 0;
    const lessonId = row.lesson_id;
    if (!lessonId) continue;

    const current = best.get(lessonId);
    const share = row.total > 0 ? row.score / row.total : 0;
    const currentShare = current && current.total > 0 ? current.score / current.total : -1;
    if (share > currentShare) best.set(lessonId, { score: row.score, total: row.total });
  }

  return { xp, activities: data.length, homework, lessonsPractised: best.size, best };
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
