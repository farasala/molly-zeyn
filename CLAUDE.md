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
| Audio | pre-rendered mp3 files served with the app (no TTS at runtime) — see §3 |

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

## 5. Who sees what — read this before touching access

Lessons happen live on Zoom. The platform is what comes **after** the lesson.

- **The teacher sees everything, always.** Every level, unit and lesson is open. No gates.
- **A student starts with nothing open.** They see the course map as greyed-out cards —
  unit titles and themes, so they can see where the course goes — and cannot open a lesson.
- The teacher runs a lesson, then **assigns homework for that one lesson** (`1A`, `1B`, …).
- The student does the homework. Finishing it **opens that lesson** as a revision resource.
- A teacher can also open a lesson by hand, for a student who missed the class.

This order is deliberate: it keeps the live lesson primary and stops a student running ahead.

**Enforce it on the server, before rendering.** The course JSON is imported into the server
bundle only — verified: no course string appears in any client chunk. Keep it that way. A
student who is not entitled to a lesson must never receive its content, not merely be unable
to click it. UI-only hiding is not access control.

Single source of truth: `has_lesson_access(student, level_id, lesson_id)` — true when a
submitted homework covers that lesson, or a teacher granted it by hand.

### Accounts

Students join **by invitation only**. There is no open sign-up.

1. Teacher creates a group (one-to-one is a group of one) and gets a link `/join/<token>`.
2. The student opens it, sees who invited them, and registers with an email.
3. Consuming the token adds them to the group. **The role comes from the invite and is
   always `student`** — the Student/Teacher choice comes out of the sign-up form.
4. Teacher accounts are created by hand: register, then set `role = 'teacher'` in `profiles`.

## 6. Data model

`schema.sql` holds what stage 1 applied. Everything below arrives as migrations in the stage
that needs it — do not rewrite the applied file, add to it.

Already live:

- `profiles` — `full_name`, `role` (`student` | `teacher`), `avatar_color`, `created_at`.
- `groups`, `group_members` — a teacher's classes.
- `activity_results` — one row per finished practice or unit test. Keep every attempt; show
  the best per activity, and use the sum of `xp` for total XP.
- `known_words` — `(user_id, level_id, word)`.

To come:

| Table | What it holds |
|---|---|
| `invites` | `token`, `teacher_id`, `group_id`, `expires_at`, `max_uses`, `used_count` |
| `homework` | `teacher_id`, `group_id`/`student_id`, `level_id`, `unit_n`, `lesson_id`, `items` (jsonb: the exact task list and its order), `due_at` |
| `homework_submissions` | `homework_id`, `student_id`, `attempt`, `status` (`assigned`\|`in_progress`\|`submitted`), `score`, `total`, `xp`, `submitted_at` |
| `homework_answers` | `submission_id`, `item_index`, `given`, `correct`, `answered_at` |
| `lesson_access` | `student_id`, `level_id`, `lesson_id`, `source` (`homework`\|`teacher`), `granted_at` |

`homework_answers` is what the whole review screen rests on. Without a row per task the
teacher cannot see *which* question a student got wrong, only a score, and the "go through
last week's homework" lesson opening does not work.

`homework.items` stores task references (lesson id + index into `ex`, or a vocabulary word)
**and the order**, so a submission stays readable later. Treat a released unit's content as
append-only; editing a published exercise invalidates past submissions.

**RLS is on for every table.** A student reads and writes only their own rows. A teacher
reads rows of students who share a group, and never writes a student's progress. Never
disable RLS "temporarily". Never query with the service-role key to work around it.

## 7. Homework

### Where the tasks come from

Assembled from the authored content, **never generated at runtime**. Units 1–2 already carry
66 exercises, 2 unit tests, 60 words and 18 speaking prompts. Generating new English would
break three things: the licence discipline (every string in the JSON is original and must
stay so), the audio (one recorded voice — a generated sentence has no file), and the
teacher's review (if every student gets different tasks, comparing them is meaningless).

The generator is deterministic: lesson → vocabulary recall drawn from `vocab`, the lesson's
own `ex` items, a couple of items from the unit's `test`, a dictation and a listening item
when a recording exists → shuffle → 12–15 tasks. Fill units 3–12 and their homework appears
with no code change.

### How a student works through it

Duolingo's session mechanics, minus the parts that sell subscriptions:

- one task per screen, a progress bar, instant right/wrong feedback;
- **a wrong task goes back into the queue and returns until it is answered correctly** —
  this is the mechanic worth copying;
- a score screen with XP, 10 per correct answer;
- **no hearts or lives.** A student locked out after three mistakes simply arrives at the
  next lesson with no homework done.

### Answer checking

**Homework answers are checked on the server.** Sending the answer key to the browser would
put it one devtools panel away, and the teacher's review data would mean nothing. One round
trip per task; from Frankfurt that is well under the time it takes to read the feedback.

Free practice inside an already-open lesson may check on the client — nothing is recorded.

## 8. Stages

Build one stage at a time. Each ends with a manual check. Do not start stage N+1 until the
check for stage N passes.

### Stage 1 — auth and accounts — DONE
Email + password via Supabase Auth, profile row from a trigger, session in cookies,
protected routes, header with log out. Live and verified.

### Stage 2 — content — DONE
`/levels`, `/levels/elementary`, `/lessons/[id]` with Overview / Vocabulary / Grammar /
Practice / Speaking. Flashcards, word list, the grammar projection card, speaking prompts,
92 recordings. Live and verified. **Access is not yet restricted — stage 4 does that.**

### Stage 3 — exercise engine
Seven types, all present in the JSON:

| `t` | shape | UI |
|---|---|---|
| `mc` | `q, o[], a` (index) | option buttons |
| `gap` | `q, a` (string), `hint?` | text input |
| `order` | `a` (target sentence) | shuffled word chips, click or drag into a strip |
| `transform` | `instr, q, a[]` | text input, any listed answer counts |
| `match` | `pairs[[left,right]]` | two columns, click left then right; shuffle the right column |
| `dictation` | `a` | play button + text input |
| `listen` | `text, q, o[], a` | play button + option buttons |

Answer comparison: lowercase, straighten quotes, strip `. , ! ? ; : "`, collapse spaces,
trim. Progress bar, per-item feedback, wrong items re-queued, score screen, XP = 10 per
correct answer. The `order` and `match` shuffles must never come back in the original order.
Build the checker as a server action from the start — stage 5 needs it there.

**Check:** finish a lesson's practice, log out, log in on another device — score and XP are there.

### Stage 4 — groups, invites and the access gate
Teacher creates and renames groups. Invite links; `/join/<token>` registers a student into a
group. Role choice comes out of the sign-up form; open sign-up closes. `lesson_access` and
`has_lesson_access`. The course map greys out for students; lesson pages refuse on the
server.

**Check:** a second student account, invited by link, sees grey cards and cannot fetch a
lesson's content — test it with the anon key, not just in the browser.

### Stage 5 — homework
A "Homework" tab beside the five lesson stages. Teacher assigns from it; student sees a card
with unit, topic and level, opens it, works through it, and the lesson unlocks on finish.

**Check:** full round trip on two devices — assign on the laptop, do it on the phone, the
lesson opens.

### Stage 6 — review
Group list → student → submission → **every task with the student's answer**, plus a
per-group summary of the most-missed tasks. This is the screen the next lesson starts from.

**Check:** results recorded on a student's phone appear in the teacher's view after a
refresh, and one student cannot fetch another's rows.

### Stage 7 — student cabinet
Dashboard totals, vocabulary bank with search and mark-as-known, per-unit progress, profile.

**Check:** the numbers on the dashboard, progress page and cabinet agree with each other.

---

## 9. Before the first real students

1. No demo or seeded accounts anywhere; no password shipped in code or docs.
2. Re-verify RLS on every table, and the access gate in §5, with a second logged-in
   student account, not just in theory.
3. Turn on database backups (Supabase Pro).
4. Custom domain live on HTTPS, `*.vercel.app` still working as a fallback.
5. Fill units 3–12: add `vocab`, `grammar`, `ex`, `speak` to each lesson, record the audio in
   the same single voice, drop the mp3s into `public/audio/el/`, remove `locked`.
6. Content licence: the syllabus follows a published coursebook, but every text, example and
   exercise in the JSON is original. Keep it that way — do not paste in coursebook text.

---

## 10. Working rules

- One stage per session. Report what you did and what the check is; wait for the result.
- Server components for data fetching; client components only where interaction needs them.
- Every list needs an empty state, every mutation a pending and an error state.
- No `any` in TypeScript. No `console.log` left behind.
- Commit per stage with a plain message: `stage 3: exercise engine`.
- Homework answers are checked on the server. Never ship an answer key to the browser.
- If something in this file conflicts with what the teacher asks in chat, the teacher wins —
  then update this file.
