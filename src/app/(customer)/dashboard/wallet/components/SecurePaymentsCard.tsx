"use client";

import {
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

export default function SecurePaymentCard() {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-green-100 p-3">
          <ShieldCheck
            className="text-green-600"
            size={22}
          />
        </div>

        <div>

          <h3 className="font-bold text-neutral-900">
            Secure Payments
          </h3>

          <p className="text-xs text-neutral-500">
            Powered by Flutterwave
          </p>

        </div>

      </div>

      <div className="mt-5 space-y-4">

        <div className="flex gap-3">

          <BadgeCheck
            className="mt-1 text-green-600"
            size={18}
          />

          <p className="text-sm leading-6 text-neutral-600">
            Every payment is securely processed through
            Flutterwave using encrypted payment channels.
          </p>

        </div>

        <div className="flex gap-3">

          <BadgeCheck
            className="mt-1 text-green-600"
            size={18}
          />

          <p className="text-sm leading-6 text-neutral-600">
            Aviorè Go never stores your debit card,
            bank account or payment credentials.
          </p>

        </div>

        <div className="flex gap-3">

          <BadgeCheck
            className="mt-1 text-green-600"
            size={18}
          />

          <p className="text-sm leading-6 text-neutral-600">
            Every successful payment automatically
            generates a receipt that can be downloaded
            at any time.
          </p>

        </div>

      </div>

    </div>
  );
}