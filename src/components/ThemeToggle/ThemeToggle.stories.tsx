import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';

/**
 * ThemeToggle component allows users to switch between light, dark, and system themes.
 *
 * Features:
 * - Three theme options: Light ☀️, Dark 🌙, System 💻
 * - Persists preference to localStorage
 * - Visual feedback for active theme
 * - Fully keyboard accessible
 * - ARIA labels for screen readers
 */
const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default theme toggle with three options
 */
export const Default: Story = {};

/**
 * Interactive demo - click to switch themes
 * The selected theme will be applied to the document and persisted to localStorage
 */
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Click each button to switch themes. The active theme is highlighted and applied to the entire document.',
      },
    },
  },
};

/**
 * Theme toggle in navigation context
 */
export const InNavigation: Story = {
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: 'var(--color-text)' }}>Theme:</span>
          <Story />
        </div>
      </div>
    ),
  ],
};
