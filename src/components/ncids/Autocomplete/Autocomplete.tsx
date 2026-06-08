import React, { useCallback, useEffect, useRef, useState } from 'react';

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
	/**
	 * Minimum number of characters required before options are loaded/filtered.
	 * While the input has between 1 and `minChars - 1` characters, the dropdown
	 * shows `minCharsMessage` instead. Defaults to 0 (no minimum).
	 */
	minChars?: number;
	/**
	 * Message shown in the dropdown when the input has fewer than `minChars`
	 * characters. Defaults to "Please enter {minChars} or more characters".
	 */
	minCharsMessage?: string;
	/** Custom renderer for each option row */
	renderOption?: (option: T, isHighlighted: boolean) => React.ReactNode;
	/**
	 * When true (and no `renderOption` is provided), the portion of each option
	 * label matching the current input value is wrapped in `<strong>`.
	 */
	highlightMatch?: boolean;
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
	/**
	 * Called when the user submits a search — clicks the search button, or
	 * presses Enter without a highlighted option. Receives the raw input value.
	 * Providing this also renders the search (submit) button.
	 */
	onSubmit?: (inputValue: string) => void;
	/** Accessible label for the search/submit button. Defaults to "Search". */
	searchButtonLabel?: string;
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

/**
 * Split `label` into plain text / `<strong>` segments around every
 * case-insensitive occurrence of `query`.
 */
function highlightLabel(label: string, query: string): React.ReactNode {
	const q = query.trim();
	if (!q) return label;

	const lowerLabel = label.toLowerCase();
	const lowerQuery = q.toLowerCase();
	const segments: React.ReactNode[] = [];
	let cursor = 0;
	let matchIndex = lowerLabel.indexOf(lowerQuery);
	let key = 0;

	while (matchIndex !== -1) {
		if (matchIndex > cursor) {
			segments.push(label.slice(cursor, matchIndex));
		}
		segments.push(
			<strong key={key++}>
				{label.slice(matchIndex, matchIndex + q.length)}
			</strong>
		);
		cursor = matchIndex + q.length;
		matchIndex = lowerLabel.indexOf(lowerQuery, cursor);
	}

	if (cursor < label.length) {
		segments.push(label.slice(cursor));
	}

	return segments;
}

export function Autocomplete<T = AutocompleteOption>({
	id,
	label,
	options,
	loadOptions,
	debounceDelay = 300,
	minChars = 0,
	minCharsMessage,
	renderOption,
	highlightMatch = false,
	getOptionLabel,
	getOptionValue,
	placeholder,
	noOptionsMessage = 'No results found.',
	loadingMessage = 'Loading…',
	onChange,
	onSubmit,
	searchButtonLabel = 'Search',
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

	const resolvedMinCharsMessage =
		minCharsMessage ?? `Please enter ${minChars} or more characters`;

	// True when the input has some text but fewer than the required minimum.
	const belowMinChars = useCallback(
		(query: string) => {
			const len = query.trim().length;
			return minChars > 0 && len > 0 && len < minChars;
		},
		[minChars]
	);

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
			// Below the minimum character threshold: surface the hint instead of
			// loading/filtering options.
			if (belowMinChars(query)) {
				setIsLoading(false);
				setFilteredOptions([]);
				setIsOpen(true);
				return;
			}

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
		[belowMinChars, loadOptions, options, resolveLabel]
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

			// Below the minimum threshold: show the hint immediately (no debounce,
			// no network request).
			if (belowMinChars(newValue)) {
				setIsLoading(false);
				setFilteredOptions([]);
				setIsOpen(true);
				return;
			}

			debounceTimerRef.current = setTimeout(() => {
				openDropdown(newValue);
			}, debounceDelay);
		},
		[belowMinChars, debounceDelay, onChange, openDropdown, selectedValue]
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

	const handleSubmit = useCallback(() => {
		setIsOpen(false);
		setHighlightedIndex(-1);
		onSubmit?.(inputValue);
	}, [inputValue, onSubmit]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (!isOpen) {
				if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
					e.preventDefault();
					if (inputValue.trim()) {
						openDropdown(inputValue);
					}
				} else if (e.key === 'Enter') {
					e.preventDefault();
					handleSubmit();
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
					} else {
						// No option highlighted — treat Enter as a search submission.
						handleSubmit();
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
			handleSubmit,
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

	const wrapperClasses = ['nci-autocomplete', className || '']
		.filter(Boolean)
		.join(' ');

	const inputClasses = [
		'usa-input',
		'nci-autocomplete__input',
		inputClassName || '',
	]
		.filter(Boolean)
		.join(' ');

	const renderOptionLabel = (option: T, isHighlighted: boolean) => {
		if (renderOption) {
			return renderOption(option, isHighlighted);
		}
		const text = resolveLabel(option);
		return highlightMatch ? highlightLabel(text, inputValue) : text;
	};

	return (
		<div ref={wrapperRef} className={wrapperClasses}>
			<label id={labelId} className="usa-label" htmlFor={id}>
				{label}
			</label>
			<div className="nci-autocomplete__control">
				<div className="nci-autocomplete__field">
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
							className="nci-autocomplete__clear"
							aria-label="Clear"
							onClick={handleClear}
							tabIndex={-1}
						>
							&times;
						</button>
					)}
				</div>
				{onSubmit && (
					<button
						type="button"
						className="nci-autocomplete__submit"
						aria-label={searchButtonLabel}
						disabled={disabled}
						onClick={handleSubmit}
					>
						<svg
							aria-hidden="true"
							focusable="false"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14z" />
						</svg>
					</button>
				)}
			</div>

			<ul
				ref={listboxRef}
				id={listboxId}
				role="listbox"
				aria-labelledby={labelId}
				className="nci-autocomplete__listbox"
				hidden={!isOpen}
			>
				{isOpen &&
					(belowMinChars(inputValue) ? (
						<li
							role="option"
							aria-selected={false}
							aria-disabled={true}
							className="nci-autocomplete__status"
						>
							{resolvedMinCharsMessage}
						</li>
					) : isLoading ? (
						<li
							role="option"
							aria-selected={false}
							aria-disabled={true}
							className="nci-autocomplete__status"
						>
							{loadingMessage}
						</li>
					) : filteredOptions.length === 0 ? (
						<li
							role="option"
							aria-selected={false}
							aria-disabled={true}
							className="nci-autocomplete__status"
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
										'nci-autocomplete__option',
										isHighlighted
											? 'nci-autocomplete__option--highlighted'
											: '',
									]
										.filter(Boolean)
										.join(' ')}
									onMouseDown={(e) => {
										// Prevent input blur before click registers
										e.preventDefault();
									}}
									onClick={() => selectOption(option)}
								>
									{renderOptionLabel(option, isHighlighted)}
								</li>
							);
						})
					))}
			</ul>
		</div>
	);
}

export default Autocomplete;
