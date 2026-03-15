import type { RegionTile, ResearchNode, TileType } from '../types'
import { GRID_SIZE } from '../constants'

export const TILE_ICONS: Record<TileType, string> = {
	void: '⬜',
	asteroid: '🪨',
	planet: '🌍',
	nebula: '🌌',
	threat: '☠️',
	relic: '💎',
	anomaly: '❓',
}

const TILE_LABELS: Record<TileType, string> = {
	void: 'Void',
	asteroid: 'Asteroid Field',
	planet: 'Planet',
	nebula: 'Nebula',
	threat: 'Threat Zone',
	relic: 'Ancient Relic',
	anomaly: 'Anomaly',
}

const TILE_EVENTS: Record<TileType, string[]> = {
	void: [
		'Empty space. Nothing of note.',
		'Faint energy readings detected.',
		'Stellar dust drifts past silently.',
	],
	asteroid: [
		'Dense mineral deposits extracted.',
		'Rich asteroid cluster surveyed.',
		'Mining operations successful.',
	],
	planet: [
		'Surface scan reveals useful compounds.',
		'Mineral-rich crust partially excavated.',
		'Geological survey yields resources.',
	],
	nebula: [
		'Exotic particles captured for analysis.',
		'Nebula yields valuable quantum data.',
		'Rare isotopes detected and logged.',
	],
	threat: [
		'Enemy vessel detected! Combat engaged.',
		'Hostile automated defenses open fire!',
		'Pirate squadron intercepts the fleet!',
	],
	relic: [
		'Ancient relic recovered — immense scientific value!',
		'Precursor artifact retrieved intact!',
		'Lost technology from a bygone civilization!',
	],
	anomaly: [
		'Space-time distortion measured and catalogued.',
		'Dimensional rift opens briefly — data acquired.',
		'Reality fluctuates; instruments capture rare readings.',
	],
}

function seededRandom(seed: number): number {
	const x = Math.sin(seed + 1) * 10000
	return x - Math.floor(x)
}

function pickFrom<T>(arr: T[], seed: number): T {
	return arr[Math.floor(seed % arr.length)]
}

function generateTileType(x: number, y: number, regionSeed: number): TileType {
	const r = seededRandom(regionSeed + x * 7 + y * 13)
	if (r < 0.15) return 'threat'
	if (r < 0.23) return 'relic'
	if (r < 0.38) return 'asteroid'
	if (r < 0.53) return 'nebula'
	if (r < 0.68) return 'planet'
	if (r < 0.76) return 'anomaly'
	return 'void'
}

export function generateRegion(name: string, research: ResearchNode[]): RegionTile[] {
	const hasDeepScanner = research.find((r) => r.id === 'deep-scanner')?.unlocked ?? false
	const regionSeed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
	const center = Math.floor(GRID_SIZE / 2)

	const tiles: RegionTile[] = []

	for (let y = 0; y < GRID_SIZE; y++) {
		for (let x = 0; x < GRID_SIZE; x++) {
			const isCenterTile = x === center && y === center
			const distFromCenter = Math.abs(x - center) + Math.abs(y - center)

			const type: TileType = isCenterTile ? 'void' : generateTileType(x, y, regionSeed)

			const isVisible =
				isCenterTile || distFromCenter === 1 || (hasDeepScanner && distFromCenter === 2)

			const tileSeed = regionSeed + x * 31 + y * 17

			const minerals =
				type === 'asteroid'
					? 10 + Math.floor(seededRandom(tileSeed) * 15)
					: type === 'planet'
						? 5 + Math.floor(seededRandom(tileSeed) * 10)
						: 0

			const science =
				type === 'relic'
					? 20 + Math.floor(seededRandom(tileSeed + 1) * 10)
					: type === 'nebula'
						? 8 + Math.floor(seededRandom(tileSeed + 1) * 8)
						: type === 'anomaly'
							? 4 + Math.floor(seededRandom(tileSeed + 1) * 6)
							: 0

			const threat = type === 'threat' ? 15 + Math.floor(seededRandom(tileSeed + 2) * 20) : 0

			const eventTexts = TILE_EVENTS[type]
			const eventText = pickFrom(eventTexts, Math.abs(Math.floor(tileSeed)) % eventTexts.length)

			tiles.push({
				id: `${x}-${y}`,
				x,
				y,
				type,
				explored: isCenterTile,
				visible: isVisible,
				minerals,
				science,
				threat,
				label: `${TILE_ICONS[type]} ${TILE_LABELS[type]}`,
				eventText,
			})
		}
	}

	return tiles
}

export function revealNeighbors(tiles: RegionTile[], exploredId: string): RegionTile[] {
	const target = tiles.find((t) => t.id === exploredId)
	if (!target) return tiles

	return tiles.map((tile) => {
		const dist = Math.abs(tile.x - target.x) + Math.abs(tile.y - target.y)
		if (dist === 1 && !tile.visible) {
			return { ...tile, visible: true }
		}
		return tile
	})
}

export function getTotalFleetAttack(
	fleet: { hull: number; attack: number }[],
	hasCombatTactics: boolean,
): number {
	const base = fleet.filter((v) => v.hull > 0).reduce((sum, v) => sum + v.attack, 0)
	return hasCombatTactics ? Math.round(base * 1.5) : base
}
