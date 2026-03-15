import type { GameState, ResourceKey } from '../types'
import { GATHER_RATES, RESOURCE_KEYS } from '../constants'

/**
 * Accumulate resources based on worker assignments and elapsed time.
 * Respects per-resource caps defined in `state.resourceCaps`.
 */
export function tickResources(state: GameState, dt: number): GameState {
	const next = { ...state.resources }

	for (const [task, count] of Object.entries(state.workers) as [
		keyof typeof state.workers,
		number,
	][]) {
		if (count === 0) continue
		const rates = GATHER_RATES[task]
		for (const key of RESOURCE_KEYS) {
			const rate = (rates as Partial<Record<ResourceKey, number>>)[key]
			if (rate === undefined) continue
			next[key] = Math.min(next[key] + rate * count * dt, state.resourceCaps[key])
		}
	}

	return { ...state, resources: next }
}
