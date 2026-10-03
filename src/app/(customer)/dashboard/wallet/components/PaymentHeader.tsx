"use client";

import {
  Download,
  LifeBuoy,
} from "lucide-react";

interface Props {
  onDownload?: () => void;
  onSupport?: () => void;
  onRefresh: () => void | Promise<void>;
}

export default function PaymentHeader({
  onDownload,
  onSupport,
}: Props) {
  return (
    <div className="mb-8 flex flex-col gap-6 border-b border-neutral-100 pb-6 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-950">
          Payments & Transactions
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Review every shipment payment, download receipts and monitor your payment history.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">

        <button
          onClick={onDownload}
          className="flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
        >
          <Download size={18} />
          Download Statement
        </button>

        <button
          onClick={onSupport}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold transition hover:bg-neutral-50"
        >
          <LifeBuoy size={18} />
          Payment Support
        </button>

      </div>

    </div>
  );
}