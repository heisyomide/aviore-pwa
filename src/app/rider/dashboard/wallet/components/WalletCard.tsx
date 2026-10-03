'use client';

import React from 'react';
import { WalletOverview } from '../types';

interface WalletCardProps {
  wallet: WalletOverview;

  onWithdraw: () => void;
}

export default function WalletCard({
  wallet,
  onWithdraw,
}: WalletCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900">

      {/* Header */}

      <div className="border-b border-neutral-800 p-6">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Available Balance
            </p>

            <h2 className="mt-2 text-4xl font-black text-emerald-400">
              ₦
              {wallet.availableBalance.toLocaleString()}
            </h2>

          </div>

          <button
            onClick={onWithdraw}
            disabled={wallet.availableBalance <= 0}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-xs font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Instant Payout
          </button>

        </div>

      </div>

      {/* Body */}

      <div className="grid gap-5 p-6 md:grid-cols-2">

        <div>

          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Pending Balance
          </p>

          <h3 className="mt-2 text-2xl font-black text-amber-400">
            ₦
            {wallet.pendingBalance.toLocaleString()}
          </h3>

          <p className="mt-2 text-xs leading-5 text-neutral-400">
            Funds awaiting delivery confirmation and escrow release.
          </p>

        </div>

        <div>

          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Payout Account
          </p>

          <div className="mt-3 space-y-1">

            <h3 className="font-bold text-white">
              {wallet.bank.bankName}
            </h3>

            <p className="text-sm text-neutral-400">
              {wallet.bank.accountNumber}
            </p>

            <p className="text-xs uppercase tracking-widest text-neutral-500">
              {wallet.bank.accountName}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}