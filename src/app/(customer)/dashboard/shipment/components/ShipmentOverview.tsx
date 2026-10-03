"use client";

import type { RecentShipment } from "../types";
import ShipmentCard from "./ShipmentCard";

interface Props {
  shipments: RecentShipment[];
  loading?: boolean;
}

export default function ShipmentOverview({
  shipments,
  loading,
}: Props) {
  if (loading) {
    return (
      <section>
        <div className="mb-5">
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400">
            Active Pipeline Stream
          </h3>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-3xl bg-neutral-100"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!shipments.length) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-300 p-14 text-center">
        <h2 className="text-xl font-bold">
          No Shipments Yet
        </h2>

        <p className="mt-2 text-neutral-500">
          Your shipment history will appear here.
        </p>
      </div>
    );
  }

  return (
    <section>

      <div className="mb-5 flex items-center justify-between">

        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400">
            Active Pipeline Stream
          </h3>

          <p className="mt-1 text-sm text-neutral-500">
            Monitor and track your recent deliveries.
          </p>
        </div>

        <span className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-600">
          {shipments.length} Shipment{shipments.length !== 1 ? "s" : ""}
        </span>

      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {shipments.map((shipment) => (
          <ShipmentCard
            key={shipment.id}
            shipment={shipment}
          />
        ))}

      </div>

    </section>
  );
}