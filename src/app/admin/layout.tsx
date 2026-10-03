'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (route: string) => pathname.startsWith(route);

  // All Admin Modules
const allModules = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
    { name: 'Shipments', path: '/admin/shipments', icon: '🚚' },
    { name: 'Live Tracking', path: '/admin/tracking', icon: '📍' },
    { name: 'Customers', path: '/admin/customers', icon: '👥' },
    { name: 'Riders', path: '/admin/riders', icon: '🏍️' },
    { name: 'Food Merchants', path: '/admin/merchants', icon: '🍽️' },
    { name: 'Events Ops', path: '/admin/events', icon: '🎟️' },
    { name: 'Escrow/Finances', path: '/admin/finances', icon: '💰' },
    { name: 'Pricing Engine', path: '/admin/pricing', icon: '⚙️' },
    { name: 'Disputes', path: '/admin/disputes', icon: '⚖️' },
    { name: 'Reports', path: '/admin/reports', icon: '📊' },
    { name: 'Settings', path: '/admin/settings', icon: '🛠️' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-950 font-sans flex flex-col antialiased">
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin/dashboard" className="text-xl font-black">Aviorè<span className="text-green-600">Go</span></Link>
        <span className="bg-neutral-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Root Ops</span>
      </header>

      {/* Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-28">
        {children}
      </main>

      {/* Overflow Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 pb-24 grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-10">
            {allModules.map((m) => (
              <Link key={m.path} href={m.path} className="flex items-center gap-3 p-4 bg-neutral-100 rounded-xl font-bold">
                <span>{m.icon}</span> {m.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-neutral-200 px-4 py-2 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] max-w-xl mx-auto sm:rounded-t-3xl sm:border-x">
        <div className="flex items-center justify-around">
          {/* Core Tabs */}
          {allModules.slice(0, 4).map((m) => (
            <Link key={m.path} href={m.path} className={`flex flex-col items-center gap-1 py-1 px-3 ${isActive(m.path) ? 'text-green-600 font-black' : 'text-neutral-400'}`}>
              <span className="text-lg">{m.icon}</span>
              <span className="text-[10px]">{m.name}</span>
            </Link>
          ))}
          
          {/* More Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col items-center gap-1 py-1 px-3 text-neutral-400">
            <span className="text-lg">⋯</span>
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}