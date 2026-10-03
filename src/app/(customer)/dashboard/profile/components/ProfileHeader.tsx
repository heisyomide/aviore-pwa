"use client";

import { RefreshCw } from "lucide-react";

interface Props {
  onRefresh: () => void;
  onEdit: ( ) => void;
}

export default function ProfileHeader({
  onRefresh,
  onEdit
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          Account Profile
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Manage your account information and security.
        </p>
      </div>

      <button
        onClick={onRefresh}
        className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-neutral-100"
      >
        <RefreshCw size={16} />
        Refresh
      </button>
    </div>
  );
}