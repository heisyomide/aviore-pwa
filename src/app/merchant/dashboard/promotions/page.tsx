"use client";

import React from "react";
import { ArrowLeft, Sparkles, Clock, Megaphone } from "lucide-react";
import Link from "next/link";

export default function MerchantPromotionsPage() {
  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      
      {/* Navigation Header */}
      <div className="flex items-center gap-3">
        <Link href="/merchant/dashboard/more" className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Promotions & Discounts</h1>
      </div>

      {/* Coming Soon Banner Card */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-8 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
          <Sparkles size={24} />
        </div>

        <div className="space-y-1.5">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
            Coming Soon
          </span>
          <h2 className="text-base font-black text-neutral-950">Merchant Promotions Are Launching Soon!</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            We are building powerful promotional tools so you can create custom discount codes, run flash sales, and launch flash delivery promos to boost your store sales.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto text-left bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
          <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800">
            <Megaphone size={14} className="text-amber-600 shrink-0" />
            <span>Custom Discount Coupons</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800">
            <Clock size={14} className="text-amber-600 shrink-0" />
            <span>Scheduled Flash Sales & Deals</span>
          </div>
        </div>
      </div>

    </div>
  );
}