import { useEffect, useRef, useCallback } from 'react'

export function useKeyboard() {
	const keysRef = useRef<Set<string>>(new Set())

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			keysRef.current.add(e.key)
		}

		const handleKeyUp = (e: KeyboardEvent) => {
			keysRef.current.delete(e.key)
		}

		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	}, [])

	const isKeyDown = useCallback((key: string): boolean => {
		return keysRef.current.has(key)
	}, [])

	return { isKeyDown }
}
