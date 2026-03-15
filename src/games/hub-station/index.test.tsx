import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import HubStation from './index'

describe('HubStation', () => {
	it('renders without crashing', () => {
		const { container } = render(<HubStation width={600} height={700} />)
		expect(container).toBeTruthy()
	})

	it('shows the Hub Station title', () => {
		const { getAllByText } = render(<HubStation width={600} height={700} />)
		// Title appears in the heading (and possibly in log), so check at least one exists
		expect(getAllByText(/Hub Station/i).length).toBeGreaterThan(0)
	})

	it('shows resource bars', () => {
		const { getAllByText } = render(<HubStation width={600} height={700} />)
		// Resource bar shows energy, minerals, science, crew icons
		expect(getAllByText('⚡').length).toBeGreaterThan(0)
		expect(getAllByText('🪨').length).toBeGreaterThan(0)
		expect(getAllByText('🔬').length).toBeGreaterThan(0)
		expect(getAllByText('👤').length).toBeGreaterThan(0)
	})

	it('shows hub navigation tabs', () => {
		const { getByText } = render(<HubStation width={600} height={700} />)
		expect(getByText(/Overview/i)).toBeTruthy()
		expect(getByText(/Research/i)).toBeTruthy()
		expect(getByText(/Warp/i)).toBeTruthy()
	})

	it('shows fleet status on overview tab', () => {
		const { getByText } = render(<HubStation width={600} height={700} />)
		expect(getByText(/Fleet/i)).toBeTruthy()
		expect(getByText('Pioneer I')).toBeTruthy()
	})

	it('can switch to the Research tab', () => {
		const { getByText } = render(<HubStation width={600} height={700} />)
		fireEvent.click(getByText(/Research/i))
		expect(getByText('Advanced Hull Plating')).toBeTruthy()
	})

	it('can switch to the Warp tab', () => {
		const { getByText } = render(<HubStation width={600} height={700} />)
		fireEvent.click(getByText(/Warp/i))
		expect(getByText(/Engage Warp Drive/i)).toBeTruthy()
	})

	it('shows shield integrity on hub view', () => {
		const { getByText } = render(<HubStation width={600} height={700} />)
		expect(getByText(/Hub Shield/i)).toBeTruthy()
		expect(getByText('100%')).toBeTruthy()
	})

	it('can warp to a region', () => {
		const { getByText } = render(<HubStation width={600} height={700} />)
		fireEvent.click(getByText(/Warp/i))
		const warpButton = getByText(/Engage Warp Drive/i)
		fireEvent.click(warpButton)
		// After warp, should see region view
		expect(getByText(/Map/i)).toBeTruthy()
		expect(getByText(/Return to Hub/i)).toBeTruthy()
	})

	it('shows tiles in region map', () => {
		const { getByText } = render(<HubStation width={600} height={700} />)
		fireEvent.click(getByText(/Warp/i))
		fireEvent.click(getByText(/Engage Warp Drive/i))
		// The map should have some tiles (center entry point visible)
		expect(getByText(/turns left/i)).toBeTruthy()
	})

	it('can return to hub from region', () => {
		const { getByText } = render(<HubStation width={600} height={700} />)
		fireEvent.click(getByText(/Warp/i))
		fireEvent.click(getByText(/Engage Warp Drive/i))
		fireEvent.click(getByText(/Return to Hub/i))
		// Should be back at hub
		expect(getByText(/Hub Shield/i)).toBeTruthy()
	})
})
