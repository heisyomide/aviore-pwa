'use client';

import type {
  RiderChartItem,
} from '../types';

interface Props {
  chart: RiderChartItem[];
}

export default function EarningsChart({
  chart,
}: Props) {
  const max =
    Math.max(
      ...chart.map((item) => item.amount),
      1,
    );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-neutral-400">
        Weekly Earnings
      </h3>

      <div className="flex h-64 items-end justify-between gap-4 border-b border-neutral-800 pb-4">
        {chart.map((item) => {
          const height = Math.max(
            (item.amount / max) * 180,
            12,
          );

          return (
            <div
              key={item.day}
              className="flex flex-1 flex-col items-center group"
            >
              <div className="mb-2 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                ₦{item.amount.toLocaleString()}
              </div>

              <div
                style={{
                  height,
                }}
                className="w-full max-w-10 rounded-t-xl bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-400"
              />

              <span className="mt-3 text-xs text-neutral-500">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}