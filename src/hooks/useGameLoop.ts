import { useEffect, useRef, useCallback } from 'react'

export interface GameLoopState {
	fps: number
	isPaused: boolean
}

export interface UseGameLoopOptions {
	onUpdate: (deltaTime: number) => void
	targetFps?: number
	autoStart?: boolean
}

export function useGameLoop({ onUpdate, autoStart = true }: UseGameLoopOptions) {
	const rafRef = useRef<number>(0)
	const lastTimeRef = useRef<number>(0)
	const isPausedRef = useRef<boolean>(!autoStart)
	const fpsRef = useRef<number>(0)
	const frameCountRef = useRef<number>(0)
	const fpsTimerRef = useRef<number>(0)
	const onUpdateRef = useRef(onUpdate)

	onUpdateRef.current = onUpdate

	const loop = useCallback((timestamp: number) => {
		if (isPausedRef.current) return

		if (lastTimeRef.current === 0) {
			lastTimeRef.current = timestamp
		}

		const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1)
		lastTimeRef.current = timestamp

		frameCountRef.current++
		fpsTimerRef.current += deltaTime
		if (fpsTimerRef.current >= 1) {
			fpsRef.current = frameCountRef.current
			frameCountRef.current = 0
			fpsTimerRef.current = 0
		}

		onUpdateRef.current(deltaTime)

		rafRef.current = requestAnimationFrame(loop)
	}, [])

	const pause = useCallback(() => {
		isPausedRef.current = true
		lastTimeRef.current = 0
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current)
			rafRef.current = 0
		}
	}, [])

	const resume = useCallback(() => {
		if (!isPausedRef.current) return
		isPausedRef.current = false
		rafRef.current = requestAnimationFrame(loop)
	}, [loop])

	const getFps = useCallback(() => fpsRef.current, [])

	useEffect(() => {
		if (autoStart) {
			rafRef.current = requestAnimationFrame(loop)
		}
		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current)
			}
		}
	}, [loop, autoStart])

	return { pause, resume, getFps }
}
