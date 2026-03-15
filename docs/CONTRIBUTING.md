# Contributing

## Adding a New Game

The fastest way is the `/add-game` Claude Code skill.

Manually:

1. **Create the game directory**

   ```
   src/games/<your-game-name>/
   ├── index.tsx   # Game component
   └── README.md   # Description and controls
   ```

2. **Game component requirements**
   - Default export
   - Accepts `{ width, height }: GameProps`
   - Uses `useGameLoop`, `useCanvas`, and `useKeyboard` from `@/hooks/`
   - Stores game state in `useRef` (not `useState`)

3. **Register the game** in `src/lib/game-registry.ts`

4. **Write tests** for any game-specific pure logic

5. **Verify before opening a PR**:
   ```bash
   npm run build && npm run test -- --run && npm run lint
   ```

## Code Style

- TypeScript strict mode — no `any`
- No `const enum` (erasableSyntaxOnly)
- Named exports for components and utilities
- `cn()` from `@/lib/utils` for dynamic class names
- Tabs for indentation (Prettier enforces this)
- Co-locate tests next to the code they test

## Testing Requirements

- All new hooks must have a test file
- Tests must cover happy path + at least one edge case
- Use `vi.useFakeTimers()` and mock RAF for game loop tests
- Mock canvas context for rendering tests

## Pull Request Process

1. Create a branch: `git checkout -b feature/my-game`
2. Make your changes
3. Run the quality gate: `npm run build && npm run test -- --run && npm run lint`
4. Commit and push
5. Open a PR targeting `main`
6. The CI workflow will run lint + test + build automatically

PRs are merged by squash commit. Keep PR scope focused — one game or feature per PR.

## Commit Messages

Use conventional commits:

- `feat: add snake game`
- `fix: ball clipping through paddle at high speeds`
- `chore: update dependencies`
- `docs: add contributing guide`
