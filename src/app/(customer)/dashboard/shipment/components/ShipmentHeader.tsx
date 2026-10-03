"use client";

import { Search, RefreshCw, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ShipmentHeaderProps {
  onRefresh: () => void | Promise<void>;
  onTrack?: (trackingCode: string) => void;
}

export default function ShipmentHeader({
  onRefresh,
  onTrack,
}: ShipmentHeaderProps) {
  const [trackingCode, setTrackingCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!trackingCode.trim()) return;

    onTrack?.(trackingCode.trim().toUpperCase());
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-neutral-950">
            Shipment Hub
          </h1>
          <p className="text-xs text-neutral-500">
            Monitor logistics pipelines and delivery progress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form
            onSubmit={handleSubmit}
            className="flex items-center overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm"
          >
            <div className="flex items-center pl-2.5 text-neutral-400">
              <Search size={14} />
            </div>

            <input
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Tracking ID"
              className="w-28 sm:w-36 border-none px-2 py-1.5 text-xs outline-none"
            />

            <button 
              type="submit"
              className="bg-neutral-950 hover:bg-neutral-900 text-white px-3 py-1.5 text-[11px] font-semibold transition-all shrink-0"
            >
              Track
            </button>
          </form>

          <button
            onClick={onRefresh}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium shadow-sm transition hover:bg-neutral-50 shrink-0 text-neutral-700"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>

          <Link
            href="/dashboard/shipment/create"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition shrink-0"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Create Shipment</span>
          </Link>
        </div>
      </div>
    </div>
  );
}