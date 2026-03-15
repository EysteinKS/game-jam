import { Suspense } from 'react'
import { useParams, Link } from 'react-router'
import { getGame } from '@/lib/game-registry'

export default function GamePage() {
	const { gameId } = useParams<{ gameId: string }>()
	const game = gameId ? getGame(gameId) : undefined

	if (!game) {
		return (
			<div className="text-center py-16">
				<h1 className="text-2xl font-bold mb-4">Game not found</h1>
				<p className="text-muted-foreground mb-6">
					No game with id &ldquo;{gameId}&rdquo; exists in the registry.
				</p>
				<Link to="/" className="text-primary hover:underline">
					← Back to games
				</Link>
			</div>
		)
	}

	const GameComponent = game.component

	return (
		<div>
			<div className="mb-6">
				<Link
					to="/"
					className="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					← Back to games
				</Link>
			</div>
			<h1 className="text-3xl font-bold mb-2">{game.title}</h1>
			<p className="text-muted-foreground mb-8">{game.description}</p>
			<div className="flex justify-center">
				<Suspense fallback={<div className="text-muted-foreground">Loading game...</div>}>
					<GameComponent width={800} height={600} />
				</Suspense>
			</div>
		</div>
	)
}
