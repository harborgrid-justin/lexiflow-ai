import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Ensure root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Initialize dark mode
document.documentElement.classList.add('dark');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
