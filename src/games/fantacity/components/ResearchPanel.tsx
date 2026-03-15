import type { GameState, ResearchId } from '../types'
import { RESEARCH_DEFS } from '../constants'
import { enqueueResearch } from '../systems/research'
import { cn } from '@/lib/utils'

interface ResearchPanelProps {
	state: GameState
	onUpdate: (next: GameState) => void
}

export function ResearchPanel({ state, onUpdate }: ResearchPanelProps) {
	function status(id: ResearchId) {
		if (state.research.some((r) => r.id === id && r.complete)) return 'done'
		if (state.researchQueue.includes(id)) return 'queued'
		return 'available'
	}

	function progressPct(id: ResearchId): number {
		const def = RESEARCH_DEFS.find((d) => d.id === id)
		const entry = state.research.find((r) => r.id === id && !r.complete)
		if (!def || !entry) return 0
		return Math.round(((def.researchTime - entry.timeRemaining) / def.researchTime) * 100)
	}

	const activeId = state.researchQueue[0]

	return (
		<div className="space-y-2">
			{RESEARCH_DEFS.map((def) => {
				const s = status(def.id)
				const locked = def.requires.some(
					(req) => !state.research.some((r) => r.id === req && r.complete),
				)
				const canAfford = Object.entries(def.cost).every(
					([k, v]) => state.resources[k as keyof typeof state.resources] >= (v ?? 0),
				)
				const isActive = activeId === def.id

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
							{s === 'done' && <span className="text-xs text-green-500">✓ Done</span>}
							{s === 'queued' && !isActive && (
								<span className="text-xs text-muted-foreground">Queued</span>
							)}
							{isActive && <span className="text-xs text-blue-400">{progressPct(def.id)}%</span>}
						</div>
						<p className="text-xs text-muted-foreground">{def.description}</p>
						<p className="text-xs text-muted-foreground">
							Cost:{' '}
							{Object.entries(def.cost)
								.map(([k, v]) => `${v} ${k}`)
								.join(', ')}
							{' · '}
							{def.researchTime}s
						</p>
						{isActive && (
							<div className="h-1.5 rounded-full bg-muted overflow-hidden">
								<div
									className="h-full bg-blue-400 transition-all"
									style={{ width: `${progressPct(def.id)}%` }}
								/>
							</div>
						)}
						{s === 'available' && !locked && (
							<button
								className="mt-1 text-xs rounded border border-border px-2 py-0.5 hover:bg-muted disabled:opacity-40"
								onClick={() => onUpdate(enqueueResearch(state, def.id))}
								disabled={!canAfford}
								aria-label={`Research ${def.name}`}
							>
								{canAfford ? 'Research' : 'Need resources'}
							</button>
						)}
					</div>
				)
			})}
		</div>
	)
}
