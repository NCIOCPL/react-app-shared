export const loadPaths: string[];
export function findComponentStyles(): string[];
export function compileComponentStyle(
	file: string,
	options?: { style?: 'compressed' | 'expanded' }
): string;
