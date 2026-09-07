/**
 * Drops a written unit into the content JSON.
 *
 *   node scripts/add-unit.mjs 5 path/to/unit5.json
 *
 * The syllabus for all twelve units is already in the content file — unit
 * number, title, theme, accent, and the id, title, grammar focus and lexical
 * set of each lesson. Writing a unit means filling in the bodies, not adding
 * a unit, so this only ever fills what is there and never invents structure.
 *
 * The input is `{ "lessons": { "5A": { grammar, vocab, ex, speak }, ... },
 * "test": [...] }`. Every lesson in the unit must be present, or nothing is
 * written: a half-filled unit that still says `locked` somewhere is worse
 * than an untouched one.
 *
 * Filling a unit clears `locked` on it and on its lessons, which is what puts
 * it in front of students. Run `node scripts/audio.mjs` afterwards to refresh
 * the recording list.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(root, 'content', 'english-studio-content.json');

const [numberArg, bodyPath] = process.argv.slice(2);
const number = Number.parseInt(numberArg, 10);

if (!Number.isInteger(number) || !bodyPath) {
  console.error('usage: node scripts/add-unit.mjs <unit number> <bodies.json> [level]');
  process.exit(1);
}
const levelId = process.argv[4] ?? 'elementary';

const content = JSON.parse(fs.readFileSync(CONTENT, 'utf8'));
const body = JSON.parse(fs.readFileSync(bodyPath, 'utf8'));

const course = content.courses?.[levelId];
if (!course) {
  console.error(`no course "${levelId}" in the content file`);
  process.exit(1);
}
const unit = course.units?.find((u) => u.n === number);
if (!unit) {
  console.error(`no unit ${number} in ${levelId} — the syllabus should already list it`);
  process.exit(1);
}

const missing = unit.lessons.filter((lesson) => !body.lessons?.[lesson.id]).map((l) => l.id);
if (missing.length) {
  console.error(`nothing written for ${missing.join(', ')} — writing nothing`);
  process.exit(1);
}
if (!Array.isArray(body.test) || body.test.length === 0) {
  console.error('the unit test is missing — writing nothing');
  process.exit(1);
}

for (const lesson of unit.lessons) {
  const written = body.lessons[lesson.id];
  delete lesson.locked;
  lesson.grammar = written.grammar;
  lesson.vocab = written.vocab;
  lesson.ex = written.ex;
  lesson.speak = written.speak;
}
unit.test = body.test;
delete unit.locked;

fs.writeFileSync(CONTENT, JSON.stringify(content, null, 2) + '\n');

const counts = unit.lessons.map((l) => `${l.id} ${l.ex.length} tasks`).join(', ');
console.log(`unit ${number} "${unit.title}" filled — ${counts}, unit test ${unit.test.length}`);
console.log('now run: node scripts/audio.mjs');
