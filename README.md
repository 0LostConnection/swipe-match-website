# Archetype 🃏

A mobile-first interactive swipe experience that reveals your **personality
archetype** and then shows the tastes you share with a pre-configured creator
profile. Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and
`motion` (Framer Motion). All copy is in Portuguese; the visual identity is
dark / RPG-card inspired.

## What it does

A single client-side state machine walks the visitor through:

```
welcome → swipe (38-card deck, capped at 25/session) → loading → reveal → convergence
```

- **swipe** – drag cards left/right (or use the buttons). No score is shown.
- **loading** – a short atmospheric beat ("Analisando suas escolhas...").
- **reveal** – the winning archetype on an animated gradient "rare item" card.
- **convergence** – the cards both you and the creator liked, each with a
  first-person flavor text (or a fallback message if fewer than 2 overlap).

All game state lives in the client (`useReducer`). The creator's liked cards are
static in [`config/creator.ts`](config/creator.ts).

## Two roles

| Role | What they do |
| --- | --- |
| **Creator** | Edits `config/creator.ts` (name + `likedCardIds`) before deploy. |
| **User** | Opens the link, swipes, and sees their archetype + convergence. |

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 on a phone-sized viewport.

> Tip: clear the `archetype-state` key from `localStorage` to reset the visit
> counter (DevTools → Application → Local Storage).

## Configuring the creator profile

Edit [`config/creator.ts`](config/creator.ts):

```ts
export const CREATOR_PROFILE: CreatorProfile = {
  name: "Geovane",
  likedCardIds: ["cafe", "sushi", "cinema", "lofi", "games", /* ... */],
};
```

Valid card IDs live in [`lib/cards.ts`](lib/cards.ts).

## Cards, archetypes & scoring

- [`lib/cards.ts`](lib/cards.ts) — the 38-card deck (food / music / topic /
  aesthetic), each with per-archetype `scores` and a creator `flavorText`.
- [`lib/archetypes.ts`](lib/archetypes.ts) — the 7 archetypes (title, subtitle,
  icon, gradient, badge).
- [`lib/scoring.ts`](lib/scoring.ts) — `calculateResult` (argmax with a
  frequency tiebreaker) and `calculateConvergence` (intersection sorted by
  emotional relevance).

## Analytics (optional)

When a session reaches the convergence screen, an **anonymous** result is POSTed
to `/api/submit`:

```ts
type Submission = {
  archetype: ArchetypeId;
  likedCardIds: string[];
  convergenceIds: string[];
  deckSize: number;
  visitCount: number;
  submittedAt: string; // ISO timestamp
};
```

If `POSTGRES_URL` is set, it's stored in the `archetype_sessions` table (Neon /
Vercel Postgres). If `WEBHOOK_URL` is set, it's also forwarded there. With
neither configured, `/api/submit` just logs and returns 200, so the app works
out of the box.

### Admin

Stored sessions are viewable at `/admin` (password-protected; not linked from the
public flow). The dashboard shows the archetype distribution plus each session's
liked/convergence cards.

Environment variables:

- `POSTGRES_URL` — Neon connection string (auto-injected on Vercel Storage)
- `ADMIN_PASSWORD` — password for `/admin`
- `ADMIN_SESSION_SECRET` — long random string (e.g. `openssl rand -base64 32`)
- `WEBHOOK_URL` — optional external receiver

For local dev with Postgres: `vercel env pull .env.local`.

## Accessibility

Respects `prefers-reduced-motion`: animations collapse to near-instant fades.
