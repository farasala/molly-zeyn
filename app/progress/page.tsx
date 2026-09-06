import type { Metadata } from 'next';
import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';
import { EMPTY_ACCESS, getStudentAccess } from '@/lib/access';
import { requireAccount } from '@/lib/auth';
import { getTotals } from '@/lib/progress';
import { getUnitProgress } from '@/lib/vocabulary';

export const metadata: Metadata = { title: 'Progress · English Studio' };

const LEVEL_ID = 'elementary';

export default async function ProgressPage() {
  const account = await requireAccount();
  if (account.kind === 'no-profile') return null;

  const isTeacher = account.user.profile.role === 'teacher';
  const access = isTeacher ? EMPTY_ACCESS : await getStudentAccess(LEVEL_ID);

  const [units, totals] = await Promise.all([
    getUnitProgress(LEVEL_ID, isTeacher, access),
    getTotals(account.user.profile.id, LEVEL_ID),
  ]);

  const live = units.filter((unit) => !unit.planned);
  const mastered = live.filter((unit) => unit.lessons > 0 && unit.open === unit.lessons).length;
  const wordsKnown = units.reduce((sum, unit) => sum + unit.wordsKnown, 0);

  return (
    <div className="shell">
      <AppHeader user={account.user} />

      <div className="page">
        <header className="page-head">
          <p className="page-eyebrow">Elementary · A1–A2</p>
          <h1 className="page-title">Progress</h1>
          <p className="page-lead">
            Every figure here comes from the same records as your dashboard: the practice you have
            finished and the words you have marked.
          </p>
        </header>

        <section className="card">
          <h2 className="card-title">Altogether</h2>
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
          <h2 className="card-title">Unit by unit</h2>
          <ul className="progress-list">
            {units.map((unit) => {
              const share = unit.lessons > 0 ? (unit.open / unit.lessons) * 100 : 0;
              const note = unit.planned
                ? 'Content in production'
                : unit.open === 0
                  ? unit.waiting > 0
                    ? 'Homework waiting'
                    : 'Not open yet'
                  : `${unit.open} of ${unit.lessons} lessons open · ${unit.wordsKnown} of ${unit.wordsTotal} words known`;

              return (
                <li className={`progress-row accent-${unit.accent}`} key={unit.n}>
                  <span className="progress-n">{unit.n}</span>
                  <div className="progress-body">
                    <span className="progress-title">{unit.title}</span>
                    <span className="progress-track" role="presentation">
                      <span className="progress-fill" style={{ width: `${share}%` }} />
                    </span>
                    <span className="progress-note">{note}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="card">
          <h2 className="card-title">Your words</h2>
          <p className="card-text">
            {wordsKnown === 0
              ? 'Nothing marked yet. Open the word bank and tick off the ones you are sure of.'
              : `${wordsKnown} marked as known. The bank can show you only what is left.`}
          </p>
          <p>
            <Link className="pill-button is-wide" href="/vocabulary">
              Open the word bank
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
