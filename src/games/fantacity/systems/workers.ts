import type { GameState, WorkerTask } from '../types'

function totalAssigned(workers: GameState['workers']): number {
	return Object.values(workers).reduce((sum, n) => sum + n, 0)
}

export function assignWorker(state: GameState, task: WorkerTask): GameState {
	if (totalAssigned(state.workers) >= state.maxPopulation) return state
	return {
		...state,
		workers: { ...state.workers, [task]: state.workers[task] + 1 },
		population: state.population + 1,
	}
}

export function unassignWorker(state: GameState, task: WorkerTask): GameState {
	if (state.workers[task] <= 0) return state
	return {
		...state,
		workers: { ...state.workers, [task]: state.workers[task] - 1 },
		population: state.population - 1,
	}
}
