'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BusinessDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Helper matching calculation function for high-density business actions
  const isActive = (route: string) => {
    if (route === '/business/dashboard') {
      return pathname === route;
    }
    return pathname.startsWith(route);
  };

  const navItems = [
    { label: 'Overview', href: '/business/dashboard', icon: '📊' },
    { label: 'Orders & Registry', href: '/business/dashboard/orders', icon: '📦' },
    { label: 'Inventory Core', href: '/business/dashboard/inventory', icon: '🏺' },
    { label: 'Settlement Ledger', href: '/business/dashboard/finances', icon: '💼' },
    { label: 'Settings', href: '/business/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col antialiased">
      
      {/* Universal Desktop Side Nav + Top Strip Frame */}
      <div className="flex flex-1 relative min-h-screen">
        
        {/* Left Side Static Control Panel (Hidden on Small Mobile Screens) */}
        <aside className="w-64 bg-neutral-900/40 border-r border-neutral-900 sticky top-0 h-screen hidden md:flex flex-col justify-between p-5 shrink-0">
          <div className="space-y-6">
            {/* Minimal High-End Identity Badge */}
            <div className="flex items-center gap-2.5 px-2">
              <span className="text-lg font-black tracking-widest text-white uppercase">Aviorè</span>
              <span className="bg-neutral-800 border border-neutral-700/60 text-neutral-400 text-[9px] font-mono px-1.5 py-0.5 rounded tracking-normal">
                B2B Suite
              </span>
            </div>

            {/* Direct Manifest Link Navigation Column */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive(item.href) && (item.href === '/business/dashboard' ? pathname === '/business/dashboard' : true)
                      ? 'bg-neutral-900 border border-neutral-800 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Current Enterprise Merchant State Context Indicator */}
          <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-xs">
              🏢
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate leading-none">Main Hub Store</p>
              <span className="text-[9px] text-neutral-500 font-mono">ID: AV-BIZ-092</span>
            </div>
          </div>
        </aside>

        {/* Primary Screen Render View Target Core */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Operational Info Bar */}
          <header className="h-16 border-b border-neutral-900 bg-neutral-950/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
            <div className="md:hidden flex items-center gap-2">
              <span className="text-md font-black tracking-widest text-white uppercase">Aviorè</span>
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-mono text-neutral-500">Workspace / Merchant Environment</p>
            </div>
            
            {/* Global Quick Action Strip */}
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-sm">
                💼
              </div>
            </div>
          </header>

          {/* Target Display Frame injection slot */}
          <main className="flex-1 p-6 pb-24 md:pb-6 max-w-6xl w-full mx-auto">
            {children}
          </main>
        </div>

      </div>

      {/* Persistent Bottom Tab Sticky Dock for Mobile Interfacing */}
      <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-2 z-50 md:hidden flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-all ${
              isActive(item.href) && (item.href === '/business/dashboard' ? pathname === '/business/dashboard' : true)
                ? 'text-white font-bold'
                : 'text-neutral-500'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="text-[9px] tracking-tight">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>

    </div>
  );
}