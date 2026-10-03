'use client';

export default function EarningsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">

      {/* Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
          >
            <div className="h-3 w-24 rounded bg-neutral-800" />

            <div className="mt-4 h-8 w-32 rounded bg-neutral-800" />

            <div className="mt-3 h-2 w-20 rounded bg-neutral-800" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="mb-6 h-4 w-40 rounded bg-neutral-800" />

        <div className="flex h-56 items-end justify-between gap-3">
          {[1,2,3,4,5,6,7].map((bar) => (
            <div
              key={bar}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div className="h-36 w-8 rounded-t-lg bg-neutral-800" />

              <div className="h-2 w-6 rounded bg-neutral-800" />
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="space-y-3">
        {[1,2,3,4].map((row) => (
          <div
            key={row}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
          >
            <div className="flex justify-between">

              <div className="space-y-3">
                <div className="h-3 w-40 rounded bg-neutral-800" />

                <div className="h-2 w-28 rounded bg-neutral-800" />
              </div>

              <div className="space-y-3">
                <div className="h-3 w-24 rounded bg-neutral-800" />

                <div className="h-2 w-16 rounded bg-neutral-800" />
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}