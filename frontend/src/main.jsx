import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Kế thừa 100% hệ thống styles và giao diện gốc của LV34 Events
import './assets/styles/styles.css';
import './styles/print.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
