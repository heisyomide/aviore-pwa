'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'CUSTOMER') {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'CUSTOMER') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-950 font-sans flex flex-col justify-between antialiased">
      
      {/* Main Workspace Frame - Zero top padding so HeroBanner touches the top edge */}
      <main className="flex-1 w-full pt-0 pb-28">
        {children}
      </main>

    </div>
  );
}