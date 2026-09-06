import { type NextRequest, NextResponse } from 'next/server';
import { streamClip } from '@/lib/clip';
import { clipSlugFor } from '@/lib/exercises';
import { parseItems, resolveItem } from '@/lib/homework';
import { createClient } from '@/lib/supabase/server';

/**
 * The recording for one task in an assignment.
 *
 * Row-level security does the gatekeeping: the select below only returns a
 * homework row to the student it was assigned to, or to the teacher who set
 * it. Anyone else gets nothing to stream.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ homework: string; index: string }> },
) {
  const { homework: homeworkId, index } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Not signed in', { status: 401 });

  const { data: homework } = await supabase
    .from('homework')
    .select('level_id, lesson_id, items')
    .eq('id', homeworkId)
    .maybeSingle();

  if (!homework) return new NextResponse('No such homework', { status: 404 });

  const ref = parseItems(homework.items)[Number.parseInt(index, 10)];
  if (!ref) return new NextResponse('No such task', { status: 404 });

  const exercise = resolveItem(homework.level_id, homework.lesson_id, ref);
  const slug = exercise ? clipSlugFor(exercise) : null;
  if (!slug) return new NextResponse('This task has no recording', { status: 404 });

  return streamClip(request, slug);
}
