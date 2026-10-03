"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import {api} from "@/src/lib/api"; // Adjust import based on your project structure

export default function MerchantNotificationsPage() {
  const [settings, setSettings] = useState({
    newOrders: true,
    riderAssigned: true,
    payoutAlerts: true,
    customerReviews: false,
    marketingPromos: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/merchant/dashboard/notifications-settings")
      .then(res => {
        if (res.data) setSettings(prev => ({ ...prev, ...res.data }));
      })
      .catch(() => {
        // Fallback or silent catch if default settings should apply
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/merchant/dashboard/notifications-settings", settings);
      alert("Preferences saved successfully!");
    } catch {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-600" size={24} /></div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/merchant/dashboard/more" className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Notifications</h1>
      </div>

      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Alert Channels</h2>
            <div className="space-y-3 divide-y divide-neutral-100">
              {Object.keys(settings).map((key) => {
                const labels: Record<string, { title: string; desc: string }> = {
                  newOrders: { title: "New Incoming Orders", desc: "Real-time alerts and audio chimes for new customer requests." },
                  riderAssigned: { title: "Rider Dispatch & Updates", desc: "Get notified when an AviorèGo logistics rider arrives or accepts drop-off." },
                  payoutAlerts: { title: "Payouts & Wallet Alerts", desc: "Confirmations when bank withdrawals or daily settlements clear." },
                  customerReviews: { title: "Customer Reviews & Ratings", desc: "Notifications when buyers leave feedback on your food items." },
                  marketingPromos: { title: "Marketing & Platform Promos", desc: "Receive tips and campaign updates to boost store sales." }
                };
                return (
                  <div key={key} className="flex items-center justify-between pt-3 first:pt-0">
                    <div>
                      <h3 className="text-xs font-bold text-neutral-900">{labels[key]?.title}</h3>
                      <p className="text-[11px] text-neutral-500">{labels[key]?.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSetting(key as keyof typeof settings)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        settings[key as keyof typeof settings] ? 'bg-amber-600 border-amber-600 text-white' : 'border-neutral-300 bg-white'
                      }`}
                    >
                      {settings[key as keyof typeof settings] && <Check size={12} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
            {saving ? "Saving..." : "Save Notification Preferences"}
          </button>
        </form>
      </div>
    </div>
  );
}