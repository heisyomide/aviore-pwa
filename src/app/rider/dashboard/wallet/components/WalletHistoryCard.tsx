'use client';

import React from 'react';
import { WalletTransaction } from '../types';

interface WalletHistoryCardProps {
  transaction: WalletTransaction;
}

export default function WalletHistoryCard({
  transaction,
}: WalletHistoryCardProps) {
  const isCredit = transaction.type === 'CREDIT';

  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-4 transition hover:border-neutral-700">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg ${
            isCredit
              ? 'border-emerald-900 bg-emerald-950/30'
              : 'border-red-900 bg-red-950/30'
          }`}
        >
          {isCredit ? '📥' : '📤'}
        </div>

        <div>

          <h3 className="text-sm font-bold text-white">
            {transaction.description}
          </h3>

          <p className="mt-1 text-xs text-neutral-500">
            {transaction.referenceCode}
          </p>

          <p className="mt-1 text-[11px] text-neutral-600">
            {new Date(transaction.createdAt).toLocaleString()}
          </p>

        </div>

      </div>

      <div className="text-right">

        <p
          className={`text-base font-black ${
            isCredit
              ? 'text-emerald-400'
              : 'text-red-400'
          }`}
        >
          {isCredit ? '+' : '-'}₦
          {Number(transaction.amount).toLocaleString()}
        </p>

        <span className="mt-2 inline-flex rounded-md bg-neutral-800 px-2 py-1 text-[10px] uppercase tracking-wider text-neutral-400">
          {transaction.category.replace(/_/g, ' ')}
        </span>

      </div>

    </div>
  );
}