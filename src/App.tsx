import { BrowserRouter, Routes, Route, Link } from 'react-router'
import HomePage from '@/pages/HomePage'
import GamePage from '@/pages/GamePage'

export default function App() {
	return (
		<BrowserRouter basename={import.meta.env.BASE_URL}>
			<div className="min-h-screen bg-background text-foreground">
				<header className="border-b border-border px-6 py-4">
					<Link to="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
						Game Jam Prototypes
					</Link>
				</header>
				<main className="px-6 py-8">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/games/:gameId" element={<GamePage />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	)
}
