import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { TextInput } from './TextInput';

describe('<TextInput />', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render an input with usa-input class', () => {
		const { container } = render(
			<TextInput id="test" name="test" aria-label="Test" />
		);
		const input = container.querySelector('input');
		expect(input).toHaveClass('usa-input');
	});

	it('should default type to text', () => {
		const { container } = render(
			<TextInput id="test" name="test" aria-label="Test" />
		);
		expect(container.querySelector('input')).toHaveAttribute('type', 'text');
	});

	it.each(['text', 'email', 'password', 'tel', 'url', 'number', 'search'])(
		'should render type=%s',
		(type) => {
			const { container } = render(
				<TextInput
					id="test"
					name="test"
					aria-label="Test"
					type={type as 'text'}
				/>
			);
			expect(container.querySelector('input')).toHaveAttribute('type', type);
		}
	);

	it('should merge additional className', () => {
		const { container } = render(
			<TextInput
				id="test"
				name="test"
				aria-label="Test"
				className="usa-input--error"
			/>
		);
		const input = container.querySelector('input');
		expect(input).toHaveClass('usa-input');
		expect(input).toHaveClass('usa-input--error');
	});

	it('should forward id and name', () => {
		const { container } = render(
			<TextInput id="my-id" name="my-name" aria-label="Test" />
		);
		const input = container.querySelector('input');
		expect(input).toHaveAttribute('id', 'my-id');
		expect(input).toHaveAttribute('name', 'my-name');
	});

	it('should call onChange when user types', async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(
			<TextInput
				id="test"
				name="test"
				aria-label="Test"
				onChange={handleChange}
			/>
		);

		await user.type(screen.getByRole('textbox'), 'hello');
		expect(handleChange).toHaveBeenCalled();
	});

	it('should forward standard input props', () => {
		const { container } = render(
			<TextInput
				id="test"
				name="test"
				aria-label="Test"
				placeholder="Enter text"
				maxLength={50}
				required
				disabled
			/>
		);
		const input = container.querySelector('input');
		expect(input).toHaveAttribute('placeholder', 'Enter text');
		expect(input).toHaveAttribute('maxLength', '50');
		expect(input).toBeRequired();
		expect(input).toBeDisabled();
	});

	it('should have no accessibility violations', async () => {
		const { container } = render(
			<TextInput id="test" name="test" aria-label="Test input" />
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});
