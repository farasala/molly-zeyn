import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAnonKey, supabaseUrl } from '@/lib/env';

/** Routes reachable without a session. */
const PUBLIC_ROUTES = ['/login', '/signup', '/join'];

function isPublic(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Refreshes the Supabase session cookie on every request and guards routes:
 * signed-out users are sent to /login, signed-in users away from the auth screens.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Do not remove: this call is what refreshes an expired session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const target = request.nextUrl.clone();

  if (!user && !isPublic(pathname)) {
    target.pathname = '/login';
    target.search = '';
    return redirectKeepingCookies(target, response);
  }

  // An invitation link stays open to someone already signed in: they may be a
  // student joining a second group, so it must not bounce to the dashboard.
  if (user && isPublic(pathname) && !pathname.startsWith('/join')) {
    target.pathname = '/dashboard';
    target.search = '';
    return redirectKeepingCookies(target, response);
  }

  return response;
}

function redirectKeepingCookies(url: URL, source: NextResponse): NextResponse {
  const redirect = NextResponse.redirect(url);
  for (const cookie of source.cookies.getAll()) {
    redirect.cookies.set(cookie);
  }
  return redirect;
}
