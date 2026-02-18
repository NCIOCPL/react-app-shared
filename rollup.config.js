import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import scss from 'rollup-plugin-scss';
import postcssModules from 'postcss-modules';

const external = ['react', 'react-dom', 'react/jsx-runtime'];

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
		input: 'src/index.ts',
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
				declarationDir: undefined,
			}),
			scssModules(),
		],
		external,
	},
	// CJS build
	{
		input: 'src/index.ts',
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
				declarationDir: undefined,
			}),
			scssModules(),
		],
		external,
	},
	// Type declarations
	{
		input: 'src/index.ts',
		output: {
			dir: 'dist/types',
			format: 'esm',
			preserveModules: true,
			preserveModulesRoot: 'src',
		},
		plugins: [dts()],
		external: [/\.scss$/, /\.css$/],
	},
	// Standalone CSS bundle
	{
		input: 'src/index.ts',
		output: {
			dir: 'dist/styles',
			format: 'esm',
			assetFileNames: '[name][extname]',
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfig: './tsconfig.build.json',
				outDir: 'dist/styles',
				declaration: false,
				declarationDir: undefined,
			}),
			scss({
				output: 'dist/styles/index.css',
			}),
		],
		external,
	},
];
