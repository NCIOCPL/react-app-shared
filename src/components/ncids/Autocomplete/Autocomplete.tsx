import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './Autocomplete.module.scss';

export interface AutocompleteProps<T = AutocompleteOption> {
	/** Input element ID */
	id: string;
	/** Visible label text for the input */
	label: string;
	/** Synchronous list of options to filter against the input value */
	options?: T[];
	/**
	 * Async function called with the current input value to load options.
	 * Takes precedence over the `options` prop when provided.
	 */
	loadOptions?: (inputValue: string) => Promise<T[]>;
	/** Debounce delay in milliseconds before calling loadOptions. Defaults to 300. */
	debounceDelay?: number;
	/** Custom renderer for each option row */
	renderOption?: (option: T, isHighlighted: boolean) => React.ReactNode;
	/** Extract the display label string from an option. Defaults to `option.label`. */
	getOptionLabel?: (option: T) => string;
	/** Extract the unique value string from an option. Defaults to `option.value`. */
	getOptionValue?: (option: T) => string;
	/** Placeholder text for the input */
	placeholder?: string;
	/** Message displayed when no options match the input. Defaults to "No results found." */
	noOptionsMessage?: string;
	/** Message displayed while options are loading. Defaults to "Loading…" */
	loadingMessage?: string;
	/** Called when the user selects an option or clears the input */
	onChange?: (value: T | null) => void;
	/** Controlled currently-selected value */
	value?: T | null;
	/** Disable the input */
	disabled?: boolean;
	/** Additional CSS class on the wrapper element */
	className?: string;
	/** Additional CSS class on the text input */
	inputClassName?: string;
}

export interface AutocompleteOption {
	label: string;
	value: string;
}

const defaultGetLabel = (option: AutocompleteOption) => option.label;
const defaultGetValue = (option: AutocompleteOption) => option.value;

export function Autocomplete<T = AutocompleteOption>({
	id,
	label,
	options,
	loadOptions,
	debounceDelay = 300,
	renderOption,
	getOptionLabel,
	getOptionValue,
	placeholder,
	noOptionsMessage = 'No results found.',
	loadingMessage = 'Loading…',
	onChange,
	value,
	disabled = false,
	className,
	inputClassName,
}: AutocompleteProps<T>): React.ReactElement {
	const resolveLabel = useCallback(
		(opt: T) => ((getOptionLabel ?? defaultGetLabel) as (o: T) => string)(opt),
		[getOptionLabel]
	);
	const resolveValue = useCallback(
		(opt: T) => ((getOptionValue ?? defaultGetValue) as (o: T) => string)(opt),
		[getOptionValue]
	);

	const [inputValue, setInputValue] = useState<string>(
		value != null ? resolveLabel(value) : ''
	);
	const [filteredOptions, setFilteredOptions] = useState<T[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [selectedValue, setSelectedValue] = useState<T | null>(
		value !== undefined ? (value ?? null) : null
	);

	const listboxId = `${id}-listbox`;
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxRef = useRef<HTMLUListElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isMountedRef = useRef(true);

	// Sync controlled value changes
	useEffect(() => {
		if (value !== undefined) {
			setSelectedValue(value ?? null);
			setInputValue(value != null ? resolveLabel(value) : '');
		}
	}, [value, resolveLabel]);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const openDropdown = useCallback(
		async (query: string) => {
			if (loadOptions) {
				setIsLoading(true);
				setIsOpen(true);
				try {
					const results = await loadOptions(query);
					if (isMountedRef.current) {
						setFilteredOptions(results);
					}
				} finally {
					if (isMountedRef.current) {
						setIsLoading(false);
					}
				}
			} else if (options) {
				const lowerQuery = query.toLowerCase();
				const filtered = options.filter((opt) =>
					resolveLabel(opt).toLowerCase().includes(lowerQuery)
				);
				setFilteredOptions(filtered);
				setIsOpen(true);
			}
		},
		[loadOptions, options, resolveLabel]
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setInputValue(newValue);
			setHighlightedIndex(-1);

			// Clear selection when user modifies input
			if (selectedValue !== null) {
				setSelectedValue(null);
				onChange?.(null);
			}

			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}

			if (newValue.trim() === '') {
				setIsOpen(false);
				setFilteredOptions([]);
				return;
			}

			debounceTimerRef.current = setTimeout(() => {
				openDropdown(newValue);
			}, debounceDelay);
		},
		[debounceDelay, onChange, openDropdown, selectedValue]
	);

	const selectOption = useCallback(
		(option: T) => {
			setSelectedValue(option);
			setInputValue(resolveLabel(option));
			setIsOpen(false);
			setHighlightedIndex(-1);
			onChange?.(option);
			inputRef.current?.focus();
		},
		[onChange, resolveLabel]
	);

	const handleClear = useCallback(() => {
		setInputValue('');
		setSelectedValue(null);
		setFilteredOptions([]);
		setIsOpen(false);
		setHighlightedIndex(-1);
		onChange?.(null);
		inputRef.current?.focus();
	}, [onChange]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (!isOpen) {
				if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
					e.preventDefault();
					if (inputValue.trim()) {
						openDropdown(inputValue);
					}
				}
				return;
			}

			switch (e.key) {
				case 'ArrowDown': {
					e.preventDefault();
					setHighlightedIndex((prev) =>
						prev < filteredOptions.length - 1 ? prev + 1 : prev
					);
					break;
				}
				case 'ArrowUp': {
					e.preventDefault();
					setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
					break;
				}
				case 'Enter': {
					e.preventDefault();
					if (
						highlightedIndex >= 0 &&
						highlightedIndex < filteredOptions.length
					) {
						selectOption(filteredOptions[highlightedIndex]);
					}
					break;
				}
				case 'Escape': {
					e.preventDefault();
					setIsOpen(false);
					setHighlightedIndex(-1);
					break;
				}
				case 'Tab': {
					setIsOpen(false);
					setHighlightedIndex(-1);
					break;
				}
			}
		},
		[
			filteredOptions,
			highlightedIndex,
			inputValue,
			isOpen,
			openDropdown,
			selectOption,
		]
	);

	// Scroll highlighted item into view
	useEffect(() => {
		if (highlightedIndex < 0 || !listboxRef.current) return;
		if (highlightedIndex >= listboxRef.current.children.length) return;
		const item = listboxRef.current.children[highlightedIndex] as HTMLElement;
		item.scrollIntoView({ block: 'nearest' });
	}, [highlightedIndex]);

	// Close on outside click
	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
				setHighlightedIndex(-1);
			}
		};
		document.addEventListener('mousedown', handleMouseDown);
		return () => document.removeEventListener('mousedown', handleMouseDown);
	}, []);

	// Clean up debounce timer on unmount
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	const optionId = (index: number) => `${id}-option-${index}`;

	const labelId = `${id}-label`;

	const activeDescendant =
		isOpen && highlightedIndex >= 0 ? optionId(highlightedIndex) : undefined;

	const wrapperClasses = [styles.autocomplete, className || '']
		.filter(Boolean)
		.join(' ');

	const inputClasses = [
		'usa-input',
		styles.autocompleteInput,
		inputClassName || '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div ref={wrapperRef} className={wrapperClasses}>
			<label id={labelId} className="usa-label" htmlFor={id}>
				{label}
			</label>
			<div className={styles.inputWrapper}>
				<input
					ref={inputRef}
					id={id}
					type="text"
					role="combobox"
					autoComplete="off"
					aria-autocomplete="list"
					aria-expanded={isOpen}
					aria-haspopup="listbox"
					aria-controls={listboxId}
					aria-activedescendant={activeDescendant}
					className={inputClasses}
					value={inputValue}
					placeholder={placeholder}
					disabled={disabled}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
				/>
				{inputValue && !disabled && (
					<button
						type="button"
						className={styles.clearButton}
						aria-label="Clear"
						onClick={handleClear}
						tabIndex={-1}
					>
						&times;
					</button>
				)}
			</div>

			<ul
				ref={listboxRef}
				id={listboxId}
				role="listbox"
				aria-labelledby={labelId}
				className={styles.listbox}
				hidden={!isOpen}
			>
				{isOpen &&
					(isLoading ? (
						<li
							role="option"
							aria-selected={false}
							aria-disabled={true}
							className={styles.statusMessage}
						>
							{loadingMessage}
						</li>
					) : filteredOptions.length === 0 ? (
						<li
							role="option"
							aria-selected={false}
							aria-disabled={true}
							className={styles.statusMessage}
						>
							{noOptionsMessage}
						</li>
					) : (
						filteredOptions.map((option, index) => {
							const isHighlighted = index === highlightedIndex;
							const isSelected =
								selectedValue !== null &&
								resolveValue(option) === resolveValue(selectedValue);
							return (
								<li
									key={resolveValue(option)}
									id={optionId(index)}
									role="option"
									aria-selected={isSelected}
									className={[
										styles.option,
										isHighlighted ? styles.optionHighlighted : '',
									]
										.filter(Boolean)
										.join(' ')}
									onMouseDown={(e) => {
										// Prevent input blur before click registers
										e.preventDefault();
									}}
									onClick={() => selectOption(option)}
								>
									{renderOption
										? renderOption(option, isHighlighted)
										: resolveLabel(option)}
								</li>
							);
						})
					))}
			</ul>
		</div>
	);
}

export default Autocomplete;
