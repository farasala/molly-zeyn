import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { HomeworkRunner } from '@/components/practice/HomeworkRunner';
import { requireAccount } from '@/lib/auth';
import { getUnit } from '@/lib/content';
import { parseItems, publicItems } from '@/lib/homework';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Homework · English Studio' };

type Props = { params: Promise<{ id: string }> };

export default async function HomeworkPage({ params }: Props) {
  const { id } = await params;

  const account = await requireAccount();
  if (account.kind === 'no-profile') return null;
  const { user } = account;

  const supabase = await createClient();

  // RLS hands this back only to the student it was set for, or its teacher.
  const { data: homework } = await supabase
    .from('homework')
    .select('id, level_id, unit_n, lesson_id, title, note, due_at, items')
    .eq('id', id)
    .maybeSingle();

  if (!homework) notFound();

  const { data: submission } = await supabase
    .from('homework_submissions')
    .select('id, status, score, total')
    .eq('homework_id', id)
    .eq('student_id', user.profile.id)
    .maybeSingle();

  if (!submission) redirect('/dashboard');

  const refs = parseItems(homework.items);
  const items = publicItems(homework.level_id, homework.lesson_id, refs, `/api/hw-clip/${id}`);

  const { data: answerRows } = await supabase
    .from('homework_answers')
    .select('item_index, correct')
    .eq('submission_id', submission.id);

  const answered: Record<number, boolean> = {};
  for (const row of answerRows ?? []) answered[row.item_index] = row.correct;

  const unit = getUnit(homework.level_id, homework.unit_n);
  const accent = unit?.accent ?? 'mint';

  if (submission.status === 'submitted') {
    return (
      <div className="shell">
        <AppHeader user={user} />
        <div className={`page accent-${accent}`}>
          <section className="stage-card">
            <span className="score-eyebrow">Handed in</span>
            <h1 className="score-title">
              {submission.score} of {submission.total} right first time
            </h1>
            <p className="card-text">
              You have finished this one. Lesson {homework.lesson_id} is open — go back over the
              vocabulary and the grammar card whenever you like.
            </p>
            <div className="score-actions">
              <Link className="pill-button is-primary" href={`/lessons/${homework.lesson_id}`}>
                Open lesson {homework.lesson_id}
              </Link>
              <Link className="pill-button" href="/dashboard">
                Back to your dashboard
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <AppHeader user={user} />
      <div className={`page accent-${accent}`}>
        <section className="lesson-head">
          <div className="lesson-head-top">
            <div className="lesson-identity">
              <span className="lesson-badge">{homework.lesson_id}</span>
              <div>
                <h1 className="lesson-title">Homework · {homework.title}</h1>
                <p className="lesson-meta">
                  Unit {homework.unit_n} · {unit?.title} — {items.length} tasks
                  {homework.due_at
                    ? ` · due ${new Date(homework.due_at).toLocaleDateString('en-GB')}`
                    : ''}
                </p>
              </div>
            </div>
            <Link className="pill-button" href="/dashboard">
              ← Dashboard
            </Link>
          </div>
        </section>

        <HomeworkRunner
          submissionId={submission.id}
          lessonId={homework.lesson_id}
          title={homework.title}
          items={items}
          answered={answered}
        />
      </div>
    </div>
  );
}
