import type { GameState, ArmyComposition } from './types'
import { INITIAL_RESOURCES, RESOURCE_CAPS, INITIAL_MAX_POPULATION } from './constants'

export function createInitialArmy(): ArmyComposition {
	return { soldier: 0, archer: 0, knight: 0, mage: 0 }
}

export function createInitialState(): GameState {
	return {
		phase: 'playing',
		tick: 0,
		resources: { ...INITIAL_RESOURCES },
		resourceCaps: { ...RESOURCE_CAPS },
		population: 0,
		maxPopulation: INITIAL_MAX_POPULATION,
		workers: {
			mine: 0,
			farm: 0,
			quarry: 0,
			lumber: 0,
			chapel: 0,
			library: 0,
		},
		buildings: [],
		buildQueue: [],
		research: [],
		researchQueue: [],
		army: createInitialArmy(),
		armyDeployed: false,
		overworld: [
			{
				id: 'forest_1',
				x: 1,
				y: 0,
				type: 'forest',
				name: 'Dark Forest',
				difficulty: 1,
				loot: { wood: 40, gold: 20 },
				cleared: false,
			},
			{
				id: 'ruins_1',
				x: 2,
				y: 1,
				type: 'ruins',
				name: 'Ancient Ruins',
				difficulty: 2,
				loot: { gold: 60, stone: 30, knowledge: 10 },
				cleared: false,
			},
			{
				id: 'village_1',
				x: 0,
				y: 2,
				type: 'village',
				name: 'Hilltop Village',
				difficulty: 2,
				loot: { food: 80, gold: 40 },
				cleared: false,
			},
			{
				id: 'ruins_2',
				x: 3,
				y: 2,
				type: 'ruins',
				name: 'Cursed Temple',
				difficulty: 3,
				loot: { faith: 60, gold: 50 },
				cleared: false,
			},
			{
				id: 'enemy_base_1',
				x: 2,
				y: 3,
				type: 'enemy_base',
				name: 'Bandit Stronghold',
				difficulty: 4,
				loot: { gold: 120, stone: 50, wood: 50 },
				cleared: false,
			},
			{
				id: 'capital_1',
				x: 3,
				y: 4,
				type: 'capital',
				name: 'Enemy Capital',
				difficulty: 5,
				loot: { gold: 300 },
				cleared: false,
				capitalHp: 100,
			},
		],
		lastBattle: null,
		victoryCondition: null,
		faithTotal: 0,
		diplomacy: {
			questsCompleted: 0,
			tradeDeals: 0,
		},
	}
}
