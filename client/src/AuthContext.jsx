import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ss_user') || 'null');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem('ss_user', JSON.stringify(user));
    else localStorage.removeItem('ss_user');
  }, [user]);

  async function login(payload) {
    const res = await api.login(payload);
    setUser(res.user);
    return res;
  }

  async function signup(payload) {
    const res = await api.signup(payload);
    setUser(res.user);
    return res;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
