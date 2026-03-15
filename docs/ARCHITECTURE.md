# Architecture

## Directory Structure

```
game-jam/
├── src/
│   ├── games/               # Game prototypes
│   │   └── <name>/
│   │       ├── index.tsx    # Game component (default export, accepts GameProps)
│   │       ├── README.md    # Controls and patterns
│   │       └── *.test.ts    # Optional game-specific tests
│   ├── hooks/               # Shared game hooks
│   │   ├── useGameLoop.ts   # RAF loop with delta time
│   │   ├── useKeyboard.ts   # Key state tracking
│   │   └── useCanvas.ts     # Canvas ref + context management
│   ├── components/          # Shared UI components
│   │   ├── GameCard.tsx     # Home page game card
│   │   └── ui/              # Primitive UI components (shadcn-style)
│   ├── pages/               # Route-level pages
│   │   ├── HomePage.tsx     # Game gallery grid
│   │   └── GamePage.tsx     # Individual game view
│   ├── lib/
│   │   ├── game-registry.ts # Central game registry + getGame()
│   │   └── utils.ts         # cn() utility
│   ├── types/
│   │   └── index.ts         # GameEntry, GameProps
│   ├── App.tsx              # BrowserRouter + routes
│   ├── main.tsx             # React root entry
│   └── index.css            # Tailwind + CSS custom properties
├── docs/                    # Project documentation
├── .claude/skills/          # Claude Code skills (13 skills)
├── .github/workflows/       # CI + deploy workflows
└── index.html               # Vite HTML entry
```

## Game Registry Pattern

All games are registered in `src/lib/game-registry.ts`:

```ts
import { lazy } from 'react'
import type { GameEntry } from '@/types'

const games: GameEntry[] = [
	{
		id: 'my-game', // Used in URL: /games/my-game
		title: 'My Game',
		description: 'One sentence description',
		component: lazy(() => import('@/games/my-game/index')),
	},
]
```

### Why lazy()?

Each game is dynamically imported, meaning:

- Only downloaded when the user visits that game's page
- The bundle for the home page stays small
- Adding games doesn't slow down the initial load

### GameEntry Type

```ts
interface GameEntry {
	id: string
	title: string
	description: string
	thumbnail?: string
	component: LazyExoticComponent<(props: GameProps) => JSX.Element>
}
```

### GameProps Interface

All game components must accept:

```ts
interface GameProps {
	width: number
	height: number
}
```

## Routing

`BrowserRouter` with `basename={import.meta.env.BASE_URL}`:

- `/` → `HomePage` — grid of all registered games
- `/games/:gameId` → `GamePage` — loads game from registry by ID, renders with `<Suspense>`

The `basename` is critical for GitHub Pages: the app is served at `/game-jam/` and all routes need to be relative to that prefix.

## Shared Hooks API

### useGameLoop

```ts
const { pause, resume, getFps } = useGameLoop({
  onUpdate: (deltaTime: number) => void,
  autoStart?: boolean,  // default: true
})
```

- `deltaTime` is in seconds, capped at 0.1 (prevents spiral of death)
- Cleans up RAF on unmount automatically
- `pause()` / `resume()` for game state management

### useKeyboard

```ts
const { isKeyDown } = useKeyboard()
// isKeyDown('ArrowLeft') → boolean
```

- Tracks all currently-held keys via `keydown`/`keyup`
- Removes event listeners on unmount
- Use for continuous input (held keys) — implement one-shot logic with previous frame state

### useCanvas

```ts
const { canvasRef, getContext } = useCanvas(width, height)
// getContext() → CanvasRenderingContext2D | null
```

- Returns a ref to attach to `<canvas>`
- `getContext()` returns the 2D context (null-safe)

## Component Conventions

- Named exports for all components (pages and game entry points may use default export)
- `cn()` from `@/lib/utils` for className composition (clsx + tailwind-merge)
- Co-located test files: `Component.tsx` → `Component.test.tsx`
- No `any` types — use proper TypeScript

## Testing Strategy

- **Unit tests** — Hooks and pure game logic functions
- **Component tests** — RTL with `MemoryRouter` for pages that use `useParams`
- **Canvas tests** — Mock `getContext` with `vi.spyOn`
- **RAF tests** — `vi.useFakeTimers()` + mock `requestAnimationFrame`

All tests run in jsdom. Vitest globals enabled (`describe`, `it`, `expect`, `vi` without imports).

## Build & Deploy Pipeline

1. **Push to main** → GitHub Actions `deploy.yml` triggers
2. Build: `npm ci` → `npm run build` with `BASE_URL=/game-jam/`
3. Upload `dist/` as GitHub Pages artifact
4. Deploy to `https://eystein.github.io/game-jam/`

**CI on PRs** (`ci.yml`): lint → test → build. All must pass.

## How to Add a Game (Detailed)

1. Create `src/games/<name>/index.tsx`:

   ```tsx
   import type { GameProps } from '@/types'
   import { useGameLoop } from '@/hooks/useGameLoop'
   import { useCanvas } from '@/hooks/useCanvas'
   import { useKeyboard } from '@/hooks/useKeyboard'

   export default function MyGame({ width, height }: GameProps) {
   	// implement game
   }
   ```

2. Create `src/games/<name>/README.md` with controls and patterns

3. Register in `src/lib/game-registry.ts`:

   ```ts
   {
     id: '<name>',
     title: 'My Game',
     description: 'Description',
     component: lazy(() => import('@/games/<name>/index')),
   }
   ```

4. Run `npm run build && npm run test -- --run && npm run lint`

5. Test in browser with `npm run dev`
