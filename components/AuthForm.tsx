'use client';

import { useActionState, useState } from 'react';
import { login, signUp } from '@/app/auth-actions';
import { emptyAuthState, type AuthState } from '@/lib/auth-state';
import type { Role } from '@/lib/auth';

const ROLES: { id: Role; label: string }[] = [
  { id: 'student', label: 'Student' },
  { id: 'teacher', label: 'Teacher' },
];

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const isSignup = mode === 'signup';
  const action = isSignup ? signUp : login;
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(action, emptyAuthState);
  const [role, setRole] = useState<Role>('student');

  return (
    <form className="auth-form" action={formAction}>
      <div className="auth-fields">
        {isSignup && (
          <label className="field">
            <span className="field-label">Full name</span>
            <input
              className="field-input"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              defaultValue={state.fullName}
              placeholder="Aisha Nurlan"
            />
          </label>
        )}

        <label className="field">
          <span className="field-label">Email</span>
          <input
            className="field-input"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            defaultValue={state.email}
            placeholder="you@example.com"
          />
        </label>

        <label className="field">
          <span className="field-label">Password</span>
          <input
            className="field-input"
            name="password"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            required
            minLength={isSignup ? 6 : undefined}
            placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
          />
        </label>

        {isSignup && (
          <div className="field">
            <span className="field-label">I am a</span>
            <div className="role-options">
              {ROLES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="role-option"
                  aria-pressed={role === option.id}
                  onClick={() => setRole(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <input type="hidden" name="role" value={role} />
          </div>
        )}
      </div>

      {state.status !== 'idle' && state.message ? (
        <p
          className={`auth-message ${state.status === 'error' ? 'is-error' : 'is-notice'}`}
          role={state.status === 'error' ? 'alert' : 'status'}
        >
          {state.message}
        </p>
      ) : null}

      <button className="auth-submit" type="submit" disabled={isPending}>
        {isPending
          ? isSignup
            ? 'Creating account…'
            : 'Logging in…'
          : isSignup
            ? 'Create Account'
            : 'Log In'}
      </button>
    </form>
  );
}
