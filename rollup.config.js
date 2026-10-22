import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import path from 'node:path';

import { compileComponentStyle } from './scripts/component-styles.js';

const external = ['react', 'react-dom', 'react/jsx-runtime'];

const entries = {
	index: 'src/index.ts',
	'components/core/index': 'src/components/core/index.ts',
	'components/ncids/index': 'src/components/ncids/index.ts',
};

/**
 * Components import their own stylesheet (`import './Autocomplete.scss'`).
 * Compile each one to a CSS file next to the component's output module and
 * keep the import, pointed at the .css, so the consuming app's bundler
 * includes the styles whenever the component is used.
 */
function componentStyles() {
	const styles = new Map();
	return {
		name: 'component-styles',
		resolveId(source, importer) {
			if (!importer || !source.endsWith('.scss')) return null;
			const file = path.resolve(path.dirname(importer), source);
			styles.set(file, path.relative('src', file).replace(/\.scss$/, '.css'));
			return { id: source.replace(/\.scss$/, '.css'), external: true };
		},
		generateBundle() {
			for (const [file, fileName] of styles) {
				this.emitFile({
					type: 'asset',
					fileName,
					source: compileComponentStyle(file),
				});
			}
		},
	};
}

export default [
	// ESM build
	{
		input: entries,
		output: {
			dir: 'dist/esm',
			format: 'esm',
			sourcemap: true,
			preserveModules: true,
			preserveModulesRoot: 'src',
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfig: './tsconfig.build.json',
				outDir: 'dist/esm',
				declaration: false,
				declarationMap: false,
				declarationDir: undefined,
			}),
			componentStyles(),
		],
		external,
	},
	// CJS build
	{
		input: entries,
		output: {
			dir: 'dist/cjs',
			format: 'cjs',
			sourcemap: true,
			preserveModules: true,
			preserveModulesRoot: 'src',
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfig: './tsconfig.build.json',
				outDir: 'dist/cjs',
				declaration: false,
				declarationMap: false,
				declarationDir: undefined,
			}),
			componentStyles(),
		],
		external,
	},
	// Type declarations
	{
		input: entries,
		output: {
			dir: 'dist/types',
			format: 'esm',
			preserveModules: true,
			preserveModulesRoot: 'src',
		},
		plugins: [dts()],
		external: [/\.scss$/, /\.css$/],
	},
];
