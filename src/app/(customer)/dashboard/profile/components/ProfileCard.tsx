"use client";

import { ShieldCheck } from "lucide-react";

import type { Profile } from "../types";

interface Props {
  profile: Profile;
}

export default function ProfileCard({
  profile,
}: Props) {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">

      <div className="h-28 bg-neutral-950" />

      <div className="-mt-12 flex flex-col items-center px-6 pb-8">

        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-neutral-900 text-3xl font-black text-white shadow-xl">
          {initials}
        </div>

        <h2 className="mt-5 text-xl font-black">
          {profile.firstName} {profile.lastName}
        </h2>

        <p className="text-sm text-neutral-500">
          {profile.email}
        </p>

        <div className="mt-6 w-full space-y-4">

          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-sm text-neutral-500">
              Phone
            </span>

            <span className="font-semibold">
              {profile.phoneNumber}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-sm text-neutral-500">
              Role
            </span>

            <span className="font-semibold">
              {profile.role}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-sm text-neutral-500">
              Member Since
            </span>

            <span className="font-semibold">
              {new Date(
                profile.createdAt
              ).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between">

            <span className="text-sm text-neutral-500">
              Verification
            </span>

            <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              <ShieldCheck size={14} />
              Verified
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}