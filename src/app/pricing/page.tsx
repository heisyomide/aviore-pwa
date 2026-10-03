"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Zap,
  ShieldCheck,
  MapPin,
  Check,
  ArrowRight,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function PricingPage() {
  // Calculator state
  const [distance, setDistance] = useState<number>(5);
  const [packageCategory, setPackageCategory] = useState<string>("STANDARD");
  const [weightRange, setWeightRange] = useState<string>("LIGHT");
  const [isExpress, setIsExpress] = useState<boolean>(false);
  const [isWaterproof, setIsWaterproof] = useState<boolean>(false);
  const [isFragile, setIsFragile] = useState<boolean>(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Pricing Calculation Logic (matches backend parameters)
  const calculateEstimate = () => {
    let base = 800; // Base rate in NGN

    // Weight additions
    if (weightRange === "MEDIUM") base += 400;
    if (weightRange === "HEAVY") base += 1000;

    // Category multipliers
    if (packageCategory === "FOOD") base += 200;
    if (packageCategory === "DOCUMENT") base -= 100;

    // Distance rate: NGN 150 per km
    const distanceFee = Math.round(distance * 150);

    // Extra flags
    let extras = 0;
    if (isExpress) extras += 500;
    if (isWaterproof) extras += 200;
    if (isFragile) extras += 300;

    return base + distanceFee + extras;
  };

  const estimatedPrice = calculateEstimate();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-neutral-950 text-white min-h-screen font-sans">
      {/* Header Banner */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold">
            <Sparkles size={14} />
            <span>Transparent & Dynamic Rates</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Simple, fair pricing for every delivery.
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            No hidden charges. Calculate exact shipping costs upfront based on distance, weight, and delivery priority across Osun and Oyo States.
          </p>
        </div>
      </section>

      {/* Interactive Pricing Estimator & Tier Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Estimator Box */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Inputs Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap size={22} className="text-emerald-500" />
                  Instant Fee Calculator
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Adjust parameters to estimate instant dispatch fees.
                </p>
              </div>

              {/* Distance Slider */}
              <div className="space-y-2 bg-neutral-950/50 p-4 rounded-2xl border border-neutral-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-500" /> Estimated Distance
                  </span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">{distance} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-neutral-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Weight & Category Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Package Weight</label>
                  <select
                    value={weightRange}
                    onChange={(e) => setWeightRange(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="LIGHT">Light (&lt; 3kg)</option>
                    <option value="MEDIUM">Medium (3kg - 10kg)</option>
                    <option value="HEAVY">Heavy (&gt; 10kg)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Category</label>
                  <select
                    value={packageCategory}
                    onChange={(e) => setPackageCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="STANDARD">General Parcel</option>
                    <option value="DOCUMENT">Documents / Letters</option>
                    <option value="FOOD">Food & Groceries</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer transition-all ${isExpress ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'bg-neutral-950/50 border-neutral-800 text-neutral-400'}`}>
                  <input
                    type="checkbox"
                    checked={isExpress}
                    onChange={(e) => setIsExpress(e.target.checked)}
                    className="hidden"
                  />
                  <Zap size={14} className={isExpress ? 'text-emerald-400' : 'text-neutral-500'} />
                  <span className="font-semibold">Express</span>
                </label>

                <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer transition-all ${isFragile ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'bg-neutral-950/50 border-neutral-800 text-neutral-400'}`}>
                  <input
                    type="checkbox"
                    checked={isFragile}
                    onChange={(e) => setIsFragile(e.target.checked)}
                    className="hidden"
                  />
                  <ShieldCheck size={14} className={isFragile ? 'text-emerald-400' : 'text-neutral-500'} />
                  <span className="font-semibold">Fragile</span>
                </label>

                <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer transition-all ${isWaterproof ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'bg-neutral-950/50 border-neutral-800 text-neutral-400'}`}>
                  <input
                    type="checkbox"
                    checked={isWaterproof}
                    onChange={(e) => setIsWaterproof(e.target.checked)}
                    className="hidden"
                  />
                  <Package size={14} className={isWaterproof ? 'text-emerald-400' : 'text-neutral-500'} />
                  <span className="font-semibold">Waterproof</span>
                </label>
              </div>
            </div>

            {/* Price Output Box */}
            <div className="lg:col-span-5 bg-emerald-950/20 border border-emerald-800/50 rounded-2xl p-6 flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold bg-emerald-950 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                  Estimated Delivery Fee
                </span>
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-white font-mono">
                    ₦{estimatedPrice.toLocaleString()}
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Calculated for standard pickup & doorstep drop-off.
                  </p>
                </div>

                <div className="space-y-2 border-t border-emerald-900/50 pt-4 text-xs text-neutral-300">
                  <div className="flex justify-between">
                    <span>Base Fare & Processing</span>
                    <span className="font-mono font-semibold">₦800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance Rate ({distance} km)</span>
                    <span className="font-mono font-semibold">₦{(distance * 150).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected Add-ons</span>
                    <span className="font-mono font-semibold">₦{(estimatedPrice - 800 - (distance * 150)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard/shipment/create"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Book Shipment Now</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Pricing Tiers Comparison */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Choose Your Plan Tier</h2>
            <p className="text-xs text-neutral-400">Scalable accounts built for individual senders and high-volume e-commerce businesses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Tier */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Package size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Personal / On-Demand</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Pay-as-you-go shipping for individuals sending packages, documents, or personal items.
                </p>
                <div className="text-2xl font-black text-white font-mono">
                  Pay Per Shipment
                </div>

                <ul className="space-y-3 pt-2 text-xs text-neutral-300">
                  {["Live GPS tracking link", "Doorstep pickup & drop-off", "PIN verification delivery security", "Standard support response"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check size={16} className="text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs py-3 rounded-xl transition-all text-center block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Merchant Enterprise Tier */}
            <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-emerald-600/80 rounded-3xl p-8 space-y-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Recommended
              </div>

              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Merchant Enterprise</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Tailored for online stores, vendors, and businesses managing bulk order dispatches.
                </p>
                <div className="text-2xl font-black text-white font-mono">
                  Volume Discount Rates
                </div>

                <ul className="space-y-3 pt-2 text-xs text-neutral-300">
                  {[
                    "Up to 20% discount on high-volume shipping",
                    "Automated ESCROW payment processing",
                    "Bulk CSV shipment creation & API integration",
                    "Dedicated account manager & priority support",
                    "Weekly automated bank payouts"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check size={16} className="text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/for-business"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all text-center block shadow-lg shadow-emerald-950"
              >
                Open Merchant Account
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8 max-w-4xl mx-auto pt-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle size={22} className="text-emerald-500" />
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-neutral-400">Everything you need to know about our charges and billing.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "How is the delivery fee calculated?",
                a: "Fees are computed dynamically using a base rate + per-kilometer distance fee + weight allowance + optional handling add-ons like Express or Fragile protection."
              },
              {
                q: "Are there any hidden waiting time charges?",
                a: "Dispatch riders offer a complimentary 10-minute waiting window upon arrival at pickup or drop-off points. Minimal idle charges apply after 10 minutes."
              },
              {
                q: "How does the ESCROW protection system work?",
                a: "For merchant and buyer safety, delivery payments are held securely in escrow until the recipient verifies the delivery PIN code provided at doorstep handoff."
              },
              {
                q: "What regions do these rates apply to?",
                a: "Our core automated dispatch network operates across Osun State (Osogbo, Ede, Ilesa) and Oyo State (Ibadan, Ogbomoso, Oyo town)."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex justify-between items-center text-xs font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}