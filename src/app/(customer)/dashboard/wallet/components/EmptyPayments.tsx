"use client";

import {
  ReceiptText,
} from "lucide-react";

export default function EmptyPayments() {
  return (
    <div className="flex flex-col items-center justify-center py-20">

      <div className="rounded-full bg-neutral-100 p-5">

        <ReceiptText
          size={34}
          className="text-neutral-500"
        />

      </div>

      <h3 className="mt-6 text-xl font-bold">
        No Payments Yet
      </h3>

      <p className="mt-2 max-w-md text-center text-sm leading-6 text-neutral-500">
        Your completed shipment payments will
        appear here automatically after you
        place your first delivery order.
      </p>

    </div>
  );
}