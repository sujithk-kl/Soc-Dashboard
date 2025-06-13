// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import { useTheme } from './contexts/ThemeContext'; // This hook will now receive the context value

function App() {
  // 👇 This line will no longer crash
  const { theme } = useTheme(); 

  return (
    // The className here should now work correctly, but we'll remove it
    // since the ThemeProvider already handles adding 'dark' or 'light'
    // to the root <html> element.
    <Router>
      <div className="dashboard-container grid grid-cols-[280px_1fr] h-screen overflow-hidden">
        <Sidebar />
        <div className="main-content flex flex-col overflow-hidden">
          <Header />
          <main className="dashboard-content p-6 overflow-y-auto flex-1 bg-dark">
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;