import { type NextRequest, NextResponse } from 'next/server';
import { canAccessLesson } from '@/lib/access';
import { getLessonById } from '@/lib/content';
import { checkExercise } from '@/lib/exercises';
import { createClient } from '@/lib/supabase/server';

const LEVEL_ID = 'elementary';

/**
 * Checks one answer and returns JSON.
 *
 * This is a route handler rather than a server action on purpose: an action
 * re-renders the page's server tree and ships an RSC payload back, which cost
 * half a second per answer. A drill asks 12-15 questions in a row, so that
 * round trip is the difference between snappy and sluggish. The answer key
 * still never leaves the server.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, correct: false, expected: '' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, correct: false, expected: '' }, { status: 400 });
  }

  const { lessonId, index, given } = (body ?? {}) as {
    lessonId?: unknown;
    index?: unknown;
    given?: unknown;
  };

  if (typeof lessonId !== 'string' || typeof index !== 'number' || typeof given !== 'string') {
    return NextResponse.json({ ok: false, correct: false, expected: '' }, { status: 400 });
  }

  // Being signed in is not being entitled to this lesson. Without this, any
  // student could ask for a lesson they have not unlocked yet and read its
  // answer back — one devtools panel closer than the question ever gets.
  if (!(await canAccessLesson(supabase, user.id, LEVEL_ID, lessonId))) {
    return NextResponse.json({ ok: false, correct: false, expected: '' }, { status: 403 });
  }

  const exercise = getLessonById(LEVEL_ID, lessonId)?.lesson.ex?.[index];
  if (!exercise) {
    return NextResponse.json({ ok: false, correct: false, expected: '' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, ...checkExercise(exercise, given) });
}
