import path from 'path';

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(ts|tsx)'],
	addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	typescript: {
		check: true,
	},
	staticDirs: [
		{
			from: path.resolve(
				__dirname,
				'../node_modules/@nciocpl/ncids-css/uswds-img'
			),
			to: '/img',
		},
	],
	viteFinal: async (config) => {
		config.css = {
			...config.css,
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler',
					loadPaths: [
						path.resolve(
							__dirname,
							'../node_modules/@nciocpl/ncids-css/packages'
						),
						path.resolve(
							__dirname,
							'../node_modules/@nciocpl/ncids-css/uswds-packages'
						),
					],
				},
			},
		};
		return config;
	},
};

export default config;
