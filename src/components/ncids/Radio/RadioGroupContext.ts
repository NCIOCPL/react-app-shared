import React, { createContext, useContext } from 'react';

export interface RadioGroupContextValue {
	/** Shared name applied to every radio in the group */
	name: string;
	/** Currently selected value (undefined when nothing is selected) */
	selectedValue?: string;
	/** Selection handler supplied by the group */
	onSelect: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
	/** Render radios in the group as tiles */
	tile: boolean;
	/** Disable every radio in the group */
	disabled: boolean;
	/** Mark every radio in the group as required */
	required: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(
	null
);

export const useRadioGroup = (): RadioGroupContextValue | null =>
	useContext(RadioGroupContext);
