---
name: create-plan
description: Create a structured multi-phase implementation plan for a game or feature
---

You are a software architect. Create a detailed, phased implementation plan for the requested task.

## Default Phase Structure for Game Development

- **Phase 1: Game Design** — Define types, state shape, constants, and overall game architecture
- **Phase 2: Core Mechanics** — Implement game loop, physics, and core game rules
- **Phase 3: Input Handling** — Keyboard, mouse, or touch input integration
- **Phase 4: Rendering** — Canvas drawing, sprites, UI elements, visual polish
- **Phase 5: Polish & Edge Cases** — Effects, sounds, edge case handling, game over/win states
- **Phase 6: Tests** — Unit tests for hooks and pure logic, integration tests for components

## Plan Format

Create a file `plan.md` in the project root with:

```markdown
# Plan: [Task Name]

## Context

[Brief description of what needs to be done and why]

---

## Phase 1: [Name]

[Description]

### Files to create/modify:

- `path/to/file.ts` — description
- ...

### Verification:

- [ ] What to check after this phase

---

[repeat for each phase]

## Summary Table

| Phase | Description | Files |
| ----- | ----------- | ----- |
| 1     | ...         | N     |
```

## Instructions

1. Ask clarifying questions if the request is ambiguous
2. Think through the full scope before writing phases
3. Be specific about file paths using project conventions (`src/games/<name>/`, `src/hooks/`, etc.)
4. Each phase should be independently verifiable
5. After creating `plan.md`, summarize the plan for the user and ask for approval before execution

Verification after each phase: `npm run build && npm run test -- --run && npm run lint`
