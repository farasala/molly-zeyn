'use client';

import { useActionState } from 'react';
import { joinWithInvite } from '@/app/join-actions';
import { emptyAuthState, type AuthState } from '@/lib/auth-state';

/** Sign-up on an invitation. There is no role to pick: an invite makes a student. */
export function JoinForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    joinWithInvite,
    emptyAuthState,
  );

  return (
    <form className="auth-form" action={formAction}>
      <input type="hidden" name="token" value={token} />

      <div className="auth-fields">
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
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="At least 6 characters"
          />
        </label>
      </div>

      {state.status !== 'idle' && state.message ? (
        <p
          className={`auth-message ${state.status === 'error' ? 'is-error' : 'is-notice'}`}
          role={state.status === 'error' ? 'alert' : 'status'}
        >
          {state.message}
        </p>
      ) : null}

      <button className="auth-submit" type="submit" disabled={pending}>
        {pending ? 'Creating account…' : 'Join The Class'}
      </button>
    </form>
  );
}
