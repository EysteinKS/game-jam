import { useReducer } from 'react'
import type { GameProps } from '@/types'
import type { HubStationState, HubTab, RegionTab } from './types'
import {
	INITIAL_RESOURCES,
	INITIAL_MAX_RESOURCES,
	INITIAL_FLEET,
	INITIAL_RESEARCH,
	REGION_NAMES,
	WARP_ENERGY_COST,
	EXPLORE_ENERGY_COST,
	MAX_REGION_TURNS,
	SHIELD_REPAIR_COST_ENERGY,
	SHIELD_REPAIR_AMOUNT,
	CONVERT_MINERALS_IN,
	CONVERT_MINERALS_OUT,
} from './constants'
import { generateRegion, revealNeighbors, getTotalFleetAttack } from './systems/region'
import { ResourceBar } from './components/ResourceBar'
import { HubView } from './components/HubView'
import { RegionView } from './components/RegionView'

// ── Actions ──────────────────────────────────────────────────────────────────

type Action =
	| { type: 'SET_HUB_TAB'; tab: HubTab }
	| { type: 'SET_REGION_TAB'; tab: RegionTab }
	| { type: 'WARP_TO_REGION' }
	| { type: 'EXPLORE_TILE'; tileId: string }
	| { type: 'RETURN_TO_HUB' }
	| { type: 'UNLOCK_RESEARCH'; nodeId: string }
	| { type: 'REPAIR_SHIELD' }
	| { type: 'CONVERT_MINERALS' }
	| { type: 'RESTART' }

// ── Initial state ─────────────────────────────────────────────────────────────

function buildInitialState(runCount = 0): HubStationState {
	return {
		phase: 'hub',
		hubTab: 'overview',
		regionTab: 'map',
		resources: { ...INITIAL_RESOURCES },
		maxResources: { ...INITIAL_MAX_RESOURCES },
		shieldIntegrity: 100,
		fleet: INITIAL_FLEET.map((v) => ({ ...v })),
		research: INITIAL_RESEARCH.map((r) => ({ ...r })),
		region: null,
		regionName: '',
		regionTurn: 0,
		maxRegionTurns: MAX_REGION_TURNS,
		log: ['Hub Station AI online. Awaiting orders.'],
		runCount,
		gameOverReason: '',
	}
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value))
}

function addLog(log: string[], entry: string): string[] {
	return [...log, entry]
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state: HubStationState, action: Action): HubStationState {
	switch (action.type) {
		case 'SET_HUB_TAB':
			return { ...state, hubTab: action.tab }

		case 'SET_REGION_TAB':
			return { ...state, regionTab: action.tab }

		case 'WARP_TO_REGION': {
			if (state.resources.energy < WARP_ENERGY_COST) return state
			const regionName = REGION_NAMES[state.runCount % REGION_NAMES.length]
			const region = generateRegion(regionName, state.research)
			return {
				...state,
				phase: 'region',
				regionTab: 'map',
				region,
				regionName,
				regionTurn: 0,
				resources: {
					...state.resources,
					energy: state.resources.energy - WARP_ENERGY_COST,
				},
				log: addLog(state.log, `🌀 Warped to ${regionName}. Fleet ready to explore.`),
			}
		}

		case 'EXPLORE_TILE': {
			if (!state.region) return state
			if (state.resources.energy < EXPLORE_ENERGY_COST) return state

			const tile = state.region.find((t) => t.id === action.tileId)
			if (!tile || tile.explored || !tile.visible) return state

			const hasCombatTactics =
				state.research.find((r) => r.id === 'combat-tactics')?.unlocked ?? false

			let newLog = state.log
			let newResources = {
				...state.resources,
				energy: state.resources.energy - EXPLORE_ENERGY_COST,
			}
			let newFleet = state.fleet.map((v) => ({ ...v }))
			let newShield = state.shieldIntegrity
			let newPhase = state.phase
			let gameOverReason = ''

			// Process tile effects
			if (tile.minerals > 0) {
				const gained = Math.min(tile.minerals, state.maxResources.minerals - newResources.minerals)
				newResources = { ...newResources, minerals: newResources.minerals + gained }
				newLog = addLog(newLog, `🪨 ${tile.eventText} +${gained} minerals.`)
			}

			if (tile.science > 0) {
				const gained = Math.min(tile.science, state.maxResources.science - newResources.science)
				newResources = { ...newResources, science: newResources.science + gained }
				newLog = addLog(newLog, `🔬 ${tile.eventText} +${gained} science.`)
			}

			if (tile.threat > 0) {
				const totalAttack = getTotalFleetAttack(newFleet, hasCombatTactics)
				const damageToFleet = Math.max(0, tile.threat - Math.floor(totalAttack / 2))
				const damageToShield = Math.floor(damageToFleet * 0.3)
				newLog = addLog(newLog, `☠️ ${tile.eventText} Threat level ${tile.threat}.`)

				if (damageToFleet > 0) {
					// Distribute damage across operational vessels
					let remaining = damageToFleet
					newFleet = newFleet.map((v) => {
						if (remaining <= 0 || v.hull <= 0) return v
						const dmg = Math.min(remaining, v.hull)
						remaining -= dmg
						return { ...v, hull: v.hull - dmg }
					})
					newLog = addLog(newLog, `💥 Fleet took ${damageToFleet} hull damage!`)
				} else {
					newLog = addLog(newLog, `✅ Combat won decisively! No damage taken.`)
				}

				if (damageToShield > 0) {
					newShield = clamp(newShield - damageToShield, 0, 100)
					newLog = addLog(newLog, `🛡️ Hub shield took ${damageToShield}% damage.`)
				}

				// Check fleet destruction
				const fleetDestroyed = newFleet.every((v) => v.hull <= 0)
				if (fleetDestroyed) {
					newPhase = 'game_over'
					gameOverReason = 'All fleet vessels destroyed in combat.'
					newLog = addLog(newLog, `💀 All vessels destroyed! Mission failed.`)
				}

				// Check shield critical
				if (newShield <= 0) {
					newPhase = 'game_over'
					gameOverReason = 'Hub shield reached critical failure.'
					newLog = addLog(newLog, `🚨 Hub shield critical! Emergency abort.`)
				}
			}

			if (tile.type === 'void' && tile.minerals === 0 && tile.science === 0 && tile.threat === 0) {
				newLog = addLog(newLog, `⬜ ${tile.eventText}`)
			}

			if (tile.type === 'anomaly') {
				newLog = addLog(newLog, `❓ ${tile.eventText}`)
			}

			// Update region tiles
			let newRegion = state.region.map((t) => (t.id === tile.id ? { ...t, explored: true } : t))
			newRegion = revealNeighbors(newRegion, tile.id)

			const newTurn = state.regionTurn + 1
			let finalPhase = newPhase
			let finalReason = gameOverReason

			// Check turn limit
			if (newTurn >= state.maxRegionTurns && finalPhase === 'region') {
				newLog = addLog(newLog, `⚠️ Region becoming unstable — stellar anomaly approaching!`)
				newShield = clamp(newShield - 10, 0, 100)
				newLog = addLog(newLog, `🛡️ Hub shield took 10% damage from spatial stress.`)
				if (newShield <= 0) {
					finalPhase = 'game_over'
					finalReason = 'Hub shield destroyed by spatial anomaly after exceeding region time limit.'
					newLog = addLog(newLog, `💀 Hub shield failed! Mission over.`)
				}
			}

			return {
				...state,
				phase: finalPhase,
				resources: {
					...newResources,
					energy: clamp(newResources.energy, 0, state.maxResources.energy),
					minerals: clamp(newResources.minerals, 0, state.maxResources.minerals),
					science: clamp(newResources.science, 0, state.maxResources.science),
					crew: clamp(newResources.crew, 0, state.maxResources.crew),
				},
				fleet: newFleet,
				shieldIntegrity: newShield,
				region: newRegion,
				regionTurn: newTurn,
				log: newLog,
				gameOverReason: finalReason,
			}
		}

		case 'RETURN_TO_HUB': {
			const hasBioVats = state.research.find((r) => r.id === 'bio-vats')?.unlocked ?? false
			const hasShieldRestoration =
				state.research.find((r) => r.id === 'shield-restoration')?.unlocked ?? false

			let newResources = { ...state.resources }
			let newShield = state.shieldIntegrity
			let newFleet = state.fleet.map((v) => ({ ...v }))
			let newLog = addLog(state.log, `↩ Fleet returned to Hub Station.`)

			// Restore some energy on return
			const energyGain = 20
			newResources = {
				...newResources,
				energy: clamp(newResources.energy + energyGain, 0, state.maxResources.energy),
			}
			newLog = addLog(newLog, `⚡ Hub reactors recharged +${energyGain} energy.`)

			if (hasBioVats && newResources.crew < state.maxResources.crew) {
				newResources = {
					...newResources,
					crew: Math.min(newResources.crew + 1, state.maxResources.crew),
				}
				newLog = addLog(newLog, `🧬 Bio-Vats: +1 new crew member spawned.`)
			}

			if (hasShieldRestoration) {
				const restored = Math.min(20, 100 - newShield)
				newShield = newShield + restored
				newLog = addLog(newLog, `🛡️ Shield Restoration: +${restored}% shield integrity.`)
			}

			// Heal fleet slightly on return
			newFleet = newFleet.map((v) => ({
				...v,
				hull: Math.min(v.hull + Math.floor(v.maxHull * 0.2), v.maxHull),
			}))
			newLog = addLog(newLog, `🔧 Vessels repaired to 20% hull at Hub docks.`)

			return {
				...state,
				phase: 'hub',
				hubTab: 'overview',
				region: null,
				regionTurn: 0,
				resources: newResources,
				fleet: newFleet,
				shieldIntegrity: newShield,
				runCount: state.runCount + 1,
				log: newLog,
			}
		}

		case 'UNLOCK_RESEARCH': {
			const node = state.research.find((r) => r.id === action.nodeId)
			if (!node || node.unlocked || !node.available) return state
			if (state.resources.science < node.scienceCost) return state
			if (state.resources.minerals < node.mineralCost) return state

			const newResources = {
				...state.resources,
				science: state.resources.science - node.scienceCost,
				minerals: state.resources.minerals - node.mineralCost,
			}
			let newFleet = state.fleet.map((v) => ({ ...v }))
			let newMaxResources = { ...state.maxResources }
			let newLog = addLog(state.log, `🔬 Researched: ${node.name}`)

			// Apply research effects
			if (node.id === 'advanced-hull') {
				newFleet = newFleet.map((v) => ({ ...v, maxHull: v.maxHull + 20, hull: v.hull + 20 }))
				newLog = addLog(newLog, `🚀 All vessels: +20 max hull.`)
			}
			if (node.id === 'crew-quarters') {
				newMaxResources = { ...newMaxResources, crew: newMaxResources.crew + 5 }
				newLog = addLog(newLog, `👤 Max crew capacity +5.`)
			}
			if (node.id === 'energy-cells') {
				newMaxResources = { ...newMaxResources, energy: newMaxResources.energy + 30 }
				newLog = addLog(newLog, `⚡ Max energy capacity +30.`)
			}
			if (node.id === 'frigate-class') {
				const frigate = {
					id: 'frigate-2',
					name: 'Frigate II',
					type: 'frigate' as const,
					hull: 60,
					maxHull: 60,
					attack: 15,
				}
				newFleet = [...newFleet, frigate]
				newLog = addLog(newLog, `🚀 Frigate II added to the fleet!`)
			}

			// Unlock prerequisites for dependent nodes
			const newResearch = state.research.map((r) => {
				if (r.id === action.nodeId) return { ...r, unlocked: true }
				if (r.prerequisites.includes(action.nodeId)) {
					// Check if all prerequisites are now met
					const allMet = r.prerequisites.every((p) => {
						if (p === action.nodeId) return true
						return state.research.find((rr) => rr.id === p)?.unlocked ?? false
					})
					if (allMet) return { ...r, available: true }
				}
				return r
			})

			return {
				...state,
				research: newResearch,
				resources: newResources,
				fleet: newFleet,
				maxResources: newMaxResources,
				log: newLog,
			}
		}

		case 'REPAIR_SHIELD': {
			if (state.resources.energy < SHIELD_REPAIR_COST_ENERGY) return state
			if (state.shieldIntegrity >= 100) return state
			const repaired = Math.min(SHIELD_REPAIR_AMOUNT, 100 - state.shieldIntegrity)
			return {
				...state,
				shieldIntegrity: state.shieldIntegrity + repaired,
				resources: {
					...state.resources,
					energy: state.resources.energy - SHIELD_REPAIR_COST_ENERGY,
				},
				log: addLog(
					state.log,
					`🛡️ Shield repaired +${repaired}% (cost: ${SHIELD_REPAIR_COST_ENERGY}⚡)`,
				),
			}
		}

		case 'CONVERT_MINERALS': {
			const hasRefinery = state.research.find((r) => r.id === 'mineral-refinery')?.unlocked ?? false
			if (!hasRefinery) return state
			if (state.resources.minerals < CONVERT_MINERALS_IN) return state
			const gained = Math.min(
				CONVERT_MINERALS_OUT,
				state.maxResources.science - state.resources.science,
			)
			return {
				...state,
				resources: {
					...state.resources,
					minerals: state.resources.minerals - CONVERT_MINERALS_IN,
					science: state.resources.science + gained,
				},
				log: addLog(state.log, `⚗️ Refinery: -${CONVERT_MINERALS_IN}🪨 → +${gained}🔬`),
			}
		}

		case 'RESTART':
			return buildInitialState(state.runCount)

		default:
			return state
	}
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HubStation({ width }: GameProps) {
	const [state, dispatch] = useReducer(reducer, undefined, () => buildInitialState())

	const isNarrow = width < 500

	return (
		<div
			className="bg-gray-900 text-white rounded-lg overflow-y-auto"
			style={{ width: '100%', maxWidth: width, minHeight: 500 }}
		>
			{/* Header */}
			<div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-3 py-2">
				<div className="flex items-center justify-between mb-2">
					<h1 className={`font-bold text-indigo-300 ${isNarrow ? 'text-base' : 'text-lg'}`}>
						🛸 Hub Station
					</h1>
					<div className="flex items-center gap-2 text-xs text-gray-400">
						<span>Run #{state.runCount + 1}</span>
						{state.phase === 'region' && (
							<span className="px-1.5 py-0.5 bg-indigo-900 rounded text-indigo-300">In Region</span>
						)}
					</div>
				</div>
				<ResourceBar resources={state.resources} maxResources={state.maxResources} />
			</div>

			{/* Main content */}
			<div className="p-3">
				{state.phase === 'game_over' ? (
					<GameOverScreen state={state} onRestart={() => dispatch({ type: 'RESTART' })} />
				) : state.phase === 'hub' ? (
					<HubView
						state={state}
						onSetTab={(tab) => dispatch({ type: 'SET_HUB_TAB', tab })}
						onWarp={() => dispatch({ type: 'WARP_TO_REGION' })}
						onRepairShield={() => dispatch({ type: 'REPAIR_SHIELD' })}
						onConvertMinerals={() => dispatch({ type: 'CONVERT_MINERALS' })}
						onUnlockResearch={(id) => dispatch({ type: 'UNLOCK_RESEARCH', nodeId: id })}
					/>
				) : (
					<RegionView
						state={state}
						onSetTab={(tab) => dispatch({ type: 'SET_REGION_TAB', tab })}
						onExploreTile={(id) => dispatch({ type: 'EXPLORE_TILE', tileId: id })}
						onReturnToHub={() => dispatch({ type: 'RETURN_TO_HUB' })}
					/>
				)}
			</div>
		</div>
	)
}

function GameOverScreen({ state, onRestart }: { state: HubStationState; onRestart: () => void }) {
	const exploredCount = state.region?.filter((t) => t.explored).length ?? 0

	return (
		<div className="flex flex-col items-center gap-4 py-6 text-center">
			<div className="text-4xl">💀</div>
			<h2 className="text-xl font-bold text-red-400">Mission Failed</h2>
			<p className="text-sm text-gray-400 max-w-xs">{state.gameOverReason}</p>

			<div className="bg-gray-800 rounded-lg p-4 w-full max-w-xs text-sm">
				<h3 className="font-semibold text-gray-300 mb-2">Run Summary</h3>
				<div className="grid grid-cols-2 gap-y-1 text-left">
					<span className="text-gray-400">Runs completed:</span>
					<span className="text-white font-mono">{state.runCount}</span>
					<span className="text-gray-400">Tiles explored:</span>
					<span className="text-white font-mono">{exploredCount}</span>
					<span className="text-gray-400">Minerals:</span>
					<span className="text-teal-400 font-mono">{state.resources.minerals}</span>
					<span className="text-gray-400">Science:</span>
					<span className="text-purple-400 font-mono">{state.resources.science}</span>
					<span className="text-gray-400">Region turns:</span>
					<span className="text-white font-mono">{state.regionTurn}</span>
				</div>
			</div>

			<button
				onClick={onRestart}
				className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-sm transition-colors"
			>
				🔄 New Run
			</button>
		</div>
	)
}
