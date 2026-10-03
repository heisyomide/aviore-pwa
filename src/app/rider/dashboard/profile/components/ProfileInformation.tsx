'use client';

import { RiderProfile } from '../types';

interface Props {
  profile: RiderProfile;
  onEdit: () => void;
}

export default function ProfileInformation({
  profile,
  onEdit,
}: Props) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Your rider profile information.
          </p>
        </div>

        <button
          onClick={onEdit}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-neutral-500">
            First Name
          </p>

          <p className="font-semibold text-white">
            {profile.firstName}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-neutral-500">
            Last Name
          </p>

          <p className="font-semibold text-white">
            {profile.lastName}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-neutral-500">
            Email
          </p>

          <p className="font-semibold text-white break-all">
            {profile.email}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-neutral-500">
            Phone Number
          </p>

          <p className="font-semibold text-white">
            {profile.phoneNumber}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-neutral-500">
            Account Status
          </p>

          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            {profile.status}
          </span>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-neutral-500">
            Rider Rating
          </p>

          <p className="font-semibold text-yellow-400">
            ⭐ {(profile.ratingAverage ?? 0).toFixed(1)}
          </p>
        </div>

      </div>
    </div>
  );
}