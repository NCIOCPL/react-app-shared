import React, { useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
	title: 'NCIDS/Radio',
	component: RadioGroup,
	subcomponents: { Radio } as Record<string, React.ComponentType<unknown>>,
	tags: ['autodocs'],
	// Render each story inside a usa-form, as in NCIDS usage. The form also
	// scopes native radio grouping to the story on the Docs page.
	decorators: [
		(Story) => (
			<form className="usa-form" onSubmit={(e) => e.preventDefault()}>
				<Story />
			</form>
		),
	],
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
		// Setting `value` from the controls panel would make the group
		// controlled with a no-op onChange, so clicks would stop selecting.
		value: { control: false },
		defaultValue: { control: false },
		name: { control: false },
		children: { control: false },
	},
	args: {
		legend: 'Select one historical figure',
		onChange: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

/**
 * Radio options for a story. Autodocs renders every story (and the primary
 * story twice) on one Docs page, so each rendered copy needs unique ids;
 * duplicate ids would point labels at the radios of another story.
 */
const Figures = ({
	prefix,
	description = false,
}: {
	prefix: string;
	description?: boolean;
}) => {
	const id = `${prefix}-${useId().replace(/:/g, '')}`;
	return (
		<>
			<Radio
				id={`${id}-truth`}
				value="sojourner-truth"
				label="Sojourner Truth"
				description={
					description
						? 'This is optional text that can be used to describe the label in more detail.'
						: undefined
				}
			/>
			<Radio
				id={`${id}-douglass`}
				value="frederick-douglass"
				label="Frederick Douglass"
			/>
			<Radio
				id={`${id}-washington`}
				value="booker-t-washington"
				label="Booker T. Washington"
			/>
			<Radio
				id={`${id}-carver`}
				value="george-washington-carver"
				label="George Washington Carver"
			/>
		</>
	);
};

export const Default: Story = {
	args: {
		name: 'default-figures',
		defaultValue: 'sojourner-truth',
		children: <Figures prefix="default" />,
	},
};

export const WithHint: Story = {
	args: {
		name: 'hint-figures',
		hint: 'Choose the figure you would like to learn more about.',
		children: <Figures prefix="hint" />,
	},
};

export const Tile: Story = {
	args: {
		name: 'tile-figures',
		tile: true,
		children: <Figures prefix="tile" description />,
	},
};

export const ErrorState: Story = {
	args: {
		name: 'error-figures',
		required: true,
		errorMessage: 'Please select a historical figure.',
		children: <Figures prefix="error" />,
	},
};

export const Disabled: Story = {
	args: {
		name: 'disabled-figures',
		disabled: true,
		defaultValue: 'frederick-douglass',
		children: <Figures prefix="disabled" />,
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
	parameters: {
		// The example owns its state, so args/controls do not apply.
		controls: { disable: true },
	},
};
