import React, { useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

describe('<Radio />', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render a radio input with USWDS classes', () => {
		const { container } = render(
			<Radio id="r1" name="test" value="a" label="Option A" />
		);
		expect(container.firstChild).toHaveClass('usa-radio');
		const input = screen.getByRole('radio', { name: 'Option A' });
		expect(input).toHaveClass('usa-radio__input');
		expect(input).not.toHaveClass('usa-radio__input--tile');
		expect(input).toHaveAttribute('type', 'radio');
		expect(input).toHaveAttribute('value', 'a');
		expect(container.querySelector('label')).toHaveClass('usa-radio__label');
	});

	it('should associate the label with the input', () => {
		render(<Radio id="r1" name="test" value="a" label="Option A" />);
		expect(screen.getByLabelText('Option A')).toHaveAttribute('id', 'r1');
	});

	it('should render the tile variant', () => {
		render(<Radio id="r1" name="test" value="a" label="Option A" tile />);
		expect(screen.getByRole('radio')).toHaveClass('usa-radio__input--tile');
	});

	it('should render a description', () => {
		const { container } = render(
			<Radio
				id="r1"
				name="test"
				value="a"
				label="Option A"
				description="More detail"
				tile
			/>
		);
		const description = container.querySelector(
			'.usa-radio__label-description'
		);
		expect(description).toHaveTextContent('More detail');
	});

	it('should merge additional className on the wrapper', () => {
		const { container } = render(
			<Radio id="r1" name="test" value="a" label="A" className="custom" />
		);
		expect(container.firstChild).toHaveClass('usa-radio');
		expect(container.firstChild).toHaveClass('custom');
	});

	it('should forward standard input props when standalone', () => {
		render(
			<Radio
				id="r1"
				name="standalone"
				value="a"
				label="A"
				disabled
				required
				defaultChecked
			/>
		);
		const input = screen.getByRole('radio');
		expect(input).toHaveAttribute('name', 'standalone');
		expect(input).toBeDisabled();
		expect(input).toBeRequired();
		expect(input).toBeChecked();
	});

	it('should call onChange when selected standalone', async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<Radio id="r1" name="test" value="a" label="A" onChange={handleChange} />
		);
		await user.click(screen.getByLabelText('A'));
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(screen.getByRole('radio')).toBeChecked();
	});

	it('should have no accessibility violations', async () => {
		const { container } = render(
			<Radio id="r1" name="test" value="a" label="Option A" />
		);
		expect(await axe(container)).toHaveNoViolations();
	});
});

describe('<RadioGroup />', () => {
	afterEach(() => {
		cleanup();
	});

	const renderGroup = (
		props: Partial<React.ComponentProps<typeof RadioGroup>> = {}
	) =>
		render(
			<RadioGroup name="color" legend="Pick a color" {...props}>
				<Radio id="color-red" value="red" label="Red" />
				<Radio id="color-green" value="green" label="Green" />
				<Radio id="color-blue" value="blue" label="Blue" />
			</RadioGroup>
		);

	it('should render a fieldset with a legend', () => {
		const { container } = renderGroup();
		const fieldset = screen.getByRole('group', { name: 'Pick a color' });
		expect(fieldset.tagName).toBe('FIELDSET');
		expect(fieldset).toHaveClass('usa-fieldset');
		expect(container.querySelector('legend')).toHaveClass('usa-legend');
		expect(container.firstChild).toHaveClass('usa-form-group');
		expect(container.firstChild).not.toHaveClass('usa-form-group--error');
	});

	it('should apply the shared name to every radio', () => {
		renderGroup();
		screen.getAllByRole('radio').forEach((radio) => {
			expect(radio).toHaveAttribute('name', 'color');
		});
	});

	it('should visually hide the legend when legendSrOnly is set', () => {
		const { container } = renderGroup({ legendSrOnly: true });
		expect(container.querySelector('legend')).toHaveClass('usa-sr-only');
	});

	it('should manage selection when uncontrolled', async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		renderGroup({ defaultValue: 'red', onChange: handleChange });

		expect(screen.getByLabelText('Red')).toBeChecked();

		await user.click(screen.getByLabelText('Blue'));
		expect(screen.getByLabelText('Blue')).toBeChecked();
		expect(screen.getByLabelText('Red')).not.toBeChecked();
		expect(handleChange).toHaveBeenCalledWith('blue', expect.anything());
	});

	it('should reflect the value prop when controlled', async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		renderGroup({ value: 'green', onChange: handleChange });

		expect(screen.getByLabelText('Green')).toBeChecked();

		await user.click(screen.getByLabelText('Blue'));
		expect(handleChange).toHaveBeenCalledWith('blue', expect.anything());
		// Parent did not update value, so selection stays put.
		expect(screen.getByLabelText('Green')).toBeChecked();
		expect(screen.getByLabelText('Blue')).not.toBeChecked();
	});

	it('should update when a controlling parent changes value', async () => {
		const user = userEvent.setup();
		const Controlled = () => {
			const [value, setValue] = useState('red');
			return (
				<>
					<RadioGroup
						name="color"
						legend="Pick a color"
						value={value}
						onChange={setValue}
					>
						<Radio id="color-red" value="red" label="Red" />
						<Radio id="color-blue" value="blue" label="Blue" />
					</RadioGroup>
					<output>{value}</output>
				</>
			);
		};
		render(<Controlled />);

		await user.click(screen.getByLabelText('Blue'));
		expect(screen.getByLabelText('Blue')).toBeChecked();
		expect(screen.getByRole('status')).toHaveTextContent('blue');
	});

	it('should call a child radio onChange alongside the group onChange', async () => {
		const user = userEvent.setup();
		const groupChange = vi.fn();
		const radioChange = vi.fn();
		render(
			<RadioGroup name="g" legend="Group" onChange={groupChange}>
				<Radio id="g-a" value="a" label="A" onChange={radioChange} />
			</RadioGroup>
		);
		await user.click(screen.getByLabelText('A'));
		expect(groupChange).toHaveBeenCalledTimes(1);
		expect(radioChange).toHaveBeenCalledTimes(1);
	});

	it('should apply the tile variant to every radio', () => {
		renderGroup({ tile: true });
		screen.getAllByRole('radio').forEach((radio) => {
			expect(radio).toHaveClass('usa-radio__input--tile');
		});
	});

	it('should let an individual radio override the group tile setting', () => {
		render(
			<RadioGroup name="g" legend="Group" tile>
				<Radio id="g-a" value="a" label="A" />
				<Radio id="g-b" value="b" label="B" tile={false} />
			</RadioGroup>
		);
		expect(screen.getByLabelText('A')).toHaveClass('usa-radio__input--tile');
		expect(screen.getByLabelText('B')).not.toHaveClass(
			'usa-radio__input--tile'
		);
	});

	it('should render an error state with message', () => {
		const { container } = renderGroup({
			errorMessage: 'Please select a color',
		});
		expect(container.firstChild).toHaveClass('usa-form-group--error');

		const message = screen.getByRole('alert');
		expect(message).toHaveClass('usa-error-message');
		expect(message).toHaveTextContent('Please select a color');
		expect(message).toHaveAttribute('id', 'color-error');
		expect(screen.getByRole('group')).toHaveAttribute(
			'aria-describedby',
			'color-error'
		);
	});

	it('should render hint text and reference it from the fieldset', () => {
		renderGroup({ hint: 'Choose one', errorMessage: 'Required', id: 'fav' });
		const fieldset = screen.getByRole('group');
		expect(fieldset).toHaveAttribute('id', 'fav');
		expect(fieldset).toHaveAttribute('aria-describedby', 'fav-hint fav-error');
		expect(screen.getByText('Choose one')).toHaveClass('usa-hint');
	});

	it('should not set aria-describedby without a hint or error', () => {
		renderGroup();
		expect(screen.getByRole('group')).not.toHaveAttribute('aria-describedby');
	});

	it('should mark every radio as required and show the indicator', () => {
		const { container } = renderGroup({ required: true });
		screen.getAllByRole('radio').forEach((radio) => {
			expect(radio).toBeRequired();
		});
		expect(container.querySelector('abbr.usa-hint--required')).toHaveAttribute(
			'title',
			'required'
		);
	});

	it('should disable every radio in the group', () => {
		renderGroup({ disabled: true });
		screen.getAllByRole('radio').forEach((radio) => {
			expect(radio).toBeDisabled();
		});
	});

	it('should let an individual radio be disabled', () => {
		render(
			<RadioGroup name="g" legend="Group">
				<Radio id="g-a" value="a" label="A" />
				<Radio id="g-b" value="b" label="B" disabled />
			</RadioGroup>
		);
		expect(screen.getByLabelText('A')).toBeEnabled();
		expect(screen.getByLabelText('B')).toBeDisabled();
	});

	it('should merge additional className on the wrapper', () => {
		const { container } = renderGroup({ className: 'custom' });
		expect(container.firstChild).toHaveClass('usa-form-group');
		expect(container.firstChild).toHaveClass('custom');
	});

	it('should have no accessibility violations', async () => {
		const { container } = renderGroup({ hint: 'Choose one' });
		expect(await axe(container)).toHaveNoViolations();
	});

	it('should have no accessibility violations in the error state', async () => {
		const { container } = renderGroup({
			errorMessage: 'Please select a color',
			required: true,
		});
		expect(await axe(container)).toHaveNoViolations();
	});

	it('should have no accessibility violations as tiles', async () => {
		const { container } = render(
			<RadioGroup name="t" legend="Tiles" tile>
				<Radio id="t-a" value="a" label="A" description="About A" />
				<Radio id="t-b" value="b" label="B" description="About B" />
			</RadioGroup>
		);
		expect(await axe(container)).toHaveNoViolations();
	});
});
