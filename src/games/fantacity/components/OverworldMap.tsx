import type { GameState, OverworldTile } from '../types'
import { resolveBattle } from '../systems/combat'
import { checkVictory } from '../systems/victory'
import { cn } from '@/lib/utils'

const TILE_ICONS: Record<string, string> = {
	forest: '🌲',
	ruins: '🏚️',
	village: '🏘️',
	enemy_base: '🏯',
	capital: '🏰',
}

const DIFFICULTY_LABELS = ['', '★', '★★', '★★★', '★★★★', '★★★★★']

interface OverworldMapProps {
	state: GameState
	onUpdate: (next: GameState) => void
}

export function OverworldMap({ state, onUpdate }: OverworldMapProps) {
	const totalUnits = Object.values(state.army).reduce((s, n) => s + n, 0)
	const canDispatch = totalUnits > 0 && !state.armyDeployed && state.phase === 'playing'

	function handleTileClick(tile: OverworldTile) {
		if (!canDispatch || tile.cleared) return

		const result = resolveBattle(state.army, tile)

		// Merge loot into resources
		const nextResources = { ...state.resources }
		for (const [k, v] of Object.entries(result.lootGained) as [
			keyof typeof state.resources,
			number,
		][]) {
			nextResources[k] = Math.min(nextResources[k] + v, state.resourceCaps[k])
		}

		// Update overworld tile
		const nextOverworld = state.overworld.map((t) =>
			t.id === tile.id ? { ...t, cleared: result.victory, capitalHp: undefined } : t,
		)

		// Update faith
		const nextFaithTotal = state.faithTotal + result.faithGained

		let nextState: GameState = {
			...state,
			resources: nextResources,
			army: result.survivingArmy,
			armyDeployed: false,
			overworld: nextOverworld,
			lastBattle: result,
			faithTotal: nextFaithTotal,
			phase: 'battle',
		}

		// Check victory
		const victory = checkVictory(nextState)
		if (victory) {
			nextState = { ...nextState, phase: 'victory', victoryCondition: victory }
		}

		// Check defeat: capital cleared by enemy (in a full game this would be more complex)
		// For now, if the player loses against the final capital it's a draw — no defeat here

		onUpdate(nextState)
	}

	// Lay tiles on a simple grid
	const cols = 4
	const rows = 5

	const grid: (OverworldTile | null)[][] = Array.from({ length: rows }, () =>
		Array(cols).fill(null),
	)
	for (const tile of state.overworld) {
		if (tile.y < rows && tile.x < cols) {
			grid[tile.y][tile.x] = tile
		}
	}

	return (
		<div className="rounded-lg border border-border bg-card p-4 space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold">🗺️ Overworld</h3>
				<p className="text-xs text-muted-foreground">
					Army:{' '}
					{Object.entries(state.army)
						.filter(([, n]) => n > 0)
						.map(([t, n]) => `${n}×${t}`)
						.join(', ') || 'none'}{' '}
					{!canDispatch && totalUnits === 0 && (
						<span className="text-destructive">(train units first)</span>
					)}
				</p>
			</div>

			<div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
				{grid.map((row, ri) =>
					row.map((tile, ci) =>
						tile ? (
							<button
								key={tile.id}
								className={cn(
									'flex flex-col items-center justify-center rounded-md border p-2 text-center transition-colors',
									tile.cleared
										? 'border-border bg-muted opacity-50 cursor-default'
										: canDispatch
											? 'border-primary/50 bg-card hover:bg-primary/10 cursor-pointer'
											: 'border-border bg-card cursor-default opacity-70',
								)}
								onClick={() => handleTileClick(tile)}
								disabled={tile.cleared || !canDispatch}
								aria-label={`${tile.name} — difficulty ${tile.difficulty}`}
							>
								<span className="text-2xl">{TILE_ICONS[tile.type]}</span>
								<span className="text-xs font-medium mt-1 leading-tight">{tile.name}</span>
								<span className="text-xs text-yellow-400">
									{DIFFICULTY_LABELS[tile.difficulty]}
								</span>
								{tile.cleared && <span className="text-xs text-green-500">✓</span>}
							</button>
						) : (
							<div key={`empty-${ri}-${ci}`} className="rounded-md bg-muted/20 p-2" />
						),
					),
				)}
			</div>

			<p className="text-xs text-muted-foreground">
				Click a tile to dispatch your army. Winning grants loot and faith.
			</p>
		</div>
	)
}
