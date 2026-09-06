import Link from 'next/link';
import type { Metadata } from 'next';
import { AppHeader } from '@/components/AppHeader';
import { logOut } from '@/app/auth-actions';
import { requireAccount } from '@/lib/auth';
import { getTotals } from '@/lib/progress';

export const metadata: Metadata = { title: 'Dashboard · English Studio' };

const JOINED = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export default async function DashboardPage() {
  const account = await requireAccount();

  if (account.kind === 'no-profile') {
    return (
      <div className="shell">
        <div className="page">
          <section className="card">
            <h1 className="card-title">Your account has no profile yet</h1>
            <p className="card-text">
              You are signed in as {account.email}, but there is no row for you in the profiles
              table. Run schema.sql in the Supabase SQL editor so the on_auth_user_created trigger
              exists, then sign up again.
            </p>
            <form action={logOut}>
              <button className="menu-action" type="submit">
                Log out
              </button>
            </form>
          </section>
        </div>
      </div>
    );
  }

  const { user } = account;
  const totals = await getTotals(user.profile.id, 'elementary');
  const { full_name: fullName, role, created_at: createdAt } = user.profile;
  const firstName = fullName.trim().split(/\s+/)[0];

  return (
    <div className="shell">
      <AppHeader user={user} />

      <div className="page">
        <section className="welcome">
          <span className="welcome-eyebrow">Continue learning</span>
          <h1 className="welcome-title">Welcome, {firstName}.</h1>
          <p className="welcome-sub">
            Elementary is open: twelve units, vocabulary flashcards, grammar cards built for the
            screen share, and speaking prompts with model answers.
          </p>
          <div className="welcome-actions">
            <Link className="pill-button is-light" href="/levels/elementary">
              Open the course map
            </Link>
            <Link className="pill-button is-ghost" href="/lessons/1A">
              Start with 1A
            </Link>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">Your progress</h2>
          <p className="card-text">
            {totals.activities === 0
              ? 'Nothing recorded yet. Finish a practice set and it lands here, on every device you sign in from.'
              : 'Counted from every practice run you have finished. The best attempt counts per lesson.'}
          </p>
          <dl className="detail-list">
            <div className="detail">
              <dt>XP</dt>
              <dd>{totals.xp}</dd>
            </div>
            <div className="detail">
              <dt>Practice runs</dt>
              <dd>{totals.activities}</dd>
            </div>
            <div className="detail">
              <dt>Lessons practised</dt>
              <dd>{totals.lessonsPractised}</dd>
            </div>
          </dl>
        </section>

        <section className="card">
          <h2 className="card-title">Your account</h2>
          <p className="card-text">
            {role === 'teacher'
              ? 'You are set up as a teacher. Groups and the student roster come with the teacher cabinet.'
              : 'You are set up as a student. Everything you finish will be recorded here.'}
          </p>
          <dl className="detail-list">
            <div className="detail">
              <dt>Name</dt>
              <dd>{fullName}</dd>
            </div>
            <div className="detail">
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="detail">
              <dt>Role</dt>
              <dd>{role === 'teacher' ? 'Teacher' : 'Student'}</dd>
            </div>
            <div className="detail">
              <dt>Joined</dt>
              <dd>{JOINED.format(new Date(createdAt))}</dd>
            </div>
          </dl>
        </section>

        <section className="card">
          <h2 className="card-title">What comes next</h2>
          <p className="card-text">
            Homework is the next piece: after a lesson your teacher sets a short set drawn from
            what you covered, and finishing it opens that lesson here for revision.
          </p>
        </section>
      </div>
    </div>
  );
}
