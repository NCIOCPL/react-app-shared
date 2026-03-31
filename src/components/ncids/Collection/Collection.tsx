import React from 'react';

export interface CollectionItemProps {
	/** Item heading content. */
	heading: React.ReactNode;
	/** URL for the heading link. If provided, heading is wrapped in an anchor. */
	href?: string;
	/** Heading element level. Defaults to 'h3'. */
	headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	/** Item description text, rendered in a <p>. */
	description?: React.ReactNode;
	/** Click handler for the heading link. */
	onHeadingClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
	/** Additional CSS classes on the <li>. */
	className?: string;
	/** Extra content rendered below description inside collection__body. */
	children?: React.ReactNode;
}

export interface CollectionProps {
	/** Collection items (should be CollectionItem elements). */
	children: React.ReactNode;
	/** Use condensed variant (headers only). */
	condensed?: boolean;
	/** Additional CSS classes on the <ul>. */
	className?: string;
}

export const CollectionItem: React.FC<CollectionItemProps> = ({
	heading,
	href,
	headingLevel = 'h3',
	description,
	onHeadingClick,
	className,
	children,
}) => {
	const HeadingTag = headingLevel;

	return (
		<li className={`usa-collection__item${className ? ` ${className}` : ''}`}>
			<div className="usa-collection__body">
				<HeadingTag className="usa-collection__heading">
					{href ? (
						<a className="usa-link" href={href} onClick={onHeadingClick}>
							{heading}
						</a>
					) : (
						heading
					)}
				</HeadingTag>
				{description && (
					<p className="usa-collection__description">{description}</p>
				)}
				{children}
			</div>
		</li>
	);
};

export const Collection: React.FC<CollectionProps> = ({
	children,
	condensed = false,
	className,
}) => {
	const classes = [
		'usa-collection',
		condensed ? 'usa-collection--condensed' : '',
		className || '',
	]
		.filter(Boolean)
		.join(' ');

	return <ul className={classes}>{children}</ul>;
};

export default Collection;
