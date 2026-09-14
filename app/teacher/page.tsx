import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createInvite, revokeInvite } from '@/app/teacher-actions';
import { ActionForm } from '@/components/ActionForm';
import { AppHeader } from '@/components/AppHeader';
import { InviteLink } from '@/components/teacher/InviteLink';
import { getTeacher } from '@/lib/auth';
import { getInvites, getRoster, getStudentTests } from '@/lib/teaching';

export const metadata: Metadata = { title: 'Students · English Studio' };

export default async function TeacherPage() {
  const teacher = await getTeacher();
  if (!teacher) redirect('/dashboard');

  const roster = await getRoster(teacher.profile.id);
  const [invites, tests] = await Promise.all([
    getInvites(teacher.profile.id),
    getStudentTests(roster.map((student) => student.id), 'elementary'),
  ]);

  const activeInvites = invites.filter(
    (invite) => invite.used_count < invite.max_uses && new Date(invite.expires_at) > new Date(),
  );

  return (
    <div className="shell">
      <AppHeader user={teacher} />

      <div className="page">
        <header className="page-head">
          <p className="page-eyebrow">Teaching</p>
          <h1 className="page-title">Your students</h1>
          <p className="page-lead">
            Send a new student the link below once. They register, and they show up in the list —
            no group to set up first.
          </p>
        </header>

        <section className="card">
          <h2 className="card-title">Invitation link</h2>
          {activeInvites.length === 0 ? (
            <ActionForm action={createInvite} submitLabel="Create Your Invitation Link" />
          ) : (
            <div className="invite-block">
              {activeInvites.map((invite) => (
                <InviteLink
                  key={invite.token}
                  token={invite.token}
                  used={invite.used_count}
                  max={invite.max_uses}
                  expiresAt={invite.expires_at}
                  revoke={revokeInvite}
                />
              ))}
              <ActionForm action={createInvite} submitLabel="New Link" variant="plain" />
            </div>
          )}
        </section>

        <section className="card">
          <h2 className="card-title">
            {roster.length === 0
              ? 'No students yet'
              : `${roster.length} student${roster.length === 1 ? '' : 's'}`}
          </h2>

          {roster.length === 0 ? (
            <p className="card-text">Nobody has joined yet. Send them the link above.</p>
          ) : (
            <ul className="student-list">
              {roster.map((student) => {
                const record = tests.get(student.id);
                return (
                  <li className="student-row" key={student.id}>
                    <span
                      className="avatar is-small"
                      style={{ background: student.avatar_color }}
                      aria-hidden="true"
                    >
                      {student.full_name.trim().charAt(0).toUpperCase()}
                    </span>
                    <span className="student-name">{student.full_name}</span>
                    <span className="student-score">
                      {record?.entry
                        ? `Placement ${record.entry.score}/${record.entry.total} · start unit ${record.entry.startAt}`
                        : 'No placement test'}
                    </span>
                    {record?.final && (
                      <span className="student-score">
                        End of course {record.final.score}/{record.final.total}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
