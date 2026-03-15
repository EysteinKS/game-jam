import type { HubStationState, HubTab } from '../types'
import { cn } from '@/lib/utils'
import {
	WARP_ENERGY_COST,
	SHIELD_REPAIR_COST_ENERGY,
	SHIELD_REPAIR_AMOUNT,
	CONVERT_MINERALS_IN,
	CONVERT_MINERALS_OUT,
	REGION_NAMES,
} from '../constants'

const CATEGORY_COLORS: Record<string, string> = {
	fleet: 'border-blue-500 bg-blue-950',
	biological: 'border-green-500 bg-green-950',
	construction: 'border-orange-500 bg-orange-950',
	communication: 'border-purple-500 bg-purple-950',
}

const CATEGORY_ICONS: Record<string, string> = {
	fleet: '🚀',
	biological: '🧬',
	construction: '🔧',
	communication: '📡',
}

interface HubViewProps {
	state: HubStationState
	onSetTab: (tab: HubTab) => void
	onWarp: () => void
	onRepairShield: () => void
	onConvertMinerals: () => void
	onUnlockResearch: (id: string) => void
}

export function HubView({
	state,
	onSetTab,
	onWarp,
	onRepairShield,
	onConvertMinerals,
	onUnlockResearch,
}: HubViewProps) {
	const tabs: { id: HubTab; label: string }[] = [
		{ id: 'overview', label: '🛸 Overview' },
		{ id: 'research', label: '🔬 Research' },
		{ id: 'warp', label: '🌀 Warp' },
	]

	return (
		<div className="flex flex-col gap-3">
			{/* Shield bar */}
			<div className="px-3 py-2 bg-gray-800 rounded-lg">
				<div className="flex items-center justify-between mb-1 text-sm">
					<span className="text-gray-300">🛡️ Hub Shield</span>
					<span
						className={cn(
							'font-mono font-bold',
							state.shieldIntegrity > 60
								? 'text-green-400'
								: state.shieldIntegrity > 30
									? 'text-yellow-400'
									: 'text-red-400',
						)}
					>
						{state.shieldIntegrity}%
					</span>
				</div>
				<div className="h-2 bg-gray-600 rounded-full overflow-hidden">
					<div
						className={cn(
							'h-full rounded-full transition-all',
							state.shieldIntegrity > 60
								? 'bg-green-500'
								: state.shieldIntegrity > 30
									? 'bg-yellow-500'
									: 'bg-red-500',
						)}
						style={{ width: `${state.shieldIntegrity}%` }}
					/>
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
							state.hubTab === t.id
								? 'bg-indigo-600 text-white'
								: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
						)}
					>
						{t.label}
					</button>
				))}
			</div>

			{/* Tab content */}
			{state.hubTab === 'overview' && (
				<OverviewTab
					state={state}
					onRepairShield={onRepairShield}
					onConvertMinerals={onConvertMinerals}
				/>
			)}
			{state.hubTab === 'research' && (
				<ResearchTab state={state} onUnlockResearch={onUnlockResearch} />
			)}
			{state.hubTab === 'warp' && <WarpTab state={state} onWarp={onWarp} />}
		</div>
	)
}

function OverviewTab({
	state,
	onRepairShield,
	onConvertMinerals,
}: {
	state: HubStationState
	onRepairShield: () => void
	onConvertMinerals: () => void
}) {
	const hasRefinery = state.research.find((r) => r.id === 'mineral-refinery')?.unlocked ?? false
	const canRepair =
		state.resources.energy >= SHIELD_REPAIR_COST_ENERGY && state.shieldIntegrity < 100
	const canConvert = hasRefinery && state.resources.minerals >= CONVERT_MINERALS_IN

	return (
		<div className="flex flex-col gap-3">
			{/* Fleet status */}
			<div className="bg-gray-800 rounded-lg p-3">
				<h3 className="text-sm font-semibold text-gray-300 mb-2">⚓ Fleet</h3>
				<div className="flex flex-col gap-2">
					{state.fleet.map((vessel) => {
						const pct = Math.round((vessel.hull / vessel.maxHull) * 100)
						return (
							<div key={vessel.id} className="flex items-center gap-2">
								<span className="text-xs text-gray-400 w-24 truncate">{vessel.name}</span>
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
						)
					})}
				</div>
			</div>

			{/* Actions */}
			<div className="flex flex-col gap-2">
				<button
					onClick={onRepairShield}
					disabled={!canRepair}
					className={cn(
						'w-full py-2.5 rounded-lg text-sm font-medium transition-colors',
						canRepair
							? 'bg-blue-700 hover:bg-blue-600 text-white'
							: 'bg-gray-700 text-gray-500 cursor-not-allowed',
					)}
				>
					🛡️ Repair Shield (+{SHIELD_REPAIR_AMOUNT}%) — costs {SHIELD_REPAIR_COST_ENERGY} ⚡
				</button>

				{hasRefinery && (
					<button
						onClick={onConvertMinerals}
						disabled={!canConvert}
						className={cn(
							'w-full py-2.5 rounded-lg text-sm font-medium transition-colors',
							canConvert
								? 'bg-purple-700 hover:bg-purple-600 text-white'
								: 'bg-gray-700 text-gray-500 cursor-not-allowed',
						)}
					>
						⚗️ Refine Minerals ({CONVERT_MINERALS_IN} 🪨 → {CONVERT_MINERALS_OUT} 🔬)
					</button>
				)}
			</div>

			{/* Recent log */}
			<div className="bg-gray-800 rounded-lg p-3">
				<h3 className="text-sm font-semibold text-gray-300 mb-2">📋 Recent Events</h3>
				<div className="flex flex-col gap-1 max-h-28 overflow-y-auto">
					{state.log
						.slice(-5)
						.reverse()
						.map((entry, i) => (
							<p key={i} className="text-xs text-gray-400 leading-snug">
								{entry}
							</p>
						))}
				</div>
			</div>
		</div>
	)
}

function ResearchTab({
	state,
	onUnlockResearch,
}: {
	state: HubStationState
	onUnlockResearch: (id: string) => void
}) {
	const categories = ['fleet', 'biological', 'construction', 'communication'] as const

	return (
		<div className="flex flex-col gap-3">
			{categories.map((cat) => {
				const nodes = state.research.filter((r) => r.category === cat)
				return (
					<div key={cat} className="bg-gray-800 rounded-lg p-3">
						<h3 className="text-sm font-semibold text-gray-300 mb-2">
							{CATEGORY_ICONS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
						</h3>
						<div className="flex flex-col gap-2">
							{nodes.map((node) => {
								const canAfford =
									state.resources.science >= node.scienceCost &&
									state.resources.minerals >= node.mineralCost
								const prereqsMet = node.prerequisites.every(
									(p) => state.research.find((r) => r.id === p)?.unlocked,
								)

								return (
									<div
										key={node.id}
										className={cn(
											'border rounded-lg p-2 text-xs',
											node.unlocked
												? 'border-gray-600 bg-gray-700 opacity-60'
												: node.available && prereqsMet
													? CATEGORY_COLORS[cat]
													: 'border-gray-700 bg-gray-850 opacity-40',
										)}
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1 min-w-0">
												<p className="font-semibold text-gray-200 truncate">{node.name}</p>
												<p className="text-gray-400 mt-0.5 leading-snug">{node.description}</p>
												<p className="text-gray-500 mt-0.5 italic">{node.effect}</p>
											</div>
											<div className="shrink-0 flex flex-col items-end gap-1">
												{node.unlocked ? (
													<span className="text-green-400 font-bold">✓</span>
												) : !prereqsMet ? (
													<span className="text-gray-500">🔒</span>
												) : (
													<button
														onClick={() => onUnlockResearch(node.id)}
														disabled={!canAfford}
														className={cn(
															'px-2 py-1 rounded text-xs font-medium transition-colors',
															canAfford
																? 'bg-indigo-600 hover:bg-indigo-500 text-white'
																: 'bg-gray-700 text-gray-500 cursor-not-allowed',
														)}
													>
														Research
													</button>
												)}
												{!node.unlocked && prereqsMet && (
													<div className="flex gap-1 text-gray-400">
														{node.scienceCost > 0 && (
															<span
																className={cn(
																	state.resources.science >= node.scienceCost
																		? 'text-purple-400'
																		: 'text-red-400',
																)}
															>
																{node.scienceCost}🔬
															</span>
														)}
														{node.mineralCost > 0 && (
															<span
																className={cn(
																	state.resources.minerals >= node.mineralCost
																		? 'text-teal-400'
																		: 'text-red-400',
																)}
															>
																{node.mineralCost}🪨
															</span>
														)}
													</div>
												)}
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)
			})}
		</div>
	)
}

function WarpTab({ state, onWarp }: { state: HubStationState; onWarp: () => void }) {
	const canWarp = state.resources.energy >= WARP_ENERGY_COST
	const nextRegionIndex = state.runCount % REGION_NAMES.length
	const nextRegion = REGION_NAMES[nextRegionIndex]

	return (
		<div className="flex flex-col gap-3">
			<div className="bg-gray-800 rounded-lg p-4">
				<h3 className="text-base font-bold text-indigo-300 mb-1">🌀 Quantum Drive</h3>
				<p className="text-sm text-gray-400 mb-3">
					Engage the warp drive to send the fleet into a new region. Collect resources, avoid
					threats, and return safely to advance the Hub.
				</p>

				<div className="bg-gray-700 rounded p-3 mb-3">
					<p className="text-xs text-gray-400 mb-1">Target Region</p>
					<p className="text-sm font-semibold text-white">{nextRegion}</p>
					<p className="text-xs text-gray-500 mt-1">Run #{state.runCount + 1}</p>
				</div>

				<div className="flex items-center justify-between text-sm mb-3">
					<span className="text-gray-300">Warp cost:</span>
					<span className={cn('font-mono font-bold', canWarp ? 'text-yellow-400' : 'text-red-400')}>
						{WARP_ENERGY_COST} ⚡
					</span>
				</div>

				<button
					onClick={onWarp}
					disabled={!canWarp}
					className={cn(
						'w-full py-3 rounded-lg font-semibold text-sm transition-colors',
						canWarp
							? 'bg-indigo-600 hover:bg-indigo-500 text-white'
							: 'bg-gray-700 text-gray-500 cursor-not-allowed',
					)}
				>
					{canWarp ? '🚀 Engage Warp Drive' : `⚡ Need ${WARP_ENERGY_COST} energy to warp`}
				</button>
			</div>

			<div className="bg-gray-800 rounded-lg p-3 text-xs text-gray-400">
				<p className="font-semibold text-gray-300 mb-1">💡 Tips</p>
				<ul className="list-disc list-inside space-y-1">
					<li>Asteroid Fields yield minerals 🪨</li>
					<li>Nebulae yield science 🔬</li>
					<li>Ancient Relics contain massive science troves 💎</li>
					<li>Threat Zones damage your fleet ☠️ — ensure your hull is strong</li>
					<li>Return to Hub before your fleet is destroyed</li>
				</ul>
			</div>
		</div>
	)
}
