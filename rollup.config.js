import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import scss from 'rollup-plugin-scss';
import postcssModules from 'postcss-modules';

const external = ['react', 'react-dom', 'react/jsx-runtime'];

const entries = {
	index: 'src/index.ts',
	'components/core/index': 'src/components/core/index.ts',
	'components/ncids/index': 'src/components/ncids/index.ts',
};

function scssModules() {
	const cssModulesExports = {};
	return scss({
		processor: () => ({
			plugins: [
				postcssModules({
					generateScopedName: '[name]__[local]___[hash:base64:5]',
					getJSON(cssFileName, json) {
						cssModulesExports[cssFileName] = json;
					},
				}),
			],
		}),
		output: false,
	});
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
			scssModules(),
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
			scssModules(),
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
