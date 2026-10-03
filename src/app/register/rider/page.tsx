'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RiderRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Client-side Validation
    if (!email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/register/rider`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register account.');
      }

      // Success: Show verification screen
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // State 2: Confirmation Link Sent Notice (Light Mode)
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl border border-amber-200">
            ✉️
          </div>

          <h2 className="text-2xl font-bold mb-2 text-slate-900">Check Your Email</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            We sent a verification link to <span className="text-amber-600 font-semibold">{email}</span>. Please open your inbox and click <span className="text-slate-900 font-semibold">Confirm Email</span> to continue your onboarding.
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-xs text-slate-500">
            Didn't receive the email? Check your spam folder or re-enter your email address.
          </div>

          <button
            onClick={() => setIsSubmitted(false)}
            className="text-amber-600 hover:text-amber-700 text-sm font-semibold transition-colors"
          >
            ← Back to registration
          </button>
        </div>
      </div>
    );
  }

  // State 1: Light Mode Signup Form
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="text-xs uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Aviorè Go Operator
          </span>
          <h1 className="text-3xl font-bold mt-3 text-slate-900">Rider Registration</h1>
          <p className="text-slate-500 text-sm mt-1">
            Create your account to start your rider onboarding
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-start gap-2">
            <span className="text-base leading-none">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rider@example.com"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 text-sm transition-colors"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 text-sm transition-colors"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white text-sm transition-colors ${
                confirmPassword && password !== confirmPassword
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-300 focus:border-amber-500'
              }`}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
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
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-600 hover:text-amber-700 font-semibold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}