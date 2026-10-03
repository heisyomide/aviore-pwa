"use client";

import type { PaymentDetails } from "../types";

interface Props {
  payments: PaymentDetails[];
  onOpen: (paymentId: string) => void;
}

export default function PaymentHistory({
  payments,
  onOpen,
}: Props) {
  if (!payments.length) {
    return (
      <div className="rounded-2xl border bg-white py-16 text-center">
        <h3 className="text-lg font-bold">
          No Payment History
        </h3>

        <p className="mt-2 text-sm text-neutral-500">
          Your completed shipment payments will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-6 py-5">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
          Transaction Audit Trail
        </h3>

        <p className="mt-1 text-sm text-neutral-500">
          Every successful payment processed through AVIORÈ Go.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50">
            <tr className="border-b">
              <th className="px-6 py-4 text-left font-bold">
                Reference
              </th>

              <th className="px-6 py-4 text-left font-bold">
                Shipment
              </th>

              <th className="px-6 py-4 text-left font-bold">
                Method
              </th>

              <th className="px-6 py-4 text-left font-bold">
                Status
              </th>

              <th className="px-6 py-4 text-left font-bold">
                Date
              </th>

              <th className="px-6 py-4 text-right font-bold">
                Amount
              </th>

              <th className="px-6 py-4 text-right font-bold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b transition hover:bg-neutral-50"
              >
                <td className="px-6 py-5">
                  <div className="font-semibold">
                    {payment.txRef}
                  </div>

                  <div className="mt-1 text-xs text-neutral-500">
                    {payment.gateway}
                  </div>
                </td>

                <td className="px-6 py-5 font-mono text-xs">
                  {payment.shipment?.trackingCode ?? "N/A"}
                </td>

                <td className="px-6 py-5 capitalize">
                  {payment.paymentMethod ?? "Not Available"}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      payment.status === "SUCCESSFUL"
                        ? "bg-green-100 text-green-700"
                        : payment.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-neutral-500">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-5 text-right font-black">
                  ₦{Number(payment.amount).toLocaleString()}
                </td>

                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => onOpen(payment.id)}
                    className="rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-neutral-100 cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}