import type { Metadata } from 'next';
import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';
import { requireAccount } from '@/lib/auth';
import { getLevels } from '@/lib/content';

export const metadata: Metadata = { title: 'Levels · English Studio' };

export default async function LevelsPage() {
  const account = await requireAccount();
  if (account.kind === 'no-profile') return null;

  const levels = getLevels();

  return (
    <div className="shell">
      <AppHeader user={account.user} />

      <div className="page">
        <header className="page-head">
          <p className="page-eyebrow">Course library</p>
          <h1 className="page-title">Levels</h1>
          <p className="page-lead">
            Elementary is live. Every other level runs on the same lesson engine — a course file
            drops in and it appears here, with no change to your account or your progress.
          </p>
        </header>

        <div className="level-grid">
          {levels.map((level) => {
            const ready = level.status === 'ready';
            const card = (
              <>
                <div className="level-top">
                  <span className="level-cefr">{level.cefr}</span>
                  <span className={`badge ${ready ? 'is-live' : 'is-planned'}`}>
                    {ready ? 'Live' : 'Planned'}
                  </span>
                </div>
                <h2 className="level-name">{level.name}</h2>
                <p className="level-blurb">{level.blurb}</p>
                <span className="level-foot">
                  {level.units} units{ready ? ' · open the course map' : ' · syllabus mapped'}
                </span>
              </>
            );

            return ready ? (
              <Link className="level-card is-ready" key={level.id} href={`/levels/${level.id}`}>
                {card}
              </Link>
            ) : (
              <div className="level-card" key={level.id} aria-disabled="true">
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
