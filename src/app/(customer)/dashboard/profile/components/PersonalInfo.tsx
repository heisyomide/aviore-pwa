"use client";

import { Mail, Phone, MapPin, User } from "lucide-react";

import type { Profile } from "../types";

interface Props {
  profile: Profile;
  onEdit: () => void;
}

export default function PersonalInfo({
  profile,
  onEdit,
}: Props) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b px-6 py-5">

        <div>
          <h2 className="text-lg font-black">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Your registered account details.
          </p>
        </div>

        <button
          onClick={onEdit}
          className="rounded-xl bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Edit Profile
        </button>

      </div>

      <div className="grid gap-5 p-6 md:grid-cols-2">

        <InfoCard
          icon={<User size={18} />}
          title="Full Name"
          value={`${profile.firstName} ${profile.lastName}`}
        />

        <InfoCard
          icon={<Mail size={18} />}
          title="Email Address"
          value={profile.email}
        />

        <InfoCard
          icon={<Phone size={18} />}
          title="Phone Number"
          value={profile.phoneNumber}
        />

        <InfoCard
          icon={<MapPin size={18} />}
          title="Location"
          value={
  profile.address
    ? `${profile.address.street}, ${profile.address.city}, ${profile.address.state}`
    : "No default address"
}
        />

      </div>

    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function InfoCard({
  icon,
  title,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-white p-2 shadow-sm">
          {icon}
        </div>

        <div>

          <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">
            {title}
          </p>

          <p className="mt-1 font-semibold text-neutral-900">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}