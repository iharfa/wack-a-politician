# Whack-a-Politician 🔨

A mobile-first PWA arcade game: bonk cartoon politicians as they pop out of a 3×3 grid. 100% satire, foam mallets only.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Controls

- Keyboard: `Q W E` / `A S D` / `Z X C`, or numpad `789 / 456 / 123`
- Mouse: click holes
- Mobile: tap holes

## Deploy

Zero-config on Vercel — import the repo and deploy.

## Replacing the character art

Characters use emoji placeholders. Drop images into `public/characters/` and set the
`image` field in [lib/config.ts](lib/config.ts) (e.g. `image: "/characters/regular.png"`).

## Online leaderboard (Neon Postgres)

Scores are saved to a shared Neon database via `/api/scores` when `DATABASE_URL` is set,
with localStorage as the automatic fallback (unconfigured or offline). The `scores` table
is created automatically on first use — no manual SQL needed.

Setup:

1. Create a free database at [neon.tech](https://neon.tech) (or add the Neon integration
   from the Vercel marketplace, which sets the env var for you).
2. Copy the connection string into `.env.local` (see [.env.example](.env.example)) for
   local dev, and add `DATABASE_URL` to your Vercel project's environment variables.
