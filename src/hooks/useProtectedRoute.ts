'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export function useProtectedRoute(allowedRoles?: string[]) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // No session -> redirect to login
    if (!user) {
      router.replace('/login');
      return;
    }

    const userRole = user.role as string;

    // Invalid role -> smart redirect to their respective dashboard instead of a dead-end page
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      if (userRole === 'RIDER') {
        router.replace('/rider/dashboard');
      } else if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
        router.replace('/admin/dashboard');
      } else if (userRole === 'ORGANIZER' || userRole === 'BUSINESS_OWNER') {
        router.replace('/events/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, allowedRoles, router]);

  return { user, loading };
}