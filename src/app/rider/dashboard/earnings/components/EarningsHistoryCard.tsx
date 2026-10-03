'use client';

import type {
  RiderEarningHistory,
} from '../types';

interface Props {
  item: RiderEarningHistory;
}

export default function EarningsHistoryCard({
  item,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:border-emerald-600">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-white">
            {item.trackingCode}
          </p>

          <span className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[10px] uppercase text-neutral-400">
            {item.status}
          </span>
        </div>

        <p className="text-sm text-neutral-400">
          {item.customerName}
        </p>

        <p className="text-xs text-neutral-500">
          {new Date(
            item.createdAt,
          ).toLocaleString()}
        </p>
      </div>

      <div className="text-right">
        <h3 className="text-xl font-black text-emerald-400">
          ₦{item.amount.toLocaleString()}
        </h3>

        <p className="mt-1 text-xs text-neutral-500">
          Rider Earnings
        </p>
      </div>
    </div>
  );
}