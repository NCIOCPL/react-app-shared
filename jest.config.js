/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.json',
			},
		],
	},
	moduleNameMapper: {
		'\\.(css|scss)$': '<rootDir>/src/__mocks__/styleMock.js',
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	setupFilesAfterSetup: ['<rootDir>/src/setupTests.ts'],
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.stories.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/index.ts',
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
};
