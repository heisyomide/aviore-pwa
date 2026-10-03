"use client";

import Link from "next/link";
import { Sparkles, Calendar, ArrowRight, BellRing, Compass, ShieldCheck, MapPin } from "lucide-react";

export default function EventTripComingSoonPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-3xl w-full mx-auto text-center space-y-8">
        
        {/* Colorful Gradient Hero Card Container */}
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-900 p-8 sm:p-14 text-white shadow-2xl border border-emerald-400/30 overflow-hidden">
          
          {/* Background Decorative Glows */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-100 text-xs font-black tracking-wider uppercase shadow-inner mb-4">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Next-Gen Event Logistics</span>
          </div>

          {/* Main Title & Description */}
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Event Trips & Rides <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">Coming Soon</span>
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
              Seamlessly book dedicated rides, group shuttles, and VIP transport for concerts, festivals, conferences, and celebrations across Lagos.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 text-left">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1.5 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-orange-500/30 flex items-center justify-center text-amber-300 font-bold">
                <Calendar size={16} />
              </div>
              <h3 className="font-bold text-xs text-white">Event Scheduling</h3>
              <p className="text-[11px] text-white/70 leading-relaxed">Book rides in advance timed directly to your event gate times.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1.5 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold">
                <Compass size={16} />
              </div>
              <h3 className="font-bold text-xs text-white">Group & Solo Shuttles</h3>
              <p className="text-[11px] text-white/70 leading-relaxed">Choose individual VIP transit or coordinated convoy rides for squads.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1.5 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
                <ShieldCheck size={16} />
              </div>
              <h3 className="font-bold text-xs text-white">Verified Drivers</h3>
              <p className="text-[11px] text-white/70 leading-relaxed">Top-tier security and escrow backing for absolute peace of mind.</p>
            </div>
          </div>

          {/* Action / Waitlist Call */}
          <div className="relative z-10 pt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs px-8 py-4 rounded-full shadow-lg shadow-orange-600/30 transition-all hover:scale-102"
            >
              <BellRing size={16} />
              <span>Get Notified When Live</span>
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-6 py-4 rounded-full backdrop-blur-md border border-white/20 transition-all"
            >
              <span>Back to Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

        {/* Footer Note */}
        <p className="text-xs text-neutral-400 font-medium flex items-center justify-center gap-1.5">
          <MapPin size={14} className="text-emerald-600" />
          <span>Powered by Aviorè Go Event Logistics Infrastructure • Lagos, Nigeria</span>
        </p>

      </div>
    </div>
  );
}