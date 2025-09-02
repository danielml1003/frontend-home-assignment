import React, { createContext, useState, useEffect } from 'react';
import api, { setAuthToken } from './api';

interface AuthContextValue {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));

  useEffect(() => {
    setAuthToken(token);
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
  }, [token]);

  const login = (t: string) => setToken(t);
  const logout = () => setToken(null);

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};
