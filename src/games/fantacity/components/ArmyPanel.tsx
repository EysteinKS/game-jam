import type { GameState, UnitType } from '../types'
import { UNIT_DEFS } from '../constants'
import { cn } from '@/lib/utils'

interface ArmyPanelProps {
	state: GameState
	onUpdate: (next: GameState) => void
	onDispatch: () => void
}

function recruitUnit(state: GameState, type: UnitType): GameState {
	const def = UNIT_DEFS.find((d) => d.type === type)
	if (!def) return state
	// Check building requirement
	if (!state.buildings.some((b) => b.id === def.requires && b.complete)) return state
	// Check resources
	for (const [k, v] of Object.entries(def.cost) as [keyof typeof state.resources, number][]) {
		if (state.resources[k] < v) return state
	}
	const nextResources = { ...state.resources }
	for (const [k, v] of Object.entries(def.cost) as [keyof typeof state.resources, number][]) {
		nextResources[k] -= v
	}
	return {
		...state,
		resources: nextResources,
		army: { ...state.army, [type]: state.army[type] + 1 },
	}
}

export function ArmyPanel({ state, onUpdate, onDispatch }: ArmyPanelProps) {
	const totalUnits = Object.values(state.army).reduce((s, n) => s + n, 0)

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{UNIT_DEFS.map((def) => {
					const unlocked = state.buildings.some((b) => b.id === def.requires && b.complete)
					const canAfford = Object.entries(def.cost).every(
						([k, v]) => state.resources[k as keyof typeof state.resources] >= (v ?? 0),
					)

					return (
						<div
							key={def.type}
							className={cn(
								'rounded-md border border-border bg-card px-3 py-2 space-y-1',
								!unlocked && 'opacity-50',
							)}
						>
							<div className="flex items-center justify-between">
								<span className="font-semibold text-sm">{def.name}</span>
								<span className="text-sm tabular-nums">×{state.army[def.type]}</span>
							</div>
							<p className="text-xs text-muted-foreground">
								ATK {def.attack} · DEF {def.defense} · HP {def.hp}
							</p>
							<p className="text-xs text-muted-foreground">
								Cost:{' '}
								{Object.entries(def.cost)
									.map(([k, v]) => `${v} ${k}`)
									.join(', ')}
							</p>
							{!unlocked && <p className="text-xs text-destructive">Requires: {def.requires}</p>}
							{unlocked && (
								<button
									className="mt-1 text-xs rounded border border-border px-2 py-0.5 hover:bg-muted disabled:opacity-40"
									onClick={() => onUpdate(recruitUnit(state, def.type))}
									disabled={!canAfford || state.armyDeployed}
									aria-label={`Recruit ${def.name}`}
								>
									{canAfford ? 'Recruit' : 'Need resources'}
								</button>
							)}
						</div>
					)
				})}
			</div>

			<div className="flex items-center gap-3">
				<p className="text-sm text-muted-foreground">
					Total units: <span className="font-semibold text-foreground">{totalUnits}</span>
				</p>
				<button
					className="rounded bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
					onClick={onDispatch}
					disabled={totalUnits === 0 || state.armyDeployed || state.phase !== 'playing'}
					aria-label="Go to overworld"
				>
					{state.armyDeployed ? 'Army deployed' : 'Send to Overworld →'}
				</button>
			</div>
		</div>
	)
}
