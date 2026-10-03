"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth() as { user: any };

  const unreadNotifications = 1; 
  
  // Safely fallback to multiple possible naming conventions for user properties
  const userAvatar = user?.profileImage || user?.avatar || user?.image || "https://api.dicebear.com/8.x/notionists-neutral/svg?seed=Avior";
  const userName = user?.name || user?.fullName || user?.username || "User Avatar";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-200/60 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Left Section: Brand Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-1 group py-2">
            <span className="font-black text-2xl tracking-tight text-neutral-900 leading-none flex items-center">
              Aviorè<span className="text-emerald-600 group-hover:text-emerald-500 transition-colors">Go</span>
              <span className="ml-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          </Link>
        </div>

        {/* Right Section: Notification Icon & Profile Avatar (Always Visible) */}
        <div className="flex items-center gap-3">
          {/* Notification Icon */}
          <Link
            href="/notifications"
            className="relative p-2.5 rounded-full border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-emerald-600 transition-all shadow-2xs flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </Link>

          {/* Profile Avatar (No dropdown) */}
          <Link 
            href="/dashboard/profile"
            className="block h-10 w-10 rounded-full ring-2 ring-neutral-100 hover:ring-emerald-500 transition-all overflow-hidden"
            aria-label="Profile"
          >
            <img 
              src={userAvatar} 
              alt={userName} 
              className="h-full w-full object-cover"
            />
          </Link>
        </div>

      </div>
    </nav>
  );
}