import React from 'react';

export interface PageChangeData {
	page: number;
	offset: number;
	resultsPerPage: number;
}

export interface PagerProps {
	/** Currently active page number (1-indexed). Defaults to 1. */
	current?: number;
	/** Number of neighboring pages to show on each side of the current page (0-3). Defaults to 1. */
	neighbors?: number;
	/** Total number of results to paginate. */
	totalResults: number;
	/** Number of results displayed per page. Defaults to 25. */
	resultsPerPage?: number;
	/** Label for the previous navigation button. Defaults to "Previous". */
	previousLabel?: string;
	/** Label for the next navigation button. Defaults to "Next". */
	nextLabel?: string;
	/** Callback fired when a page navigation occurs. */
	onPageChange: (data: PageChangeData) => void;
	/** Whether to scroll to top of the page on navigation. Defaults to true. */
	scrollToTop?: boolean;
	/** Accessible label for the nav landmark. Defaults to "Pagination". */
	ariaLabel?: string;
}

const MAX_NEIGHBORS = 3;

export const Pager: React.FC<PagerProps> = ({
	current = 1,
	neighbors = 1,
	totalResults,
	resultsPerPage = 25,
	previousLabel = 'Previous',
	nextLabel = 'Next',
	onPageChange,
	scrollToTop = true,
	ariaLabel = 'Pagination',
}) => {
	const clampedNeighbors = Math.max(0, Math.min(neighbors, MAX_NEIGHBORS));
	const pageCount = Math.ceil(totalResults / resultsPerPage);

	// Reset to page 1 if current is out of bounds
	const currentPage = current < 1 || current > pageCount ? 1 : current;

	const getOffset = (page: number): number => {
		return page * resultsPerPage - resultsPerPage;
	};

	const handlePageChange = (page: number): void => {
		if (scrollToTop) {
			window.scrollTo(0, 0);
		}
		onPageChange({
			page,
			offset: getOffset(page),
			resultsPerPage,
		});
	};

	const handleClick = (
		e: React.MouseEvent<HTMLAnchorElement>,
		page: number
	): void => {
		e.preventDefault();
		handlePageChange(page);
	};

	if (totalResults <= resultsPerPage) {
		return null;
	}

	// Maximum numbered page items visible at once (first + last + current + ellipsis positions)
	const maxNumberedItems = 5;

	const buildPageItems = (): React.ReactNode[] => {
		const items: React.ReactNode[] = [];

		for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
			const showAll = pageCount <= maxNumberedItems;
			const isCurrentPage = pageNumber === currentPage;
			const isFirstOrLast = pageNumber === 1 || pageNumber === pageCount;

			let isNeighbor = false;
			if (clampedNeighbors > 0) {
				isNeighbor = Math.abs(currentPage - pageNumber) <= clampedNeighbors;
			}

			const isVisible = showAll || isFirstOrLast || isCurrentPage || isNeighbor;
			const isEllipsisPosition =
				pageNumber === 2 || pageNumber === pageCount - 1;
			const isLeftEllipsis =
				isEllipsisPosition && !isVisible && pageNumber < currentPage;
			const isRightEllipsis =
				isEllipsisPosition && !isVisible && pageNumber > currentPage;

			if (isVisible) {
				items.push(
					<li
						className="usa-pagination__item usa-pagination__page-no"
						key={`page-${pageNumber}`}
					>
						<a
							href="#"
							className={`usa-pagination__button${isCurrentPage ? ' usa-current' : ''}`}
							aria-label={`Page ${pageNumber}`}
							aria-current={isCurrentPage ? 'page' : undefined}
							onClick={(e) => handleClick(e, pageNumber)}
						>
							{pageNumber}
						</a>
					</li>
				);
			} else if (isLeftEllipsis) {
				items.push(
					<li
						key="left-ellipsis"
						className="usa-pagination__item usa-pagination__overflow ellipsis--left"
						aria-hidden="true"
					>
						<span>&hellip;</span>
					</li>
				);
			} else if (isRightEllipsis) {
				items.push(
					<li
						key="right-ellipsis"
						className="usa-pagination__item usa-pagination__overflow ellipsis--right"
						aria-hidden="true"
					>
						<span>&hellip;</span>
					</li>
				);
			}
		}

		return items;
	};

	return (
		<nav className="usa-pagination" aria-label={ariaLabel}>
			<ul className="usa-pagination__list">
				<li className="usa-pagination__item usa-pagination__arrow">
					<a
						href="#"
						className={`usa-pagination__link usa-pagination__previous-page${currentPage === 1 ? ' hidden' : ''}`}
						aria-label="Previous page"
						aria-hidden={currentPage === 1}
						role="button"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange(currentPage - 1);
						}}
					>
						<svg
							className="usa-icon"
							aria-hidden="true"
							focusable="false"
							role="img"
						>
							<use xlinkHref="/img/sprite.svg#navigate_before" />
						</svg>
						<span className="usa-pagination__link-text">{previousLabel}</span>
					</a>
				</li>

				{buildPageItems()}

				<li className="usa-pagination__item usa-pagination__arrow">
					<a
						href="#"
						className={`usa-pagination__link usa-pagination__next-page${currentPage === pageCount ? ' hidden' : ''}`}
						aria-label="Next page"
						aria-hidden={currentPage === pageCount}
						role="button"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange(currentPage + 1);
						}}
					>
						<span className="usa-pagination__link-text">{nextLabel}</span>
						<svg
							className="usa-icon"
							aria-hidden="true"
							focusable="false"
							role="img"
						>
							<use xlinkHref="/img/sprite.svg#navigate_next" />
						</svg>
					</a>
				</li>
			</ul>
		</nav>
	);
};

export default Pager;
