// src/app/confirm-email/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  const hasCalledApi = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }

    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    const verifyToken = async () => {
      try {
        // Dynamic Backend URL derived from environment variables
        const API_BASE =
          process.env.NEXT_PUBLIC_API_URL || 'https://aviore-go-backend.onrender.com';

        const response = await fetch(`${API_BASE}/auth/confirm-email?token=${token}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        const jwtToken = data.access_token || data.token || data.accessToken;

        if (jwtToken) {
          // 1. Store auth tokens matching your app-wide api.ts keys
          localStorage.setItem('aviore_token', jwtToken);
          localStorage.setItem('access_token', jwtToken); // Legacy fallback

          // 2. Store user object matching aviore keys
          if (data.user) {
            localStorage.setItem('aviore_user', JSON.stringify(data.user));
            localStorage.setItem('user', JSON.stringify(data.user));
          }

          // 3. Set cookies
          document.cookie = `aviore_token=${jwtToken}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `access_token=${jwtToken}; path=/; max-age=86400; SameSite=Lax`;
        }

        setStatus('success');
        setMessage('Email verified successfully! Redirecting...');

        // 4. Determine redirect path based on user role
// 4. Determine redirect path based on user role
const userRole = data.user?.role?.toUpperCase();
let redirectPath = '/dashboard'; // Default fallback

if (userRole === 'MERCHANT') {
  redirectPath = '/merchant-signup/onboarding';
} else if (userRole === 'ORGANIZER') {
  redirectPath = '/organizer/onboarding';
} else if (userRole === 'RIDER') {
  redirectPath = '/become-rider';
}

        // 5. Redirect based on role
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 1200);

      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Invalid or expired confirmation token.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center', maxWidth: '400px' }}>
        {status === 'loading' && <h2 style={{ color: '#0284c7' }}>⌛ Verifying Email...</h2>}
        {status === 'success' && <h2 style={{ color: '#16a34a' }}>✅ Verified!</h2>}
        {status === 'error' && <h2 style={{ color: '#dc2626' }}>❌ Verification Failed</h2>}
        <p style={{ marginTop: '12px', color: '#475569' }}>{message}</p>
        
        {status === 'error' && (
          <button 
            onClick={() => router.push('/login')} 
            style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}