'use client';

import { useState } from 'react';
import { AudioButton } from '@/components/AudioButton';
import { TaskBody } from '@/components/practice/TaskBody';
import { emptyDraft, givenFrom, type Draft } from '@/components/practice/task';
import type { WarmupItem } from '@/lib/warmup';

type Feedback = { correct: boolean; expected: string };

/**
 * Revision, not a drill: every task is on the page at once, in whatever
 * order the student wants to go through them — scroll up and down, not
 * click through one full-screen card at a time. Checking one task does not
 * advance to the next, and nothing here is saved: it exists to put a lesson
 * or two back in view before the next class starts.
 */
export function WarmupRunner({ items }: { items: WarmupItem[] }) {
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [feedback, setFeedback] = useState<Record<number, Feedback>>({});
  const [pending, setPending] = useState<number | null>(null);
  const [shown, setShown] = useState<Record<number, boolean>>({});

  if (items.length === 0) {
    return (
      <section className="stage-card">
        <h2 className="card-title">Nothing to review yet</h2>
        <p className="card-text">
          Warmup pulls tasks back from lessons you have already covered. There is nothing before
          this one yet.
        </p>
      </section>
    );
  }

  const setDraft = (position: number, next: Draft) =>
    setDrafts((current) => ({ ...current, [position]: next }));

  const check = async (position: number) => {
    const entry = items[position];
    if (entry.kind !== 'task' || pending !== null) return;

    const draft = drafts[position] ?? emptyDraft;
    const given = givenFrom(entry.item, draft);
    if (given === null) return;

    setPending(position);

    let result = { ok: false, correct: false, expected: '' };
    try {
      const response = await fetch('/api/warmup-check', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ref: entry.ref, given }),
      });
      if (response.ok) result = await response.json();
    } catch {
      // Left as not-ok; the message below explains it.
    }

    setPending(null);

    if (!result.ok) {
      setFeedback((current) => ({
        ...current,
        [position]: { correct: false, expected: 'Could not reach the server. Try again.' },
      }));
      return;
    }

    setFeedback((current) => ({ ...current, [position]: result }));
  };

  return (
    <ul className="warmup-list">
      {items.map((entry, position) => {
        if (entry.kind === 'speak') {
          const open = Boolean(shown[position]);
          return (
            <li className="warmup-row" key={position}>
              <span className="warmup-badge">{entry.label}</span>
              <p className="task-q">{entry.prompt}</p>
              {open && <p className="speak-model">{entry.model}</p>}
              <div className="speak-actions">
                <button
                  className="pill-button"
                  type="button"
                  aria-expanded={open}
                  onClick={() => setShown((current) => ({ ...current, [position]: !open }))}
                >
                  {open ? 'Hide model' : 'Show model'}
                </button>
                {entry.audio && (
                  <AudioButton src={entry.audio} label="Listen to the model answer" text="Model" />
                )}
              </div>
            </li>
          );
        }

        const draft = drafts[position] ?? emptyDraft;
        const result = feedback[position];
        const locked = Boolean(result);
        const value = givenFrom(entry.item, draft);

        return (
          <li className="warmup-row" key={position}>
            <span className="warmup-badge">{entry.label}</span>
            <TaskBody
              item={entry.item}
              draft={draft}
              onChange={(next) => setDraft(position, next)}
              locked={locked}
            />

            {result ? (
              <div className={`verdict ${result.correct ? 'is-right' : 'is-wrong'}`} role="status">
                <p className="verdict-head">{result.correct ? 'Correct' : 'Not quite'}</p>
                {!result.correct && (
                  <>
                    <p className="verdict-label">The answer is</p>
                    <p className="verdict-answer">{result.expected}</p>
                  </>
                )}
              </div>
            ) : (
              <div className="run-actions">
                <button
                  className="pill-button is-primary"
                  type="button"
                  disabled={value === null || pending === position}
                  onClick={() => void check(position)}
                >
                  {pending === position ? 'Checking…' : 'Check'}
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
