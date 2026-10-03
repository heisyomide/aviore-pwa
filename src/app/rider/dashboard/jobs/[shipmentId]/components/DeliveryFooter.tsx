'use client';

import type { ShipmentDetails } from '../types';

interface Props {
  shipment: ShipmentDetails;

  loading: boolean;

  onArrivedPickup: () => void;

  onPickup: () => void;

  onArrivedDestination: () => void;

  onComplete: () => void;
}

export default function DeliveryFooter({
  shipment,
  loading,
  onArrivedPickup,
  onPickup,
  onArrivedDestination,
  onComplete,
}: Props) {
  const status = shipment.status;

  function renderButton() {
    switch (status) {
      case 'ACCEPTED':
        return (
          <button
            onClick={onArrivedPickup}
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading
              ? 'Updating...'
              : 'I Have Arrived At Pickup'}
          </button>
        );

      case 'PICKED_UP':
        return (
          <button
            onClick={onPickup}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? 'Updating...'
              : 'Confirm Package Pickup'}
          </button>
        );

      case 'IN_TRANSIT':
        return (
          <button
            onClick={onArrivedDestination}
            disabled={loading}
            className="w-full rounded-xl bg-orange-600 py-4 font-bold text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {loading
              ? 'Updating...'
              : 'I Have Arrived At Destination'}
          </button>
        );

      case 'OUT_FOR_DELIVERY':
        return (
          <button
            onClick={onComplete}
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 py-4 font-bold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {loading
              ? 'Updating...'
              : 'Confirm Delivery'}
          </button>
        );

      case 'DELIVERED':
        return (
          <div className="rounded-xl border border-green-700 bg-green-950 p-4 text-center">
            <p className="font-bold text-green-400">
              Delivery Completed
            </p>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="sticky bottom-0 border-t border-neutral-800 bg-neutral-950 p-5">
      {renderButton()}
    </div>
  );
}