---
name: add-component
description: Scaffold a new shared UI component with variants and a co-located test
---

Scaffold a new shared component. Specify the component name and whether it is a UI primitive or app-level component.

## Locations

- **`src/components/ui/`** — Primitive UI components (Button, Card, Badge, Input, etc.)
- **`src/components/`** — App-level components (GameCard, Header, etc.)

## UI Primitive Template

```tsx
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const componentVariants = cva('base-classes-here', {
	variants: {
		variant: {
			default: 'default-classes',
			secondary: 'secondary-classes',
		},
		size: {
			default: 'default-size',
			sm: 'small-size',
			lg: 'large-size',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
})

interface ComponentProps extends VariantProps<typeof componentVariants> {
	className?: string
	children: React.ReactNode
}

export function Component({ variant, size, className, children }: ComponentProps) {
	return <div className={cn(componentVariants({ variant, size }), className)}>{children}</div>
}
```

## App-Level Component Template

```tsx
import { cn } from '@/lib/utils'

interface ComponentProps {
	className?: string
	// ... props
}

export function Component({ className, ...props }: ComponentProps) {
	return <div className={cn('base-classes', className)}>{/* content */}</div>
}
```

## Test Template

```tsx
import { render, screen } from '@testing-library/react'
import { Component } from './Component'

describe('Component', () => {
	it('renders children', () => {
		render(<Component>test content</Component>)
		expect(screen.getByText('test content')).toBeInTheDocument()
	})

	it('applies custom className', () => {
		const { container } = render(<Component className="custom">content</Component>)
		expect(container.firstChild).toHaveClass('custom')
	})
})
```

## Steps

1. Create `src/components/[ui/]ComponentName.tsx`
2. Create `src/components/[ui/]ComponentName.test.tsx`
3. Verify: `npm run build && npm run test -- --run && npm run lint`
