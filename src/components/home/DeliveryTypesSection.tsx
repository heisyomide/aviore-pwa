"use client";

import { useState, useEffect } from "react";
import { Lock, Camera, CheckCircle2, ShieldCheck, Zap, Sparkles, ArrowRight } from "lucide-react";

const deliverySlides = [
  {
    type: "Standard PIN Delivery",
    tagline: "Secure Direct Hand-off",
    desc: "Ideal for face-to-face drops. The receiver generates a secure 4-digit code and shares it with the courier on arrival to release the parcel.",
    icon: Lock,
    badgeColor: "bg-emerald-500/20 text-emerald-100 border-emerald-400/30",
    bgGradient: "bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900",
    borderColor: "border-emerald-400/40",
    features: ["Instant 4-digit token generation", "Escrow protection until PIN entry", "Zero fraud risk on doorstep transfers"],
  },
  {
    type: "Smart Contactless Delivery",
    tagline: "Proof-of-Delivery & GPS Geofencing",
    desc: "Perfect when the receiver is away. The courier captures multi-angle geo-tagged photos and timestamped logs for guaranteed drop-off assurance.",
    icon: Camera,
    badgeColor: "bg-purple-500/20 text-purple-100 border-purple-400/30",
    bgGradient: "bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900",
    borderColor: "border-purple-400/40",
    features: ["3 mandatory high-res proof photos", "Automatic GPS geofence verification", "Secure instant drop-off logs"],
  },
  {
    type: "Escrow Payment Security",
    tagline: "Total Peace of Mind",
    desc: "Funds are held safely in escrow and only released to the rider or merchant once the delivery confirmation code or photo verification is fully validated.",
    icon: ShieldCheck,
    badgeColor: "bg-amber-500/20 text-amber-100 border-amber-400/30",
    bgGradient: "bg-gradient-to-br from-amber-600 via-orange-700 to-neutral-900",
    borderColor: "border-amber-400/40",
    features: ["Automated fund release on success", "Dispute resolution safety net", "Transparent instant payout system"],
  },
];

export default function DeliveryTypesSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate slides like an advertisement banner popup carousel
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % deliverySlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = deliverySlides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <section className="py-14 bg-white border-t border-neutral-200/60 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verification Modes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Choose Your Delivery Style
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            Advanced security options tailored for every parcel journey.
          </p>
        </div>

        {/* Colorful Pop-up Advertisement Banner Carousel */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={`relative rounded-3xl ${slide.bgGradient} p-6 sm:p-10 shadow-2xl text-white border ${slide.borderColor} transition-all duration-700 overflow-hidden min-h-[280px] sm:min-h-[300px] flex flex-col justify-between`}
        >
          {/* Background Glow Highlights */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-black/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Info Badge & Progress Dots */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner text-white">
                <IconComponent size={22} />
              </div>
              <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border backdrop-blur-md ${slide.badgeColor}`}>
                {slide.tagline}
              </span>
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-1.5 bg-black/20 backdrop-blur-md p-1.5 rounded-full border border-white/10">
              {deliverySlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    currentSlide === idx ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Banner Content Body with Pop-in animation feel */}
          <div className="relative z-10 space-y-3 my-6 transition-all duration-500 transform">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
              {slide.type}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-white/90 leading-relaxed max-w-2xl">
              {slide.desc}
            </p>

            {/* Mini Feature Pills inside Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3">
              {slide.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 text-xs font-semibold text-white">
                  <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Control / Footer bar of Banner */}
          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/15 text-[11px] font-semibold text-white/80">
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-yellow-300 animate-bounce" />
              <span>Aviorè Go Real-Time Safety Protocol</span>
            </div>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % deliverySlides.length)}
              className="inline-flex items-center gap-1 text-white hover:text-emerald-200 transition-colors font-bold"
            >
              <span>Next Mode</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}