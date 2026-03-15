---
name: build-commands
description: All npm scripts and build commands with descriptions
---

# Build Commands

## Core Commands

| Command                 | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `npm run dev`           | Start Vite dev server with HMR                         |
| `npm run build`         | Type-check + production build (`tsc -b && vite build`) |
| `npm run test`          | Run Vitest in watch mode                               |
| `npm run test -- --run` | Run tests once (for CI/pre-commit)                     |
| `npm run lint`          | Run ESLint on all files                                |
| `npm run format`        | Run Prettier on all src files                          |
| `npm run preview`       | Preview production build locally                       |

## Quality Gate

**All three must pass before any task is considered done:**

```bash
npm run build && npm run test -- --run && npm run lint
```

Run this after every phase of implementation.

## Notes

- `npm run build` runs `tsc -b` first — TypeScript errors will fail the build
- Tests use Vitest with jsdom and globals — no imports needed for `describe`, `it`, `expect`, `vi`
- ESLint uses flat config (eslint.config.js) with React Compiler plugin
- Prettier uses tabs, single quotes, trailing commas

## GitHub Pages Deployment

```bash
BASE_URL=/game-jam/ npm run build
```

This sets the Vite base path for subpath hosting. The deploy workflow sets this automatically.
