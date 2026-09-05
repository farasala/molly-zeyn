import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { requireAccount } from '@/lib/auth';
import { getCourse, getLevel, getLevels } from '@/lib/content';

type Params = { params: Promise<{ levelId: string }> };

export function generateStaticParams() {
  return getLevels()
    .filter((level) => level.status === 'ready')
    .map((level) => ({ levelId: level.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { levelId } = await params;
  const level = getLevel(levelId);
  return { title: level ? `${level.name} · English Studio` : 'English Studio' };
}

export default async function CourseMapPage({ params }: Params) {
  const { levelId } = await params;
  const account = await requireAccount();
  if (account.kind === 'no-profile') return null;

  const course = getCourse(levelId);
  const level = getLevel(levelId);
  if (!course || !level) notFound();

  return (
    <div className="shell">
      <AppHeader user={account.user} />

      <div className="page">
        <header className="page-head">
          <p className="page-eyebrow">
            <Link href="/levels">Levels</Link> · {level.cefr}
          </p>
          <h1 className="page-title">{course.name}</h1>
          <p className="page-lead">{course.note}</p>
        </header>

        <div className="unit-grid">
          {course.units.map((unit) => {
            const live = !unit.locked;
            return (
              <Link
                className={`unit-card accent-${unit.accent}${live ? ' is-live' : ''}`}
                key={unit.n}
                href={`/lessons/${unit.lessons[0].id}`}
              >
                <div className="unit-top">
                  <span className="unit-number">{unit.n}</span>
                  <span className={`badge ${live ? 'is-live' : 'is-planned'}`}>
                    {live ? 'Live' : 'Planned'}
                  </span>
                </div>

                <div className="unit-headings">
                  <h2 className="unit-title">{unit.title}</h2>
                  <p className="unit-theme">{unit.theme}</p>
                </div>

                <ul className="unit-lessons">
                  {unit.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <span className="unit-lesson-id">{lesson.id}</span>
                      <span>{lesson.g}</span>
                    </li>
                  ))}
                </ul>

                <div className="unit-foot">
                  <span className="progress-track" role="presentation">
                    <span className="progress-fill" style={{ width: '0%' }} />
                  </span>
                  <span className="unit-progress-label">
                    {live ? 'Not started' : 'Syllabus ready · content in production'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
