---
name: game-loop
description: Patterns for game loops, delta time, state machines, and pause/resume using useGameLoop
---

# Game Loop Patterns

## Basic Usage

```tsx
import { useCallback } from 'react'
import { useGameLoop } from '@/hooks/useGameLoop'

function MyGame({ width, height }: GameProps) {
	const update = useCallback((dt: number) => {
		// dt = seconds since last frame (capped at 0.1)
		// Move entities: position += velocity * dt
	}, [])

	const { pause, resume, getFps } = useGameLoop({ onUpdate: update })
}
```

## Delta Time Movement

Always multiply velocities by delta time for frame-rate independent movement:

```ts
// ✅ Correct — frame-rate independent
ball.x += ball.velocity * dt

// ❌ Wrong — depends on frame rate
ball.x += 5
```

## Variable vs Fixed Timestep

**Variable timestep** (default) — simple, works for most games:

```ts
const update = useCallback((dt: number) => {
	// dt varies each frame
	position += velocity * dt
}, [])
```

**Fixed timestep accumulator** — for physics-heavy games:

```ts
const FIXED_DT = 1 / 60
const accumRef = useRef(0)

const update = useCallback((dt: number) => {
	accumRef.current += dt
	while (accumRef.current >= FIXED_DT) {
		fixedUpdate(FIXED_DT)
		accumRef.current -= FIXED_DT
	}
	render()
}, [])
```

## Game State Machine

```ts
type GameState = 'menu' | 'playing' | 'paused' | 'gameover'

const stateRef = useRef<GameState>('menu')
const { pause, resume } = useGameLoop({
	onUpdate: useCallback((dt) => {
		switch (stateRef.current) {
			case 'playing':
				updateGame(dt)
				break
			case 'menu':
			case 'gameover':
				// Still render, but don't update physics
				break
		}
	}, []),
})
```

## Pause on Tab/Window Blur

```ts
useEffect(() => {
	const handleBlur = () => pause()
	const handleFocus = () => resume()
	window.addEventListener('blur', handleBlur)
	window.addEventListener('focus', handleFocus)
	return () => {
		window.removeEventListener('blur', handleBlur)
		window.removeEventListener('focus', handleFocus)
	}
}, [pause, resume])
```

## Storing Game State

Use `useRef` for game state — avoids triggering re-renders every frame:

```ts
// ✅ Correct — no re-renders during loop
const positionRef = useRef({ x: 0, y: 0 })

// ❌ Wrong — re-renders 60x/second
const [position, setPosition] = useState({ x: 0, y: 0 })
```

Use `useState` only for UI state that needs React to re-render (score display, game over screen, etc.).
