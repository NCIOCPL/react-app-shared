import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { useState } from 'react';

import { Pager } from './Pager';

const meta: Meta<typeof Pager> = {
	title: 'NCIDS/Pager',
	component: Pager,
	tags: ['autodocs'],
	args: {
		onPageChange: fn(),
	},
	argTypes: {
		current: {
			control: { type: 'number', min: 1 },
			description: 'Currently active page number (1-indexed)',
		},
		neighbors: {
			control: { type: 'number', min: 0, max: 3 },
			description:
				'Number of neighboring pages shown on each side of the current page',
		},
		totalResults: {
			control: { type: 'number', min: 0 },
			description: 'Total number of results to paginate',
		},
		resultsPerPage: {
			control: { type: 'number', min: 1 },
			description: 'Number of results per page',
		},
		scrollToTop: {
			control: 'boolean',
			description: 'Scroll to top on page change',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Pager>;

export const Default: Story = {
	args: {
		totalResults: 250,
		resultsPerPage: 25,
		current: 1,
	},
};

export const MiddlePage: Story = {
	args: {
		totalResults: 250,
		resultsPerPage: 25,
		current: 5,
	},
};

export const LastPage: Story = {
	args: {
		totalResults: 250,
		resultsPerPage: 25,
		current: 10,
	},
};

export const FewPages: Story = {
	name: 'Few Pages (No Ellipsis)',
	args: {
		totalResults: 100,
		resultsPerPage: 25,
		current: 2,
	},
};

export const ManyPages: Story = {
	args: {
		totalResults: 1000,
		resultsPerPage: 10,
		current: 50,
		neighbors: 2,
	},
};

export const NoNeighbors: Story = {
	name: 'Neighbors = 0',
	args: {
		totalResults: 250,
		resultsPerPage: 25,
		current: 5,
		neighbors: 0,
	},
};

export const MaxNeighbors: Story = {
	name: 'Neighbors = 3',
	args: {
		totalResults: 500,
		resultsPerPage: 25,
		current: 10,
		neighbors: 3,
	},
};

export const CustomLabels: Story = {
	args: {
		totalResults: 200,
		resultsPerPage: 25,
		current: 3,
		previousLabel: 'Anterior',
		nextLabel: 'Siguiente',
	},
};

export const NoScrollToTop: Story = {
	args: {
		totalResults: 200,
		resultsPerPage: 25,
		current: 1,
		scrollToTop: false,
	},
};

const ControlledPagerExample: React.FC = () => {
	const [page, setPage] = useState(1);
	return (
		<div>
			<p>
				Current page: <strong>{page}</strong>
			</p>
			<Pager
				current={page}
				totalResults={250}
				resultsPerPage={25}
				onPageChange={({ page: newPage }) => setPage(newPage)}
				scrollToTop={false}
			/>
		</div>
	);
};

export const Controlled: Story = {
	render: () => <ControlledPagerExample />,
};
