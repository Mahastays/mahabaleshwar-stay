'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import api from '../lib/api';

interface AppUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  firebaseUid: string;
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  syncUserWithBackend: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  logout: async () => {},
  syncUserWithBackend: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUserWithBackend = async (token: string) => {
    try {
      const res = await api.post('/users/auth', { token });
      setUser(res.data);
    } catch (error) {
      console.error('Failed to sync user with backend', error);
      setUser(null);
    }
  };

  const syncAdminWithBackend = async () => {
    try {
      const res = await api.get('/users/profile');
      setUser(res.data);
    } catch (error) {
      console.error('Failed to sync admin with backend', error);
      localStorage.removeItem('adminToken');
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        await syncAdminWithBackend();
        setLoading(false);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
      setFirebaseUser(currentFirebaseUser);
      if (currentFirebaseUser) {
        const token = await currentFirebaseUser.getIdToken();
        localStorage.setItem('token', token);
        await syncUserWithBackend(token);
        setLoading(false);
      } else {
        if (!localStorage.getItem('adminToken')) {
          setUser(null);
          localStorage.removeItem('token');
          setLoading(false);
        }
      }
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, logout, syncUserWithBackend }}>
      {children}
    </AuthContext.Provider>
  );
};
