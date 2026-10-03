"use client";

import {
  X,
  Receipt,
  Truck,
  CreditCard,
  Calendar,
  BadgeCheck,
} from "lucide-react";

import type { PaymentDetails } from "../types";

interface Props {
  open: boolean;
  payment: PaymentDetails | null;
  onClose: () => void;
}

export default function PaymentDetailsDrawer({
  open,
  payment,
  onClose,
}: Props) {
  if (!open || !payment) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-md overflow-y-auto border-l bg-white shadow-2xl">

        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">
          <div>
            <h2 className="text-xl font-black">
              Payment Details
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Transaction Information
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">

          <div className="rounded-2xl bg-neutral-950 p-6 text-white">

            <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
              Amount Paid
            </p>

            <h3 className="mt-3 text-4xl font-black">
              ₦{payment.amount.toLocaleString()}
            </h3>

            <span
              className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                payment.status === "SUCCESSFUL"
                  ? "bg-green-500/20 text-green-300"
                  : payment.status === "PENDING"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {payment.status}
            </span>

          </div>

          <div className="space-y-5">

            <Info
              icon={<Receipt size={18} />}
              label="Transaction ID"
              value={payment.id}
            />

            <Info
              icon={<Truck size={18} />}
              label="Shipment"
              value={payment.shipment.trackingCode}
            />

            <Info
              icon={<CreditCard size={18} />}
              label="Payment Method"
              value={payment.paymentMethod ?? "Not Available"}
            />

            <Info
              icon={<BadgeCheck size={18} />}
              label="Gateway"
              value={payment.gateway}
            />

            <Info
              icon={<Calendar size={18} />}
              label="Date"
              value={new Date(payment.createdAt).toLocaleString()}
            />

            <Info
              icon={<Receipt size={18} />}
              label="Reference"
              value={payment.txRef}
            />

          </div>

          <div className="space-y-3 pt-4">

            
<button
  disabled
  className="w-full rounded-xl bg-neutral-200 py-3 text-sm font-semibold text-neutral-500 cursor-not-allowed"
>
Receipt Coming Soon
</button>
          

            <button
              className="w-full rounded-xl border border-neutral-200 py-3 text-sm font-semibold transition hover:bg-neutral-100"
            >
              View Shipment
            </button>

          </div>

        </div>
      </div>
    </>
  );
}

interface InfoProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function Info({
  icon,
  label,
  value,
}: InfoProps) {
  return (
    <div className="flex gap-4">

      <div className="mt-1 text-neutral-500">
        {icon}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-neutral-400">
          {label}
        </p>

        <p className="mt-1 break-all font-semibold text-neutral-900">
          {value}
        </p>
      </div>

    </div>
  );
}