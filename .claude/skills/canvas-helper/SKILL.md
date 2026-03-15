---
name: canvas-helper
description: Canvas 2D patterns for rendering, shapes, collision detection, and performance
---

# Canvas 2D Patterns

## Setup with useCanvas

```tsx
import { useCanvas } from '@/hooks/useCanvas'

function MyGame({ width, height }: GameProps) {
	const { canvasRef, getContext } = useCanvas(width, height)

	const update = useCallback(
		(dt: number) => {
			const ctx = getContext()
			if (!ctx) return // Always null-check!

			// Clear each frame
			ctx.clearRect(0, 0, width, height)

			// Draw...
		},
		[getContext, width, height],
	)
}
```

## Common Drawing Patterns

```ts
// Rectangle
ctx.fillStyle = '#ff0000'
ctx.fillRect(x, y, w, h)

// Rounded rectangle (modern)
ctx.beginPath()
ctx.roundRect(x, y, w, h, radius)
ctx.fill()

// Circle
ctx.beginPath()
ctx.arc(cx, cy, radius, 0, Math.PI * 2)
ctx.fill()

// Line
ctx.beginPath()
ctx.moveTo(x1, y1)
ctx.lineTo(x2, y2)
ctx.strokeStyle = '#ffffff'
ctx.lineWidth = 2
ctx.stroke()

// Text
ctx.font = '24px monospace'
ctx.fillStyle = '#ffffff'
ctx.textAlign = 'center'
ctx.fillText('Score: 100', width / 2, 40)
```

## Collision Detection

### AABB (Axis-Aligned Bounding Box)

```ts
function aabbCollision(
	ax: number,
	ay: number,
	aw: number,
	ah: number,
	bx: number,
	by: number,
	bw: number,
	bh: number,
): boolean {
	return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}
```

### Circle-Circle

```ts
function circleCollision(
	ax: number,
	ay: number,
	ar: number,
	bx: number,
	by: number,
	br: number,
): boolean {
	const dx = ax - bx
	const dy = ay - by
	return Math.sqrt(dx * dx + dy * dy) < ar + br
}
```

### Circle vs AABB

```ts
function circleAABB(
	cx: number,
	cy: number,
	cr: number,
	rx: number,
	ry: number,
	rw: number,
	rh: number,
): boolean {
	const nearX = Math.max(rx, Math.min(cx, rx + rw))
	const nearY = Math.max(ry, Math.min(cy, ry + rh))
	const dx = cx - nearX
	const dy = cy - nearY
	return dx * dx + dy * dy < cr * cr
}
```

## Camera / Viewport

```ts
// Apply camera transform before rendering world objects
ctx.save()
ctx.translate(-camera.x, -camera.y)
// ... draw world ...
ctx.restore()

// Draw HUD after restore (fixed to screen)
ctx.fillText('Score', 10, 20)
```

## Performance Tips

- Call `ctx.save()` / `ctx.restore()` instead of manually resetting state
- Batch fills of the same color — change `fillStyle` as rarely as possible
- Use `offscreenCanvas` for static backgrounds drawn once
- Avoid `ctx.getImageData` / `ctx.putImageData` in the game loop (slow)
- Use integer coordinates when possible: `Math.round(x)`
