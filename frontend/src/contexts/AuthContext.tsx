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

    setUser(response.data.data ?? response.data);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const response = await api.post('/auth/login', { email, senha });
    const newToken = response.data?.data?.token ?? response.data?.token;
    const authData = response.data?.data ?? response.data;

    if (!newToken) {
      throw new Error('Token não retornado pela API');
    }
    
    setToken(newToken);
    localStorage.setItem('token', newToken);

    try {
      await fetchCurrentUser(newToken);
    } catch {
      // Evita bloquear o login por instabilidade momentânea no endpoint /auth/me.
      setUser((prev) =>
        prev ?? {
          id: authData?.id || 'temp-user',
          email: authData?.email || email,
          nome: authData?.nome || 'Usuário',
          cpf: authData?.cpf || '',
        }
      );
    }
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
