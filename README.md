# Date Invite 💘

A mobile-first, intentionally cute & funny interactive site to ask someone out.
Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and `motion`
(Framer Motion). All copy is in Portuguese.

## What it does

A single animated state machine walks the visitor through a flow:

```
intro  →  ask (Sim / Não)
            ├─ Sim → celebration → place → dates → interests → obrigado
            └─ Não → coin flip → second chance
                         ├─ "Mudei de ideia" → coin flip → celebration ...
                         └─ "Sério?"          → final rejection
```

Entry screen adapts based on `localStorage` history:

- **First time** – welcome copy
- **Returning** – "você está aqui de novo!" + emoji flash
- **Rejected before** – cat GIF interstitial, then the ask

When she finishes the happy flow (or hits the final rejection), her answers are
POSTed to `/api/submit`, which saves them to Vercel Postgres and forwards them to
your webhook.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in env vars (see below)
npm run dev
```

Open http://localhost:3000 on a phone-sized viewport.

> Tip: to re-test the different entry scenarios, clear the `oi-luana-state`
> key from `localStorage` (DevTools → Application → Local Storage).

## The webhook

`/api/submit` validates the payload and forwards it to `process.env.WEBHOOK_URL`.
If `WEBHOOK_URL` is empty, it just logs to the server console and returns 200,
so the app works out of the box during development.

Payload shape (see `lib/types.ts`):

```ts
type Submission = {
  outcome: "accepted" | "rejected";
  place?: { kind: "preset" | "custom"; value: string };
  availableDates?: string[]; // ISO yyyy-mm-dd
  interests?: { food: string[]; topics: string[]; custom: string[] };
  visitCount: number;
  rejectedBefore: boolean;
  submittedAt: string; // ISO timestamp
};
```

Build any receiver you like (serverless function, Google Apps Script web app,
Discord/Telegram proxy, n8n/Zapier, etc.) and paste its URL into `WEBHOOK_URL`.

## Admin

Responses are stored in **Vercel Postgres** and viewable at `/admin` (password-protected; not linked from the public flow).

### Vercel setup

1. Vercel Dashboard → your project → **Storage** → Create Database → **Postgres**
2. Connect the database to the project (`POSTGRES_URL` is injected automatically)
3. Settings → Environment Variables:
   - `ADMIN_PASSWORD` — password for `/admin`
   - `ADMIN_SESSION_SECRET` — long random string (e.g. `openssl rand -base64 32`)
   - `WEBHOOK_URL` — optional, same as before

### Local development

Pull env vars from Vercel (includes `POSTGRES_URL` after Storage is connected):

```bash
vercel env pull .env.local
```

Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in `.env.local` if they are not in the pulled file.

Without Postgres configured, `/api/submit` still works (log + webhook only); `/admin` shows a “database not configured” notice.

### What you see in the dashboard

Each card shows outcome (accepted/rejected), timestamp, place, available dates, interests (when accepted), visit count, and whether she had rejected before.

## Editing content

All Portuguese copy, the suggested **places**, and the **interest tags** live in
[`lib/content.ts`](lib/content.ts). Tweak names, times, addresses, and tags
there.

## Assets

Drop-in media lives in `public/assets/`:

| File | Used on |
| --- | --- |
| `pug-hat.png` | Main ask (happy pug) |
| `pug-sad.png` | Second chance + final rejection |
| `cat.gif` | "Rejected before" interstitial |
| `dog-butterfly.gif` | Celebration |
| `emoji-guy-interest-screen.png` | Interests screen |
| `emoji-guy-tongue-out-end.png` | Thank-you screen |

To use a dedicated "hiding pug" for the final rejection, add
`public/assets/pug-hiding.png` and swap the `src` in
`components/screens/FinalRejectionScreen.tsx`.

## Accessibility

Respects `prefers-reduced-motion`: big motion is replaced with simple fades and
timed interstitials are shortened.
