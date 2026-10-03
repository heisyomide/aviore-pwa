"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Truck, Save } from "lucide-react";
import Link from "next/link";
import {api} from "@/src/lib/api";

export default function MerchantDeliveryPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [prepBuffer, setPrepBuffer] = useState("20");

  useEffect(() => {
    async function fetchDeliverySettings() {
      try {
        const { data } = await api.get('/merchant/dashboard/delivery-settings');
        const settings = data?.settings || data;
        if (settings.prepBuffer) setPrepBuffer(String(settings.prepBuffer));
      } catch (err) {
        console.error("Failed to load delivery settings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeliverySettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.patch('/merchant/dashboard/delivery-settings', {
        prepBuffer: Number(prepBuffer),
        deliveryMode: "aviorgo",
      });
      alert("Delivery settings updated successfully!");
    } catch (err) {
      console.error("Error saving delivery settings", err);
      alert("Failed to update delivery settings.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-neutral-400">Loading delivery settings...</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      
      {/* Navigation Header */}
      <div className="flex items-center gap-3">
        <Link href="/merchant/dashboard/more" className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Delivery Settings</h1>
      </div>

      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Locked Fulfillment Indicator */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700">Fulfillment & Rider Dispatch</label>
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-600 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-neutral-950">AviorèGo Fleet Logistics</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-600 text-white">ACTIVE</span>
                </div>
                <p className="text-[11px] text-neutral-500">All deliveries are handled and dispatched by AviorèGo riders.</p>
              </div>
              <Truck size={20} className="text-amber-600 shrink-0" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Default Food Preparation Buffer (Minutes)</label>
            <input 
              type="number" 
              value={prepBuffer} 
              onChange={(e) => setPrepBuffer(e.target.value)} 
              className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 font-mono focus:outline-none focus:border-amber-600 transition-colors"
            />
            <p className="text-[10px] text-neutral-400">Added automatically to customer ETA estimates.</p>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 pt-4"
          >
            <Save size={16} /> {submitting ? "Saving..." : "Save Delivery Settings"}
          </button>
        </form>
      </div>

    </div>
  );
}