import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import BrowseNotesPage from './pages/BrowseNotesPage';
import NoteDetailsPage from './pages/NoteDetailsPage';
import UploadNotePage from './pages/UploadNotePage';
import MyNotesPage from './pages/MyNotesPage';
import BookmarksPage from './pages/BookmarksPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

import './App.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="notestack-loader-container">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin Route wrapper
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="notestack-loader-container">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }
  return isAuthenticated && isAdmin ? children : <Navigate to="/" replace />;
};

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('notestack_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('notestack_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('notestack_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="app-container">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/browse" element={<BrowseNotesPage />} />
          <Route path="/notes/:id" element={<NoteDetailsPage />} />

          {/* Student Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadNotePage /></ProtectedRoute>} />
          <Route path="/my-notes" element={<ProtectedRoute><MyNotesPage /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin Protected Route */}
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
