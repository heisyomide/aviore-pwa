'use client';

import React from 'react';
import { WalletTransaction } from '../types';
import WalletHistoryCard from './WalletHistoryCard';

interface WalletHistoryProps {
  transactions?: WalletTransaction[];
}

export default function WalletHistory({
  transactions = [],
}: WalletHistoryProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">
            Transaction History
          </h2>

          <p className="text-sm text-neutral-500">
            Every wallet credit and withdrawal appears here.
          </p>
        </div>

        <span className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-400">
          {transactions.length} Records
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900 p-10 text-center">
          <div className="text-4xl">🧾</div>

          <h3 className="mt-4 text-lg font-bold text-white">
            No Transactions Yet
          </h3>

          <p className="mt-2 text-sm text-neutral-500">
            Once deliveries are completed or withdrawals are made,
            your wallet activity will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <WalletHistoryCard
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </div>
      )}
    </section>
  );
}