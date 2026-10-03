"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/src/context/AuthContext";

import { ProfileService } from "../services/profile.service";

import type {
  ChangePasswordDto,
  Profile,
  UpdateProfileDto,
} from "../types";

export function useProfile() {
  const { token, logout } = useAuth();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const refresh = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const data =
        await ProfileService.getProfile(
          token,
        );

      setProfile(data);

      setError(null);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load profile.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  async function updateProfile(
    dto: UpdateProfileDto,
  ) {
    if (!token) return;

    try {
      setSaving(true);

      const updated =
        await ProfileService.updateProfile(
          dto,
          token,
        );

      setProfile(updated);

      setDrawerOpen(false);

      return true;
    } catch (err) {
      console.error(err);

      return false;
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(
    dto: ChangePasswordDto,
  ) {
    if (!token) return false;

    try {
      setSaving(true);

      await ProfileService.changePassword(
        dto,
        token,
      );

      return true;
    } catch (err) {
      console.error(err);

      return false;
    } finally {
      setSaving(false);
    }
  }

  function openDrawer() {
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    loading,
    saving,
    error,

    profile,

    drawerOpen,

    refresh,
    updateProfile,
    changePassword,

    openDrawer,
    closeDrawer,

    logout,
  };
}