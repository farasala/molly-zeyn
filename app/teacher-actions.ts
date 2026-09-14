'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { getTeacher } from '@/lib/auth';
import { planHomework } from '@/lib/homework';
import { createClient } from '@/lib/supabase/server';

const LEVEL_ID = 'elementary';

// A "persistent" link on columns that were built with a use-count and an
// expiry: generous values rather than no limit, so one link handles every
// student a teacher will ever invite without them thinking about it again.
const INVITE_MAX_USES = 500;
const INVITE_LIFETIME_DAYS = 730;

export type ActionResult = { ok: boolean; message?: string };

/** A token short enough to paste into a chat, long enough not to be guessed. */
function newToken(): string {
  return randomBytes(12).toString('base64url');
}

/**
 * The one group a teacher's students land in. Groups still exist in the
 * schema — `teaches()` and everything that follows it in RLS depend on group
 * membership — but nobody manages one by hand any more. The first time an
 * invitation link is needed, one is made quietly and reused after that.
 */
async function ensureRosterGroup(
  supabase: Awaited<ReturnType<typeof createClient>>,
  teacherId: string,
  teacherName: string,
): Promise<string | null> {
  const { data: existing } = await supabase
    .from('groups')
    .select('id')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created } = await supabase
    .from('groups')
    .insert({ teacher_id: teacherId, name: `${teacherName}'s students` })
    .select('id')
    .single();

  return created?.id ?? null;
}

/**
 * Makes the link a teacher hands to every new student. Calling it again
 * while a link is still good just shows that one — see the "New Link" button
 * on /teacher, which is really "give up on this one and make another."
 */
export async function createInvite(_formData: FormData): Promise<ActionResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, message: 'Only a teacher can invite students.' };

  const supabase = await createClient();
  const groupId = await ensureRosterGroup(supabase, teacher.profile.id, teacher.profile.full_name);
  if (!groupId) return { ok: false, message: 'The link could not be created. Try again.' };

  const { error } = await supabase.from('invites').insert({
    token: newToken(),
    teacher_id: teacher.profile.id,
    group_id: groupId,
    max_uses: INVITE_MAX_USES,
    expires_at: new Date(Date.now() + INVITE_LIFETIME_DAYS * 86_400_000).toISOString(),
  });

  if (error) return { ok: false, message: 'The link could not be created. Try again.' };

  revalidatePath('/teacher');
  return { ok: true };
}

export async function revokeInvite(formData: FormData): Promise<ActionResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, message: 'Only a teacher can do that.' };

  const token = String(formData.get('token') ?? '');
  const supabase = await createClient();
  await supabase.from('invites').delete().eq('token', token).eq('teacher_id', teacher.profile.id);

  revalidatePath('/teacher');
  return { ok: true };
}

/**
 * Sets homework for one lesson, for one or more students picked by name —
 * one row per student. That is what keeps "handed in" a plain yes or no:
 * a shared row that pointed at a group made it a fraction, and one student
 * running ahead of another inside the same row had nowhere honest to show.
 */
export async function assignHomework(formData: FormData): Promise<ActionResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, message: 'Only a teacher can set homework.' };

  const lessonId = String(formData.get('lessonId') ?? '');
  const studentIds = formData.getAll('studentIds').map(String).filter(Boolean);
  const dueRaw = String(formData.get('dueAt') ?? '').trim();

  if (studentIds.length === 0) return { ok: false, message: 'Pick at least one student.' };

  const plan = planHomework(LEVEL_ID, lessonId);
  if (!plan) {
    return { ok: false, message: 'That lesson has no content to build homework from yet.' };
  }

  const supabase = await createClient();
  const rows = studentIds.map((studentId) => ({
    teacher_id: teacher.profile.id,
    student_id: studentId,
    level_id: plan.levelId,
    unit_n: plan.unitN,
    lesson_id: plan.lessonId,
    title: plan.title,
    items: plan.items,
    due_at: dueRaw ? new Date(dueRaw).toISOString() : null,
  }));

  const { error } = await supabase.from('homework').insert(rows);

  if (error) return { ok: false, message: 'The homework could not be set. Try again.' };

  revalidatePath('/teacher');
  revalidatePath(`/lessons/${lessonId}`);
  return { ok: true };
}

export async function deleteHomework(formData: FormData): Promise<ActionResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, message: 'Only a teacher can do that.' };

  const id = String(formData.get('homeworkId') ?? '');
  const supabase = await createClient();
  await supabase.from('homework').delete().eq('id', id).eq('teacher_id', teacher.profile.id);

  revalidatePath('/teacher');
  return { ok: true };
}

/** Opens a lesson by hand — for a student who missed the class. */
export async function grantLesson(formData: FormData): Promise<ActionResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, message: 'Only a teacher can open a lesson.' };

  const studentId = String(formData.get('studentId') ?? '');
  const lessonId = String(formData.get('lessonId') ?? '');
  if (!studentId || !lessonId) return { ok: false, message: 'Pick a student and a lesson.' };

  const supabase = await createClient();
  const { error } = await supabase.from('lesson_access').insert({
    student_id: studentId,
    level_id: LEVEL_ID,
    lesson_id: lessonId,
    source: 'teacher',
    granted_by: teacher.profile.id,
  });

  if (error && !error.message.includes('duplicate')) {
    return { ok: false, message: 'The lesson could not be opened. Try again.' };
  }

  revalidatePath('/teacher');
  return { ok: true };
}
