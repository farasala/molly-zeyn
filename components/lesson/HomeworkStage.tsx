import Link from 'next/link';
import { ActionForm } from '@/components/ActionForm';
import { assignHomework, deleteHomework } from '@/app/teacher-actions';
import { startHomework } from '@/app/homework-actions';
import type { AssignedHomework, GroupWithStudents, SubmissionRow } from '@/lib/teaching';

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
  groups: GroupWithStudents[];
  assigned: AssignedHomework[];
  submissions: SubmissionRow[];
};

/** What the teacher sees: set it, and who has done it. */
export function TeacherHomework({ lessonId, groups, assigned, submissions }: TeacherProps) {
  const byHomework = new Map<string, SubmissionRow[]>();
  for (const row of submissions) {
    const list = byHomework.get(row.homework_id) ?? [];
    list.push(row);
    byHomework.set(row.homework_id, list);
  }

  return (
    <>
      <section className="stage-card">
        <h2 className="card-title">Set homework for {lessonId}</h2>
        <p className="card-text">
          The tasks are drawn from this lesson: its word list, its exercises, and a couple of
          items from the unit test. Finishing it opens the lesson for that student.
        </p>

        {groups.length === 0 ? (
          <p className="card-text">
            You have no groups yet. <Link href="/teacher">Create one first</Link> — a one-to-one
            student is a group of one.
          </p>
        ) : (
          <ActionForm
            className="assign-form"
            action={assignHomework}
            submitLabel="Set Homework"
            pendingLabel="Setting…"
          >
            <input type="hidden" name="lessonId" value={lessonId} />
            <label className="field">
              <span className="field-label">Group</span>
              <select className="field-input" name="groupId" defaultValue={groups[0].id}>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({group.students.length})
                  </option>
                ))}
              </select>
            </label>
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
              const group = groups.find((item) => item.id === homework.group_id);
              const done = rows.filter((row) => row.status === 'submitted');

              return (
                <li className="hw-row" key={homework.id}>
                  <div className="hw-row-main">
                    <span className="hw-row-title">
                      {group?.name ?? 'One student'} · set{' '}
                      {new Date(homework.created_at).toLocaleDateString('en-GB')}
                    </span>
                    <span className="hw-row-sub">
                      {done.length} of {group?.students.length ?? rows.length} handed in
                      {done.length > 0 &&
                        ` · ${done.map((row) => `${row.score}/${row.total}`).join(', ')}`}
                    </span>
                  </div>
                  <ActionForm action={deleteHomework} submitLabel="Remove" variant="danger">
                    <input type="hidden" name="homeworkId" value={homework.id} />
                  </ActionForm>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}
