'use client';

import { ShipmentFormData, PricingResponse } from '../../types';

interface CheckoutStepProps {
  formData: ShipmentFormData;
  pricing: PricingResponse | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onPay: () => void;
}

export default function CheckoutStep({
  formData,
  pricing,
  loading,
  submitting,
  error,
  onBack,
  onPay,
}: CheckoutStepProps) {
  return (
    <div className="flex flex-col h-full justify-between">

      <div>
        <h1 className="text-2xl font-black">Checkout</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Review your shipment before payment.
        </p>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-neutral-200 p-5">
          <h2 className="font-bold mb-4">Shipment Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Pickup</span>
              <span className="font-medium text-right">
                {formData.pickup.address || 'Not selected'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">Destination</span>
              <span className="font-medium text-right">
                {formData.destination.address || 'Not selected'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">Receiver</span>
              <span className="font-medium">
                {formData.receiver.receiverName || 'Not provided'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">Package Type</span>
              <span className="font-medium">
                {formData.packageCategory.replace('_', ' ')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">Weight Range</span>
              <span className="font-medium">
                {formData.weightRange.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-xl bg-neutral-50 p-5 text-center text-sm">
            Calculating delivery fee...
          </div>
        ) : pricing && (
          <div className="mt-6 rounded-2xl border border-neutral-200 p-5">
            <h2 className="font-bold mb-4">Pricing Breakdown</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Base Fare</span>
                <span>₦{pricing.breakdown.baseFee.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Pickup Distance</span>
                <span>₦{pricing.breakdown.pickupDistanceFee.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Distance</span>
                <span>₦{pricing.breakdown.deliveryDistanceFee.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Extra Charges</span>
                <span>₦{pricing.breakdown.extraCharges.toLocaleString()}</span>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between text-lg font-black text-green-600">
                <span>Total</span>
                <span>₦{pricing.totalDeliveryFee.toLocaleString()}</span>
              </div>

              <div className="pt-2 text-xs text-neutral-500">
                Distance: {pricing.distanceKm} km<br />
                ETA: {pricing.estimatedMinutes} mins
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={onPay}
          disabled={loading || submitting || !pricing}
          className="w-full rounded-xl bg-green-600 py-4 font-bold text-white disabled:opacity-50 active:scale-[0.985] transition-all"
        >
          {submitting
            ? 'Creating Shipment...'
            : pricing
            ? `Pay ₦${pricing.totalDeliveryFee.toLocaleString()}`
            : 'Calculate Price First'}
        </button>

        <button
          onClick={onBack}
          disabled={submitting}
          className="w-full rounded-xl border border-neutral-300 py-3 font-semibold"
        >
          Back
        </button>
      </div>
    </div>
  );
}