import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/common';
import './styles/tokens.css';

console.log('[INDEX] Script loaded');

const rootElement = document.getElementById('root');
console.log('[INDEX] Root element:', rootElement);

if (!rootElement) {
  console.error('[INDEX] Root element not found!');
  throw new Error("Could not find root element to mount to");
}

console.log('[INDEX] Creating React root');
const root = ReactDOM.createRoot(rootElement);

console.log('[INDEX] Rendering app');
root.render(
  <React.StrictMode>
    <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
      <h1>REACT IS WORKING!</h1>
      <App />
    </div>
  </React.StrictMode>
);

console.log('[INDEX] Render complete');