import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';

import { Collection, CollectionItem } from './Collection';

const meta: Meta<typeof Collection> = {
	title: 'NCIDS/Collection',
	component: Collection,
	tags: ['autodocs'],
	argTypes: {
		condensed: {
			control: 'boolean',
			description: 'Use condensed variant (headers only)',
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes on the list',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Collection>;

export const Default: Story = {
	render: (args) => (
		<Collection {...args}>
			<CollectionItem
				heading="Genomics and Cancer Research"
				href="https://example.com/genomics"
				description="Learn about the role of genomics in cancer diagnosis and treatment, including precision medicine approaches."
			/>
			<CollectionItem
				heading="Clinical Trials Search"
				href="https://example.com/trials"
				description="Find NCI-supported clinical trials that are accepting participants. Search by cancer type, treatment, and location."
			/>
			<CollectionItem
				heading="Cancer Statistics"
				href="https://example.com/statistics"
				description="Statistical data and trends for common cancer types in the United States."
			/>
		</Collection>
	),
};

export const Condensed: Story = {
	render: () => (
		<Collection condensed>
			<CollectionItem
				heading="Genomics and Cancer Research"
				href="https://example.com/genomics"
			/>
			<CollectionItem
				heading="Clinical Trials Search"
				href="https://example.com/trials"
			/>
			<CollectionItem
				heading="Cancer Statistics"
				href="https://example.com/statistics"
			/>
		</Collection>
	),
};

export const WithExtraContent: Story = {
	name: 'With Extra Content (Children)',
	render: () => (
		<Collection>
			<CollectionItem
				heading="Breast Cancer Treatment"
				href="https://www.cancer.gov/types/breast"
				description="Information about breast cancer treatment options including surgery, chemotherapy, and radiation."
			>
				<cite>https://www.cancer.gov/types/breast</cite>
			</CollectionItem>
			<CollectionItem
				heading="Lung Cancer Prevention"
				href="https://www.cancer.gov/types/lung"
				description="Steps you can take to lower your risk of getting lung cancer."
			>
				<cite>https://www.cancer.gov/types/lung</cite>
			</CollectionItem>
		</Collection>
	),
};

export const WithoutLinks: Story = {
	name: 'Without Links (Plain Headings)',
	render: () => (
		<Collection>
			<CollectionItem
				heading="Important Announcement"
				description="This item has a plain text heading without a link."
			/>
			<CollectionItem
				heading="Another Announcement"
				description="Another item with no navigation."
			/>
		</Collection>
	),
};

export const CustomHeadingLevel: Story = {
	name: 'Custom Heading Level (h4)',
	render: () => (
		<Collection>
			<CollectionItem
				heading="Section Result"
				headingLevel="h4"
				href="https://example.com"
				description="This item uses an h4 heading level."
			/>
		</Collection>
	),
};

export const Interactive: Story = {
	render: () => {
		const handleClick = fn();
		return (
			<Collection>
				<CollectionItem
					heading="Click to track"
					href="https://example.com"
					description="Clicking the heading link fires onHeadingClick."
					onHeadingClick={(e) => {
						e.preventDefault();
						handleClick();
					}}
				/>
			</Collection>
		);
	},
};
