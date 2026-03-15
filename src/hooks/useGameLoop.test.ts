import { renderHook, act } from '@testing-library/react'
import { useGameLoop } from './useGameLoop'

describe('useGameLoop', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		let frameId = 0
		vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
			frameId++
			setTimeout(() => cb(performance.now()), 16)
			return frameId
		})
		vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {})
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	it('calls onUpdate when running', async () => {
		const onUpdate = vi.fn()
		renderHook(() => useGameLoop({ onUpdate }))

		await act(async () => {
			vi.advanceTimersByTime(32)
		})

		expect(onUpdate).toHaveBeenCalled()
	})

	it('stops calling onUpdate after pause', async () => {
		const onUpdate = vi.fn()
		const { result } = renderHook(() => useGameLoop({ onUpdate }))

		await act(async () => {
			vi.advanceTimersByTime(32)
		})

		const callsBefore = onUpdate.mock.calls.length
		act(() => {
			result.current.pause()
		})

		await act(async () => {
			vi.advanceTimersByTime(32)
		})

		expect(onUpdate.mock.calls.length).toBe(callsBefore)
	})

	it('resumes calling onUpdate after resume', async () => {
		const onUpdate = vi.fn()
		const { result } = renderHook(() => useGameLoop({ onUpdate, autoStart: false }))

		act(() => {
			result.current.resume()
		})

		await act(async () => {
			vi.advanceTimersByTime(32)
		})

		expect(onUpdate).toHaveBeenCalled()
	})
})
