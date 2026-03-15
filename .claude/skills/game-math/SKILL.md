---
name: game-math
description: Vector math, lerp, easing, random, collision, and grid math recipes for game development
---

# Game Math Recipes

## Vector 2D

```ts
interface Vec2 {
	x: number
	y: number
}

const vec2 = {
	add: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y }),
	sub: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y }),
	scale: (v: Vec2, s: number): Vec2 => ({ x: v.x * s, y: v.y * s }),
	dot: (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y,
	length: (v: Vec2): number => Math.sqrt(v.x * v.x + v.y * v.y),
	normalize: (v: Vec2): Vec2 => {
		const len = vec2.length(v)
		return len === 0 ? { x: 0, y: 0 } : vec2.scale(v, 1 / len)
	},
	distance: (a: Vec2, b: Vec2): number => vec2.length(vec2.sub(a, b)),
	angle: (v: Vec2): number => Math.atan2(v.y, v.x),
	fromAngle: (angle: number, length = 1): Vec2 => ({
		x: Math.cos(angle) * length,
		y: Math.sin(angle) * length,
	}),
}
```

## Lerp & Easing

```ts
// Linear interpolation
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

// Smooth lerp (use for camera follow, UI animations)
// Call each frame: value = smoothLerp(value, target, 8, dt)
const smoothLerp = (a: number, b: number, speed: number, dt: number): number =>
	lerp(a, b, 1 - Math.exp(-speed * dt))

// Easing functions (t in [0, 1])
const easeIn = (t: number): number => t * t
const easeOut = (t: number): number => 1 - (1 - t) * (1 - t)
const easeInOut = (t: number): number => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
```

## Random

```ts
// Float in [min, max)
const randFloat = (min: number, max: number): number => min + Math.random() * (max - min)

// Integer in [min, max]
const randInt = (min: number, max: number): number => Math.floor(randFloat(min, max + 1))

// Random item from array
const randItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!

// Random color
const randColor = (): string => `hsl(${randInt(0, 360)}, 70%, 60%)`
```

## Angle & Direction

```ts
// Angle between two points (radians)
const angleTo = (from: Vec2, to: Vec2): number => Math.atan2(to.y - from.y, to.x - from.x)

// Degrees ↔ Radians
const toRad = (deg: number): number => (deg * Math.PI) / 180
const toDeg = (rad: number): number => (rad * 180) / Math.PI

// Wrap angle to [-π, π]
const wrapAngle = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a))
```

## Clamp & Map

```ts
const clamp = (value: number, min: number, max: number): number =>
	Math.max(min, Math.min(max, value))

// Map value from one range to another
const mapRange = (
	value: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number,
): number => outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
```

## Grid / Tile Math

```ts
const TILE_SIZE = 32

// World position → tile coordinate
const worldToTile = (x: number): number => Math.floor(x / TILE_SIZE)

// Tile coordinate → world position (top-left of tile)
const tileToWorld = (tx: number): number => tx * TILE_SIZE

// Tile coordinate → world center
const tileCenterWorld = (tx: number): number => tx * TILE_SIZE + TILE_SIZE / 2
```

## Bounce Reflection

```ts
// Reflect velocity off a surface (given surface normal)
const reflect = (velocity: Vec2, normal: Vec2): Vec2 => {
	const dot = vec2.dot(velocity, normal)
	return vec2.sub(velocity, vec2.scale(normal, 2 * dot))
}

// Simple wall bounce
if (ball.x < 0 || ball.x > width) ball.vx *= -1
if (ball.y < 0 || ball.y > height) ball.vy *= -1
```
