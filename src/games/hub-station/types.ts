export type GamePhase = 'hub' | 'region' | 'game_over'
export type HubTab = 'overview' | 'research' | 'warp'
export type RegionTab = 'map' | 'fleet' | 'log'
export type TileType = 'void' | 'asteroid' | 'planet' | 'nebula' | 'threat' | 'relic' | 'anomaly'
export type ResearchCategory = 'biological' | 'fleet' | 'construction' | 'communication'

export interface Resources {
	energy: number
	minerals: number
	science: number
	crew: number
}

export interface Vessel {
	id: string
	name: string
	type: 'scout' | 'frigate' | 'transport'
	hull: number
	maxHull: number
	attack: number
}

export interface RegionTile {
	id: string
	x: number
	y: number
	type: TileType
	explored: boolean
	visible: boolean
	minerals: number
	science: number
	threat: number
	label: string
	eventText: string
}

export interface ResearchNode {
	id: string
	name: string
	description: string
	category: ResearchCategory
	scienceCost: number
	mineralCost: number
	unlocked: boolean
	available: boolean
	prerequisites: string[]
	effect: string
}

export interface HubStationState {
	phase: GamePhase
	hubTab: HubTab
	regionTab: RegionTab
	resources: Resources
	maxResources: Resources
	shieldIntegrity: number
	fleet: Vessel[]
	research: ResearchNode[]
	region: RegionTile[] | null
	regionName: string
	regionTurn: number
	maxRegionTurns: number
	log: string[]
	runCount: number
	gameOverReason: string
}
