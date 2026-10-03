'use client';

import React from 'react';

interface EmptyWalletProps {
  onWithdraw?: () => void;
}

export default function EmptyWallet({
  onWithdraw,
}: EmptyWalletProps) {
  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-10 text-center">

      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 text-4xl">
        💳
      </div>

      <h2 className="text-xl font-black text-white">
        Wallet is Empty
      </h2>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-400">
        Complete deliveries to start earning. Once your earnings are
        settled, they'll appear here and become available for withdrawal.
      </p>

      <button
        onClick={onWithdraw}
        disabled
        className="mt-8 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white opacity-40 cursor-not-allowed"
      >
        No Funds Available
      </button>
    </div>
  );
}