import React from 'react';

export interface DropdownOptionProps {
	/** Option label */
	label: string;
	/** Additional CSS classes on the <option>. */
	className?: string;
	/** Value of the option */
	value: string | number;
}

export const DropdownOption: React.FC<DropdownOptionProps> = ({
	label,
	className,
	value,
}) => {
	return (
		<option key={`option_${value}`} value={value} className={className}>
			{label}
		</option>
	);
};

export interface DropdownProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {
	/** Dropdown list ID */
	id: string;
	/** Name for the dropdown list */
	name: string;
	/** Additional CSS classes on the <select>. */
	className?: string;
	/** Array of options */
	options: DropdownOptionProps[];
	/** Aria label on the <select> */
	ariaLabel: string;
	/** Callback fired when an option is selected */
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
	id,
	name,
	options,
	className,
	ariaLabel,
	onChange,
	...rest
}) => {
	const classes = ['usa-select', className || ''].filter(Boolean).join(' ');

	return (
		<select
			className={classes}
			name={name}
			id={id}
			aria-label={ariaLabel}
			onChange={onChange}
			{...rest}
		>
			{options.map((opt) => (
				<DropdownOption key={`option_${opt.value}`} {...opt} />
			))}
		</select>
	);
};

export default Dropdown;
