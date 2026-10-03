"use client";

interface Props {
  trackingCode: string;
  status: string;
}

export default function ShipmentDetailsHeader({
  trackingCode,
  status,
}: Props) {
  return (
    <div className="rounded-3xl bg-black text-white p-8">

      <p className="text-sm text-neutral-400">
        Tracking Code
      </p>

      <h1 className="mt-2 text-3xl font-black">
        {trackingCode}
      </h1>

      <span className="mt-4 inline-flex rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-300">
        {status.replaceAll("_", " ")}
      </span>

    </div>
  );
}