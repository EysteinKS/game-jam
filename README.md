# Game Jam Prototypes

A browser-based game prototyping platform built with React 19 + TypeScript + Vite 7.

**Live demo:** https://eystein.github.io/game-jam/

---

## Getting Started

```bash
git clone https://github.com/eystein/game-jam.git
cd game-jam
npm install
npm run dev
```

Open http://localhost:5173 to see the game gallery.

---

## How to Add a New Game

Use the `/add-game` Claude Code skill, or do it manually:

1. Create `src/games/<name>/index.tsx` — a React component accepting `{ width, height }: GameProps`
2. Create `src/games/<name>/README.md` — describe controls and patterns
3. Register in `src/lib/game-registry.ts` with a `lazy()` import

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full details.

---

## Available Games

| Game                                               | Description                                                                                           |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [Bouncing Ball](src/games/bouncing-ball/README.md) | Classic breakout-style paddle game demonstrating core hooks                                           |
| [Fantacity](src/games/fantacity/README.md)         | Medieval-fantasy RTS: base management, autobattle combat, four victory paths                          |
| [Hub Station](src/games/hub-station/README.md)     | Incremental roguelite strategy: warp to regions, gather resources, research upgrades, protect the Hub |

---

## Tech Stack

| Tool                  | Version | Purpose                 |
| --------------------- | ------- | ----------------------- |
| React                 | 19      | UI framework            |
| TypeScript            | ~5.8    | Type safety             |
| Vite                  | 7       | Build tool + dev server |
| Tailwind CSS          | 4       | Utility-first styling   |
| React Router          | 7       | Client-side routing     |
| Vitest                | 3       | Testing framework       |
| React Testing Library | 16      | Component testing       |

---

## Scripts

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `npm run dev`           | Start dev server         |
| `npm run build`         | Production build         |
| `npm run test`          | Run tests (watch mode)   |
| `npm run test -- --run` | Run tests once           |
| `npm run lint`          | Lint with ESLint         |
| `npm run format`        | Format with Prettier     |
| `npm run preview`       | Preview production build |

---

## Deployment

Automatically deploys to GitHub Pages on push to `main` via GitHub Actions.

The deploy workflow sets `BASE_URL=/game-jam/` so all routes and assets work correctly under the `/game-jam/` subpath.

To deploy manually: push to `main` or trigger the workflow via GitHub Actions.
