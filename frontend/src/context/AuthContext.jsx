import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken, clearToken, setToken } from '../services/apiService';

const AuthContext = createContext({
  user: null,
  loading: false,
  refreshUser: async () => {},
  logout: () => {},
  setAuthToken: (t) => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return null;
    }
    try {
      setLoading(true);
      const { user: u } = await api.get('/clientes/me');
      setUser(u);
      return u;
    } catch (err) {
      // Si el token es inválido, limpiar
      clearToken();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const setAuthToken = useCallback((t) => {
    setToken(t);
  }, []);

  useEffect(() => {
    // Cargar usuario al montar si hay token
    if (getToken()) {
      refreshUser();
    }
  }, [refreshUser]);

  const value = { user, loading, refreshUser, logout, setAuthToken };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}