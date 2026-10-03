'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '@/src/lib/api';

export default function OrganizerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Profile Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

const fetchSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/events/organizer/settings');
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        phone: response.data.supportPhone || response.data.phone || '', // 👈 Fixed property key mismatch
        companyName: response.data.companyName || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setError('');
    setSuccessMessage('');
    try {
      await api.patch('/events/organizer/settings', formData);
      setSuccessMessage('Profile settings updated successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setSavingPassword(true);
    setError('');
    setSuccessMessage('');
    try {
      await api.patch('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccessMessage('Password changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-neutral-500 bg-[#0e131f] min-h-screen font-mono">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto bg-[#0e131f] min-h-screen text-white font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white uppercase">Organizer Settings</h1>
          <p className="text-xs text-neutral-400">Manage your profile details and security credentials.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Profile & Business Details Form */}
      <form onSubmit={handleProfileUpdate} className="p-6 rounded-3xl border border-neutral-800 bg-neutral-950/40 space-y-5">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
          <User className="h-4 w-4 text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">Profile & Brand Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] text-neutral-400 uppercase">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-neutral-400 uppercase">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-neutral-400 uppercase">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-neutral-400 uppercase">Company / Brand Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors disabled:opacity-50"
          >
            <Save className={`h-3.5 w-3.5 ${savingProfile ? 'animate-spin' : ''}`} />
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>

      {/* Security Form (Change Password) */}
      <form onSubmit={handlePasswordUpdate} className="p-6 rounded-3xl border border-neutral-800 bg-neutral-950/40 space-y-5">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Lock className="h-4 w-4 text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">Security & Password</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] text-neutral-400 uppercase">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] text-neutral-400 uppercase">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] text-neutral-400 uppercase">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors disabled:opacity-50"
          >
            <Lock className={`h-3.5 w-3.5 ${savingPassword ? 'animate-spin' : ''}`} />
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}