---
name: code-reviewer
description: Review code changes against project standards and checklist
---

Review the specified code (or the current git diff if none specified) against these standards:

## TypeScript

- [ ] No `any` types — use proper types or `unknown` with type guards
- [ ] No type assertions (`as Foo`) unless absolutely necessary with a comment explaining why
- [ ] `erasableSyntaxOnly` compliant — no `const enum`, no decorators, no experimental features
- [ ] Strict mode compliant — no implicit any, no unused variables
- [ ] All function parameters and return types are correctly typed

## React

- [ ] All components use named exports (not default export with `export default function`)
  - Exception: pages and game components may use default export
- [ ] `cn()` from `@/lib/utils` used for all dynamic class names
- [ ] No hardcoded class name strings without `cn()`
- [ ] Hooks follow Rules of Hooks
- [ ] React Compiler compatible — no manual `useMemo`/`useCallback` unless for stable refs passed to RAF/events

## Game Loop & Performance

- [ ] RAF loops are cleaned up in `useEffect` return (no memory leaks)
- [ ] Event listeners are removed in `useEffect` return
- [ ] Game state stored in `useRef` (not `useState`) to avoid re-renders during game loop
- [ ] Canvas `getContext()` null-checked before use
- [ ] Delta time capped (e.g., `Math.min(dt, 0.1)`) to prevent spiral of death

## Tests

- [ ] New hooks have co-located test files
- [ ] New components have co-located test files
- [ ] Tests cover happy path + at least one edge case
- [ ] No `any` in test code

## Accessibility

- [ ] Interactive elements have accessible labels
- [ ] Canvas games have descriptive `aria-label` or `role` if needed
- [ ] Color is not the only means of conveying information

## File Organization

- [ ] Games in `src/games/<name>/`
- [ ] Shared hooks in `src/hooks/`
- [ ] UI primitives in `src/components/ui/`
- [ ] App-level components in `src/components/`
- [ ] All imports use `@/` alias

## Verification

After reviewing, run: `npm run build && npm run test -- --run && npm run lint`
