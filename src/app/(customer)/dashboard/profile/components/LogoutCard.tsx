"use client";

import { LogOut, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function LogoutCard() {
  const router = useRouter();

  const { logout } = useAuth();

  function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to sign out of Aviorè Go?"
    );

    if (!confirmed) return;

    logout();

    router.replace("/login");
  }

  return (
    <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">

      <div className="flex items-start gap-4">

        <div className="rounded-2xl bg-red-50 p-3">
          <TriangleAlert
            className="text-red-600"
            size={22}
          />
        </div>

        <div className="flex-1">

          <h3 className="text-lg font-black">
            Logout
          </h3>

          <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
            Signing out will end your current session on this device.
            You'll need to login again to continue using Aviorè Go.
          </p>

        </div>

      </div>

      <button
        onClick={handleLogout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700"
      >
        <LogOut size={18} />

        Logout
      </button>

    </div>
  );
}