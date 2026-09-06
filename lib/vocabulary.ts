import { audioUrl, vocabSlug } from '@/lib/audio';
import { getCourse, hasAudio, type Accent } from '@/lib/content';
import type { StudentAccess } from '@/lib/access';
import { createClient } from '@/lib/supabase/server';

/**
 * The vocabulary bank.
 *
 * Only words from lessons the student may open are in it — the bank must not
 * become a way round the gate on the lessons themselves.
 */
export type BankWord = {
  w: string;
  ipa: string;
  pos: string;
  def: string;
  ex: string;
  unitN: number;
  unitTitle: string;
  accent: Accent;
  lessonId: string;
  audio: string | null;
  known: boolean;
};

export async function getVocabularyBank(
  levelId: string,
  isTeacher: boolean,
  access: StudentAccess,
): Promise<BankWord[]> {
  const course = getCourse(levelId);
  if (!course) return [];

  const supabase = await createClient();
  const { data: knownRows } = await supabase
    .from('known_words')
    .select('word')
    .eq('level_id', levelId);

  const known = new Set((knownRows ?? []).map((row) => row.word));
  const out: BankWord[] = [];

  for (const unit of course.units) {
    for (const lesson of unit.lessons) {
      if (lesson.locked) continue;
      if (!isTeacher && !access.open.has(lesson.id)) continue;

      for (const entry of lesson.vocab ?? []) {
        const slug = vocabSlug(entry.w, entry.ex);
        out.push({
          ...entry,
          unitN: unit.n,
          unitTitle: unit.title,
          accent: unit.accent,
          lessonId: lesson.id,
          audio: hasAudio(slug) ? audioUrl(slug) : null,
          known: known.has(entry.w),
        });
      }
    }
  }

  return out;
}

/** How far a student has got, unit by unit. */
export type UnitProgress = {
  n: number;
  title: string;
  theme: string;
  accent: Accent;
  planned: boolean;
  lessons: number;
  open: number;
  waiting: number;
  wordsKnown: number;
  wordsTotal: number;
};

export async function getUnitProgress(
  levelId: string,
  isTeacher: boolean,
  access: StudentAccess,
): Promise<UnitProgress[]> {
  const course = getCourse(levelId);
  if (!course) return [];

  const supabase = await createClient();
  const { data: knownRows } = await supabase
    .from('known_words')
    .select('word')
    .eq('level_id', levelId);
  const known = new Set((knownRows ?? []).map((row) => row.word));

  return course.units.map((unit) => {
    const live = unit.lessons.filter((lesson) => !lesson.locked);
    const open = live.filter((lesson) => isTeacher || access.open.has(lesson.id));
    const waiting = live.filter(
      (lesson) => !isTeacher && access.assigned.has(lesson.id) && !access.open.has(lesson.id),
    );

    const words = open.flatMap((lesson) => lesson.vocab ?? []);

    return {
      n: unit.n,
      title: unit.title,
      theme: unit.theme,
      accent: unit.accent,
      planned: Boolean(unit.locked),
      lessons: live.length,
      open: open.length,
      waiting: waiting.length,
      wordsKnown: words.filter((entry) => known.has(entry.w)).length,
      wordsTotal: words.length,
    };
  });
}
