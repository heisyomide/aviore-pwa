'use client';

import type {
  RiderEarningHistory,
} from '../types';

interface Props {
  history: RiderEarningHistory[];
}

export default function EarningsHistory({
  history,
}: Props) {
  if (!history.length) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900 p-10 text-center">
        <p className="text-sm text-neutral-500">
          No earnings yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">
        Fulfillment Activity
      </h3>

      {history.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
        >
          <div>
            <p className="font-semibold text-white">
              {item.trackingCode}
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              {item.customerName}
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              {new Date(
                item.createdAt,
              ).toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-emerald-400">
              ₦
              {item.amount.toLocaleString()}
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                item.status === 'SETTLED'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}