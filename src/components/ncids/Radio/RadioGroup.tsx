import React, { useState } from 'react';

import { RadioGroupContext } from './RadioGroupContext';

export interface RadioGroupProps
	extends Omit<
		React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
		'onChange' | 'defaultValue'
	> {
	/** Shared name applied to every radio in the group */
	name: string;
	/** Legend describing the group (required for accessibility) */
	legend: React.ReactNode;
	/** Visually hide the legend while keeping it available to screen readers */
	legendSrOnly?: boolean;
	/** Optional hint text rendered beneath the legend */
	hint?: React.ReactNode;
	/** Selected value (controlled) */
	value?: string;
	/** Initially selected value (uncontrolled) */
	defaultValue?: string;
	/** Callback fired when the selection changes */
	onChange?: (
		value: string,
		event: React.ChangeEvent<HTMLInputElement>
	) => void;
	/** Render all radios in the group as tiles */
	tile?: boolean;
	/** Error message. When provided, the group is rendered in an error state. */
	errorMessage?: React.ReactNode;
	/** Mark the group as required */
	required?: boolean;
	/** Disable every radio in the group */
	disabled?: boolean;
	/** Fieldset ID; also prefixes hint/error IDs. Defaults to `name`. */
	id?: string;
	/** Additional CSS classes on the wrapping `usa-form-group` <div>. */
	className?: string;
	/** Radio children */
	children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
	name,
	legend,
	legendSrOnly = false,
	hint,
	value,
	defaultValue,
	onChange,
	tile = false,
	errorMessage,
	required = false,
	disabled = false,
	className,
	id,
	children,
	...rest
}) => {
	const baseId = id || name;
	const hintId = `${baseId}-hint`;
	const errorId = `${baseId}-error`;

	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState(defaultValue);
	const selectedValue = isControlled ? value : internalValue;

	const handleSelect = (
		newValue: string,
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (!isControlled) {
			setInternalValue(newValue);
		}
		onChange?.(newValue, event);
	};

	const hasError = Boolean(errorMessage);
	const wrapperClasses = [
		'usa-form-group',
		hasError ? 'usa-form-group--error' : '',
		className || '',
	]
		.filter(Boolean)
		.join(' ');
	const legendClasses = ['usa-legend', legendSrOnly ? 'usa-sr-only' : '']
		.filter(Boolean)
		.join(' ');
	const describedBy =
		[hint ? hintId : '', hasError ? errorId : ''].filter(Boolean).join(' ') ||
		undefined;

	return (
		<div className={wrapperClasses}>
			<fieldset
				className="usa-fieldset"
				id={baseId}
				aria-describedby={describedBy}
				{...rest}
			>
				<legend className={legendClasses}>
					{legend}
					{required && (
						<>
							{' '}
							<abbr title="required" className="usa-hint usa-hint--required">
								*
							</abbr>
						</>
					)}
				</legend>
				{hint && (
					<span className="usa-hint" id={hintId}>
						{hint}
					</span>
				)}
				{hasError && (
					<span className="usa-error-message" id={errorId} role="alert">
						{errorMessage}
					</span>
				)}
				<RadioGroupContext.Provider
					value={{
						name,
						selectedValue,
						onSelect: handleSelect,
						tile,
						disabled,
						required,
					}}
				>
					{children}
				</RadioGroupContext.Provider>
			</fieldset>
		</div>
	);
};

export default RadioGroup;
