import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Autocomplete } from './Autocomplete';
import type { AutocompleteOption } from './Autocomplete';

const fruits: AutocompleteOption[] = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Apricot', value: 'apricot' },
	{ label: 'Avocado', value: 'avocado' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Blueberry', value: 'blueberry' },
	{ label: 'Cherry', value: 'cherry' },
	{ label: 'Coconut', value: 'coconut' },
	{ label: 'Grape', value: 'grape' },
	{ label: 'Kiwi', value: 'kiwi' },
	{ label: 'Lemon', value: 'lemon' },
	{ label: 'Mango', value: 'mango' },
	{ label: 'Orange', value: 'orange' },
	{ label: 'Peach', value: 'peach' },
	{ label: 'Pear', value: 'pear' },
	{ label: 'Pineapple', value: 'pineapple' },
	{ label: 'Strawberry', value: 'strawberry' },
	{ label: 'Watermelon', value: 'watermelon' },
];

const meta: Meta<typeof Autocomplete<AutocompleteOption>> = {
	title: 'NCIDS/Autocomplete',
	component: Autocomplete,
	tags: ['autodocs'],
	argTypes: {
		debounceDelay: {
			control: { type: 'number', min: 0, max: 1000, step: 50 },
			description: 'Debounce delay in milliseconds',
		},
		disabled: { control: 'boolean' },
		noOptionsMessage: { control: 'text' },
		loadingMessage: { control: 'text' },
		placeholder: { control: 'text' },
	},
};

export default meta;
type Story = StoryObj<typeof Autocomplete<AutocompleteOption>>;

/** Basic usage with a synchronous list of options. */
export const Default: Story = {
	args: {
		id: 'fruit-autocomplete',
		label: 'Fruit',
		options: fruits,
		placeholder: 'Type to search…',
		onChange: fn(),
	},
};

/** Asynchronous data loading with a simulated 400 ms network delay. */
export const AsyncLoadOptions: Story = {
	args: {
		id: 'fruit-async',
		label: 'Fruit (async)',
		placeholder: 'Type to search…',
		debounceDelay: 300,
		loadOptions: (query: string) =>
			new Promise((resolve) =>
				setTimeout(
					() =>
						resolve(
							fruits.filter((f) =>
								f.label.toLowerCase().includes(query.toLowerCase())
							)
						),
					400
				)
			),
		onChange: fn(),
	},
};

/** Customise the message when no option matches the search query. */
export const CustomNoOptionsMessage: Story = {
	args: {
		id: 'fruit-no-opts',
		label: 'Fruit',
		options: fruits,
		placeholder: 'Try "xyz"…',
		noOptionsMessage: 'No matching fruit — try something else.',
		onChange: fn(),
	},
};

/** Custom option renderer that adds an emoji prefix. */
export const CustomRenderOption: Story = {
	args: {
		id: 'fruit-custom',
		label: 'Fruit',
		options: fruits,
		renderOption: (opt: AutocompleteOption, isHighlighted: boolean) => (
			<span style={{ fontWeight: isHighlighted ? 'bold' : 'normal' }}>
				🍓 {opt.label}
			</span>
		),
		onChange: fn(),
	},
};

/** Disabled state. */
export const Disabled: Story = {
	args: {
		id: 'fruit-disabled',
		label: 'Fruit',
		options: fruits,
		value: { label: 'Apple', value: 'apple' },
		disabled: true,
		onChange: fn(),
	},
};

/** Controlled component — the parent manages the selected value. */
const ControlledTemplate = (args: React.ComponentProps<typeof Autocomplete<AutocompleteOption>>) => {
	const [value, setValue] = useState<AutocompleteOption | null>(null);
	return (
		<div>
			<Autocomplete
				{...args}
				value={value}
				onChange={(opt) => setValue(opt)}
			/>
			<p style={{ marginTop: '1rem' }}>
				Selected:{' '}
				<strong>{value ? `${value.label} (${value.value})` : 'none'}</strong>
			</p>
		</div>
	);
};

export const Controlled: Story = {
	render: (args) => <ControlledTemplate {...args} />,
	args: {
		id: 'fruit-controlled',
		label: 'Fruit',
		options: fruits,
		placeholder: 'Pick a fruit…',
	},
};

interface Country {
	name: string;
	code: string;
}

const countries: Country[] = [
	{ name: 'United States', code: 'us' },
	{ name: 'United Kingdom', code: 'uk' },
	{ name: 'Canada', code: 'ca' },
	{ name: 'Australia', code: 'au' },
	{ name: 'Germany', code: 'de' },
	{ name: 'France', code: 'fr' },
	{ name: 'Japan', code: 'jp' },
];

const CustomOptionShapeTemplate = () => {
	const [value, setValue] = useState<Country | null>(null);
	return (
		<div>
			<Autocomplete<Country>
				id="country"
				label="Country"
				options={countries}
				getOptionLabel={(c) => c.name}
				getOptionValue={(c) => c.code}
				placeholder="Search countries…"
				value={value}
				onChange={(c) => setValue(c)}
			/>
			{value && (
				<p style={{ marginTop: '1rem' }}>
					Selected: <strong>{value.name}</strong> ({value.code})
				</p>
			)}
		</div>
	);
};

/** Using generic options with custom getOptionLabel / getOptionValue. */
export const CustomOptionShape: Story = {
	render: () => <CustomOptionShapeTemplate />,
	args: {},
};
