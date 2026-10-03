"use client";

import { Shipment } from "../types";

interface Props {
  shipment: Shipment;
}

export default function ShipmentDetails({
  shipment,
}: Props) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {shipment.trackingCode}
          </h2>

          <p className="text-neutral-500">
            Shipment Details
          </p>
        </div>

        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          {shipment.status}
        </span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <div>
          <p className="text-xs uppercase text-neutral-400">
            Pickup
          </p>

          <p className="mt-2">
            {shipment.pickupAddress}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-neutral-400">
            Destination
          </p>

          <p className="mt-2">
            {shipment.destinationAddress}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-neutral-400">
            Recipient
          </p>

          <p className="mt-2">
            {shipment.recipient}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-neutral-400">
            Phone
          </p>

          <p className="mt-2">
            {shipment.recipientPhone}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-neutral-400">
            Package
          </p>

          <p className="mt-2">
            {shipment.packageCategory}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-neutral-400">
            Weight
          </p>

          <p className="mt-2">
            {shipment.weightRange}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-neutral-400">
            Delivery Fee
          </p>

          <p className="mt-2 font-semibold">
            ₦{shipment.totalPrice}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-neutral-400">
            Estimated Time
          </p>

          <p className="mt-2">
            {shipment.estimatedMinutes} mins
          </p>
        </div>

      </div>
    </div>
  );
}