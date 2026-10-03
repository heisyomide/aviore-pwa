'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import profileService from '../services/profileService';
import { RiderProfile } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  profile: RiderProfile;
  onSuccess: () => void;
}

export default function EditBankModal({
  open,
  onClose,
  profile,
  onSuccess,
}: Props) {
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setBankName(profile.bankName || '');
    setBankCode(profile.bankCode || '');
    setAccountNumber(profile.accountNumber || '');
    setAccountName(profile.accountName || '');
  }, [profile]);

  if (!open) return null;

  async function saveBank() {
    try {
      setLoading(true);

      await profileService.updateBank({
        bankName,
        bankCode,
        accountNumber,
        accountName,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Unable to update bank details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">

      <div className="w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-900">

        <div className="flex items-center justify-between border-b border-neutral-800 p-6">

          <h2 className="text-xl font-black text-white">
            Edit Bank Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-neutral-800"
          >
            <X className="text-neutral-400" />
          </button>

        </div>

        <div className="space-y-5 p-6">

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Bank Name
            </label>

            <input
              value={bankName}
              onChange={(e) =>
                setBankName(e.target.value)
              }
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Bank Code
            </label>

            <input
              value={bankCode}
              onChange={(e) =>
                setBankCode(e.target.value)
              }
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Account Number
            </label>

            <input
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value)
              }
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Account Name
            </label>

            <input
              value={accountName}
              onChange={(e) =>
                setAccountName(e.target.value)
              }
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-white outline-none"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 border-t border-neutral-800 p-6">

          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-700 px-6 py-3 text-white"
          >
            Cancel
          </button>

          <button
            onClick={saveBank}
            disabled={loading}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

        </div>

      </div>

    </div>
  );
}