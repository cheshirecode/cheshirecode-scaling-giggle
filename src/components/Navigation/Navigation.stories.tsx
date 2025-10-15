import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from './Navigation';

/**
 * Navigation component provides app-wide navigation with:
 * - SPA routing using wouter
 * - Theme toggle (Light/Dark/System)
 * - Language switcher (EN/FR)
 * - Active link highlighting
 */
const meta = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default navigation state showing home as active
 */
export const Default: Story = {};

/**
 * Navigation component is fully interactive in Storybook:
 * - Click links to navigate (simulated)
 * - Toggle theme (Light/Dark/System)
 * - Switch language (EN/FR)
 * - All state changes are reflected in the UI
 */
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates the full interactivity of the Navigation component. Try clicking the theme toggle and language switcher!',
      },
    },
  },
};
