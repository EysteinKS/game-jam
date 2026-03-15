---
name: testing
description: Testing setup, patterns, and templates for Vitest + RTL
---

# Testing

## Setup

- **Vitest 3** with jsdom environment
- **globals: true** — `describe`, `it`, `expect`, `vi` available without imports
- **@testing-library/react** for component tests
- **@testing-library/jest-dom/vitest** matchers (configured in `src/test-setup.ts`)

## File Location

Tests are co-located with the code they test:

```
src/hooks/useKeyboard.ts
src/hooks/useKeyboard.test.ts

src/components/GameCard.tsx
src/components/GameCard.test.tsx
```

## Templates

### Hook Test

```ts
import { renderHook, act } from '@testing-library/react'
import { useMyHook } from './useMyHook'

describe('useMyHook', () => {
	it('does something', () => {
		const { result } = renderHook(() => useMyHook())
		// result.current has the hook return value
		act(() => {
			result.current.someAction()
		})
		expect(result.current.value).toBe(expected)
	})
})
```

### Component Test

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
	it('renders content', () => {
		render(
			<MemoryRouter>
				<MyComponent />
			</MemoryRouter>,
		)
		expect(screen.getByText('Expected Text')).toBeInTheDocument()
	})
})
```

### Canvas Game Test

```ts
// Mock canvas context
beforeEach(() => {
	const mockCtx = {
		clearRect: vi.fn(),
		fillRect: vi.fn(),
		beginPath: vi.fn(),
		arc: vi.fn(),
		fill: vi.fn(),
		stroke: vi.fn(),
		// ... add as needed
	}
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
		mockCtx as unknown as CanvasRenderingContext2D,
	)
})
```

### RAF (requestAnimationFrame) Test

```ts
beforeEach(() => {
	vi.useFakeTimers()
	let frameId = 0
	vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
		frameId++
		setTimeout(() => cb(performance.now()), 16)
		return frameId
	})
	vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {})
})

afterEach(() => {
	vi.restoreAllMocks()
	vi.useRealTimers()
})
```

## Run Tests

```bash
npm run test          # Watch mode
npm run test -- --run # One-shot (CI)
```
