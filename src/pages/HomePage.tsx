import games from '@/lib/game-registry'
import GameCard from '@/components/GameCard'

export default function HomePage() {
	return (
		<div>
			<h1 className="text-3xl font-bold mb-8">Games</h1>
			{games.length === 0 ? (
				<div className="text-center py-16 text-muted-foreground">
					<p className="text-lg">No games yet.</p>
					<p className="mt-2 text-sm">
						Use the <code className="font-mono">/add-game</code> skill to add your first game.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{games.map((game) => (
						<GameCard key={game.id} game={game} />
					))}
				</div>
			)}
		</div>
	)
}
