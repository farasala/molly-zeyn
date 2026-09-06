'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { XP_PER_CORRECT } from '@/lib/exercises';
import { parseItems } from '@/lib/homework';
import { createClient } from '@/lib/supabase/server';

export type HomeworkActionResult = { ok: boolean; message?: string };

/**
 * Opens an assignment: finds the student's submission or starts one.
 * Redirects into the runner, so the student never sees a bare id.
 */
export async function startHomework(formData: FormData): Promise<void> {
  const homeworkId = String(formData.get('homeworkId') ?? '');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // RLS returns the row only if this student is actually assigned it.
  const { data: homework } = await supabase
    .from('homework')
    .select('id, items')
    .eq('id', homeworkId)
    .maybeSingle();

  if (!homework) redirect('/dashboard');

  const { data: existing } = await supabase
    .from('homework_submissions')
    .select('id')
    .eq('homework_id', homeworkId)
    .eq('student_id', user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from('homework_submissions').insert({
      homework_id: homeworkId,
      student_id: user.id,
      total: parseItems(homework.items).length,
    });
  }

  redirect(`/homework/${homeworkId}`);
}

/**
 * Marks the assignment done and works out the score from the answers the
 * server itself recorded — the client is not asked what it got right.
 * The database trigger opens the lesson once the row says submitted.
 */
export async function submitHomework(submissionId: string): Promise<HomeworkActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'Your session has expired. Log in and try again.' };

  const { data: submission } = await supabase
    .from('homework_submissions')
    .select('id, total, status, homework_id')
    .eq('id', submissionId)
    .eq('student_id', user.id)
    .maybeSingle();

  if (!submission) return { ok: false, message: 'That assignment is not yours.' };
  if (submission.status === 'submitted') return { ok: true };

  const { data: answers } = await supabase
    .from('homework_answers')
    .select('correct')
    .eq('submission_id', submissionId);

  const score = (answers ?? []).filter((row) => row.correct).length;

  const { error } = await supabase
    .from('homework_submissions')
    .update({
      status: 'submitted',
      score,
      xp: score * XP_PER_CORRECT,
      submitted_at: new Date().toISOString(),
    })
    .eq('id', submissionId)
    .eq('student_id', user.id);

  if (error) return { ok: false, message: 'Your work could not be handed in. Check your connection.' };

  revalidatePath('/dashboard');
  revalidatePath('/levels/elementary');
  return { ok: true };
}
