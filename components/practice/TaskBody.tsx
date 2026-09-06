'use client';

import { useEffect, useRef } from 'react';
import { AudioButton } from '@/components/AudioButton';
import type { Draft } from '@/components/practice/task';
import type { PublicItem } from '@/lib/exercises';

type Props = {
  item: PublicItem;
  draft: Draft;
  onChange: (next: Draft) => void;
  /** True once the answer is in and the verdict is showing. */
  locked: boolean;
};

/** One task, drawn the same way in free practice and in homework. */
export function TaskBody({ item, draft, onChange, locked }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const needsInput = item.t === 'gap' || item.t === 'transform' || item.t === 'dictation';

  useEffect(() => {
    if (needsInput && !locked) inputRef.current?.focus();
  }, [item, needsInput, locked]);

  const set = (patch: Partial<Draft>) => onChange({ ...draft, ...patch });

  if (item.t === 'mc' || item.t === 'listen') {
    return (
      <div className="task">
        {item.t === 'listen' && (
          <div className="task-clip">
            <AudioButton src={item.clip} label="Play the recording" text="Play" />
          </div>
        )}
        <p className="task-q">{item.q}</p>
        <div className="option-list">
          {item.o.map((option, index) => (
            <button
              key={option}
              type="button"
              className={`option${draft.choice === index ? ' is-chosen' : ''}`}
              onClick={() => set({ choice: index })}
              disabled={locked}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (needsInput) {
    return (
      <div className="task">
        {item.t === 'dictation' && (
          <>
            <div className="task-clip">
              <AudioButton src={item.clip} label="Play the dictation" text="Play" />
            </div>
            <p className="task-instr">Listen and write exactly what you hear.</p>
          </>
        )}
        {item.t === 'transform' && <p className="task-instr">{item.instr}</p>}
        {item.t !== 'dictation' && <p className="task-q">{item.q}</p>}
        {item.t === 'gap' && item.hint && <p className="task-hint">Hint: {item.hint}</p>}
        <input
          ref={inputRef}
          className="task-input"
          value={draft.text}
          onChange={(event) => set({ text: event.target.value })}
          disabled={locked}
          placeholder={
            item.t === 'gap'
              ? 'Type the missing word'
              : item.t === 'transform'
                ? 'Write the new sentence'
                : 'Write the sentence'
          }
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
    );
  }

  if (item.t === 'order') {
    return (
      <div className="task">
        <p className="task-instr">Put the words in order.</p>
        <div className="strip">
          {draft.picked.length === 0 ? (
            <span className="strip-empty">Tap the words below</span>
          ) : (
            draft.picked.map((chipIndex, slot) => (
              <button
                key={`${chipIndex}-${slot}`}
                type="button"
                className="chip is-placed"
                onClick={() =>
                  !locked && set({ picked: draft.picked.filter((_, s) => s !== slot) })
                }
                disabled={locked}
              >
                {item.chips[chipIndex]}
              </button>
            ))
          )}
        </div>
        <div className="chip-tray">
          {item.chips.map((chip, index) =>
            draft.picked.includes(index) ? (
              <span key={index} className="chip is-used" aria-hidden="true">
                {chip}
              </span>
            ) : (
              <button
                key={index}
                type="button"
                className="chip"
                onClick={() => set({ picked: [...draft.picked, index] })}
                disabled={locked}
              >
                {chip}
              </button>
            ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="task">
      <p className="task-instr">Match each word to its meaning.</p>
      <div className="match-grid">
        <div className="match-col">
          {item.lefts.map((left) => {
            const done = draft.pairs.some((pair) => pair[0] === left);
            return (
              <button
                key={left}
                type="button"
                className={`match-item${done ? ' is-done' : ''}${
                  draft.activeLeft === left ? ' is-active' : ''
                }`}
                disabled={locked}
                onClick={() =>
                  done
                    ? set({
                        pairs: draft.pairs.filter((pair) => pair[0] !== left),
                        activeLeft: left,
                      })
                    : set({ activeLeft: draft.activeLeft === left ? null : left })
                }
              >
                {left}
              </button>
            );
          })}
        </div>
        <div className="match-col">
          {item.rights.map((right) => {
            const done = draft.pairs.some((pair) => pair[1] === right);
            return (
              <button
                key={right}
                type="button"
                className={`match-item${done ? ' is-done' : ''}`}
                disabled={locked || done}
                onClick={() => {
                  if (!draft.activeLeft) return;
                  set({
                    pairs: [...draft.pairs, [draft.activeLeft, right]],
                    activeLeft: null,
                  });
                }}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
