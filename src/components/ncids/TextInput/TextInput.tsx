import React from 'react';

export type TextInputType =
	| 'text'
	| 'email'
	| 'password'
	| 'tel'
	| 'url'
	| 'number'
	| 'search';

export interface TextInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
	/** Input ID */
	id: string;
	/** Input name */
	name: string;
	/** HTML input type */
	type?: TextInputType;
	/** Additional CSS classes on the <input>. */
	className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
	id,
	name,
	type = 'text',
	className,
	...rest
}) => {
	const classes = ['usa-input', className || ''].filter(Boolean).join(' ');

	return (
		<input className={classes} id={id} name={name} type={type} {...rest} />
	);
};

export default TextInput;
