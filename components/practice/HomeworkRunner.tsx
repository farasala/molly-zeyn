'use client';

import Link from 'next/link';
import { useState } from 'react';
import { submitHomework } from '@/app/homework-actions';
import { TaskBody } from '@/components/practice/TaskBody';
import { emptyDraft, givenFrom, type Draft } from '@/components/practice/task';
import type { PublicItem } from '@/lib/exercises';

type Feedback = { correct: boolean; expected: string };

type Props = {
  submissionId: string;
  lessonId: string;
  title: string;
  items: PublicItem[];
  /** Tasks already answered in an earlier sitting. */
  answered: Record<number, boolean>;
};

const XP_PER_CORRECT = 10;

/**
 * Homework, graded. Same tasks and the same feel as free practice, but the
 * server records every answer, and only the first one counts — that is what
 * the teacher goes through at the start of the next lesson.
 */
export function HomeworkRunner({ submissionId, lessonId, title, items, answered }: Props) {
  const unanswered = items.map((_, index) => index).filter((index) => !(index in answered));

  const [queue, setQueue] = useState<number[]>(unanswered);
  const [cursor, setCursor] = useState(0);
  const [firstTry, setFirstTry] = useState<Record<number, boolean>>(answered);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [pending, setPending] = useState(false);
  const [handIn, setHandIn] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');
  const [handInMessage, setHandInMessage] = useState('');

  const finished = cursor >= queue.length;
  const position = finished ? -1 : queue[cursor];
  const item = finished ? null : items[position];

  const score = Object.values(firstTry).filter(Boolean).length;
  const done = Object.keys(firstTry).length;

  const submit = async (value: string) => {
    if (!item || pending) return;
    setPending(true);

    let result = { ok: false, correct: false, expected: '' };
    try {
      const response = await fetch('/api/homework/answer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ submissionId, itemIndex: item.i, given: value }),
      });
      if (response.ok) result = await response.json();
    } catch {
      // Left as not-ok.
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

  const value = item ? givenFrom(item, draft) : null;

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (feedback) advance();
    else if (value !== null) void submit(value);
  };

  const hand = async () => {
    setHandIn('sending');
    const result = await submitHomework(submissionId);
    setHandIn(result.ok ? 'done' : 'failed');
    setHandInMessage(result.message ?? '');
  };

  if (finished) {
    return (
      <section className="stage-card">
        <span className="score-eyebrow">All tasks answered</span>
        <h2 className="score-title">
          {score} of {items.length} right first time
        </h2>
        <p className="card-text">
          Anything you missed came back until you got it. Your first answer to each task is what
          your teacher sees.
        </p>
        <p className="score-xp">+{score * XP_PER_CORRECT} XP</p>

        {handIn === 'done' ? (
          <>
            <p className="save-note is-ok">
              Handed in. Lesson {lessonId} is now open for you to go back over.
            </p>
            <div className="score-actions">
              <Link className="pill-button is-primary" href={`/lessons/${lessonId}`}>
                Open lesson {lessonId}
              </Link>
              <Link className="pill-button" href="/dashboard">
                Back to your dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            {handIn === 'failed' && (
              <p className="save-note is-bad">{handInMessage || 'It could not be handed in.'}</p>
            )}
            <div className="score-actions">
              <button
                className="pill-button is-primary"
                type="button"
                onClick={hand}
                disabled={handIn === 'sending'}
              >
                {handIn === 'sending' ? 'Handing in…' : 'Hand It In'}
              </button>
            </div>
          </>
        )}
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
          {done} of {items.length} · {remaining} left in this round
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
            Continue
          </button>
        ) : (
          <button
            className="pill-button is-primary"
            type="button"
            disabled={value === null || pending}
            onClick={() => value !== null && void submit(value)}
          >
            {pending ? 'Checking…' : 'Check'}
          </button>
        )}
        <span className="run-lesson">{title}</span>
      </div>
    </section>
  );
}
