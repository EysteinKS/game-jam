import { lazy } from 'react'
import type { GameEntry } from '@/types'

const games: GameEntry[] = [
	{
		id: 'bouncing-ball',
		title: 'Bouncing Ball',
		description: 'A classic breakout-style paddle game. Use arrow keys to move the paddle.',
		component: lazy(() => import('@/games/bouncing-ball/index')),
	},
	{
		id: 'fantacity',
		title: 'Fantacity',
		description:
			'Medieval-fantasy RTS. Manage your base, assign workers, build armies and conquer the overworld — no unit micro required.',
		component: lazy(() => import('@/games/fantacity/index')),
	},
]

export function getGame(id: string): GameEntry | undefined {
	return games.find((game) => game.id === id)
}

export default games
