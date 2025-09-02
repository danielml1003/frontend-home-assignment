import React, { createContext, useState, useEffect } from 'react';
import api, { setAuthToken } from './api';

export interface User {
  uuid: string;
  username: string;
  role: 'user' | 'admin';
}

interface AuthContextValue {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('authToken');
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setAuthToken(token);
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');

    // when token changes, refresh current user
    async function fetchMe() {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const resp = await api.get('/users/me');
        setUser(resp.data || null);
      } catch (err) {
        // if fetching current user fails, clear user
        setUser(null);
      }
    }

    fetchMe();
  }, [token]);

  const login = (t: string) => setToken(t);
  const logout = () => setToken(null);

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
};
