"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cookie,
  ShieldCheck,
  Check,
  Save,
  RotateCcw,
  ArrowLeft,
  SlidersHorizontal,
  Info,
} from "lucide-react";

interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

export default function CookieSettingsPage() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    functional: true,
    marketing: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const stored = localStorage.getItem("aviore_cookie_preferences");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences((prev) => ({ ...prev, ...parsed, essential: true }));
      } catch (e) {
        console.error("Failed to parse cookie preferences", e);
      }
    }
  }, []);

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === "essential") return; // Essential cookies cannot be toggled
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const savePreferences = () => {
    localStorage.setItem("aviore_cookie_preferences", JSON.stringify(preferences));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const acceptAll = () => {
    const allOn: CookiePreferences = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    setPreferences(allOn);
    localStorage.setItem("aviore_cookie_preferences", JSON.stringify(allOn));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const resetToEssential = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    localStorage.setItem("aviore_cookie_preferences", JSON.stringify(essentialOnly));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-neutral-950 text-neutral-300 min-h-screen font-sans">
      {/* Top Banner Header */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-900/30">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-emerald-400 transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-semibold">
            <Cookie size={14} />
            <span>Cookie Preferences & Data Control</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Cookie Settings
          </h1>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Manage how Aviorè Go uses cookies and tracking technologies on your device to optimize dispatch performance, maintain security, and personalize your experience.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Save Notification Alert */}
        {savedSuccess && (
          <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
            <Check size={18} className="text-emerald-400 shrink-0" />
            <span>Your cookie preferences have been updated and saved successfully!</span>
          </div>
        )}

        {/* Global Action Controls Header */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-emerald-500" />
              Quick Actions
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Customize categories below or apply standard configurations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
            <button
              onClick={resetToEssential}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all border border-neutral-700"
            >
              <RotateCcw size={14} />
              <span>Essential Only</span>
            </button>

            <button
              onClick={acceptAll}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all"
            >
              <Check size={14} />
              <span>Accept All</span>
            </button>

            <button
              onClick={savePreferences}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-950"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Category Settings Section */}
        <div className="space-y-4">
          
          {/* Category 1: Essential Cookies */}
          <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Strictly Necessary Cookies</h3>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-semibold">Always Active</span>
                </div>
              </div>

              {/* Locked Toggle Switch */}
              <div className="relative inline-flex items-center cursor-not-allowed opacity-70">
                <input type="checkbox" checked={true} readOnly className="sr-only peer" />
                <div className="w-11 h-6 bg-emerald-600 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed pt-1">
              These cookies are required for fundamental application operations, such as secure authentication, user session persistence, CSRF protection, and escrow transaction verification. They cannot be turned off.
            </p>
          </div>

          {/* Category 2: Functional Cookies */}
          <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0">
                  <SlidersHorizontal size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Functional Preferences</h3>
                  <span className="text-[10px] text-neutral-500 font-mono uppercase">User Experience & Saved Inputs</span>
                </div>
              </div>

              {/* Interactive Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={() => handleToggle("functional")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed pt-1">
              Functional cookies allow the platform to remember choices you make (such as default pickup areas, recent address searches, and fare estimator preferences) to provide an upgraded experience.
            </p>
          </div>

          {/* Category 3: Analytics & Performance */}
          <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0">
                  <Info size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Analytics & System Health</h3>
                  <span className="text-[10px] text-neutral-500 font-mono uppercase">Performance & Error Diagnostics</span>
                </div>
              </div>

              {/* Interactive Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => handleToggle("analytics")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed pt-1">
              These cookies collect aggregated, non-identifying telemetry about how visitors use our platform (e.g., dispatch calculator latency, page load speeds, and crash logs) to help us continuously improve system reliability.
            </p>
          </div>

          {/* Category 4: Marketing & Tailored Messaging */}
          <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0">
                  <Cookie size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Marketing & Campaign Telemetry</h3>
                  <span className="text-[10px] text-neutral-500 font-mono uppercase">Promotions & Partner Referral</span>
                </div>
              </div>

              {/* Interactive Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => handleToggle("marketing")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed pt-1">
              Used to measure the performance of our referral incentives, merchant partner campaigns, and promotional announcement banners. Disabling this does not reduce standard system messages.
            </p>
          </div>

        </div>

        {/* Bottom Save Action Bar */}
        <div className="border-t border-neutral-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            Learn more about how we safeguard your information in our{" "}
            <Link href="/privacy" className="text-emerald-400 hover:underline font-semibold">
              Privacy Policy
            </Link>.
          </p>

          <button
            onClick={savePreferences}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
          >
            <Save size={15} />
            <span>Save My Preferences</span>
          </button>
        </div>

      </main>
    </div>
  );
}