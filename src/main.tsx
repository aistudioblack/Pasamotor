import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress Supabase Refresh Token errors globally
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && (
      event.reason.message.includes('Refresh Token Not Found') ||
      event.reason.message.includes('Invalid Refresh Token')
  )) {
    event.preventDefault(); // Prevent it from triggering global error tracking
  }
});

const originalError = console.error;
console.error = (...args) => {
  const errStr = args.map(a => (typeof a === 'string' ? a : (a?.message || ''))).join(' ');
  if (errStr.includes('Refresh Token Not Found') || errStr.includes('Invalid Refresh Token')) {
    return; // Ignore
  }
  originalError.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

