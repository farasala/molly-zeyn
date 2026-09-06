'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { savePractice } from '@/app/practice-actions';
import { AudioButton } from '@/components/AudioButton';
import type { PublicItem } from '@/lib/exercises';

type Feedback = { correct: boolean; expected: string };

type Props = {
  lessonId: string;
  lessonTitle: string;
  items: PublicItem[];
};

const XP_PER_CORRECT = 10;

export function PracticeRunner({ lessonId, lessonTitle, items }: Props) {
  /** Positions into `items`. A missed task is pushed back on to the end. */
  const [queue, setQueue] = useState<number[]>(() => items.map((_, index) => index));
  const [cursor, setCursor] = useState(0);
  const [firstTry, setFirstTry] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [pending, setPending] = useState(false);
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // Per-task drafts, reset on every move.
  const [choice, setChoice] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [picked, setPicked] = useState<number[]>([]);
  const [pairs, setPairs] = useState<[string, string][]>([]);
  const [activeLeft, setActiveLeft] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const finished = cursor >= queue.length;
  const position = finished ? -1 : queue[cursor];
  const item = finished ? null : items[position];

  const score = useMemo(
    () => Object.values(firstTry).filter(Boolean).length,
    [firstTry],
  );
  const answered = Object.keys(firstTry).length;

  const resetDrafts = useCallback(() => {
    setChoice(null);
    setText('');
    setPicked([]);
    setPairs([]);
    setActiveLeft(null);
  }, []);

  useEffect(() => {
    if (item && (item.t === 'gap' || item.t === 'transform' || item.t === 'dictation')) {
      inputRef.current?.focus();
    }
  }, [item]);

  // Save once, when the queue empties.
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

  const given = (): string | null => {
    if (!item) return null;
    switch (item.t) {
      case 'mc':
      case 'listen':
        return choice === null ? null : String(choice);
      case 'gap':
      case 'transform':
      case 'dictation':
        return text.trim() ? text : null;
      case 'order':
        return picked.length === item.chips.length
          ? picked.map((index) => item.chips[index]).join(' ')
          : null;
      case 'match':
        return pairs.length === item.lefts.length ? JSON.stringify(pairs) : null;
    }
  };

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
    resetDrafts();
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
    resetDrafts();
  };

  const skip = () => {
    if (!item) return;
    setFirstTry((current) => (position in current ? current : { ...current, [position]: false }));
    setQueue((current) => [...current, position]);
    resetDrafts();
    setCursor((current) => current + 1);
  };

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (feedback) advance();
    else {
      const value = given();
      if (value !== null) void submit(value);
    }
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

  const value = given();
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

      <div className="task">
        {item?.t === 'mc' && (
          <>
            <p className="task-q">{item.q}</p>
            <div className="option-list">
              {item.o.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  className={`option${choice === index ? ' is-chosen' : ''}`}
                  onClick={() => setChoice(index)}
                  disabled={Boolean(feedback)}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {item?.t === 'listen' && (
          <>
            <div className="task-clip">
              <AudioButton src={item.clip} label="Play the recording" text="Play" />
            </div>
            <p className="task-q">{item.q}</p>
            <div className="option-list">
              {item.o.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  className={`option${choice === index ? ' is-chosen' : ''}`}
                  onClick={() => setChoice(index)}
                  disabled={Boolean(feedback)}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {item?.t === 'gap' && (
          <>
            <p className="task-q">{item.q}</p>
            {item.hint && <p className="task-hint">Hint: {item.hint}</p>}
            <input
              ref={inputRef}
              className="task-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={Boolean(feedback)}
              placeholder="Type the missing word"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </>
        )}

        {item?.t === 'transform' && (
          <>
            <p className="task-instr">{item.instr}</p>
            <p className="task-q">{item.q}</p>
            <input
              ref={inputRef}
              className="task-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={Boolean(feedback)}
              placeholder="Write the new sentence"
              autoComplete="off"
              spellCheck={false}
            />
          </>
        )}

        {item?.t === 'dictation' && (
          <>
            <div className="task-clip">
              <AudioButton src={item.clip} label="Play the dictation" text="Play" />
            </div>
            <p className="task-instr">Listen and write exactly what you hear.</p>
            <input
              ref={inputRef}
              className="task-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={Boolean(feedback)}
              placeholder="Write the sentence"
              autoComplete="off"
              spellCheck={false}
            />
          </>
        )}

        {item?.t === 'order' && (
          <>
            <p className="task-instr">Put the words in order.</p>
            <div className="strip">
              {picked.length === 0 ? (
                <span className="strip-empty">Tap the words below</span>
              ) : (
                picked.map((chipIndex, slot) => (
                  <button
                    key={`${chipIndex}-${slot}`}
                    type="button"
                    className="chip is-placed"
                    onClick={() =>
                      !feedback && setPicked((current) => current.filter((_, s) => s !== slot))
                    }
                    disabled={Boolean(feedback)}
                  >
                    {item.chips[chipIndex]}
                  </button>
                ))
              )}
            </div>
            <div className="chip-tray">
              {item.chips.map((chip, index) =>
                picked.includes(index) ? (
                  <span key={index} className="chip is-used" aria-hidden="true">
                    {chip}
                  </span>
                ) : (
                  <button
                    key={index}
                    type="button"
                    className="chip"
                    onClick={() => setPicked((current) => [...current, index])}
                    disabled={Boolean(feedback)}
                  >
                    {chip}
                  </button>
                ),
              )}
            </div>
          </>
        )}

        {item?.t === 'match' && (
          <>
            <p className="task-instr">Match each word to its meaning.</p>
            <div className="match-grid">
              <div className="match-col">
                {item.lefts.map((left) => {
                  const done = pairs.find((pair) => pair[0] === left);
                  return (
                    <button
                      key={left}
                      type="button"
                      className={`match-item${done ? ' is-done' : ''}${
                        activeLeft === left ? ' is-active' : ''
                      }`}
                      disabled={Boolean(feedback)}
                      onClick={() => {
                        if (done) {
                          setPairs((current) => current.filter((pair) => pair[0] !== left));
                          setActiveLeft(left);
                        } else {
                          setActiveLeft(activeLeft === left ? null : left);
                        }
                      }}
                    >
                      {left}
                    </button>
                  );
                })}
              </div>
              <div className="match-col">
                {item.rights.map((right) => {
                  const done = pairs.find((pair) => pair[1] === right);
                  return (
                    <button
                      key={right}
                      type="button"
                      className={`match-item${done ? ' is-done' : ''}`}
                      disabled={Boolean(feedback) || Boolean(done)}
                      onClick={() => {
                        if (!activeLeft) return;
                        setPairs((current) => [...current, [activeLeft, right]]);
                        setActiveLeft(null);
                      }}
                    >
                      {right}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

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
