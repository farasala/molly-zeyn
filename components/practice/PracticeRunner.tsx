'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { savePractice } from '@/app/practice-actions';
import { TaskBody } from '@/components/practice/TaskBody';
import { emptyDraft, givenFrom, type Draft } from '@/components/practice/task';
import type { PublicItem } from '@/lib/exercises';

type Feedback = { correct: boolean; expected: string };

type Props = {
  lessonId: string;
  lessonTitle: string;
  items: PublicItem[];
};

const XP_PER_CORRECT = 10;

/** Free practice on an open lesson. Nothing is graded; the score is a record. */
export function PracticeRunner({ lessonId, lessonTitle, items }: Props) {
  /** Positions into `items`. A missed task is pushed back on to the end. */
  const [queue, setQueue] = useState<number[]>(() => items.map((_, index) => index));
  const [cursor, setCursor] = useState(0);
  const [firstTry, setFirstTry] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [pending, setPending] = useState(false);
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const finished = cursor >= queue.length;
  const position = finished ? -1 : queue[cursor];
  const item = finished ? null : items[position];

  const score = useMemo(() => Object.values(firstTry).filter(Boolean).length, [firstTry]);
  const answered = Object.keys(firstTry).length;

  useEffect(() => {
    if (!finished || saving !== 'idle') return;
    setSaving('saving');
    void savePractice({ lessonId, score, total: items.length }).then((result) => {
      setSaving(result.ok ? 'saved' : 'failed');
      setSaveMessage(result.message ?? '');
    });
  }, [finished, saving, lessonId, score, items.length]);

  if (items.length === 0) {
    return (
      <section className="stage-card">
        <h2 className="card-title">No exercises yet</h2>
        <p className="card-text">This lesson has no practice set.</p>
      </section>
    );
  }

  const submit = async (value: string) => {
    if (!item || pending) return;
    setPending(true);

    let result = { ok: false, correct: false, expected: '' };
    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lessonId, index: item.i, given: value }),
      });
      if (response.ok) result = await response.json();
    } catch {
      // Left as not-ok; the message below explains it.
    }
    setPending(false);

    if (!result.ok) {
      setFeedback({ correct: false, expected: 'Could not reach the server. Try again.' });
      return;
    }

    setFirstTry((current) =>
      position in current ? current : { ...current, [position]: result.correct },
    );
    setFeedback({ correct: result.correct, expected: result.expected });
  };

  const advance = () => {
    const wasWrong = feedback && !feedback.correct;
    setFeedback(null);
    setDraft(emptyDraft);
    if (wasWrong) setQueue((current) => [...current, position]);
    setCursor((current) => current + 1);
  };

  /** Same tasks, fresh run. The order stays as the server dealt it. */
  const restart = () => {
    setQueue(items.map((_, index) => index));
    setCursor(0);
    setFirstTry({});
    setFeedback(null);
    setSaving('idle');
    setSaveMessage('');
    setDraft(emptyDraft);
  };

  const skip = () => {
    if (!item) return;
    setFirstTry((current) => (position in current ? current : { ...current, [position]: false }));
    setQueue((current) => [...current, position]);
    setDraft(emptyDraft);
    setCursor((current) => current + 1);
  };

  const value = item ? givenFrom(item, draft) : null;

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (feedback) advance();
    else if (value !== null) void submit(value);
  };

  if (finished) {
    const perfect = score === items.length;
    return (
      <section className="stage-card">
        <span className="score-eyebrow">Practice finished</span>
        <h2 className="score-title">
          {score} of {items.length} right first time
        </h2>
        <p className="card-text">
          {perfect
            ? 'Every task correct on the first attempt. Nothing to redo here.'
            : 'Anything you missed came back until you got it. Run it again to clear it first time.'}
        </p>
        <p className="score-xp">+{score * XP_PER_CORRECT} XP</p>

        {saving === 'saving' && <p className="save-note">Saving your score…</p>}
        {saving === 'saved' && (
          <p className="save-note is-ok">Saved to your account — it is there on any device.</p>
        )}
        {saving === 'failed' && (
          <p className="save-note is-bad">{saveMessage || 'Your score could not be saved.'}</p>
        )}

        <div className="score-actions">
          <button className="pill-button is-primary" type="button" onClick={restart}>
            Run It Again
          </button>
          <Link className="pill-button" href={`/lessons/${lessonId}?stage=speaking`}>
            On to speaking →
          </Link>
        </div>
      </section>
    );
  }

  const remaining = queue.length - cursor;

  return (
    <section className="stage-card" onKeyDown={onKey}>
      <div className="run-bar">
        <span className="run-dots" role="presentation">
          {items.map((_, index) => (
            <span
              key={index}
              className={`run-dot${firstTry[index] === true ? ' is-right' : ''}${
                firstTry[index] === false ? ' is-wrong' : ''
              }${index === position ? ' is-current' : ''}`}
            />
          ))}
        </span>
        <span className="run-counter">
          {answered} of {items.length} · {remaining} left in this round
        </span>
      </div>

      {item && (
        <TaskBody item={item} draft={draft} onChange={setDraft} locked={Boolean(feedback)} />
      )}

      {feedback ? (
        <div className={`verdict ${feedback.correct ? 'is-right' : 'is-wrong'}`} role="status">
          <p className="verdict-head">{feedback.correct ? 'Correct' : 'Not quite'}</p>
          {!feedback.correct && (
            <>
              <p className="verdict-label">The answer is</p>
              <p className="verdict-answer">{feedback.expected}</p>
            </>
          )}
        </div>
      ) : null}

      <div className="run-actions">
        {feedback ? (
          <button className="pill-button is-primary" type="button" onClick={advance} autoFocus>
            {cursor + 1 >= queue.length && feedback.correct ? 'See Your Score' : 'Continue'}
          </button>
        ) : (
          <>
            <button
              className="pill-button is-primary"
              type="button"
              disabled={value === null || pending}
              onClick={() => value !== null && void submit(value)}
            >
              {pending ? 'Checking…' : 'Check'}
            </button>
            <button className="pill-button" type="button" onClick={skip}>
              Skip
            </button>
          </>
        )}
        <span className="run-lesson">{lessonTitle}</span>
      </div>
    </section>
  );
}
