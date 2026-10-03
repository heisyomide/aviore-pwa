'use client';

export default function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">

      {/* Header */}

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">

        <div className="flex items-center gap-5">

          <div className="h-24 w-24 rounded-full bg-neutral-800" />

          <div className="flex-1 space-y-3">

            <div className="h-7 w-56 rounded bg-neutral-800" />

            <div className="h-4 w-40 rounded bg-neutral-800" />

            <div className="h-4 w-64 rounded bg-neutral-800" />

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="grid gap-5 md:grid-cols-4">

        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
          >
            <div className="mb-4 h-4 w-24 rounded bg-neutral-800" />

            <div className="h-8 w-20 rounded bg-neutral-800" />
          </div>
        ))}

      </div>

      {/* Information */}

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-5">

        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="mb-2 h-3 w-28 rounded bg-neutral-800" />

            <div className="h-5 w-56 rounded bg-neutral-800" />
          </div>
        ))}

      </div>

      {/* Bank */}

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-5">

        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <div className="mb-2 h-3 w-28 rounded bg-neutral-800" />

            <div className="h-5 w-56 rounded bg-neutral-800" />
          </div>
        ))}

      </div>

    </div>
  );
}