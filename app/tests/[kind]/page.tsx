import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { TestRunner } from '@/components/practice/TestRunner';
import { requireAccount } from '@/lib/auth';
import { getCourseTest, testItems, type TestKind } from '@/lib/coursetest';
import { createClient } from '@/lib/supabase/server';

const LEVEL_ID = 'elementary';

export const metadata: Metadata = { title: 'Test · English Studio' };

type Props = {
  params: Promise<{ kind: string }>;
  searchParams: Promise<{ again?: string }>;
};

export default async function TestPage({ params, searchParams }: Props) {
  const { kind } = await params;
  const { again } = await searchParams;
  if (kind !== 'entry' && kind !== 'final') notFound();

  const account = await requireAccount();
  if (account.kind === 'no-profile') return null;
  const { user } = account;

  const test = getCourseTest(LEVEL_ID, kind as TestKind);
  if (!test) notFound();

  const supabase = await createClient();
  const { data: taken } = await supabase
    .from('activity_results')
    .select('score, total, unit_n, created_at')
    .eq('user_id', user.profile.id)
    .eq('level_id', LEVEL_ID)
    .eq('kind', kind)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const items = testItems(test, kind as TestKind);

  return (
    <div className="shell">
      <AppHeader user={user} />

      <div className="page accent-teal">
        <section className="lesson-head">
          <div className="lesson-head-top">
            <div className="lesson-identity">
              <span className="lesson-badge">{kind === 'entry' ? 'IN' : 'OUT'}</span>
              <div>
                <h1 className="lesson-title">{test.title}</h1>
                <p className="lesson-meta">
                  Elementary · {items.length} questions ·{' '}
                  {kind === 'entry' ? 'before you start' : 'after unit 12'}
                </p>
              </div>
            </div>
            <Link className="pill-button" href="/dashboard">
              ← Dashboard
            </Link>
          </div>
        </section>

        {taken && !again ? (
          <section className="stage-card">
            <span className="score-eyebrow">Already taken</span>
            <h2 className="score-title">
              {taken.score} of {taken.total} correct
            </h2>
            {kind === 'entry' && taken.unit_n > 0 && (
              <p className="score-xp">Start at unit {taken.unit_n}</p>
            )}
            <p className="card-text">
              You sat this on {new Date(taken.created_at).toLocaleDateString('en-GB')}. Your teacher
              can see the result. Taking it again keeps both — nothing is overwritten.
            </p>
            <div className="score-actions">
              <Link className="pill-button is-primary" href={`/tests/${kind}?again=1`}>
                Take it again
              </Link>
              <Link className="pill-button" href="/dashboard">
                Back to your dashboard
              </Link>
            </div>
          </section>
        ) : (
          <TestRunner kind={kind as TestKind} title={test.title} blurb={test.blurb} items={items} />
        )}
      </div>
    </div>
  );
}
