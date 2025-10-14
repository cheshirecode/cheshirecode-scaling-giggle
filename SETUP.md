# Developer Setup Guide

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your name for X-Nesto-Candidat header

# Start development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Check coverage
npm run test:coverage

# Lint and format
npm run lint
npm run format
```

## Environment Variables

Create `.env.local` in the root directory:

```env
VITE_CANDIDATE_NAME=Your Name Here
```

This is used in the `X-Nesto-Candidat` API header required by the Nesto API.

## Project Structure

```
src/
  components/     # Shared UI (Button, Input, Toast, Card, Spinner, Navigation, ErrorBoundary)
  features/       # Business logic (products/, applications/)
  utils/          # Pure utilities (formatters, validators, helpers)
  services/       # API layer, external integrations
    api.ts        # Fetcher for SWR
    i18n/         # i18n config and translations (en.json, fr.json, config.ts)
  atoms/          # Jotai atoms (toastsAtom, themeAtom)
  hooks/          # Custom hooks (useForm, useToast)
  types/          # TypeScript types (api.ts, errors.ts)
  styles/         # Global CSS (tokens.css, reset.css, base.css)
```

**Key principles**:
- `/components` = shared, no business logic
- `/features` = domain-specific with business logic
- `/utils` = pure functions (no side effects)
- `/services` = API/external integrations (side effects)

## Common Patterns

### Fetching Data with SWR

```typescript
import useSWR from 'swr';
import { fetcher } from '@/services/api';
import { Product } from '@/types/api';

function ProductsList() {
  const { data, error, isLoading } = useSWR<Product[]>('/products', fetcher);

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <Spinner />;
  return <div>{data.map(p => <ProductCard key={p.id} product={p} />)}</div>;
}
```

### Mutating Data with SWR

```typescript
import useSWRMutation from 'swr/mutation';
import { post } from '@/services/api';
import { CreateApplication } from '@/types/api';

function ProductCard({ product }) {
  const { trigger, isMutating } = useSWRMutation(
    '/applications',
    (url, { arg }: { arg: CreateApplication }) => post(url, arg)
  );

  const handleSelect = async () => {
    await trigger({ productId: product.id });
  };

  return <button onClick={handleSelect} disabled={isMutating}>Select</button>;
}
```

### Using Atoms (Jotai)

```typescript
import { useAtom } from 'jotai';
import { themeAtom, applyTheme } from '@/atoms/themeAtom';
import { toastsAtom } from '@/atoms/toastsAtom';

function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme); // Apply to DOM
  };

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}

function useToast() {
  const [toasts, setToasts] = useAtom(toastsAtom);

  const addToast = (message: string, type: ToastType = 'info') => {
    const toast = {
      id: generateToastId(),
      type,
      message,
      duration: 5000,
    };
    setToasts([...toasts, toast]);
  };

  return { addToast };
}
```

### Routing with wouter

```typescript
import { Link, useLocation, useRoute } from 'wouter';

// Navigation
<Link href="/applications">View Applications</Link>

// Programmatic navigation
const [, setLocation] = useLocation();
setLocation('/applications');

// Route params
const [match, params] = useRoute('/applications/:id');
if (match) {
  console.log(params.id);
}
```

### Forms (Custom Hook)

```typescript
import { useForm } from '@/hooks/useForm';
import { validateEmail, validateRequired } from '@/utils/validators';

function ContactForm() {
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: { email: '', firstName: '', lastName: '', phone: '' },
    validators: {
      email: validateEmail,
      firstName: validateRequired,
      lastName: validateRequired,
      phone: validateRequired,
    },
  });

  return (
    <form onSubmit={handleSubmit(async (values) => {
      await post('/applications', values);
    })}>
      <Input
        name="email"
        value={values.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
      />
    </form>
  );
}
```

### Internationalization (i18n)

```typescript
import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('products.title')}</h1>
      <button onClick={() => i18n.changeLanguage('fr')}>Français</button>
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
    </div>
  );
}
```

## Architectural Decisions

### Why Jotai instead of Redux?
- Minimal global state needed (only toasts + theme)
- Atomic updates (no need for reducers)
- Better TypeScript inference
- Smaller bundle size (2.9KB vs 40KB for Redux)

### Why SWR instead of React Query?
- Simpler API for basic CRUD
- Built-in cache and revalidation
- Smaller bundle (4KB vs 13KB)
- Perfect for this scale (3 screens, simple CRUD)

### Why wouter instead of react-router-dom?
- Only 3 routes needed (/, /applications, /applications/:id)
- 1.2KB vs 10KB bundle size (8x smaller)
- Hooks-based API is sufficient
- No need for data loaders or nested routes

### Why CSS Modules instead of Tailwind/CSS-in-JS?
- **Project requirement**: No CSS frameworks allowed
- Manual styling with CSS custom properties (design tokens)
- Modern CSS features: `light-dark()` for theming
- BEM-like naming for clarity
- Better for learning CSS fundamentals

### Why native fetch instead of axios?
- Modern browsers support fetch natively
- Built-in TypeScript types
- Smaller bundle (0KB vs 13KB)
- Sufficient for simple REST API calls

## Testing Strategy

### Unit Tests (Pure Functions)

```typescript
// src/utils/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatPercentage } from './formatters';

describe('formatPercentage', () => {
  it('formats decimal to percentage with 2 decimals', () => {
    expect(formatPercentage(0.0567)).toBe('5.67%');
  });
});
```

### Component Tests (with Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

test('calls onClick when clicked', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  await userEvent.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### API Tests (with MSW)

```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/products', () => {
    return HttpResponse.json([{ id: 1, name: 'Product 1' }]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Accessibility Tests (with jest-axe)

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('no accessibility violations', async () => {
  const { container } = render(<Button>Click</Button>);
  expect(await axe(container)).toHaveNoViolations();
});
```

## Known Issues

### JSDOM Component Tests
- **Issue**: JSDOM has compatibility issues with the current Node.js version
- **Status**: Component tests are skipped for now (see `Button.test.tsx`)
- **Workaround**: Focus on utility and API tests first
- **Resolution**: Will be fixed when Node.js compatibility improves or when using Node 20 LTS

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: new feature
fix: bug fix
test: add or update tests
refactor: code refactoring
chore: tooling, configs
docs: documentation
style: formatting, CSS
a11y: accessibility improvements
perf: performance improvements
```

Examples:
```bash
git commit -m "feat(products): add product listing page"
git commit -m "test(api): add fetcher error handling tests"
git commit -m "a11y(button): add aria-busy for loading state"
```

## Resources

- [SWR Documentation](https://swr.vercel.app/)
- [Jotai Documentation](https://jotai.org/)
- [wouter Documentation](https://github.com/molefrog/wouter)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [MDN CSS light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark)

