'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Building2,
  Store,
  Truck,
  TrendingUp,
  ShieldCheck,
  Clock,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  Headphones,
  Bell,
  X,
  Menu,
  Lock,
  Hourglass,
  Send,
} from 'lucide-react';

export default function BusinessPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessName, setBusinessName] = useState('');

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessEmail) {
      setWaitlistSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. HEADER                                                     */}
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
                Business Logistics Solutions
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link href="/how-it-works" className="hover:text-slate-900 transition-colors">How it Works</Link>
            <Link href="/coverage" className="hover:text-slate-900 transition-colors">Coverage</Link>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Building2 size={14} /> For Business
            </span>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setWaitlistModalOpen(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Partner With Us</span>
              <span className="bg-emerald-900/60 text-emerald-200 text-[10px] px-2 py-0.5 rounded-md uppercase font-extrabold tracking-wider">
                Coming Soon
              </span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
            <Link href="/" className="block py-2 text-sm font-semibold text-slate-700">Home</Link>
            <Link href="/how-it-works" className="block py-2 text-sm font-semibold text-slate-700">How It Works</Link>
            <Link href="/coverage" className="block py-2 text-sm font-semibold text-slate-700">Coverage Network</Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setWaitlistModalOpen(true);
              }}
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-emerald-700 rounded-xl"
            >
              Join Business Waitlist
            </button>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. COMING SOON ANNOUNCEMENT BANNER                            */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-3 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs font-bold text-amber-900">
          <Hourglass size={16} className="text-amber-600 animate-pulse" />
          <span>
            Aviorè Go Enterprise Portal is launching soon across Osun & Oyo State!
          </span>
          <button
            onClick={() => setWaitlistModalOpen(true)}
            className="underline underline-offset-2 hover:text-amber-950 font-black ml-1"
          >
            Join Priority Waitlist &rarr;
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. HERO SECTION                                               */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-slate-950 text-white border-b border-slate-800 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-bold">
            <Building2 size={14} />
            <span>Corporate & E-Commerce Logistics</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight">
            Scale Your Business Deliveries With <br className="hidden sm:inline" />
            <span className="text-emerald-400">Aviorè Go Enterprise</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            From online merchants and pharmacies to corporate offices—power your supply chain with automated dispatch, bulk order management, and dedicated fleet options.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setWaitlistModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <Bell size={16} />
              <span>Join Business Waitlist</span>
            </button>

            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Features</span>
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="pt-8 flex items-center justify-center gap-8 text-xs font-semibold text-slate-400 border-t border-slate-900 max-w-xl mx-auto">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Bulk Order Upload</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>API Integration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Monthly Billing</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. BUSINESS SOLUTIONS & FEATURES                              */}
      {/* ------------------------------------------------------------- */}
      <section id="features" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md">
            Built For Growth
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
            Logistics Infrastructure Designed For Modern Businesses
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Eliminate operational headaches with tools engineered specifically for high-volume dispatchers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4 hover:border-emerald-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900">Dedicated Enterprise Dashboard</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Manage all company deliveries from one centralized portal. Create bulk orders, track active riders in real time, and download financial reports.
            </p>
            <ul className="text-xs font-semibold text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-700" /> CSV / Excel bulk batch uploading
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-700" /> Multi-branch location switching
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4 hover:border-emerald-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Store size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900">E-Commerce & Store Fulfillment</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Seamlessly integrate Aviorè Go into your online store or physical boutique. Deliver same-day orders directly from your shelves to customer doorsteps.
            </p>
            <ul className="text-xs font-semibold text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-700" /> Scheduled daily pickup windows
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-700" /> Automated customer SMS tracking
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4 hover:border-emerald-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900">Corporate Fleet On-Demand</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Need dedicated riders exclusively assigned to your office or factory? Access flexible fleet leasing for daily, weekly, or monthly contracts.
            </p>
            <ul className="text-xs font-semibold text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-700" /> Dedicated account manager
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-700" /> Custom branded delivery options
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. HOW BUSINESSES WILL JOIN (WORKFLOW STEPS)                  */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-white border-y border-slate-200/80 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md">
              Onboarding Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
              How Your Business Will Join
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto">
              When our corporate portal launches, getting started will take less than 10 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
            
            <div className="space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white font-black flex items-center justify-center mx-auto sm:mx-0">
                1
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Create Business Account</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Register your company with basic business registration (CAC) and contact details.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white font-black flex items-center justify-center mx-auto sm:mx-0">
                2
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Fund Corporate Wallet</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Pre-load your corporate wallet via bank transfer or card for seamless automated billing.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white font-black flex items-center justify-center mx-auto sm:mx-0">
                3
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Dispatch Single or Bulk</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Upload order sheets or click "Dispatch Now" to assign riders across Osun & Oyo.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white font-black flex items-center justify-center mx-auto sm:mx-0">
                4
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Track & Manage</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Monitor delivery completion in real time and receive digital proof-of-delivery receipts.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. COMING SOON CTA CARD                                       */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 lg:py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Hourglass size={32} />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <div className="inline-block bg-amber-500/20 text-amber-300 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Launching Soon
            </div>
            <h2 className="text-2xl sm:text-4xl font-black">
              Be First In Line When We Go Live
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              We are currently enrolling early business partners in Osogbo, Ibadan, Ile-Ife, and Ede. Join our waitlist to receive priority access and discounted early-bird enterprise rates.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setWaitlistModalOpen(true)}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 inline-flex items-center gap-2"
            >
              <Bell size={16} />
              <span>Join Priority Waitlist</span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. WAITLIST MODAL                                             */}
      {/* ------------------------------------------------------------- */}
      {waitlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative space-y-6">
            
            <button
              onClick={() => {
                setWaitlistModalOpen(false);
                setWaitlistSubmitted(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={20} />
            </button>

            {waitlistSubmitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900">You're on the list!</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Thank you for your interest in <span className="font-bold text-slate-800">Aviorè Go Enterprise</span>. Our corporate relations team will reach out to <span className="font-bold text-slate-800">{businessEmail}</span> prior to official rollout.
                </p>
                <button
                  onClick={() => {
                    setWaitlistModalOpen(false);
                    setWaitlistSubmitted(false);
                  }}
                  className="w-full py-3 bg-slate-950 text-white font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-amber-600 font-extrabold text-[11px] uppercase tracking-wider">
                    <Hourglass size={14} /> Coming Soon
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Join Business Waitlist</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Get early access and corporate delivery discounts when we launch.
                  </p>
                </div>

                <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Company / Store Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Fashion Hub"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-700 bg-slate-50"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Business Email Address</label>
                    <input
                      type="email"
                      placeholder="orders@apexfashion.com"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-700 bg-slate-50"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    <span>Request Early Access</span>
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. FOOTER                                                     */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-white border-t border-slate-200/80 px-6 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-700 text-white p-1 rounded-lg">
              <Package size={16} />
            </div>
            <span className="font-extrabold text-slate-900">Aviorè Go Logistics</span>
            <span>&copy; 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link href="/how-it-works" className="hover:text-slate-900 transition-colors">How it Works</Link>
            <Link href="/coverage" className="hover:text-slate-900 transition-colors">Coverage Network</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}