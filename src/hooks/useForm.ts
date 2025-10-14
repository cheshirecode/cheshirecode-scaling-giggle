import { useState, useCallback, type ChangeEvent, type FormEvent } from 'react';

export interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
}

export type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

export type FormValidators<T> = {
  [K in keyof T]?: (value: T[K]) => string | undefined;
};

export interface UseFormOptions<T> {
  initialValues: T;
  validators?: FormValidators<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  handleChange: (
    field: keyof T
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldError: (field: keyof T, error: string) => void;
  reset: () => void;
}

/**
 * Custom hook for form state management with validation
 *
 * @example
 * ```tsx
 * interface ContactForm {
 *   firstName: string;
 *   lastName: string;
 *   email: string;
 * }
 *
 * function ContactForm() {
 *   const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm<ContactForm>({
 *     initialValues: {
 *       firstName: '',
 *       lastName: '',
 *       email: '',
 *     },
 *     validators: {
 *       firstName: (value) => !value ? 'First name is required' : undefined,
 *       email: validateEmail,
 *     },
 *     onSubmit: async (values) => {
 *       await submitForm(values);
 *     },
 *   });
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         value={values.firstName}
 *         onChange={handleChange('firstName')}
 *         onBlur={handleBlur('firstName')}
 *       />
 *       {touched.firstName && errors.firstName && <span>{errors.firstName}</span>}
 *     </form>
 *   );
 * }
 * ```
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validators = {},
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]): string | undefined => {
      const validator = validators[field];
      if (validator) {
        return validator(value);
      }
      return undefined;
    },
    [validators]
  );

  /**
   * Validate all fields
   */
  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const field in values) {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  /**
   * Handle input change
   */
  const handleChange = useCallback(
    (field: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value as T[keyof T];

      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors]
  );

  /**
   * Handle input blur (validate on blur)
   */
  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));

      const error = validateField(field, values[field]);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    },
    [values, validateField]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {} as Record<keyof T, boolean>
      );
      setTouched(allTouched);

      // Validate all fields
      const isValid = validateAll();

      if (!isValid) {
        return;
      }

      // Submit form
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll, onSubmit]
  );

  /**
   * Set field value programmatically
   */
  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  /**
   * Set field error programmatically
   */
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  /**
   * Reset form to initial values
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    reset,
  };
}
