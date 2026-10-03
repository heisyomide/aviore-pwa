'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/src/lib/api';

const MERCHANT_TYPES = [
  { id: 'RESTAURANT', label: 'Restaurant / Food', description: 'Sell meals, fast food, and drinks' },
  { id: 'RETAIL', label: 'Retail / Store', description: 'Sell clothing, electronics, and goods' },
  { id: 'GROCERY', label: 'Grocery / Supermarket', description: 'Sell fresh produce and household items' },
  { id: 'PHARMACY', label: 'Pharmacy / Health', description: 'Sell medical and wellness products' },
];

export default function MerchantSignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [merchantType, setMerchantType] = useState('RESTAURANT');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

// Change this block in MerchantSignupPage:
    try {
      await api.post('/auth/register/merchant', {
        email,
        password,
        merchantType,
      });

      // Switch view to display email confirmation instructions
      setIsSubmitted(true);
    } catch (err: any) {

 
      setError(
        err.response?.data?.message || err.message || 'Failed to create merchant account.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Check your email</h2>
          <p className="mt-2 text-sm text-zinc-600">
            We just sent a confirmation link to <span className="font-semibold text-zinc-900">{email}</span>. Click the link inside to verify your email and access your merchant onboarding portal.
          </p>
          <div className="mt-6">
            <Link href="/login" className="text-xs font-semibold text-emerald-700 hover:underline">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-50 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #a7f3d0 0%, transparent 50%)' }} />
        
        <div className="z-10 text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-emerald-700 text-white p-2.5 rounded-2xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.621 1.62a3.004 3.004 0 01-.621 4.72m-13.5 0h13.5" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Aviorè Go</h1>
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Grow Your Business With Us</h2>
          <p className="text-zinc-600 leading-relaxed">
            Partner with Aviorè Go to list your store, reach thousands of active local customers, and streamline your order fulfillment.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Merchant Registration</h2>
            <p className="mt-1 text-sm text-zinc-500">Set up your store account details</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-600 font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 ml-1">Select Merchant Type</label>
              <div className="grid grid-cols-2 gap-2.5">
                {MERCHANT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setMerchantType(type.id)}
                    className={`flex flex-col text-left rounded-xl border p-3 transition ${
                      merchantType === type.id
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-zinc-900">{type.label}</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">{type.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="store@example.com" 
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password" 
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-4 pr-12 py-3.5 text-sm text-zinc-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-3.5 text-zinc-400 hover:text-zinc-600 focus:outline-none text-xs font-semibold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 ml-1">Confirm Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password" 
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3.5 text-sm tracking-wide transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up as Merchant'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
                Login here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}