import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth/AuthProvider';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Verify from './pages/Verify';

const MfaVerification = lazy(() => import('./pages/signin/mfa'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex-col min-h-screen">
          <Navigation />
          <main className="max-w-2xl mx-auto p-6 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signin/mfa" element={
                <Suspense fallback={<div className="loading-container">Loading...</div>}>
                  <MfaVerification />
                </Suspense>
              } />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer>
            <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} Nhost Demo
            </p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;