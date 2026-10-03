'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { api } from '@/src/lib/api';
import { 
  LayoutDashboard, 
  Calendar, 
  Navigation, 
  Users, 
  Bus, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell
} from 'lucide-react';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [organizerInfo, setOrganizerInfo] = useState({
    companyName: 'Loading Organization...',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });

  useEffect(() => {
    const fetchOrganizerHeader = async () => {
      try {
        const response = await api.get('/events/organizer/settings');
        setOrganizerInfo({
          companyName: response.data.companyName || 'My Organization',
          firstName: response.data.firstName || user?.firstName || '',
          lastName: response.data.lastName || user?.lastName || '',
        });
      } catch (err) {
        // Fallback gracefully if request fails
        setOrganizerInfo({
          companyName: 'Live Event Organizer',
          firstName: user?.firstName || 'User',
          lastName: user?.lastName || '',
        });
      }
    };

    fetchOrganizerHeader();
  }, [user]);

  // Generate initials for the avatar (e.g., "Grace Events" -> "GE")
  const getInitials = (name: string) => {
    if (!name) return 'ORG';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const navItems = [
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

  const fullName = `${organizerInfo.firstName} ${organizerInfo.lastName}`.trim() || 'Organizer';

  return (
    <div className="min-h-screen bg-[#0b0f17] text-neutral-100 flex flex-col md:flex-row font-sans antialiased">
      
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0e131f] border-r border-neutral-800/60 hidden md:flex flex-col p-6 sticky top-0 h-screen justify-between">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-neutral-950 p-2 rounded-xl font-black">
              <Navigation className="h-5 w-5 fill-current" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">Aviorè<span className="text-emerald-500">Go</span></span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs transition-colors ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl font-medium text-xs transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#0e131f]/90 backdrop-blur-md border-b border-neutral-800/60 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-neutral-950 p-1.5 rounded-lg font-black">
            <Navigation className="h-4 w-4 fill-current" />
          </div>
          <span className="font-black text-lg tracking-tight text-white">Aviorè<span className="text-emerald-500">Go</span></span>
        </div>
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
          Organizer
        </span>
      </header>

      {/* Main Content View */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden pb-28 md:pb-0">
        {/* Desktop Top Navigation Bar */}
        <header className="h-20 border-b border-neutral-800/60 bg-[#0e131f]/50 backdrop-blur-md px-8 hidden md:flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold text-white tracking-tight">{organizerInfo.companyName}</h1>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Event
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-300">
              🔔
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-800">
              <div className="text-right">
                <span className="block text-xs font-bold text-white">{fullName}</span>
                <span className="block text-[10px] text-neutral-400 font-mono">Organizer</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                {getInitials(organizerInfo.companyName)}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-4 sm:p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>

      {/* Mobile Overflow Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-[#0e131f] border-t border-neutral-800 w-full rounded-t-3xl p-6 pb-24 grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-10 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl font-medium text-xs transition-colors ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold' 
                      : 'bg-neutral-900/80 text-neutral-300 hover:bg-neutral-800 border border-neutral-800/60'
                  }`}
                >
                  <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
            
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
              className="col-span-2 flex items-center justify-center gap-3 p-3.5 mt-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-medium text-xs transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0e131f]/95 backdrop-blur-lg border-t border-neutral-800/80 px-4 py-2 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] md:hidden">
        <div className="flex items-center justify-around">
          {/* Core Tabs (First 4 items) */}
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                  isActive ? 'text-emerald-400 font-black' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
          
          {/* More Button */}
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
    </div>
  );
}