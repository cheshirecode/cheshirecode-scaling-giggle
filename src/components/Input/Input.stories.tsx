import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label text',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'password', 'number'],
      description: 'HTML input type',
    },
    required: {
      control: 'boolean',
      description: 'Mark field as required',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input interaction',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below input',
    },
  },
  args: {
    onChange: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email',
  },
};

export const Required: Story = {
  args: {
    label: 'Full Name',
    type: 'text',
    placeholder: 'John Doe',
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Phone Number',
    type: 'tel',
    placeholder: '(514) 123-4567',
    helperText: 'Format: (XXX) XXX-XXXX',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    type: 'text',
    value: 'Cannot edit this',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    required: true,
  },
};

export const Number: Story = {
  args: {
    label: 'Age',
    type: 'number',
    placeholder: '18',
    helperText: 'Must be 18 or older',
  },
};

export const LongLabel: Story = {
  args: {
    label: 'This is a very long label to test how the component handles extended text',
    type: 'text',
    placeholder: 'Enter value',
  },
};

export const ErrorWithHelperText: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    value: 'bad@',
    error: 'Invalid email format',
    helperText: 'We will never share your email',
  },
};

export const RequiredWithError: Story = {
  args: {
    label: 'Full Name',
    type: 'text',
    required: true,
    error: 'This field is required',
  },
};
