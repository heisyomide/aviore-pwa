"use client";

import type {
  PaymentStatus,
} from "../types";

export type PaymentFilterType =
  | "ALL"
  | PaymentStatus;

interface Props {
  active: PaymentFilterType;

  onChange: (
    filter: PaymentFilterType
  ) => void;
}

const filters: PaymentFilterType[] = [
  "ALL",
  "SUCCESSFUL",
  "PENDING",
  "REFUNDED",
];

export default function PaymentFilter({
  active,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">

      {filters.map((filter) => (

        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
            active === filter
              ? "bg-neutral-950 text-white"
              : "border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100"
          }`}
        >
          {filter === "ALL"
            ? "All"
            : filter.replaceAll("_", " ")}

        </button>

      ))}

    </div>
  );
}