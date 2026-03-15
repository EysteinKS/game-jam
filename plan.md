# Plan: Fantacity — RTS Base Manager Prototype

## Context

Fantacity is a medieval-fantasy RTS prototype without point-and-click unit micro. The player
manages a base through menus — assigning workers, gathering resources, constructing buildings,
training armies and researching magic — then dispatches armies to an overworld map to scout,
loot and fight autobattle encounters. Victory is achieved through one of four conditions:
Domination, Religion, Diplomacy or Science.

This is implemented as a self-contained `GameProps`-compatible React component at
`src/games/fantacity/`. Because the game is menu-driven rather than pure Canvas, it uses
standard React/DOM rendering styled with Tailwind, while keeping the game tick inside
`useGameLoop` for consistent delta-time updates.

---

## Phase 1: Game Design ✅ Complete

Define all TypeScript types, enums, constants, and the top-level state shape that every
subsequent phase will build on.

### Files to create/modify:

- `src/games/fantacity/types.ts` — all interfaces and type aliases (resources, buildings,
  units, army, overworld tile, victory condition, game phase)
- `src/games/fantacity/constants.ts` — numeric tuning values (gather rates, costs, build
  times, combat stats, tick interval)
- `src/games/fantacity/state.ts` — `createInitialState()` factory and the `GameState` type
  re-exported for convenience

### Verification:

- [ ] `npm run build` passes (no TS errors)
- [ ] `npm run lint` passes

---

## Phase 2: Core Systems ✅ Complete

Implement the pure-logic layer: resource tick, worker scheduling, building queue, research
tree and army composition. All functions are pure or use refs so they are easily testable.

### Files to create/modify:

- `src/games/fantacity/systems/resources.ts` — `tickResources(state, dt)` accumulates
  gathered resources based on assigned worker counts and gather rates
- `src/games/fantacity/systems/workers.ts` — `assignWorker / unassignWorker` helpers that
  validate population caps and task slots
- `src/games/fantacity/systems/buildings.ts` — `tickBuildQueue(state, dt)` advances build
  timers and unlocks completed structures
- `src/games/fantacity/systems/research.ts` — `tickResearch(state, dt)` advances the active
  research project
- `src/games/fantacity/systems/combat.ts` — `resolveBattle(army, encounter)` deterministic
  autobattle returning a `BattleResult`
- `src/games/fantacity/systems/victory.ts` — `checkVictory(state)` returns the winning
  `VictoryCondition | null`

### Verification:

- [ ] `npm run build` passes
- [ ] `npm run lint` passes

---

## Phase 3: Base UI ✅ Complete

Build the tabbed headquarters interface. No canvas — pure React with Tailwind. The HQ screen
is the primary interface for all base management actions.

### Files to create/modify:

- `src/games/fantacity/components/ResourceBar.tsx` — top strip showing Gold, Food, Stone,
  Wood, Faith, Knowledge counts with icons
- `src/games/fantacity/components/WorkerPanel.tsx` — sliders / +/- controls for each task
  (Mine, Farm, Quarry, Lumber, Chapel, Library); shows population used / total
- `src/games/fantacity/components/BuildPanel.tsx` — grid of buildable structures with costs,
  build-time progress bars and unlock requirements
- `src/games/fantacity/components/ResearchPanel.tsx` — tech tree list, active research
  progress bar, queued items
- `src/games/fantacity/components/ArmyPanel.tsx` — recruit units (Soldier, Archer, Knight,
  Mage), show current army composition, dispatch button
- `src/games/fantacity/components/HQTabs.tsx` — tab bar wiring WorkerPanel, BuildPanel,
  ResearchPanel and ArmyPanel together
- `src/games/fantacity/index.tsx` — top-level game component: `useGameLoop` tick driving
  state updates, `ResourceBar` + `HQTabs` layout

### Verification:

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] App renders the HQ screen with resource bar and all four tabs visible

---

## Phase 4: Army & Combat ✅ Complete

Add the overworld map view and wire up army dispatch → autobattle → result feedback.

### Files to create/modify:

- `src/games/fantacity/components/OverworldMap.tsx` — grid of tiles (Forest, Ruins, Village,
  Enemy Base, Capital); each tile shows encounter difficulty and loot; clicking dispatches
  the current army if it is idle
- `src/games/fantacity/components/BattleLog.tsx` — modal/overlay showing round-by-round
  autobattle narrative and final result (Victory / Defeat, loot gained, units lost)
- `src/games/fantacity/index.tsx` (update) — add "Overworld" tab or view-toggle; call
  `resolveBattle` and `checkVictory` after each completed expedition

### Verification:

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Dispatching an army to a tile shows the BattleLog overlay with a result

---

## Phase 5: Polish & Edge Cases ✅ Complete

Victory screen, game-over screen, difficulty tuning, feedback toasts, accessibility pass.

### Files to create/modify:

- `src/games/fantacity/components/VictoryScreen.tsx` — full-screen overlay announcing which
  victory condition was reached and offering a "Play Again" button
- `src/games/fantacity/components/GameOverScreen.tsx` — shown when the capital is destroyed;
  "Play Again" resets state
- `src/games/fantacity/index.tsx` (update) — render `VictoryScreen` / `GameOverScreen` when
  `checkVictory` returns a result or the capital HP reaches zero; add keyboard shortcut `R`
  to restart
- `src/games/fantacity/README.md` — controls, victory conditions, resource guide

### Verification:

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Triggering a win/loss condition shows the correct overlay
- [ ] "Play Again" resets all state

---

## Phase 6: Tests ✅ Complete

Unit-test all pure system functions and render-test the top-level component.

### Files to create/modify:

- `src/games/fantacity/systems/resources.test.ts` — tests for `tickResources`: zero workers
  produces no income; worker count scales correctly; resource cap is respected
- `src/games/fantacity/systems/combat.test.ts` — tests for `resolveBattle`: stronger army
  wins; zero-unit army loses immediately; result contains correct loot
- `src/games/fantacity/systems/victory.test.ts` — tests for `checkVictory`: returns `null`
  when no condition is met; returns correct condition when threshold is reached
- `src/games/fantacity/index.test.tsx` — renders without crashing with default `width`/`height`

### Verification:

- [ ] `npm run test -- --run` passes (all new tests green)
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

---

## Phase 7: Registration & Documentation ✅ Complete

Wire the game into the registry and update project docs.

### Files to create/modify:

- `src/lib/game-registry.ts` — add Fantacity entry with `lazy(() => import('@/games/fantacity/index'))`
- `README.md` — add Fantacity to the games list with a one-line description

### Verification:

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Fantacity card appears on the home page at `/`
- [ ] Navigating to `/games/fantacity` loads the game

---

## Summary Table

| Phase | Description                        | Key Files                                                                                       |
| ----- | ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1     | Game Design (types & constants)    | `types.ts`, `constants.ts`, `state.ts`                                                          |
| 2     | Core Systems (pure logic)          | `systems/resources.ts`, `workers.ts`, `buildings.ts`, `research.ts`, `combat.ts`, `victory.ts`  |
| 3     | Base UI (HQ screen)                | `ResourceBar`, `WorkerPanel`, `BuildPanel`, `ResearchPanel`, `ArmyPanel`, `HQTabs`, `index.tsx` |
| 4     | Army & Combat (overworld + battle) | `OverworldMap.tsx`, `BattleLog.tsx`, `index.tsx` update                                         |
| 5     | Polish & Edge Cases                | `VictoryScreen.tsx`, `GameOverScreen.tsx`, `README.md`                                          |
| 6     | Tests                              | `resources.test.ts`, `combat.test.ts`, `victory.test.ts`, `index.test.tsx`                      |
| 7     | Registration & Documentation       | `game-registry.ts`, `README.md`                                                                 |
