# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# Project Notes (Manacheck)

React + Vite SPA that fetches MTG decklists from Manabox/Moxfield and filters one list through another. Deployed as a static site on GitHub Pages at `https://xdainz.github.io/manacheck/`; a Cloudflare Worker ([workers/worker.js](workers/worker.js)) proxies upstream requests in production to avoid CORS.

- Overview and supported sources: [README.md](README.md).
- Worker proxy setup and deploy steps: [workers/README.md](workers/README.md).

## Commands

- `bun run dev` - start the Vite dev server.
- `bun run build` - typecheck (`tsc -b`) and build.
- `bun run test --run` - run vitest once (plain `bun run test` starts watch mode).
- `bun run lint` - run eslint. CI fails on any lint error, so run this before pushing.
- `bun run preview` - preview the production build.

Bun is managed by mise ([mise.toml](mise.toml)). If `bun` is not on PATH (common in non-interactive PowerShell), prefix commands with `mise exec --`, e.g. `mise exec -- bun run lint`.

## Architecture

Data flow: deck URL → [src/lib/deckFetch.ts](src/lib/deckFetch.ts) resolves which URL to actually fetch → [src/lib/parsers.ts](src/lib/parsers.ts) normalizes the response into `Card[]` → [src/lib/matching.ts](src/lib/matching.ts) intersects two lists by card `Name` → components render and [src/lib/export.ts](src/lib/export.ts) copies results to the clipboard.

- `src/lib/` holds pure, non-React logic (parsers, fetch URL resolution, matching, export, Google Sheets CSV). `src/hooks/` holds only real React hooks that wrap lib functions with state. Keep new business logic in `lib/` so it stays testable without rendering.
- **Fetch routing** ([src/lib/deckFetch.ts](src/lib/deckFetch.ts)): in dev, requests go through Vite proxy routes `/api/manabox` and `/api/moxfield` ([vite.config.ts](vite.config.ts)); in production they go through the Cloudflare Worker at `VITE_WORKER_BASE` (set in [.env.production](.env.production), injected in CI from the `WORKER_BASE` secret). `resolveFetchUrl` is pure and unit-tested - extend it there, not inside components.
- **Parsers throw on unexpected shapes** ([src/lib/parsers.ts](src/lib/parsers.ts)): `parseManabox` scrapes the second `<astro-island>` of the Manabox HTML, where every value is wrapped in a `[flags, value]` tuple (hence all the `[1]` indexing). If the page/API shape is unrecognized, parsers throw `DeckParseError` so the user sees an error instead of a false "no matches". Do not change failures back to silent `return []` - an empty deck still parses to `[]` legitimately.
- **Store pages** (`/:name`): [src/pages/StorePage.tsx](src/pages/StorePage.tsx) resolves the store case-insensitively from [src/constants.ts](src/constants.ts) (unknown names render `NotFound`). [src/components/StoreSearch.tsx](src/components/StoreSearch.tsx) reads a Google Sheet tab (NAME/URL columns, see [src/lib/sheets.ts](src/lib/sheets.ts)) listing the store's decklists, fetches them with a concurrency pool of 4 (one failing deck is skipped, not fatal), and caches the result in localStorage under `manacheck.store.<gSheetId>.decks` with a 1-hour TTL. Adding a store = adding an entry to `storeList` plus a sheet tab.

## Routing on GitHub Pages

The app uses `BrowserRouter` with a `404.html` redirect fallback ([public/404.html](public/404.html) encodes the path into a query string; an inline script in [index.html](index.html) restores it before React Router boots). **Do not switch to HashRouter** - the owner explicitly rejected it because it breaks routing on free GitHub Pages hosting. If you add routes, no extra work is needed; the fallback already covers any path under `/manacheck/`.

## CI / Deployment

- [ci.yml](.github/workflows/ci.yml): lint + test + build on pushes to `dev` and PRs to `main`/`dev`.
- [deployment.yml](.github/workflows/deployment.yml): on push to `main`, a `checks` job (lint + test) gates the GitHub Pages deploy.
- Branch flow: work happens on `dev`, merged to `main` via PR. Deploys are automatic from `main`.
- The Cloudflare Worker is deployed separately with wrangler (see [workers/README.md](workers/README.md)); changing [workers/worker.js](workers/worker.js) does nothing until it is redeployed.

## Key Files

- Entry: [src/main.tsx](src/main.tsx) renders [src/App.tsx](src/App.tsx) (routes) inside [src/layout/Layout.tsx](src/layout/Layout.tsx) (nav builds links from `storeList`).
- Comparator flow (home): [src/components/DeckComparator.tsx](src/components/DeckComparator.tsx).
- Store flow: [src/components/StoreSearch.tsx](src/components/StoreSearch.tsx).
- Shared UI: [src/components/DeckLinkInput.tsx](src/components/DeckLinkInput.tsx) (input + clear), [src/components/ResultSkeleton.tsx](src/components/ResultSkeleton.tsx) (loading placeholder), [src/components/SearchResult.tsx](src/components/SearchResult.tsx) (summary + export), [src/components/CardBoxGrid.tsx](src/components/CardBoxGrid.tsx).
- Hooks: [src/hooks/useDeckFetcher.ts](src/hooks/useDeckFetcher.ts) (fetch + loading/error state), [src/hooks/useMatches.ts](src/hooks/useMatches.ts).
- Types: [src/types/types.ts](src/types/types.ts) - note `Card` fields use Pascal_Snake naming (`Collector_number`); keep it consistent.

## Conventions and gotchas

- Formatting: Prettier with 4-space indent ([.prettierrc](.prettierrc)); package.json keys are kept alphabetically sorted.
- `ck_price` is the single-card Card Kingdom price. **"Total Price" in `SearchResult` deliberately sums one copy per card and ignores `Quantity`** - this is the owner's intended behavior, do not "fix" it by multiplying by quantity.
- Tests live in [tests/](tests/) and cover the `lib/` modules; they run in jsdom where noted via `@vitest-environment`. Add tests for new lib logic; UI components are currently untested (no testing-library dependency - don't add one casually).
- Card matching is by exact `Name` only - quantity, set, and printing are deliberately ignored.

## Known deferred work

- Store inventory is rebuilt client-side by each visitor on cache miss. If stores grow past a handful of decks, precompute the merged inventory on a schedule (Worker cron + KV, or a scheduled GitHub Action publishing JSON) and fetch one file instead.
