'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'host' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (!loading && user && requiredRole) {
      if (requiredRole === 'admin' && user.role !== 'admin') {
        router.push('/');
      }
      if (requiredRole === 'host' && user.role !== 'host' && user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) return null;

  if (requiredRole === 'admin' && user.role !== 'admin') return null;
  if (requiredRole === 'host' && user.role !== 'host' && user.role !== 'admin') return null;

  return <>{children}</>;
}
