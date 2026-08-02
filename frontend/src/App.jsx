import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

import Dashboard from './pages/Dashboard';
import UploadCenter from './pages/UploadCenter';
import TranslationCenter from './pages/TranslationCenter';
import AccessibilityCenter from './pages/AccessibilityCenter';
import QuizGenerator from './pages/QuizGenerator';
import DocumentChat from './pages/DocumentChat';
import LearningLibrary from './pages/LearningLibrary';
import Analytics from './pages/Analytics';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">

            {/* Header Navbar on EVERY Page */}
            <Navbar />

            {/* Main Content Body */}
            <main className="flex-grow">
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Ecosystem Module Routes (Requires Authentication) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/upload" element={<UploadCenter />} />
                  <Route path="/translation" element={<TranslationCenter />} />
                  <Route path="/accessibility" element={<AccessibilityCenter />} />
                  <Route path="/quiz" element={<QuizGenerator />} />
                  <Route path="/chat" element={<DocumentChat />} />
                  <Route path="/library" element={<LearningLibrary />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Fallback Redirect for Unauthenticated / Unknown URLs */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>

            {/* Global Footer with Contact Info on EVERY Page */}
            <Footer />

          </div>
        </Router>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;
