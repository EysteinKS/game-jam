import type { Resources } from '../types'
import { cn } from '@/lib/utils'

interface ResourceBarProps {
	resources: Resources
	maxResources: Resources
}

export function ResourceBar({ resources, maxResources }: ResourceBarProps) {
	return (
		<div className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-2 bg-gray-800 rounded-lg text-sm">
			<ResourceItem
				icon="⚡"
				value={resources.energy}
				max={maxResources.energy}
				color="text-yellow-400"
			/>
			<ResourceItem
				icon="🪨"
				value={resources.minerals}
				max={maxResources.minerals}
				color="text-teal-400"
			/>
			<ResourceItem
				icon="🔬"
				value={resources.science}
				max={maxResources.science}
				color="text-purple-400"
			/>
			<ResourceItem
				icon="👤"
				value={resources.crew}
				max={maxResources.crew}
				color="text-green-400"
			/>
		</div>
	)
}

interface ResourceItemProps {
	icon: string
	value: number
	max: number
	color: string
}

function ResourceItem({ icon, value, max, color }: ResourceItemProps) {
	const pct = Math.round((value / max) * 100)
	const barColor = pct > 60 ? 'bg-current' : pct > 30 ? 'bg-yellow-500' : 'bg-red-500'

	return (
		<div className="flex items-center gap-1.5 min-w-0">
			<span className="shrink-0">{icon}</span>
			<span className={cn('font-mono shrink-0', color)}>
				{value}/{max}
			</span>
			<div className="flex-1 h-1.5 bg-gray-600 rounded-full overflow-hidden min-w-0">
				<div
					className={cn('h-full rounded-full transition-all', color, barColor)}
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	)
}
