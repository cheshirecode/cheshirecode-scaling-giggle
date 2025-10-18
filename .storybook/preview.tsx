import type { Preview, Decorator } from '@storybook/react-vite';
import { useEffect } from 'react';
import { Provider } from 'jotai';
import { applyTheme } from '../src/atoms/themeAtom';
import type { Theme } from '../src/atoms/themeAtom';
import '../src/styles/reset.css';
import '../src/styles/tokens.css';
import '../src/styles/base.css';

/**
 * Decorator to apply theme from Storybook toolbar
 */
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as Theme) || 'light';

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <Provider>
      <Story />
    </Provider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // Disable backgrounds since we're using theme
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'system',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'system', title: 'System', icon: 'browser' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
