"use client";

import { useState } from "react";
import Link from "next/link";
import { Headset, ChevronRight, MapPin, Ticket, ShieldCheck, HelpCircle } from "lucide-react";

import ProfileHeader from "./components/ProfileHeader";
import ProfileCard from "./components/ProfileCard";
import PersonalInfo from "./components/PersonalInfo";
import SecurityCard from "./components/SecurityCard";
import LogoutCard from "./components/LogoutCard";
import EditProfileDrawer from "./drawers/EditProfileDrawer";

import { useProfile } from "./hooks/useProfile";

export default function ProfilePage() {
  const {
    loading,
    profile,
    refresh,
    updateProfile,
  } = useProfile();

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-neutral-300 border-t-black" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-neutral-200/80 bg-white p-8 text-center shadow-sm my-12">
        <h2 className="text-sm font-bold text-neutral-950">
          Unable to load profile
        </h2>
        <p className="mt-1.5 text-xs text-neutral-500">
          Please refresh the page to try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6 py-6 text-sm">
      <ProfileHeader
        onRefresh={refresh}
        onEdit={() => setEditOpen(true)}
      />

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Core Identity Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-6">
            <ProfileCard profile={profile} />
          </div>
        </div>

        {/* Right Column: Settings & Shortcuts Panels */}
        <div className="lg:col-span-8 space-y-6">
          <PersonalInfo
            profile={profile}
            onEdit={() => setEditOpen(true)}
          />
         
          {/* Quick Shortcuts Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delivery Address & Landmarks Card */}
            <div className="group relative rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md flex flex-col justify-between">
              <div className="flex items-start gap-3.5 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">
                    Delivery Address
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {profile.address?.street || "Set your Osogbo landmark and delivery street address."}
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/profile/address"
                className="inline-flex items-center justify-between w-full rounded-xl bg-neutral-50 px-3.5 py-2.5 text-xs font-bold text-neutral-900 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <span>Manage Address</span>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-emerald-600" />
              </Link>
            </div>

            {/* My Event Tickets Card */}
            <div className="group relative rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md flex flex-col justify-between">
              <div className="flex items-start gap-3.5 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">
                    Event Passes
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    View your booked bus transit passes and boarding QR codes.
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/profile/tickets"
                className="inline-flex items-center justify-between w-full rounded-xl bg-neutral-50 px-3.5 py-2.5 text-xs font-bold text-neutral-900 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <span>View Tickets</span>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-emerald-600" />
              </Link>
            </div>
          </div>

          <SecurityCard
            onChangePassword={() => setPasswordOpen(true)}
            onTwoFactor={() => {}}
          />

          {/* Customer Support & Assistance Card */}
          <div className="group relative rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                <Headset className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">
                  Help & Support
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Need help with an order, account issue, or dispute?
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/supports"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800 shrink-0"
            >
              <span>Contact Support</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <LogoutCard />
        </div>
      </div>

      <EditProfileDrawer
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSave={updateProfile}
      />
    </div>
  );
}