// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

// --- CSS IMPORTS ---
import './index.css'; // Your main stylesheet
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS here

// --- FONT AWESOME SETUP ---
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);