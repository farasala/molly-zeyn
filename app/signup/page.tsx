import type { Metadata } from 'next';
import { AuthScreen } from '@/components/AuthScreen';

export const metadata: Metadata = { title: 'Sign up · English Studio' };

export default function SignupPage() {
  return <AuthScreen mode="signup" />;
}
