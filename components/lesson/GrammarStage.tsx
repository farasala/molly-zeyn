import Link from 'next/link';
import { RichText } from '@/components/RichText';
import type { Grammar } from '@/lib/content';

/**
 * The projection card. Sizes here are deliberately large — this is what the
 * teacher shares on screen during a lesson, so nothing shrinks to fit.
 */
export function GrammarStage({ grammar, lessonId }: { grammar: Grammar; lessonId: string }) {
  return (
    <section className="stage-card is-grammar">
      <h2 className="grammar-head">
        <RichText text={grammar.h} />
      </h2>

      <div className="grammar-rows">
        {grammar.rows.map((row) => (
          <div className="grammar-row" key={row.label}>
            <span className="grammar-row-label">{row.label}</span>
            <span className="grammar-row-items">
              {row.items.map((item, index) => (
                <span className="grammar-item" key={index}>
                  <RichText text={item} />
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>

      {grammar.notes.length > 0 && (
        <div className="grammar-notes">
          <p className="grammar-notes-head">Watch out</p>
          {grammar.notes.map((note, index) => (
            <p className="grammar-note" key={index}>
              <span className="grammar-bullet" aria-hidden="true">
                ·
              </span>
              <span>
                <RichText text={note} />
              </span>
            </p>
          ))}
        </div>
      )}

      <Link className="pill-button is-primary is-wide" href={`/lessons/${lessonId}?stage=practice`}>
        Practise this →
      </Link>
    </section>
  );
}
