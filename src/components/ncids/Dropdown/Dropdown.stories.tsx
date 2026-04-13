import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';

import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
	title: 'NCIDS/Dropdown',
	component: Dropdown,
	tags: ['autodocs'],
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS classes on the list',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
	args: {
		id: 'default-dropdown',
		name: 'default-dropdown',
		options: [
			{ label: '20', value: 20 },
			{ label: '50', value: 50 },
			{ label: '100', value: 100 },
		],
		onChange: fn(),
	},
};

export const WithResultsPerPageText: Story = {
	name: 'With Results Per Page Text',
	render: (args) => {
		return (
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<span>Show</span>
				<Dropdown {...args} style={{ width: '70px' }} />
				<span>results per page</span>
			</div>
		);
	},
	args: {
		id: 'results-per-page',
		name: 'results-per-page',
		ariaLabel: 'Select option',
		options: [
			{ label: '20', value: 20 },
			{ label: '50', value: 50 },
			{ label: '100', value: 100 },
		],
		onChange: fn(),
	},
};
