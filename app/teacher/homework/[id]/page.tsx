import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { getTeacher } from '@/lib/auth';
import { parseItems } from '@/lib/homework';
import { getHomeworkReview, getSubmissionAnswers } from '@/lib/review';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Homework · English Studio' };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ student?: string }>;
};

const WHEN = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export default async function HomeworkReviewPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { student: studentParam } = await searchParams;

  const teacher = await getTeacher();
  if (!teacher) redirect('/dashboard');

  const review = await getHomeworkReview(id);
  if (!review) notFound();

  const handedIn = review.students.filter((student) => student.status === 'handed in');
  const chosen = studentParam
    ? review.students.find((student) => student.id === studentParam)
    : undefined;

  let answers: Awaited<ReturnType<typeof getSubmissionAnswers>> = [];
  if (chosen?.submissionId) {
    const supabase = await createClient();
    const { data: homework } = await supabase
      .from('homework')
      .select('items')
      .eq('id', id)
      .maybeSingle();

    answers = await getSubmissionAnswers(
      chosen.submissionId,
      review.levelId,
      review.lessonId,
      parseItems(homework?.items),
    );
  }

  return (
    <div className="shell">
      <AppHeader user={teacher} />

      <div className="page">
        <header className="page-head">
          <p className="page-eyebrow">
            <Link href="/teacher">Groups</Link> · Unit {review.unitN} ·{' '}
            <Link href={`/lessons/${review.lessonId}?stage=homework`}>{review.lessonId}</Link>
          </p>
          <h1 className="page-title">{review.title}</h1>
          <p className="page-lead">
            Set for {review.groupName ?? 'one student'} on{' '}
            {new Date(review.createdAt).toLocaleDateString('en-GB')} ·{' '}
            {handedIn.length} of {review.students.length} handed in.
          </p>
        </header>

        <section className="card">
          <h2 className="card-title">Who has done it</h2>
          {review.students.length === 0 ? (
            <p className="card-text">Nobody is in this group yet.</p>
          ) : (
            <ul className="student-list">
              {review.students.map((student) => (
                <li className="student-row" key={student.id}>
                  <span
                    className="avatar is-small"
                    style={{ background: student.avatarColor }}
                    aria-hidden="true"
                  >
                    {student.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="student-name">{student.name}</span>
                  <span className={`badge ${student.status === 'handed in' ? 'is-live' : 'is-planned'}`}>
                    {student.status}
                  </span>
                  {student.status !== 'not started' && (
                    <span className="student-score">
                      {student.score} / {student.total}
                      {student.submittedAt && ` · ${WHEN.format(new Date(student.submittedAt))}`}
                    </span>
                  )}
                  {student.submissionId && (
                    <Link
                      className="pill-button"
                      href={`/teacher/homework/${id}?student=${student.id}`}
                    >
                      {chosen?.id === student.id ? 'Showing' : 'See answers'}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {chosen && (
          <section className="card">
            <h2 className="card-title">{chosen.name} — every task</h2>
            {answers.length === 0 ? (
              <p className="card-text">Nothing answered yet.</p>
            ) : (
              <ol className="answer-list">
                {answers.map((row) => (
                  <li className={`answer-row${row.correct ? '' : ' is-wrong'}`} key={row.index}>
                    <span className="answer-kind">{row.kind}</span>
                    <p className="answer-prompt">{row.prompt}</p>
                    <p className="answer-given">
                      <span className="answer-label">Wrote</span> {row.given || '—'}
                    </p>
                    {!row.correct && (
                      <p className="answer-expected">
                        <span className="answer-label">Answer</span> {row.answer}
                      </p>
                    )}
                    {row.attempts > 1 && (
                      <span className="answer-attempts">
                        got there after {row.attempts} attempts
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}

        <section className="card">
          <h2 className="card-title">What the group found hardest</h2>
          <p className="card-text">
            Counted on first answers only, so a task that came back around does not hide a miss.
            Start the lesson at the top of this list.
          </p>

          {review.tasks.every((task) => task.answeredBy === 0) ? (
            <p className="card-text">Nobody has answered anything yet.</p>
          ) : (
            <ol className="task-list">
              {review.tasks
                .filter((task) => task.answeredBy > 0)
                .map((task) => (
                  <li className="task-row" key={task.index}>
                    <span className="task-miss">
                      {task.missedBy.length} / {task.answeredBy}
                    </span>
                    <span className="task-detail">
                      <span className="task-kind">{task.kind}</span>
                      <span className="task-prompt">{task.prompt}</span>
                      <span className="task-answer">{task.answer}</span>
                    </span>
                  </li>
                ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
