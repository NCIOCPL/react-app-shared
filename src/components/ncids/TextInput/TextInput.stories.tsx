import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
	title: 'NCIDS/TextInput',
	component: TextInput,
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: 'select',
			options: ['text', 'email', 'password', 'tel', 'url', 'number', 'search'],
			description: 'HTML input type',
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes on the <input>',
		},
		disabled: { control: 'boolean' },
		required: { control: 'boolean' },
		placeholder: { control: 'text' },
	},
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
	args: {
		id: 'default-text-input',
		name: 'default-text-input',
		type: 'text',
		'aria-label': 'Text input',
		onChange: fn(),
	},
};

export const Email: Story = {
	args: {
		id: 'email-input',
		name: 'email-input',
		type: 'email',
		placeholder: 'name@example.com',
		'aria-label': 'Email',
		onChange: fn(),
	},
};

export const Password: Story = {
	args: {
		id: 'password-input',
		name: 'password-input',
		type: 'password',
		'aria-label': 'Password',
		onChange: fn(),
	},
};

export const Search: Story = {
	args: {
		id: 'search-input',
		name: 'search-input',
		type: 'search',
		placeholder: 'Search',
		'aria-label': 'Search',
		onChange: fn(),
	},
};

export const Disabled: Story = {
	args: {
		id: 'disabled-input',
		name: 'disabled-input',
		type: 'text',
		disabled: true,
		'aria-label': 'Disabled input',
		onChange: fn(),
	},
};
