'use client';

import { useEffect, useState } from 'react';
import { ActionForm, type ActionResult } from '@/components/ActionForm';

type Props = {
  token: string;
  used: number;
  max: number;
  expiresAt: string;
  revoke: (formData: FormData) => Promise<ActionResult>;
};

/** One invitation link, with a copy button — this is what gets pasted into a chat. */
export function InviteLink({ token, used, max, expiresAt, revoke }: Props) {
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);

  // The public address is only known in the browser.
  useEffect(() => setOrigin(window.location.origin), []);

  const url = origin ? `${origin}/join/${token}` : `/join/${token}`;
  const spent = used >= max;
  const expired = new Date(expiresAt) < new Date();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`invite${spent || expired ? ' is-spent' : ''}`}>
      <code className="invite-url">{url}</code>
      <span className="invite-meta">
        {expired
          ? 'Expired'
          : spent
            ? 'All places used'
            : `${used} of ${max} used · until ${new Date(expiresAt).toLocaleDateString('en-GB')}`}
      </span>
      <div className="invite-actions">
        <button className="pill-button" type="button" onClick={copy} disabled={!origin}>
          {copied ? 'Copied' : 'Copy'}
        </button>
        <ActionForm action={revoke} submitLabel="Revoke" variant="danger">
          <input type="hidden" name="token" value={token} />
        </ActionForm>
      </div>
    </div>
  );
}
