import { describeExercise, describeGiven, EXERCISE_NAMES } from '@/lib/exercises';
import { parseItems, resolveItem, type HomeworkItemRef } from '@/lib/homework';
import { createClient } from '@/lib/supabase/server';

/**
 * What the teacher reads before the next lesson.
 *
 * Everything here is gated by RLS: the homework row comes back only to the
 * teacher who set it, and the answers only to that teacher and the student
 * who wrote them.
 */

export type ReviewTask = {
  index: number;
  kind: string;
  prompt: string;
  answer: string;
  /** Who got this wrong first time, by student id. */
  missedBy: string[];
  answeredBy: number;
};

export type ReviewStudent = {
  id: string;
  name: string;
  avatarColor: string;
  submissionId: string | null;
  status: 'not started' | 'in progress' | 'handed in';
  score: number;
  total: number;
  submittedAt: string | null;
};

export type ReviewAnswer = {
  index: number;
  kind: string;
  prompt: string;
  answer: string;
  given: string;
  correct: boolean;
  attempts: number;
};

export type HomeworkReview = {
  id: string;
  title: string;
  lessonId: string;
  unitN: number;
  levelId: string;
  createdAt: string;
  dueAt: string | null;
  groupName: string | null;
  tasks: ReviewTask[];
  students: ReviewStudent[];
};

export async function getHomeworkReview(homeworkId: string): Promise<HomeworkReview | null> {
  const supabase = await createClient();

  const { data: homework } = await supabase
    .from('homework')
    .select('id, title, lesson_id, unit_n, level_id, created_at, due_at, group_id, items')
    .eq('id', homeworkId)
    .maybeSingle();

  if (!homework) return null;

  const refs = parseItems(homework.items);

  const [{ data: group }, { data: members }, { data: submissions }] = await Promise.all([
    homework.group_id
      ? supabase.from('groups').select('name').eq('id', homework.group_id).maybeSingle()
      : Promise.resolve({ data: null }),
    homework.group_id
      ? supabase
          .from('group_members')
          .select('student:student_id (id, full_name, avatar_color)')
          .eq('group_id', homework.group_id)
      : Promise.resolve({ data: [] }),
    supabase
      .from('homework_submissions')
      .select('id, student_id, status, score, total, submitted_at')
      .eq('homework_id', homeworkId),
  ]);

  const submissionIds = (submissions ?? []).map((row) => row.id);
  const { data: answers } = submissionIds.length
    ? await supabase
        .from('homework_answers')
        .select('submission_id, item_index, correct')
        .in('submission_id', submissionIds)
    : { data: [] };

  const studentBySubmission = new Map(
    (submissions ?? []).map((row) => [row.id, row.student_id as string]),
  );

  const missed = new Map<number, string[]>();
  const answeredCount = new Map<number, number>();
  for (const row of answers ?? []) {
    answeredCount.set(row.item_index, (answeredCount.get(row.item_index) ?? 0) + 1);
    if (row.correct) continue;
    const studentId = studentBySubmission.get(row.submission_id);
    if (!studentId) continue;
    missed.set(row.item_index, [...(missed.get(row.item_index) ?? []), studentId]);
  }

  const tasks: ReviewTask[] = refs.flatMap((ref, index) => {
    const exercise = resolveItem(homework.level_id, homework.lesson_id, ref);
    if (!exercise) return [];
    const described = describeExercise(exercise);
    return [
      {
        index,
        kind: EXERCISE_NAMES[exercise.t],
        prompt: described.prompt,
        answer: described.answer,
        missedBy: missed.get(index) ?? [],
        answeredBy: answeredCount.get(index) ?? 0,
      },
    ];
  });

  const students: ReviewStudent[] = (members ?? []).flatMap((row) => {
    const student = row.student as unknown as {
      id: string;
      full_name: string;
      avatar_color: string;
    } | null;
    if (!student) return [];

    const submission = (submissions ?? []).find((item) => item.student_id === student.id);
    return [
      {
        id: student.id,
        name: student.full_name,
        avatarColor: student.avatar_color,
        submissionId: submission?.id ?? null,
        status: !submission
          ? 'not started'
          : submission.status === 'submitted'
            ? 'handed in'
            : 'in progress',
        score: submission?.score ?? 0,
        total: submission?.total ?? refs.length,
        submittedAt: submission?.submitted_at ?? null,
      },
    ];
  });

  return {
    id: homework.id,
    title: homework.title,
    lessonId: homework.lesson_id,
    unitN: homework.unit_n,
    levelId: homework.level_id,
    createdAt: homework.created_at,
    dueAt: homework.due_at,
    groupName: (group as { name: string } | null)?.name ?? null,
    tasks: tasks.sort((a, b) => b.missedBy.length - a.missedBy.length || a.index - b.index),
    students: students.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

/** One student's answers, task by task, in the order they were set. */
export async function getSubmissionAnswers(
  submissionId: string,
  levelId: string,
  lessonId: string,
  refs: HomeworkItemRef[],
): Promise<ReviewAnswer[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('homework_answers')
    .select('item_index, given, correct, attempts')
    .eq('submission_id', submissionId);

  const byIndex = new Map((data ?? []).map((row) => [row.item_index, row]));

  return refs.flatMap((ref, index) => {
    const exercise = resolveItem(levelId, lessonId, ref);
    const row = byIndex.get(index);
    if (!exercise || !row) return [];

    const described = describeExercise(exercise);
    return [
      {
        index,
        kind: EXERCISE_NAMES[exercise.t],
        prompt: described.prompt,
        answer: described.answer,
        given: describeGiven(exercise, row.given),
        correct: row.correct,
        attempts: row.attempts,
      },
    ];
  });
}
