import { type NextRequest, NextResponse } from 'next/server';
import { checkExercise } from '@/lib/exercises';
import { parseItems, resolveItem } from '@/lib/homework';
import { createClient } from '@/lib/supabase/server';

const REFUSED = { ok: false, correct: false, expected: '' };

/**
 * Checks one homework answer and records it.
 *
 * The first answer is the one that counts — it is what the score is built
 * from and what the teacher reads when going through the homework in class.
 * Later attempts only bump the counter, so a task that came back around does
 * not quietly turn a miss into a hit.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json(REFUSED, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(REFUSED, { status: 400 });
  }

  const { submissionId, itemIndex, given } = (body ?? {}) as Record<string, unknown>;
  if (
    typeof submissionId !== 'string' ||
    typeof itemIndex !== 'number' ||
    typeof given !== 'string'
  ) {
    return NextResponse.json(REFUSED, { status: 400 });
  }

  // RLS: a student only sees their own submission.
  const { data: submission } = await supabase
    .from('homework_submissions')
    .select('id, homework_id, status, homework:homework_id (level_id, lesson_id, items)')
    .eq('id', submissionId)
    .eq('student_id', user.id)
    .maybeSingle();

  if (!submission) return NextResponse.json(REFUSED, { status: 404 });
  if (submission.status === 'submitted') return NextResponse.json(REFUSED, { status: 409 });

  const homework = submission.homework as unknown as {
    level_id: string;
    lesson_id: string;
    items: unknown;
  } | null;
  if (!homework) return NextResponse.json(REFUSED, { status: 404 });

  const ref = parseItems(homework.items)[itemIndex];
  const exercise = ref ? resolveItem(homework.level_id, homework.lesson_id, ref) : null;
  if (!exercise) return NextResponse.json(REFUSED, { status: 404 });

  const result = checkExercise(exercise, given);

  const { data: existing } = await supabase
    .from('homework_answers')
    .select('item_index, attempts')
    .eq('submission_id', submissionId)
    .eq('item_index', itemIndex)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('homework_answers')
      .update({ attempts: existing.attempts + 1 })
      .eq('submission_id', submissionId)
      .eq('item_index', itemIndex);
  } else {
    await supabase.from('homework_answers').insert({
      submission_id: submissionId,
      item_index: itemIndex,
      given,
      correct: result.correct,
    });
  }

  return NextResponse.json({ ok: true, ...result });
}
