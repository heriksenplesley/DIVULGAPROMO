import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  usersList: User[];
  loading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      const data = await res.json();
      if (data.users) {
        setUsersList(data.users);
      }
    } catch (e) {
      console.error('Failed to fetch users', e);
    }
  };

  const refreshUser = async () => {
    try {
      const activeId = localStorage.getItem('divulgapromo_user_id') || 'usr_affiliate_demo';
      const res = await fetch('/api/auth/me', {
        headers: { 'x-user-id': activeId },
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (e) {
      console.error('Failed to fetch me', e);
    } finally {
      setLoading(false);
    }
  };

  const switchUser = async (userId: string) => {
    localStorage.setItem('divulgapromo_user_id', userId);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (targetRole: UserRole) => {
    const found = usersList.find(u => u.role === targetRole);
    if (found) {
      await switchUser(found.id);
    } else if (user) {
      // Temporarily update user role
      setUser({ ...user, role: targetRole });
    }
  };

  const updateUser = (updated: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updated });
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
    fetchUsers();
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        usersList,
        loading,
        theme,
        toggleTheme,
        switchRole,
        switchUser,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
