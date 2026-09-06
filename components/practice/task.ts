import type { PublicItem } from '@/lib/exercises';

/** What the student has typed or tapped for the task on screen. */
export type Draft = {
  choice: number | null;
  text: string;
  picked: number[];
  pairs: [string, string][];
  activeLeft: string | null;
};

export const emptyDraft: Draft = {
  choice: null,
  text: '',
  picked: [],
  pairs: [],
  activeLeft: null,
};

/**
 * The answer to send, or null when the task is not answerable yet.
 * `mc` and `listen` send the option index; `match` sends the pairs as JSON.
 */
export function givenFrom(item: PublicItem, draft: Draft): string | null {
  switch (item.t) {
    case 'mc':
    case 'listen':
      return draft.choice === null ? null : String(draft.choice);
    case 'gap':
    case 'transform':
    case 'dictation':
      return draft.text.trim() ? draft.text : null;
    case 'order':
      return draft.picked.length === item.chips.length
        ? draft.picked.map((index) => item.chips[index]).join(' ')
        : null;
    case 'match':
      return draft.pairs.length === item.lefts.length ? JSON.stringify(draft.pairs) : null;
  }
}
