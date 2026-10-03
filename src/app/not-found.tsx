"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PackageSearch,
  Home,
  PlusCircle,
  LifeBuoy,
  Search,
  ArrowLeft,
  Compass,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    router.push(`/dashboard/shipment/track?id=${encodeURIComponent(trackingNumber.trim())}`);
  };

  return (
    <div className="bg-neutral-950 text-neutral-300 min-h-screen flex flex-col justify-center items-center px-4 py-16 font-sans relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-900/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        
        {/* 404 Visual Icon Badge */}
        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl relative group">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
            <PackageSearch size={32} />
          </div>
          <span className="absolute -top-2 -right-2 bg-emerald-600 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-neutral-950">
            404
          </span>
        </div>

        {/* Text Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Package Not Found / Lost Route
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            The page or manifest path you are looking for doesn&apos;t exist, was renamed, or has been rerouted to another dispatch hub.
          </p>
        </div>

        {/* Quick Tracking Search Box */}
        <div className="bg-neutral-900/70 border border-neutral-800 p-4 sm:p-5 rounded-2xl max-w-md mx-auto space-y-2 text-left">
          <label className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1.5">
            <Compass size={14} className="text-emerald-500" />
            <span>Looking for a active shipment?</span>
          </label>
          <form onSubmit={handleTrackSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter Tracking ID (e.g. TRK-8920)"
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Search size={14} />
              <span>Track</span>
            </button>
          </form>
        </div>

        {/* Navigation Shortcut Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Link
            href="/"
            className="bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/80 hover:border-emerald-500/50 p-4 rounded-2xl transition-all flex flex-col items-center justify-center space-y-2 group text-center"
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-800 text-neutral-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
              <Home size={16} />
            </div>
            <span className="text-xs font-bold text-white">Back to Home</span>
            <span className="text-[10px] text-neutral-500">Return to landing page</span>
          </Link>

          <Link
            href="/dashboard/shipment/create"
            className="bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/80 hover:border-emerald-500/50 p-4 rounded-2xl transition-all flex flex-col items-center justify-center space-y-2 group text-center"
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-800 text-neutral-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
              <PlusCircle size={16} />
            </div>
            <span className="text-xs font-bold text-white">Book Shipment</span>
            <span className="text-[10px] text-neutral-500">Create new dispatch</span>
          </Link>

          <Link
            href="/support"
            className="bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/80 hover:border-emerald-500/50 p-4 rounded-2xl transition-all flex flex-col items-center justify-center space-y-2 group text-center"
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-800 text-neutral-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
              <LifeBuoy size={16} />
            </div>
            <span className="text-xs font-bold text-white">Help Center</span>
            <span className="text-[10px] text-neutral-500">Contact operations</span>
          </Link>
        </div>

        {/* Back Button */}
        <div className="pt-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Go back to previous page</span>
          </button>
        </div>

      </div>
    </div>
  );
}