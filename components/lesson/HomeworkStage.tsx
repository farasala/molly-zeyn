import Link from 'next/link';
import { ActionForm } from '@/components/ActionForm';
import { assignHomework, deleteHomework } from '@/app/teacher-actions';
import { startHomework } from '@/app/homework-actions';
import type { AssignedHomework, Student, SubmissionRow } from '@/lib/teaching';

type StudentView = {
  homework: AssignedHomework;
  submission: SubmissionRow | null;
}[];

/** What a student sees: the assignments set for this lesson, and their state. */
export function StudentHomework({ rows, lessonId }: { rows: StudentView; lessonId: string }) {
  if (rows.length === 0) {
    return (
      <section className="stage-card">
        <h2 className="card-title">No homework for this lesson yet</h2>
        <p className="card-text">
          Your teacher sets it after the lesson. It will show up here and on your dashboard.
        </p>
      </section>
    );
  }

  return (
    <section className="hw-grid">
      {rows.map(({ homework, submission }) => {
        const submitted = submission?.status === 'submitted';
        return (
          <article className="hw-card" key={homework.id}>
            <span className="hw-eyebrow">
              Unit {homework.unit_n} · {homework.item_count} tasks
            </span>
            <h2 className="hw-title">{homework.title}</h2>
            {homework.due_at && (
              <p className="hw-due">
                Due {new Date(homework.due_at).toLocaleDateString('en-GB')}
              </p>
            )}

            <div className="hw-foot">
              {submitted ? (
                <>
                  <p className="hw-state is-done">
                    Handed in · {submission.score} of {submission.total} right first time
                  </p>
                  <Link className="pill-button" href={`/lessons/${lessonId}`}>
                    Lesson is open
                  </Link>
                </>
              ) : (
                <form action={startHomework}>
                  <input type="hidden" name="homeworkId" value={homework.id} />
                  <button className="pill-button is-primary" type="submit">
                    {submission ? 'Carry On' : 'Start Homework'}
                  </button>
                </form>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}

type TeacherProps = {
  lessonId: string;
  students: Student[];
  assigned: AssignedHomework[];
  submissions: SubmissionRow[];
};

/** What the teacher sees: pick names, set it, and who has done it. */
export function TeacherHomework({ lessonId, students, assigned, submissions }: TeacherProps) {
  const byHomework = new Map<string, SubmissionRow[]>();
  for (const row of submissions) {
    const list = byHomework.get(row.homework_id) ?? [];
    list.push(row);
    byHomework.set(row.homework_id, list);
  }

  const nameOf = (id: string | null) =>
    students.find((student) => student.id === id)?.full_name ?? 'A student no longer on your roster';

  return (
    <>
      <section className="stage-card">
        <h2 className="card-title">Set homework for {lessonId}</h2>
        <p className="card-text">
          The tasks are drawn from this lesson: its word list, its exercises, and a couple of
          items from the unit test. Finishing it opens the lesson for that student.
        </p>

        {students.length === 0 ? (
          <p className="card-text">
            You have no students yet. <Link href="/teacher">Send your invitation link</Link> first.
          </p>
        ) : (
          <ActionForm
            className="assign-form"
            action={assignHomework}
            submitLabel="Set Homework"
            pendingLabel="Setting…"
          >
            <input type="hidden" name="lessonId" value={lessonId} />
            <fieldset className="student-picker">
              <legend className="field-label">Students</legend>
              {students.map((student) => (
                <label className="student-check" key={student.id}>
                  <input type="checkbox" name="studentIds" value={student.id} defaultChecked />
                  {student.full_name}
                </label>
              ))}
            </fieldset>
            <label className="field">
              <span className="field-label">Due (optional)</span>
              <input className="field-input" type="date" name="dueAt" />
            </label>
          </ActionForm>
        )}
      </section>

      {assigned.length > 0 && (
        <section className="stage-card">
          <h2 className="card-title">Already set</h2>
          <ul className="hw-list">
            {assigned.map((homework) => {
              const rows = byHomework.get(homework.id) ?? [];
              const done = rows.filter((row) => row.status === 'submitted');

              return (
                <li className="hw-row" key={homework.id}>
                  <div className="hw-row-main">
                    <span className="hw-row-title">
                      {nameOf(homework.student_id)} · set{' '}
                      {new Date(homework.created_at).toLocaleDateString('en-GB')}
                    </span>
                    <span className="hw-row-sub">
                      {done.length > 0
                        ? `Handed in · ${done.map((row) => `${row.score}/${row.total}`).join(', ')}`
                        : 'Not handed in yet'}
                    </span>
                  </div>
                  <div className="hw-row-actions">
                    <Link className="pill-button" href={`/teacher/homework/${homework.id}`}>
                      Review
                    </Link>
                    <ActionForm action={deleteHomework} submitLabel="Remove" variant="danger">
                      <input type="hidden" name="homeworkId" value={homework.id} />
                    </ActionForm>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}
