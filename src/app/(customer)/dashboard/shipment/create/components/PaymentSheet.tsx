'use client';

import { Loader2 } from 'lucide-react';
import { PricingResponse } from '../../types';

interface PaymentSheetProps {
  open: boolean;
  pricing: PricingResponse | null;
  loading: boolean;

  onClose: () => void;

  onFlutterwave: () => Promise<void>;
}

export default function PaymentSheet({
  open,
  pricing,
  loading,
  onClose,
  onFlutterwave,
}: PaymentSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 animate-in slide-in-from-bottom duration-300">

        <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-neutral-300" />

        <div className="text-center">
          <h2 className="text-2xl font-black">
            Complete Payment
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Secure payment powered by Flutterwave
          </p>
        </div>

        <div className="mt-8 rounded-2xl border bg-neutral-50 p-5 space-y-4">

          <div className="flex justify-between">
            <span className="text-neutral-500">
              Delivery Fee
            </span>

            <span className="font-bold">
              ₦{pricing?.totalDeliveryFee.toLocaleString() ?? '0'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-500">
              Distance
            </span>

            <span>
              {pricing?.distanceKm ?? '--'} km
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-500">
              Estimated Time
            </span>

            <span>
              {pricing?.estimatedMinutes ?? '--'} mins
            </span>
          </div>

          <hr />

          <div className="flex justify-between text-xl font-black">
            <span>Total</span>

            <span className="text-green-600">
              ₦{pricing?.totalDeliveryFee.toLocaleString() ?? '0'}
            </span>
          </div>

        </div>

        <button
          disabled={loading}
          onClick={onFlutterwave}
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Initializing Payment...
            </>
          ) : (
            'Pay Securely with Flutterwave'
          )}
        </button>

        <button
          disabled={loading}
          onClick={onClose}
          className="mt-3 w-full rounded-xl py-3 font-semibold text-neutral-500"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}