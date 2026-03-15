---
name: architecture
description: Reference guide for the project's architecture, patterns, and conventions
---

# Game Jam Architecture Reference

For detailed architecture documentation, see `docs/ARCHITECTURE.md`.

## Quick Reference

### Directory Structure

```
src/
├── games/           # Individual game prototypes
│   └── <name>/
│       ├── index.tsx        # Main game component (default export)
│       ├── README.md        # Game description and controls
│       └── *.test.ts        # Game-specific tests (optional)
├── hooks/           # Shared game hooks
│   ├── useGameLoop.ts
│   ├── useKeyboard.ts
│   ├── useCanvas.ts
│   └── *.test.ts
├── components/      # Shared UI components
│   └── ui/          # Primitive UI components
├── pages/           # Route-level pages
├── lib/             # Utilities and registry
│   ├── game-registry.ts
│   └── utils.ts
└── types/           # Shared TypeScript types
    └── index.ts
```

### Game Registry Pattern

Games are registered in `src/lib/game-registry.ts`:

```ts
import { lazy } from 'react'
import type { GameEntry } from '@/types'

const games: GameEntry[] = [
	{
		id: 'my-game',
		title: 'My Game',
		description: 'What the game is about',
		component: lazy(() => import('@/games/my-game/index')),
	},
]
```

Each registered game:

- Gets its own route at `/games/<id>`
- Is code-split via `lazy()` — loaded only when visited
- Appears on the home page grid automatically

### Import Alias

Use `@/` for all imports from `src/`:

```ts
import { cn } from '@/lib/utils'
import type { GameProps } from '@/types'
```

### Routing

`BrowserRouter` with `basename={import.meta.env.BASE_URL}` supports GitHub Pages subpath deployment.

### Component Conventions

- Named exports for all components
- `cn()` from `@/lib/utils` for className composition
- Co-located tests with the same filename + `.test.ts`
- No `any` — use proper TypeScript types

### GameProps Interface

All game components receive:

```ts
interface GameProps {
	width: number
	height: number
}
```
