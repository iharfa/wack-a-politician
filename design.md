# Design — Whack-a-Politician

A locked design system for this app. Every screen redesign reads this file before
emitting code. Do not regenerate per screen — extend or amend this file when the
system needs to grow.

## Genre
editorial (Carnival cluster)

## Macrostructure family
Single-route game app; "pages" are screen states.

- Title screen:  Marquee Hero — giant stacked wordmark, scrolling satire banner, poster-card mode selector
- Game screen:   function-first, no enrichment — the 3×3 board is the page; navy poster panel, cream stat tiles
- Modals:        poster cards — 2px ink border, hard-offset shadow, display headline with ornament divider

## Theme
Carnival · drop: **Diner Sign** (campaign-poster Americana — cream, cherry red, navy)

- `--color-paper`      oklch(95% 0.035 90)
- `--color-paper-2`    oklch(91% 0.042 88)
- `--color-paper-3`    oklch(86% 0.050 85)
- `--color-ink`        oklch(16% 0.04 30)
- `--color-ink-2`      oklch(28% 0.05 30)
- `--color-muted`      oklch(45% 0.04 35)
- `--color-rule`       oklch(30% 0.16 250)
- `--color-accent`     oklch(60% 0.22 25)   · cherry red
- `--color-accent-2`   oklch(30% 0.16 250)  · navy
- `--color-accent-ink` oklch(95% 0.035 90)
- `--color-focus`      oklch(30% 0.16 250)

## Typography
- Display: Big Shoulders Display, weight 800, style normal, uppercase, `font-variation-settings: "wdth" 110`
- Body:    Archivo, weight 400/700
- Display tracking: 0.02em (hero word: -0.005em, line-height 0.82)
- Loaded via next/font in app/layout.tsx (`--font-display` / `--font-body`)

## Spacing
4-point named scale in `tokens.css`. Screens use named tokens, never raw values.

## Motion
- Easing: cubic-bezier(0.16, 1, 0.3, 1) named `--ease-out`
- Game-feel keyframes (pop, bonk, hammer-swing, crack, marquee) are content, not decoration — they stay
- Reduced-motion: the in-game setting adds `.reduce-motion`, which kills all animation/transitions

## Microinteractions stance
- Silent success; no celebratory toasts
- Buttons press physically: `:active` translates 3px into the hard shadow
- Focus ring: 2px solid navy, instant, never animated

## CTA voice
- Primary CTA: solid fill in ONE accent (red or navy, never both in one block), 2px ink border,
  4px 4px 0 ink shadow, Big Shoulders uppercase, squared corners (radius 0)
- Secondary CTA: paper fill, same border + shadow, `◆` ornament prefix

## Signature moves (must appear)
- Hard-offset ink shadows everywhere (`4px 4px 0`, `6px 6px 0` on modals) — never soft shadows
- Duo-tone discipline: each surface commits to red OR navy
- Typographic ornaments `✱ ❋ ◆` as dividers and bullets — no decorative emoji in chrome
  (game-character emoji are content and stay)
- Marquee scroll banner on the title screen (reduced-motion freezes it)
- Halftone dot fills for placeholder regions

## What screens MUST share
- The Diner Sign palette, the display/body pairing, the CTA voice, squared corners, hard shadows

## What screens MAY differ on
- Which accent leads (title = red-led, board panel = navy-led)
- Density (game screen stays sparse for legibility at speed)
