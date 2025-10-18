import { Route, Switch } from 'wouter';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { Navigation } from '@/components/Navigation/Navigation';
import { useThemeInitializer } from '@/hooks/useThemeInitializer';
import HomePage from '@/pages/Home';
import ApplicationFormPage from '@/pages/ApplicationForm';
import ApplicationsListPage from '@/pages/ApplicationsList';
import NotFoundPage from '@/pages/NotFound';
import './App.css';

/**
 * Main Application Component
 *
 * Routing structure:
 * - / : HomePage (Screen 1) - Products selection → CREATE application
 * - /apply/:applicationId : ApplicationFormPage (Screen 2) - Contact information form → UPDATE application
 * - /applications : ApplicationsListPage (Screen 3) - List of applications
 * - * : NotFoundPage - 404 handler
 */
function App(): JSX.Element {
  // Initialize theme from localStorage
  useThemeInitializer();

  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <div className="app">
        <Navigation />

        <main id="main-content" className="main" tabIndex={-1}>
          <Switch>
            <Route path="/">{() => <HomePage />}</Route>
            <Route path="/apply/:applicationId" component={ApplicationFormPage} />
            <Route path="/applications" component={ApplicationsListPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
