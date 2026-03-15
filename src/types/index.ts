import type { LazyExoticComponent, ReactElement } from 'react'

export interface GameProps {
	width: number
	height: number
}

export interface GameEntry {
	id: string
	title: string
	description: string
	thumbnail?: string
	component: LazyExoticComponent<(props: GameProps) => ReactElement>
}
