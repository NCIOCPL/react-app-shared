import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Pager } from './Pager';

describe('<Pager />', () => {
	const defaultHandler = vi.fn();

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	// --- Rendering ---

	it('should not render when totalResults is less than or equal to resultsPerPage', () => {
		const { container } = render(
			<Pager
				totalResults={20}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		expect(container.querySelector('nav')).toBeNull();
	});

	it('should render pagination nav when totalResults exceeds resultsPerPage', () => {
		render(
			<Pager
				totalResults={100}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		expect(
			screen.getByRole('navigation', { name: 'Pagination' })
		).toBeInTheDocument();
	});

	it('should render with custom aria label', () => {
		render(
			<Pager
				totalResults={100}
				onPageChange={defaultHandler}
				ariaLabel="Search results pagination"
			/>
		);
		expect(
			screen.getByRole('navigation', {
				name: 'Search results pagination',
			})
		).toBeInTheDocument();
	});

	// --- Page number display ---

	it('should show all page numbers when total pages <= 5', () => {
		render(
			<Pager
				totalResults={120}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		// 5 pages (120/25 = 4.8, ceil = 5)
		expect(screen.getAllByRole('link', { name: /Page \d+/ })).toHaveLength(5);
	});

	it('should show page 1 as active by default', () => {
		render(
			<Pager
				totalResults={250}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		const page1 = screen.getByRole('link', { name: 'Page 1' });
		expect(page1).toHaveClass('usa-pagination__button', 'usa-current');
		expect(page1).toHaveAttribute('aria-current', 'page');
	});

	it('should reset to page 1 when current is 0', () => {
		render(
			<Pager current={0} totalResults={250} onPageChange={defaultHandler} />
		);
		expect(screen.getByRole('link', { name: 'Page 1' })).toHaveClass(
			'usa-current'
		);
	});

	it('should reset to page 1 when current exceeds page count', () => {
		render(
			<Pager current={5000} totalResults={250} onPageChange={defaultHandler} />
		);
		expect(screen.getByRole('link', { name: 'Page 1' })).toHaveClass(
			'usa-current'
		);
	});

	// --- Previous / Next buttons ---

	it('should hide previous button on first page', () => {
		const { container } = render(
			<Pager current={1} totalResults={100} onPageChange={defaultHandler} />
		);
		const prevLink = container.querySelector('.usa-pagination__previous-page');
		expect(prevLink).toHaveClass('hidden');
		expect(prevLink).toHaveAttribute('aria-hidden', 'true');
	});

	it('should show previous button when not on first page', () => {
		const { container } = render(
			<Pager current={3} totalResults={200} onPageChange={defaultHandler} />
		);
		const prevLink = container.querySelector('.usa-pagination__previous-page');
		expect(prevLink).not.toHaveClass('hidden');
	});

	it('should hide next button on last page', () => {
		const { container } = render(
			<Pager
				current={4}
				totalResults={100}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		const nextLink = container.querySelector('.usa-pagination__next-page');
		expect(nextLink).toHaveClass('hidden');
		expect(nextLink).toHaveAttribute('aria-hidden', 'true');
	});

	it('should show next button when not on last page', () => {
		const { container } = render(
			<Pager current={1} totalResults={100} onPageChange={defaultHandler} />
		);
		const nextLink = container.querySelector('.usa-pagination__next-page');
		expect(nextLink).not.toHaveClass('hidden');
	});

	it('should render custom previous and next labels', () => {
		render(
			<Pager
				totalResults={100}
				onPageChange={defaultHandler}
				previousLabel="Prev"
				nextLabel="Forward"
			/>
		);
		expect(screen.getByText('Prev')).toBeInTheDocument();
		expect(screen.getByText('Forward')).toBeInTheDocument();
	});

	// --- Navigation callbacks ---

	it('should call onPageChange with correct data when clicking a page number', () => {
		const handler = vi.fn();
		render(
			<Pager totalResults={120} resultsPerPage={25} onPageChange={handler} />
		);
		fireEvent.click(screen.getByRole('link', { name: 'Page 3' }));
		expect(handler).toHaveBeenCalledWith({
			page: 3,
			offset: 50,
			resultsPerPage: 25,
		});
	});

	it('should call onPageChange when clicking next button', () => {
		const handler = vi.fn();
		const { container } = render(
			<Pager
				current={1}
				totalResults={100}
				resultsPerPage={25}
				onPageChange={handler}
			/>
		);
		const nextLink = container.querySelector(
			'.usa-pagination__next-page'
		) as HTMLElement;
		fireEvent.click(nextLink);
		expect(handler).toHaveBeenCalledWith({
			page: 2,
			offset: 25,
			resultsPerPage: 25,
		});
	});

	it('should call onPageChange when clicking previous button', () => {
		const handler = vi.fn();
		const { container } = render(
			<Pager
				current={3}
				totalResults={100}
				resultsPerPage={25}
				onPageChange={handler}
			/>
		);
		const prevLink = container.querySelector(
			'.usa-pagination__previous-page'
		) as HTMLElement;
		fireEvent.click(prevLink);
		expect(handler).toHaveBeenCalledWith({
			page: 2,
			offset: 25,
			resultsPerPage: 25,
		});
	});

	// --- Scroll to top ---

	it('should scroll to top by default on page change', () => {
		const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
		render(
			<Pager
				totalResults={100}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		fireEvent.click(screen.getByRole('link', { name: 'Page 2' }));
		expect(scrollSpy).toHaveBeenCalledWith(0, 0);
	});

	it('should not scroll to top when scrollToTop is false', () => {
		const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
		render(
			<Pager
				totalResults={100}
				resultsPerPage={25}
				onPageChange={defaultHandler}
				scrollToTop={false}
			/>
		);
		fireEvent.click(screen.getByRole('link', { name: 'Page 2' }));
		expect(scrollSpy).not.toHaveBeenCalled();
	});

	// --- Ellipsis logic ---

	it('should show right ellipsis when current page is near the beginning', () => {
		render(
			<Pager
				current={1}
				neighbors={1}
				totalResults={200}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		// Pages: 1 (current), 2 (neighbor), ..., 8 (last)
		const ellipsis = screen.getByText('…');
		expect(ellipsis.closest('li')).toHaveClass('ellipsis--right');
	});

	it('should show left ellipsis when current page is near the end', () => {
		render(
			<Pager
				current={8}
				neighbors={1}
				totalResults={200}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		const ellipsis = screen.getByText('…');
		expect(ellipsis.closest('li')).toHaveClass('ellipsis--left');
	});

	it('should show both ellipses when current page is in the middle', () => {
		render(
			<Pager
				current={5}
				neighbors={1}
				totalResults={250}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		const ellipses = screen.getAllByText('…');
		expect(ellipses).toHaveLength(2);
		expect(ellipses[0].closest('li')).toHaveClass('ellipsis--left');
		expect(ellipses[1].closest('li')).toHaveClass('ellipsis--right');
	});

	it('should not show ellipsis when total pages <= 5', () => {
		render(
			<Pager
				current={3}
				totalResults={100}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		expect(screen.queryByText('…')).not.toBeInTheDocument();
	});

	// --- Neighbors ---

	it('should display correct neighbors with neighbors=0', () => {
		render(
			<Pager
				current={5}
				neighbors={0}
				totalResults={250}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		// First page, current page (5), last page (10) visible
		expect(screen.getByRole('link', { name: 'Page 1' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Page 5' })).toHaveClass(
			'usa-current'
		);
		expect(screen.getByRole('link', { name: 'Page 10' })).toBeInTheDocument();
		// Neighbors should not be visible
		expect(
			screen.queryByRole('link', { name: 'Page 4' })
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole('link', { name: 'Page 6' })
		).not.toBeInTheDocument();
	});

	it('should display correct neighbors with neighbors=1', () => {
		render(
			<Pager
				current={5}
				neighbors={1}
				totalResults={250}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		expect(screen.getByRole('link', { name: 'Page 4' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Page 5' })).toHaveClass(
			'usa-current'
		);
		expect(screen.getByRole('link', { name: 'Page 6' })).toBeInTheDocument();
		expect(
			screen.queryByRole('link', { name: 'Page 3' })
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole('link', { name: 'Page 7' })
		).not.toBeInTheDocument();
	});

	it('should clamp neighbors to maximum of 3', () => {
		render(
			<Pager
				current={5}
				neighbors={10}
				totalResults={250}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		// Should be clamped to 3: pages 2,3,4,5,6,7,8 visible (plus first/last)
		expect(screen.getByRole('link', { name: 'Page 2' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Page 8' })).toBeInTheDocument();
	});

	// --- Re-render with new current page ---

	it('should update active page on re-render', () => {
		const handler = vi.fn();
		const { rerender } = render(
			<Pager
				current={1}
				totalResults={120}
				resultsPerPage={25}
				onPageChange={handler}
			/>
		);
		expect(screen.getByRole('link', { name: 'Page 1' })).toHaveClass(
			'usa-current'
		);

		rerender(
			<Pager
				current={3}
				totalResults={120}
				resultsPerPage={25}
				onPageChange={handler}
			/>
		);
		expect(screen.getByRole('link', { name: 'Page 3' })).toHaveClass(
			'usa-current'
		);
		expect(screen.getByRole('link', { name: 'Page 1' })).not.toHaveClass(
			'usa-current'
		);
	});

	// --- NCIDS class structure ---

	it('should apply correct NCIDS usa-pagination class structure', () => {
		const { container } = render(
			<Pager
				current={3}
				totalResults={250}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		expect(container.querySelector('.usa-pagination')).toBeInTheDocument();
		expect(
			container.querySelector('.usa-pagination__list')
		).toBeInTheDocument();
		expect(
			container.querySelector('.usa-pagination__page-no')
		).toBeInTheDocument();
		expect(container.querySelectorAll('.usa-pagination__arrow')).toHaveLength(
			2
		);
		expect(
			container.querySelector('.usa-pagination__button')
		).toBeInTheDocument();
	});

	// --- Accessibility ---

	it('should have no accessibility violations', async () => {
		const { container } = render(
			<Pager
				current={3}
				totalResults={250}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should have aria-current="page" only on the active page', () => {
		render(
			<Pager
				current={2}
				totalResults={120}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		const page2 = screen.getByRole('link', { name: 'Page 2' });
		expect(page2).toHaveAttribute('aria-current', 'page');

		const page1 = screen.getByRole('link', { name: 'Page 1' });
		expect(page1).not.toHaveAttribute('aria-current');
	});

	it('should set aria-hidden on ellipsis items', () => {
		const { container } = render(
			<Pager
				current={5}
				neighbors={1}
				totalResults={250}
				resultsPerPage={25}
				onPageChange={defaultHandler}
			/>
		);
		const overflowItems = container.querySelectorAll(
			'.usa-pagination__overflow'
		);
		overflowItems.forEach((item) => {
			expect(item).toHaveAttribute('aria-hidden', 'true');
		});
	});
});
