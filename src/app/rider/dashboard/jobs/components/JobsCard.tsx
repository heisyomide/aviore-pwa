// components/JobCard.tsx
'use client';

import type { AvailableJob } from '../types';

interface JobCardProps {
  job: AvailableJob;
  jobType?: string;
  onClick: () => void;
}

export default function JobCard({
  job,
  jobType = 'PARCEL_DELIVERY',
  onClick,
}: JobCardProps) {
  const isEventTransit = jobType === 'EVENT_TRANSIT';

  const displayPrice = Number(
    isEventTransit 
      ? (job.route?.price ?? job.payout ?? 0) 
      : (job.payout ?? job.route?.price ?? 0)
  ) || 0;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-neutral-800 bg-neutral-900 hover:border-emerald-600 transition-all p-5"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-neutral-500 font-mono">
            {isEventTransit ? `TRIP: ${job.tripLeg || 'SCHEDULED'}` : job.trackingCode}
          </p>

          <h3 className="text-white font-bold mt-1">
            {isEventTransit
              ? job.event?.title || 'Event Transit Trip'
              : job.packageCategory?.replaceAll('_', ' ')}
          </h3>

          <p className="text-sm text-neutral-400 mt-3">
            📍 {isEventTransit ? job.route?.originCity : job.pickupAddress}
          </p>

          <p className="text-sm text-neutral-400 mt-1">
            🏁 {isEventTransit ? job.route?.destination : job.destinationAddress}
          </p>
        </div>

        <div className="text-right">
          <p className="text-emerald-400 font-black text-xl">
            ₦{displayPrice.toLocaleString()}
          </p>

          <p className="text-xs text-neutral-500 mt-2">
            {isEventTransit 
              ? `Departs: ${job.departureTime ? new Date(job.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}` 
              : `${job.distanceKm ?? 0} km`}
          </p>

          <p className="text-xs text-neutral-500">
            {isEventTransit ? `${job.pickupPoints?.length || 0} pickup points` : `${job.estimatedMinutes ?? 0} mins`}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {job.isExpress && (
          <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
            EXPRESS
          </span>
        )}

        <span className="px-2 py-1 rounded-full bg-neutral-800 text-neutral-300 text-xs">
          {isEventTransit ? 'BUS / VAN TRANSIT' : job.deliveryType}
        </span>
      </div>
    </button>
  );
}