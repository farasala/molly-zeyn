# CLAUDE.md — English Studio

You are building **English Studio**: an interactive English-learning platform for one teacher
(Farhat, English + IELTS, Almaty) and their students. Lessons run online: the teacher shares the
screen during class, students also work at home as homework.

Read this whole file before writing code. **Build one stage at a time.** Each stage ends with a
manual check. Do not start stage N+1 until the check for stage N passes. If asked to "do
everything", refuse and do the next unfinished stage only.

---

## 1. Stack — fixed, do not substitute

| Concern | Choice |
|---|---|
| Framework | **Next.js 15, App Router, TypeScript** |
| Styling | **Plain CSS + CSS custom properties** from `reference/_ds/` (no Tailwind, no CSS-in-JS) |
| Auth + DB + files | **Supabase** (Postgres, Auth, Storage, RLS) |
| Hosting | **Vercel** |
| Domain | bought on hoster.kz, DNS pointed at Vercel |
| Audio | pre-rendered mp3 files in Supabase Storage (no TTS at runtime) |

No other dependencies without asking. No ORM — use `@supabase/supabase-js` and
`@supabase/ssr` only.

### Environment variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server-side only, never imported into a client component
```
Never commit `.env.local`. Never use the service-role key in anything the browser loads.

---

## 2. What is in this folder

```
CLAUDE.md                            ← this file
SETUP.md                             ← human checklist: accounts, domain, DNS, deploy
schema.sql                           ← run this in Supabase SQL editor (stage 1)
content/english-studio-content.json  ← ALL course content. Source of truth.
public/audio/el/*.mp3                ← 92 recordings (ElevenLabs, one voice), served by the app
reference/prototype.dc.html          ← working HTML prototype of the whole UI
reference/_ds/                       ← design system: tokens, fonts, styles, component bundle
reference/courses/                   ← how the prototype loads content (read for structure)
```

`reference/prototype.dc.html` is a **design and behaviour reference**, not production code.
It runs in a custom HTML runtime and stores everything in `localStorage`. Recreate its screens
and interactions in Next.js against Supabase. Copy its **visual values exactly**; do not copy
its markup or its runtime.

To view it: it needs `support.js` and `_ds/` next to it, so open it from
`reference/prototype.dc.html` with a static server (`npx serve reference`).

---

## 3. Content model — read this before stage 2

`content/english-studio-content.json`:

```jsonc
{
  "meta":   { "voice": "...", "audioKeyRule": "..." },
  "levels": [ { "id": "elementary", "name", "cefr", "status": "ready"|"planned", "units", "blurb" } ],
  "audio":  { "<slug>": "audio/el/<slug>.mp3" },
  "courses": {
    "elementary": {
      "id", "name", "cefr", "note",
      "units": [ {
        "n": 1, "title": "Hello", "theme", "accent": "pink|mint|amber|teal",
        "practical": "Practical English — ...",
        "locked": true,               // units 3–12: syllabus only, no content yet
        "lessons": [ {
          "id": "1A", "title", "g": "grammar focus", "v": "lexical set",
          "locked": true,             // when true: render the "coming soon" lesson state
          "grammar": { "h": "html heading", "rows": [{ "label", "items": ["html"] }], "notes": ["html"] },
          "vocab":   [ { "w", "ipa", "pos", "def", "ex" } ],
          "ex":      [ /* see stage 3 */ ],
          "speak":   [ { "p": "prompt", "model": "model answer" } ]
        } ]
      } ],
      "test": [ /* same exercise shapes, per unit */ ]
    }
  }
}
```

Rules:
- **Content lives in this JSON, not in the database.** The DB stores users and progress only.
  Progress rows reference content by string id (`"1A"`, `"U1"`). Adding units 3–12 later must
  require no migration.
- `grammar.h`, `grammar.rows[].items[]` and `grammar.notes[]` contain **`<b>` and `<i>` only**.
  Render them by parsing those two tags into elements — do **not** use `dangerouslySetInnerHTML`.
- Units/lessons with `"locked": true` must render a calm "syllabus set — content in production"
  panel showing the grammar focus and lexical set. They must never 404 or throw.
- 12 units exist; only units 1 and 2 have content today. That is expected.

### Audio
Every spoken string maps to one file by slug:

```ts
const slug = (t: string) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
```

- vocabulary card / word row / vocabulary bank → `slug(word + '. ' + example)`
- dictation exercise → `slug(ex.a)`
- listening exercise → `slug(ex.text)`
- speaking model answer → `slug(speak.model)`

All 92 files exist and cover 100% of units 1–2. Play them with a plain `<audio>` element.
**Never fall back to browser speech synthesis** — one voice only. If a file is missing, hide
the play button instead.

**Where they are served from (changed in stage 2).** The files live in `public/audio/el/` and
ship with the app, served from the Vercel CDN. The Storage bucket `audio` is created and public,
but writing to it needs the service-role key, which this app must never hold — so the upload
cannot be automated from here. To move to the bucket later: upload the folder in the Supabase
dashboard, then set `NEXT_PUBLIC_AUDIO_BASE` to
`https://<project>.supabase.co/storage/v1/object/public/audio/el`. Nothing else changes;
`lib/audio.ts` reads that one variable.

---

## 4. Design — non-negotiable

The Growland design system is in `reference/_ds/`. Import the token files and `styles.css`
once in the root layout and style everything with `var(--*)`.

- Ink / primary: `var(--green-900)` `#063417`. Brand mint `var(--mint-400)` `#8ADBA6`.
- Accents, one per unit, solid fills only: pink, mint, amber, teal.
- Surfaces: `var(--neutral-100)` `#F6F6F6` page, `#fff` cards. Max two background colours per screen.
- Type: **Montserrat only** (fonts in `_ds/fonts/`), weights 400–800. Scale 44 / 24 / 18 / 14 / 12.
- Radius: cards `--radius-lg`/`--radius-xl` (16–24px), buttons `--radius-pill`, inputs `--radius-md`. No sharp corners.
- Flat: no drop shadows on app cards, no gradients except the dark-green auth hero, no blur, **no emoji**.
- Transitions 150–250ms ease. Nothing bouncy.
- Copy: English only, second person, sentence case for headings, Title Case for primary CTAs.
  Errors state the problem then the fix.
- Class-based CSS is expected here (this is a real Next.js app, not the prototype runtime).
- Demo-screen legibility: nothing below 14px; lesson content (grammar, exercise questions,
  flashcards) is deliberately large — 19–44px — because it is projected during online lessons.
  Keep those sizes.

Copy exact spacing, sizes and colours per screen from `reference/prototype.dc.html`.

---

## 5. Data model

Run `schema.sql` in the Supabase SQL editor. Summary:

- `profiles` — one row per auth user: `full_name`, `role` (`student` | `teacher`), `avatar_color`, `created_at`.
- `groups`, `group_members` — a teacher's classes.
- `activity_results` — one row per finished practice or unit test: `level_id`, `unit_n`,
  `lesson_id`, `kind` (`practice` | `test`), `score`, `total`, `xp`, `created_at`. Keep every
  attempt; show the best per activity, and use the sum of `xp` for total XP.
- `known_words` — `(user_id, level_id, word)` unique, one row per word marked known.
- `homework`, `homework_submissions` — stage 6.

**RLS is on for every table.** A student can read and write only their own rows. A teacher can
read rows of students who share a group with them, and cannot write a student's progress.
Never disable RLS "temporarily". Never query with the service-role key to work around it.

---

## 6. Stages

### Stage 1 — auth and accounts
Email + password sign-up and log-in via Supabase Auth. Sign-up asks name, email, password, role
(Student / Teacher) and creates the matching `profiles` row. Session persists across reloads.
Protected routes redirect to `/login`. Header shows the signed-in user; log out works.
Recreate the split auth screen from the prototype (dark-green hero left, white card right).
No demo accounts, no one-click login buttons.

**Check:** register on a phone as a student → that student appears in Supabase and, once
stage 5 exists, in the teacher's list on a laptop. Log out, log back in, session holds.

### Stage 2 — content
Load the JSON server-side. `/levels` (Elementary live, five levels planned), `/levels/elementary`
(12 unit cards, accent colour, lesson list, progress bar), `/lessons/[id]` with the five stages
Overview / Vocabulary / Grammar / Practice / Speaking. Vocabulary = flashcard flip + word-list
toggle + play button. Grammar = the large projection card. Upload audio to Storage; playback works.
Locked units render the "coming soon" panel.

**Check:** every unit and lesson opens without an error; unit 3 shows "coming soon"; audio plays
in vocabulary and speaking.

### Stage 3 — exercise engine
Seven types, all present in the JSON:

| `t` | shape | UI |
|---|---|---|
| `mc` | `q, o[], a` (index) | option buttons, instant check |
| `gap` | `q, a` (string), `hint?` | text input |
| `order` | `a` (target sentence) | shuffled word chips, click or drag into a strip |
| `transform` | `instr, q, a[]` | text input, any listed answer counts |
| `match` | `pairs[[left,right]]` | two columns, click left then right; shuffle the right column |
| `dictation` | `a` | play button + text input |
| `listen` | `text, q, o[], a` | play button + option buttons |

Answer comparison: lowercase, straighten quotes, strip `. , ! ? ; : "`, collapse spaces, trim.
Progress dots, per-item feedback, skip, score screen, XP = 10 per correct answer. The `order`
and `match` shuffles must never come back in the original order. Unit test = same engine over
`unit.test`.

**Check:** finish a lesson, log out, log in on another device — the score and XP are there.

### Stage 4 — student cabinet
Dashboard (continue-lesson hero, XP / words / activities / units-mastered, four feature cards,
today's plan), vocabulary bank (search, filter by unit, mark known, audio), progress page
(per-unit bars), personal cabinet (profile, editable name, stats, last results, log out).
All figures come from `activity_results` and `known_words`.

**Check:** numbers on the dashboard, progress page and cabinet agree with each other.

### Stage 5 — teacher cabinet
Groups: create, rename, add and remove students. Student list with real progress per student
(percentage, XP, words, last activity) and a read-only drill-down into one student's progress.
Teacher toolbar for live lessons: show/hide answers, task timer.

**Check:** a student's result recorded on their phone appears in the teacher's view within a
refresh — and one student cannot fetch another student's rows (test it with the anon key).

### Stage 6 — homework
Teacher assigns a lesson or a custom task to a group or one student, with instructions and a due
date. Student sees assigned homework, submits text and/or file uploads (private `homework`
bucket, per-user folders, RLS on Storage too). Teacher reviews: reads, grades, leaves feedback;
student sees the result. Longest stage — split it into assign → submit → review and check each.

**Check:** full round trip on two devices, and no student can read another student's file by
guessing a path.

---

## 7. Before the first real students

1. No demo or seeded accounts anywhere; no password shipped in code or docs.
2. Re-verify RLS on every table and on the `homework` Storage bucket, with a second logged-in
   student account, not just in theory.
3. Turn on database backups (Supabase Pro).
4. Custom domain live on HTTPS, `*.vercel.app` still working as a fallback.
5. Fill units 3–12: add `vocab`, `grammar`, `ex`, `speak` to each lesson, record the audio in
   the same single voice, drop the mp3s into the `audio` bucket, remove `locked`.
6. Content licence: the syllabus follows a published coursebook, but every text, example and
   exercise in the JSON is original. Keep it that way — do not paste in coursebook text.

---

## 8. Working rules

- One stage per session. Report what you did and what the check is; wait for the result.
- Server components for data fetching; client components only where interaction needs them.
- Every list needs an empty state, every mutation a pending and an error state.
- No `any` in TypeScript. No `console.log` left behind.
- Commit per stage with a plain message: `stage 3: exercise engine`.
- If something in this file conflicts with what the teacher asks in chat, the teacher wins —
  then update this file.
