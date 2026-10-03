'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Clock,
  Building2,
  Sparkles,
  Award,
  TrendingUp,
} from 'lucide-react';

const TOTAL_ORIENTATION_STEPS = 4;

export default function RiderApplyInfoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < TOTAL_ORIENTATION_STEPS) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/register/rider');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900 pb-16">
      {/* 1. HERO / ORIENTATION BANNER */}
      <section className="bg-slate-950 text-white border-b border-slate-800 py-10 lg:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full text-emerald-400 text-xs font-bold">
            <Sparkles size={14} />
            <span>Rider Partner Orientation Guide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Everything You Need To Know <br className="hidden sm:inline" /> Before{' '}
            <span className="text-emerald-400">Joining Our Fleet</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-xl mx-auto">
            Go through our 4-step orientation to learn about earnings, flexible shifts, required
            documents, and rider benefits across Osun and Oyo State.
          </p>
        </div>
      </section>

      {/* 2. STEPPER PROGRESS BAR */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-2 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
            <span>Orientation Progress</span>
            <span>
              Step {currentStep} of {TOTAL_ORIENTATION_STEPS}
            </span>
          </div>

          {/* Stepper Dots & Progress Line */}
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-10 rounded-full" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 transition-all duration-300 rounded-full -z-10"
              style={{ width: `${((currentStep - 1) / (TOTAL_ORIENTATION_STEPS - 1)) * 100}%` }}
            />

            {[
              { label: 'Overview', step: 1 },
              { label: 'Earnings', step: 2 },
              { label: 'Requirements', step: 3 },
              { label: 'How It Works', step: 4 },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-1 bg-white px-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(s.step)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs transition-all ${
                    currentStep === s.step
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                      : s.step < currentStep
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {s.step < currentStep ? <CheckCircle2 size={18} /> : s.step}
                </button>
                <span
                  className={`text-[11px] font-bold ${
                    currentStep === s.step ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ORIENTATION CONTENT STEPPER */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8">
          {/* STEP 1: OVERVIEW & WHY JOIN */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Step 1: Fleet Overview
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                  Why deliver with Aviorè Go?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  We empower bike riders, tricycle drivers, and van operators with consistent daily
                  orders across Osun and Oyo State.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Flexible Schedule</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Set your own availability. Turn the rider app online whenever you are ready to work.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Consistent Volume</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Get steady delivery orders from boutique merchants, corporate offices, and retail senders.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Rider Protection</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Live route tracking, OTP recipient confirmation, and dedicated regional dispatch support.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <Award size={22} className="text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 font-medium leading-relaxed space-y-1">
                  <span className="font-bold block text-sm text-emerald-900">
                    Rider Performance Incentives
                  </span>
                  Top monthly dispatch riders in Osogbo, Ibadan, Ile-Ife, and Ede receive weekly fuel
                  allowances, free helmet gear, and maintenance vouchers.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EARNINGS & PAYOUTS */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Step 2: Transparent Pay
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                  How Earnings & Payouts Work
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Know exactly how much you earn per kilometer and when your money reaches your bank account.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="border border-slate-200/80 rounded-2xl p-5 space-y-3 bg-slate-50/50">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <DollarSign size={22} />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">Clear Fare Structure</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Every trip is calculated based on Base pickup fee + Distance (per KM) + Express priority surge.
                  </p>
                  <ul className="text-xs font-semibold text-slate-600 space-y-2 pt-2 border-t border-slate-200/60">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-700 shrink-0" /> Keep 100% of recipient tips
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-700 shrink-0" /> Inter-state bonus rates (Osun ↔ Oyo)
                    </li>
                  </ul>
                </div>

                <div className="border border-slate-200/80 rounded-2xl p-5 space-y-3 bg-slate-50/50">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Building2 size={22} />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">Instant Cashouts</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    No waiting till month-end. Transfer funds from your rider in-app wallet straight to any Nigerian bank.
                  </p>
                  <ul className="text-xs font-semibold text-slate-600 space-y-2 pt-2 border-t border-slate-200/60">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-700 shrink-0" /> Daily instant withdrawal access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-700 shrink-0" /> Weekly automated bank payouts
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REQUIREMENTS */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Step 3: Registration Checklist
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                  What You Need To Apply
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Prepare these documents before heading to the registration form.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Valid Identity Document</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      NIN, Voter's Card, National ID, or International Passport.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      Driver's License & Roadworthy Vehicle
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Valid rider driver's license alongside proof of vehicle registration paper.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Smartphone with GPS</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Android or iOS smartphone with active mobile data for turn-by-turn navigation.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">One Guarantor</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Contact information of a verifiable guarantor (family member, employer, or community lead).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DAILY DISPATCH WORKFLOW & FINAL CALL TO ACTION */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Step 4: Daily Workflow
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                  How a typical dispatch works
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Four simple steps from accepting a request to completing delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="text-xs font-black text-emerald-700 uppercase">01. Go Online</div>
                  <h4 className="font-bold text-slate-900 text-xs">Accept Nearby Orders</h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    App alerts you to pickup requests near your current location in Osun or Oyo.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="text-xs font-black text-emerald-700 uppercase">02. Collect Package</div>
                  <h4 className="font-bold text-slate-900 text-xs">Sender Verification</h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Pick up item from sender or store merchant and confirm package condition.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="text-xs font-black text-emerald-700 uppercase">03. GPS Navigation</div>
                  <h4 className="font-bold text-slate-900 text-xs">Follow Optimal Route</h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    In-app map guides you on the fastest route directly to the recipient.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="text-xs font-black text-emerald-700 uppercase">04. OTP Handshake</div>
                  <h4 className="font-bold text-slate-900 text-xs">Instant Settlement</h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Input recipient’s OTP code to complete delivery and credit your wallet instantly.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl text-center space-y-4">
                <h3 className="text-xl font-black">You are ready to join!</h3>
                <p className="text-xs text-emerald-200 font-medium max-w-md mx-auto">
                  Click below to proceed directly to the official rider registration form.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/become-rider')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>Proceed To Registration Form</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEPPER NAVIGATION CONTROL BUTTONS */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} /> Previous Step
            </button>

            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <span>
                {currentStep === TOTAL_ORIENTATION_STEPS
                  ? 'Go to Registration Form'
                  : 'Next Step'}
              </span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}