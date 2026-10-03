'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import AuthLoader from '../components/AuthLoader';

interface RoleGuardProps {
  children: ReactNode;
  roles: string[];
}

export default function RoleGuard({ children, roles }: RoleGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    // If user doesn't have the required role, route them to *their* proper dashboard
    if (!roles.includes(user.role)) {
      const role = user.role;
      if (role === 'RIDER') {
        router.replace('/rider/dashboard');
      } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        router.replace('/admin/dashboard');
      } else if (role === 'ORGANIZER' ) {
        router.replace('/events/dashboard');
           } else if (role === 'MERCHANT') {
        router.replace('/merchant/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [loading, user, roles, router]);

  if (loading) return <AuthLoader />;
  if (!user || !roles.includes(user.role)) return null;

  return <>{children}</>;
}