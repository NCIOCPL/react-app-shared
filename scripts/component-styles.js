// Compiles each component's own stylesheet (src/components/**/<Component>.scss).
//
// Shared by the rollup build, which emits the CSS next to each component and
// keeps the component's import of it, and by the unit test that enforces the
// styling rules (every rule scoped under .nci-react-app, nothing page-level).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ncidsCss = path.join(root, 'node_modules/@nciocpl/ncids-css');
const imageDir = path.join(ncidsCss, 'uswds-img');

export const loadPaths = [
	path.join(ncidsCss, 'packages'),
	path.join(ncidsCss, 'uswds-packages'),
];

/** Absolute paths of every component stylesheet, e.g. Autocomplete/Autocomplete.scss. */
export function findComponentStyles() {
	const componentsDir = path.join(root, 'src/components');
	return fs
		.readdirSync(componentsDir, { recursive: true })
		.filter((file) => /(^|[/\\])([A-Z]\w*)[/\\]\2\.scss$/.test(file))
		.map((file) => path.join(componentsDir, file))
		.sort();
}

/**
 * NCIDS styles reference images at the USWDS `$theme-image-path` (/img). Inline
 * them as data URIs so components render fully styled without the app having
 * to serve the USWDS image directory.
 */
function inlineImages(css) {
	return css.replace(
		/url\(["']?\/img\/([^"')]+)["']?\)/g,
		(_match, file) =>
			`url("data:image/svg+xml;base64,${fs
				.readFileSync(path.join(imageDir, file))
				.toString('base64')}")`
	);
}

/** Compile one component stylesheet to CSS. */
export function compileComponentStyle(file, { style = 'compressed' } = {}) {
	const { css } = sass.compile(file, {
		loadPaths,
		style,
		quietDeps: true,
		silenceDeprecations: ['mixed-decls'],
	});
	return inlineImages(css);
}
