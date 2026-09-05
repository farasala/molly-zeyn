import type { Metadata } from 'next';
import { AppHeader } from '@/components/AppHeader';
import { logOut } from '@/app/auth-actions';
import { requireAccount } from '@/lib/auth';

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
  const { full_name: fullName, role, created_at: createdAt } = user.profile;
  const firstName = fullName.trim().split(/\s+/)[0];

  return (
    <div className="shell">
      <AppHeader user={user} />

      <div className="page">
        <section className="welcome">
          <span className="welcome-eyebrow">Signed in</span>
          <h1 className="welcome-title">Welcome, {firstName}.</h1>
          <p className="welcome-sub">
            Your account is live and your progress will be saved to it from the first exercise.
            Lessons, vocabulary and grammar arrive in the next release.
          </p>
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
            The Elementary course — twelve units, vocabulary flashcards, grammar cards for the
            screen share, seven kinds of exercise and speaking practice — is being wired to this
            account now. Nothing you do later will need a second sign-up.
          </p>
        </section>
      </div>
    </div>
  );
}
