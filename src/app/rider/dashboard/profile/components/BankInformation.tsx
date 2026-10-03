'use client';

import React from 'react';
import { Landmark } from 'lucide-react';
import { RiderProfile } from '../types';

interface Props {
  profile: RiderProfile;
  onEdit: () => void;
}

export default function BankInformation({
  profile,
  onEdit,
}: Props) {
  const hasBank =
    !!profile.bankName &&
    !!profile.accountNumber &&
    !!profile.accountName;

  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-lg font-black text-white">
            Bank Information
          </h2>

          <p className="text-sm text-neutral-500">
            Withdrawals are paid into this account.
          </p>
        </div>

        <button
          onClick={onEdit}
          className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Edit
        </button>

      </div>

      {!hasBank ? (
        <div className="rounded-2xl border border-dashed border-neutral-700 p-8 text-center">

          <Landmark
            size={44}
            className="mx-auto text-neutral-500"
          />

          <h3 className="mt-4 text-lg font-bold text-white">
            No Bank Account
          </h3>

          <p className="mt-2 text-sm text-neutral-500">
            Add your bank account before requesting
            withdrawals.
          </p>

        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Bank
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">
              {profile.bankName}
            </h3>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Account Number
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">
              {profile.accountNumber}
            </h3>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Account Name
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">
              {profile.accountName}
            </h3>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Bank Code
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">
              {profile.bankCode}
            </h3>
          </div>

        </div>
      )}

    </div>
  );
}