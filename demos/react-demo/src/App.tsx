import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NhostProvider } from './NhostContext';
import { Home } from './pages/Home';
import { SignIn } from './pages/SignIn';
import { Profile } from './pages/Profile';
import { UploadFiles } from './pages/UploadFiles';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <NhostProvider>
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            
            {/* Protected routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <UploadFiles />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </NhostProvider>
  );
}

export default App;
