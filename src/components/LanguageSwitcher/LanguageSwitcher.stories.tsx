import type { Meta, StoryObj } from '@storybook/react';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * LanguageSwitcher component allows users to toggle between English and French.
 *
 * Features:
 * - Two language options: EN (English) and FR (French)
 * - Visual feedback for active language
 * - Fully keyboard accessible
 * - ARIA labels for screen readers
 * - Integrates with react-i18next
 */
const meta = {
  title: 'Components/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default language switcher with EN/FR options
 */
export const Default: Story = {};

/**
 * Interactive demo - click to switch languages
 * The selected language will be applied to the entire app via react-i18next
 */
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Click each button to switch languages. The active language is highlighted and applied globally to all UI text.',
      },
    },
  },
};

/**
 * Language switcher in navigation context
 */
export const InNavigation: Story = {
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: 'var(--color-text)' }}>Language:</span>
          <Story />
        </div>
      </div>
    ),
  ],
};
