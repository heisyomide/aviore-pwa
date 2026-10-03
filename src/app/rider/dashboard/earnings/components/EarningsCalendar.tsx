'use client';

interface Props {
  weekLabel: string;
}

export default function EarningsCalendar({
  weekLabel,
}: Props) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
      <p className="text-xs uppercase tracking-widest text-neutral-500">
        Current Week
      </p>

      <h2 className="mt-2 text-xl font-bold text-white">
        {weekLabel}
      </h2>

      <p className="mt-2 text-sm text-neutral-400">
        Earnings shown are calculated from
        completed deliveries only.
      </p>
    </div>
  );
}