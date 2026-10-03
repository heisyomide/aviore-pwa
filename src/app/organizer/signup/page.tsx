'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { registerOrganizer } from '@/src/services/authService';

interface FormErrors {
  general?: string;
  confirmPassword?: string;
}

export default function OrganizerRegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    const { email, password, confirmPassword, firstName, lastName } = formData;
    
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return 'Please fill in all required fields.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      await registerOrganizer({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return <EmailVerificationNotice email={formData.email} onBack={() => setIsSubmitted(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
        <FormHeader />

        {errorMessage && <ErrorBanner message={errorMessage} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              required
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              required
            />
          </div>

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="organizer@example.com"
            required
          />

          <InputField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+234 800 000 0000"
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <div>
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              hasError={Boolean(formData.confirmPassword && formData.password !== formData.confirmPassword)}
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">Passwords do not match</p>
            )}
          </div>

          <SubmitButton loading={loading} />
        </form>

        <FormFooter />
      </div>
    </div>
  );
}

// --- Sub-components for Clean Structure ---

function InputField({ label, name, type = 'text', value, onChange, placeholder, required = false, hasError = false }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
        {label} {required ? <span className="text-red-500">*</span> : <span className="text-slate-400 font-normal">(Optional)</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white text-sm transition-colors ${
          hasError ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-emerald-500'
        }`}
      />
    </div>
  );
}

function FormHeader() {
  return (
    <div className="mb-8 text-center">
      <span className="text-xs uppercase tracking-wider text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
        Aviorè Go Operator
      </span>
      <h1 className="text-3xl font-bold mt-3 text-slate-900">Event Organizer Registration</h1>
      <p className="text-slate-500 text-sm mt-1">
        Create your account to manage your events, trips, and logistics
      </p>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-start gap-2">
      <span className="text-base leading-none">⚠️</span>
      <span>{message}</span>
    </div>
  );
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Creating Account...</span>
        </>
      ) : (
        <span>Register & Confirm Email →</span>
      )}
    </button>
  );
}

function FormFooter() {
  return (
    <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
      Already have an account?{' '}
      <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
        Sign In
      </Link>
    </div>
  );
}

function EmailVerificationNotice({ email, onBack }: { email: string; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-lg">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl border border-emerald-200">
          ✉️
        </div>

        <h2 className="text-2xl font-bold mb-2 text-slate-900">Check Your Email</h2>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          We sent a verification link to <span className="text-emerald-600 font-semibold">{email}</span>. Please open your inbox and click <span className="text-slate-900 font-semibold">Confirm Email</span> to continue your organizer onboarding.
        </p>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-xs text-slate-500">
          Didn't receive the email? Check your spam folder or re-enter your email address.
        </div>

        <button
          onClick={onBack}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold transition-colors"
        >
          ← Back to registration
        </button>
      </div>
    </div>
  );
}