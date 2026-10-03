'use client';

import { RiderProfile } from '../types';

interface Props {
  profile: RiderProfile;
}

export default function IdentityInformation({
  profile,
}: Props) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-black text-white">
          Identity Information
        </h3>

        <span
          className={`rounded-lg px-3 py-1 text-xs font-bold ${
            profile.status === 'VERIFIED'
              ? 'bg-emerald-900 text-emerald-300'
              : 'bg-yellow-900 text-yellow-300'
          }`}
        >
          {profile.status}
        </span>

      </div>

      <div className="mt-6 space-y-5">

        <div>

          <p className="text-xs uppercase tracking-widest text-neutral-500">
            National Identification Number
          </p>

          <p className="mt-1 text-white font-semibold">
            {profile.nin || 'Not Submitted'}
          </p>

        </div>

        <div>

          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Driver's License
          </p>

          <p className="mt-1 text-white font-semibold">
            {profile.driversLicense || 'Not Submitted'}
          </p>

        </div>

        <div>

          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Rider ID
          </p>

          <p className="mt-1 text-emerald-400 font-mono">
            {profile.id}
          </p>

        </div>

        <div>

          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Completed Deliveries
          </p>

          <p className="mt-1 text-white font-semibold">
            {profile.completedDeliveries}
          </p>

        </div>

        <div>

          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Trust Score
          </p>

          <p className="mt-1 text-emerald-400 font-bold">
            {profile.trustScore}/100
          </p>

        </div>

        <div>

          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Average Rating
          </p>

          <p className="mt-1 text-yellow-400 font-bold">
            ⭐ {(profile.ratingAverage ?? 0).toFixed(1)}
          </p>

        </div>

      </div>

    </div>
  );
}