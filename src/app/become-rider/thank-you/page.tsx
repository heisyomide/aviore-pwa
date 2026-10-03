"use client";

import Link from "next/link";
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, PhoneCall } from "lucide-react";

export default function RiderRegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
        
        {/* Animated Success Badge */}
        <div className="mx-auto w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Application Submitted
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Thank You for Applying! 🎉
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-md mx-auto">
            Your rider profile has been received and is currently undergoing verification by our team.
          </p>
        </div>

        {/* What Happens Next Card */}
        <div className="bg-neutral-800/60 border border-neutral-700/50 rounded-2xl p-5 text-left space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> What Happens Next?
          </h3>

          <div className="space-y-3 text-xs text-neutral-300">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </div>
              <p>
                <strong className="text-white">Profile & Identity Review:</strong> Our admin team will verify your submitted details (usually within 24–48 hours).
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </div>
              <p>
                <strong className="text-white">Account Activation Notice:</strong> You will receive an SMS and email notification as soon as your profile is approved.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </div>
              <p>
                <strong className="text-white">Start Delivering:</strong> Go online in your rider dashboard to accept delivery requests and start earning immediately!
              </p>
            </div>
          </div>
        </div>

        {/* Support & Contact Banner */}
        <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Need quick assistance?</span>
          </div>
          <a
            href="tel:+2348000000000"
            className="flex items-center gap-1 font-semibold text-emerald-400 hover:underline"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Support
          </a>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            href="/rider/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/20"
          >
            Go to Rider Dashboard <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="block w-full py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs rounded-xl transition-all"
          >
            Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}