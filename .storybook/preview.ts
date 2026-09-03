import type { Preview } from '@storybook/web-components';
// Load the design tokens + base font so every story is themed correctly.
import '../src/styles/tokens.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'sand',
      values: [
        { name: 'sand', value: '#f4f1de' },
        { name: 'surface', value: '#ffffff' },
        { name: 'navy', value: '#003049' },
      ],
    },
    options: {
      storySort: {
        order: ['Design', ['Colors'], 'Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages'],
      },
    },
  },
};

export default preview;
