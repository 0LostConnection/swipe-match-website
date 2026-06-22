# LLM Architecture Guide — Archetype

> **Purpose:** Single reference for LLMs working on this codebase.
> **Language:** User-facing copy is Portuguese (`pt-BR`); code and comments are English.
> **Critical:** This project uses **Next.js 16.2.9** — not standard Next.js. Read `node_modules/next/dist/docs/` before changing framework APIs. See `AGENTS.md`.

---

## 1. Project overview

| Field | Value |
|-------|-------|
| Package name | `archetype` |
| Repo / folder | `swipe-match-website` |
| Purpose | Mobile-first swipe experience that reveals a personality archetype + shared tastes with a creator |
| Entry point | `app/page.tsx` → `components/Experience.tsx` |
| Deploy target | Vercel (optional Postgres for anonymous analytics) |

### What it does

A client-side **state machine** drives a swipe game. The user swipes a deck of
preference cards; on completion, a scoring engine picks the winning **archetype**
and a convergence engine compares the user's liked cards with a static
**creator profile**. An anonymous result is optionally POSTed to `/api/submit`
for analytics.

### High-level architecture

```
Browser (client, all game logic)
  ├─ localStorage (`archetype-state`) — anonymous visit counter
  ├─ Experience reducer (`lib/flow.ts`) — screen + deck state machine
  ├─ AudioProvider (`lib/audio/`) — Web Audio engine, preload, screen cues
  ├─ config/creator.ts — static creator liked cards
  ├─ config/music.ts — track paths + per-screen music cues
  └─ POST /api/submit — anonymous result on reaching convergence
        ├─ Neon Postgres (`archetype_sessions`) — if POSTGRES_URL set
        └─ WEBHOOK_URL forward — optional external receiver

Admin (server-protected)
  ├─ middleware.ts — cookie session gate
  ├─ /admin — SSR archetype distribution + session list
  └─ /api/admin/* — login, logout, JSON list
```

### User flow (state machine)

```
sound → welcome → swipe (deck) → loading (~3s) → reveal → convergence
```

- `sound` — headphones/volume warning; **Prosseguir** unlocks `AudioContext`
- Music starts automatically on entering `welcome` (preload runs during `sound`)
- `RESTART` from convergence returns to `welcome` (skips `sound`)
- Global **MusicToggle** mutes output only; the engine keeps playing for sync

No archetype names are shown during swipe; progress is by card count only.

---

## 2. Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.2.9 App Router |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Animation | `motion` (import from `motion/react`) |
| Database | `@neondatabase/serverless` (Neon Postgres, optional) |
| Fonts | `next/font/google` — Playfair Display (display, italic), DM Sans (body), JetBrains Mono (mono) |

### Scripts

```bash
npm run dev    # next dev
npm run build  # next build
npm run start  # next start
npm run lint   # eslint
```

---

## 3. Directory map

```
/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Renders <Experience />
│   ├── globals.css             # Tailwind v4 dark/RPG theme
│   ├── admin/                  # SSR dashboard + login
│   └── api/
│       ├── submit/route.ts     # Anonymous result ingest
│       └── admin/*             # login, logout, sessions
├── components/
│   ├── Experience.tsx          # Root client orchestrator
│   ├── screens/                # One component per flow screen
│   ├── ui/                     # Reusable UI primitives
│   └── admin/SubmissionCard.tsx
├── config/
│   ├── creator.ts              # Creator profile (name + likedCardIds)
│   └── music.ts                # Track paths, screen cues, fade defaults
├── lib/
│   ├── audio/
│   │   ├── types.ts            # TrackId, MusicCue
│   │   ├── preload.ts          # fetch + decodeAudioData cache
│   │   ├── engine.ts           # Web Audio playback + crossfade
│   │   └── AudioProvider.tsx   # React context + useAudio()
│   ├── types.ts                # ArchetypeId, Card, Archetype, Submission, ...
│   ├── cards.ts                # 38-card deck + CARD_BY_ID
│   ├── archetypes.ts           # 7 archetypes + ARCHETYPE_IDS
│   ├── scoring.ts              # calculateResult + calculateConvergence
│   ├── deck.ts                 # shuffle + session cap
│   ├── flow.ts                 # Screen types, reducer
│   ├── storage.ts              # localStorage visit counter (client)
│   ├── submit.ts               # Client fetch to /api/submit
│   ├── db.ts                   # Neon schema + CRUD (archetype_sessions)
│   └── admin-auth*.ts          # HMAC session (Node + Edge)
├── public/
│   └── audio/                  # MP3 tracks (welcome, convergence)
└── tsconfig.json               # Path alias: @/* → ./*
```

---

## 4. Core systems

### 4.1 Flow state (`lib/flow.ts`)

```ts
type Screen =
  | "sound"
  | "welcome"
  | "swipe"
  | "loading"
  | "reveal"
  | "convergence";

type FlowAction =
  | { type: "PROCEED_SOUND" }                  // sound -> welcome
  | { type: "START" }                          // builds session deck
  | { type: "SWIPE"; dir: "like" | "pass" }    // records like, advances
  | { type: "FINISH_LOADING" }                 // loading -> reveal
  | { type: "GO"; screen: Screen }
  | { type: "RESTART" };                       // -> welcome (not sound)
```

On the final `SWIPE`, the reducer resolves `result` + `convergence` and routes
to `loading`. `Experience` fires the analytics submit once on entering
`convergence`. Screen changes trigger music cues from `config/music.ts` via
`useAudio()` (swipe/loading keep welcome; convergence keeps reveal track).

### 4.2 Audio (`lib/audio/`)

- **Preload** (`preload.ts`): on `AudioProvider` mount, loads `welcome` first
  then remaining tracks in parallel into an `AudioBuffer` cache.
- **Engine** (`engine.ts`): Web Audio API with per-cue gain (fade in/out) and a
  separate `userGain` for the global mute toggle. Muting does **not** pause the
  timeline — crossfades and seeks stay in sync.
- **Config** (`config/music.ts`): `TRACKS`, `SCREEN_CUES`, `getReducedFadeMs()`.
- **UI**: `SoundWarningScreen`, `MusicToggle` (fixed top-right after `sound`).

### 4.3 Data model (`lib/types.ts`)

`ArchetypeId` (7 ids), `CardCategory` ("food" | "music" | "topic" | "aesthetic"),
`Card` (label, emoji, per-archetype `scores`, `flavorText`), `Archetype`
(title, subtitle, icon, `gradient`, `badgeLabel`), `CreatorProfile`, and the
anonymous analytics `Submission`.

### 4.4 Scoring (`lib/scoring.ts`)

- `calculateResult(likedCards)` — sum per-archetype scores, argmax, frequency
  tiebreaker.
- `calculateConvergence(likedIds, creatorIds, allCards)` — intersection sorted
  aesthetic > topic > food > music.
- `LOW_CONVERGENCE_MESSAGE` / `MIN_CONVERGENCE` — fallback when `< 2` overlap.

### 4.5 Analytics pipeline

**Client** (`lib/submit.ts`): `submitAnswers(payload)` → `POST /api/submit`
(fire-and-forget). **Server** (`app/api/submit/route.ts`): validates the
`Submission` shape, inserts into `archetype_sessions` if DB configured, forwards
to `WEBHOOK_URL` if set.

### 4.6 Admin

Password (`ADMIN_PASSWORD`) + HMAC session cookie (`ADMIN_SESSION_SECRET`).
Node `crypto` for token creation (`lib/admin-auth.ts`), Web Crypto for Edge
middleware verification (`lib/admin-auth-edge.ts`). Keep both in sync.

---

## 5. Patterns to follow

1. **New card:** add to `CARDS` in `lib/cards.ts` (id, label, category, emoji,
   7-tuple scores, flavorText).
2. **New archetype:** extend `ArchetypeId` in `lib/types.ts`, `ARCHETYPE_IDS` +
   `ARCHETYPES` in `lib/archetypes.ts`, and add a score column to every card.
3. **Creator profile:** edit `config/creator.ts` only.
4. **New screen:** add to `Screen` union + reducer in `lib/flow.ts`, a component
   in `components/screens/`, and a case in `Experience.renderScreen()`.
5. **Animations:** use `motion/react`; CSS handles `prefers-reduced-motion`.
6. **Imports:** use the `@/` path alias.
7. **Admin/session format changes:** update both `admin-auth.ts` and
   `admin-auth-edge.ts`.

---

## 6. Styling (`app/globals.css`)

- Tailwind v4 `@theme inline` tokens: `--bg-base/-card/-elevated`,
  `--accent-primary/-secondary/-danger`, `--text-primary/-muted`, `--border`.
- `--font-display` (Playfair italic), `--font-body` (DM Sans), `--font-mono`
  (JetBrains Mono).
- `spin-border` keyframes + `@property --angle` power the reveal card's animated
  conic-gradient border.
- `prefers-reduced-motion` disables animation globally.

---

## 7. Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `POSTGRES_URL` | Optional | Neon connection string (analytics) |
| `ADMIN_PASSWORD` | Admin | Login password |
| `ADMIN_SESSION_SECRET` | Admin | HMAC secret for session cookies |
| `WEBHOOK_URL` | Optional | External receiver for results |

---

## 8. Known gaps / caveats

| Gap | Detail |
|-----|--------|
| Next.js 16 docs | Read `node_modules/next/dist/docs/` before framework changes |
| `middleware` deprecation | Build warns to migrate `middleware.ts` → `proxy` (pre-existing) |
| `/api/submit` is public | Minimal validation; no rate limiting |
| No tests / CI | No test files or GitHub Actions |
