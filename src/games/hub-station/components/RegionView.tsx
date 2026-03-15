import type { HubStationState, RegionTab } from '../types'
import { cn } from '@/lib/utils'
import { TILE_ICONS } from '../systems/region'
import { EXPLORE_ENERGY_COST, GRID_SIZE } from '../constants'

interface RegionViewProps {
	state: HubStationState
	onSetTab: (tab: RegionTab) => void
	onExploreTile: (tileId: string) => void
	onReturnToHub: () => void
}

export function RegionView({ state, onSetTab, onExploreTile, onReturnToHub }: RegionViewProps) {
	const tabs: { id: RegionTab; label: string }[] = [
		{ id: 'map', label: '🗺️ Map' },
		{ id: 'fleet', label: '⚓ Fleet' },
		{ id: 'log', label: '📋 Log' },
	]

	const turnsLeft = state.maxRegionTurns - state.regionTurn
	const turnsColor =
		turnsLeft > 10 ? 'text-green-400' : turnsLeft > 5 ? 'text-yellow-400' : 'text-red-400'

	return (
		<div className="flex flex-col gap-3">
			{/* Region header */}
			<div className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-lg">
				<div>
					<p className="text-sm font-bold text-indigo-300">{state.regionName}</p>
					<p className="text-xs text-gray-500">Exploring region</p>
				</div>
				<div className="text-right">
					<p className={cn('text-sm font-bold font-mono', turnsColor)}>{turnsLeft} turns left</p>
					<p className="text-xs text-gray-500">
						Turn {state.regionTurn}/{state.maxRegionTurns}
					</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex gap-1">
				{tabs.map((t) => (
					<button
						key={t.id}
						onClick={() => onSetTab(t.id)}
						className={cn(
							'flex-1 py-2 px-1 rounded-lg text-xs font-medium transition-colors',
							state.regionTab === t.id
								? 'bg-indigo-600 text-white'
								: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
						)}
					>
						{t.label}
					</button>
				))}
			</div>

			{/* Tab content */}
			{state.regionTab === 'map' && <MapTab state={state} onExploreTile={onExploreTile} />}
			{state.regionTab === 'fleet' && <FleetTab state={state} />}
			{state.regionTab === 'log' && <LogTab state={state} />}

			{/* Return button */}
			<button
				onClick={onReturnToHub}
				className="w-full py-2.5 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
			>
				↩ Return to Hub
			</button>
		</div>
	)
}

function MapTab({
	state,
	onExploreTile,
}: {
	state: HubStationState
	onExploreTile: (id: string) => void
}) {
	const region = state.region
	if (!region) return null

	const canExplore = state.resources.energy >= EXPLORE_ENERGY_COST && state.resources.crew > 0
	const fleetAlive = state.fleet.some((v) => v.hull > 0)

	return (
		<div className="flex flex-col gap-2">
			{/* Grid */}
			<div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
				{Array.from({ length: GRID_SIZE }, (_, row) =>
					Array.from({ length: GRID_SIZE }, (_, col) => {
						const tile = region.find((t) => t.x === col && t.y === row)
						if (!tile) return null

						const isCenter = col === Math.floor(GRID_SIZE / 2) && row === Math.floor(GRID_SIZE / 2)
						const canClick = tile.visible && !tile.explored && canExplore && fleetAlive

						return (
							<button
								key={tile.id}
								onClick={() => canClick && onExploreTile(tile.id)}
								disabled={!canClick}
								title={
									!tile.visible
										? 'Unknown'
										: tile.explored
											? `${tile.label} (explored)`
											: tile.label
								}
								className={cn(
									'aspect-square flex items-center justify-center text-lg rounded transition-all border',
									isCenter && 'ring-1 ring-indigo-400',
									tile.explored
										? 'bg-gray-700 border-gray-600 opacity-60 cursor-default'
										: tile.visible && canClick
											? 'bg-gray-800 border-indigo-500 hover:bg-indigo-900 hover:border-indigo-400 cursor-pointer'
											: tile.visible
												? 'bg-gray-800 border-gray-600 cursor-not-allowed opacity-70'
												: 'bg-gray-900 border-gray-700 cursor-default',
								)}
							>
								{tile.visible ? (
									<>
										{TILE_ICONS[tile.type]}
										{tile.explored && (
											<span className="absolute text-xs text-green-400 leading-none">✓</span>
										)}
									</>
								) : (
									<span className="text-gray-700">▪</span>
								)}
							</button>
						)
					}),
				)}
			</div>

			{/* Legend */}
			<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 px-1">
				<span>🪨 Asteroid</span>
				<span>🌍 Planet</span>
				<span>🌌 Nebula</span>
				<span>💎 Relic</span>
				<span>☠️ Threat</span>
				<span>❓ Anomaly</span>
			</div>

			{/* Status hint */}
			<p className="text-xs text-gray-500 px-1">
				{!fleetAlive
					? '⚠️ All vessels destroyed — return to Hub!'
					: !canExplore
						? `⚡ Need ${EXPLORE_ENERGY_COST} energy to explore`
						: 'Select a visible tile to explore it.'}
			</p>

			<p className="text-xs text-gray-600 px-1">
				Exploration costs {EXPLORE_ENERGY_COST} ⚡ per tile
			</p>
		</div>
	)
}

function FleetTab({ state }: { state: HubStationState }) {
	return (
		<div className="flex flex-col gap-2">
			{state.fleet.map((vessel) => {
				const pct = Math.round((vessel.hull / vessel.maxHull) * 100)
				return (
					<div key={vessel.id} className="bg-gray-800 rounded-lg p-3">
						<div className="flex items-center justify-between mb-1">
							<span className="text-sm font-semibold text-gray-200">{vessel.name}</span>
							<span className="text-xs text-gray-400 capitalize">{vessel.type}</span>
						</div>
						<div className="flex items-center gap-2 mb-1">
							<span className="text-xs text-gray-400">Hull</span>
							<div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
								<div
									className={cn(
										'h-full rounded-full transition-all',
										pct > 60 ? 'bg-green-500' : pct > 30 ? 'bg-yellow-500' : 'bg-red-500',
									)}
									style={{ width: `${pct}%` }}
								/>
							</div>
							<span className="text-xs font-mono text-gray-400">
								{vessel.hull}/{vessel.maxHull}
							</span>
						</div>
						<div className="flex gap-3 text-xs text-gray-400">
							<span>⚔️ Attack: {vessel.attack}</span>
							<span
								className={cn('font-medium', vessel.hull <= 0 ? 'text-red-400' : 'text-green-400')}
							>
								{vessel.hull <= 0 ? '💀 Destroyed' : '✓ Operational'}
							</span>
						</div>
					</div>
				)
			})}
		</div>
	)
}

function LogTab({ state }: { state: HubStationState }) {
	return (
		<div className="bg-gray-800 rounded-lg p-3 max-h-64 overflow-y-auto">
			{state.log.length === 0 ? (
				<p className="text-xs text-gray-500 italic">No events yet.</p>
			) : (
				<div className="flex flex-col gap-1.5">
					{[...state.log].reverse().map((entry, i) => (
						<p key={i} className="text-xs text-gray-400 leading-snug border-b border-gray-700 pb-1">
							{entry}
						</p>
					))}
				</div>
			)}
		</div>
	)
}
