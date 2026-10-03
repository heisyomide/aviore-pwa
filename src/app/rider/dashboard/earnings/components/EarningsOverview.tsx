'use client';

import type { RiderEarningsOverview } from '../types';

interface Props {
  overview: RiderEarningsOverview;
}

export default function EarningsOverview({
  overview,
}: Props) {
  const cards = [
    {
      title: 'This Week Gross',
      value: `₦${overview.weekGross.toLocaleString()}`,
      color: 'text-emerald-400',
      footer: 'Completed deliveries this week',
    },
    {
      title: 'Completed Trips',
      value: overview.completedTrips.toString(),
      color: 'text-white',
      footer: 'Successful deliveries',
    },
    {
      title: 'Active Road Hours',
      value: `${overview.activeHours.toFixed(1)} hrs`,
      color: 'text-amber-400',
      footer: 'Time spent delivering',
    },
    {
      title: 'Average Per Trip',
      value: `₦${overview.averagePerTrip.toLocaleString()}`,
      color: 'text-cyan-400',
      footer: 'Average earnings',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            {card.title}
          </p>

          <h2 className={`mt-2 text-3xl font-black ${card.color}`}>
            {card.value}
          </h2>

          <p className="mt-3 text-xs text-neutral-500">
            {card.footer}
          </p>
        </div>
      ))}
    </div>
  );
}