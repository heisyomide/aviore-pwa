"use client";

import {
  Receipt,
  CheckCircle2,
  Clock3,
  RotateCcw,
} from "lucide-react";

import type { Payment } from "../types";

interface Props {
  payment: Payment;
  onClick?: (payment: Payment) => void;
}

export default function PaymentRow({
  payment,
  onClick,
}: Props) {
  const statusColor =
    payment.status === "SUCCESSFUL"
      ? "text-green-600 bg-green-50"
      : payment.status === "PENDING"
      ? "text-amber-600 bg-amber-50"
      : "text-blue-600 bg-blue-50";

  return (
    <tr
      onClick={() => onClick?.(payment)}
      className="cursor-pointer border-b border-neutral-100 transition hover:bg-neutral-50"
    >
      <td className="px-6 py-5 font-bold">
        {payment.id}
      </td>

      <td className="px-6 py-5">
        {payment.shipmentCode}
      </td>

      <td className="px-6 py-5">
        {payment.paymentMethod}
      </td>

      <td className="px-6 py-5">
        {payment.paidAt}
      </td>

      <td className="px-6 py-5">
        ₦{payment.amount.toLocaleString()}
      </td>

      <td className="px-6 py-5">

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${statusColor}`}
        >

          {payment.status ===
          "SUCCESSFUL" && (
            <CheckCircle2 size={14} />
          )}

          {payment.status ===
          "PENDING" && (
            <Clock3 size={14} />
          )}

          {payment.status ===
          "REFUNDED" && (
            <RotateCcw size={14} />
          )}

          {payment.status}

        </span>

      </td>

      <td className="px-6 py-5 text-right">

        <button
          className="rounded-lg p-2 transition hover:bg-neutral-100"
        >
          <Receipt size={18} />
        </button>

      </td>
    </tr>
  );
}