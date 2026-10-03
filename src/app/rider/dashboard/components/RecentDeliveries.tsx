"use client";

import {
  ArrowRight,
  Clock3,
  Package,
} from "lucide-react";

import type { RecentDelivery } from "../types";

interface Props {
  deliveries: RecentDelivery[];
}

export default function RecentDeliveries({
  deliveries,
}: Props) {
  return (
    <section className="rounded-3xl border border-neutral-800 bg-neutral-900">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-5">

        <div>
          <h2 className="text-lg font-black text-white">
            Recent Deliveries
          </h2>

          <p className="mt-1 text-sm text-neutral-400">
            Your latest completed deliveries.
          </p>
        </div>

      </div>

      {/* Empty State */}

      {deliveries.length === 0 && (
        <div className="flex flex-col items-center justify-center px-8 py-16">

          <Package
            size={40}
            className="text-neutral-600"
          />

          <h3 className="mt-5 text-lg font-bold text-white">
            No deliveries yet
          </h3>

          <p className="mt-2 max-w-sm text-center text-sm text-neutral-500">
            Once you complete deliveries, they will appear here.
          </p>

        </div>
      )}

      {/* Delivery List */}

      {deliveries.length > 0 && (
        <div className="divide-y divide-neutral-800">

          {deliveries.map((delivery) => (
            <div
              key={delivery.shipmentId}
              className="flex flex-col gap-5 p-6 transition hover:bg-neutral-800/40 md:flex-row md:items-center md:justify-between"
            >

              <div className="flex-1">

                <div className="mb-3 flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                    {delivery.status}
                  </span>

                  <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-mono text-neutral-300">
                    {delivery.trackingCode}
                  </span>

                </div>

                <h3 className="font-bold text-white">
                  {delivery.recipient}
                </h3>

                <div className="mt-3 flex flex-col gap-2 text-sm text-neutral-400">

                  <div className="flex items-center gap-2">
                    <Package size={14} />

                    <span>
                      {delivery.pickupAddress}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ArrowRight size={14} />

                    <span>
                      {delivery.destinationAddress}
                    </span>
                  </div>

                </div>

              </div>

              <div className="flex items-end justify-between gap-8 md:flex-col md:items-end">

                <div>

                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    Earnings
                  </p>

                  <p className="text-xl font-black text-emerald-400">
                    ₦{delivery.amountEarned.toLocaleString()}
                  </p>

                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500">

                  <Clock3 size={14} />

                  {new Date(
                    delivery.deliveredAt
                  ).toLocaleDateString()}

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}