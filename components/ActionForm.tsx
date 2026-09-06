'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef, type ReactNode } from 'react';

export type ActionResult = { ok: boolean; message?: string };

type Props = {
  action: (formData: FormData) => Promise<ActionResult>;
  children?: ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  className?: string;
  /** Style of the submit button. */
  variant?: 'primary' | 'plain' | 'danger';
};

const IDLE: ActionResult = { ok: true };

/**
 * A form around a server action that reports back. Plain `<form action={fn}>`
 * only accepts actions returning void, and every mutation here needs a pending
 * state and somewhere to put the error.
 */
export function ActionForm({
  action,
  children,
  submitLabel,
  pendingLabel,
  className,
  variant = 'primary',
}: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    async (_previous, formData) => action(formData),
    IDLE,
  );

  // The action runs inside a client closure, so the revalidation it asks for
  // does not reach the router on its own. Pull the new tree once it succeeds.
  const runs = useRef(0);
  useEffect(() => {
    if (pending) {
      runs.current += 1;
      return;
    }
    if (runs.current > 0 && state.ok) router.refresh();
  }, [pending, state, router]);

  const buttonClass =
    variant === 'danger' ? 'menu-action' : `pill-button${variant === 'primary' ? ' is-primary' : ''}`;

  return (
    <form className={className} action={formAction}>
      {children}
      <button className={buttonClass} type="submit" disabled={pending}>
        {pending ? (pendingLabel ?? 'Working…') : submitLabel}
      </button>
      {!state.ok && state.message && (
        <p className="save-note is-bad" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
