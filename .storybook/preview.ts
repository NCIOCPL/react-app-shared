import type { Preview } from '@storybook/react';
import { createElement } from 'react';

import './preview.scss';

const preview: Preview = {
	// Components' styles are scoped to the `.nci-react-app` wrapper every app
	// renders (see "Styling rules" in the README).
	decorators: [
		(Story) => createElement('div', { className: 'nci-react-app' }, Story()),
	],
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
