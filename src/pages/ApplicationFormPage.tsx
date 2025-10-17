import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { Spinner } from '@/components/Spinner/Spinner';
import { useToast } from '@/hooks/useToast';
import { fetcher } from '@/services/api';
import { validateEmail, validatePhone, validateRequired } from '@/utils/validators';
import { formatPercentage, formatTerm } from '@/utils/formatters';
import type { Product, CreateApplication, Application } from '@/types/api';
import './ApplicationFormPage.css';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface FormTouched {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  phone: boolean;
}

/**
 * Application Form Page - Screen 2
 * Route: /apply/:productId
 *
 * Layout per wireframe:
 * - Left: Product summary card
 * - Right: Contact information form
 * - Responsive: Stack vertically on mobile
 */
export function ApplicationFormPage(): JSX.Element {
  const { t } = useTranslation();
  const [, params] = useRoute<{ productId?: string }>('/apply/:productId');
  const [, setLocation] = useLocation();
  const { showToast } = useToast();

  const productId = params?.productId ? parseInt(params.productId, 10) : undefined;

  // Fetch product details
  const { data: products, isLoading: isLoadingProduct } = useSWR<{ products: Product[] }>(
    '/products/best',
    fetcher
  );
  const productError = !products && !isLoadingProduct;

  const product = products?.products.find((p) => p.id === productId);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [touched, setTouched] = useState<FormTouched>({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  });

  // Create application mutation
  const { trigger, isMutating } = useSWRMutation(
    '/applications',
    async (url: string, { arg }: { arg: CreateApplication }) => {
      return fetcher<Application>(url, {
        method: 'POST',
        body: JSON.stringify(arg),
      });
    }
  );

  // Validation
  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return validateRequired(value, field === 'firstName' ? 'First name' : 'Last name');
      case 'email':
        return validateRequired(value, 'Email') ?? validateEmail(value);
      case 'phone':
        return validateRequired(value, 'Phone') ?? validatePhone(value);
      default:
        return undefined;
    }
  };

  const errors: FormErrors = {
    firstName: touched.firstName ? validateField('firstName', formData.firstName) : undefined,
    lastName: touched.lastName ? validateField('lastName', formData.lastName) : undefined,
    email: touched.email ? validateField('email', formData.email) : undefined,
    phone: touched.phone ? validateField('phone', formData.phone) : undefined,
  };

  const hasErrors = Object.values(errors).some((error) => error !== undefined);
  const isFormValid =
    !hasErrors && Object.values(formData).every((value: string) => value.trim() !== '');

  // Handlers
  const handleChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleBlur = (field: keyof FormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all fields to show validation errors
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    });

    if (!isFormValid || !productId) {
      return;
    }

    trigger({ productId })
      .then(() => {
        showToast({
          type: 'success',
          message: t('application.applicationCreated'),
        });
        setLocation('/applications');
        return undefined;
      })
      .catch((err: unknown) => {
         
        console.error('Application submission failed:', err);
        showToast({
          type: 'error',
          message: t('application.applicationFailed'),
        });
      });
  };

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="page page-center">
        <Spinner size="large" />
      </div>
    );
  }

  // Error states
  if (productError || !product) {
    return (
      <div className="page page-center">
        <div className="error-message">
          <h2>{t('application.productNotFound')}</h2>
          <p>{t('application.productNotFoundDesc')}</p>
          <Button variant="primary" onClick={() => setLocation('/')}>
            {t('application.backToProducts')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="application-form-container">
        {/* Left: Product Summary */}
        <aside className="product-summary">
          <h2 className="section-title">{t('application.selectedProduct')}</h2>
          <ProductCard product={product} isBest={false} />
          <div className="product-details">
            <div className="detail-row">
              <span className="detail-label">{t('products.rate')}:</span>
              <span className="detail-value">{formatPercentage(product.bestRate)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t('products.term')}:</span>
              <span className="detail-value">{formatTerm(product.term)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t('products.lender')}:</span>
              <span className="detail-value">{product.lenderName}</span>
            </div>
          </div>
        </aside>

        {/* Right: Contact Form */}
        <section className="contact-form-section">
          <h2 className="section-title">{t('application.yourInformation')}</h2>
          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            className="contact-form"
            noValidate
          >
            <Input
              label={t('application.firstName')}
              type="text"
              value={formData.firstName}
              onChange={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              error={errors.firstName}
              required
              disabled={isMutating}
            />

            <Input
              label={t('application.lastName')}
              type="text"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              error={errors.lastName}
              required
              disabled={isMutating}
            />

            <Input
              label={t('application.email')}
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              error={errors.email}
              required
              disabled={isMutating}
            />

            <Input
              label={t('application.phone')}
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              onBlur={handleBlur('phone')}
              error={errors.phone}
              required
              disabled={isMutating}
            />

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                disabled={!isFormValid || isMutating}
                loading={isMutating}
              >
                {t('application.saveApplicantInfo')}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
