import type { GameState, BuildingId } from '../types'
import { BUILDING_DEFS } from '../constants'
import { enqueueBuild } from '../systems/buildings'
import { cn } from '@/lib/utils'

interface BuildPanelProps {
	state: GameState
	onUpdate: (next: GameState) => void
}

export function BuildPanel({ state, onUpdate }: BuildPanelProps) {
	function status(id: BuildingId) {
		if (state.buildings.some((b) => b.id === id && b.complete)) return 'built'
		const queued = state.buildQueue.find((b) => b.id === id)
		if (queued) return 'building'
		return 'available'
	}

	function progressPct(id: BuildingId): number {
		const def = BUILDING_DEFS.find((d) => d.id === id)
		const queued = state.buildQueue.find((b) => b.id === id)
		if (!def || !queued) return 0
		return Math.round(((def.buildTime - queued.timeRemaining) / def.buildTime) * 100)
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			{BUILDING_DEFS.map((def) => {
				const s = status(def.id)
				const locked = def.requires.some(
					(req) => !state.buildings.some((b) => b.id === req && b.complete),
				)
				const canAfford = Object.entries(def.cost).every(
					([k, v]) => state.resources[k as keyof typeof state.resources] >= (v ?? 0),
				)

				return (
					<div
						key={def.id}
						className={cn(
							'rounded-md border border-border bg-card px-3 py-2 space-y-1',
							locked && 'opacity-50',
						)}
					>
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm">{def.name}</span>
							{s === 'built' && <span className="text-xs text-green-500">✓ Built</span>}
							{s === 'building' && (
								<span className="text-xs text-yellow-500">{progressPct(def.id)}%</span>
							)}
						</div>
						<p className="text-xs text-muted-foreground">{def.description}</p>
						<p className="text-xs text-muted-foreground">
							Cost:{' '}
							{Object.entries(def.cost)
								.map(([k, v]) => `${v} ${k}`)
								.join(', ')}
							{' · '}
							{def.buildTime}s
						</p>
						{locked && (
							<p className="text-xs text-destructive">Requires: {def.requires.join(', ')}</p>
						)}
						{s === 'building' && (
							<div className="h-1.5 rounded-full bg-muted overflow-hidden">
								<div
									className="h-full bg-yellow-500 transition-all"
									style={{ width: `${progressPct(def.id)}%` }}
								/>
							</div>
						)}
						{s === 'available' && !locked && (
							<button
								className="mt-1 text-xs rounded border border-border px-2 py-0.5 hover:bg-muted disabled:opacity-40"
								onClick={() => onUpdate(enqueueBuild(state, def.id))}
								disabled={!canAfford}
								aria-label={`Build ${def.name}`}
							>
								{canAfford ? 'Build' : 'Need resources'}
							</button>
						)}
					</div>
				)
			})}
		</div>
	)
}
