import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Everything except Next internals, static assets, and the two API routes
    // the practice runner calls per answer. Those verify the session
    // themselves, and going through the middleware as well meant two round
    // trips to Supabase Auth for every task. Any new route under /api must
    // therefore do its own check.
    '/((?!_next/static|_next/image|favicon\\.ico|fonts/|api/check|api/clip|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|ttf|ico)$).*)',
  ],
};
