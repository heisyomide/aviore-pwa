'use client';

import { useState } from 'react';

import walletService from '../services/wallet.service';

import { WalletOverview } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  wallet: WalletOverview;
}

export default function WithdrawModal({
  open,
  onClose,
  onSuccess,
  wallet,
}: Props) {
  const [amount, setAmount] = useState('');

  const [loading, setLoading] =
    useState(false);

  if (!open) return null;

  const submit = async () => {
    const value = Number(amount);

    if (!value) return;

    if (value <= 0) return;

    if (value > wallet.availableBalance) {
      alert(
        'Withdrawal amount exceeds available balance.',
      );
      return;
    }

    try {
      setLoading(true);

      await walletService.requestWithdrawal({
        amount: value,
      });

      alert(
        'Withdrawal request submitted successfully.',
      );

      setAmount('');

      onSuccess();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ??
          'Unable to submit withdrawal request.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">

      <div className="w-full max-w-md rounded-3xl bg-neutral-900 p-7">

        <div className="mb-6">

          <h2 className="text-2xl font-black text-white">
            Instant Payout
          </h2>

          <p className="mt-2 text-sm text-neutral-400">
            Withdraw directly into your
            registered bank account.
          </p>

        </div>

        <div className="space-y-5">

          <div>

            <label className="text-xs uppercase tracking-widest text-neutral-500">
              Available Balance
            </label>

            <h2 className="mt-2 text-3xl font-black text-emerald-400">
              ₦
              {wallet.availableBalance.toLocaleString()}
            </h2>

          </div>

          <div>

            <label className="text-xs uppercase tracking-widest text-neutral-500">
              Bank
            </label>

            <p className="mt-2 font-bold text-white">
              {wallet.bank.bankName}
            </p>

            <p className="text-neutral-400">
              {wallet.bank.accountNumber}
            </p>

            <p className="text-sm text-neutral-500">
              {wallet.bank.accountName}
            </p>

          </div>

          <div>

            <label className="mb-2 block text-xs uppercase tracking-widest text-neutral-500">
              Withdrawal Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white outline-none"
              placeholder="Enter amount"
            />

          </div>

        </div>

        <div className="mt-8 flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-neutral-700 py-3 font-bold text-white"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={submit}
            className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading
              ? 'Submitting...'
              : 'Request Withdrawal'}
          </button>

        </div>

      </div>

    </div>
  );
}