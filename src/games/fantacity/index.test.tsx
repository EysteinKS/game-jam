import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Fantacity from './index'

describe('Fantacity', () => {
	it('renders without crashing', () => {
		const { container } = render(
			<MemoryRouter>
				<Fantacity width={800} height={600} />
			</MemoryRouter>,
		)
		expect(container).toBeTruthy()
	})

	it('shows the resource bar', () => {
		const { getByText } = render(
			<MemoryRouter>
				<Fantacity width={800} height={600} />
			</MemoryRouter>,
		)
		expect(getByText('Gold:')).toBeTruthy()
		expect(getByText('Food:')).toBeTruthy()
	})

	it('shows the HQ title', () => {
		const { getByText } = render(
			<MemoryRouter>
				<Fantacity width={800} height={600} />
			</MemoryRouter>,
		)
		expect(getByText('⚔️ Fantacity')).toBeTruthy()
	})
})
