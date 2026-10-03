// components/JobDetailsModal.tsx
'use client';

import type { AvailableJob } from '../types';

interface JobDetailsModalProps {
  open: boolean;
  job: AvailableJob | null;
  timer: number;
  jobType?: string;
  accepting: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export default function JobDetailsModal({
  open,
  job,
  timer,
  jobType = 'PARCEL_DELIVERY',
  accepting,
  onAccept,
  onClose,
}: JobDetailsModalProps) {
  if (!open || !job) {
    return null;
  }

  const isEventTransit = jobType === 'EVENT_TRANSIT';

  const displayPrice = Number(
    isEventTransit 
      ? (job.route?.price ?? job.payout ?? 0) 
      : (job.payout ?? job.route?.price ?? 0)
  ) || 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-end lg:items-center z-50">
      <div className="bg-neutral-950 border border-neutral-800 rounded-t-3xl lg:rounded-3xl w-full lg:max-w-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-neutral-500 font-mono">
              {isEventTransit ? `TRIP: ${job.tripLeg || 'SCHEDULED'}` : job.trackingCode}
            </p>
            <h2 className="text-xl font-black text-white mt-1">
              {isEventTransit ? job.event?.title || 'Event Transit Trip' : 'Delivery Request'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-xs uppercase text-neutral-500">
              {isEventTransit ? 'Departure Route' : 'Pickup'}
            </p>
            <p className="text-white mt-1">
              {isEventTransit ? `${job.route?.originCity} ➔ ${job.route?.destination}` : job.pickupAddress}
            </p>
          </div>

          {isEventTransit && job.event && (
            <div className="bg-neutral-900 rounded-xl p-4 space-y-1">
              <p className="text-xs uppercase text-neutral-500">Event Venue & Date</p>
              <p className="text-white font-medium">{job.event.venue}, {job.event.city}</p>
              <p className="text-xs text-neutral-400">
                Starts: {job.event.startDate ? new Date(job.event.startDate).toLocaleDateString() : 'TBD'}
              </p>
            </div>
          )}

          {!isEventTransit && (
            <div>
              <p className="text-xs uppercase text-neutral-500">
                Destination
              </p>
              <p className="text-white mt-1">
                {job.destinationAddress}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900 rounded-xl p-4">
              <p className="text-xs text-neutral-500">
                {isEventTransit ? 'Departure Time' : 'Distance'}
              </p>
              <p className="text-white font-bold mt-1">
                {isEventTransit 
                  ? (job.departureTime ? new Date(job.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD')
                  : `${job.distanceKm ?? 0} km`}
              </p>
            </div>

            <div className="bg-neutral-900 rounded-xl p-4">
              <p className="text-xs text-neutral-500">
                {isEventTransit ? 'Pickup Points' : 'ETA'}
              </p>
              <p className="text-white font-bold mt-1">
                {isEventTransit 
                  ? `${job.pickupPoints?.length || 0} stops` 
                  : `${job.estimatedMinutes ?? 0} mins`}
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-xl p-5">
            <p className="text-xs text-neutral-500">
              {isEventTransit ? 'Route Base Fare' : 'Rider Earnings'}
            </p>
            <p className="text-3xl font-black text-emerald-400 mt-1">
              ₦{displayPrice.toLocaleString()}
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <p className="text-center text-amber-300">
              Offer expires in
            </p>
            <p className="text-center text-4xl font-black mt-2 text-white">
              {timer}s
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            disabled={accepting}
            onClick={onAccept}
            className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white transition-all disabled:opacity-50"
          >
            {accepting
              ? 'Accepting...'
              : isEventTransit
              ? 'Accept Transit Trip'
              : 'Accept Delivery'}
          </button>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 transition-all"
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
}