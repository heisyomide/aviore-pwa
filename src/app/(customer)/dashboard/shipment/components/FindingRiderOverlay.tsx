"use client";

import { Loader2, Bike } from "lucide-react";

export default function FindingRiderOverlay() {
  return (
    <div className="flex h-[420px] items-center justify-center bg-gradient-to-br from-neutral-900 to-black text-white">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>

        <h2 className="text-2xl font-bold">
          Finding Your Rider
        </h2>

        <p className="mt-3 text-sm text-neutral-300 leading-6">
          Please wait while we assign the nearest delivery
          partner to your shipment.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <Bike className="text-green-400" />

            <div className="text-left">
              <p className="font-semibold">
                Searching Nearby Riders
              </p>

              <p className="text-xs text-neutral-400">
                This usually takes less than 2 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}