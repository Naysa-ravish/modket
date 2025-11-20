import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('modket_token'));
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem('modket_user');
    return data ? JSON.parse(data) : null;
  });
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    const syncProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authService.me();
        setUser(profile.user);
        localStorage.setItem('modket_user', JSON.stringify(profile.user));
      } catch (error) {
        console.error(error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    syncProfile();
  }, [token]);

  const persist = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem('modket_token', nextToken);
    } else {
      localStorage.removeItem('modket_token');
    }

    if (nextUser) {
      localStorage.setItem('modket_user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('modket_user');
    }
  };

  const login = async (payload) => {
    const data = await authService.login(payload);
    setToken(data.token);
    setUser(data.user);
    persist(data.token, data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    setToken(data.token);
    setUser(data.user);
    persist(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    persist(null, null);
  };

  const refreshProfile = async () => {
    const profile = await authService.me();
    setUser(profile.user);
    localStorage.setItem('modket_user', JSON.stringify(profile.user));
    return profile.user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

