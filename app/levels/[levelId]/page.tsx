import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { requireAccount } from '@/lib/auth';
import { getCourse, getLevel, getLevels } from '@/lib/content';
import { EMPTY_ACCESS, getStudentAccess, unitReachable } from '@/lib/access';

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

  const isTeacher = account.user.profile.role === 'teacher';
  const access = isTeacher ? EMPTY_ACCESS : await getStudentAccess(levelId);

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
            const lessonIds = unit.lessons.map((lesson) => lesson.id);
            const reachable = live && unitReachable(isTeacher, lessonIds, access);
            const openCount = lessonIds.filter((id) => access.open.has(id)).length;
            const waiting = lessonIds.some((id) => access.assigned.has(id) && !access.open.has(id));

            const badge = !live
              ? { text: 'Planned', tone: 'is-planned' }
              : reachable
                ? { text: waiting ? 'Homework' : 'Open', tone: 'is-live' }
                : { text: 'Closed', tone: 'is-planned' };

            const footNote = !live
              ? 'Syllabus ready · content in production'
              : !reachable
                ? 'Opens when your teacher sets the homework'
                : waiting
                  ? 'Homework waiting'
                  : openCount > 0
                    ? `${openCount} of ${lessonIds.length} lessons open`
                    : 'Not started';

            const filled = live && lessonIds.length ? (openCount / lessonIds.length) * 100 : 0;

            const inner = (
              <>
                <div className="unit-top">
                  <span className="unit-number">{unit.n}</span>
                  <span className={`badge ${badge.tone}`}>{badge.text}</span>
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
                    <span className="progress-fill" style={{ width: `${filled}%` }} />
                  </span>
                  <span className="unit-progress-label">{footNote}</span>
                </div>
              </>
            );

            const className = `unit-card accent-${unit.accent}${live ? ' is-live' : ''}${
              live && !reachable ? ' is-shut' : ''
            }`;

            // A unit a student cannot enter is not a link: the card is there so
            // they can see where the course goes, not to be clicked at.
            return reachable ? (
              <Link className={className} key={unit.n} href={`/lessons/${unit.lessons[0].id}`}>
                {inner}
              </Link>
            ) : (
              <div className={className} key={unit.n} aria-disabled="true">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
