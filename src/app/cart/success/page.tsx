'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Package, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartSuccessPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  useEffect(() => {
    setMounted(true);
    setOrderRef(`AVR-NG-${Math.floor(100000 + Math.random() * 900000)}`);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50 p-6 text-gray-900 font-sans">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-gray-200/80 bg-white p-8 shadow-xl shadow-gray-200/50">
          
          {/* Top Status Pill */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Aviorè Gateway</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified</span>
            </div>
          </div>

          {/* Hero Icon & Typography */}
          <div className="my-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm">
              <Check className="h-10 w-10 stroke-[2.5]" />
            </div>
            
            <h1 className="mt-6 text-2xl font-black tracking-tight text-gray-900">
              Payment Successful
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Your transaction has been processed securely. Your order has been placed and is now being handled.
            </p>
          </div>

          {/* Minimal Order Ref Box */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 mb-8 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction Reference</span>
            <span className="font-mono text-sm font-bold text-gray-800">{orderRef}</span>
          </div>

          {/* Action Grid */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard/orders')}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-semibold text-white shadow-md transition-all hover:bg-gray-800 active:scale-[0.99]"
            >
              <Package className="h-4 w-4" />
              <span>View Order Status</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => router.push('/cart')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Cart</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}