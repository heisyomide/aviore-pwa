"use client";

import type { ShipmentStats as ShipmentStatsType } from "../types";

interface Props {
  stats: ShipmentStatsType;
  loading?: boolean;
}

export default function ShipmentStats({
  stats,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="h-24 rounded-2xl bg-neutral-100 animate-pulse w-full" />
    );
  }

  const total =
    stats.active +
    stats.inTransit +
    stats.delivered;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-4 divide-x divide-neutral-100 text-center">
        <div className="px-2">
          <p className="text-[11px] uppercase font-semibold text-neutral-400 tracking-wider">Total</p>
          <p className="mt-1.5 text-2xl font-black text-neutral-950 tracking-tight">{total}</p>
        </div>
        <div className="px-2">
          <p className="text-[11px] uppercase font-semibold text-neutral-400 tracking-wider">Active</p>
          <p className="mt-1.5 text-2xl font-black text-amber-500 tracking-tight">{stats.active}</p>
        </div>
        <div className="px-2">
          <p className="text-[11px] uppercase font-semibold text-neutral-400 tracking-wider">Transit</p>
          <p className="mt-1.5 text-2xl font-black text-blue-600 tracking-tight">{stats.inTransit}</p>
        </div>
        <div className="px-2">
          <p className="text-[11px] uppercase font-semibold text-neutral-400 tracking-wider">Delivered</p>
          <p className="mt-1.5 text-2xl font-black text-green-600 tracking-tight">{stats.delivered}</p>
        </div>
      </div>
    </div>
  );
}