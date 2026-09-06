import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createGroup, createInvite, revokeInvite } from '@/app/teacher-actions';
import { ActionForm } from '@/components/ActionForm';
import { AppHeader } from '@/components/AppHeader';
import { InviteLink } from '@/components/teacher/InviteLink';
import { getTeacher } from '@/lib/auth';
import { getGroups, getInvites } from '@/lib/teaching';

export const metadata: Metadata = { title: 'Groups · English Studio' };

export default async function TeacherPage() {
  const teacher = await getTeacher();
  if (!teacher) redirect('/dashboard');

  const groups = await getGroups(teacher.profile.id);
  const invites = await getInvites(teacher.profile.id);

  return (
    <div className="shell">
      <AppHeader user={teacher} />

      <div className="page">
        <header className="page-head">
          <p className="page-eyebrow">Teaching</p>
          <h1 className="page-title">Groups and students</h1>
          <p className="page-lead">
            A group is however you teach: a class, or a single student on their own. Students join
            through a link — there is no open sign-up, so nobody arrives by accident.
          </p>
        </header>

        <section className="card">
          <h2 className="card-title">New group</h2>
          <ActionForm className="inline-form" action={createGroup} submitLabel="Create Group">
            <label className="field">
              <span className="field-label">Name</span>
              <input
                className="field-input"
                name="name"
                placeholder="Aigerim · Tue and Thu"
                required
                minLength={2}
              />
            </label>
          </ActionForm>
        </section>

        {groups.length === 0 ? (
          <section className="card">
            <h2 className="card-title">No groups yet</h2>
            <p className="card-text">
              Create one above, then make an invitation link for it and send that to your student.
            </p>
          </section>
        ) : (
          groups.map((group) => {
            const groupInvites = invites.filter((invite) => invite.group_id === group.id);

            return (
              <section className="card" key={group.id}>
                <h2 className="card-title">{group.name}</h2>

                {group.students.length === 0 ? (
                  <p className="card-text">
                    Nobody has joined yet. Send them the invitation link below.
                  </p>
                ) : (
                  <ul className="student-list">
                    {group.students.map((student) => (
                      <li className="student-row" key={student.id}>
                        <span
                          className="avatar is-small"
                          style={{ background: student.avatar_color }}
                          aria-hidden="true"
                        >
                          {student.full_name.trim().charAt(0).toUpperCase()}
                        </span>
                        <span className="student-name">{student.full_name}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="invite-block">
                  {groupInvites.map((invite) => (
                    <InviteLink
                      key={invite.token}
                      token={invite.token}
                      used={invite.used_count}
                      max={invite.max_uses}
                      expiresAt={invite.expires_at}
                      revoke={revokeInvite}
                    />
                  ))}

                  <ActionForm
                    action={createInvite}
                    submitLabel={groupInvites.length ? 'New Link' : 'Create Invitation Link'}
                    variant="plain"
                  >
                    <input type="hidden" name="groupId" value={group.id} />
                  </ActionForm>
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
