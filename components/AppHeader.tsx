import Link from 'next/link';
import { initialOf, type SignedInUser } from '@/lib/auth';
import { UserMenu } from '@/components/UserMenu';

export function AppHeader({ user }: { user: SignedInUser }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <Link className="brand" href="/dashboard">
          <span className="brand-name">English Studio</span>
          <span className="brand-sub">Elementary · A1–A2</span>
        </Link>

        <nav className="topnav" aria-label="Main">
          <Link className="topnav-link" href="/dashboard">
            Dashboard
          </Link>
          <Link className="topnav-link" href="/levels">
            Levels
          </Link>
        </nav>
      </div>

      <UserMenu
        name={user.profile.full_name}
        email={user.email}
        role={user.profile.role}
        avatarColor={user.profile.avatar_color}
        initial={initialOf(user.profile.full_name)}
      />
    </header>
  );
}
