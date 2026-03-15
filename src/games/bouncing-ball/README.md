# Bouncing Ball

A simple breakout-style paddle game demonstrating the core game prototype patterns.

## Controls

- **← →** — Move the paddle left/right
- Ball resets if it falls below the paddle

## Patterns Demonstrated

- `useGameLoop` — delta-time based `requestAnimationFrame` loop
- `useKeyboard` — real-time keyboard input with `isKeyDown()`
- `useCanvas` — canvas ref and 2D context management
- Mutable refs for game state (avoids React re-renders during game loop)
- Collision detection: wall bounds + AABB paddle collision
