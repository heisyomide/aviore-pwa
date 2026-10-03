'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

function PaymentVerifyContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const transactionId = params.get('transaction_id');

      if (!transactionId) {
        throw new Error('Missing transaction ID reference.');
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/flutterwave/verify/${transactionId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Payment verification failed.');
      }

      setStatus('success');
      setMessage('Payment verified successfully. Redirecting...');

      const meta = result?.meta || {};
      let redirectPath = '/dashboard/shipment';

      if (meta.eventId) {
        redirectPath = '/dashboard/events';
      } else if (meta.type === 'FOOD_CART_CHECKOUT') {
        redirectPath = '/cart/success';
      }

      setTimeout(() => {
        router.replace(redirectPath);
      }, 2500);
    } catch (err: any) {
      console.error('[PAYMENT_VERIFY_ERROR]', err);
      setStatus('failed');
      setMessage(err.message || 'Verification failed.');
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
          <h2 className="mt-5 text-2xl font-bold">Verifying Payment</h2>
          <p className="mt-2 text-gray-500">{message}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-5 text-2xl font-bold text-green-700">Payment Successful</h2>
          <p className="mt-2 text-gray-500">{message}</p>
        </>
      )}

      {status === 'failed' && (
        <>
          <XCircle className="mx-auto h-16 w-16 text-red-600" />
          <h2 className="mt-5 text-2xl font-bold text-red-700">Verification Failed</h2>
          <p className="mt-2 text-gray-500">{message}</p>

          <button
            onClick={() => router.push('/dashboard/shipment')}
            className="mt-6 rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
          >
            Back to Dashboard
          </button>
        </>
      )}
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
            <h2 className="mt-5 text-2xl font-bold">Loading Page...</h2>
          </div>
        }
      >
        <PaymentVerifyContent />
      </Suspense>
    </div>
  );
}