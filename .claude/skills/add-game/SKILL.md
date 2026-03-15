---
name: add-game
description: Scaffold a new game prototype and register it in the game registry
---

Scaffold a new game prototype. The argument is the game name in kebab-case (e.g., `snake`, `space-invaders`, `flappy-bird`).

## Steps

### 1. Create the game directory and files

```
src/games/<name>/
├── index.tsx      # Main game component
└── README.md      # Description and controls
```

**`src/games/<name>/index.tsx`** template:

```tsx
import { useRef, useCallback } from 'react'
import type { GameProps } from '@/types'
import { useGameLoop } from '@/hooks/useGameLoop'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useCanvas } from '@/hooks/useCanvas'

export default function GameName({ width, height }: GameProps) {
	const { canvasRef, getContext } = useCanvas(width, height)
	const { isKeyDown } = useKeyboard()

	const update = useCallback(
		(dt: number) => {
			const ctx = getContext()
			if (!ctx) return

			// Clear
			ctx.clearRect(0, 0, width, height)

			// TODO: update game state
			// TODO: render
		},
		[getContext, isKeyDown, width, height],
	)

	useGameLoop({ onUpdate: update })

	return (
		<div className="flex flex-col items-center gap-4">
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				className="rounded-lg border border-border"
				style={{ display: 'block' }}
			/>
			<p className="text-sm text-muted-foreground">Controls: ...</p>
		</div>
	)
}
```

### 2. Register in game-registry.ts

Add to the `games` array in `src/lib/game-registry.ts`:

```ts
{
  id: '<name>',
  title: '<Human Readable Title>',
  description: '<One sentence description>',
  component: lazy(() => import('@/games/<name>/index')),
},
```

### 3. Write README.md

Document the game, its controls, and patterns demonstrated.

### 4. Add a test file (optional but encouraged)

For game-specific logic (pure functions, physics helpers), add:

```
src/games/<name>/<name>.test.ts
```

### 5. Verify

```bash
npm run build && npm run test -- --run && npm run lint
```

### 6. Check in browser

Run `npm run dev` and verify the game appears on the home page and is playable.
