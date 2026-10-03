// src/app/organizer/onboarding/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrganizerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [organizationName, setOrganizationName] = useState('');
  const [category, setCategory] = useState('Music & Concerts');
  const [city, setCity] = useState('Lagos');
  const [supportPhone, setSupportPhone] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  
  // Logo File state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Logo image must be less than 5MB.');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };

  const handleNext = () => {
    setErrorMessage('');
    if (step === 1 && !organizationName.trim()) {
      setErrorMessage('Please enter your organization name.');
      return;
    }
    if (step === 2 && !supportPhone.trim()) {
      setErrorMessage('Please provide a support phone number.');
      return;
    }
    if (step === 3 && !logoFile && !logoPreview) {
      setErrorMessage('Please upload your brand logo to proceed.');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setErrorMessage('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('aviore_token') || localStorage.getItem('access_token');
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://aviore-go-backend.onrender.com';

      // 1. If you have an upload endpoint, upload the file first to get a URL:
      // For demonstration, let's simulate or upload if endpoint exists. 
      // If uploading logo via form-data or base64:
      let uploadedLogoUrl = logoPreview; 
      
      if (logoFile) {
        const formData = new FormData();
        formData.append('file', logoFile);

        const uploadRes = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedLogoUrl = uploadData.url || uploadData.secure_url || logoPreview;
        }
      }

      // 2. Submit complete profile payload
      const response = await fetch(`${API_BASE}/organizer/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          organizationName: organizationName.trim(),
          category,
          city: city.trim(),
          supportPhone: supportPhone.trim(),
          supportEmail: supportEmail.trim() || undefined,
          instagramHandle: instagramHandle.trim() || undefined,
          logoUrl: uploadedLogoUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit organizer profile.');
      }

      router.push('/events/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
        
        {/* Stepper Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === s ? 'w-10 bg-amber-500' : 'w-3 bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Step {step} of 4
          </span>
          <h1 className="text-2xl font-bold mt-3 text-slate-900">
            {step === 1 && 'Organization Overview'}
            {step === 2 && 'Support & Location'}
            {step === 3 && 'Brand Logo Upload'}
            {step === 4 && 'Social Presence'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {step === 1 && 'What is the name and focus of your events enterprise?'}
            {step === 2 && 'How can attendees reach your support team and where are you based?'}
            {step === 3 && 'Upload an official brand logo from your device.'}
            {step === 4 && 'Add your social handle for profile verification.'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-start gap-2">
            <span className="text-base leading-none">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Organization / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g. Sceptre Live & Entertainment"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Primary Event Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500 text-sm transition-colors cursor-pointer"
                >
                  <option value="Music & Concerts">Music & Concerts</option>
                  <option value="Tech Conferences & Workshops">Tech Conferences & Workshops</option>
                  <option value="Nightlife & Parties">Nightlife & Parties</option>
                  <option value="Film Screenings & Arts">Film Screenings & Arts</option>
                  <option value="Corporate & Networking">Corporate & Networking</option>
                  <option value="Transit & Logistics Corridors">Transit & Logistics Corridors</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm cursor-pointer"
              >
                Next Step →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Support Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Support Email (Optional)
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@organization.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Primary Operating City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lagos"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 text-sm transition-colors"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition-all text-sm cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-2/3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm cursor-pointer"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Brand Logo Image (Required) *
              </label>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {logoPreview ? (
                  <div className="flex flex-col items-center">
                    <img src={logoPreview} alt="Logo Preview" className="w-20 h-20 rounded-xl object-cover mb-2 border border-slate-200 shadow-sm" />
                    <span className="text-xs text-amber-600 font-semibold">Click or drag to replace logo</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl mb-2 border border-amber-200">
                      📷
                    </div>
                    <span className="text-sm font-semibold text-slate-800">Upload organization logo</span>
                    <span className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP (Max 5MB)</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition-all text-sm cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-2/3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm cursor-pointer"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Instagram / Twitter Handle (Optional)
                </label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="@yourbrand"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 text-sm transition-colors"
                />
              </div>

              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                💡 <span className="font-semibold">Almost there!</span> Upon submission, your profile will be created immediately and a welcome email will be dispatched to your inbox.
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition-all text-sm cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Completing Profile...</span>
                    </>
                  ) : (
                    <span>Complete Profile & Enter Dashboard 🚀</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}