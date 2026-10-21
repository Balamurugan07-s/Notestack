import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('notestack_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('notestack_token');
      const storedUser = localStorage.getItem('notestack_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with server in background
          const res = await authService.getCurrentUser();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('notestack_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const { token: jwtToken, user: userData } = res.data;
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('notestack_token', jwtToken);
    localStorage.setItem('notestack_user', JSON.stringify(userData));
    return userData;
  };

  const signup = async (userData) => {
    const res = await authService.signup(userData);
    const { token: jwtToken, user: newUser } = res.data;
    setToken(jwtToken);
    setUser(newUser);
    localStorage.setItem('notestack_token', jwtToken);
    localStorage.setItem('notestack_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('notestack_token');
    localStorage.removeItem('notestack_user');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
