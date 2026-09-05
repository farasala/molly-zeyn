'use client';

import { useState } from 'react';
import { AudioButton } from '@/components/AudioButton';

export type SpeakItem = {
  p: string;
  model: string;
  /** Public URL of the model answer, or null when there is no recording. */
  audio: string | null;
};

export function SpeakingStage({ prompts }: { prompts: SpeakItem[] }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  if (prompts.length === 0) {
    return (
      <section className="card">
        <h2 className="card-title">No speaking tasks yet</h2>
        <p className="card-text">This lesson has no prompts. Vocabulary and grammar still work.</p>
      </section>
    );
  }

  return (
    <section className="speak-grid">
      {prompts.map((prompt, index) => {
        const shown = Boolean(open[index]);
        return (
          <article className="speak-card" key={index}>
            <span className="speak-n">Task {index + 1}</span>
            <p className="speak-prompt">{prompt.p}</p>

            <div className="speak-foot">
              {shown && <p className="speak-model">{prompt.model}</p>}
              <div className="speak-actions">
                <button
                  className="pill-button"
                  type="button"
                  aria-expanded={shown}
                  onClick={() => setOpen((current) => ({ ...current, [index]: !shown }))}
                >
                  {shown ? 'Hide model' : 'Show model'}
                </button>
                {prompt.audio && (
                  <AudioButton
                    src={prompt.audio}
                    label={`Listen to the model answer for task ${index + 1}`}
                    text="Model"
                  />
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
