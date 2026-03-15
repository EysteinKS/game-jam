// ─── Resources ───────────────────────────────────────────────────────────────

export type ResourceKey = 'gold' | 'food' | 'stone' | 'wood' | 'faith' | 'knowledge'

export type Resources = Record<ResourceKey, number>

// ─── Workers ─────────────────────────────────────────────────────────────────

export type WorkerTask = 'mine' | 'farm' | 'quarry' | 'lumber' | 'chapel' | 'library'

export type WorkerAssignment = Record<WorkerTask, number>

// ─── Buildings ───────────────────────────────────────────────────────────────

export type BuildingId =
	| 'barracks'
	| 'archery_range'
	| 'stable'
	| 'mage_tower'
	| 'market'
	| 'temple'
	| 'library'
	| 'walls'

export interface BuildingDef {
	id: BuildingId
	name: string
	description: string
	cost: Partial<Resources>
	buildTime: number // seconds
	/** buildings that must be built first */
	requires: BuildingId[]
	/** max population this building adds */
	populationBonus: number
}

export interface BuildingState {
	id: BuildingId
	/** seconds remaining; 0 = complete */
	timeRemaining: number
	complete: boolean
}

// ─── Research ────────────────────────────────────────────────────────────────

export type ResearchId =
	| 'iron_forging'
	| 'composite_bow'
	| 'heavy_cavalry'
	| 'arcane_arts'
	| 'divine_blessing'
	| 'trade_routes'
	| 'ultimate_spell'

export interface ResearchDef {
	id: ResearchId
	name: string
	description: string
	cost: Partial<Resources>
	researchTime: number // seconds
	requires: ResearchId[]
}

export interface ResearchState {
	id: ResearchId
	timeRemaining: number
	complete: boolean
}

// ─── Units ───────────────────────────────────────────────────────────────────

export type UnitType = 'soldier' | 'archer' | 'knight' | 'mage'

export interface UnitDef {
	type: UnitType
	name: string
	cost: Partial<Resources>
	attack: number
	defense: number
	hp: number
	/** required building to recruit */
	requires: BuildingId
}

export type ArmyComposition = Record<UnitType, number>

// ─── Overworld ────────────────────────────────────────────────────────────────

export type TileType = 'forest' | 'ruins' | 'village' | 'enemy_base' | 'capital'

export interface OverworldTile {
	id: string
	x: number
	y: number
	type: TileType
	name: string
	/** 1–5 */
	difficulty: number
	loot: Partial<Resources>
	/** cleared tiles cannot be fought again */
	cleared: boolean
	/** capital HP, only set for 'capital' type */
	capitalHp?: number
}

// ─── Combat ──────────────────────────────────────────────────────────────────

export interface BattleRound {
	round: number
	attackerLosses: Partial<ArmyComposition>
	defenderHpRemaining: number
	narrative: string
}

export interface BattleResult {
	victory: boolean
	rounds: BattleRound[]
	survivingArmy: ArmyComposition
	lootGained: Partial<Resources>
	faithGained: number
}

// ─── Victory ─────────────────────────────────────────────────────────────────

export type VictoryCondition = 'domination' | 'religion' | 'diplomacy' | 'science'

// ─── Game Phase ──────────────────────────────────────────────────────────────

export type GamePhase = 'playing' | 'dispatched' | 'battle' | 'victory' | 'defeat'

// ─── Top-level State ─────────────────────────────────────────────────────────

export interface DiplomacyState {
	questsCompleted: number
	tradeDeals: number
}

export interface GameState {
	phase: GamePhase
	tick: number
	resources: Resources
	resourceCaps: Resources
	population: number
	maxPopulation: number
	workers: WorkerAssignment
	buildings: BuildingState[]
	buildQueue: BuildingState[]
	research: ResearchState[]
	researchQueue: ResearchId[]
	army: ArmyComposition
	armyDeployed: boolean
	overworld: OverworldTile[]
	lastBattle: BattleResult | null
	victoryCondition: VictoryCondition | null
	faithTotal: number
	diplomacy: DiplomacyState
}
