"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function Step3Success() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm text-center space-y-6">
      
      {/* Decorative Success Confetti Icon Context Bubble */}
      <div className="flex justify-center pt-4">
        <div className="relative">
          <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 animate-pulse">
            <CheckCircle2 className="h-12 w-12 stroke-[1.5]" />
          </div>
          <span className="absolute -top-1 -right-1 text-2xl animate-bounce">🎉</span>
        </div>
      </div>

      {/* Main Success Headlines */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Welcome to Aviorè Go!</h2>
        <div className="space-y-1.5 text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
          <p>Your account has been configured successfully.</p>
          <p>You can now request instant dispatch pickups and deliveries from verified logistics riders.</p>
        </div>
      </div>

      {/* Primary Landing Dashboard Call-To-Action */}
      <button
        onClick={handleStart}
        className="h-12 w-full rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition flex items-center justify-center gap-2 cursor-pointer group shadow-sm tracking-wide"
      >
        <span>Start Sending Deliveries</span>
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}