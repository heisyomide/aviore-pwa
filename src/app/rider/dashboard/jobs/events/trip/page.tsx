// app/rider/dashboard/jobs/tripPage.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation, MapPin, ArrowRight, Clock, DollarSign, ShieldAlert } from 'lucide-react';
import jobsService from '../../services/jobs.service';

interface AcceptedTrip {
  id: string;
  tripLeg: string;
  status: string;
  departureTime: string;
  arrivalTime: string;
  payout: number;
  route: {
    originCity: string;
    destination: string;
  };
  event: {
    title: string;
    venue: string;
    city: string;
  } | null;
  _count?: {
    bookings: number;
  };
}

export default function TripPage() {
  const [acceptedTrips, setAcceptedTrips] = useState<AcceptedTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAcceptedTrips() {
      try {
        setLoading(true);
        // Fetches jobs that have been accepted / assigned to the rider
        const data = await jobsService.getAcceptedEventTrips ? await jobsService.getAcceptedEventTrips() : [];
        setAcceptedTrips(data);
      } catch (error) {
        console.error('Failed to load accepted trips:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAcceptedTrips();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Active & Accepted Trips</h1>
          <p className="text-sm text-neutral-400">
            Quickly resume your ongoing transit sessions or access your active live GPS telemetry workspace if you minimized out of the app.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="w-full h-64 bg-neutral-900 flex items-center justify-center font-mono text-neutral-500 animate-pulse rounded-2xl border border-neutral-800">
          Syncing accepted trips...
        </div>
      ) : acceptedTrips.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-12 text-center space-y-3">
          <Navigation className="mx-auto h-12 w-12 text-neutral-600 animate-pulse" />
          <h3 className="text-lg font-bold text-white">No Active Accepted Trips</h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            You don't have any active jobs open right now. Head over to the general events board to accept available transit corridors.
          </p>
          <div className="pt-4">
            <Link
              href="/rider/dashboard/jobs/events"
              className="inline-flex items-center space-x-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 px-5 py-3 text-xs font-bold text-white transition border border-neutral-700"
            >
              <span>Browse Available Events Board</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {acceptedTrips.map((trip) => (
            <div 
              key={trip.id} 
              className="rounded-2xl border border-emerald-500/30 bg-neutral-900 p-6 shadow-xl space-y-5 flex flex-col justify-between transition hover:border-emerald-500/60 relative overflow-hidden"
            >
              {/* Subtle top indicator highlight for active status */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {trip.status || 'ACTIVE SESSION'}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-400 font-mono font-black">
                    <DollarSign className="w-4 h-4" />
                    <span>{trip.payout?.toLocaleString() || '0'}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    {trip.route?.originCity} ➔ {trip.route?.destination}
                  </h3>
                  {trip.event && (
                    <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{trip.event.title} • {trip.event.venue}, {trip.event.city}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800 text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Dep: {new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div>
                    <span>Manifest: {trip._count?.bookings || 0} Booked</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/rider/dashboard/jobs/events/${trip.id}/active`}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <Navigation className="w-4 h-4" />
                <span>Return to Active Map & Telemetry</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}