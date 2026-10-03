'use client';

import React, { useState, useEffect } from 'react';
import { Search, Package, Calendar, Bus, Briefcase, ArrowRight, MapPin, Loader2, ChevronDown, Store } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/src/lib/api';

const staticQuickLinks = [
  { label: 'Send a Package', href: '/shipments/create', icon: Package, category: 'Delivery' },
  { label: 'Explore Events', href: '/events', icon: Calendar, category: 'Events' },
  { label: 'Book a Bus Ride', href: '/events/trips', icon: Bus, category: 'Transit' },
  { label: 'Organizer Portal', href: '/events/dashboard', icon: Briefcase, category: 'Business' },
];

export default function HomeSearchBarSection() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('Home - Osogbo');
  const [isLocating, setIsLocating] = useState(false);
  const [searchResults, setSearchResults] = useState<{ title: string; category: string; href: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Debounced live fetch using the standardized Axios API client
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await api.get('/search', {
          params: { q: query },
        });
        
        const data = response.data;
        // Flatten backend results into a unified list using correct backend keys (merchants & events)
        const combined = [...(data.merchants || []), ...(data.events || [])];
        setSearchResults(combined);
      } catch (err) {
        console.error('Search failed', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setCurrentAddress(`Current - ${data.address.city || data.address.town || 'Osogbo'}`);
        } catch {
          setCurrentAddress('Osogbo');
        } finally {
          setIsLocating(false);
        }
      },
      () => setIsLocating(false),
      { timeout: 10000 }
    );
  };

  return (
    <div className="w-full bg-white border-b border-neutral-100 py-6 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Location Selector */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
          >
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Deliver to</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm font-black text-neutral-900 group-hover:text-emerald-700 transition-colors">
                <span>{isLocating ? 'Detecting location...' : currentAddress}</span>
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
              </div>
            </div>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-3xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-emerald-600 h-5 w-5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder="Search for restaurants, groceries, or services near you..."
              className="w-full bg-neutral-100/90 border border-neutral-200/80 rounded-2xl pl-12 pr-28 py-4 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 transition-all font-medium shadow-sm"
            />
            <div className="absolute right-3 hidden sm:flex items-center gap-1">
              {isSearching && <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600 mr-1" />}
              <span className="text-[10px] font-mono bg-neutral-200/70 text-neutral-700 px-2.5 py-1.5 rounded-xl font-bold">
                Press Enter ↵
              </span>
            </div>
          </div>

          {/* Suggestions Dropdown */}
          {isFocused && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden z-50 p-3 space-y-3 animate-in fade-in slide-in-from-top-2">
              
              {query.trim().length === 0 ? (
                <div className="space-y-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 px-1">Quick Actions</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {staticQuickLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-2.5 p-2.5 hover:bg-emerald-50/80 rounded-xl transition-colors group border border-neutral-100"
                        >
                          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-bold text-neutral-800 group-hover:text-emerald-700 transition-colors">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 px-1 pb-2">Live Results</p>
                  {searchResults.length > 0 ? (
                    searchResults.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center justify-between p-3 hover:bg-emerald-50/80 transition-colors group rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Store className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors">{item.title}</p>
                            <p className="text-[10px] text-neutral-500 font-mono">Category: {item.category}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-neutral-500 font-medium">
                      No matching records for "<span className="text-neutral-900 font-bold">{query}</span>". Press Enter to view full search page.
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}