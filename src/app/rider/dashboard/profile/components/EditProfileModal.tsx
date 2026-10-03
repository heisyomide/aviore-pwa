'use client';

import { useEffect, useState } from 'react';
import { RiderProfile } from '../types';

interface Props {
  open: boolean;
  profile: RiderProfile | null;
  loading?: boolean;
  onClose: () => void;

  onSave: (payload: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatarUrl?: string;
  }) => Promise<void>;
}

export default function EditProfileModal({
  open,
  profile,
  loading,
  onClose,
  onSave,
}: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (!profile) return;

    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setPhoneNumber(profile.phoneNumber);
    setAvatarUrl(profile.avatarUrl || '');
  }, [profile]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">

      <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6">

        <h2 className="text-xl font-black text-white">
          Edit Profile
        </h2>

        <div className="mt-6 space-y-4">

          <input
            value={firstName}
            onChange={(e)=>setFirstName(e.target.value)}
            placeholder="First Name"
            className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-white"
          />

          <input
            value={lastName}
            onChange={(e)=>setLastName(e.target.value)}
            placeholder="Last Name"
            className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-white"
          />

          <input
            value={phoneNumber}
            onChange={(e)=>setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-white"
          />

          <input
            value={avatarUrl}
            onChange={(e)=>setAvatarUrl(e.target.value)}
            placeholder="Avatar URL"
            className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-white"
          />

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-700 px-5 py-3 text-white"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={() =>
              onSave({
                firstName,
                lastName,
                phoneNumber,
                avatarUrl,
              })
            }
            className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

        </div>

      </div>

    </div>
  );
}