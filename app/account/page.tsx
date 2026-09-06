import type { Metadata } from 'next';
import { renameSelf } from '@/app/account-actions';
import { logOut } from '@/app/auth-actions';
import { ActionForm } from '@/components/ActionForm';
import { AppHeader } from '@/components/AppHeader';
import { EMPTY_ACCESS, getStudentAccess } from '@/lib/access';
import { requireAccount } from '@/lib/auth';
import { getTotals } from '@/lib/progress';
import { createClient } from '@/lib/supabase/server';
import { getUnitProgress } from '@/lib/vocabulary';

export const metadata: Metadata = { title: 'Your account · English Studio' };

const LEVEL_ID = 'elementary';

const WHEN = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export default async function AccountPage() {
  const account = await requireAccount();
  if (account.kind === 'no-profile') return null;

  const { user } = account;
  const isTeacher = user.profile.role === 'teacher';
  const access = isTeacher ? EMPTY_ACCESS : await getStudentAccess(LEVEL_ID);

  const [totals, units] = await Promise.all([
    getTotals(user.profile.id, LEVEL_ID),
    getUnitProgress(LEVEL_ID, isTeacher, access),
  ]);

  const supabase = await createClient();
  const { data: recent } = await supabase
    .from('activity_results')
    .select('lesson_id, unit_n, score, total, xp, created_at')
    .eq('user_id', user.profile.id)
    .order('created_at', { ascending: false })
    .limit(8);

  const wordsKnown = units.reduce((sum, unit) => sum + unit.wordsKnown, 0);
  const mastered = units.filter(
    (unit) => !unit.planned && unit.lessons > 0 && unit.open === unit.lessons,
  ).length;

  return (
    <div className="shell">
      <AppHeader user={user} />

      <div className="page">
        <header className="page-head">
          <p className="page-eyebrow">{isTeacher ? 'Teacher' : 'Student'}</p>
          <h1 className="page-title">Your account</h1>
        </header>

        <section className="card">
          <h2 className="card-title">Name</h2>
          <p className="card-text">
            This is what your teacher sees next to your work. Your email cannot be changed here.
          </p>
          <ActionForm className="inline-form" action={renameSelf} submitLabel="Save Name">
            <label className="field">
              <span className="field-label">Full name</span>
              <input
                className="field-input"
                name="fullName"
                defaultValue={user.profile.full_name}
                required
                minLength={2}
                maxLength={80}
              />
            </label>
          </ActionForm>
          <dl className="detail-list">
            <div className="detail">
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="detail">
              <dt>Role</dt>
              <dd>{isTeacher ? 'Teacher' : 'Student'}</dd>
            </div>
          </dl>
        </section>

        <section className="card">
          <h2 className="card-title">Your figures</h2>
          <p className="card-text">
            The same numbers as the dashboard and the progress page — all three read the records,
            none of them keep their own count.
          </p>
          <dl className="detail-list">
            <div className="detail">
              <dt>XP</dt>
              <dd>{totals.xp}</dd>
            </div>
            <div className="detail">
              <dt>Words known</dt>
              <dd>{wordsKnown}</dd>
            </div>
            <div className="detail">
              <dt>Practice runs</dt>
              <dd>{totals.activities}</dd>
            </div>
            <div className="detail">
              <dt>Units finished</dt>
              <dd>{mastered}</dd>
            </div>
          </dl>
        </section>

        <section className="card">
          <h2 className="card-title">Last results</h2>
          {!recent?.length ? (
            <p className="card-text">Nothing yet. Practice from an open lesson and it lands here.</p>
          ) : (
            <ul className="result-list">
              {recent.map((row, index) => (
                <li className="result-row" key={`${row.lesson_id}-${index}`}>
                  <span className="result-lesson">{row.lesson_id ?? `Unit ${row.unit_n}`}</span>
                  <span className="result-score">
                    {row.score} / {row.total}
                  </span>
                  <span className="result-xp">+{row.xp} XP</span>
                  <span className="result-when">{WHEN.format(new Date(row.created_at))}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2 className="card-title">Sign out</h2>
          <p className="card-text">
            Your progress stays on your account — sign back in anywhere and it is all there.
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
