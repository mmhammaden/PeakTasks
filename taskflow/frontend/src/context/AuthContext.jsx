import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('🔑 no token found, skipping auth check — guest mode activated');
      setLoading(false);
      return;
    }

    console.log('🔄 token found, verifying with server...');
    api.get('/auth/me')
      .then(({ data }) => {
        console.log(`👋 welcome back, ${data.user.name || data.user.email}`);
        setUser(data.user);
      })
      .catch(() => {
        console.warn('🗑️ token was invalid or expired, clearing it — sorry about that');
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    console.log(`✅ logged in as ${data.user.email} — let's get productive (or at least pretend to)`);
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    console.log(`🎉 new user created: ${data.user.email} — welcome to the productivity cult`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    console.log('👋 logged out — go touch some grass');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
