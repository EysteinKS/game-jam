---
name: input-handler
description: Keyboard, mouse, touch, and gamepad input patterns for games
---

# Input Handler Patterns

## Keyboard (useKeyboard)

```tsx
import { useKeyboard } from '@/hooks/useKeyboard'

function MyGame({ width, height }: GameProps) {
  const { isKeyDown } = useKeyboard()

  const update = useCallback((dt: number) => {
    // Continuous input (held down)
    if (isKeyDown('ArrowLeft')) player.x -= SPEED * dt
    if (isKeyDown('ArrowRight')) player.x += SPEED * dt
    if (isKeyDown(' ')) player.jump() // space bar
    if (isKeyDown('w')) ...
    if (isKeyDown('s')) ...
  }, [isKeyDown])
}
```

### Common Key Names

- Arrow keys: `'ArrowLeft'`, `'ArrowRight'`, `'ArrowUp'`, `'ArrowDown'`
- Space: `' '`
- Enter: `'Enter'`
- Letters: `'a'`, `'b'`, `'w'`, `'s'`, etc. (lowercase)
- Escape: `'Escape'`
- Shift: `'Shift'`

### One-Shot Actions (Jump, Shoot)

For actions that should fire once per keypress (not hold), track "just pressed" state:

```ts
const prevKeysRef = useRef<Set<string>>(new Set())

const update = useCallback(
	(dt: number) => {
		if (isKeyDown('ArrowUp') && !prevKeysRef.current.has('ArrowUp')) {
			player.jump()
		}
		// Snapshot current keys for next frame
		// Note: direct ref access, not reactive
	},
	[isKeyDown],
)
```

## Mouse Input

```ts
const mouseRef = useRef({ x: 0, y: 0, down: false })

useEffect(() => {
	const canvas = canvasRef.current
	if (!canvas) return

	const rect = canvas.getBoundingClientRect()

	const handleMove = (e: MouseEvent) => {
		mouseRef.current.x = e.clientX - rect.left
		mouseRef.current.y = e.clientY - rect.top
	}
	const handleDown = () => {
		mouseRef.current.down = true
	}
	const handleUp = () => {
		mouseRef.current.down = false
	}

	canvas.addEventListener('mousemove', handleMove)
	canvas.addEventListener('mousedown', handleDown)
	canvas.addEventListener('mouseup', handleUp)

	return () => {
		canvas.removeEventListener('mousemove', handleMove)
		canvas.removeEventListener('mousedown', handleDown)
		canvas.removeEventListener('mouseup', handleUp)
	}
}, [])
```

## Touch Input

```ts
useEffect(() => {
	const canvas = canvasRef.current
	if (!canvas) return

	const handleTouch = (e: TouchEvent) => {
		e.preventDefault()
		const rect = canvas.getBoundingClientRect()
		const touch = e.touches[0]
		if (touch) {
			touchRef.current = {
				x: touch.clientX - rect.left,
				y: touch.clientY - rect.top,
			}
		}
	}

	canvas.addEventListener('touchstart', handleTouch, { passive: false })
	canvas.addEventListener('touchmove', handleTouch, { passive: false })

	return () => {
		canvas.removeEventListener('touchstart', handleTouch)
		canvas.removeEventListener('touchmove', handleTouch)
	}
}, [])
```

## Gamepad API

```ts
const update = useCallback((dt: number) => {
	const gamepads = navigator.getGamepads()
	const gp = gamepads[0]
	if (gp) {
		// Axes: 0=left stick X, 1=left stick Y
		const deadzone = 0.1
		if (Math.abs(gp.axes[0] ?? 0) > deadzone) {
			player.x += (gp.axes[0] ?? 0) * SPEED * dt
		}
		// Buttons: 0=A/Cross, 1=B/Circle, 12=D-pad up, etc.
		if (gp.buttons[0]?.pressed) {
			player.jump()
		}
	}
}, [])
```
