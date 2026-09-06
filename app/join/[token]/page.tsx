import type { Metadata } from 'next';
import Link from 'next/link';
import { acceptInvite } from '@/app/join-actions';
import { ActionForm } from '@/components/ActionForm';
import { JoinForm } from '@/components/JoinForm';
import { getSignedInAccount } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Join · English Studio' };

type Props = { params: Promise<{ token: string }> };

export default async function JoinPage({ params }: Props) {
  const { token } = await params;

  const supabase = await createClient();
  const { data } = await supabase.rpc('invite_preview', { _token: token });
  const preview = Array.isArray(data) ? data[0] : null;

  const account = await getSignedInAccount();

  if (!preview) {
    return (
      <main className="auth">
        <section className="auth-hero">
          <p className="auth-eyebrow">English Studio</p>
          <h1 className="auth-title">This link is not valid.</h1>
          <p className="auth-sub">
            It may have expired, or every place on it may already be taken. Ask your teacher for a
            new one — they take a moment to make.
          </p>
        </section>
        <section className="auth-card">
          <h2 className="auth-card-title">Nothing to join</h2>
          <p className="auth-foot">
            Already have an account? <Link href="/login">Log in</Link>.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="auth">
      <section className="auth-hero">
        <p className="auth-eyebrow">English Studio · Elementary A1–A2</p>
        <h1 className="auth-title">{preview.teacher_name} has invited you.</h1>
        <p className="auth-sub">
          You are joining <b>{preview.group_name}</b>. After each lesson your teacher sets a short
          homework here; finishing it opens that lesson so you can go back over the words and the
          grammar whenever you like.
        </p>
      </section>

      <section className="auth-card">
        {account ? (
          <>
            <h2 className="auth-card-title">Join as {account.profile.full_name}</h2>
            <p className="card-text">
              You are already signed in as {account.email}. Accept and this group is added to your
              account.
            </p>
            <ActionForm action={acceptInvite} submitLabel="Accept Invitation">
              <input type="hidden" name="token" value={token} />
            </ActionForm>
          </>
        ) : (
          <>
            <h2 className="auth-card-title">Create your account</h2>
            <JoinForm token={token} />
            <p className="auth-foot">
              Already registered? <Link href="/login">Log in</Link>, then open this link again.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
