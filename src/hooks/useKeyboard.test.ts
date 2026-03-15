import { renderHook, act } from '@testing-library/react'
import { useKeyboard } from './useKeyboard'

describe('useKeyboard', () => {
	it('tracks pressed keys', () => {
		const { result } = renderHook(() => useKeyboard())

		act(() => {
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
		})

		expect(result.current.isKeyDown('ArrowLeft')).toBe(true)
		expect(result.current.isKeyDown('ArrowRight')).toBe(false)
	})

	it('removes keys on keyup', () => {
		const { result } = renderHook(() => useKeyboard())

		act(() => {
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
		})
		act(() => {
			window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }))
		})

		expect(result.current.isKeyDown('ArrowLeft')).toBe(false)
	})

	it('tracks multiple keys simultaneously', () => {
		const { result } = renderHook(() => useKeyboard())

		act(() => {
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
		})

		expect(result.current.isKeyDown('ArrowLeft')).toBe(true)
		expect(result.current.isKeyDown('ArrowRight')).toBe(true)
	})

	it('cleans up listeners on unmount', () => {
		const removeSpy = vi.spyOn(window, 'removeEventListener')
		const { unmount } = renderHook(() => useKeyboard())

		unmount()

		expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
		expect(removeSpy).toHaveBeenCalledWith('keyup', expect.any(Function))
	})
})
