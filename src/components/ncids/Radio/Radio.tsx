import React from 'react';

import { useRadioGroup } from './RadioGroupContext';

export interface RadioProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		'type' | 'value' | 'children'
	> {
	/** Input ID (also used to associate the <label>) */
	id: string;
	/** Visible label text */
	label: React.ReactNode;
	/** Value submitted when this radio is selected */
	value: string;
	/** Optional supporting text rendered beneath the label */
	description?: React.ReactNode;
	/** Render as a tile. Defaults to the RadioGroup `tile` setting. */
	tile?: boolean;
	/** Additional CSS classes on the wrapping `usa-radio` <div>. */
	className?: string;
}

export const Radio: React.FC<RadioProps> = ({
	id,
	label,
	value,
	description,
	tile,
	className,
	name,
	checked,
	disabled,
	required,
	onChange,
	...rest
}) => {
	const group = useRadioGroup();

	const isTile = tile ?? group?.tile ?? false;
	const wrapperClasses = ['usa-radio', className || '']
		.filter(Boolean)
		.join(' ');
	const inputClasses = [
		'usa-radio__input',
		isTile ? 'usa-radio__input--tile' : '',
	]
		.filter(Boolean)
		.join(' ');

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		group?.onSelect(value, event);
		onChange?.(event);
	};

	// Inside a group, name/checked are owned by the group; standalone radios
	// pass them straight through for controlled or uncontrolled use.
	const groupProps = group
		? {
				name: group.name,
				checked: group.selectedValue === value,
				disabled: disabled ?? group.disabled,
				required: required ?? group.required,
			}
		: { name, checked, disabled, required };

	return (
		<div className={wrapperClasses}>
			<input
				className={inputClasses}
				id={id}
				type="radio"
				value={value}
				onChange={handleChange}
				{...groupProps}
				{...rest}
			/>
			<label className="usa-radio__label" htmlFor={id}>
				{label}
				{description && (
					<span className="usa-radio__label-description">{description}</span>
				)}
			</label>
		</div>
	);
};

export default Radio;
