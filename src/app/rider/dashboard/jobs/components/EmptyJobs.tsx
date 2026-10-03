'use client';

export default function EmptyJobs() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">

      <div className="w-24 h-24 rounded-full bg-neutral-900 flex items-center justify-center text-5xl">

        📦

      </div>

      <h2 className="mt-8 text-2xl font-bold text-white">
        No Available Deliveries
      </h2>

      <p className="mt-3 max-w-sm text-center text-neutral-400 leading-relaxed">
        You're all caught up.

        New delivery requests will appear here
        automatically as customers create shipments.
      </p>

      <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-3">

        <p className="text-sm text-neutral-500">

          Stay online to receive new jobs.

        </p>

      </div>

    </div>
  );
}