'use client';

import React from 'react';
import { RiderProfile } from '../types';

interface Props {
  profile: RiderProfile;
  onEdit: () => void;
}

export default function ProfileHeader({
  profile,
  onEdit,
}: Props) {
  // Get full display name
  const displayName =
    profile.fullName ||
    `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
    profile.email;

  // Compute initials fallback
  const initials =
    profile.initials ||
    (profile.firstName && profile.lastName
      ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
      : profile.email
      ? profile.email.slice(0, 2).toUpperCase()
      : 'R');

  // Phone number rendering
  const displayPhone =
    profile.phoneNumber && !profile.phoneNumber.startsWith('PENDING_')
      ? profile.phoneNumber
      : 'No phone number provided';

  // 🟢 Resilient status parsing
  const rawStatus = profile?.status
    ? String(profile.status).toUpperCase().trim()
    : 'PENDING_VERIFICATION';

  const isVerified =
    rawStatus === 'VERIFIED' ||
    rawStatus === 'ACTIVE' ||
    rawStatus === 'APPROVED';

  const statusFormatted = rawStatus.replace(/_/g, ' ');

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900">
      <div className="relative p-8">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          {/* Avatar Container */}
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-neutral-800 bg-neutral-950 font-black text-2xl text-emerald-400">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : initials ? (
              <span className="text-3xl font-extrabold tracking-wider text-emerald-400">
                {initials}
              </span>
            ) : (
              <span className="text-5xl">🧑🏾‍✈️</span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              {/* Rider Name */}
              <h1 className="text-3xl font-black text-white">
                {displayName}
              </h1>

              {/* Account Status Badge */}
              <span
                className={`rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  isVerified
                    ? 'border-emerald-700 bg-emerald-900/30 text-emerald-400'
                    : 'border-amber-700 bg-amber-900/30 text-amber-400'
                }`}
              >
                {statusFormatted}
              </span>
            </div>

            {/* Email */}
            <p className="mt-3 text-neutral-400">{profile.email}</p>

            {/* Phone Number */}
            <p className="text-neutral-500">{displayPhone}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={onEdit}
                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}