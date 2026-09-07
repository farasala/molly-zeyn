/**
 * Keeps the audio map and the recording list honest.
 *
 *   node scripts/audio.mjs
 *
 * Two jobs, both derived from what is actually on disk:
 *
 *  1. Rebuild `audio` in the content JSON from the mp3s in public/audio/el.
 *     `hasAudio()` reads that map, and a task whose recording is missing is
 *     hidden rather than shown unplayable — so the map going stale silently
 *     removes tasks from a lesson. It must never be edited by hand.
 *
 *  2. Write recordings-todo.txt: every line the content asks for that has no
 *     file yet, in the form the recorder takes. Record those, drop the mp3s
 *     into public/audio/el, run this again, and the tasks appear on their own.
 *
 * The slug rule is the one in lib/audio.ts and must stay byte-identical.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(root, 'content', 'english-studio-content.json');
const AUDIO_DIR = path.join(root, 'public', 'audio', 'el');
const TODO = path.join(root, 'recordings-todo.txt');

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

const content = JSON.parse(fs.readFileSync(CONTENT, 'utf8'));

/** Every spoken string in the course, in the order it is met. */
function wantedLines() {
  const lines = new Map(); // slug -> text, first one wins
  const add = (text) => {
    const key = slug(text);
    if (!lines.has(key)) lines.set(key, text);
  };

  for (const course of Object.values(content.courses ?? {})) {
    for (const unit of course.units ?? []) {
      for (const lesson of unit.lessons ?? []) {
        for (const entry of lesson.vocab ?? []) add(`${entry.w}. ${entry.ex}`);
        for (const task of lesson.ex ?? []) {
          if (task.t === 'dictation') add(task.a);
          if (task.t === 'listen') add(task.text);
        }
        for (const prompt of lesson.speak ?? []) add(prompt.model);
      }
    }
  }
  return lines;
}

const files = fs.existsSync(AUDIO_DIR)
  ? fs.readdirSync(AUDIO_DIR).filter((name) => name.endsWith('.mp3'))
  : [];
const present = new Set(files.map((name) => name.replace(/\.mp3$/, '')));

// 1. The map, rebuilt from disk and sorted so the diff stays readable.
content.audio = Object.fromEntries(
  [...present].sort().map((key) => [key, `audio/el/${key}.mp3`]),
);
fs.writeFileSync(CONTENT, JSON.stringify(content, null, 2) + '\n');

// 2. What is still to record.
const wanted = wantedLines();
const missing = [...wanted].filter(([key]) => !present.has(key));

if (missing.length === 0) {
  if (fs.existsSync(TODO)) fs.unlinkSync(TODO);
} else {
  const body = missing.map(([key, text]) => `${key}.mp3  |  ${text}`).join('\n');
  fs.writeFileSync(
    TODO,
    `# Still to record — one voice, same as the rest of the course.\n` +
      `# Left of the pipe is the file name; right of it is what to read out.\n` +
      `# Drop the mp3s into public/audio/el/ and run: node scripts/audio.mjs\n\n` +
      body +
      '\n',
  );
}

const orphans = [...present].filter((key) => !wanted.has(key));

console.log(`files on disk      ${present.size}`);
console.log(`lines wanted       ${wanted.size}`);
console.log(`still to record    ${missing.length}${missing.length ? '  → recordings-todo.txt' : ''}`);
console.log(`files nothing uses ${orphans.length}`);
