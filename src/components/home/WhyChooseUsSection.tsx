import Link from "next/link";
import { MapPin, ShieldCheck, Camera, Wallet, ArrowRight, Sparkles, Package } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Real-time Tracking",
    desc: "Track your package moving on street routes in real time.",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Trusted",
    desc: "Your packages are in safe hands with fully verified couriers.",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    icon: Camera,
    title: "Smart Delivery",
    desc: "Proof-of-delivery options for maximum flexibility.",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    icon: Wallet,
    title: "Affordable Pricing",
    desc: "Competitive rates for reliable intra-state deliveries.",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-6 bg-neutral-50/80 border-t border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aviorè Advantage</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Why Choose Aviorè Go?
            </h3>
          </div>
          <p className="text-xs text-neutral-500 font-medium max-w-sm">
            Engineered for speed, security, and complete peace of mind on every delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Why Choose Us: Horizontal Scrolling on Mobile, 2x2 Grid on Desktop */}
          <div className="lg:col-span-7 flex sm:grid sm:grid-cols-2 gap-4 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white border border-neutral-200/80 space-y-3 shadow-xs hover:shadow-md transition-all duration-300 shrink-0 w-[240px] sm:w-auto flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-2xl ${item.color} border flex items-center justify-center font-bold shadow-2xs`}>
                      <Icon size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-neutral-900">{item.title}</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Business Discounts Banner */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-100/90 via-orange-100/60 to-yellow-100/80 rounded-3xl p-6 sm:p-8 border border-amber-200/80 flex flex-col justify-between space-y-6 shadow-sm relative overflow-hidden">
            
            {/* Decorative background icon */}
            <div className="absolute -right-6 -bottom-6 text-amber-500/15 pointer-events-none">
              <Package size={140} />
            </div>

            <div className="relative z-10 space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-2xs inline-block">
                BUSINESS DISCOUNTS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                Send more, pay less!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium max-w-md">
                Enjoy custom bulk discounts for businesses, online vendors, and recurring corporate logistics workflows.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <Link
                href="/for-business"
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white font-bold text-xs px-6 py-3 rounded-full transition-all shadow-md shadow-neutral-900/20 hover:scale-102"
              >
                <span>Learn More</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}