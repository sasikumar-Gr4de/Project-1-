import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import { useAuthStore } from './store/authStore';

// Pages
import IndexPage from './pages/index';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';

// Error Pages
import NotFound from './pages/errors/NotFound';
import Unauthorized from './pages/errors/Unauthorized';

// Common
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Remove loading screen once app is ready
  useEffect(() => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen && !isLoading) {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.remove(), 300);
      }, 500);
    }
  }, [isLoading]);

  if (isLoading) {
    return null; // Loading screen is handled by HTML
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App
