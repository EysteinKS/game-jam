import type { BattleResult } from '../types'

interface BattleLogProps {
	result: BattleResult
	onClose: () => void
}

export function BattleLog({ result, onClose }: BattleLogProps) {
	const lootEntries = Object.entries(result.lootGained).filter(([, v]) => v > 0)

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
			<div className="w-full max-w-md rounded-lg border border-border bg-background p-6 space-y-4 max-h-[80vh] overflow-y-auto">
				<h3 className={`text-xl font-bold ${result.victory ? 'text-green-400' : 'text-red-400'}`}>
					{result.victory ? '⚔️ Victory!' : '💀 Defeated'}
				</h3>

				{/* Rounds */}
				<div className="space-y-1">
					{result.rounds.map((round) => (
						<p key={round.round} className="text-sm text-muted-foreground">
							{round.narrative}
						</p>
					))}
				</div>

				{/* Loot */}
				{result.victory && lootEntries.length > 0 && (
					<div>
						<p className="text-sm font-semibold mb-1">Loot gained:</p>
						<ul className="text-sm text-muted-foreground space-y-0.5">
							{lootEntries.map(([k, v]) => (
								<li key={k}>
									+{v} {k}
								</li>
							))}
							{result.faithGained > 0 && <li>+{result.faithGained} faith</li>}
						</ul>
					</div>
				)}

				{/* Surviving army */}
				<div>
					<p className="text-sm font-semibold mb-1">Surviving army:</p>
					<p className="text-sm text-muted-foreground">
						{Object.entries(result.survivingArmy)
							.filter(([, n]) => n > 0)
							.map(([t, n]) => `${n}×${t}`)
							.join(', ') || 'None'}
					</p>
				</div>

				<button
					className="w-full rounded bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
					onClick={onClose}
					autoFocus
				>
					Continue
				</button>
			</div>
		</div>
	)
}
