import { type NextRequest, NextResponse } from 'next/server';
import { streamClip } from '@/lib/clip';
import { getLessonById } from '@/lib/content';
import { clipSlugFor } from '@/lib/exercises';
import { createClient } from '@/lib/supabase/server';

const LEVEL_ID = 'elementary';

/** The recording for one dictation or listening task in a lesson's practice. */
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

  const exercise = getLessonById(LEVEL_ID, lessonId)?.lesson.ex?.[Number.parseInt(index, 10)];
  if (!exercise) return new NextResponse('No such task', { status: 404 });

  const slug = clipSlugFor(exercise);
  if (!slug) return new NextResponse('This task has no recording', { status: 404 });

  return streamClip(request, slug);
}
