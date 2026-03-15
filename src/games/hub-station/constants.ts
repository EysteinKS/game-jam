import type { Resources, Vessel, ResearchNode } from './types'

export const GRID_SIZE = 5
export const WARP_ENERGY_COST = 30
export const EXPLORE_ENERGY_COST = 5
export const MAX_REGION_TURNS = 20
export const SHIELD_REPAIR_COST_ENERGY = 20
export const SHIELD_REPAIR_AMOUNT = 25
export const CONVERT_MINERALS_IN = 10
export const CONVERT_MINERALS_OUT = 6

export const REGION_NAMES = [
	'Cygnus Expanse',
	'Void Nebula Alpha',
	'Kepler Drift',
	'Andromeda Fringe',
	'Typhon Cluster',
	'Boreas Sector',
	'Erebus Deep',
	'Chronos Rift',
	'Sigma Anomaly',
	'Vega Reach',
	'Helios Zone',
	'Nexus Frontier',
]

export const INITIAL_RESOURCES: Resources = {
	energy: 80,
	minerals: 20,
	science: 0,
	crew: 5,
}

export const INITIAL_MAX_RESOURCES: Resources = {
	energy: 100,
	minerals: 80,
	science: 100,
	crew: 10,
}

export const INITIAL_FLEET: Vessel[] = [
	{
		id: 'scout-1',
		name: 'Pioneer I',
		type: 'scout',
		hull: 30,
		maxHull: 30,
		attack: 8,
	},
]

export const INITIAL_RESEARCH: ResearchNode[] = [
	{
		id: 'advanced-hull',
		name: 'Advanced Hull Plating',
		category: 'fleet',
		description: 'Quantum-bonded alloys reinforce all vessel hulls.',
		scienceCost: 15,
		mineralCost: 10,
		unlocked: false,
		available: true,
		prerequisites: [],
		effect: '+20 max hull on all vessels',
	},
	{
		id: 'crew-quarters',
		name: 'Expanded Crew Quarters',
		category: 'biological',
		description: 'Additional habitation modules for the Hub.',
		scienceCost: 8,
		mineralCost: 5,
		unlocked: false,
		available: true,
		prerequisites: [],
		effect: '+5 max crew capacity',
	},
	{
		id: 'energy-cells',
		name: 'Improved Energy Cells',
		category: 'construction',
		description: 'Higher-density energy storage matrices.',
		scienceCost: 10,
		mineralCost: 8,
		unlocked: false,
		available: true,
		prerequisites: [],
		effect: '+30 max energy capacity',
	},
	{
		id: 'deep-scanner',
		name: 'Deep Space Scanner',
		category: 'communication',
		description: 'Quantum resonance arrays that pierce the space-time fog.',
		scienceCost: 18,
		mineralCost: 0,
		unlocked: false,
		available: true,
		prerequisites: [],
		effect: 'Regions start with more tiles revealed',
	},
	{
		id: 'mineral-refinery',
		name: 'Mineral Refinery',
		category: 'construction',
		description: 'Process raw minerals into scientific data.',
		scienceCost: 5,
		mineralCost: 12,
		unlocked: false,
		available: true,
		prerequisites: [],
		effect: 'Unlocks: Convert 10 minerals → 6 science',
	},
	{
		id: 'combat-tactics',
		name: 'Combat Tactics Module',
		category: 'fleet',
		description: 'Advanced combat algorithms improve fleet survival.',
		scienceCost: 22,
		mineralCost: 0,
		unlocked: false,
		available: false,
		prerequisites: ['advanced-hull'],
		effect: 'Fleet attack +50% in combat (reduces incoming damage)',
	},
	{
		id: 'bio-vats',
		name: 'Bio-Vats',
		category: 'biological',
		description: 'Organic synthesis chambers grow new crew members.',
		scienceCost: 28,
		mineralCost: 15,
		unlocked: false,
		available: false,
		prerequisites: ['crew-quarters'],
		effect: '+1 crew each time you return to Hub',
	},
	{
		id: 'frigate-class',
		name: 'Frigate-Class Design',
		category: 'fleet',
		description: 'Blueprints for a heavier, more capable vessel.',
		scienceCost: 35,
		mineralCost: 25,
		unlocked: false,
		available: false,
		prerequisites: ['advanced-hull'],
		effect: 'Adds Frigate II to the fleet',
	},
	{
		id: 'quantum-scanner',
		name: 'Quantum Space Scanner',
		category: 'communication',
		description: 'Peer through dimensional boundaries to preview regions.',
		scienceCost: 40,
		mineralCost: 0,
		unlocked: false,
		available: false,
		prerequisites: ['deep-scanner'],
		effect: 'Preview region tile types before warping',
	},
	{
		id: 'shield-restoration',
		name: 'Shield Restoration Protocol',
		category: 'construction',
		description: 'Emergency repair routines restore Hub shield on return.',
		scienceCost: 20,
		mineralCost: 10,
		unlocked: false,
		available: false,
		prerequisites: ['energy-cells'],
		effect: 'Restores +20 shield each time you return to Hub',
	},
]
