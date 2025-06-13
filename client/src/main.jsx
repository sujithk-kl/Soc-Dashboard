// client/src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.jsx' // Make sure this import is correct

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👇 This is the correct placement. ThemeProvider wraps App. */}
    <ThemeProvider> 
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)