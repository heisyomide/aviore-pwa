'use client';

interface Props {
  title?: string;
  description?: string;
}

export default function EmptyEarnings({
  title = 'No earnings yet',
  description = 'Complete your first delivery to start earning with Avioré Go.',
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900 px-8 py-20 text-center">

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 text-4xl">
        💰
      </div>

      <h2 className="text-xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-sm text-neutral-400">
        {description}
      </p>

      <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-3 text-xs text-neutral-500">
        Earnings will automatically appear here after completed deliveries.
      </div>

    </div>
  );
}