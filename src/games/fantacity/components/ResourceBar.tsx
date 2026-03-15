import type { Resources } from '../types'
import { RESOURCE_KEYS, RESOURCE_LABELS, RESOURCE_ICONS } from '../constants'

interface ResourceBarProps {
	resources: Resources
	caps: Resources
}

export function ResourceBar({ resources, caps }: ResourceBarProps) {
	return (
		<div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card px-4 py-2">
			{RESOURCE_KEYS.map((key) => (
				<div key={key} className="flex items-center gap-1 text-sm min-w-[90px]">
					<span>{RESOURCE_ICONS[key]}</span>
					<span className="text-muted-foreground">{RESOURCE_LABELS[key]}:</span>
					<span className="font-semibold tabular-nums">{Math.floor(resources[key])}</span>
					<span className="text-muted-foreground text-xs">/{caps[key]}</span>
				</div>
			))}
		</div>
	)
}
