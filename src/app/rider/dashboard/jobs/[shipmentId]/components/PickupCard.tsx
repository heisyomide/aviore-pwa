'use client';

import {
  MapPinned,
  Package,
} from 'lucide-react';

import type { ShipmentDetails } from '../types';

interface Props {
  shipment: ShipmentDetails;
}

export default function PickupCard({
  shipment,
}: Props) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">

      <div className="flex items-center gap-2 mb-4">

        <Package
          size={18}
          className="text-emerald-400"
        />

        <h2 className="font-semibold text-white">
          Pickup Information
        </h2>

      </div>

      <div className="space-y-4">

        <div>

          <p className="text-xs uppercase text-neutral-500">
            Pickup Address
          </p>

          <div className="mt-2 flex gap-3">

            <MapPinned
              size={18}
              className="mt-1 text-emerald-400"
            />

            <p className="text-neutral-200 leading-relaxed">
              {shipment.pickup.address}
            </p>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>

            <p className="text-xs uppercase text-neutral-500">
              Package
            </p>

            <p className="mt-1 font-medium text-white">
              {shipment.packageCategory}
            </p>

          </div>

          <div>

            <p className="text-xs uppercase text-neutral-500">
              Weight
            </p>

            <p className="mt-1 font-medium text-white">
              {shipment.weightRange}
            </p>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>

            <p className="text-xs uppercase text-neutral-500">
              Delivery Type
            </p>

            <p className="mt-1 text-neutral-200">
              {shipment.deliveryType}
            </p>

          </div>

          <div>

            <p className="text-xs uppercase text-neutral-500">
              Rider Earnings
            </p>

            <p className="mt-1 font-bold text-emerald-400">
              ₦{shipment.riderShare.toLocaleString()}
            </p>

          </div>

        </div>

        {shipment.description && (

          <div>

            <p className="text-xs uppercase text-neutral-500">
              Description
            </p>

            <p className="mt-2 rounded-xl bg-neutral-950 p-3 text-sm text-neutral-300">
              {shipment.description}
            </p>

          </div>

        )}

      </div>

    </div>
  );
}