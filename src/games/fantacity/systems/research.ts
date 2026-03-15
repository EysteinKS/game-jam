import type { GameState, ResearchId, ResearchState } from '../types'
import type { Resources } from '../types'
import { RESEARCH_DEFS } from '../constants'

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

function isResearched(state: GameState, id: ResearchId): boolean {
	return state.research.some((r) => r.id === id && r.complete)
}

function isQueued(state: GameState, id: ResearchId): boolean {
	return state.researchQueue.includes(id)
}

export function enqueueResearch(state: GameState, id: ResearchId): GameState {
	const def = RESEARCH_DEFS.find((d) => d.id === id)
	if (!def) return state
	if (isResearched(state, id) || isQueued(state, id)) return state
	if (!canAfford(state.resources, def.cost)) return state
	if (def.requires.some((req) => !isResearched(state, req))) return state

	return {
		...state,
		resources: deduct(state.resources, def.cost),
		researchQueue: [...state.researchQueue, id],
	}
}

/** Advance the active (first) research item; move complete items to `research`. */
export function tickResearch(state: GameState, dt: number): GameState {
	if (state.researchQueue.length === 0) return state

	const [activeId, ...rest] = state.researchQueue
	const def = RESEARCH_DEFS.find((d) => d.id === activeId)
	if (!def) return { ...state, researchQueue: rest }

	// Find or create in-progress entry
	const inProgressIdx = state.research.findIndex((r) => r.id === activeId && !r.complete)
	const inProgress: ResearchState =
		inProgressIdx >= 0
			? state.research[inProgressIdx]
			: { id: activeId, timeRemaining: def.researchTime, complete: false }

	const remaining = inProgress.timeRemaining - dt

	if (remaining <= 0) {
		const completed: ResearchState = { id: activeId, timeRemaining: 0, complete: true }
		const nextResearch = [...state.research]
		if (inProgressIdx >= 0) nextResearch.splice(inProgressIdx, 1)
		return {
			...state,
			research: [...nextResearch, completed],
			researchQueue: rest,
		}
	}

	const updated: ResearchState = { ...inProgress, timeRemaining: remaining }
	const nextResearch = [...state.research]
	if (inProgressIdx >= 0) {
		nextResearch[inProgressIdx] = updated
	} else {
		nextResearch.push(updated)
	}

	return { ...state, research: nextResearch }
}
