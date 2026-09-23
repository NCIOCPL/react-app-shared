import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
	title: 'NCIDS/Radio',
	component: RadioGroup,
	subcomponents: { Radio } as Record<string, React.ComponentType<unknown>>,
	tags: ['autodocs'],
	argTypes: {
		legend: { control: 'text' },
		legendSrOnly: { control: 'boolean' },
		hint: { control: 'text' },
		tile: { control: 'boolean' },
		errorMessage: { control: 'text' },
		required: { control: 'boolean' },
		disabled: { control: 'boolean' },
		className: {
			control: 'text',
			description: 'Additional CSS classes on the usa-form-group wrapper',
		},
	},
	args: {
		name: 'historical-figures',
		legend: 'Select one historical figure',
		onChange: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const figures = (
	<>
		<Radio
			id="historical-truth"
			value="sojourner-truth"
			label="Sojourner Truth"
		/>
		<Radio
			id="historical-douglass"
			value="frederick-douglass"
			label="Frederick Douglass"
		/>
		<Radio
			id="historical-washington"
			value="booker-t-washington"
			label="Booker T. Washington"
		/>
		<Radio
			id="historical-carver"
			value="george-washington-carver"
			label="George Washington Carver"
			disabled
		/>
	</>
);

export const Default: Story = {
	args: {
		defaultValue: 'sojourner-truth',
		children: figures,
	},
};

export const WithHint: Story = {
	args: {
		hint: 'Choose the figure you would like to learn more about.',
		children: figures,
	},
};

export const Tile: Story = {
	args: {
		tile: true,
		children: (
			<>
				<Radio
					id="tile-truth"
					value="sojourner-truth"
					label="Sojourner Truth"
					description="This is optional text that can be used to describe the label in more detail."
				/>
				<Radio
					id="tile-douglass"
					value="frederick-douglass"
					label="Frederick Douglass"
				/>
				<Radio
					id="tile-washington"
					value="booker-t-washington"
					label="Booker T. Washington"
				/>
				<Radio
					id="tile-carver"
					value="george-washington-carver"
					label="George Washington Carver"
					disabled
				/>
			</>
		),
	},
};

export const ErrorState: Story = {
	args: {
		required: true,
		errorMessage: 'Please select a historical figure.',
		children: figures,
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		defaultValue: 'frederick-douglass',
		children: figures,
	},
};

const ControlledExample = () => {
	const [value, setValue] = useState('frederick-douglass');
	return (
		<>
			<RadioGroup
				name="controlled-figures"
				legend="Select one historical figure"
				value={value}
				onChange={setValue}
			>
				<Radio
					id="controlled-truth"
					value="sojourner-truth"
					label="Sojourner Truth"
				/>
				<Radio
					id="controlled-douglass"
					value="frederick-douglass"
					label="Frederick Douglass"
				/>
				<Radio
					id="controlled-washington"
					value="booker-t-washington"
					label="Booker T. Washington"
				/>
			</RadioGroup>
			<p>
				Selected: <strong>{value}</strong>
			</p>
		</>
	);
};

export const Controlled: Story = {
	render: () => <ControlledExample />,
};
