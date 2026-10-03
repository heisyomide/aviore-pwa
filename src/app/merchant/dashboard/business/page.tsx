"use client";

import React, { useState } from "react";
import { ArrowLeft, FileText, ShieldCheck, Save } from "lucide-react";
import Link from "next/link";

export default function MerchantBusinessPage() {
  const [businessName, setBusinessName] = useState("Mama's Kitchen Enterprises");
  const [rcNumber, setRcNumber] = useState("RC-1492048");
  const [tin, setTin] = useState("TIN-00894210-0001");
  const [category, setCategory] = useState("Quick Service Restaurant (QSR)");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Business information updated successfully!");
  };

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      
      {/* Navigation Header */}
      <div className="flex items-center gap-3">
        <Link href="/merchant/dashboard/more" className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Business Information</h1>
      </div>

      {/* Verification Status Badge Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-emerald-900">Compliance & KYC Verified</h2>
            <p className="text-[11px] text-emerald-700">Backed by AviorèGo Merchant Protection</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black bg-white text-emerald-800 shadow-sm">
          ACTIVE
        </span>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Registered Business Name</label>
            <input 
              type="text" 
              value={businessName} 
              onChange={(e) => setBusinessName(e.target.value)} 
              className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">CAC Registration / RC Number</label>
            <input 
              type="text" 
              value={rcNumber} 
              onChange={(e) => setRcNumber(e.target.value)} 
              className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 font-mono focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Tax Identification Number (TIN)</label>
            <input 
              type="text" 
              value={tin} 
              onChange={(e) => setTin(e.target.value)} 
              className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 font-mono focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Business Classification</label>
            <input 
              type="text" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 pt-4"
          >
            <Save size={16} /> Save Business Details
          </button>
        </form>
      </div>

    </div>
  );
}