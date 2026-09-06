'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { emptyAuthState, type AuthState } from '@/lib/auth-state';
import { createClient } from '@/lib/supabase/server';

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MIN_PASSWORD = 6;

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

/**
 * Registers a student against an invitation and puts them in the group.
 *
 * The role is not read from the form: an invitation only ever makes a student.
 * That is what closes the old hole where anyone could pick "Teacher" on the
 * public sign-up page.
 */
export async function joinWithInvite(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const token = read(formData, 'token');
  const fullName = read(formData, 'fullName').trim();
  const email = read(formData, 'email').trim().toLowerCase();
  const password = read(formData, 'password');
  const base: AuthState = { ...emptyAuthState, fullName, email };

  if (!token) return { ...base, status: 'error', message: 'This invitation link is incomplete.' };
  if (fullName.length < 2) {
    return { ...base, status: 'error', message: 'Please enter your name — at least two letters.' };
  }
  if (!EMAIL.test(email)) {
    return { ...base, status: 'error', message: 'That email does not look right. Check the spelling.' };
  }
  if (password.length < MIN_PASSWORD) {
    return {
      ...base,
      status: 'error',
      message: `Password needs at least ${MIN_PASSWORD} characters. Add a few more.`,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: 'student' } },
  });

  if (error) {
    const text = error.message.toLowerCase();
    if (text.includes('already registered') || text.includes('already been registered')) {
      return {
        ...base,
        status: 'error',
        message: 'That email is already registered. Log in first, then open this link again.',
      };
    }
    return { ...base, status: 'error', message: 'The account could not be created. Try again.' };
  }

  if (data.user?.identities && data.user.identities.length === 0) {
    return {
      ...base,
      status: 'error',
      message: 'That email is already registered. Log in first, then open this link again.',
    };
  }

  if (!data.session) {
    return {
      ...base,
      status: 'notice',
      message: 'Account created. Open the confirmation link in your email, then open this link again.',
    };
  }

  const { data: groupId } = await supabase.rpc('redeem_invite', { _token: token });
  if (!groupId) {
    return {
      ...base,
      status: 'error',
      message: 'Your account is ready, but this invitation is no longer valid. Ask for a new link.',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

/** For someone who already has an account and has just opened a link. */
export async function acceptInvite(formData: FormData): Promise<{ ok: boolean; message?: string }> {
  const token = String(formData.get('token') ?? '');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'Log in first, then open the link again.' };

  const { data: groupId } = await supabase.rpc('redeem_invite', { _token: token });
  if (!groupId) {
    return { ok: false, message: 'This invitation is no longer valid. Ask your teacher for a new link.' };
  }

  revalidatePath('/', 'layout');
  return { ok: true };
}
