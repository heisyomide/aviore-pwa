'use client';

export default function AuthLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-950">

      <div className="flex flex-col items-center gap-5">

        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-700 border-t-white" />

        <div className="space-y-2 text-center">

          <h2 className="text-lg font-semibold tracking-wide text-white">
            Loading Aviorè
          </h2>

          <p className="text-sm text-neutral-400">
            Preparing your dashboard...
          </p>

        </div>

      </div>

    </div>
  );
}