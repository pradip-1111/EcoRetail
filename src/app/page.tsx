"use client";

import { useAuth } from '@/contexts/auth-context';
import Dashboard from '@/components/dashboard';
import Welcome from '@/components/welcome';
import Loading from './loading';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return user ? <Dashboard /> : <Welcome />;
}
