import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type Role = 'student' | 'teacher';

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

/** First letter of the name, for the avatar circle. */
export function initialOf(fullName: string): string {
  const trimmed = fullName.trim();
  return trimmed ? trimmed[0].toUpperCase() : '?';
}
