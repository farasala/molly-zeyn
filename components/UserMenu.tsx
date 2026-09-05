'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { logOut } from '@/app/auth-actions';

type Props = {
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatarColor: string;
  initial: string;
};

function LogOutButton() {
  const { pending } = useFormStatus();
  return (
    <button className="menu-action" type="submit" disabled={pending}>
      {pending ? 'Logging out…' : 'Log out'}
    </button>
  );
}

export function UserMenu({ name, email, role, avatarColor, initial }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-button"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="avatar" style={{ background: avatarColor }} aria-hidden="true">
          {initial}
        </span>
        <span className="user-button-text">
          <span className="user-button-name">{name}</span>
          <span className="user-button-role">{role === 'teacher' ? 'Teacher' : 'Student'}</span>
        </span>
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <div className="user-dropdown-head">
            <span className="avatar is-small" style={{ background: avatarColor }} aria-hidden="true">
              {initial}
            </span>
            <span className="user-dropdown-identity">
              <span className="user-dropdown-name">{name}</span>
              <span className="user-dropdown-email">{email}</span>
            </span>
          </div>
          <form action={logOut}>
            <LogOutButton />
          </form>
        </div>
      )}
    </div>
  );
}
