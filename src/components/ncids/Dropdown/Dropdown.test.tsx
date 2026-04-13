import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { Dropdown } from './Dropdown';

describe('<Dropdown />', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render options', () => {
		render(
			<Dropdown
				id="test"
				name="test"
				ariaLabel="Select option"
				options={[
					{ label: '20', value: 20 },
					{ label: '30', value: 30 },
					{ label: '50', value: 50 },
					{ label: '100', value: 100 },
				]}
			/>
		);

		expect(screen.getByRole('option', { name: '20' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: '30' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: '50' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: '100' })).toBeInTheDocument();
	});

	it('should render a select with usa-select class', () => {
		const { container } = render(
			<Dropdown
				id="test"
				name="test"
				ariaLabel="Select option"
				options={[
					{ label: '20', value: '20' },
					{ label: '30', value: '30' },
				]}
			/>
		);
		const select = container.querySelector('select');
		expect(select).toHaveClass('usa-select');
	});

	it('should call onChange when selection changes', async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(
			<Dropdown
				id="test"
				name="test"
				onChange={handleChange}
				ariaLabel="Select option"
				options={[
					{ label: 'Twenty', value: 20 },
					{ label: 'Thirty', value: 30 },
				]}
			/>
		);

		const select = screen.getByRole('combobox');
		await user.selectOptions(select, '20');

		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('should have no accessibility violations', async () => {
		const handleChange = vi.fn();
		const { container } = render(
			<Dropdown
				id="test"
				name="test"
				ariaLabel="Select option"
				onChange={handleChange}
				options={[
					{ label: 'Twenty', value: 20 },
					{ label: 'Thirty', value: 30 },
				]}
			/>
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});
