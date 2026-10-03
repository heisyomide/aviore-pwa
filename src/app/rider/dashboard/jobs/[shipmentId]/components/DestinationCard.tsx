'use client';

import { MapPin, Phone, User } from 'lucide-react';

import type { ShipmentDetails } from '../types';

interface Props {
  shipment: ShipmentDetails;
}

export default function DestinationCard({
  shipment,
}: Props) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">

      <div className="flex items-center gap-2 mb-4">
        <MapPin
          size={18}
          className="text-red-400"
        />

        <h2 className="font-semibold text-white">
          Delivery Destination
        </h2>
      </div>

      <div className="space-y-4">

        <div>
          <p className="text-xs text-neutral-500 uppercase">
            Recipient
          </p>

          <div className="flex items-center gap-2 mt-1">

            <User size={16} />

            <span className="text-white">
              {shipment.recipient.name}
            </span>

          </div>
        </div>

        <div>

          <p className="text-xs text-neutral-500 uppercase">
            Phone
          </p>

          <a
            href={`tel:${shipment.recipient.phoneNumber}`}
            className="flex items-center gap-2 mt-1 text-emerald-400"
          >
            <Phone size={16} />

            {shipment.recipient.phoneNumber}

          </a>

        </div>

        <div>

          <p className="text-xs text-neutral-500 uppercase">
            Address
          </p>

          <p className="mt-1 text-neutral-200 leading-relaxed">
            {shipment.destination.address}
          </p>

        </div>

      </div>

    </div>
  );
}