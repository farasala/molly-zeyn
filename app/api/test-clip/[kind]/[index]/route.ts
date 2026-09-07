import { type NextRequest, NextResponse } from 'next/server';
import { streamClip } from '@/lib/clip';
import { getCourseTest, type TestKind } from '@/lib/coursetest';
import { clipSlugFor } from '@/lib/exercises';
import { createClient } from '@/lib/supabase/server';

const LEVEL_ID = 'elementary';

/** The recording for one listening task on the entry or end-of-course test. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ kind: string; index: string }> },
) {
  const { kind, index } = await params;
  if (kind !== 'entry' && kind !== 'final') {
    return new NextResponse('No such test', { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Not signed in', { status: 401 });

  const exercise = getCourseTest(LEVEL_ID, kind as TestKind)?.items[Number.parseInt(index, 10)];
  if (!exercise) return new NextResponse('No such task', { status: 404 });

  const slug = clipSlugFor(exercise);
  if (!slug) return new NextResponse('This task has no recording', { status: 404 });

  return streamClip(request, slug);
}
