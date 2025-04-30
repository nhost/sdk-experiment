import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NhostProvider } from './NhostContext';
import { Home } from './pages/Home';
import { SignIn } from './pages/SignIn';
import { Profile } from './pages/Profile';
import './App.css';

function App() {
  return (
    <NhostProvider>
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </NhostProvider>
  );
}

export default App;
