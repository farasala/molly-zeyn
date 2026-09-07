'use client';

import Link from 'next/link';
import { useState } from 'react';
import { submitTest, type TestOutcome } from '@/app/test-actions';
import { TaskBody } from '@/components/practice/TaskBody';
import { emptyDraft, givenFrom, type Draft } from '@/components/practice/task';
import type { TestKind } from '@/lib/coursetest';
import type { PublicItem } from '@/lib/exercises';

type Props = {
  kind: TestKind;
  title: string;
  blurb: string;
  items: PublicItem[];
};

/**
 * A test, not a drill: one pass, no right-or-wrong between questions, no second
 * go at an item. Skipping is allowed and counts as wrong — on a placement test
 * "I have not met this yet" is the useful answer, not a wall to grind through.
 *
 * Drafts are keyed by position in `items`; what goes to the server is `item.i`,
 * the task's place in the full paper, which is what the key is indexed by.
 */
export function TestRunner({ kind, title, blurb, items }: Props) {
  const [started, setStarted] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<TestOutcome | null>(null);

  const item = items[cursor];
  const draft = drafts[cursor] ?? emptyDraft;
  const answeredAt = (position: number) =>
    givenFrom(items[position], drafts[position] ?? emptyDraft) !== null;
  const answered = items.filter((_, position) => answeredAt(position)).length;

  const setDraft = (next: Draft) => setDrafts((all) => ({ ...all, [cursor]: next }));

  const hand = async () => {
    setSending(true);
    const answers = items
      .map((entry, position) => ({
        index: entry.i,
        given: givenFrom(entry, drafts[position] ?? emptyDraft),
      }))
      .filter((row): row is { index: number; given: string } => row.given !== null);

    const outcome = await submitTest({ kind, answers });
    setSending(false);
    setResult(outcome);
  };

  if (result?.ok) {
    return (
      <section className="stage-card">
        <span className="score-eyebrow">{kind === 'entry' ? 'Placement' : 'End of course'}</span>
        <h2 className="score-title">
          {result.score} of {result.total} correct
        </h2>

        {kind === 'entry' ? (
          <>
            <p className="card-text">
              {result.startAt === 1
                ? 'Start at unit 1. That is not a bad result — the course is built to take you from exactly there.'
                : `Start at unit ${result.startAt}. Everything before it you already handle.`}
            </p>
            <p className="score-xp">Unit {result.startAt}</p>
            <p className="card-text">
              Your teacher can see this and will set your first homework from there.
            </p>
          </>
        ) : (
          <>
            <p className="card-text">
              {result.passed
                ? 'That is a pass. Elementary is behind you — Pre-Intermediate is the next step.'
                : 'Not a pass yet. Look at where the marks went below, go back over those units, and take it again.'}
            </p>
            <p className="score-xp">{result.passed ? 'Passed' : 'Not yet'}</p>
          </>
        )}

        {result.perUnit && result.perUnit.length > 0 && (
          <ul className="progress-list">
            {result.perUnit.map((row) => (
              <li className="task-row" key={row.unit}>
                <span
                  className={`task-miss${
                    row.right === row.asked ? ' is-ok' : row.right === 0 ? '' : ' is-mixed'
                  }`}
                >
                  {row.right}/{row.asked}
                </span>
                <span className="task-detail">
                  <span className="task-prompt">Unit {row.unit}</span>
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="score-actions">
          <Link className="pill-button is-primary" href="/dashboard">
            Back to your dashboard
          </Link>
        </div>
      </section>
    );
  }

  if (!started) {
    return (
      <section className="stage-card">
        <span className="score-eyebrow">{kind === 'entry' ? 'Placement' : 'End of course'}</span>
        <h2 className="score-title">{title}</h2>
        <p className="card-text">{blurb}</p>
        <p className="card-text">
          {items.length} questions in one pass. You are not told right or wrong as you go, and you
          can skip anything you cannot do.{' '}
          {kind === 'entry'
            ? 'Skipping is what shows where to start.'
            : 'Nothing comes back a second time, so answer as you go.'}
        </p>
        <div className="score-actions">
          <button className="pill-button is-primary" type="button" onClick={() => setStarted(true)}>
            Begin
          </button>
        </div>
      </section>
    );
  }

  const last = cursor + 1 >= items.length;

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key !== 'Enter' || last) return;
    event.preventDefault();
    setCursor(cursor + 1);
  };

  return (
    <section className="stage-card" onKeyDown={onKey}>
      <div className="run-bar">
        <span className="run-dots" role="presentation">
          {items.map((entry, position) => (
            <span
              key={entry.i}
              className={`run-dot${answeredAt(position) ? ' is-right' : ''}${
                position === cursor ? ' is-current' : ''
              }`}
            />
          ))}
        </span>
        <span className="run-counter">
          Question {cursor + 1} of {items.length} · {answered} answered
        </span>
      </div>

      {item && <TaskBody item={item} draft={draft} onChange={setDraft} locked={false} />}

      <div className="run-actions">
        {last ? (
          <button className="pill-button is-primary" type="button" onClick={hand} disabled={sending}>
            {sending ? 'Marking…' : 'Hand It In'}
          </button>
        ) : (
          <button
            className="pill-button is-primary"
            type="button"
            onClick={() => setCursor(cursor + 1)}
          >
            {answeredAt(cursor) ? 'Next' : 'Skip'}
          </button>
        )}
        {cursor > 0 && (
          <button className="pill-button" type="button" onClick={() => setCursor(cursor - 1)}>
            Back
          </button>
        )}
        {result && !result.ok && <span className="save-note is-bad">{result.message}</span>}
      </div>
    </section>
  );
}
