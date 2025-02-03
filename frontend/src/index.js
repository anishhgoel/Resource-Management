import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Tailwind CSS

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("No root element found. Ensure public/index.html has <div id='root'></div>.");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);