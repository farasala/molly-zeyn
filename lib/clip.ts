import { type NextRequest, NextResponse } from 'next/server';
import { audioUrl } from '@/lib/audio';

/**
 * Streams a recording without revealing its file name.
 *
 * The mp3 is named after the sentence being read out, so a direct link would
 * give away the answer to a dictation or a listening task. Callers address the
 * clip by position instead and this hands back the bytes.
 */
export async function streamClip(request: NextRequest, slug: string): Promise<NextResponse> {
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
