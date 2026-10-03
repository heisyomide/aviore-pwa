"use client";

import { useEffect, useState, useId } from "react";
import { Camera, X } from "lucide-react";

import type { Profile, UpdateProfileDto } from "../types";

interface EditProfileDrawerProps {
  open: boolean;
  profile: Profile;
  onClose: () => void;
  onSave: (dto: UpdateProfileDto) => Promise<boolean | undefined>;
}

export default function EditProfileDrawer({
  open,
  profile,
  onClose,
  onSave,
}: EditProfileDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<UpdateProfileDto>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (!profile) return;

    setForm({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      phoneNumber: profile.phoneNumber ?? "",
      avatarUrl: profile.avatarUrl ?? "",
    });
  }, [profile]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await onSave(form);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  }

  function update(field: keyof UpdateProfileDto, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    form.firstName || ""
  )}+${encodeURIComponent(form.lastName || "")}&background=random&size=128`;

  return (
    <>
      {/* Backboard Overlay */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close profile drawer"
        className="fixed inset-0 z-40 cursor-default bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Drawer Panel */}
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl flex-col bg-white shadow-2xl transition-transform">
        
        {/* Panel Header */}
        <header className="flex items-center justify-between border-b bg-white px-6 py-5 md:px-8">
          <div>
            <h2 className="text-2xl font-black text-neutral-900">Edit Profile</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Keep your profile information up to date.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-xl p-3 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
          >
            <X size={22} />
          </button>
        </header>

        {/* Input Work Space Container 
          FIXED: Changed layout padding to handle content escaping under top header 
          and added huge bottom padding (pb-36) so buttons clear the bottom nav bar when scrolling.
        */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 pt-8 pb-36 md:px-8 md:pb-40"
        >
          {/* User Avatar Summary Header */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative group">
              <img
                src={form.avatarUrl || fallbackAvatarUrl}
                alt={`${form.firstName} ${form.lastName}`}
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md bg-neutral-200"
              />
              <div className="absolute bottom-0 right-0 rounded-full bg-neutral-900 p-2 text-white shadow-md">
                <Camera size={14} />
              </div>
            </div>

            <h3 className="mt-3 text-lg font-bold text-neutral-900">
              {form.firstName || "—"} {form.lastName || "—"}
            </h3>
            <p className="text-xs text-neutral-500">{profile?.email}</p>
          </div>

          {/* Input Form Fields Layout Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="First Name"
              value={form.firstName || ""}
              onChange={(v) => update("firstName", v)}
              required
            />

            <Field
              label="Last Name"
              value={form.lastName || ""}
              onChange={(v) => update("lastName", v)}
              required
            />

            <div className="md:col-span-2">
              <Field
                label="Phone Number"
                type="tel"
                value={form.phoneNumber || ""}
                onChange={(v) => update("phoneNumber", v)}
              />
            </div>

            <div className="md:col-span-2">
              <Field
                label="Avatar URL"
                type="url"
                value={form.avatarUrl || ""}
                onChange={(v) => update("avatarUrl", v)}
              />
            </div>

            {/* Action Buttons Side-by-Side */}
            <div className="mt-4 grid grid-cols-2 gap-3 md:col-span-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="h-14 rounded-2xl border border-neutral-300 font-bold text-neutral-700 transition hover:bg-neutral-50 active:scale-[0.99] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="h-14 rounded-2xl bg-black font-bold text-white transition hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </aside>
    </>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}

function Field({ label, value, onChange, type = "text", required = false }: FieldProps) {
  const inputId = useId();

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-bold text-neutral-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-5 text-[15px] text-neutral-900 shadow-sm outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 placeholder:text-neutral-400"
      />
    </div>
  );
}