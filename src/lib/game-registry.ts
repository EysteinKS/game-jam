import { lazy } from 'react'
import type { GameEntry } from '@/types'

const games: GameEntry[] = [
	{
		id: 'bouncing-ball',
		title: 'Bouncing Ball',
		description: 'A classic breakout-style paddle game. Use arrow keys to move the paddle.',
		component: lazy(() => import('@/games/bouncing-ball/index')),
	},
]

export function getGame(id: string): GameEntry | undefined {
	return games.find((game) => game.id === id)
}

export default games
