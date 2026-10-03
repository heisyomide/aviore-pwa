'use client';

export default function LoadingJobs() {
  return (
    <div className="space-y-5">

      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 animate-pulse"
        >
          <div className="flex justify-between">

            <div className="space-y-3 flex-1">

              <div className="h-3 w-28 rounded bg-neutral-800" />

              <div className="h-5 w-44 rounded bg-neutral-700" />

              <div className="h-3 w-full rounded bg-neutral-800" />

              <div className="h-3 w-4/5 rounded bg-neutral-800" />

            </div>

            <div className="space-y-3">

              <div className="h-6 w-20 rounded bg-neutral-700" />

              <div className="h-3 w-12 rounded bg-neutral-800" />

              <div className="h-3 w-14 rounded bg-neutral-800" />

            </div>

          </div>

          <div className="flex gap-2 mt-6">

            <div className="h-6 w-20 rounded-full bg-neutral-800" />

            <div className="h-6 w-24 rounded-full bg-neutral-800" />

          </div>

        </div>
      ))}

    </div>
  );
}