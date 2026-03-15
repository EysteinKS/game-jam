import type { WorkerTask } from '../types'
import type { GameState } from '../types'
import { WORKER_TASK_LABELS } from '../constants'
import { assignWorker, unassignWorker } from '../systems/workers'

const WORKER_TASKS: WorkerTask[] = ['mine', 'farm', 'quarry', 'lumber', 'chapel', 'library']

interface WorkerPanelProps {
	state: GameState
	onUpdate: (next: GameState) => void
}

export function WorkerPanel({ state, onUpdate }: WorkerPanelProps) {
	const totalAssigned = Object.values(state.workers).reduce((s, n) => s + n, 0)
	const idle = state.maxPopulation - totalAssigned

	return (
		<div className="space-y-4">
			<p className="text-sm text-muted-foreground">
				Workers: <span className="font-semibold text-foreground">{totalAssigned}</span> /{' '}
				{state.maxPopulation} &nbsp;·&nbsp; Idle:{' '}
				<span className="font-semibold text-foreground">{idle}</span>
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{WORKER_TASKS.map((task) => (
					<div
						key={task}
						className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
					>
						<span className="text-sm">{WORKER_TASK_LABELS[task]}</span>
						<div className="flex items-center gap-2">
							<button
								className="h-6 w-6 rounded border border-border text-sm hover:bg-muted disabled:opacity-40"
								onClick={() => onUpdate(unassignWorker(state, task))}
								disabled={state.workers[task] === 0}
								aria-label={`Remove worker from ${task}`}
							>
								−
							</button>
							<span className="w-5 text-center tabular-nums font-semibold">
								{state.workers[task]}
							</span>
							<button
								className="h-6 w-6 rounded border border-border text-sm hover:bg-muted disabled:opacity-40"
								onClick={() => onUpdate(assignWorker(state, task))}
								disabled={totalAssigned >= state.maxPopulation}
								aria-label={`Add worker to ${task}`}
							>
								+
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
