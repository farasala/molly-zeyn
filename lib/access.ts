import { createClient } from '@/lib/supabase/server';

/**
 * What a student may open.
 *
 * Lessons happen on Zoom; the platform is what comes after. So a student
 * starts with nothing open, gets homework for the lesson just taught, and
 * finishing it opens that lesson for revision. Everything else stays shut —
 * on the server, not just in the interface.
 */
export type StudentAccess = {
  /** Lessons finished (or opened by the teacher for a missed class). */
  open: Set<string>;
  /** Lessons with homework waiting: reachable, but only the homework tab. */
  assigned: Set<string>;
};

export const EMPTY_ACCESS: StudentAccess = { open: new Set(), assigned: new Set() };

export async function getStudentAccess(levelId: string): Promise<StudentAccess> {
  const supabase = await createClient();

  // Both queries lean on RLS: they return this student's rows and no others.
  const [{ data: granted }, { data: homework }] = await Promise.all([
    supabase.from('lesson_access').select('lesson_id').eq('level_id', levelId),
    supabase.from('homework').select('lesson_id').eq('level_id', levelId),
  ]);

  return {
    open: new Set((granted ?? []).map((row) => row.lesson_id)),
    assigned: new Set((homework ?? []).map((row) => row.lesson_id)),
  };
}

export type LessonState = 'open' | 'homework-only' | 'shut';

/** What this viewer may do with one lesson. */
export function lessonState(
  isTeacher: boolean,
  lessonId: string,
  access: StudentAccess,
): LessonState {
  if (isTeacher) return 'open';
  if (access.open.has(lessonId)) return 'open';
  if (access.assigned.has(lessonId)) return 'homework-only';
  return 'shut';
}

/** True when a student can get into a unit at all. */
export function unitReachable(
  isTeacher: boolean,
  lessonIds: string[],
  access: StudentAccess,
): boolean {
  if (isTeacher) return true;
  return lessonIds.some((id) => access.open.has(id) || access.assigned.has(id));
}
