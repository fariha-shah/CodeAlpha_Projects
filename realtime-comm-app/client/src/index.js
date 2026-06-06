import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

window.process = {
  env: { NODE_ENV: 'development' },
  nextTick: (fn, ...args) => setTimeout(() => fn(...args), 0),
  version: '',
  browser: true,
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
