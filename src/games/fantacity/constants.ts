import type { ResourceKey, WorkerTask, BuildingDef, UnitDef, ResearchDef, Resources } from './types'

// ─── Timing ──────────────────────────────────────────────────────────────────

/** Game-logic tick interval in seconds (independent of render FPS) */
export const TICK_INTERVAL = 1

// ─── Resources ───────────────────────────────────────────────────────────────

export const RESOURCE_KEYS: ResourceKey[] = ['gold', 'food', 'stone', 'wood', 'faith', 'knowledge']

export const RESOURCE_LABELS: Record<ResourceKey, string> = {
	gold: 'Gold',
	food: 'Food',
	stone: 'Stone',
	wood: 'Wood',
	faith: 'Faith',
	knowledge: 'Knowledge',
}

export const RESOURCE_ICONS: Record<ResourceKey, string> = {
	gold: '🪙',
	food: '🌾',
	stone: '🪨',
	wood: '🪵',
	faith: '✨',
	knowledge: '📜',
}

export const INITIAL_RESOURCES: Resources = {
	gold: 100,
	food: 50,
	stone: 30,
	wood: 30,
	faith: 0,
	knowledge: 0,
}

export const RESOURCE_CAPS: Resources = {
	gold: 2000,
	food: 1000,
	stone: 1000,
	wood: 1000,
	faith: 500,
	knowledge: 500,
}

/** Resources generated per worker per second for each task */
export const GATHER_RATES: Record<WorkerTask, Partial<Resources>> = {
	mine: { gold: 2 },
	farm: { food: 3 },
	quarry: { stone: 2 },
	lumber: { wood: 2 },
	chapel: { faith: 1 },
	library: { knowledge: 1 },
}

export const WORKER_TASK_LABELS: Record<WorkerTask, string> = {
	mine: 'Mine (Gold)',
	farm: 'Farm (Food)',
	quarry: 'Quarry (Stone)',
	lumber: 'Lumber (Wood)',
	chapel: 'Chapel (Faith)',
	library: 'Library (Knowledge)',
}

export const INITIAL_MAX_POPULATION = 10

// ─── Buildings ───────────────────────────────────────────────────────────────

export const BUILDING_DEFS: BuildingDef[] = [
	{
		id: 'barracks',
		name: 'Barracks',
		description: 'Train soldiers. Increases max population.',
		cost: { gold: 80, wood: 40, stone: 20 },
		buildTime: 30,
		requires: [],
		populationBonus: 5,
	},
	{
		id: 'archery_range',
		name: 'Archery Range',
		description: 'Train archers.',
		cost: { gold: 100, wood: 60 },
		buildTime: 35,
		requires: ['barracks'],
		populationBonus: 3,
	},
	{
		id: 'stable',
		name: 'Stable',
		description: 'Train knights.',
		cost: { gold: 150, wood: 60, stone: 40 },
		buildTime: 50,
		requires: ['barracks'],
		populationBonus: 2,
	},
	{
		id: 'mage_tower',
		name: 'Mage Tower',
		description: 'Train mages and research arcane arts.',
		cost: { gold: 200, stone: 80, knowledge: 20 },
		buildTime: 60,
		requires: ['library'],
		populationBonus: 2,
	},
	{
		id: 'market',
		name: 'Market',
		description: 'Enables trade routes and diplomacy.',
		cost: { gold: 120, wood: 50 },
		buildTime: 40,
		requires: [],
		populationBonus: 0,
	},
	{
		id: 'temple',
		name: 'Temple',
		description: 'Boosts faith generation.',
		cost: { gold: 100, stone: 60, wood: 30 },
		buildTime: 45,
		requires: [],
		populationBonus: 0,
	},
	{
		id: 'library',
		name: 'Library',
		description: 'Enables research and knowledge gathering.',
		cost: { gold: 80, wood: 40, stone: 30 },
		buildTime: 35,
		requires: [],
		populationBonus: 0,
	},
	{
		id: 'walls',
		name: 'Walls',
		description: 'Increases capital defence.',
		cost: { stone: 120, wood: 40 },
		buildTime: 55,
		requires: [],
		populationBonus: 0,
	},
]

// ─── Units ───────────────────────────────────────────────────────────────────

export const UNIT_DEFS: UnitDef[] = [
	{
		type: 'soldier',
		name: 'Soldier',
		cost: { gold: 30, food: 10 },
		attack: 8,
		defense: 5,
		hp: 40,
		requires: 'barracks',
	},
	{
		type: 'archer',
		name: 'Archer',
		cost: { gold: 35, wood: 5, food: 8 },
		attack: 12,
		defense: 3,
		hp: 30,
		requires: 'archery_range',
	},
	{
		type: 'knight',
		name: 'Knight',
		cost: { gold: 70, food: 15 },
		attack: 15,
		defense: 10,
		hp: 60,
		requires: 'stable',
	},
	{
		type: 'mage',
		name: 'Mage',
		cost: { gold: 60, knowledge: 10, food: 10 },
		attack: 20,
		defense: 2,
		hp: 25,
		requires: 'mage_tower',
	},
]

// ─── Research ─────────────────────────────────────────────────────────────────

export const RESEARCH_DEFS: ResearchDef[] = [
	{
		id: 'iron_forging',
		name: 'Iron Forging',
		description: '+20% soldier attack',
		cost: { gold: 50, stone: 30 },
		researchTime: 40,
		requires: [],
	},
	{
		id: 'composite_bow',
		name: 'Composite Bow',
		description: '+25% archer attack',
		cost: { gold: 60, wood: 30 },
		researchTime: 45,
		requires: ['iron_forging'],
	},
	{
		id: 'heavy_cavalry',
		name: 'Heavy Cavalry',
		description: '+20% knight HP',
		cost: { gold: 100, stone: 40 },
		researchTime: 60,
		requires: ['iron_forging'],
	},
	{
		id: 'arcane_arts',
		name: 'Arcane Arts',
		description: '+30% mage attack',
		cost: { gold: 80, knowledge: 40 },
		researchTime: 70,
		requires: [],
	},
	{
		id: 'divine_blessing',
		name: 'Divine Blessing',
		description: 'Doubles faith generation',
		cost: { gold: 60, faith: 50 },
		researchTime: 50,
		requires: [],
	},
	{
		id: 'trade_routes',
		name: 'Trade Routes',
		description: 'Unlocks diplomatic quest rewards',
		cost: { gold: 80 },
		researchTime: 45,
		requires: [],
	},
	{
		id: 'ultimate_spell',
		name: 'Ultimate Spell',
		description: 'Triggers Science victory',
		cost: { knowledge: 200, faith: 100, gold: 200 },
		researchTime: 120,
		requires: ['arcane_arts'],
	},
]

// ─── Victory thresholds ───────────────────────────────────────────────────────

export const FAITH_VICTORY_THRESHOLD = 400
export const DIPLOMACY_QUESTS_REQUIRED = 3
export const DIPLOMACY_TRADES_REQUIRED = 5
