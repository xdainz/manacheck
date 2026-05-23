# AGENTS.md

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

## Project Notes (Manacheck)

- Overview and supported sources: [README.md](README.md).
- Worker proxy setup and deploy steps: [workers/README.md](workers/README.md).
- Dev proxy routes for `/api/moxfield` and `/api/manabox`: [vite.config.ts](vite.config.ts).
- Production fetch behavior and `VITE_WORKER_BASE`: [src/hooks/useDeckFetcher.ts](src/hooks/useDeckFetcher.ts).

## Commands

- `bun run dev` - start the Vite dev server.
- `bun run build` - typecheck and build.
- `bun run test` - run vitest.
- `bun run lint` - run eslint.
- `bun run preview` - preview the production build.

## Key Files

- Entry: [src/main.tsx](src/main.tsx) renders [src/App.tsx](src/App.tsx).
- Home page layout: [src/pages/Home.tsx](src/pages/Home.tsx).
- Comparator flow: [src/components/DeckComparator.tsx](src/components/DeckComparator.tsx).
- Card parsing and fetchers: [src/hooks/useDeckFetcher.ts](src/hooks/useDeckFetcher.ts).
- Card matching and export: [src/hooks/compareDecks.ts](src/hooks/compareDecks.ts).

## Tooling

- Version pins in [mise.toml](mise.toml): Node 25, Bun 1.3.13, pnpm latest.
- React + Vite app configuration: [vite.config.ts](vite.config.ts).
- Types: [src/types/types.ts](src/types/types.ts).
- Tests: [tests/compareDecks.test.ts](tests/compareDecks.test.ts), [tests/exportList.test.ts](tests/exportList.test.ts), [tests/parseHelpers.test.ts](tests/parseHelpers.test.ts).
- Styles: [src/assets/css/index.css](src/assets/css/index.css).