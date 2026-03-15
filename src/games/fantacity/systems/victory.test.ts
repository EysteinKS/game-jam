import { describe, it, expect } from 'vitest'
import { checkVictory } from './victory'
import { createInitialState } from '../state'
import {
	FAITH_VICTORY_THRESHOLD,
	DIPLOMACY_QUESTS_REQUIRED,
	DIPLOMACY_TRADES_REQUIRED,
} from '../constants'

describe('checkVictory', () => {
	it('returns null when no condition is met', () => {
		const state = createInitialState()
		expect(checkVictory(state)).toBeNull()
	})

	it('returns "domination" when the enemy capital is cleared', () => {
		const state = createInitialState()
		const dominated = {
			...state,
			overworld: state.overworld.map((t) => (t.type === 'capital' ? { ...t, cleared: true } : t)),
		}
		expect(checkVictory(dominated)).toBe('domination')
	})

	it('returns "religion" when faith threshold is reached', () => {
		const state = createInitialState()
		const devout = { ...state, faithTotal: FAITH_VICTORY_THRESHOLD }
		expect(checkVictory(devout)).toBe('religion')
	})

	it('does NOT return "religion" below the threshold', () => {
		const state = createInitialState()
		const almostDevout = { ...state, faithTotal: FAITH_VICTORY_THRESHOLD - 1 }
		expect(checkVictory(almostDevout)).toBeNull()
	})

	it('returns "diplomacy" when quests and trades are completed', () => {
		const state = createInitialState()
		const diplomat = {
			...state,
			diplomacy: {
				questsCompleted: DIPLOMACY_QUESTS_REQUIRED,
				tradeDeals: DIPLOMACY_TRADES_REQUIRED,
			},
		}
		expect(checkVictory(diplomat)).toBe('diplomacy')
	})

	it('does NOT return "diplomacy" with insufficient quests', () => {
		const state = createInitialState()
		const partial = {
			...state,
			diplomacy: {
				questsCompleted: DIPLOMACY_QUESTS_REQUIRED - 1,
				tradeDeals: DIPLOMACY_TRADES_REQUIRED,
			},
		}
		expect(checkVictory(partial)).toBeNull()
	})

	it('returns "science" when ultimate_spell is researched', () => {
		const state = createInitialState()
		const scientist = {
			...state,
			research: [{ id: 'ultimate_spell' as const, timeRemaining: 0, complete: true }],
		}
		expect(checkVictory(scientist)).toBe('science')
	})
})
