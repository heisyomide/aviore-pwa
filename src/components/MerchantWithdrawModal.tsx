'use client';

import { useState } from 'react';
import { api } from '@/src/lib/api';

interface WalletOverview {
  availableBalance: number;
  pendingBalance?: number;
  currency?: string;
  bankName?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  wallet: WalletOverview | null;
}

export default function MerchantWithdrawModal({
  open,
  onClose,
  onSuccess,
  wallet,
}: Props) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open || !wallet) return null;

  const submit = async () => {
    const value = Number(amount);
    if (!value || value <= 0) return;

    if (value > wallet.availableBalance) {
      alert('Withdrawal amount exceeds available balance.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/merchant/wallet/withdraw', { amount: value });
      alert('Withdrawal request submitted successfully.');
      setAmount('');
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ??
          'Unable to submit withdrawal request.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
      <div className="w-full max-w-md rounded-3xl bg-neutral-900 p-7 text-white">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white">Instant Payout</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Withdraw directly into your registered merchant bank account.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-500">
              Available Balance
            </label>
            <h2 className="mt-2 text-3xl font-black text-emerald-400">
              ₦{Number(wallet.availableBalance || 0).toLocaleString()}
            </h2>
          </div>

          {wallet.accountNumber ? (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 p-4 space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                Registered Bank Account
              </label>
              <div className="flex items-center justify-between">
                <p className="font-bold text-white">
                  {wallet.bankName || 'Bank Name Unspecified'}
                </p>
                {wallet.bankCode && (
                  <span className="text-[10px] font-mono bg-neutral-700/80 px-2 py-0.5 rounded text-neutral-300">
                    Code: {wallet.bankCode}
                  </span>
                )}
              </div>
              <p className="font-mono text-sm text-neutral-300">
                {wallet.accountNumber}
              </p>
              {wallet.accountName && (
                <p className="text-xs text-neutral-500">{wallet.accountName}</p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300">
              No bank account linked to your merchant profile yet.
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-neutral-500">
              Withdrawal Amount (Min ₦100)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
              placeholder="Enter amount"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-neutral-700 py-3 font-bold text-white cursor-pointer hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={submit}
            className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Submitting...' : 'Request Withdrawal'}
          </button>
        </div>
      </div>
    </div>
  );
}