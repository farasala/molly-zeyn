const MISSING =
  'Supabase environment variables are missing. Locally, copy .env.example to .env.local and fill it in. ' +
  'On Vercel, add them under Settings → Environment Variables and redeploy.';

export function supabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) throw new Error(`NEXT_PUBLIC_SUPABASE_URL is not set. ${MISSING}`);
  return value;
}

export function supabaseAnonKey(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!value) throw new Error(`NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. ${MISSING}`);
  return value;
}
