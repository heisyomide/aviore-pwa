"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Check } from "lucide-react";
import Link from "next/link";
import {api} from "@/src/lib/api";

interface ScheduleItem {
  day: string;
  open: string;
  close: string;
  active: boolean;
}

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { day: "Monday", open: "08:00 AM", close: "09:00 PM", active: true },
  { day: "Tuesday", open: "08:00 AM", close: "09:00 PM", active: true },
  { day: "Wednesday", open: "08:00 AM", close: "09:00 PM", active: true },
  { day: "Thursday", open: "08:00 AM", close: "09:00 PM", active: true },
  { day: "Friday", open: "08:00 AM", close: "10:00 PM", active: true },
  { day: "Saturday", open: "09:00 AM", close: "10:00 PM", active: true },
  { day: "Sunday", open: "10:00 AM", close: "08:00 PM", active: false },
];

export default function MerchantHoursPage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchHours() {
      try {
        const { data } = await api.get('/merchant/dashboard/hours');
        if (data?.schedule && Array.isArray(data.schedule)) {
          setSchedule(data.schedule);
        }
      } catch (err) {
        console.error("Failed to fetch operating hours, using default", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHours();
  }, []);

  const toggleDay = (index: number) => {
    const updated = [...schedule];
    updated[index].active = !updated[index].active;
    setSchedule(updated);
  };

  const handleTimeChange = (index: number, field: 'open' | 'close', value: string) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.patch('/merchant/dashboard/hours', { schedule });
      alert("Opening hours successfully updated and synchronized!");
    } catch (err) {
      console.error("Error updating operating hours", err);
      alert("Failed to update operating hours.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-neutral-400">Loading opening hours...</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      
      {/* Navigation Header */}
      <div className="flex items-center gap-3">
        <Link href="/merchant/dashboard/more" className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Opening Hours</h1>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 text-xs text-amber-900 leading-relaxed font-medium">
        💡 Changes made here automatically update your status on the AviorèGo customer homepage so buyers don't place orders when you are closed.
      </div>

      {/* Form Card */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-3 divide-y divide-neutral-100">
            {schedule.map((item, idx) => (
              <div key={item.day} className="pt-3 first:pt-0 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleDay(idx)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      item.active ? 'bg-amber-600 border-amber-600 text-white' : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {item.active && <Check size={12} />}
                  </button>
                  <span className={`text-xs font-bold ${item.active ? 'text-neutral-900' : 'text-neutral-400 line-through'}`}>
                    {item.day}
                  </span>
                </div>

                {item.active ? (
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-700">
                    <input 
                      type="text" 
                      value={item.open} 
                      onChange={(e) => handleTimeChange(idx, 'open', e.target.value)}
                      className="w-24 px-2.5 py-1.5 rounded-xl border border-neutral-200 text-center text-xs focus:outline-none focus:border-amber-600"
                    />
                    <span>–</span>
                    <input 
                      type="text" 
                      value={item.close} 
                      onChange={(e) => handleTimeChange(idx, 'close', e.target.value)}
                      className="w-24 px-2.5 py-1.5 rounded-xl border border-neutral-200 text-center text-xs focus:outline-none focus:border-amber-600"
                    />
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-rose-500 font-bold uppercase tracking-wider">Closed</span>
                )}
              </div>
            ))}
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 pt-4 mt-6"
          >
            <Save size={16} /> {submitting ? "Saving..." : "Save Operating Hours"}
          </button>
        </form>
      </div>

    </div>
  );
}