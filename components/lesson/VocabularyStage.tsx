'use client';

import { useState } from 'react';
import { AudioButton } from '@/components/AudioButton';
import type { VocabEntry } from '@/lib/content';

export type VocabItem = VocabEntry & {
  /** Public URL of the recording, or null when there is none. */
  audio: string | null;
};

export function VocabularyStage({ words, lexicalSet }: { words: VocabItem[]; lexicalSet: string }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [listMode, setListMode] = useState(false);

  if (words.length === 0) {
    return (
      <section className="card">
        <h2 className="card-title">No vocabulary yet</h2>
        <p className="card-text">This lesson has no word list. Grammar and speaking still work.</p>
      </section>
    );
  }

  const card = words[Math.min(index, words.length - 1)];

  const move = (step: number) => {
    setIndex((current) => (current + step + words.length) % words.length);
    setRevealed(false);
  };

  return (
    <section className="stage-card">
      <div className="stage-bar">
        <p className="stage-position">
          Word {index + 1} of {words.length} · {lexicalSet}
        </p>
        <div className="stage-bar-actions">
          <button className="pill-button" type="button" onClick={() => setListMode((v) => !v)}>
            {listMode ? 'Flashcards' : 'Word list'}
          </button>
          {card.audio && (
            <AudioButton src={card.audio} label={`Listen to ${card.w}`} />
          )}
        </div>
      </div>

      {listMode ? (
        <ul className="word-list">
          {words.map((word) => (
            <li className="word-row" key={word.w}>
              <span className="word-row-w">{word.w}</span>
              <span className="word-row-ipa">{word.ipa}</span>
              <span className="word-row-def">{word.def}</span>
              {word.audio ? (
                <AudioButton src={word.audio} label={`Listen to ${word.w}`} variant="icon" />
              ) : (
                <span />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flash-wrap">
          <button
            type="button"
            className={`flashcard${revealed ? ' is-back' : ''}`}
            onClick={() => setRevealed((v) => !v)}
            aria-expanded={revealed}
          >
            <span className="flash-word">{card.w}</span>
            <span className="flash-ipa">{card.ipa}</span>
            {revealed ? (
              <span className="flash-back">
                <span className="flash-def">{card.def}</span>
                <span className="flash-ex">“{card.ex}”</span>
              </span>
            ) : (
              <span className="flash-hint">Click to reveal</span>
            )}
          </button>

          <div className="flash-controls">
            <button className="pill-button" type="button" onClick={() => move(-1)}>
              ← Previous
            </button>
            <button className="pill-button is-primary" type="button" onClick={() => move(1)}>
              Next word →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
