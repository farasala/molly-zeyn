'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { emptyAuthState, type AuthState, type Role } from '@/lib/auth-state';

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MIN_PASSWORD = 6;

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function readRole(formData: FormData): Role {
  return read(formData, 'role') === 'teacher' ? 'teacher' : 'student';
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = read(formData, 'email').trim().toLowerCase();
  const password = read(formData, 'password');
  const base: AuthState = { ...emptyAuthState, email };

  if (!EMAIL.test(email)) {
    return { ...base, status: 'error', message: 'That email does not look right. Check the spelling.' };
  }
  if (!password) {
    return { ...base, status: 'error', message: 'Enter your password to log in.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return {
        ...base,
        status: 'error',
        message: 'This email is not confirmed yet. Open the confirmation link we sent, then log in.',
      };
    }
    return {
      ...base,
      status: 'error',
      message: 'Email or password is not right. Check both and try again.',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = read(formData, 'fullName').trim();
  const email = read(formData, 'email').trim().toLowerCase();
  const password = read(formData, 'password');
  const role = readRole(formData);
  const base: AuthState = { ...emptyAuthState, fullName, email, role };

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
    options: { data: { full_name: fullName, role } },
  });

  if (error) {
    const text = error.message.toLowerCase();
    if (text.includes('already registered') || text.includes('already been registered')) {
      return {
        ...base,
        status: 'error',
        message: 'That email is already registered. Log in instead.',
      };
    }
    return { ...base, status: 'error', message: `${error.message} Please try again.` };
  }

  // Supabase returns a user with no identities when the email is already taken
  // and duplicate sign-ups are hidden.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { ...base, status: 'error', message: 'That email is already registered. Log in instead.' };
  }

  if (!data.session) {
    return {
      ...base,
      status: 'notice',
      message: 'Account created. Open the confirmation link in your email, then log in here.',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function logOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
