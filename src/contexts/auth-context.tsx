"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User, type AuthCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { FirebaseError } from 'firebase/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credential: AuthCredential) => Promise<void>;
  register: (credential: AuthCredential) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credential: AuthCredential) => {
    // This is a placeholder. You should use signInWithCredential or other methods.
    // For this example, we assume credential handling happens in the form.
  };

  const register = async (credential: AuthCredential) => {
     // This is a placeholder. You should use createUserWithEmailAndPassword or other methods.
  };

  const logout = async () => {
    await auth.signOut();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
