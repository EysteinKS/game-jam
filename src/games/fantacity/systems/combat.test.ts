import { describe, it, expect } from 'vitest'
import { resolveBattle } from './combat'
import type { ArmyComposition, OverworldTile } from '../types'

const EASY_TILE: OverworldTile = {
	id: 'forest_test',
	x: 0,
	y: 0,
	type: 'forest',
	name: 'Test Forest',
	difficulty: 1,
	loot: { wood: 40, gold: 20 },
	cleared: false,
}

const HARD_TILE: OverworldTile = {
	id: 'capital_test',
	x: 3,
	y: 4,
	type: 'capital',
	name: 'Test Capital',
	difficulty: 5,
	loot: { gold: 300 },
	cleared: false,
}

describe('resolveBattle', () => {
	it('wins against a difficulty-1 tile with a strong army', () => {
		const army: ArmyComposition = { soldier: 10, archer: 5, knight: 3, mage: 2 }
		const result = resolveBattle(army, EASY_TILE)
		expect(result.victory).toBe(true)
	})

	it('loses immediately with a zero-unit army', () => {
		const army: ArmyComposition = { soldier: 0, archer: 0, knight: 0, mage: 0 }
		const result = resolveBattle(army, EASY_TILE)
		expect(result.victory).toBe(false)
		expect(result.rounds).toHaveLength(1)
	})

	it('includes loot when victorious', () => {
		const army: ArmyComposition = { soldier: 20, archer: 10, knight: 5, mage: 5 }
		const result = resolveBattle(army, EASY_TILE)
		expect(result.victory).toBe(true)
		expect(result.lootGained.wood).toBe(40)
		expect(result.lootGained.gold).toBe(20)
	})

	it('grants no loot on defeat', () => {
		const army: ArmyComposition = { soldier: 0, archer: 0, knight: 0, mage: 0 }
		const result = resolveBattle(army, HARD_TILE)
		expect(result.victory).toBe(false)
		expect(Object.keys(result.lootGained)).toHaveLength(0)
	})

	it('grants faith on victory proportional to difficulty', () => {
		const army: ArmyComposition = { soldier: 20, archer: 10, knight: 5, mage: 5 }
		const result = resolveBattle(army, EASY_TILE)
		expect(result.faithGained).toBe(EASY_TILE.difficulty * 5)
	})

	it('surviving army has no more units than the attacking army', () => {
		const army: ArmyComposition = { soldier: 5, archer: 3, knight: 2, mage: 1 }
		const result = resolveBattle(army, EASY_TILE)
		expect(result.survivingArmy.soldier).toBeLessThanOrEqual(army.soldier)
		expect(result.survivingArmy.archer).toBeLessThanOrEqual(army.archer)
		expect(result.survivingArmy.knight).toBeLessThanOrEqual(army.knight)
		expect(result.survivingArmy.mage).toBeLessThanOrEqual(army.mage)
	})
})
