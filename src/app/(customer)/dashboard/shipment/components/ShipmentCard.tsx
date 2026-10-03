"use client";

import Link from "next/link";
import type { RecentShipment } from "../types";

interface Props {
  shipment: RecentShipment;
}

export default function ShipmentCard({
  shipment,
}: Props) {
  const progress =
    shipment.status === "Delivered"
      ? 100
      : shipment.status === "In Transit"
      ? 65
      : 20;

  const progressColor =
    shipment.status === "Delivered"
      ? "bg-green-500"
      : shipment.status === "In Transit"
      ? "bg-blue-500"
      : "bg-amber-500";

  const badge =
    shipment.status === "Delivered"
      ? "bg-green-100 text-green-700"
      : shipment.status === "In Transit"
      ? "bg-blue-100 text-blue-700"
      : "bg-amber-100 text-amber-700";

  return (
    <Link
      href={`/dashboard/shipment/${shipment.id}`}
      className="block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-black hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{shipment.id}</h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${badge}`}
        >
          {shipment.status}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div>
          <span className="text-neutral-500">Recipient</span>

          <p className="font-medium">
            {shipment.recipient}
          </p>
        </div>

        <div>
          <span className="text-neutral-500">
            Destination
          </span>

          <p className="truncate">
            {shipment.destination}
          </p>
        </div>

        <div>
          <span className="text-neutral-500">
            Created
          </span>

          <p>{shipment.date}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs">
          <span>Delivery Progress</span>

          <span>{progress}%</span>
        </div>

        <div className="h-2 rounded-full bg-neutral-100">
          <div
            className={`h-full rounded-full ${progressColor}`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </Link>
  );
}