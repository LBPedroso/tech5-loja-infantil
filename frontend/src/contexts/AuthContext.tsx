import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import api from '../services/api';
import { User, AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const fetchCurrentUser = useCallback(async (authToken: string) => {
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    setUser(response.data.data);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token: newToken } = response.data.data;
    
    setToken(newToken);
    localStorage.setItem('token', newToken);

    await fetchCurrentUser(newToken);
  }, [fetchCurrentUser]);

  const signup = useCallback(async (nome: string, email: string, cpf: string, senha: string) => {
    await api.post('/auth/signup', { nome, email, cpf, senha });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const editUser = useCallback(async (nome: string, cpf: string, senha?: string) => {
    const response = await api.put('/auth/me', { nome, cpf, senha });
    setUser(response.data.data);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      return;
    }

    fetchCurrentUser(storedToken).catch(() => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    });
  }, [fetchCurrentUser]);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, editUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
