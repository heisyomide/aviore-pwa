'use client';

import React, { useState, Suspense, useTransition, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Loader2, 
  User, 
  Bike, 
  Store, 
  Calendar 
} from 'lucide-react';
import { api } from '@/src/lib/api';
import { useAuth } from '../../context/AuthContext';

interface UserPayload {
  role: string;
  status?: string;
}

const getRedirectUrl = (user: UserPayload): string => {
  console.log('[Auth Redirect Debug] User payload:', user);
  
  const statusUpper = (user.status || '').toUpperCase();
  const isPending = statusUpper === 'PENDING_VERIFICATION' || statusUpper === 'PENDING' || statusUpper === 'INCOMPLETE';

  switch (user.role) {
    case 'CUSTOMER':
      return '/dashboard';
    case 'RIDER':
      return isPending ? '/rider/onboarding' : '/rider/dashboard';
    case 'MERCHANT':
      return isPending ? '/merchant-signup/pending' : '/merchant/dashboard';
    case 'ORGANIZER':
      return isPending ? '/organizer/onboarding' : '/events/dashboard';
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

const ONBOARDING_LINKS = [
  { href: '/customer-onboarding', label: 'Customer', icon: User },
  { href: '/apply', label: 'Rider', icon: Bike },
  { href: '/merchant-signup', label: 'Merchant', icon: Store },
  { href: '/organizer/signup', label: 'Organizer', icon: Calendar },
] as const;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, startTransition] = useTransition();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: identifier,
        passwordRaw: password,
      });

      const user = res.data.user;
      const token = res.data.access_token || res.data.token;

      if (!token || !user) {
        throw new Error('Incomplete session payload returned from server.');
      }

      login(token, user);
      
      const destination = getRedirectUrl(user);
      startTransition(() => {
        router.push(destination);
        router.refresh();
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Invalid email or password.'
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Welcome Back!</h2>
        <p className="mt-1 text-sm text-zinc-500">Login to continue</p>
      </div>

      {registered && (
        <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-sm text-emerald-700 font-medium text-center">
          Account created successfully! Please login.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-600 font-medium text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 ml-1">Email or Phone Number</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400">
              <Mail className="w-5 h-5" />
            </span>
            <input 
              type="text" 
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or phone number" 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3.5 text-sm text-zinc-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 ml-1">Password</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400">
              <Lock className="w-5 h-5" />
            </span>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-12 py-3.5 text-sm text-zinc-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-3.5 text-zinc-400 hover:text-zinc-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer" 
            />
            <span className="text-xs text-zinc-600 font-medium">Remember me</span>
          </label>
          <Link href="/auth/forgot-password" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition">
            Forgot Password?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3.5 text-sm tracking-wide transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              Signing In...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-50 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #a7f3d0 0%, transparent 50%)' }} />
        
        <div className="z-10 text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-emerald-700 text-white p-2.5 rounded-2xl shadow-lg">
              <MapPin className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Aviorè Go</h1>
          </div>

          <div className="relative w-80 h-80 mx-auto mb-8">
            <Image 
              src="/images/logo.png" 
              alt="Delivery Rider"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Fast, Reliable Deliveries</h2>
          <p className="text-zinc-600 leading-relaxed">
            Join thousands of users, riders, and vendors making logistics seamless. Whether you're sending a package, selling items, or organizing events, Aviorè Go has you covered.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
          
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-4 text-emerald-700">
              <MapPin className="w-8 h-8" />
              <span className="text-2xl font-bold text-zinc-900 tracking-tight">Aviorè Go</span>
            </div>
            <div className="w-48 h-32 relative">
               <Image 
                src="/images/logo.png" 
                alt="Delivery Rider"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-emerald-700" />
            </div>
          }>
            <LoginFormContent />
          </Suspense>

          <div className="flex items-center gap-3 my-8">
            <div className="h-px w-full bg-zinc-200"></div>
            <span className="text-xs text-zinc-400 font-medium lowercase">or</span>
            <div className="h-px w-full bg-zinc-200"></div>
          </div>

          <div className="text-center">
            <p className="text-sm text-zinc-500 mb-4">Don't have an account?</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ONBOARDING_LINKS.map(({ href, label, icon: Icon }) => (
                <Link 
                  key={href} 
                  href={href} 
                  className="flex flex-col items-center text-center rounded-xl border border-zinc-200 bg-white p-3 hover:border-emerald-600 hover:bg-emerald-50 transition group cursor-pointer relative z-10"
                >
                  <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition mb-1.5 pointer-events-none">
                    <Icon className="w-4 h-4 pointer-events-none" />
                  </div>
                  <span className="block text-[11px] font-bold text-zinc-800 group-hover:text-emerald-700 transition pointer-events-none">{label}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}