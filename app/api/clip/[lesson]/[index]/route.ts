import { type NextRequest, NextResponse } from 'next/server';
import { audioUrl } from '@/lib/audio';
import { getLessonById } from '@/lib/content';
import { clipSlugFor } from '@/lib/exercises';
import { createClient } from '@/lib/supabase/server';

const LEVEL_ID = 'elementary';

/**
 * Serves the recording for one dictation or listening task.
 *
 * The file name is built from the sentence being dictated, so linking to it
 * directly would hand the answer to anyone who opened the network tab. This
 * addresses the clip by lesson and task index instead and streams the bytes,
 * so the URL says nothing about what is in it.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lesson: string; index: string }> },
) {
  const { lesson: lessonId, index } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Not signed in', { status: 401 });

  const found = getLessonById(LEVEL_ID, lessonId);
  if (!found) return new NextResponse('No such lesson', { status: 404 });

  const position = Number.parseInt(index, 10);
  const exercise = found.lesson.ex?.[position];
  if (!exercise) return new NextResponse('No such task', { status: 404 });

  const slug = clipSlugFor(exercise);
  if (!slug) return new NextResponse('This task has no recording', { status: 404 });

  // The mp3 ships with the app, so read it back through the CDN in front of us.
  const source = new URL(audioUrl(slug), request.nextUrl.origin);
  const range = request.headers.get('range');
  const upstream = await fetch(source, { headers: range ? { range } : undefined });

  if (!upstream.ok && upstream.status !== 206) {
    return new NextResponse('Recording is missing', { status: 404 });
  }

  const headers = new Headers();
  headers.set('content-type', upstream.headers.get('content-type') ?? 'audio/mpeg');
  for (const name of ['content-length', 'content-range', 'accept-ranges', 'etag']) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  // Private: the URL is only meaningful to a signed-in student mid-task.
  headers.set('cache-control', 'private, max-age=3600');

  return new NextResponse(upstream.body, { status: upstream.status, headers });
}
