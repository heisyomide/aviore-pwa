import Link from "next/link";
import { Wallet, CheckCircle2, ArrowRight, Bike } from "lucide-react";

export default function PaymentsAndRiderSection() {
  return (
    <section id="rider" className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Secure Payments Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-neutral-50 to-emerald-50/30 rounded-3xl p-5 sm:p-6 border border-neutral-200/80 flex flex-col justify-between space-y-5 shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Wallet size={18} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Secure Payments</h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                All funds are protected with escrow technology. Payment is held safely and only released when delivery is confirmed.
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-neutral-200/60">
              {[
                "Escrow Protection Guarantee",
                "Encrypted Bank & Card Gateways",
                "Instant Rider Payouts",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Become a Rider CTA Card */}
          <div className="lg:col-span-7 bg-gradient-to-br from-emerald-900 via-emerald-950 to-neutral-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between space-y-6">
            
            {/* Decorative background glow */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3 max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                <Bike size={12} />
                <span>NOW HIRING RIDERS</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                Become a Rider Today!
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
                Earn on your own time with reliable daily/weekly payouts and be part of Nigeria's fastest growing logistics network.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold">
                {[
                  "Flexible Hours",
                  "Great Weekly Earnings",
                  "Instant Payouts",
                  "Rider Insurance",
                ].map((perk, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-emerald-200">
                    <CheckCircle2 size={13} className="text-orange-400 shrink-0" />
                    <span className="truncate">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-2">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md shadow-orange-600/30 transition-all hover:scale-102"
              >
                <span>Sign Up as Rider</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}