import React from 'react';
import {
	cleanup,
	render,
	screen,
	waitFor,
	within,
} from '@testing-library/react';
import { axe } from 'vitest-axe';
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
	beforeAll,
} from 'vitest';
import userEvent from '@testing-library/user-event';

import { Autocomplete } from './Autocomplete';
import type { AutocompleteOption } from './Autocomplete';

const fruits: AutocompleteOption[] = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Apricot', value: 'apricot' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Blueberry', value: 'blueberry' },
	{ label: 'Cherry', value: 'cherry' },
];

const loadFruits = vi.fn(
	(query: string): Promise<AutocompleteOption[]> =>
		Promise.resolve(
			fruits.filter((f) => f.label.toLowerCase().includes(query.toLowerCase()))
		)
);

describe('<Autocomplete />', () => {
	beforeAll(() => {
		// https://vitest.dev/api/vi.html#vi-stubglobal
		vi.stubGlobal('jest', {
			advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
		});
	});

	beforeEach(() => {
		vi.useFakeTimers();
		// localStorage.clear();
		loadFruits.mockClear();
	});

	afterEach(() => {
		vi.useRealTimers();
		cleanup();
	});

	// ── Rendering ─────────────────────────────────────────────────────────────

	it('renders a labelled combobox input', () => {
		render(<Autocomplete id="fruit" label="Test" options={fruits} />);
		expect(screen.getByRole('combobox', { name: 'Test' })).toBeInTheDocument();
		//expect(screen.getByLabelText('Test')).toBeInTheDocument();
	});

	it('renders with placeholder', () => {
		render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				options={fruits}
				placeholder="Search fruit…"
			/>
		);
		expect(screen.getByPlaceholderText('Search fruit…')).toBeInTheDocument();
	});

	it('applies additional wrapper className', () => {
		const { container } = render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				options={fruits}
				className="my-custom-class"
			/>
		);
		expect(container.firstChild).toHaveClass('my-custom-class');
	});

	it('applies additional inputClassName', () => {
		render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				options={fruits}
				inputClassName="my-input-class"
			/>
		);
		expect(screen.getByRole('combobox')).toHaveClass('my-input-class');
	});

	it('renders disabled input', () => {
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} disabled />);
		expect(screen.getByRole('combobox')).toBeDisabled();
	});

	it('does not show clear button when input is empty', () => {
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);
		expect(
			screen.queryByRole('button', { name: 'Clear' })
		).not.toBeInTheDocument();
	});

	it('does not show clear button when disabled', async () => {
		// const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} disabled />);
		// Can't type into disabled input, so just assert no clear button
		expect(
			screen.queryByRole('button', { name: 'Clear' })
		).not.toBeInTheDocument();
	});

	// ── Synchronous options ────────────────────────────────────────────────────

	it('filters synchronous options as user types', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		await user.type(screen.getByRole('combobox'), 'ap');
		vi.runAllTimers();

		await waitFor(() => {
			expect(screen.getByRole('listbox')).toBeInTheDocument();
		});

		const listbox = screen.getByRole('listbox');
		const options = within(listbox).getAllByRole('option');
		expect(options).toHaveLength(2);
		expect(options[0]).toHaveTextContent('Apple');
		expect(options[1]).toHaveTextContent('Apricot');
	});

	it('shows no-results message when nothing matches', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				options={fruits}
				noOptionsMessage="No fruit found."
			/>
		);

		await user.type(screen.getByRole('combobox'), 'zzz');
		vi.runAllTimers();

		await waitFor(() => {
			expect(screen.getByRole('listbox')).toBeInTheDocument();
		});
		expect(screen.getByText('No fruit found.')).toBeInTheDocument();
	});

	it('uses default no-results message', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		await user.type(screen.getByRole('combobox'), 'zzz');
		vi.runAllTimers();

		await waitFor(() =>
			expect(screen.getByText('No results found.')).toBeInTheDocument()
		);
	});

	it('closes dropdown when input is cleared by typing', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		const input = screen.getByRole('combobox');
		await user.type(input, 'ap');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		await user.clear(input);
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	// ── Async options ──────────────────────────────────────────────────────────

	it('shows loading message while loadOptions resolves', async () => {
		let resolve: (v: AutocompleteOption[]) => void;
		const slowLoad = vi.fn(
			() =>
				new Promise<AutocompleteOption[]>((res) => {
					resolve = res;
				})
		);

		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				loadOptions={slowLoad}
				loadingMessage="Fetching…"
			/>
		);

		await user.type(screen.getByRole('combobox'), 'ap');
		vi.runAllTimers();

		await waitFor(() =>
			expect(screen.getByText('Fetching…')).toBeInTheDocument()
		);

		// Resolve the promise
		resolve!([{ label: 'Apple', value: 'apple' }]);
		await waitFor(() =>
			expect(screen.queryByText('Fetching…')).not.toBeInTheDocument()
		);
		expect(screen.getByText('Apple')).toBeInTheDocument();
	});

	it('uses default loading message', async () => {
		let resolve: (v: AutocompleteOption[]) => void;
		const slowLoad = vi.fn(
			() =>
				new Promise<AutocompleteOption[]>((res) => {
					resolve = res;
				})
		);

		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" loadOptions={slowLoad} />);

		await user.type(screen.getByRole('combobox'), 'ap');
		vi.runAllTimers();

		await waitFor(() =>
			expect(screen.getByText('Loading…')).toBeInTheDocument()
		);
		resolve!([]);
	});

	it('calls loadOptions after debounce delay', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				loadOptions={loadFruits}
				debounceDelay={500}
			/>
		);

		await user.type(screen.getByRole('combobox'), 'ban');

		// Not called yet (timers not advanced)
		expect(loadFruits).not.toHaveBeenCalled();

		vi.advanceTimersByTime(500);
		await waitFor(() => expect(loadFruits).toHaveBeenCalledWith('ban'));
	});

	// ── Option selection ───────────────────────────────────────────────────────

	it('calls onChange with the selected option', async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				options={fruits}
				onChange={handleChange}
			/>
		);

		await user.type(screen.getByRole('combobox'), 'ban');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		await user.click(screen.getByText('Banana'));
		expect(handleChange).toHaveBeenCalledWith({
			label: 'Banana',
			value: 'banana',
		});
		expect(screen.getByRole('combobox')).toHaveValue('Banana');
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('marks selected option with aria-selected', async () => {
		window.HTMLElement.prototype.scrollIntoView = function () {};
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		// Select banana first
		await user.type(screen.getByRole('combobox'), 'ban');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);
		await user.click(screen.getByText('Banana'));

		// Re-open dropdown using ArrowDown (without clearing so selectedValue is preserved)
		await user.keyboard('{ArrowDown}');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		const option = screen.getByRole('option', { name: 'Banana' });
		expect(option).toHaveAttribute('aria-selected', 'true');
	});

	// ── Clear button ───────────────────────────────────────────────────────────

	it('shows clear button after typing', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		await user.type(screen.getByRole('combobox'), 'a');
		expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
	});

	it('clears input and calls onChange(null) when clear is clicked', async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				options={fruits}
				onChange={handleChange}
			/>
		);

		await user.type(screen.getByRole('combobox'), 'Apple');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);
		await user.click(screen.getByText('Apple'));
		expect(screen.getByRole('combobox')).toHaveValue('Apple');

		await user.click(screen.getByRole('button', { name: 'Clear' }));
		expect(screen.getByRole('combobox')).toHaveValue('');
		expect(handleChange).toHaveBeenLastCalledWith(null);
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	// ── Keyboard navigation ────────────────────────────────────────────────────

	it('highlights options with ArrowDown', async () => {
		window.HTMLElement.prototype.scrollIntoView = function () {};
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		await user.type(screen.getByRole('combobox'), 'a');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		await user.keyboard('{ArrowDown}');
		const options = screen.getAllByRole('option');
		// First option should be highlighted (aria-activedescendant set)
		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-activedescendant',
			options[0].id
		);
	});

	it('highlights options with ArrowUp', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		await user.type(screen.getByRole('combobox'), 'a');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		// Go down twice, then up once → back to index 0
		await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}');
		const options = screen.getAllByRole('option');
		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-activedescendant',
			options[0].id
		);
	});

	it('clears highlight when ArrowUp is pressed at the first option', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		await user.type(screen.getByRole('combobox'), 'a');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		// ArrowDown → index 0, then ArrowUp → index -1 (no highlight)
		await user.keyboard('{ArrowDown}{ArrowUp}');
		expect(
			screen.getByRole('combobox').getAttribute('aria-activedescendant')
		).toBeFalsy();
	});

	it('selects the highlighted option on Enter', async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				options={fruits}
				onChange={handleChange}
			/>
		);

		await user.type(screen.getByRole('combobox'), 'ap');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		await user.keyboard('{ArrowDown}{Enter}');
		expect(handleChange).toHaveBeenCalledWith({
			label: 'Apple',
			value: 'apple',
		});
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('closes the dropdown on Escape', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		await user.type(screen.getByRole('combobox'), 'a');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		await user.keyboard('{Escape}');
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('opens dropdown with ArrowDown when input has value but list is closed', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		const input = screen.getByRole('combobox');
		await user.type(input, 'a');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		// Close via Escape
		await user.keyboard('{Escape}');
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

		// Re-open with ArrowDown
		await user.keyboard('{ArrowDown}');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);
	});

	// ── Custom rendering ───────────────────────────────────────────────────────

	it('uses renderOption to render custom option content', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				options={fruits}
				renderOption={(opt) => (
					<span data-testid="custom-option">{opt.label} 🍎</span>
				)}
			/>
		);

		await user.type(screen.getByRole('combobox'), 'apple');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		expect(screen.getByTestId('custom-option')).toHaveTextContent('Apple 🍎');
	});

	// ── Custom getOptionLabel / getOptionValue ─────────────────────────────────

	it('supports custom getOptionLabel and getOptionValue', async () => {
		interface Country {
			name: string;
			code: string;
		}
		const countries: Country[] = [
			{ name: 'United States', code: 'us' },
			{ name: 'United Kingdom', code: 'uk' },
		];
		const handleChange = vi.fn();
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

		render(
			<Autocomplete
				id="country"
				label="Country"
				options={countries}
				getOptionLabel={(c) => c.name}
				getOptionValue={(c) => c.code}
				onChange={handleChange}
			/>
		);

		await user.type(screen.getByRole('combobox'), 'unit');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		expect(screen.getByText('United States')).toBeInTheDocument();
		expect(screen.getByText('United Kingdom')).toBeInTheDocument();

		await user.click(screen.getByText('United States'));
		expect(handleChange).toHaveBeenCalledWith({
			name: 'United States',
			code: 'us',
		});
		expect(screen.getByRole('combobox')).toHaveValue('United States');
	});

	// ── Controlled value ───────────────────────────────────────────────────────

	it('displays the controlled value label in the input', () => {
		render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				options={fruits}
				value={{ label: 'Cherry', value: 'cherry' }}
			/>
		);
		expect(screen.getByRole('combobox')).toHaveValue('Cherry');
	});

	it('updates the displayed label when the controlled value changes', () => {
		const { rerender } = render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				options={fruits}
				value={{ label: 'Apple', value: 'apple' }}
			/>
		);
		expect(screen.getByRole('combobox')).toHaveValue('Apple');

		rerender(
			<Autocomplete
				id="fruit"
				label="Fruit"
				options={fruits}
				value={{ label: 'Cherry', value: 'cherry' }}
			/>
		);
		expect(screen.getByRole('combobox')).toHaveValue('Cherry');
	});

	it('clears the input when controlled value is set to null', () => {
		const { rerender } = render(
			<Autocomplete
				id="fruit"
				label="Fruit"
				options={fruits}
				value={{ label: 'Apple', value: 'apple' }}
			/>
		);
		rerender(
			<Autocomplete id="fruit" label="Fruit" options={fruits} value={null} />
		);
		expect(screen.getByRole('combobox')).toHaveValue('');
	});

	// ── ARIA attributes ────────────────────────────────────────────────────────

	it('sets aria-expanded=false when dropdown is closed', () => {
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);
		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-expanded',
			'false'
		);
	});

	it('sets aria-expanded=true when dropdown is open', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		await user.type(screen.getByRole('combobox'), 'a');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('combobox')).toHaveAttribute(
				'aria-expanded',
				'true'
			)
		);
	});

	it('sets aria-haspopup="listbox" on the input', () => {
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);
		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-haspopup',
			'listbox'
		);
	});

	it('sets aria-controls on the input pointing to the listbox id', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		await user.type(screen.getByRole('combobox'), 'a');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		const input = screen.getByRole('combobox');
		const listbox = screen.getByRole('listbox');
		expect(input).toHaveAttribute('aria-controls', listbox.id);
	});

	it('sets aria-activedescendant to the highlighted option id', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(<Autocomplete id="fruit" label="Fruit" options={fruits} />);

		await user.type(screen.getByRole('combobox'), 'a');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		// No item highlighted initially
		expect(
			screen.getByRole('combobox').getAttribute('aria-activedescendant')
		).toBeFalsy();

		await user.keyboard('{ArrowDown}');
		const firstOption = screen.getAllByRole('option')[0];
		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-activedescendant',
			firstOption.id
		);
	});

	// ── Accessibility ──────────────────────────────────────────────────────────

	it('has no accessibility violations in the default (closed) state', async () => {
		vi.useRealTimers();
		const { container } = render(
			<Autocomplete id="fruit" label="Fruit" options={fruits} />
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('has no accessibility violations in the open state', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		const { container } = render(
			<Autocomplete id="fruit" label="Fruit" options={fruits} />
		);

		await user.type(screen.getByRole('combobox'), 'a');
		vi.runAllTimers();
		await waitFor(() =>
			expect(screen.getByRole('listbox')).toBeInTheDocument()
		);

		vi.useRealTimers();
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});
