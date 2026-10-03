"use client";

import {
  Shield,
  Lock,
  Smartphone,
  ChevronRight,
} from "lucide-react";

interface Props {
  onChangePassword: () => void;
  onTwoFactor: () => void;
}

export default function SecurityCard({
  onChangePassword,
  onTwoFactor,
}: Props) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm">

      <div className="border-b px-6 py-5">

        <h2 className="text-lg font-black">
          Security
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Keep your account protected.
        </p>

      </div>

      <div className="divide-y">

        <button
          onClick={onChangePassword}
          className="flex w-full items-center justify-between px-6 py-5 transition hover:bg-neutral-50"
        >

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-neutral-100 p-3">
              <Lock size={18} />
            </div>

            <div className="text-left">

              <h3 className="font-semibold">
                Change Password
              </h3>

              <p className="text-sm text-neutral-500">
                Update your login password.
              </p>

            </div>

          </div>

          <ChevronRight size={18} />

        </button>

        <button
          onClick={onTwoFactor}
          className="flex w-full items-center justify-between px-6 py-5 transition hover:bg-neutral-50"
        >

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-neutral-100 p-3">
              <Smartphone size={18} />
            </div>

            <div className="text-left">

              <h3 className="font-semibold">
                Two-Factor Authentication
              </h3>

              <p className="text-sm text-neutral-500">
                Add an extra layer of protection.
              </p>

            </div>

          </div>

          <ChevronRight size={18} />

        </button>

        <div className="flex items-center justify-between px-6 py-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <Shield size={18} />
            </div>

            <div>

              <h3 className="font-semibold">
                Account Status
              </h3>

              <p className="text-sm text-neutral-500">
                Your account is fully verified.
              </p>

            </div>

          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            VERIFIED
          </span>

        </div>

      </div>

    </div>
  );
}