'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  MapPin,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Building2,
  Navigation,
  Sparkles,
  Zap,
} from 'lucide-react';

// Coverage Data Structure
interface HubLocation {
  id: string;
  name: string;
  state: 'Osun' | 'Oyo';
  status: 'Active' | 'Expanding' | 'Hub Lead';
  coverageRadius: string;
  estimatedDelivery: string;
  popularRoutes: string[];
  description: string;
}

const HUBS: HubLocation[] = [
  {
    id: 'osogbo',
    name: 'Osogbo Central Hub',
    state: 'Osun',
    status: 'Active',
    coverageRadius: '25 km radius',
    estimatedDelivery: '30 - 60 mins',
    popularRoutes: ['Osogbo → Ede', 'Osogbo → Ife', 'Osogbo → Ilesa'],
    description: 'Primary central dispatch node covering Alekuwodo, Gbongan Road, Ogo-Oluwa, Ring Road, and surrounding university quarters.',
  },
  {
    id: 'ede',
    name: 'Ede Campus & Tech Zone',
    state: 'Osun',
    status: 'Active',
    coverageRadius: '18 km radius',
    estimatedDelivery: '25 - 45 mins',
    popularRoutes: ['Ede → Osogbo', 'Ede → Ejigbo'],
    description: 'Serving Federal Polytechnic, Redeemer’s University campus, Owode, and fast express corridors to Osogbo.',
  },
  {
    id: 'ife',
    name: 'Ile-Ife University Node',
    state: 'Osun',
    status: 'Active',
    coverageRadius: '20 km radius',
    estimatedDelivery: '35 - 50 mins',
    popularRoutes: ['Ife → Osogbo', 'Ife → Modakeke', 'Ife → Ondo Border'],
    description: 'Dedicated fleet coverage across OAU Campus, Mayfair, Campus Gate, Lagere, Parakin, and Modakeke.',
  },
  {
    id: 'ilesa',
    name: 'Ilesa Commercial Hub',
    state: 'Osun',
    status: 'Active',
    coverageRadius: '15 km radius',
    estimatedDelivery: '30 - 60 mins',
    popularRoutes: ['Ilesa → Osogbo', 'Ilesa → Ife'],
    description: 'Full logistics routing across Roundabout, Isokun, Imo, Brewery area, and Ilesa-Akure highway route.',
  },
  {
    id: 'ibadan-central',
    name: 'Ibadan Urban Core',
    state: 'Oyo',
    status: 'Active',
    coverageRadius: '35 km radius',
    estimatedDelivery: '25 - 50 mins',
    popularRoutes: ['Ibadan → Osogbo Express', 'Bodija → Ring Road', 'UI → Challenge'],
    description: 'High-density network spanning Bodija, Dugbe, Challenge, University of Ibadan, Iwo Road, Akobo, and Oluyole.',
  },
  {
    id: 'ibadan-express',
    name: 'Ibadan Inter-State Corridor',
    state: 'Oyo',
    status: 'Active',
    coverageRadius: 'State Express Corridor',
    estimatedDelivery: 'Same Day / Intra-State express',
    popularRoutes: ['Ibadan → Osogbo', 'Ibadan → Oyo Town', 'Ibadan → Ogbomoso'],
    description: 'Dedicated inter-state courier corridor linking major commercial warehouses along Tollgate, Iwo Road, and Moniya intermodal station.',
  },
  {
    id: 'ogbomoso',
    name: 'Ogbomoso North & South',
    state: 'Oyo',
    status: 'Active',
    coverageRadius: '20 km radius',
    estimatedDelivery: '30 - 55 mins',
    popularRoutes: ['Ogbomoso → LAUTECH', 'Ogbomoso → Ibadan', 'Ogbomoso → Ilorin Axis'],
    description: 'Providing seamless logistics across LAUTECH campus, General Hospital, Takie Square, Sabo, and Under-G.',
  },
  {
    id: 'oyo-town',
    name: 'Oyo Town & Express',
    state: 'Oyo',
    status: 'Active',
    coverageRadius: '15 km radius',
    estimatedDelivery: '35 - 60 mins',
    popularRoutes: ['Oyo → Ibadan', 'Oyo → Ogbomoso'],
    description: 'Connecting Akesan Market, Owode, Isale Oyo, and the main Ibadan-Ilorin express arterial roads.',
  },
];

export default function CoveragePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<'All' | 'Osun' | 'Oyo'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHubs = HUBS.filter((hub) => {
    const matchesState = selectedState === 'All' || hub.state === selectedState;
    const matchesSearch =
      hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.popularRoutes.some((route) => route.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesState && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. NAVIGATION BAR                                            */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-700 text-white p-2 rounded-xl group-hover:bg-emerald-800 transition-colors">
              <Package size={22} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tight text-slate-900 flex items-center gap-1.5">
                Aviorè <span className="inline-flex items-center bg-emerald-700 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-normal align-middle shadow-xs">Go</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 -mt-0.5">
                Smart . Secure . Reliable
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/#services" className="hover:text-slate-900 transition-colors">
              Services
            </Link>
            <Link href="/#how-it-works" className="hover:text-slate-900 transition-colors">
              How it Works
            </Link>
            <Link href="/coverage" className="text-emerald-700 font-bold">
              Coverage
            </Link>
            <Link href="/#rider" className="hover:text-slate-900 transition-colors">
              Become a Rider
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
            >
              Login
            </Link>
            <Link
              href="/shipments/create"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white shadow-xs transition-all active:scale-95"
            >
              Send Package
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
            <Link href="/" className="block py-2 text-sm font-semibold text-slate-700">
              Home
            </Link>
            <Link href="/#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">
              Services
            </Link>
            <Link href="/coverage" className="block py-2 text-sm font-bold text-emerald-700">
              Coverage Network
            </Link>
            <Link href="/#rider" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">
              Become a Rider
            </Link>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/login" className="w-full text-center py-2.5 text-sm font-bold text-slate-800 bg-slate-100 rounded-xl">
                Login
              </Link>
              <Link href="/shipments/create" className="w-full text-center py-2.5 text-sm font-bold text-white bg-emerald-700 rounded-xl shadow-xs">
                Send Package
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. PAGE HEADER / HERO                                         */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-white border-b border-slate-200/80 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100/80 px-3.5 py-1.5 rounded-full text-emerald-800 text-xs font-bold">
            <Navigation size={14} className="text-emerald-700" />
            <span>Regional Fleet Operations</span>
          </div>
          
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Osun & Oyo State <br className="hidden sm:inline" />
              <span className="text-emerald-700">Dispatch Network Coverage</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed">
              We operate an active hyper-local delivery network connecting key metropolitan hubs, university towns, and inter-state logistics corridors across Osun and Oyo.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-4xl">
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Hubs</p>
              <p className="text-2xl font-black text-slate-900 mt-1">8 Node Centers</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Pickup</p>
              <p className="text-2xl font-black text-emerald-700 mt-1 font-mono">&lt; 15 Mins</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inter-State Route</p>
              <p className="text-2xl font-black text-slate-900 mt-1">Same-Day Express</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">GPS Tracking</p>
              <p className="text-2xl font-black text-slate-900 mt-1">100% Live</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. INTERACTIVE FILTER & HUBS GRID                             */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Controls: Search & Tabs */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          
          {/* Filter Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setSelectedState('All')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedState === 'All'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Zones
            </button>
            <button
              onClick={() => setSelectedState('Osun')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedState === 'Osun'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Osun State
            </button>
            <button
              onClick={() => setSelectedState('Oyo')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedState === 'Oyo'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Oyo State
            </button>
          </div>

          {/* Location Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search city, town, or campus route (e.g., Osogbo, OAU, Bodija)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-700 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Coverage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHubs.map((hub) => (
            <div
              key={hub.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Card Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{hub.name}</h3>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {hub.state} State
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full border border-emerald-200/50 shrink-0">
                    <CheckCircle2 size={12} /> {hub.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {hub.description}
                </p>

                {/* Logistics Metrics */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Coverage Radius:</span>
                    <span className="font-bold text-slate-800">{hub.coverageRadius}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Avg Dropoff Time:</span>
                    <span className="font-bold text-emerald-700 font-mono">{hub.estimatedDelivery}</span>
                  </div>
                </div>

                {/* Popular Connected Routes */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">High-Frequency Corridors:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {hub.popularRoutes.map((route, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60"
                      >
                        {route}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Need dispatch here?</span>
                <Link
                  href={`/shipments/create?origin=${encodeURIComponent(hub.name)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  <span>Book Dispatch</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Fallback Empty State */}
        {filteredHubs.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Location Not Listed Yet?</h3>
              <p className="text-xs text-slate-500 mt-1">We still offer custom direct charter dispatches across all local government areas in Osun and Oyo.</p>
            </div>
            <Link
              href="/shipments/create"
              className="inline-block bg-slate-950 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all"
            >
              Request Custom Route Dispatch
            </Link>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 4. EXPANSION & REQUEST LOCATION BANNER                        */}
        {/* ------------------------------------------------------------- */}
        <section className="rounded-[2.5rem] bg-emerald-950 text-white overflow-hidden p-8 sm:p-12 border border-emerald-900 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-800 px-3 py-1 rounded-full text-emerald-300 text-xs font-bold">
              <Zap size={14} className="text-emerald-400" />
              <span>Network Expansion Active</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Expanding rapidly to adjacent towns and industrial centers.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-medium max-w-xl">
              Are you a merchant, vendor, or enterprise sending daily shipments to unlisted areas? Partner with us to establish a dedicated hub route.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Link
              href="/business"
              className="bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Partner With Aviorè</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* 5. FOOTER                                                     */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-white border-t border-slate-200/80 px-6 lg:px-16 py-12 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-700 text-white p-1 rounded-lg">
              <Package size={16} />
            </div>
            <span className="font-extrabold text-slate-900">Aviorè Go</span>
            <span>&copy; 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}