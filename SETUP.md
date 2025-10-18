# Developer Setup Guide

## 🚀 Live Demo

### Main Application

**Production URL**: https://cheshirecode-challenge-nesto-fronte.vercel.app/

**Status**: ✅ Successfully deployed to Vercel
**Build Time**: ~3-5 seconds
**Bundle Size**: 68.64 KB total (with vendor chunks)
**Node Version**: >=20.19.0

### Storybook Documentation

**Production URL**: https://cheshirecode-challenge-nesto-sb.vercel.app

**Status**: ✅ Successfully deployed with routing fix
**Build Time**: ~3 seconds
**Bundle Size**: ~2.6 MB (static documentation site)

> **Note**: Each deployment gets a unique hash in the URL. Storybook includes vercel.json with proper iframe routing configuration.

---

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

## Your First Tasks

Before implementing features, verify your setup:

- [ ] Copy `.env.example` to `.env.local` and add your name
- [ ] Run `npm install` - should complete without errors
- [ ] Run `npm run dev` - app should load on http://localhost:5173
- [ ] Run `npm test` - utility tests should pass
- [ ] Check `src/App.tsx` - see the default Vite + React page
- [ ] Read this guide: Common Patterns, Testing Strategy
- [ ] Review `docs/execution-plan-staff-pe.md` for implementation phases

## Environment Variables

Create `.env.local` in the root directory (copy from `.env.example`):

```env
VITE_CANDIDATE_NAME=Your Full Name
```

**How it works:**

- Vite exposes `VITE_*` prefixed variables to your app via `import.meta.env`
- Used in `src/services/api.ts` for the `X-Nesto-Candidat` API header
- **Required**: The app will not work without this variable set
- **Never commit `.env.local`** - it's in `.gitignore`

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

### Accessibility Tests

**Manual Testing**: Use browser DevTools (Lighthouse, axe DevTools extension) for accessibility audits

**Automated Tests** (via Storybook):

- Storybook includes `@storybook/addon-a11y` for interactive accessibility testing
- View components in Storybook and check the "Accessibility" tab
- Tests keyboard navigation, ARIA attributes, color contrast

**In Code**:

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add ARIA labels where needed (`aria-label`, `aria-labelledby`)
- Test keyboard navigation (`Tab`, `Enter`, `Space`)
- Verify focus-visible styles

## Quick Visual Check

After running `npm run dev`, you can test components by temporarily modifying `src/App.tsx`:

```typescript
import { Button } from './components/Button/Button';
import { Input } from './components/Input/Input';
import { Card } from './components/Card/Card';
import { Spinner } from './components/Spinner/Spinner';

function App() {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h1>Component Preview</h1>

      <section>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button loading>Loading</Button>
        </div>
      </section>

      <section>
        <h2>Inputs</h2>
        <Input label="First Name" placeholder="Enter your name" required />
        <Input label="Email" error="Invalid email address" value="test@" />
        <Input label="Phone" helperText="Format: (123) 456-7890" />
      </section>

      <Card>
        <h3>Card Content</h3>
        <p>This is a card component with padding and shadow.</p>
      </Card>

      <Card interactive>
        <h3>Interactive Card</h3>
        <p>Hover over me to see the interaction effect!</p>
      </Card>

      <section>
        <h2>Spinners</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Spinner size="small" />
          <Spinner size="medium" />
          <Spinner size="large" />
        </div>
      </section>
    </div>
  );
}

export default App;
```

**Remember to revert `App.tsx` after testing!** Or use Storybook once it's set up (TODO #8).

## Testing Environment

### happy-dom (Faster than JSDOM)

- **What**: Lightweight DOM implementation for testing
- **Why**: 2-3x faster than JSDOM, better Node.js compatibility
- **Status**: ✅ Works with Node.js v20.3.0+ (no DONT_CONTEXTIFY errors)
- **Coverage**: Run `npm run test:coverage` to see test coverage
- **Note**: If you see any DOM-related test failures, they're usually related to missing browser APIs (check happy-dom docs)

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

## Deployment (Vercel)

### Current Setup

This project uses **manual deployment** via Vercel CLI because the Git repository is hosted on CodeSubmit (Vercel automatic deployments only support GitHub, GitLab, and Bitbucket).

### Prerequisites

- Vercel account (free tier works)
- Vercel CLI installed: `npm install -g vercel`

### Deployment Workflow

#### 1. Commit and Push Changes

```bash
git add .
git commit -m "feat: your change"
git push origin master
```

#### 2. Deploy Main Application

```bash
npm run deploy
# or
vercel --prod --yes
```

#### 3. Deploy Storybook (Optional)

```bash
npm run build-storybook
cd storybook-static
vercel --prod --yes
cd ..
```

#### Quick Deploy (All Steps)

```bash
git push origin master && vercel --prod --yes
```

### Deployment Commands

| Command                   | Description                      |
| ------------------------- | -------------------------------- |
| `npm run deploy`          | Deploy app to production         |
| `npm run deploy:preview`  | Deploy to preview (staging)      |
| `npm run build-storybook` | Build Storybook static files     |
| `vercel --prod --yes`     | Deploy current directory to prod |
| `vercel ls --prod`        | List production deployments      |
| `vercel inspect <url>`    | View deployment details          |

### Environment Variables

Set via Vercel CLI:

```bash
vercel env add VITE_CANDIDATE_NAME
# Enter your full name when prompted
```

Or via Vercel dashboard:

- Navigate to your project settings
- Add `VITE_CANDIDATE_NAME` with your full name
- Set for production, preview, and development environments

**Important**: Environment variables must be prefixed with `VITE_` to be exposed to the client.

### Pre-Deployment Checklist

Before deploying:

- [ ] All tests passing: `npm test -- --run`
- [ ] **Build validation passing**: `npm run validate` ✨ **REQUIRED**
  - Checks for React duplication
  - Verifies critical dependencies in bundle
  - Validates bundle structure
- [ ] Linting clean: `npm run lint`
- [ ] Commits pushed: `git push origin master`
- [ ] Environment variables configured
- [ ] Test production build locally: `npm run preview`

After deploying:

- [ ] Production URL accessible
- [ ] No console errors (check browser DevTools)
- [ ] Features working as expected
- [ ] Theme toggle functional
- [ ] i18n switching works

### Troubleshooting

**Build fails:**

```bash
# Check deployment logs
vercel inspect <deployment-url> --logs

# Test build locally
npm run build

# Verify environment variables
vercel env ls
```

**Environment variables not working:**

- Must be prefixed with `VITE_`
- Must be set in Vercel dashboard or CLI
- Redeploy after adding new variables: `npm run deploy`

**Build validation fails:**

1. Read error message carefully
2. Apply suggested fix (usually in error output)
3. Run `npm run validate` again
4. If still failing after 2 retries, investigate deeper

**Deployment timeout:**

- Typical build time: 3-5 seconds
- Check for large dependencies or infinite loops
- Verify all dependencies are in `package.json`

**404 errors on routes:**

- Vercel auto-handles SPA routing for Vite
- The `vercel.json` file is configured with proper rewrites

### Build Configuration

The `vercel.json` file configures:

- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite (auto-detected)
- SPA routing rewrites

## Resources

- [SWR Documentation](https://swr.vercel.app/)
- [Jotai Documentation](https://jotai.org/)
- [wouter Documentation](https://github.com/molefrog/wouter)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [MDN CSS light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
