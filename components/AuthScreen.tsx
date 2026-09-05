import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';

const POINTS = [
  'Sign up once — progress follows you to every lesson.',
  'Flashcards remember the words you marked as known.',
  'Teachers see the whole group from one account.',
];

export function AuthScreen({ mode }: { mode: 'login' | 'signup' }) {
  const isSignup = mode === 'signup';

  return (
    <main className="auth">
      <section className="auth-hero">
        <p className="auth-eyebrow">English Studio · Elementary A1–A2</p>
        <h1 className="auth-title">Your own account, your own progress.</h1>
        <p className="auth-sub">
          Every student gets a personal cabinet: the words they have learned, the exercises they
          have finished, XP and unit-by-unit progress — saved between lessons and homework.
        </p>
        <ol className="auth-points">
          {POINTS.map((text, index) => (
            <li className="auth-point" key={text}>
              <span className="auth-point-n" aria-hidden="true">
                {index + 1}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="auth-card">
        <nav className="auth-tabs" aria-label="Log in or sign up">
          <Link className="auth-tab" href="/login" aria-current={isSignup ? undefined : 'page'}>
            Log in
          </Link>
          <Link className="auth-tab" href="/signup" aria-current={isSignup ? 'page' : undefined}>
            Sign up
          </Link>
        </nav>

        <h2 className="auth-card-title">{isSignup ? 'Create your account' : 'Welcome back'}</h2>

        <AuthForm mode={mode} />

        <p className="auth-foot">
          {isSignup
            ? 'Your name, email and progress are stored in this school’s own database. Nothing is shared with anyone outside it.'
            : 'Signed up already? Use the same email and password you registered with.'}
        </p>
      </section>
    </main>
  );
}
