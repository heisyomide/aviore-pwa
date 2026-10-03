'use client';

import Link from 'next/link';

export default function HomeServiceCardsSection() {
  return (
    <div className="w-full px-4 mb-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-3 min-w-max sm:grid sm:grid-cols-3 sm:min-w-0">
        
        {/* 1. Order Food Card */}
        <Link 
          href="/food"
          className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/70 to-amber-50/20 p-4 w-[260px] sm:w-auto shadow-2xs transition-all hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center text-2xl">
              🍔
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 tracking-tight">Order Food</h3>
              <p className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5">From local restaurants</p>
            </div>
          </div>
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold transition-transform group-hover:translate-x-0.5">
            →
          </div>
        </Link>

        {/* 2. Send Package Card */}
        <Link 
          href="/dashboard/shipment/create"
          className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/70 to-yellow-50/20 p-4 w-[260px] sm:w-auto shadow-2xs transition-all hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center text-2xl">
              📦
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 tracking-tight">Send Package</h3>
              <p className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5">Deliver anything, anywhere</p>
            </div>
          </div>
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold transition-transform group-hover:translate-x-0.5">
            →
          </div>
        </Link>

        {/* 3. Events Card */}
        <Link 
          href="/dashboard/events"
          className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/70 to-indigo-50/20 p-4 w-[260px] sm:w-auto shadow-2xs transition-all hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center text-2xl">
              🎟️
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 tracking-tight">Events</h3>
              <p className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5">Tickets & event logistics</p>
            </div>
          </div>
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold transition-transform group-hover:translate-x-0.5">
            →
          </div>
        </Link>

      </div>
    </div>
  );
}