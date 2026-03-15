import { describe, it, expect } from 'vitest'
import { createInitialState } from '../state'
import { tickResources } from './resources'

describe('tickResources', () => {
	it('produces no income when no workers are assigned', () => {
		const state = createInitialState()
		const next = tickResources(state, 1)
		// All resources should be unchanged from initial
		expect(next.resources).toEqual(state.resources)
	})

	it('accumulates gold from mine workers', () => {
		const state = createInitialState()
		const withWorker = { ...state, workers: { ...state.workers, mine: 1 } }
		const next = tickResources(withWorker, 1)
		// GATHER_RATES.mine = { gold: 2 }, 1 worker × 1s = +2
		expect(next.resources.gold).toBe(state.resources.gold + 2)
	})

	it('scales correctly with multiple workers', () => {
		const state = createInitialState()
		const withWorkers = { ...state, workers: { ...state.workers, farm: 3 } }
		const next = tickResources(withWorkers, 1)
		// GATHER_RATES.farm = { food: 3 }, 3 workers × 1s = +9
		expect(next.resources.food).toBe(state.resources.food + 9)
	})

	it('respects resource caps', () => {
		const state = createInitialState()
		// Set food near cap
		const nearCap = {
			...state,
			resources: { ...state.resources, food: state.resourceCaps.food - 1 },
			workers: { ...state.workers, farm: 10 },
		}
		const next = tickResources(nearCap, 1)
		expect(next.resources.food).toBe(state.resourceCaps.food)
	})

	it('accumulates multiple resources simultaneously', () => {
		const state = createInitialState()
		const multi = {
			...state,
			workers: { ...state.workers, mine: 2, quarry: 1 },
		}
		const next = tickResources(multi, 1)
		expect(next.resources.gold).toBe(state.resources.gold + 4) // 2 × 2
		expect(next.resources.stone).toBe(state.resources.stone + 2) // 1 × 2
	})
})
