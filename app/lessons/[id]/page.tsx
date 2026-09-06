import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { GrammarStage } from '@/components/lesson/GrammarStage';
import { SpeakingStage, type SpeakItem } from '@/components/lesson/SpeakingStage';
import { VocabularyStage, type VocabItem } from '@/components/lesson/VocabularyStage';
import { audioSlug, audioUrl, vocabSlug } from '@/lib/audio';
import { requireAccount } from '@/lib/auth';
import { getLessonById, hasAudio } from '@/lib/content';
import { PracticeRunner } from '@/components/practice/PracticeRunner';
import { EXERCISE_NAMES, shuffle, toPublicItem } from '@/lib/exercises';

const LEVEL_ID = 'elementary';

const STAGES = [
  { id: 'overview', label: 'Overview' },
  { id: 'vocab', label: 'Vocabulary' },
  { id: 'grammar', label: 'Grammar' },
  { id: 'practice', label: 'Practice' },
  { id: 'speaking', label: 'Speaking' },
] as const;

type StageId = (typeof STAGES)[number]['id'];

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ stage?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const found = getLessonById(LEVEL_ID, id);
  return { title: found ? `${found.lesson.id} ${found.lesson.title} · English Studio` : 'English Studio' };
}

function resolveStage(value: string | undefined): StageId {
  return STAGES.some((stage) => stage.id === value) ? (value as StageId) : 'overview';
}

/** Recording URL for a spoken string, or null when there is no file. */
function urlFor(slug: string): string | null {
  return hasAudio(slug) ? audioUrl(slug) : null;
}

export default async function LessonPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { stage: stageParam } = await searchParams;

  const account = await requireAccount();
  if (account.kind === 'no-profile') return null;

  const found = getLessonById(LEVEL_ID, id);
  if (!found) notFound();

  const { unit, lesson } = found;
  const stage = resolveStage(stageParam);
  const locked = Boolean(lesson.locked);

  const vocab: VocabItem[] = (lesson.vocab ?? []).map((entry) => ({
    ...entry,
    audio: urlFor(vocabSlug(entry.w, entry.ex)),
  }));

  const prompts: SpeakItem[] = (lesson.speak ?? []).map((prompt) => ({
    ...prompt,
    audio: urlFor(audioSlug(prompt.model)),
  }));

  const exercises = lesson.ex ?? [];
  const kinds = [...new Set(exercises.map((exercise) => EXERCISE_NAMES[exercise.t]))];

  // Stripped of their answers and reshuffled on every visit. `i` keeps each
  // task's index in the lesson, which is how the server checks the answer.
  const practiceItems = shuffle(
    exercises.map((exercise, index) => toPublicItem(exercise, index, lesson.id)),
  );

  return (
    <div className="shell">
      <AppHeader user={account.user} />

      {/* the accent lives on the page so the flashcard and badges all share it */}
      <div className={`page accent-${unit.accent}`}>
        <section className="lesson-head">
          <div className="lesson-head-top">
            <div className="lesson-identity">
              <span className="lesson-badge">{lesson.id}</span>
              <div>
                <h1 className="lesson-title">{lesson.title}</h1>
                <p className="lesson-meta">
                  Unit {unit.n} · {unit.title} — grammar: {lesson.g} · vocabulary: {lesson.v}
                </p>
              </div>
            </div>
            <Link className="pill-button" href={`/levels/${LEVEL_ID}`}>
              ← Back to units
            </Link>
          </div>

          {!locked && (
            <nav className="stage-tabs" aria-label="Lesson stages">
              {STAGES.map((item) => (
                <Link
                  className="stage-tab"
                  key={item.id}
                  href={`/lessons/${lesson.id}?stage=${item.id}`}
                  aria-current={item.id === stage ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </section>

        {locked ? (
          <section className="stage-card is-locked">
            <h2 className="locked-title">Syllabus is set — content in production</h2>
            <p className="locked-text">
              This lesson already has its slot in the course map: grammar focus <b>{lesson.g}</b>,
              lexical set <b>{lesson.v}</b>. The vocabulary, grammar cards, exercises and speaking
              prompts drop into the same engine you can see in Units 1 and 2.
            </p>
            <Link className="pill-button is-primary is-wide" href="/lessons/1A">
              See a finished lesson (1A)
            </Link>
          </section>
        ) : (
          <>
            {stage === 'overview' && (
              <section className="overview-grid">
                <Link className="overview-card" href={`/lessons/${lesson.id}?stage=vocab`}>
                  <span className="overview-step">Step 1</span>
                  <h2 className="overview-title">Vocabulary</h2>
                  <p className="overview-sub">
                    {vocab.length} words from “{lesson.v}” with phonemics, meaning, an example and
                    audio.
                  </p>
                  <span className="overview-cta">Open flashcards →</span>
                </Link>

                <Link className="overview-card" href={`/lessons/${lesson.id}?stage=grammar`}>
                  <span className="overview-step">Step 2</span>
                  <h2 className="overview-title">Grammar</h2>
                  <p className="overview-sub">
                    Present {lesson.g} on the big screen: forms, examples and the mistakes to head
                    off.
                  </p>
                  <span className="overview-cta">Show the rule →</span>
                </Link>

                <Link className="overview-card" href={`/lessons/${lesson.id}?stage=practice`}>
                  <span className="overview-step">Step 3</span>
                  <h2 className="overview-title">Practice</h2>
                  <p className="overview-sub">
                    {exercises.length} exercises: {kinds.join(', ')}.
                  </p>
                  <span className="overview-cta">Start practice →</span>
                </Link>

                <Link className="overview-card" href={`/lessons/${lesson.id}?stage=speaking`}>
                  <span className="overview-step">Step 4</span>
                  <h2 className="overview-title">Speaking</h2>
                  <p className="overview-sub">
                    {prompts.length} prompts for pair or solo work, each with a model answer you can
                    reveal.
                  </p>
                  <span className="overview-cta">Open tasks →</span>
                </Link>
              </section>
            )}

            {stage === 'vocab' && <VocabularyStage words={vocab} lexicalSet={lesson.v} />}

            {stage === 'grammar' &&
              (lesson.grammar ? (
                <GrammarStage grammar={lesson.grammar} lessonId={lesson.id} />
              ) : (
                <section className="card">
                  <h2 className="card-title">No grammar card yet</h2>
                  <p className="card-text">This lesson has no grammar panel.</p>
                </section>
              ))}

            {stage === 'practice' && (
              <PracticeRunner
                lessonId={lesson.id}
                lessonTitle={`${lesson.id} · ${lesson.title}`}
                items={practiceItems}
              />
            )}

            {stage === 'speaking' && <SpeakingStage prompts={prompts} />}
          </>
        )}
      </div>
    </div>
  );
}
