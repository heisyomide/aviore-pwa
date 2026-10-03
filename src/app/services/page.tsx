'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Bike,
  Truck,
  Building2,
  Utensils,
  ShoppingBag,
  Pill,
  Ticket,
  Car,
  Clock,
  ShieldCheck,
  Zap,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BellRing,
} from 'lucide-react';

export default function ServicesPage() {
  const [modalService, setModalService] = useState<string | null>(null);

  const handleComingSoonClick = (serviceName: string, e: React.MouseEvent) => {
    e.preventDefault();
    setModalService(serviceName);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900 relative">
      
      {/* Coming Soon Modal Popup */}
      {modalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 text-center space-y-6 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles size={32} className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-wider">
                Coming Soon
              </span>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                {modalService}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                We are currently building high-performance infrastructure for <span className="font-bold text-slate-800">{modalService}</span> on **AVIORÈ**. Stay tuned for our upcoming launch!
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => setModalService(null)}
                className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/25 transition-all"
              >
                Got it, notify me!
              </button>
              <button
                onClick={() => setModalService(null)}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. PAGE HEADER HERO                                           */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-white border-b border-slate-200/80 py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100/80 px-3.5 py-1.5 rounded-full text-emerald-800 text-xs font-bold">
            <Sparkles size={14} className="text-emerald-700" />
            <span>Complete **AVIORÈ** Ecosystem & Services</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Next-gen logistics, commerce, and <br className="hidden sm:inline" />
            <span className="text-emerald-700">lifestyle services built for Africa.</span>
          </h1>

          <p className="text-slate-500 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Explore our live operational services like secure parcel delivery and event ticketing, alongside high-end solutions launching soon across our platform.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. DETAILED SERVICES CATALOG (Live & Upcoming)                 */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Service 1: Send Package (LIVE) */}
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-1.5 rounded-bl-2xl shadow-xs">
            Live Service
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1 rounded-xl text-xs font-extrabold">
              <Package size={16} /> Instant Dispatch & Regional Freight
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Send Package & Express Courier
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Our core live infrastructure. Need documents, items, or commercial goods delivered instantly within cities or across Osun and Oyo State? Enjoy live GPS tracking, OTP security, and instant dispatch booking.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Pickup within 15 minutes',
                'Live GPS telemetry tracking',
                'OTP delivery confirmation code',
                'Same-day regional inter-city freight',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/shipments/create"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-xs active:scale-95"
              >
                Send Package Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Specs</div>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Status</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Operational 🟢</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Avg. Delivery Time</span>
                  <span className="font-extrabold text-slate-900">30 Mins - Same Day</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Fleet Support</span>
                  <span className="font-extrabold text-slate-900">Bikes, Vans & Trucks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coverage Hubs</span>
                  <span className="font-extrabold text-slate-900">Osogbo, Ibadan, Ife, Ede</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service 2: Events & Trips (LIVE) */}
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-1.5 rounded-bl-2xl shadow-xs">
            Live Hub
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1 rounded-xl text-xs font-extrabold">
              <Ticket size={16} /> Ticketing & Event Access
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Upcoming Events & Experience Hub
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Discover and book tickets for exclusive concerts, festivals, and cultural events across Lagos and regional hubs. Secure verified passes directly through your customer dashboard.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Verified digital event ticketing',
                'Curated Lagos & regional concerts',
                'Instant secure registration',
                'Exclusive VIP event passes',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/dashboard/events"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-xs active:scale-95"
              >
                Explore Events Hub <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Specs</div>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Status</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Operational 🟢</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Access</span>
                  <span className="font-extrabold text-slate-900">Customer Dashboard</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verification</span>
                  <span className="font-extrabold text-slate-900">Instant QR / Passcode</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service 3: Food Delivery (COMING SOON) */}
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-orange-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-1.5 rounded-bl-2xl shadow-xs">
            Coming Soon
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-800 px-3 py-1 rounded-xl text-xs font-extrabold">
              <Utensils size={16} /> Restaurant Delivery
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Food Delivery & Local Dining
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Order hot meals from top-rated local restaurants and eateries delivered straight to your doorstep or event venue with live temperature-controlled packaging.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Top local restaurant partners',
                'Real-time order preparation tracking',
                'Hot & fresh delivery guarantee',
                'Integrated wallet checkout',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-orange-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button
                onClick={(e) => handleComingSoonClick('Food Delivery', e)}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md shadow-orange-500/20 active:scale-95"
              >
                Notify Me When Live <BellRing size={16} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-orange-50/50 border border-orange-200/60 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-400">Launch Roadmap</div>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex justify-between pb-2 border-b border-orange-200">
                  <span className="text-slate-500">Status</span>
                  <span className="font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">In Development ⏳</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-orange-200">
                  <span className="text-slate-500">Target Rollout</span>
                  <span className="font-extrabold text-slate-900">Upcoming Quarter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vendor Integration</span>
                  <span className="font-extrabold text-slate-900">Partner Onboarding Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service 4: Marketplace (COMING SOON) */}
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-purple-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-1.5 rounded-bl-2xl shadow-xs">
            Coming Soon
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-800 px-3 py-1 rounded-xl text-xs font-extrabold">
              <ShoppingBag size={16} /> E-Commerce & Creator Store
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              **AVIORÈ** Marketplace & Merchandise
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Shop curated items, apparel, creative merchandise, and vendor stores with integrated escrow payment and fast delivery right out of the box.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Exclusive creator merchandise',
                'Escrow-protected purchases',
                'Instant vendor storefront setup',
                'Seamless delivery pairing',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-purple-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button
                onClick={(e) => handleComingSoonClick('Marketplace', e)}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md shadow-purple-600/20 active:scale-95"
              >
                Notify Me When Live <BellRing size={16} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-purple-50/50 border border-purple-200/60 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400">Launch Roadmap</div>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex justify-between pb-2 border-b border-purple-200">
                  <span className="text-slate-500">Status</span>
                  <span className="font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">In Development ⏳</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-purple-200">
                  <span className="text-slate-500">Features</span>
                  <span className="font-extrabold text-slate-900">Catalog & Checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Storefronts</span>
                  <span className="font-extrabold text-slate-900">Creator Beta</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service 5: Pharmacy & Health (COMING SOON) */}
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-rose-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-1.5 rounded-bl-2xl shadow-xs">
            Coming Soon
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-800 px-3 py-1 rounded-xl text-xs font-extrabold">
              <Pill size={16} /> 24/7 Healthcare & Pharmacy
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Pharmacy & Health Essentials
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Order prescribed medications, vitamins, and urgent health essentials from verified pharmacies with priority emergency dispatch.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Verified partner pharmacies',
                'Priority emergency medical dispatches',
                'Prescription upload verification',
                'Discrete and secure handling',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-rose-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button
                onClick={(e) => handleComingSoonClick('Pharmacy & Health', e)}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md shadow-rose-600/20 active:scale-95"
              >
                Notify Me When Live <BellRing size={16} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-rose-50/50 border border-rose-200/60 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-400">Launch Roadmap</div>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex justify-between pb-2 border-b border-rose-200">
                  <span className="text-slate-500">Status</span>
                  <span className="font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">In Development ⏳</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-rose-200">
                  <span className="text-slate-500">Compliance</span>
                  <span className="font-extrabold text-slate-900">Regulatory Review</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Availability</span>
                  <span className="font-extrabold text-slate-900">24/7 Coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service 6: Event Rides & Transit (COMING SOON) */}
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-blue-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-1.5 rounded-bl-2xl shadow-xs">
            Coming Soon
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-800 px-3 py-1 rounded-xl text-xs font-extrabold">
              <Car size={16} /> Ride Bookings & Event Shuttles
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Event Rides & Transit Shuttles
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Book dedicated rides, group shuttles, and VIP transport synchronized directly with concerts, festivals, and celebrations across Lagos.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Event-timed ride scheduling',
                'Group & squad convoy shuttles',
                'VIP secure transit drivers',
                'Integrated ticket + ride bundles',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button
                onClick={(e) => handleComingSoonClick('Event Rides & Transit', e)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95"
              >
                Notify Me When Live <BellRing size={16} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-blue-50/50 border border-blue-200/60 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400">Launch Roadmap</div>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex justify-between pb-2 border-b border-blue-200">
                  <span className="text-slate-500">Status</span>
                  <span className="font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">In Development ⏳</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-blue-200">
                  <span className="text-slate-500">Integration</span>
                  <span className="font-extrabold text-slate-900">Event Pass Sync</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hubs</span>
                  <span className="font-extrabold text-slate-900">Lagos State</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. VALUE PROPOSITION GRID                                     */}
        {/* ------------------------------------------------------------- */}
        <section className="bg-emerald-950 text-white rounded-[2.5rem] p-8 sm:p-12 space-y-8 shadow-2xl">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Why Choose **AVIORÈ** Go Services?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-medium">
              We leverage modern GPS technology and local logistics expertise to deliver unparalleled reliability across every touchpoint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-900/40 border border-emerald-800/80 p-6 rounded-2xl space-y-3">
              <Clock size={24} className="text-emerald-400" />
              <h3 className="font-extrabold text-base text-white">Automated Matching</h3>
              <p className="text-xs text-emerald-100/70 font-medium leading-relaxed">
                Smart dispatch algorithms assign nearest available riders automatically, minimizing wait time.
              </p>
            </div>

            <div className="bg-emerald-900/40 border border-emerald-800/80 p-6 rounded-2xl space-y-3">
              <ShieldCheck size={24} className="text-emerald-400" />
              <h3 className="font-extrabold text-base text-white">End-to-End Security</h3>
              <p className="text-xs text-emerald-100/70 font-medium leading-relaxed">
                Protected by OTP delivery verification, identity checks, and real-time route monitoring.
              </p>
            </div>

            <div className="bg-emerald-900/40 border border-emerald-800/80 p-6 rounded-2xl space-y-3">
              <Zap size={24} className="text-emerald-400" />
              <h3 className="font-extrabold text-base text-white">Transparent Telemetry</h3>
              <p className="text-xs text-emerald-100/70 font-medium leading-relaxed">
                Share live tracking links so customers can follow package and event ride movement on dynamic map view.
              </p>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
}