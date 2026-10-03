'use client';

import React from 'react';
import { RiderProfile } from '../types';

interface Props {
  profile: RiderProfile;
}

export default function ProfileStats({
  profile,
}: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Completed Deliveries
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          {profile.completedDeliveries}
        </h2>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Rider Rating
        </p>

        <h2 className="mt-2 text-3xl font-black text-amber-400">
          ⭐ {(profile.ratingAverage ?? 0).toFixed(1)}
        </h2>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Trust Score
        </p>

        <h2 className="mt-2 text-3xl font-black text-emerald-400">
          {profile.trustScore}%
        </h2>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Rider Status
        </p>

        <h2
          className={`mt-2 text-lg font-black ${
            profile.isOnline
              ? 'text-emerald-400'
              : 'text-neutral-400'
          }`}
        >
          {profile.isOnline
            ? '🟢 Online'
            : '⚪ Offline'}
        </h2>
      </div>

    </div>
  );
}