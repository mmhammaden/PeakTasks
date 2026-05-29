import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      {/* show navbar on all pages where user is logged in, plus /about which is public */}
      {user && <Navbar />}
      <Routes>
        <Route path="/login"  element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
        <Route path="/"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        {/* /about is intentionally public — shareable link, no login required */}
        <Route path="/about"  element={<About />} />
        <Route path="*"       element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f1f5f9',
            border: '1px solid #1e293b',
          },
          success: { iconTheme: { primary: '#003399', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
