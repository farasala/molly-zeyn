import { createClient } from '@/lib/supabase/server';
import type { Role } from '@/lib/auth-state';

/** Reads for the teacher's side. Every one of them relies on RLS, not on
 *  filtering in the query, so a mistake here cannot leak another teacher's
 *  students. */

export type Group = {
  id: string;
  name: string;
  created_at: string;
};

export type Student = {
  id: string;
  full_name: string;
  role: Role;
  avatar_color: string;
};

export type GroupWithStudents = Group & { students: Student[] };

export type Invite = {
  token: string;
  group_id: string;
  max_uses: number;
  used_count: number;
  expires_at: string;
};

export async function getGroups(teacherId: string): Promise<GroupWithStudents[]> {
  const supabase = await createClient();

  const { data: groups } = await supabase
    .from('groups')
    .select('id, name, created_at')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: true });

  if (!groups?.length) return [];

  const { data: members } = await supabase
    .from('group_members')
    .select('group_id, student:student_id (id, full_name, role, avatar_color)')
    .in(
      'group_id',
      groups.map((group) => group.id),
    );

  const byGroup = new Map<string, Student[]>();
  for (const row of members ?? []) {
    const student = row.student as unknown as Student | null;
    if (!student) continue;
    const list = byGroup.get(row.group_id) ?? [];
    list.push(student);
    byGroup.set(row.group_id, list);
  }

  return groups.map((group) => ({
    ...group,
    students: (byGroup.get(group.id) ?? []).sort((a, b) =>
      a.full_name.localeCompare(b.full_name),
    ),
  }));
}

export async function getInvites(teacherId: string): Promise<Invite[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('invites')
    .select('token, group_id, max_uses, used_count, expires_at')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  return data ?? [];
}

export type AssignedHomework = {
  id: string;
  lesson_id: string;
  unit_n: number;
  title: string;
  due_at: string | null;
  created_at: string;
  group_id: string | null;
  student_id: string | null;
  item_count: number;
};

export async function getTeacherHomework(
  teacherId: string,
  lessonId?: string,
): Promise<AssignedHomework[]> {
  const supabase = await createClient();
  let query = supabase
    .from('homework')
    .select('id, lesson_id, unit_n, title, due_at, created_at, group_id, student_id, items')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (lessonId) query = query.eq('lesson_id', lessonId);

  const { data } = await query;

  return (data ?? []).map((row) => ({
    id: row.id,
    lesson_id: row.lesson_id,
    unit_n: row.unit_n,
    title: row.title,
    due_at: row.due_at,
    created_at: row.created_at,
    group_id: row.group_id,
    student_id: row.student_id,
    item_count: Array.isArray(row.items) ? row.items.length : 0,
  }));
}

export type SubmissionRow = {
  id: string;
  homework_id: string;
  student_id: string;
  status: 'in_progress' | 'submitted';
  score: number;
  total: number;
  submitted_at: string | null;
};

export async function getSubmissions(homeworkIds: string[]): Promise<SubmissionRow[]> {
  if (homeworkIds.length === 0) return [];
  const supabase = await createClient();

  const { data } = await supabase
    .from('homework_submissions')
    .select('id, homework_id, student_id, status, score, total, submitted_at')
    .in('homework_id', homeworkIds);

  return (data ?? []) as SubmissionRow[];
}

/** Lessons a student already has open, and why. */
export async function getLessonAccess(studentId: string, levelId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lesson_access')
    .select('lesson_id, source, granted_at')
    .eq('student_id', studentId)
    .eq('level_id', levelId);

  return data ?? [];
}
