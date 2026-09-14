import { type NextRequest, NextResponse } from 'next/server';
import { checkExercise } from '@/lib/exercises';
import { isWarmupRef, resolveWarmupRef } from '@/lib/warmup';
import { createClient } from '@/lib/supabase/server';

const LEVEL_ID = 'elementary';

/**
 * Checks one warm-up answer. A separate route from /api/check because a
 * warm-up item can be a synthetic vocabulary match built from a word list —
 * there is no index into any lesson's `ex` array for that — so the request
 * carries the same reference shape planWarmup handed to the browser instead
 * of a bare index. The answer key still never leaves the server.
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

  const { ref, given } = (body ?? {}) as { ref?: unknown; given?: unknown };

  if (!isWarmupRef(ref) || typeof given !== 'string') {
    return NextResponse.json({ ok: false, correct: false, expected: '' }, { status: 400 });
  }

  const exercise = resolveWarmupRef(LEVEL_ID, ref);
  if (!exercise) {
    return NextResponse.json({ ok: false, correct: false, expected: '' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, ...checkExercise(exercise, given) });
}
