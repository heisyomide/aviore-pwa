'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RiderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Helper calculation function to highlight targeted URL navigation blocks dynamically
  const isActive = (route: string) => {
    if (route === '/rider/dashboard') {
      return pathname === route;
    }
    return pathname.startsWith(route);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col justify-between antialiased">
      
      {/* Top Fixed Global Header Component */}
      <header className="bg-neutral-900/60 backdrop-blur-md border-b border-neutral-900/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Link href="/rider/dashboard" className="text-xl font-black tracking-tight text-white hover:opacity-90">
            Aviorè
          </Link>
          <span className="bg-emerald-600 text-white text-[10px] font-mono font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
            Rider App
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-none">Adeleke T.</p>
            <span className="text-[9px] text-neutral-500 font-mono">Ibadan Core</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm shadow-inner">
            🧑🏾‍✈️
          </div>
        </div>
      </header>

      {/* Main Container Render Frame Target */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 pb-28">
        {children}
      </main>

      {/* Persistent Bottom Tab Route Controller Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800/80 px-4 py-2 z-50 shadow-2xl max-w-lg mx-auto sm:rounded-t-2xl">
        <div className="flex items-center justify-around">
          
          {/* Radar Home Route View */}
          <Link 
            href="/rider/dashboard"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${isActive('/rider/dashboard') && !isActive('/rider/dashboard/jobs') && !isActive('/rider/dashboard/earnings') && !isActive('/rider/dashboard/wallet') && !isActive('/rider/dashboard/profile') ? 'text-emerald-400 font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className="text-[10px]">Home</span>
          </Link>

          {/* Jobs Active Manifest Target Link */}
          <Link 
            href="/rider/dashboard/jobs"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${isActive('/rider/dashboard/jobs') ? 'text-emerald-400 font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0 1 12 3.75c.38 0 .759.01 1.14.03M4.5 18.067V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 1 1.123-.08M18.194 21.75c.259-.284.416-.659.416-1.071m-14.11 0c0 .412.157.787.416 1.071m13.694-1.071A2.25 2.25 0 0 0 16.5 18.75h-9a2.25 2.25 0 0 0-2.194 1.929" />
            </svg>
            <span className="text-[10px]">Jobs</span>
          </Link>

          {/* Weekly Performance Ledger Metrics Link */}
          <Link 
            href="/rider/dashboard/earnings"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${isActive('/rider/dashboard/earnings') ? 'text-emerald-400 font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
            <span className="text-[10px]">Earnings</span>
          </Link>

          {/* Cash Wallet Component Route Trigger */}
          <Link 
            href="/rider/dashboard/wallet"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${isActive('/rider/dashboard/wallet') ? 'text-emerald-400 font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6A2.25 2.25 0 0 1 18.75 20.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6A2.25 2.25 0 0 0 18.75 3.75H5.25A2.25 2.25 0 0 0 3 6v3" />
            </svg>
            <span className="text-[10px]">Wallet</span>
          </Link>

          {/* Profile Security Settings Link */}
          <Link 
            href="/rider/dashboard/profile"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${isActive('/rider/dashboard/profile') ? 'text-emerald-400 font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span className="text-[10px]">Profile</span>
          </Link>

        </div>
      </nav>

    </div>
  );
}