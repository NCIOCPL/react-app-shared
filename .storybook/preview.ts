import type { Preview } from '@storybook/react';

import './preview.scss';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			// axe-core configuration
			config: {},
			options: {},
		},
	},
};

export default preview;
