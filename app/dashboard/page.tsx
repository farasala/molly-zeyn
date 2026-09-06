import Link from 'next/link';
import type { Metadata } from 'next';
import { AppHeader } from '@/components/AppHeader';
import { logOut } from '@/app/auth-actions';
import { requireAccount } from '@/lib/auth';
import { getTotals } from '@/lib/progress';
import { EMPTY_ACCESS, getStudentAccess } from '@/lib/access';
import { getUnitProgress } from '@/lib/vocabulary';
import { createClient } from '@/lib/supabase/server';
import { StudentHomework } from '@/components/lesson/HomeworkStage';

export const metadata: Metadata = { title: 'Dashboard · English Studio' };

/** Every assignment this student can see, newest first, with its state. */
async function getStudentDashboardHomework(studentId: string) {
  const supabase = await createClient();

  const { data: homework } = await supabase
    .from('homework')
    .select('id, lesson_id, unit_n, title, due_at, created_at, group_id, student_id, items')
    .order('created_at', { ascending: false });

  if (!homework?.length) return [];

  const { data: submissions } = await supabase
    .from('homework_submissions')
    .select('id, homework_id, student_id, status, score, total, submitted_at')
    .eq('student_id', studentId);

  return homework.map((row) => ({
    homework: {
      id: row.id,
      lesson_id: row.lesson_id,
      unit_n: row.unit_n,
      title: row.title,
      due_at: row.due_at,
      created_at: row.created_at,
      group_id: row.group_id,
      student_id: row.student_id,
      item_count: Array.isArray(row.items) ? row.items.length : 0,
    },
    submission: submissions?.find((item) => item.homework_id === row.id) ?? null,
  }));
}

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
  const isTeacher = user.profile.role === 'teacher';
  const access = isTeacher ? EMPTY_ACCESS : await getStudentAccess('elementary');
  const totals = await getTotals(user.profile.id, 'elementary');
  const homework = isTeacher ? [] : await getStudentDashboardHomework(user.profile.id);

  // Read the same way the progress page and the account page read them, so the
  // three screens cannot drift apart.
  const units = await getUnitProgress('elementary', isTeacher, access);
  const wordsKnown = units.reduce((sum, unit) => sum + unit.wordsKnown, 0);
  const mastered = units.filter(
    (unit) => !unit.planned && unit.lessons > 0 && unit.open === unit.lessons,
  ).length;
  const { full_name: fullName } = user.profile;
  const firstName = fullName.trim().split(/\s+/)[0];

  return (
    <div className="shell">
      <AppHeader user={user} />

      <div className="page">
        <section className="welcome">
          <span className="welcome-eyebrow">Continue learning</span>
          <h1 className="welcome-title">Welcome, {firstName}.</h1>
          <p className="welcome-sub">
            {isTeacher
              ? 'Every unit is open to you. Set homework from a lesson and it appears on your students’ dashboards.'
              : 'You work through a lesson with your teacher, then the homework for it turns up here. Finishing it opens that lesson for you to go back over.'}
          </p>
          <div className="welcome-actions">
            <Link className="pill-button is-light" href="/levels/elementary">
              {isTeacher ? 'Open the course map' : 'See the course'}
            </Link>
            {isTeacher && (
              <Link className="pill-button is-ghost" href="/teacher">
                Groups and students
              </Link>
            )}
          </div>
        </section>

        {!isTeacher && (
          <section className="stage-card">
            <h2 className="card-title">Your homework</h2>
            {homework.length === 0 ? (
              <p className="card-text">
                Nothing set yet. After a lesson your teacher puts a short set here; finishing it
                opens that lesson so you can go back over it.
              </p>
            ) : (
              <StudentHomework rows={homework} lessonId={homework[0].homework.lesson_id} />
            )}
          </section>
        )}

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
          <p>
            <Link className="pill-button is-wide" href="/progress">
              See it unit by unit
            </Link>
          </p>
        </section>

      </div>
    </div>
  );
}
