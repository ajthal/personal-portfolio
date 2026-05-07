@AGENTS.md

# Andrew Thalheimer — Portfolio (Dark-Fantasy RPG Menu)

A single-page portfolio styled as a dark-fantasy RPG menu system. Built from a static HTML/JSX prototype that lives at `../ClaudeDesignBundle/Personal Dark Souls Themed Site/design_files/`. **Do not modify the prototype** — it is a frozen reference. All edits go to the Next.js app in this directory.

## Stack

- **Next.js 16.2.4** (App Router, Turbopack) — read `node_modules/next/dist/docs/` before using any Next.js API
- **TypeScript** strict
- **React 19** — every component is `"use client"` (browser APIs everywhere)
- **No CSS framework** — single global stylesheet at `app/globals.css`
- **`next/font/google`** for Cinzel, IM Fell English, EB Garamond (do NOT add `@import url(...)` for fonts; that would re-trigger the network)

## Architecture in one paragraph

The whole site renders inside a fixed **1600×900 stage** (`.stage` div) that scales to the viewport via `transform: scale(...)` set in `App.tsx`'s resize effect. Everything is positioned in 1600×900 design coordinates — never use `vw`/`vh` for layout, never assume the viewport size. View routing is a discriminated union (`type View`) held in `App.tsx` state, persisted to `localStorage` under `dfp_view`. There are **no Next.js routes beyond `/`** — the URL never changes. Each screen is a React component under `components/screens/` rendered conditionally based on `view.name`.

## File map

```
app/
  layout.tsx       — root layout, next/font wiring, font CSS variables
  page.tsx         — trivial wrapper: <App />
  globals.css      — ~600 lines: theme tokens, screen layouts, CRT/grain overlays, lightbox
components/
  App.tsx          — stage scaling, View routing, audio state, localStorage hydration
  icons/Icon.tsx   — 17 inline SVG icons + FrameOrnaments + CornerTL (typed Icon record)
  screens/         — one file per screen (Title, MainMenu, Category, ProjectDetail, PhotoGallery, PhotoLightbox, Character, Contact, Keys, Credits)
  shared/          — AudioControl, Placeholder, PromptBar, ScreenHeader, DeckShowcase
lib/
  data.ts          — CATEGORIES, CHARACTER, type guards (isProjectItem, isGalleryItem)
  audio.ts         — Web Audio synth: Audio$ object with intro/move/select/back/etc.
public/photos/<gallery-id>/  — real photos go here when ready
```

## View routing

`type View` is a discriminated union — when you add a screen, extend the union AND `isValidView()` AND the switch in `App.tsx`'s render. Current shapes:

```ts
| { name: "title" }
| { name: "main" }
| { name: "category"; categoryId: string }
| { name: "item"; categoryId: string; itemId: string }
| { name: "gallery"; categoryId: string; itemId: string }
| { name: "character" } | { name: "contact" } | { name: "keys" } | { name: "credits" }
```

`isValidView()` guards against stale localStorage pointing at deleted categories/items.

## Design system

All theme tokens are CSS custom properties on `:root` in `globals.css`:
- **Palettes**: `--ink`, `--ink-mid`, `--ink-dim` (parchment), `--amber`, `--amber-dim`, `--ashen`, `--bg-0`/`--bg-1`/`--bg-2` (deep blacks)
- **Fonts**: `--display-font` (Cinzel), `--serif-font` (EB Garamond), `--ornate-font` (IM Fell English) — these reference next/font CSS variables (`var(--font-cinzel)`, etc.) set in `layout.tsx`
- **Frame**: `.frame` class draws the bordered card with double inset; `<FrameOrnaments />` adds the four corner brackets

## Behavior contracts (don't break these)

- **Stage scaling**: `transform: scale()` is set on a wrapper, not on `.stage`. Don't replace this with CSS Grid/Flex tricks — every screen is laid out in absolute 1600×900 coords and depends on it.
- **`"use client"` everywhere**: every component reads `window`, `localStorage`, `AudioContext`, or registers `keydown`. There is currently no SSR for any screen. If you add a server component, isolate it carefully.
- **Audio gesture gate**: `Audio$.intro()` only fires after a user gesture (browser autoplay policy). The TitleScreen wires this on first keypress/click.
- **Keyboard navigation**: every screen registers its own `keydown` listener and removes it on unmount. Arrow keys + WASD navigate, Enter selects, Esc/Backspace goes back, Q/E cycles categories, M toggles sound.
- **localStorage keys**: `dfp_view` (current view), `dfp_audio` (enabled bool), `dfp_volume` (0–1). Hydrate in `useEffect`, not during render — SSR safety.
- **No image assets for chrome**: backgrounds, icons, ornaments are all SVG/CSS. Only `public/photos/` will hold raster images.

## Don'ts

- ❌ `@import url('https://fonts.googleapis.com/...')` — use `next/font/google` (already wired)
- ❌ `next/image` for procedural placeholders — they're CSS stripe patterns, not images
- ❌ `vw`/`vh` for component sizing — break the stage abstraction
- ❌ Reading `localStorage` or `window` during render — SSR will throw
- ❌ Adding routes under `app/<something>/page.tsx` — view routing is in-memory
- ❌ Modifying the prototype at `../ClaudeDesignBundle/...` — reference only
- ❌ "Refactoring" inline styles into CSS modules — the prototype's mix of inline + global is intentional and pixel-matched

## Common tasks

- **Add a screen**: create `components/screens/Foo.tsx`, extend `View` union + `isValidView` + `App.tsx` switch, add a route from MainMenu (or wherever it's reached from), wire keyboard nav.
- **Add a project**: edit `lib/data.ts` — append to the relevant category's `items` array. Use `kind: "project"` for inventory tiles, `kind: "gallery"` for photo galleries.
- **Tweak a color**: edit the CSS custom property on `:root` in `globals.css`.
- **Add an icon**: append to `Icon` record in `components/icons/Icon.tsx`. Update the `IconName` union type.
- **Add a sound**: extend `Audio$` in `lib/audio.ts`. Use the existing helpers (`tone()`, `noise()`, etc.) — don't pull in audio files.

## Pending work (placeholder content)

These are placeholders that need real content — flag any of them when the user asks about completing the site:

- `public/photos/<gallery-id>/` is empty — galleries currently render stripe placeholders (`<Placeholder>`)
- `lib/data.ts` `CHARACTER.bio` says "Placeholder bio. Real words to follow." — needs real bio
- Contact email in `lib/data.ts` is `andrew@example.com` — needs real address
- No favicon beyond Next.js default
- Not yet deployed (target: Vercel; `npx vercel` from this dir)

## Running and testing

- **Dev**: `npm run dev` (port 3000) — Turbopack, fast HMR
- **Build**: `npm run build` — should pass with zero errors/warnings
- **Lint**: `npm run lint`
- **Visual verification**: open `http://localhost:3000` in a browser at ≥1600×900 to see the design without scale-down letterboxing

## Source of truth for design intent

The original prototype README at `../ClaudeDesignBundle/Personal Dark Souls Themed Site/README.md` documents the design vocabulary (palette names, screen behaviors, motion specs). When in doubt about *intent*, read that file. When in doubt about *current implementation*, read the code in this directory.
