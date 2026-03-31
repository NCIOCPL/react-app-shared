import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Collection, CollectionItem } from './Collection';

describe('<Collection />', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render a ul with usa-collection class', () => {
		const { container } = render(
			<Collection>
				<CollectionItem heading="Item 1" />
			</Collection>
		);
		const ul = container.querySelector('ul');
		expect(ul).toHaveClass('usa-collection');
	});

	it('should apply usa-collection--condensed when condensed is true', () => {
		const { container } = render(
			<Collection condensed>
				<CollectionItem heading="Item 1" />
			</Collection>
		);
		const ul = container.querySelector('ul');
		expect(ul).toHaveClass('usa-collection', 'usa-collection--condensed');
	});

	it('should not apply condensed class when condensed is false', () => {
		const { container } = render(
			<Collection>
				<CollectionItem heading="Item 1" />
			</Collection>
		);
		const ul = container.querySelector('ul');
		expect(ul).not.toHaveClass('usa-collection--condensed');
	});

	it('should pass additional className to Collection ul', () => {
		const { container } = render(
			<Collection className="no-bullets custom-class">
				<CollectionItem heading="Item 1" />
			</Collection>
		);
		const ul = container.querySelector('ul');
		expect(ul).toHaveClass('usa-collection', 'no-bullets', 'custom-class');
	});
});

describe('<CollectionItem />', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render an li with usa-collection__item class', () => {
		render(
			<Collection>
				<CollectionItem heading="Test heading" />
			</Collection>
		);
		const li = screen.getByRole('listitem');
		expect(li).toHaveClass('usa-collection__item');
	});

	it('should render heading in h3 by default', () => {
		render(
			<Collection>
				<CollectionItem heading="Test heading" />
			</Collection>
		);
		expect(
			screen.getByRole('heading', { level: 3, name: 'Test heading' })
		).toBeInTheDocument();
	});

	it('should render heading with h2 level', () => {
		render(
			<Collection>
				<CollectionItem heading="Test heading" headingLevel="h2" />
			</Collection>
		);
		expect(
			screen.getByRole('heading', { level: 2, name: 'Test heading' })
		).toBeInTheDocument();
	});

	it('should render heading with h4 level', () => {
		render(
			<Collection>
				<CollectionItem heading="Test heading" headingLevel="h4" />
			</Collection>
		);
		expect(
			screen.getByRole('heading', { level: 4, name: 'Test heading' })
		).toBeInTheDocument();
	});

	it('should wrap heading in a link when href is provided', () => {
		render(
			<Collection>
				<CollectionItem heading="Click me" href="https://example.com" />
			</Collection>
		);
		const link = screen.getByRole('link', { name: 'Click me' });
		expect(link).toHaveClass('usa-link');
		expect(link).toHaveAttribute('href', 'https://example.com');
	});

	it('should render heading as plain text when no href', () => {
		render(
			<Collection>
				<CollectionItem heading="Plain heading" />
			</Collection>
		);
		expect(screen.getByText('Plain heading')).toBeInTheDocument();
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('should render description in a p element', () => {
		const { container } = render(
			<Collection>
				<CollectionItem heading="Title" description="A description here" />
			</Collection>
		);
		const desc = container.querySelector('.usa-collection__description');
		expect(desc).toBeInTheDocument();
		expect(desc?.tagName).toBe('P');
		expect(desc).toHaveTextContent('A description here');
	});

	it('should not render description p when no description prop', () => {
		const { container } = render(
			<Collection>
				<CollectionItem heading="Title" />
			</Collection>
		);
		expect(
			container.querySelector('.usa-collection__description')
		).not.toBeInTheDocument();
	});

	it('should render children inside collection__body', () => {
		const { container } = render(
			<Collection>
				<CollectionItem heading="Title">
					<cite className="custom-cite">https://example.com</cite>
				</CollectionItem>
			</Collection>
		);
		const body = container.querySelector('.usa-collection__body');
		const cite = body?.querySelector('cite.custom-cite');
		expect(cite).toBeInTheDocument();
		expect(cite).toHaveTextContent('https://example.com');
	});

	it('should pass additional className to li element', () => {
		render(
			<Collection>
				<CollectionItem
					heading="Title"
					className="sws-results__list-item grid-container"
				/>
			</Collection>
		);
		const li = screen.getByRole('listitem');
		expect(li).toHaveClass(
			'usa-collection__item',
			'sws-results__list-item',
			'grid-container'
		);
	});

	it('should call onHeadingClick when heading link is clicked', () => {
		const handler = vi.fn();
		render(
			<Collection>
				<CollectionItem
					heading="Clickable"
					href="https://example.com"
					onHeadingClick={handler}
				/>
			</Collection>
		);
		fireEvent.click(screen.getByRole('link', { name: 'Clickable' }));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('should apply usa-collection__heading class to heading element', () => {
		const { container } = render(
			<Collection>
				<CollectionItem heading="Title" />
			</Collection>
		);
		expect(
			container.querySelector('.usa-collection__heading')
		).toBeInTheDocument();
	});

	it('should have no accessibility violations', async () => {
		const { container } = render(
			<Collection>
				<CollectionItem
					heading="Accessible item"
					href="https://example.com"
					description="This is a description"
				/>
				<CollectionItem
					heading="Second item"
					href="https://example.com/2"
					description="Another description"
				/>
			</Collection>
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});
