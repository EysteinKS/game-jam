import type { GameState } from '../types'
import { WorkerPanel } from './WorkerPanel'
import { BuildPanel } from './BuildPanel'
import { ResearchPanel } from './ResearchPanel'
import { ArmyPanel } from './ArmyPanel'

type Tab = 'workers' | 'build' | 'research' | 'army'

const TABS: { id: Tab; label: string }[] = [
	{ id: 'workers', label: 'Workers' },
	{ id: 'build', label: 'Build' },
	{ id: 'research', label: 'Research' },
	{ id: 'army', label: 'Army' },
]

interface HQTabsProps {
	state: GameState
	activeTab: Tab
	onTabChange: (tab: Tab) => void
	onUpdate: (next: GameState) => void
	onDispatch: () => void
}

export function HQTabs({ state, activeTab, onTabChange, onUpdate, onDispatch }: HQTabsProps) {
	return (
		<div className="rounded-lg border border-border bg-card overflow-hidden">
			{/* Tab bar */}
			<div className="flex border-b border-border">
				{TABS.map((tab) => (
					<button
						key={tab.id}
						className={`flex-1 py-2 text-sm font-medium transition-colors ${
							activeTab === tab.id
								? 'bg-background text-foreground border-b-2 border-primary'
								: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
						}`}
						onClick={() => onTabChange(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab content */}
			<div className="p-4">
				{activeTab === 'workers' && <WorkerPanel state={state} onUpdate={onUpdate} />}
				{activeTab === 'build' && <BuildPanel state={state} onUpdate={onUpdate} />}
				{activeTab === 'research' && <ResearchPanel state={state} onUpdate={onUpdate} />}
				{activeTab === 'army' && (
					<ArmyPanel state={state} onUpdate={onUpdate} onDispatch={onDispatch} />
				)}
			</div>
		</div>
	)
}

export type { Tab }
