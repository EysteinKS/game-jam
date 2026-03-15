import { useRef, useCallback, useState, useEffect } from 'react'
import type { GameProps } from '@/types'
import { useGameLoop } from '@/hooks/useGameLoop'
import type { GameState } from './types'
import { createInitialState } from './state'
import { tickResources } from './systems/resources'
import { tickBuildQueue } from './systems/buildings'
import { tickResearch } from './systems/research'
import { checkVictory } from './systems/victory'
import { ResourceBar } from './components/ResourceBar'
import { HQTabs } from './components/HQTabs'
import type { Tab } from './components/HQTabs'
import { OverworldMap } from './components/OverworldMap'
import { BattleLog } from './components/BattleLog'

export default function Fantacity({ width, height }: GameProps) {
	const stateRef = useRef<GameState>(createInitialState())
	// Force re-render by bumping a counter
	const [, setTick] = useState(0)
	const [activeTab, setActiveTab] = useState<Tab>('workers')
	const [view, setView] = useState<'hq' | 'overworld'>('hq')
	const [showBattleLog, setShowBattleLog] = useState(false)

	const tickAccRef = useRef(0)

	const update = useCallback((dt: number) => {
		tickAccRef.current += dt
		// Run logic tick at most once per second to keep things readable
		if (tickAccRef.current < 1) return
		tickAccRef.current = 0

		let s = stateRef.current
		if (s.phase !== 'playing') return

		s = tickResources(s, 1)
		s = tickBuildQueue(s, 1)
		s = tickResearch(s, 1)
		s = { ...s, tick: s.tick + 1 }

		const victory = checkVictory(s)
		if (victory) {
			s = { ...s, phase: 'victory', victoryCondition: victory }
		}

		stateRef.current = s
		setTick((t) => t + 1)
	}, [])

	useGameLoop({ onUpdate: update })

	// R key: restart from victory / defeat screens
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key !== 'r' && e.key !== 'R') return
			const phase = stateRef.current.phase
			if (phase === 'victory' || phase === 'defeat') {
				stateRef.current = createInitialState()
				setTick((t) => t + 1)
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [])

	function handleStateUpdate(next: GameState) {
		// After a battle, show the log and resume playing phase
		if (next.phase === 'battle' && next.lastBattle) {
			stateRef.current = { ...next, phase: 'playing' }
			setShowBattleLog(true)
		} else {
			stateRef.current = next
		}
		setTick((t) => t + 1)
	}

	function handleDispatch() {
		setView('overworld')
	}

	const state = stateRef.current

	if (state.phase === 'victory') {
		return (
			<VictoryScreen
				condition={state.victoryCondition ?? 'domination'}
				onRestart={() => {
					stateRef.current = createInitialState()
					setTick((t) => t + 1)
				}}
			/>
		)
	}

	if (state.phase === 'defeat') {
		return (
			<GameOverScreen
				onRestart={() => {
					stateRef.current = createInitialState()
					setTick((t) => t + 1)
				}}
			/>
		)
	}

	return (
		<div className="mx-auto space-y-3 p-2" style={{ maxWidth: width, minHeight: height * 0.5 }}>
			{/* Battle log overlay */}
			{showBattleLog && state.lastBattle && (
				<BattleLog result={state.lastBattle} onClose={() => setShowBattleLog(false)} />
			)}

			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold">⚔️ Fantacity</h2>
				<div className="flex gap-2">
					<button
						className={`text-xs rounded border px-2 py-1 ${view === 'hq' ? 'bg-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}
						onClick={() => setView('hq')}
					>
						🏰 HQ
					</button>
					<button
						className={`text-xs rounded border px-2 py-1 ${view === 'overworld' ? 'bg-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}
						onClick={() => setView('overworld')}
					>
						🗺️ Overworld
					</button>
				</div>
			</div>

			{/* Resource strip */}
			<ResourceBar resources={state.resources} caps={state.resourceCaps} />

			{/* Main view */}
			{view === 'hq' ? (
				<HQTabs
					state={state}
					activeTab={activeTab}
					onTabChange={setActiveTab}
					onUpdate={handleStateUpdate}
					onDispatch={handleDispatch}
				/>
			) : (
				<OverworldMap state={state} onUpdate={handleStateUpdate} />
			)}

			{/* Tick counter */}
			<p className="text-xs text-muted-foreground text-right">Tick: {state.tick}</p>
		</div>
	)
}

// ─── Overlay screens ─────────────────────────────────────────────────────────

interface RestartProps {
	onRestart: () => void
}

function VictoryScreen({ condition, onRestart }: RestartProps & { condition: string }) {
	const labels: Record<string, string> = {
		domination: '⚔️ Domination',
		religion: '✨ Religious Supremacy',
		diplomacy: '🤝 Diplomatic Victory',
		science: '📜 Scientific Mastery',
	}
	return (
		<div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-6 py-16">
			<h2 className="text-3xl font-bold text-yellow-400">Victory!</h2>
			<p className="text-lg">{labels[condition] ?? condition}</p>
			<button
				className="rounded bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
				onClick={onRestart}
			>
				Play Again
			</button>
		</div>
	)
}

function GameOverScreen({ onRestart }: RestartProps) {
	return (
		<div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-6 py-16">
			<h2 className="text-3xl font-bold text-red-500">Defeat</h2>
			<p className="text-muted-foreground">Your capital has fallen.</p>
			<button
				className="rounded bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
				onClick={onRestart}
			>
				Play Again
			</button>
		</div>
	)
}
