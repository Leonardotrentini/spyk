import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
<<<<<<< HEAD
import { AuthGuard } from './components/AuthGuard';
=======
>>>>>>> 67aac4f327c2bf1a6214bcda81527dfb41c16f57

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <AuthGuard>
      <App />
    </AuthGuard>
=======
    <App />
>>>>>>> 67aac4f327c2bf1a6214bcda81527dfb41c16f57
  </React.StrictMode>
);