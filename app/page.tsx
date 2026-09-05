import { redirect } from 'next/navigation';

export default function HomePage() {
  // The middleware sends signed-out visitors to /login before this runs.
  redirect('/dashboard');
}
