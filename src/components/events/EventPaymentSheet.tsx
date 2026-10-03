'use client';

import { Loader2 } from 'lucide-react';

interface EventPaymentSheetProps {
  open: boolean;
  event: any;
  route: any;
  pickup: any;
  tripType: string;
  totalAmount: number;
  loading: boolean;
  onClose: () => void;
  onFlutterwavePay: () => Promise<void>;
}

export default function EventPaymentSheet({
  open,
  event,
  route,
  pickup,
  tripType,
  totalAmount,
  loading,
  onClose,
  onFlutterwavePay,
}: EventPaymentSheetProps) {
  if (!open || !event || !route || !pickup) return null;

  const formatTripTypeLabel = (type: string) => {
    switch (type) {
      case 'round-trip':
        return 'Round Trip';
      case 'return':
        return 'Return (One-way)';
      case 'outbound':
      default:
        return 'Outbound (One-way)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-neutral-300" />

        <div className="text-center">
          <h2 className="text-2xl font-black text-neutral-950">Complete Booking Payment</h2>
          <p className="mt-1 text-sm text-neutral-500">Secure payment powered by Flutterwave</p>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Event</span>
            <span className="font-bold text-neutral-950 text-right">{event.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Route</span>
            <span className="font-medium text-neutral-900">{route.originCity} ➔ {route.destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Trip Type</span>
            <span className="font-medium text-neutral-900">{formatTripTypeLabel(tripType)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Pickup Landmark</span>
            <span className="font-medium text-neutral-900 text-right max-w-[200px] truncate">{pickup.name}</span>
          </div>
          <hr className="my-2 border-neutral-200" />
          <div className="flex justify-between text-xl font-black">
            <span className="text-neutral-950">Total Fare</span>
            <span className="text-green-600">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <button
          disabled={loading}
          onClick={onFlutterwavePay}
          className="mt-6 flex w-full items-center justify-center rounded-2xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:opacity-60 shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Initializing Flutterwave...
            </>
          ) : (
            `Pay ₦${totalAmount.toLocaleString()} Securely`
          )}
        </button>

        <button
          disabled={loading}
          onClick={onClose}
          className="mt-3 w-full rounded-xl py-3 font-semibold text-neutral-500 hover:text-neutral-950 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}