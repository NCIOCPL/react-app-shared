import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		environment: 'jsdom',
		include: ['src/**/*.test.{ts,tsx}'],
		setupFiles: ['./src/setupTests.ts'],
		css: {
			modules: {
				classNameStrategy: 'non-scoped',
			},
		},
		alias: {
			'@components': path.resolve(__dirname, './src/components'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@utils': path.resolve(__dirname, './src/utils'),
		},
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/**/*.stories.{ts,tsx}',
				'src/**/*.test.{ts,tsx}',
				'src/**/*.d.ts',
				'src/**/index.ts',
				'src/setupTests.ts',
			],
			thresholds: {
				branches: 80,
				functions: 80,
				lines: 80,
				statements: 80,
			},
		},
	},
});
