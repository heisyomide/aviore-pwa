"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Store, Search, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const ecosystemCards = [
  {
    title: "Personal Users",
    description: "Send personal parcels, food items, laundry, or store orders across town effortlessly.",
    href: "/dashboard",
    icon: User,
    actionText: "Send Personal Package",
    badge: "Fast",
    features: ["Doorstep Pickup", "PIN Hand-off Security", "Live Route Tracking"],
    bgLight: "bg-linear-to-br from-emerald-50 via-teal-50 to-green-100 hover:from-emerald-100 hover:to-teal-200",
    borderColor: "border-emerald-300/60",
    textColor: "text-emerald-950",
    accentColor: "bg-emerald-600 text-white",
    btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
    badgeStyle: "bg-emerald-500/20 text-emerald-900 border-emerald-300",
    isForm: false,
  },
  {
    title: "Merchants & Businesses",
    description: "Automate your delivery workflows with batch shipping, dashboard analytics, and escrow protection.",
    href: "/register/business",
    icon: Store,
    actionText: "Open Business Account",
    badge: "Enterprise",
    features: ["Automated Bulk Orders", "Merchant Dashboard", "Scheduled Payouts"],
    bgLight: "bg-linear-to-br from-indigo-50 via-blue-50 to-purple-100 hover:from-indigo-100 hover:to-purple-200",
    borderColor: "border-indigo-300/60",
    textColor: "text-indigo-950",
    accentColor: "bg-indigo-600 text-white",
    btnColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
    badgeStyle: "bg-indigo-500/20 text-indigo-900 border-indigo-300",
    isForm: false,
  },
  {
    title: "Quick Track Shipment",
    description: "Got a tracking number? Enter your shipment code below to see real-time status instantly.",
    href: "/dashboard/shipment",
    icon: Search,
    actionText: "Track Package",
    badge: "Live",
    features: ["Instant Status Lookup", "Exact Rider Location", "Proof of Delivery"],
    bgLight: "bg-linear-to-br from-orange-50 via-amber-50 to-yellow-100 hover:from-orange-100 hover:to-yellow-200",
    borderColor: "border-orange-300/60",
    textColor: "text-orange-950",
    accentColor: "bg-orange-500 text-white",
    btnColor: "bg-orange-600 hover:bg-orange-700 text-white",
    badgeStyle: "bg-orange-500/20 text-orange-900 border-orange-300",
    isForm: true,
  },
];

export default function EcosystemSection() {
  const [trackingId, setTrackingId] = useState("");

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      window.location.href = `/dashboard/shipment/${trackingId.trim()}`;
    }
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Complete Ecosystem</span>
          </div>
          <h2 className="text-3xl font-black text-neutral-900">
            Tailored Logistics Solutions
          </h2>
        </div>

        {/* Horizontal Scrollable on Mobile, 3-Col Grid on Desktop */}
        <div className="flex sm:grid sm:grid-cols-3 gap-5 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {ecosystemCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`group relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl ${card.bgLight} border ${card.borderColor} transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 shrink-0 w-[270px] sm:w-auto`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-2xl ${card.accentColor} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon size={20} />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${card.badgeStyle} bg-white/90`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 className={`text-lg font-black ${card.textColor} mb-1.5`}>
                    {card.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-medium line-clamp-2">
                    {card.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-black/5 mt-3">
                    {card.features.map((item) => (
                      <div key={item} className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-700">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-black/5">
                  {card.isForm ? (
                    <form onSubmit={handleTrackSubmit} className="space-y-2">
                      <input
                        type="text"
                        placeholder="e.g., AVG-8932-OS"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300/80 bg-white/90 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
                      />
                      <button
                        type="submit"
                        className={`w-full ${card.btnColor} font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5`}
                      >
                        <span>{card.actionText}</span>
                        <ArrowRight size={13} />
                      </button>
                    </form>
                  ) : (
                    <Link
                      href={card.href}
                      className={`w-full ${card.btnColor} font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5`}
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}