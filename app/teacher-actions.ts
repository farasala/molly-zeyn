'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { getTeacher } from '@/lib/auth';
import { planHomework } from '@/lib/homework';
import { createClient } from '@/lib/supabase/server';

const LEVEL_ID = 'elementary';

export type ActionResult = { ok: boolean; message?: string };

/** A token short enough to paste into a chat, long enough not to be guessed. */
function newToken(): string {
  return randomBytes(12).toString('base64url');
}

export async function createGroup(formData: FormData): Promise<ActionResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, message: 'Only a teacher can create a group.' };

  const name = String(formData.get('name') ?? '').trim();
  if (name.length < 2) return { ok: false, message: 'Give the group a name first.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('groups')
    .insert({ teacher_id: teacher.profile.id, name });

  if (error) return { ok: false, message: 'The group could not be created. Try again.' };

  revalidatePath('/teacher');
  return { ok: true };
}

export async function createInvite(formData: FormData): Promise<ActionResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, message: 'Only a teacher can invite students.' };

  const groupId = String(formData.get('groupId') ?? '');
  if (!groupId) return { ok: false, message: 'Pick a group for the invitation.' };

  const supabase = await createClient();
  const { error } = await supabase.from('invites').insert({
    token: newToken(),
    teacher_id: teacher.profile.id,
    group_id: groupId,
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
 * Sets homework for one lesson. The task list is worked out now and stored,
 * so what the student answers is what the teacher later reads back.
 */
export async function assignHomework(formData: FormData): Promise<ActionResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, message: 'Only a teacher can set homework.' };

  const lessonId = String(formData.get('lessonId') ?? '');
  const groupId = String(formData.get('groupId') ?? '');
  const dueRaw = String(formData.get('dueAt') ?? '').trim();

  if (!groupId) return { ok: false, message: 'Pick a group to set this for.' };

  const plan = planHomework(LEVEL_ID, lessonId);
  if (!plan) {
    return { ok: false, message: 'That lesson has no content to build homework from yet.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('homework').insert({
    teacher_id: teacher.profile.id,
    group_id: groupId,
    level_id: plan.levelId,
    unit_n: plan.unitN,
    lesson_id: plan.lessonId,
    title: plan.title,
    items: plan.items,
    due_at: dueRaw ? new Date(dueRaw).toISOString() : null,
  });

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
