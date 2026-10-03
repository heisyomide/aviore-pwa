'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ShieldAlert, LogOut, Store } from 'lucide-react';

export default function MerchantPendingPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('aviore_token');
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 border border-emerald-200 shadow-sm">
          <Store className="w-8 h-8 animate-pulse" />
        </div>

        <span className="text-xs uppercase tracking-wider text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Kitchen Verification Pending
        </span>

        <h1 className="text-2xl font-bold mt-4 text-slate-900">
          Reviewing Your Restaurant
        </h1>

        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          Thank you for setting up your merchant storefront. Our compliance team is verifying your kitchen details and compliance. You will get access to your dashboard and menu tools once approved.
        </p>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Next steps</span>
          </div>
          <p>
            Verifications usually take up to 24 hours. Customers cannot view your storefront or place orders until this review is finalized.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}