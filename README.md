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

## Leaderboard backend

The leaderboard is localStorage-only. [lib/leaderboard.ts](lib/leaderboard.ts) has async
signatures and inline notes for swapping in Supabase later without touching the UI.
