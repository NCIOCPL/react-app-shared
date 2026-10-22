import path from 'path';
import { describe, expect, it } from 'vitest';

import {
	compileComponentStyle,
	findComponentStyles,
} from '../../scripts/component-styles.js';

// Every component ships its own stylesheet, loaded automatically with the
// component. These checks enforce the styling rules in the README: all rules
// are scoped under .nci-react-app, and nothing page-level or external is
// emitted, so the styles can never leak onto a host page.

const files = findComponentStyles();
const name = (file: string) => path.basename(file, '.scss');

/** Every selector in expanded CSS output (one per line). */
function selectors(css: string): string[] {
	const result: string[] = [];
	let keyframesDepth = 0;
	let depth = 0;
	for (const raw of css.split('\n')) {
		const line = raw.trim();
		if (line.startsWith('@keyframes')) keyframesDepth = depth + 1;
		if (line.endsWith('{') || line.endsWith(',')) {
			const isAtRule = line.startsWith('@');
			const inKeyframes = keyframesDepth > 0 && depth >= keyframesDepth;
			if (!isAtRule && !inKeyframes) {
				result.push(line.replace(/\s*[{,]$/, ''));
			}
		}
		depth += (line.match(/{/g) || []).length;
		depth -= (line.match(/}/g) || []).length;
		if (keyframesDepth > 0 && depth < keyframesDepth) keyframesDepth = 0;
	}
	return result;
}

describe('component stylesheets', () => {
	it('exist for every NCIDS component', () => {
		expect(files.map(name)).toEqual([
			'Autocomplete',
			'Collection',
			'Dropdown',
			'Pager',
			'Radio',
			'TextInput',
		]);
	});

	describe.each(files.map((file) => [name(file), file]))('%s', (_, file) => {
		// Expanded output keeps USWDS's documentation comments (and the rules
		// they leave empty); compressed output, which ships, drops both.
		const css = compileComponentStyle(file, { style: 'expanded' })
			.replace(/\/\*[\s\S]*?\*\//g, '')
			.replace(/^[^{}\n]+\{\s*\}/gm, '');

		it('scopes every rule under .nci-react-app', () => {
			const unscoped = selectors(css).filter(
				(selector) =>
					!selector.startsWith(':where(.nci-react-app) ') &&
					!selector.startsWith('.nci-react-app ')
			);
			expect(unscoped).toEqual([]);
		});

		it('emits no page-level selectors', () => {
			const pageLevel = selectors(css).filter((selector) =>
				/(^|[\s>+~(])(html|body|:root)\b/.test(selector)
			);
			expect(pageLevel).toEqual([]);
		});

		it('emits no @font-face or @import', () => {
			expect(css).not.toMatch(/@font-face|@import/);
		});

		it('references no external images', () => {
			const urls = css.match(/url\([^)]*\)/g) || [];
			expect(urls.filter((url) => !url.includes('data:'))).toEqual([]);
		});
	});
});
