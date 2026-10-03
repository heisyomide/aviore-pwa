"use client";

import {
  CreditCard,
  Receipt,
  CalendarDays,
} from "lucide-react";

import type {
  PaymentSummary,
} from "../types";

interface Props {
  summary: PaymentSummary;
}

export default function PaymentSummaryCard({
  summary,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-6 text-white shadow-xl">

      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">
              Payment Summary
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              ₦{summary.totalSpent.toLocaleString()}
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              Total Amount Spent
            </p>

          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <CreditCard size={28} />
          </div>

        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-5">

          <div className="flex items-start gap-3">

            <Receipt
              size={18}
              className="mt-0.5 text-green-400"
            />

            <div>

              <p className="text-[11px] uppercase tracking-wider text-neutral-400">
                Transactions
              </p>

              <p className="mt-1 text-lg font-bold">
                {summary.totalTransactions}
              </p>

            </div>

          </div>

          <div className="flex items-start gap-3">

            <CalendarDays
              size={18}
              className="mt-0.5 text-blue-400"
            />

            <div>

              <p className="text-[11px] uppercase tracking-wider text-neutral-400">
                Last Payment
              </p>

              <p className="mt-1 font-semibold">
                {summary.lastPaymentDate}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}