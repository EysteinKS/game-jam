import { useRef, useEffect } from 'react'

export function useCanvas(width: number, height: number) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		canvas.width = width
		canvas.height = height
	}, [width, height])

	const getContext = (): CanvasRenderingContext2D | null => {
		return canvasRef.current?.getContext('2d') ?? null
	}

	return { canvasRef, getContext }
}
