import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Role } from '@/lib/auth-state';

export type Profile = {
  id: string;
  full_name: string;
  role: Role;
  avatar_color: string;
  created_at: string;
};

export type SignedInUser = {
  email: string;
  profile: Profile;
};

export type AccountState =
  | { kind: 'signed-in'; user: SignedInUser }
  | { kind: 'no-profile'; email: string };

/**
 * Reads the session and the matching `profiles` row.
 * Sends signed-out visitors to the login screen.
 *
 * The profile row is created by the `on_auth_user_created` trigger in schema.sql.
 * If it is missing, the trigger has not been installed — that is reported, not hidden,
 * because redirecting would bounce against the middleware forever.
 */
export async function requireAccount(): Promise<AccountState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, avatar_color, created_at')
    .eq('id', user.id)
    .maybeSingle<Profile>();

  if (error) throw new Error(`Could not read your profile: ${error.message}`);

  const email = user.email ?? '';
  if (!profile) return { kind: 'no-profile', email };

  return { kind: 'signed-in', user: { email, profile } };
}

/**
 * The signed-in user, or null — for pages a signed-out visitor may also see,
 * like an invitation link.
 */
export async function getSignedInAccount(): Promise<SignedInUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role, avatar_color, created_at')
    .eq('id', user.id)
    .maybeSingle<Profile>();

  return profile ? { email: user.email ?? '', profile } : null;
}

/**
 * The signed-in teacher, or null for anyone else.
 * Use this before every teacher-only read or write; the role lives in
 * `profiles`, which a student can read but not change.
 */
export async function getTeacher(): Promise<SignedInUser | null> {
  const account = await requireAccount();
  if (account.kind !== 'signed-in') return null;
  return account.user.profile.role === 'teacher' ? account.user : null;
}

/** First letter of the name, for the avatar circle. */
export function initialOf(fullName: string): string {
  const trimmed = fullName.trim();
  return trimmed ? trimmed[0].toUpperCase() : '?';
}
