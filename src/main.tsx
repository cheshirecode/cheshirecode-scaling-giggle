import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './services/i18n/config'; // Initialize i18n BEFORE rendering
import './styles/reset.css';
import './styles/tokens.css';
import './styles/base.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
