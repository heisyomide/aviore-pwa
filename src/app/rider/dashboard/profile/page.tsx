// app/rider/dashboard/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LifeBuoy, Calendar, ChevronRight } from 'lucide-react';

import profileService from './services/profileService';
import { RiderProfile } from './types';

import ProfileSkeleton from './components/ProfileSkeleton';
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import ProfileInformation from './components/ProfileInformation';
import IdentityInformation from './components/IdentityInformation';
import BankInformation from './components/BankInformation';

import EditProfileModal from './components/EditProfileModal';
import EditBankModal from './components/EditBankModal';

export default function RiderProfilePage() {
  const [profile, setProfile] = useState<RiderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [bankModalOpen, setBankModalOpen] = useState(false);

  async function loadProfile() {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-red-900 bg-red-950/20 p-8 text-center">
        <h2 className="text-xl font-bold text-red-400">
          Unable to load profile.
        </h2>
        <button
          onClick={loadProfile}
          className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6">
        <ProfileHeader
          profile={profile}
          onEdit={() => setProfileModalOpen(true)}
        />

        <ProfileStats profile={profile} />

        <ProfileInformation
          profile={profile}
          onEdit={() => setProfileModalOpen(true)}
        />

        <IdentityInformation profile={profile} />

        <BankInformation
          profile={profile}
          onEdit={() => setBankModalOpen(true)}
        />

        {/* --- EVENT TRIPS REDIRECTION CARD --- */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Event Trips & Manifests</h3>
                <p className="text-sm text-neutral-400">
                  View scheduled event transit legs, passenger manifests, and launch active GPS navigation workspaces.
                </p>
              </div>
            </div>

            <Link
              href="/rider/dashboard/jobs/events/trip"
              className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500 shadow-md shadow-blue-600/20"
            >
              <span>View Event Trips</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* --- SUPPORT & TICKETS LINK --- */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <LifeBuoy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Help & Admin Support</h3>
                <p className="text-sm text-neutral-400">
                  Submit disputes, request payout help, or report account issues directly to management.
                </p>
              </div>
            </div>

            <Link
              href="/rider/dashboard/supports"
              className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
            >
              <span>Open Support Desk</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <EditProfileModal
        open={profileModalOpen}
        profile={profile}
        onClose={() => setProfileModalOpen(false)}
        onSave={async (payload) => {
          await profileService.updateProfile(payload);
          setProfileModalOpen(false);
          await loadProfile();
        }}
      />

      <EditBankModal
        open={bankModalOpen}
        profile={profile}
        onClose={() => setBankModalOpen(false)}
        onSuccess={() => {
          setBankModalOpen(false);
          loadProfile();
        }}
      />
    </>
  );
}