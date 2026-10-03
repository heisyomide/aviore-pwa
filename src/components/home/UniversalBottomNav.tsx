'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Navigation, 
  Users, 
  Bus, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  Bell,
  UtensilsCrossed,
  Wallet,
  MoreHorizontal
} from 'lucide-react';

export default function UniversalBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // STRICT REDIRECT: If a non-customer lands on the root customer dashboard page, 
  // immediately push them to their actual role-specific home page.
  useEffect(() => {
    if (!user) return;
    const role = user.role as string;

    if (pathname === '/dashboard') {
      if (role === 'RIDER') {
        router.replace('/rider/dashboard');
      } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        router.replace('/admin/dashboard');
      } else if (role === 'ORGANIZER' || role === 'BUSINESS_OWNER') {
        router.replace('/events/dashboard');
      } else if (role === 'MERCHANT') {
        router.replace('/merchant/dashboard');
      }
    }
  }, [user, pathname, router]);

  if (!user) return null;

  const role = user.role as string;
  
  let currentTheme = 'customer';
  if (role === 'ADMIN' || role === 'SUPER_ADMIN' || pathname.startsWith('/admin')) {
    currentTheme = 'admin';
  } else if (role === 'RIDER' || pathname.startsWith('/rider')) {
    currentTheme = 'rider';
  } else if (role === 'ORGANIZER' || pathname.startsWith('/events')) {
    currentTheme = 'organizer';
  } else if (role === 'MERCHANT' || role === 'BUSINESS_OWNER' || pathname.startsWith('/merchant')) {
    currentTheme = 'merchant';
  }

  const isActive = (route: string) => {
    if (route === '/dashboard' || route === '/admin/dashboard' || route === '/rider/dashboard' || route === '/events/dashboard' || route === '/merchant/dashboard') {
      return pathname === route;
    }
    return pathname.startsWith(route);
  };

  // 1. CUSTOMER CONFIG (Pill floated floating bar mimicking reference design)
  if (currentTheme === 'customer' || role === 'CUSTOMER') {
    return (
      <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-neutral-200/80 px-5 py-2.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-sm w-full flex items-center justify-between">
          <Link href="/dashboard" className={`flex flex-col items-center gap-0.5 transition-all ${isActive('/dashboard') && !isActive('/dashboard/shipment') && !isActive('/dashboard/orders') && !isActive('/dashboard/profile') ? 'text-neutral-900 font-black' : 'text-neutral-400 hover:text-neutral-700'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            <span className="text-[10px] tracking-tight">Home</span>
          </Link>

          <Link href="/dashboard/shipment" className={`flex flex-col items-center gap-0.5 transition-all ${isActive('/dashboard/shipment') ? 'text-neutral-900 font-black' : 'text-neutral-400 hover:text-neutral-700'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
            <span className="text-[10px] tracking-tight">Shipment</span>
          </Link>

          <Link href="/dashboard/orders" className={`flex flex-col items-center gap-0.5 transition-all ${isActive('/dashboard/orders') ? 'text-neutral-900 font-black' : 'text-neutral-400 hover:text-neutral-700'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            <span className="text-[10px] tracking-tight">Orders</span>
          </Link>

          <Link href="/dashboard/profile" className={`flex flex-col items-center gap-0.5 transition-all ${isActive('/dashboard/profile') ? 'text-neutral-900 font-black' : 'text-neutral-400 hover:text-neutral-700'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            <span className="text-[10px] tracking-tight">Profile</span>
          </Link>
        </nav>
      </div>
    );
  }

  // 2. RIDER CONFIG 
  if (currentTheme === 'rider' || role === 'RIDER') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800/80 px-4 py-2 z-50 shadow-2xl max-w-lg mx-auto sm:rounded-t-2xl">
        <div className="flex items-center justify-around">
          <Link 
            href="/rider/dashboard"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${isActive('/rider/dashboard') && !isActive('/rider/dashboard/jobs') && !isActive('/rider/dashboard/earnings') && !isActive('/rider/dashboard/wallet') && !isActive('/rider/dashboard/profile') ? 'text-emerald-400 font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className="text-[10px]">Home</span>
          </Link>
          <Link 
            href="/rider/dashboard/jobs"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${isActive('/rider/dashboard/jobs') ? 'text-emerald-400 font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0 1 12 3.75c.38 0 .759.01 1.14.03M4.5 18.067V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 1 1.123-.08M18.194 21.75c.259-.284.416-.659.416-1.071m-14.11 0c0 .412.157.787.416 1.071m13.694-1.071A2.25 2.25 0 0 0 16.5 18.75h-9a2.25 2.25 0 0 0-2.194 1.929" />
            </svg>
            <span className="text-[10px]">Jobs</span>
          </Link>
          <Link 
            href="/rider/dashboard/earnings"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${isActive('/rider/dashboard/earnings') ? 'text-emerald-400 font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
            <span className="text-[10px]">Earnings</span>
          </Link>
          <Link 
            href="/rider/dashboard/wallet"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${isActive('/rider/dashboard/wallet') ? 'text-emerald-400 font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6A2.25 2.25 0 0 1 18.75 20.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6A2.25 2.25 0 0 0 18.75 3.75H5.25A2.25 2.25 0 0 0 3 6v3" />
            </svg>
            <span className="text-[10px]">Wallet</span>
          </Link>
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
    );
  }

  // 3. ADMIN CONFIG 
  if (currentTheme === 'admin' || role === 'ADMIN' || role === 'SUPER_ADMIN') {
    const adminModules = [
      { name: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
      { name: 'Shipments', path: '/admin/shipments', icon: '🚚' },
      { name: 'Live Tracking', path: '/admin/tracking', icon: '📍' },
      { name: 'Customers', path: '/admin/customers', icon: '👥' },
      { name: 'Riders', path: '/admin/riders', icon: '🏍️' },
      { name: 'Events Ops', path: '/admin/events', icon: '🎟️' },
      { name: 'Escrow/Finances', path: '/admin/finances', icon: '💰' },
      { name: 'Pricing Engine', path: '/admin/pricing', icon: '⚙️' },
      { name: 'Disputes', path: '/admin/disputes', icon: '⚖️' },
      { name: 'Reports', path: '/admin/reports', icon: '📊' },
      { name: 'Settings', path: '/admin/settings', icon: '🛠️' },
      { name: 'Food Merchants', path: '/admin/merchants', icon: '🍽️' },
    ];

    return (
      <>
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:hidden" onClick={() => setIsMenuOpen(false)}>
            <div className="bg-white w-full rounded-t-3xl p-6 pb-24 grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-10 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {adminModules.map((m) => (
                <Link key={m.path} href={m.path} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 bg-neutral-100 rounded-xl font-bold text-xs">
                  <span>{m.icon}</span> {m.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-neutral-200 px-4 py-2 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] max-w-xl mx-auto sm:rounded-t-3xl sm:border-x md:hidden">
          <div className="flex items-center justify-around">
            {adminModules.slice(0, 4).map((m) => (
              <Link key={m.path} href={m.path} className={`flex flex-col items-center gap-1 py-1 px-3 ${isActive(m.path) ? 'text-green-600 font-black' : 'text-neutral-400'}`}>
                <span className="text-lg">{m.icon}</span>
                <span className="text-[10px]">{m.name}</span>
              </Link>
            ))}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col items-center gap-1 py-1 px-3 text-neutral-400">
              <span className="text-lg">⋯</span>
              <span className="text-[10px]">More</span>
            </button>
          </div>
        </nav>
      </>
    );
  }

  // 4. MERCHANT CONFIG
  if (currentTheme === 'merchant' || role === 'MERCHANT') {
    const merchantModules = [
      { label: 'Dashboard', href: '/merchant/dashboard', icon: LayoutDashboard },
      { label: 'Orders', href: '/merchant/dashboard/orders', icon: Bell },
      { label: 'Menu', href: '/merchant/dashboard/menu', icon: UtensilsCrossed },
      { label: 'Wallet', href: '/merchant/dashboard/wallet', icon: Wallet },
      { label: 'More', href: '/merchant/dashboard/more', icon: Settings },
    ];

    return (
      <>
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:hidden" onClick={() => setIsMenuOpen(false)}>
            <div className="bg-white w-full rounded-t-3xl p-6 pb-24 grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-10 max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {merchantModules.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl font-bold text-xs transition-all ${
                      active 
                        ? 'bg-amber-600 text-white shadow-sm' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-neutral-200 px-4 py-2 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] max-w-xl mx-auto sm:rounded-t-3xl sm:border-x md:hidden">
          <div className="flex items-center justify-around">
            {merchantModules.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                    active ? 'text-amber-600 font-black' : 'text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px]">{item.label}</span>
                </Link>
              );
            })}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                isMenuOpen ? 'text-amber-600 font-black' : 'text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px]">More</span>
            </button>
          </div>
        </nav>
      </>
    );
  }

  // 5. ORGANIZER CONFIG 
  const organizerModules = [
    { label: 'Dashboard', href: '/events/dashboard', icon: LayoutDashboard },
    { label: 'Events', href: '/events/dashboard/events', icon: Calendar },
    { label: 'Trips', href: '/events/trips', icon: Navigation },
    { label: 'Passengers', href: '/events/passengers', icon: Users },
    { label: 'Vehicles', href: '/events/vehicles', icon: Bus },
    { label: 'Drivers', href: '/events/drivers', icon: ShieldCheck },
    { label: 'Notifications', href: '/events/notifications', icon: Bell },
    { label: 'Reports', href: '/events/reports', icon: BarChart3 },
    { label: 'Settings', href: '/events/settings', icon: Settings },
  ];

  return (
    <>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-[#0e131f] border-t border-neutral-800 w-full rounded-t-3xl p-6 pb-24 grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-10 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {organizerModules.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl font-medium text-xs transition-colors ${
                    active 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold' 
                      : 'bg-neutral-900/80 text-neutral-300 hover:bg-neutral-800 border border-neutral-800/60'
                  }`}
                >
                  <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-[#0e131f]/95 backdrop-blur-lg border-t border-neutral-800/80 px-4 py-2 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] md:hidden">
        <div className="flex items-center justify-around">
          {organizerModules.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                  active ? 'text-emerald-400 font-black' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
              isMenuOpen ? 'text-emerald-400 font-black' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span className="text-lg leading-none font-bold">⋯</span>
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}