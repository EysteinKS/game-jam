# Game Patterns

Common patterns for building games in this project.

## Game Loop

See the `/game-loop` Claude Code skill for full details.

### Minimal Pattern

```tsx
import { useRef, useCallback } from 'react'
import type { GameProps } from '@/types'
import { useGameLoop } from '@/hooks/useGameLoop'
import { useCanvas } from '@/hooks/useCanvas'

export default function MyGame({ width, height }: GameProps) {
	const { canvasRef, getContext } = useCanvas(width, height)

	// Game state lives in refs, not state
	const posRef = useRef({ x: width / 2, y: height / 2 })

	const update = useCallback(
		(dt: number) => {
			const ctx = getContext()
			if (!ctx) return

			// Update
			posRef.current.x += 100 * dt

			// Render
			ctx.clearRect(0, 0, width, height)
			ctx.fillStyle = 'red'
			ctx.fillRect(posRef.current.x, posRef.current.y, 32, 32)
		},
		[getContext, width, height],
	)

	useGameLoop({ onUpdate: update })

	return <canvas ref={canvasRef} width={width} height={height} />
}
```

## State Management

Games need two kinds of state:

| Type                            | Where      | Why                             |
| ------------------------------- | ---------- | ------------------------------- |
| Game world state                | `useRef`   | No re-renders during 60fps loop |
| UI state (score display, menus) | `useState` | Needs React to re-render        |

```tsx
// Game world — refs
const ballRef = useRef({ x: 0, y: 0, vx: 100, vy: 100 })
const playerRef = useRef({ x: 200 })

// UI — state
const [score, setScore] = useState(0)
const [gameOver, setGameOver] = useState(false)
```

## Canvas Rendering

Order matters in a canvas frame:

1. `ctx.clearRect(0, 0, w, h)` — clear previous frame
2. Apply camera transform (if any): `ctx.save()` / `ctx.translate()`
3. Draw world objects (background → foreground)
4. `ctx.restore()` — undo camera
5. Draw HUD (score, lives — fixed to screen)

## Input Handling

```tsx
const { isKeyDown } = useKeyboard()

// In update callback:
if (isKeyDown('ArrowLeft')) {
	player.x -= SPEED * dt
}
```

For actions that fire once per keypress, track previous state:

```tsx
const prevKeyRef = useRef(false)

const update = useCallback(
	(dt: number) => {
		const jumpPressed = isKeyDown(' ')
		if (jumpPressed && !prevKeyRef.current && player.onGround) {
			player.vy = -JUMP_FORCE
		}
		prevKeyRef.current = jumpPressed
	},
	[isKeyDown],
)
```

## Collision Detection

### Ball vs Wall (Reflect)

```ts
if (ball.x - radius < 0) {
	ball.x = radius
	ball.vx = Math.abs(ball.vx)
}
if (ball.x + radius > width) {
	ball.x = width - radius
	ball.vx = -Math.abs(ball.vx)
}
```

### AABB (Box vs Box)

```ts
function overlaps(
	ax: number,
	ay: number,
	aw: number,
	ah: number,
	bx: number,
	by: number,
	bw: number,
	bh: number,
) {
	return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}
```

### Circle vs Circle

```ts
function circlesOverlap(ax: number, ay: number, ar: number, bx: number, by: number, br: number) {
	return Math.hypot(ax - bx, ay - by) < ar + br
}
```

## Camera Scrolling

```ts
const cameraRef = useRef({ x: 0, y: 0 })

// In update: follow player
cameraRef.current.x = playerRef.current.x - width / 2
cameraRef.current.y = playerRef.current.y - height / 2

// In render:
ctx.save()
ctx.translate(-cameraRef.current.x, -cameraRef.current.y)
// ... draw world ...
ctx.restore()
// Draw HUD (unaffected by camera)
```

## Particle Systems

```ts
interface Particle {
	x: number
	y: number
	vx: number
	vy: number
	life: number // 0–1, decreases over time
	color: string
}

const particlesRef = useRef<Particle[]>([])

// Spawn
function spawnParticles(x: number, y: number, count: number) {
	for (let i = 0; i < count; i++) {
		particlesRef.current.push({
			x,
			y,
			vx: (Math.random() - 0.5) * 200,
			vy: (Math.random() - 0.5) * 200,
			life: 1,
			color: `hsl(${Math.random() * 60 + 10}, 100%, 60%)`,
		})
	}
}

// In update:
particlesRef.current = particlesRef.current
	.map((p) => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, life: p.life - dt * 2 }))
	.filter((p) => p.life > 0)

// In render:
for (const p of particlesRef.current) {
	ctx.globalAlpha = p.life
	ctx.fillStyle = p.color
	ctx.fillRect(p.x - 2, p.y - 2, 4, 4)
}
ctx.globalAlpha = 1
```

## Audio (Web Audio API)

```ts
const audioCtxRef = useRef<AudioContext | null>(null)

// Initialize on first user gesture (browser policy)
function initAudio() {
	if (!audioCtxRef.current) {
		audioCtxRef.current = new AudioContext()
	}
}

// Play a simple beep
function playBeep(freq = 440, duration = 0.1) {
	const ctx = audioCtxRef.current
	if (!ctx) return
	const osc = ctx.createOscillator()
	const gain = ctx.createGain()
	osc.connect(gain)
	gain.connect(ctx.destination)
	osc.frequency.value = freq
	gain.gain.setValueAtTime(0.3, ctx.currentTime)
	gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
	osc.start()
	osc.stop(ctx.currentTime + duration)
}
```
