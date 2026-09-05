# Growland Design System

Growland is a mobile app (iOS + Android) that teaches English through live **speaking clubs** — small moderated conversation groups — plus a companion dictionary, calendar, and 1:1 chat. This design system is reverse-engineered from a UX case-study deck for Growland (10 slide images, uploaded to this project — no live Figma file or codebase link was provided, only flattened presentation exports). Company context given: "Molly Zeyn" (the case study's author/designer credit; the product brand itself is **Growland**).

**Sources provided:** 10 `.webp` case-study slides covering: cover, design process, user personas, branding rationale, typography & color tokens, onboarding/main-screen wireframes, user + moderator auth flows, and "user main pages" flows. No Figma link, GitHub repo, or codebase path was given — everything here is read from those slide images and documented below in case a live source becomes available later.

## Product
Single product: the **Growland mobile app**, for both learners and moderators.
- **Learners** join speaking clubs by level (Beginner/Intermediate/Advanced), chat with other members, track XP/level progress, build a personal dictionary, and manage sessions on a calendar.
- **Moderators** register with credential verification and run/host speaking clubs.

## Brand concept
"Language as a living organism" — the brand mascot is a small green creature (plant/moss-like, big round eyes) meant to feel like a companion guiding the user's learning journey. Green was chosen deliberately: growth & progress, comfort & trust, freshness of ideas. Shapes are soft and rounded throughout (no sharp corners) to feel approachable.

## Index
- `styles.css` — root stylesheet, import-only (loads `tokens/*.css`)
- `tokens/` — colors, typography, spacing, radius, shadows, motion
- `assets/` — mascot illustration, app icon, onboarding illustrations (cropped directly from the source slides — see Iconography)
- `guidelines/` — foundation specimen cards (Design System tab: Colors, Type, Spacing, Brand, Iconography groups)
- `components/core/` — Button, Input, OtpInput, Checkbox, Badge, Avatar, ProgressBar
- `components/navigation/` — TabBar, TopBar
- `components/cards/` — MenuCard, ClubCard, ListItem
- `ui_kits/growland-app/` — click-through recreation of the app (onboarding → auth → home → clubs/calendar/chats/dictionary)
- `SKILL.md` — portable Claude Code skill version of this system

## Content fundamentals
Copy observed directly in the source screens (not case-study narration):
- "Welcome back", "Get Started", "Choose a stronger password", "Enter the verification code that was sent to your email", "Incorrect verification code. Check the code you entered and try again", "Your Progress", "Jump in!", "How would you like to use the app?", "Welcome to GROWLAND!", mascot line: "Hello!"

**Voice:** warm, encouraging, growth-oriented, second person ("Track *your* progress, join speaking clubs, chat with native speakers..."). Short, plain sentences — no jargon, no slang. Error states are calm and instructional, never blaming ("Incorrect verification code. Check the code you entered and try again" — states the problem, then the fix).

**Casing:** primary CTA buttons use Title Case ("Sign Up", "Log In", "Choose Premium"); secondary/status copy and helper text use sentence case ("Change password", "Try again", "Send code again in..."). Headlines are sentence case, not Title Case ("How would you like to use the app?").

**Person:** direct second person throughout onboarding and empty states. First-person plural ("Our app is available...") only appears in the case-study narration slides, not in-product — treat in-product copy as always "you/your".

**Emoji:** none observed anywhere in the product UI. The only expressive/warm touch is the mascot illustration and its speech-bubble line ("Hello!"). Do not introduce emoji.

**Numbers/stats:** used sparingly and only where functionally meaningful — XP counts ("250/500 XP"), level numbers, spot counts on club cards ("4/8 spots"), countdown timers on OTP screens. Never decorative stats.

## Visual foundations
**Color:** deep forest green (`#063417`) is the primary/ink color — used for headlines, primary buttons, and the onboarding hero background. A lighter brand mint (`#8ADBA6`) is the secondary brand surface. Four pastel accents color-code the four home-screen feature areas: pink for Speaking Clubs, mint for Chats, amber for Calendar, teal for Dictionary — each accent is used as a solid card fill with a matching illustration, not as a small tag or icon-only touch. Neutral surfaces are a near-white `#F6F6F6`, true white `#FFFFFF`, and a charcoal `#3E3E3E` for a secondary dark. Max 1–2 background colors per screen: either white/`#F6F6F6`, or the dark-green/mint hero gradient on splash & role-select screens.

**Type:** a single family — Montserrat — used for everything, display through caption; weight (mostly Semibold) does the work that a second family would elsewhere. Scale observed directly on the source spec slide: 44 / 24 / 18 / 14 / 12 px. No serif, no monospace anywhere.

**Spacing:** generous vertical rhythm between stacked cards (roughly 12–16px gaps); card internal padding is generous (~20–24px) relative to a compact 4px base grid.

**Backgrounds:** flat color or a single soft radial-gradient "blob" (used only on the splash/role-select hero screens, in mint tones) — no photography as a background, no repeating textures/patterns, no grain. One photographic image appears only in the persona-research slide (a stock headshot), not in the product itself. Full-bleed color fills are used for the four home feature cards and the onboarding hero.

**Animation:** none is evidenced in the source (all static mockups). Recommended default: short, subtle transitions only (150–250ms, standard ease) for state changes — nothing bouncy or elaborate, consistent with the calm/trustworthy tone.

**Hover/press states:** not shown in the static source. Recommended, consistent with the flat, saturated palette: hover = slightly darker fill (primary button hover token below brand green); press = a small (~2%) scale-down, no color flash.

**Borders & shadows:** almost no drop shadows in-product — flat cards rely on solid color fill for separation, not elevation. The few soft shadows that do appear are on floating annotation callouts in the process/wireframe slides (a light shadow to lift a note off the canvas) — not used at all in real app UI. Inputs use a thin 1px underline/border in neutral gray rather than a boxed border. OTP/code digit boxes use a light rounded 1px border.

**Radius:** everything is rounded — feature/menu cards use a large radius (~20–24px), buttons are close to a pill/large radius (~12–14px), OTP digit boxes and small inputs use a smaller radius (~8px). No sharp (0px) corners anywhere.

**Imagery tone:** the one photographic asset (persona headshot) is warm, naturally lit, casual — not moody or desaturated. Illustrations (mascot, the two role-select scenes) are flat vector, soft rounded shapes, a two-tone green/skin-tone palette with dark outlines — consistent "flat friendly vector" style, not isometric, not 3D, not photographic collage.

**Layout rules:** bottom tab bar is fixed on every authenticated screen (5 items: Homepage, Calendar, Words, Clubs, Chats). Top bar carries avatar + name + level on the left, notification bell + settings gear on the right. Primary CTA is always full-width and pinned near the bottom of the screen on forms/auth flows.

**Transparency/blur:** not used — no glass/blur surfaces anywhere in the source.

## Iconography
No icon font, SVG sprite, or icon-asset export was present in the source (only flattened slide screenshots) — so no real icon files could be copied in. Icons visible in the screens (bell, gear, back-chevron, home, calendar, book, chat bubble, people, mic, trophy/medal, eye/eye-off, checkmark) are simple 1.5–2px stroke line icons with rounded caps/joins, no fill — closest published match is the **Lucide** icon set (MIT-style open license). **Substitution flag:** the `Icon` component in `components/core/` hand-draws a small matching subset of these glyphs as inline stroke SVGs in the same weight/style, since the original icon files were not accessible — swap in the real icon export if one becomes available. Unicode characters and emoji are never used as icons in the source. Two flat-vector role-select illustrations (join-a-club / become-a-moderator) and the mascot illustration were cropped directly out of the case-study slides and live in `assets/` — everything else in `assets/` is copied pixel-for-pixel from the source, nothing was hand-drawn.

**Logo:** no standalone wordmark/logo file was present in the source — only the app name set in Montserrat ("GROWLAND", all caps, letter-spaced) and an app-icon tile. `assets/app-icon-square.png` and `assets/app-icon-circle.png` are cropped directly from the source slide (real asset, not recreated). Where a logo mark would go, this system falls back to the Montserrat wordmark — do not invent a logo.

## Intentional additions
No Figma file or codebase defined a component inventory — only static screenshots. The component list below was enumerated from what actually appears across the 10 slides (not a generic default kit): Button, Input, OtpInput, Checkbox, Badge, Avatar, ProgressBar, TabBar, TopBar, MenuCard, ClubCard, ListItem, Icon. `Icon` and `Checkbox` are additions with no single dedicated screen shot of them in isolation — Icon is needed to render the glyphs described above consistently; Checkbox is inferred from the "Remember me" control on the login screen.

## Caveats — please help iterate
- **No live Figma/codebase access.** Everything above was read from 10 flattened case-study images, not real design files or code. If a Figma link or repo exists, share it and I'll re-derive exact specs (spacing, exact hex values, real icon assets) instead of estimating from pixels.
- **Colors are pixel-sampled**, not read from a token/style panel — the two swatches on the color spec slide had a mismatched label (one swatch visually mint-green but labeled with the orange hex used elsewhere) so I trusted the sampled pixel value over the on-slide label; worth double-checking against the source file.
- **Icons are a substitution** (hand-drawn to match Lucide's style) — no real icon export was available.
- **No logo file** exists in the source — wordmark-only.
- Only one product surface exists in the source (the mobile app) — no marketing website or admin/back-office was shown, so no additional UI kits were built.
