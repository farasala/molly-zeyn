/**
 * Every spoken string maps to one pre-rendered mp3 by slug — one voice,
 * recorded once. There is deliberately no speech-synthesis fallback:
 * when a recording is missing the play button is hidden instead.
 */

/** The slug rule from CLAUDE.md. Must stay byte-identical to the recorder's. */
export function audioSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

/** Vocabulary card, word row and vocabulary bank. */
export function vocabSlug(word: string, example: string): string {
  return audioSlug(`${word}. ${example}`);
}

/**
 * Where the recordings are served from.
 *
 * CLAUDE.md specifies the public Supabase Storage bucket `audio`, and that is
 * still the target: set NEXT_PUBLIC_AUDIO_BASE to
 *   https://<project>.supabase.co/storage/v1/object/public/audio/el
 * once the files are uploaded, and nothing else changes.
 *
 * Until then the 92 files ship with the app out of `public/audio/el`, because
 * writing to that bucket needs the service-role key, which this app must never
 * hold. They are versioned with the code and served from the Vercel CDN.
 */
const DEFAULT_BASE = '/audio/el';

export function audioBase(): string {
  return (process.env.NEXT_PUBLIC_AUDIO_BASE || DEFAULT_BASE).replace(/\/$/, '');
}

/** Public URL of one recording. */
export function audioUrl(slug: string): string {
  return `${audioBase()}/${slug}.mp3`;
}
