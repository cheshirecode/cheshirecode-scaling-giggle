import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useForm } from './useForm';

interface TestForm {
  email: string;
  name: string;
  age: number;
}

describe('useForm', () => {
  const initialValues: TestForm = {
    email: '',
    name: '',
    age: 0,
  };

  it('initializes with provided values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('updates value on handleChange', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      const event = {
        target: { value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange('email')(event);
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('marks field as touched on handleBlur', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      result.current.handleBlur('email')();
    });

    expect(result.current.touched.email).toBe(true);
  });

  it('validates field on blur when validator is provided', () => {
    const emailValidator = (value: string) => (!value ? 'Email is required' : undefined);

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validators: { email: emailValidator },
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      result.current.handleBlur('email')();
    });

    expect(result.current.errors.email).toBe('Email is required');
  });

  it('clears error when user starts typing', () => {
    const emailValidator = (value: string) => (!value ? 'Email is required' : undefined);

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validators: { email: emailValidator },
        onSubmit: vi.fn(),
      })
    );

    // Trigger validation error
    act(() => {
      result.current.handleBlur('email')();
    });

    expect(result.current.errors.email).toBe('Email is required');

    // Start typing
    act(() => {
      const event = { target: { value: 'test' } } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange('email')(event);
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('validates all fields on submit', async () => {
    const validators = {
      email: (value: string) => (!value ? 'Email is required' : undefined),
      name: (value: string) => (!value ? 'Name is required' : undefined),
    };

    const handleSubmit = vi.fn();

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validators,
        onSubmit: handleSubmit,
      })
    );

    await act(async () => {
      const event = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>;
      await result.current.handleSubmit(event);
    });

    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.name).toBe('Name is required');
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit when form is valid', async () => {
    const handleSubmit = vi.fn();

    const { result } = renderHook(() =>
      useForm({
        initialValues: { ...initialValues, email: 'test@example.com', name: 'John' },
        validators: {
          email: (value: string) => (!value ? 'Email is required' : undefined),
          name: (value: string) => (!value ? 'Name is required' : undefined),
        },
        onSubmit: handleSubmit,
      })
    );

    await act(async () => {
      const event = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>;
      await result.current.handleSubmit(event);
    });

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'John',
      age: 0,
    });
  });

  it('marks all fields as touched on submit', async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    await act(async () => {
      const event = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>;
      await result.current.handleSubmit(event);
    });

    expect(result.current.touched.email).toBe(true);
    expect(result.current.touched.name).toBe(true);
    expect(result.current.touched.age).toBe(true);
  });

  it('sets isSubmitting during submission', async () => {
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });

    const handleSubmit = vi.fn(() => submitPromise);

    const { result } = renderHook(() =>
      useForm({
        initialValues: { ...initialValues, email: 'test@example.com' },
        validators: {
          email: (value: string) => (!value ? 'Email is required' : undefined),
        },
        onSubmit: handleSubmit,
      })
    );

    // Start submission
    let submitCompleted = false;
    act(() => {
      const event = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>;
      void result.current.handleSubmit(event).then(() => {
        submitCompleted = true;
      });
    });

    // Wait for state update
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Resolve submission
    resolveSubmit!();
    await act(async () => {
      await submitPromise;
    });

    // Should have completed
    expect(submitCompleted).toBe(true);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('allows programmatic field value updates', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      if (result.current) {
        result.current.setFieldValue('email', 'new@example.com');
      }
    });

    expect(result.current?.values.email).toBe('new@example.com');
  });

  it('allows programmatic error setting', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      if (result.current) {
        result.current.setFieldError('email', 'Custom error message');
      }
    });

    expect(result.current?.errors.email).toBe('Custom error message');
  });

  it('resets form to initial values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      })
    );

    // Make changes
    act(() => {
      if (result.current) {
        const event = {
          target: { value: 'changed@example.com' },
        } as React.ChangeEvent<HTMLInputElement>;
        result.current.handleChange('email')(event);
        result.current.handleBlur('email')();
        result.current.setFieldError('email', 'Some error');
      }
    });

    expect(result.current?.values.email).toBe('changed@example.com');
    expect(result.current?.touched.email).toBe(true);
    expect(result.current?.errors.email).toBe('Some error');

    // Reset
    act(() => {
      if (result.current) {
        result.current.reset();
      }
    });

    expect(result.current?.values).toEqual(initialValues);
    expect(result.current?.errors).toEqual({});
    expect(result.current?.touched).toEqual({});
    expect(result.current?.isSubmitting).toBe(false);
  });
});
