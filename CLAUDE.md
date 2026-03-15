# CLAUDE.md

## Project Summary

Game Jam Prototypes — a browser-based game prototyping platform built with React 19 + TypeScript + Vite 7. Games are registered in a central registry, code-split with `lazy()`, and routed to individual pages. Shared hooks (`useGameLoop`, `useKeyboard`, `useCanvas`) provide the building blocks for Canvas 2D games.

Auto-deploys to GitHub Pages at https://eystein.github.io/game-jam/ on push to main.

---

## Critical Commands

These three commands must **all pass** before any task is considered complete:

```bash
npm run build      # tsc -b && vite build
npm run test -- --run  # vitest one-shot
npm run lint       # eslint .
```

Combined: `npm run build && npm run test -- --run && npm run lint`

---

## Architecture & Patterns

### File Organization

```
src/
├── games/<name>/       # Individual game prototypes
│   ├── index.tsx       # Default export game component
│   └── README.md       # Controls and description
├── hooks/              # Shared game hooks (useGameLoop, useKeyboard, useCanvas)
├── components/         # Shared UI (GameCard, etc.)
│   └── ui/             # Primitive UI components (Button, Badge, etc.)
├── pages/              # Route-level pages (HomePage, GamePage)
├── lib/                # game-registry.ts, utils.ts
└── types/              # index.ts (GameEntry, GameProps)
```

### Game Registry

Add a game by:

1. Creating `src/games/<name>/index.tsx`
2. Adding an entry to `src/lib/game-registry.ts` with `lazy(() => import(...))`

Each registered game gets a route at `/games/<id>` and appears on the home page automatically.

### Import Alias

All `src/` imports use `@/`:

```ts
import { cn } from '@/lib/utils'
import type { GameProps } from '@/types'
```

### BASE_URL Routing

`BrowserRouter` uses `basename={import.meta.env.BASE_URL}` and `vite.config.ts` reads `process.env.BASE_URL`. The GitHub Pages deploy sets `BASE_URL=/game-jam/`.

---

## Testing

- **Vitest 3** with jsdom + globals
- Tests are co-located: `useKeyboard.ts` → `useKeyboard.test.ts`
- `@testing-library/jest-dom` matchers available in all tests
- Mock RAF in tests: see `/testing` skill for the template

---

## Code Style

- **Strict TypeScript** — no `any`, no type assertions without justification
- **`erasableSyntaxOnly`** — no `const enum`, no decorators
- **Named exports** for all components and utilities (exception: pages and game components may use `default export`)
- **`cn()`** from `@/lib/utils` for all dynamic class names
- **Tabs** for indentation (enforced by Prettier)
- **No `useMemo`/`useCallback`** unless needed for stable refs (React Compiler handles optimization)

---

## Available Skills

Invoke with `/skill-name` in Claude Code:

### Workflow

- `/create-plan` — Write a structured multi-phase plan for a game or feature
- `/execute-plan` — Execute the next incomplete phase of plan.md
- `/pull-request` — Create a GitHub PR from current branch

### Domain Reference

- `/architecture` — Project structure, patterns, routing, registry
- `/build-commands` — All npm scripts and quality gate
- `/testing` — Vitest setup, templates for hooks/components/canvas/RAF
- `/code-reviewer` — Review checklist (TS, React, game loop, accessibility)

### Actions

- `/add-game` — Scaffold a new game prototype and register it
- `/add-component` — Scaffold a shared UI component with CVA variants and tests

### Game Reference

- `/game-loop` — RAF patterns, delta time, state machines, pause/resume
- `/canvas-helper` — Canvas 2D drawing, collision detection, camera
- `/input-handler` — Keyboard, mouse, touch, gamepad patterns
- `/game-math` — Vector math, lerp, easing, random, grid math

---

## Documentation Updates

Update `docs/ARCHITECTURE.md` when:

- Adding new shared hooks
- Changing the game registry pattern
- Modifying routing structure

Update `README.md` when:

- Adding a new game (update the games list)
- Changing deployment configuration

---

## Common Gotchas

1. **`erasableSyntaxOnly`** — TypeScript `const enum` will cause a build error. Use regular `enum` or `const` objects.
2. **RAF cleanup** — Always cancel `requestAnimationFrame` in the `useEffect` return or you'll have memory leaks.
3. **Canvas null checks** — `getContext()` can return null. Always `if (!ctx) return`.
4. **BASE_URL routing** — If links are broken on GitHub Pages, check that `BrowserRouter` has `basename={import.meta.env.BASE_URL}`.
5. **Game state in refs** — Use `useRef` for game state, not `useState`, to avoid 60fps re-renders.
