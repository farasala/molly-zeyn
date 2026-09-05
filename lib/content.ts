import raw from '@/content/english-studio-content.json';

/**
 * The course content is the source of truth and lives entirely in JSON.
 * The database stores users and progress only, and refers to content by
 * string id ("1A", unit number), so adding units 3-12 needs no migration.
 */

export type Accent = 'pink' | 'mint' | 'amber' | 'teal';

export type LevelStatus = 'ready' | 'planned';

export type Level = {
  id: string;
  name: string;
  cefr: string;
  status: LevelStatus;
  units: number;
  blurb: string;
};

export type VocabEntry = {
  w: string;
  ipa: string;
  pos: string;
  def: string;
  ex: string;
};

export type GrammarRow = { label: string; items: string[] };

/** `h`, `items[]` and `notes[]` carry <b> and <i> only. Render with RichText. */
export type Grammar = { h: string; rows: GrammarRow[]; notes: string[] };

export type SpeakPrompt = { p: string; model: string };

export type Exercise =
  | { t: 'mc'; q: string; o: string[]; a: number }
  | { t: 'gap'; q: string; a: string; hint?: string }
  | { t: 'order'; a: string }
  | { t: 'transform'; instr: string; q: string; a: string[] }
  | { t: 'match'; pairs: [string, string][] }
  | { t: 'dictation'; a: string }
  | { t: 'listen'; text: string; q: string; o: string[]; a: number };

export type Lesson = {
  id: string;
  title: string;
  /** Grammar focus. */
  g: string;
  /** Lexical set. */
  v: string;
  locked?: boolean;
  grammar?: Grammar;
  vocab?: VocabEntry[];
  ex?: Exercise[];
  speak?: SpeakPrompt[];
};

export type Unit = {
  n: number;
  title: string;
  theme: string;
  accent: Accent;
  practical: string;
  locked?: boolean;
  lessons: Lesson[];
  test?: Exercise[];
};

export type Course = {
  id: string;
  name: string;
  cefr: string;
  note: string;
  units: Unit[];
};

type Content = {
  meta: { generated: string; voice: string; note: string; audioKeyRule: string };
  levels: Level[];
  audio: Record<string, string>;
  courses: Record<string, Course>;
};

const content = raw as unknown as Content;

export function getMeta() {
  return content.meta;
}

export function getLevels(): Level[] {
  return content.levels;
}

export function getLevel(levelId: string): Level | null {
  return content.levels.find((level) => level.id === levelId) ?? null;
}

export function getCourse(levelId: string): Course | null {
  return content.courses[levelId] ?? null;
}

export function getUnit(levelId: string, n: number): Unit | null {
  return getCourse(levelId)?.units.find((unit) => unit.n === n) ?? null;
}

/** Finds a lesson by its id ("1A") anywhere in a level, with the unit it belongs to. */
export function getLessonById(
  levelId: string,
  lessonId: string,
): { unit: Unit; lesson: Lesson } | null {
  const course = getCourse(levelId);
  if (!course) return null;

  for (const unit of course.units) {
    const lesson = unit.lessons.find((item) => item.id === lessonId);
    if (lesson) return { unit, lesson };
  }
  return null;
}

/** Every lesson id in a level — used to pre-render the lesson routes. */
export function allLessonIds(levelId: string): string[] {
  return getCourse(levelId)?.units.flatMap((unit) => unit.lessons.map((l) => l.id)) ?? [];
}

/** True when the recording for a spoken string exists. */
export function hasAudio(slug: string): boolean {
  return Boolean(content.audio[slug]);
}
