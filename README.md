# English Studio — handoff package

Everything needed to rebuild the English Studio prototype as a real Next.js + Supabase app.

**Read `CLAUDE.md`** — that is the build spec (stack, content model, design rules, six stages,
each with its own check). `SETUP.md` is the human checklist: accounts, domain, DNS, deploy, and
the exact prompt to paste per stage. `schema.sql` goes into the Supabase SQL editor in stage 1.

## What is here

| Path | What it is |
|---|---|
| `CLAUDE.md` | Build spec for Claude Code. Start here. |
| `SETUP.md` | Operator checklist (in Russian) — accounts, domain, stage order. |
| `schema.sql` | Postgres schema, triggers, RLS policies, Storage buckets. |
| `content/english-studio-content.json` | All course content — the single source of truth. |
| `audio/el/*.mp3` | 92 recordings, one voice (ElevenLabs · Amelia Beckett, British female). |
| `reference/prototype.dc.html` | Working prototype of the whole UI. |
| `reference/_ds/` | Growland design system: colour/type/spacing tokens, Montserrat, component bundle. |
| `reference/courses/` | How the prototype loads content and audio — read for structure. |

## Fidelity

**High fidelity.** The prototype has final colours, type, spacing and interactions. Recreate its
screens pixel-close in Next.js using the token files in `reference/_ds/`; take exact values from
the prototype rather than re-deciding them.

## About the prototype file

`reference/prototype.dc.html` is a **design and behaviour reference, not production code.** It
runs in a custom HTML runtime and keeps all state in `localStorage` — no server, no accounts.
Recreate its screens and logic in Next.js against Supabase; do not port its markup or runtime.

To view it, serve the `reference/` folder (`npx serve reference`) and open `prototype.dc.html` —
it needs `support.js` and `_ds/` as siblings.

## Screens in the prototype

Auth (log in / sign up, split dark-green hero + white card) · Dashboard (continue-lesson hero,
four stat tiles, four accent feature cards, today's plan) · Course map (12 unit cards, accent
colour, lesson list, progress) · Lesson (Overview / Vocabulary / Grammar / Practice / Speaking
tabs; locked lessons show a "content in production" panel) · Vocabulary flashcards + word list ·
Grammar projection card · Exercise runner (7 types, progress dots, feedback, score screen) ·
Speaking tasks with revealable model answers · Vocabulary bank (search, unit filter, mark known) ·
Progress (per-unit bars) · Personal cabinet (profile, stats, recent results; teachers also get a
student roster).

## Content scope today

12 units of Elementary (A1–A2), three lessons each, following a published coursebook syllabus.
Units 1–2 are fully written: 60 vocabulary entries, 66 exercises, 2 unit tests, 18 speaking
prompts, and 92 audio clips covering 100% of the spoken strings. Units 3–12 carry the syllabus
(topic, grammar focus, lexical set per lesson) and are marked `"locked": true` — they must render
a calm "coming soon" state, never an error. The architecture is per-level: adding
Pre-Intermediate → Advanced or an IELTS course means adding one content file, no schema change.

All texts, examples, definitions and exercises in the JSON are original. Keep it that way.
