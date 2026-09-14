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

/**
 * True when this user may read one lesson's content right now — the teacher,
 * always, or a student whose own lesson_access covers it.
 *
 * The two route handlers that resolve a lesson straight from an id the
 * browser sent (/api/check, /api/clip) have no page and no lessonState() to
 * lean on — they only checked that someone was signed in, not that they were
 * signed in as the right someone. This is that same open/shut rule, checked
 * directly against the id the request named. Without it a signed-in student
 * could ask either route for a lesson they have not unlocked yet and get
 * back its answer or its audio, even though the question itself never
 * reaches them any other way.
 */
export async function canAccessLesson(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  levelId: string,
  lessonId: string,
): Promise<boolean> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  if (profile?.role === 'teacher') return true;

  const { data: access } = await supabase
    .from('lesson_access')
    .select('lesson_id')
    .eq('level_id', levelId)
    .eq('lesson_id', lessonId)
    .maybeSingle();
  return Boolean(access);
}
