'use client';

import { useMemo, useOptimistic, useState, useTransition } from 'react';
import { toggleKnownWord } from '@/app/vocabulary-actions';
import { AudioButton } from '@/components/AudioButton';
import type { BankWord } from '@/lib/vocabulary';

/** Search, filter by unit, mark a word known, hear it. */
export function VocabularyBank({ words }: { words: BankWord[] }) {
  const [query, setQuery] = useState('');
  const [unit, setUnit] = useState<number | 'all'>('all');
  const [onlyUnknown, setOnlyUnknown] = useState(false);
  const [, startTransition] = useTransition();

  const [known, setKnown] = useOptimistic(
    new Set(words.filter((word) => word.known).map((word) => word.w)),
    (current: Set<string>, change: { word: string; known: boolean }) => {
      const next = new Set(current);
      if (change.known) next.add(change.word);
      else next.delete(change.word);
      return next;
    },
  );

  const units = useMemo(
    () => [...new Set(words.map((word) => word.unitN))].sort((a, b) => a - b),
    [words],
  );

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return words.filter((word) => {
      if (unit !== 'all' && word.unitN !== unit) return false;
      if (onlyUnknown && known.has(word.w)) return false;
      if (!needle) return true;
      return (
        word.w.toLowerCase().includes(needle) ||
        word.def.toLowerCase().includes(needle) ||
        word.ex.toLowerCase().includes(needle)
      );
    });
  }, [words, query, unit, onlyUnknown, known]);

  const toggle = (word: string, next: boolean) => {
    startTransition(async () => {
      setKnown({ word, known: next });
      await toggleKnownWord(word, next);
    });
  };

  if (words.length === 0) {
    return (
      <section className="card">
        <h2 className="card-title">Your word bank is empty</h2>
        <p className="card-text">
          Words arrive as lessons open. Finish the homework for a lesson and its vocabulary lands
          here, with the meaning, an example and the recording.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="card">
        <div className="bank-controls">
          <label className="field bank-search">
            <span className="field-label">Search</span>
            <input
              className="field-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="a word, a meaning, an example"
            />
          </label>

          <label className="field">
            <span className="field-label">Unit</span>
            <select
              className="field-input"
              value={unit}
              onChange={(event) =>
                setUnit(event.target.value === 'all' ? 'all' : Number(event.target.value))
              }
            >
              <option value="all">All units</option>
              {units.map((n) => (
                <option key={n} value={n}>
                  Unit {n}
                </option>
              ))}
            </select>
          </label>

          <button
            className="pill-button"
            type="button"
            aria-pressed={onlyUnknown}
            onClick={() => setOnlyUnknown((value) => !value)}
          >
            {onlyUnknown ? 'Showing still learning' : 'Show all'}
          </button>
        </div>

        <p className="card-text">
          {known.size} of {words.length} marked as known · {shown.length} shown
        </p>
      </section>

      {shown.length === 0 ? (
        <section className="card">
          <h2 className="card-title">Nothing matches</h2>
          <p className="card-text">Try a shorter search, or pick a different unit.</p>
        </section>
      ) : (
        <ul className="bank-list">
          {shown.map((word) => {
            const isKnown = known.has(word.w);
            return (
              <li className={`bank-row accent-${word.accent}`} key={`${word.lessonId}-${word.w}`}>
                <div className="bank-main">
                  <span className="bank-word">{word.w}</span>
                  <span className="bank-ipa">{word.ipa}</span>
                  <span className="bank-unit">
                    Unit {word.unitN} · {word.lessonId}
                  </span>
                </div>
                <p className="bank-def">{word.def}</p>
                <p className="bank-ex">“{word.ex}”</p>
                <div className="bank-actions">
                  {word.audio && (
                    <AudioButton src={word.audio} label={`Listen to ${word.w}`} variant="icon" />
                  )}
                  <button
                    className={`pill-button${isKnown ? ' is-known' : ''}`}
                    type="button"
                    aria-pressed={isKnown}
                    onClick={() => toggle(word.w, !isKnown)}
                  >
                    {isKnown ? 'Known' : 'Mark as known'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
