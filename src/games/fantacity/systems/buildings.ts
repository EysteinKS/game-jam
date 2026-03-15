import type { GameState, BuildingId, BuildingState } from '../types'
import type { Resources } from '../types'
import { BUILDING_DEFS } from '../constants'

function canAfford(resources: Resources, cost: Partial<Resources>): boolean {
	for (const [key, amount] of Object.entries(cost) as [keyof Resources, number][]) {
		if (resources[key] < amount) return false
	}
	return true
}

function deduct(resources: Resources, cost: Partial<Resources>): Resources {
	const next = { ...resources }
	for (const [key, amount] of Object.entries(cost) as [keyof Resources, number][]) {
		next[key] -= amount
	}
	return next
}

function isBuilt(state: GameState, id: BuildingId): boolean {
	return state.buildings.some((b) => b.id === id && b.complete)
}

function isQueued(state: GameState, id: BuildingId): boolean {
	return state.buildQueue.some((b) => b.id === id)
}

export function enqueueBuild(state: GameState, id: BuildingId): GameState {
	const def = BUILDING_DEFS.find((d) => d.id === id)
	if (!def) return state
	if (isBuilt(state, id) || isQueued(state, id)) return state
	if (!canAfford(state.resources, def.cost)) return state
	if (def.requires.some((req) => !isBuilt(state, req))) return state

	const entry: BuildingState = { id, timeRemaining: def.buildTime, complete: false }
	return {
		...state,
		resources: deduct(state.resources, def.cost),
		buildQueue: [...state.buildQueue, entry],
		maxPopulation:
			state.maxPopulation +
			(def.populationBonus > 0 && !isBuilt(state, id) ? def.populationBonus : 0),
	}
}

/** Advance build timers; move finished buildings to the `buildings` list. */
export function tickBuildQueue(state: GameState, dt: number): GameState {
	if (state.buildQueue.length === 0) return state

	const nextQueue: BuildingState[] = []
	const finished: BuildingState[] = []

	for (const entry of state.buildQueue) {
		const remaining = entry.timeRemaining - dt
		if (remaining <= 0) {
			finished.push({ ...entry, timeRemaining: 0, complete: true })
		} else {
			nextQueue.push({ ...entry, timeRemaining: remaining })
		}
	}

	return {
		...state,
		buildQueue: nextQueue,
		buildings: [...state.buildings, ...finished],
	}
}
