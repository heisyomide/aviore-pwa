"use client";

import { useRouter } from "next/navigation";
import { MapPin, ChevronDown, User, Sparkles, ArrowRight } from "lucide-react";
import { useAppLocation } from "@/src/context/AppLocationContext";
import { useAuth } from "@/src/context/AuthContext";

const HERO_SERVICES = [
  {
    id: "food",
    title: "Order Food",
    action: (router: any) => router.push("/food"),
    bg: "bg-[#ffe4f1]",
    text: "text-[#700d3a]",
    illustration: "🍲",
  },
  {
    id: "shipment",
    title: "Send Package",
    action: (router: any) => router.push("/dashboard/shipment"),
    bg: "bg-[#e6fcf5]",
    text: "text-[#085034]",
    illustration: "📦",
  },
  {
    id: "marketplace",
    title: "Buy On Aviorè Marketplace",
    action: () => {
      window.open('https://shopaviore.store', '_blank');
    },
    bg: "bg-[#fff9db]",
    text: "text-[#5c4300]",
    illustration: "🛒",
  },
  {
    id: "events",
    title: "View Events",
    action: (router: any) => router.push("/events"),
    bg: "bg-[#f3f0ff]",
    text: "text-[#3c096c]",
    illustration: "🎉",
  },
];

export default function HeroBanner() {
  const router = useRouter();
  const { appLocation, startChangingLocation } = useAppLocation();
  const { user } = useAuth();

  return (
    <section className="relative w-full bg-[#0b5335] text-white pt-4 pb-8 px-4 md:px-12 lg:px-20 shadow-xl rounded-b-[3.5rem]">
      {/* Precision Vector Vertical Stripe Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-b-[3.5rem]">
        <svg className="absolute w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="vertical-stripes" width="48" height="100%" patternUnits="userSpaceOnUse">
              <line x1="24" y1="0" x2="24" y2="100%" stroke="#ffffff" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vertical-stripes)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Bar inside Hero */}
        <nav className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={() => {
              startChangingLocation();
              router.push("/location");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/30 border border-white/10 rounded-full text-xs font-bold text-emerald-100 transition-all cursor-pointer group shadow-sm backdrop-blur-md"
          >
            <MapPin size={15} className="text-yellow-400 shrink-0" />
            <span className="truncate max-w-xs">{appLocation?.address || "Select Delivery Address"}</span>
            <ChevronDown size={14} className="text-emerald-300 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Conditional Auth Button: Profile Icon only if logged in, Log in if guest */}
          {user ? (
            <button
              type="button"
              onClick={() => router.push("/dashboard/profile")}
              className="flex items-center justify-center w-9 h-9 bg-white text-neutral-900 hover:bg-emerald-50 rounded-full shadow-lg transition-all cursor-pointer"
              title="Profile"
            >
              <User size={15} className="text-emerald-700" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 hover:bg-emerald-50 rounded-full text-xs font-black shadow-lg transition-all cursor-pointer"
            >
              <User size={13} className="text-emerald-700" />
              <span>Log in</span>
            </button>
          )}
        </nav>

        {/* Main Section Stacked Layout: Promo Tag on Top, 2x2 Stamp Cards Below */}
        <div className="flex flex-col items-center space-y-6 pt-1">
          
          {/* Top: Compact Organic SVG Price-Tag Hero Badge */}
          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-1.5 h-10 bg-linear-to-b from-yellow-300 to-yellow-500 rounded-full shadow-md" />
              
              <div className="bg-[#05321f] border border-emerald-500/30 rounded-[2.5rem] py-5 px-6 text-center relative shadow-2xl backdrop-blur-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-400 rounded-full shadow-inner opacity-90" />
                
                <p className="text-[10px] text-emerald-200/90 font-bold uppercase tracking-widest">
                  YOU'VE UNLOCKED
                </p>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-white leading-tight">
                  FREE DELIVERY <span className="text-xs font-medium text-emerald-100">for 30 days!</span>
                </h2>

                <div className="mt-3 inline-flex items-center justify-center bg-yellow-400 text-neutral-950 px-3.5 py-1.5 rounded-xl text-[11px] font-black shadow-md tracking-wider">
                  <span>use code AVIOR30 at checkout</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Compact 2x2 Postage Stamp Cards Grid with SVG Mask */}
          <div className="w-full max-w-3xl">
            {/* Inline SVG Mask definition for authentic stamp borders */}
            <svg width="0" height="0" className="absolute block">
              <defs>
                <mask id="stamp-mask-compact" maskContentUnits="objectBoundingBox">
                  <rect x="0" y="0" width="1" height="1" rx="0.06" ry="0.06" fill="white" />
                  {[0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875].map((pos) => (
                    <g key={`tb-${pos}`}>
                      <circle cx={pos} cy="0" r="0.03" fill="black" />
                      <circle cx={pos} cy="1" r="0.03" fill="black" />
                    </g>
                  ))}
                  {[0.25, 0.75].map((pos) => (
                    <g key={`lr-${pos}`}>
                      <circle cx="0" cy={pos} r="0.03" fill="black" />
                      <circle cx="1" cy={pos} r="0.03" fill="black" />
                    </g>
                  ))}
                </mask>
              </defs>
            </svg>

            <div className="grid grid-cols-2 gap-3">
              {HERO_SERVICES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => item.action(router)}
                  className={`${item.bg} ${item.text} px-4 py-3.5 shadow-lg hover:shadow-xl transition-all text-left flex items-center justify-between group cursor-pointer relative`}
                  style={{
                    maskImage: "url(#stamp-mask-compact)",
                    WebkitMaskImage: "url(#stamp-mask-compact)",
                    minHeight: "68px",
                  }}
                >
                  <h3 className="text-xs md:text-sm font-black tracking-tight group-hover:scale-[1.02] transition-transform pr-2">
                    {item.title}
                  </h3>
                  <div className="w-9 h-9 rounded-xl bg-white/90 shadow-sm flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                    {item.illustration}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    {/* Sleek, compact Custom Promo Banner perfectly positioned overlapping the bottom edge */}
      <div className="absolute left-0 right-0 bottom-0 translate-y-1/2 z-30 max-w-xl mx-auto px-4">
        <div className="overflow-hidden rounded-xl bg-linear-to-r from-emerald-950 via-[#063822] to-emerald-900 border border-emerald-500/30 px-3 py-2.5 shadow-2xl flex items-center justify-between gap-2.5">
          
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-yellow-400 text-neutral-950 flex items-center justify-center shrink-0 shadow">
              <Sparkles size={12} className="animate-pulse" />
            </div>
            <p className="text-[11px] font-bold text-white tracking-tight truncate">
              <span className="text-yellow-300 font-black mr-1.5">AVIORÈ:</span>
              Daily deals & fast delivery 🚀
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/food")}
            className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 px-2.5 py-1.5 rounded-lg text-[10px] font-black shadow transition-all flex items-center gap-1 cursor-pointer group"
          >
            <span>Order</span>
            <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
          </button>

        </div>
      </div>
    </section>
  );
}