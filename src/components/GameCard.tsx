import { Link } from 'react-router'
import type { GameEntry } from '@/types'
import { cn } from '@/lib/utils'

interface GameCardProps {
	game: GameEntry
	className?: string
}

export default function GameCard({ game, className }: GameCardProps) {
	return (
		<Link
			to={`/games/${game.id}`}
			className={cn(
				'block rounded-lg border border-border bg-card text-card-foreground p-6',
				'hover:border-primary/50 hover:shadow-md transition-all duration-200',
				className,
			)}
		>
			{game.thumbnail && (
				<div className="aspect-video bg-muted rounded mb-4 overflow-hidden">
					<img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
				</div>
			)}
			{!game.thumbnail && (
				<div className="aspect-video bg-muted rounded mb-4 flex items-center justify-center">
					<span className="text-4xl">🎮</span>
				</div>
			)}
			<h2 className="text-lg font-semibold mb-1">{game.title}</h2>
			<p className="text-sm text-muted-foreground line-clamp-2">{game.description}</p>
		</Link>
	)
}
