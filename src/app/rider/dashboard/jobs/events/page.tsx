'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import jobsService from '../services/jobs.service';

interface PickupPoint {
  id: string;
  name: string;
  address: string;
  landmark?: string;
  maxCapacity: number;
}

interface EventDetails {
  eventId: string;
  title: string;
  venue: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  bannerUrl?: string | null;
}

interface RouteDetails {
  routeId: string;
  originCity: string;
  destination: string;
  price: number;
}

interface PayoutDetails {
  driverPayout: number;
  customerOneWayFare: number;
  customerRoundTripFare: number;
}

interface EventJob {
  tripId: string;
  tripLeg: string;
  departureTime: string;
  arrivalTime: string;
  payout: PayoutDetails;
  route: RouteDetails;
  event: EventDetails | null;
  pickupPoints: PickupPoint[];
}

export default function EventJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<EventJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<EventJob | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const fetchEventJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobsService.getEventTransitJobs();
      const jobList = response?.jobs || (Array.isArray(response) ? response : []);
      setJobs(jobList);
    } catch (error) {
      console.error('Failed to load event transit jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventJobs();
  }, [fetchEventJobs]);

  const getDriverPayout = (job: EventJob): number => {
    return Number(job?.payout?.driverPayout) || 0;
  };

  const handleAcceptJob = async (tripId: string) => {
    try {
      setAcceptingId(tripId);
      await jobsService.acceptEventJob(tripId);
      router.push(`/rider/dashboard/jobs/events/${tripId}/active`);
    } catch (error: any) {
      console.error('Failed to accept event trip:', error);
      const errorMessage = error?.response?.data?.message || 'This trip is no longer available or has already been taken.';
      alert(errorMessage);
      setSelectedJob(null);
      fetchEventJobs();
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <button 
            onClick={() => router.back()} 
            className="text-xs font-semibold text-neutral-400 hover:text-white mb-2 flex items-center gap-1 transition-colors cursor-pointer"
          >
            ← Back to Jobs Hub
          </button>
          <h1 className="text-3xl font-black text-white">Event Transit & Charters</h1>
          <p className="text-neutral-500 mt-1">
            Available scheduled long-distance routes and group transport assignments.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-xs font-bold uppercase border border-emerald-500/30">
          BUS / VAN / CAR FEED
        </span>
      </header>

      {loading ? (
        <div className="py-20 text-center text-neutral-500 font-mono animate-pulse">
          Loading scheduled event routes...
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
          <span className="text-4xl mb-3 block">🚌</span>
          <h3 className="text-lg font-bold text-white">No Event Trips Available</h3>
          <p className="text-neutral-500 text-sm mt-1 max-w-sm mx-auto">
            There are currently no active published event transit schedules matching your vehicle category. Check back later!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <JobCard 
              key={`${job.tripId}-${index}`} 
              job={job} 
              payoutAmount={getDriverPayout(job)} 
              onSelect={() => setSelectedJob(job)} 
            />
          ))}
        </div>
      )}

      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          payoutAmount={getDriverPayout(selectedJob)}
          isAccepting={acceptingId === selectedJob.tripId}
          onClose={() => setSelectedJob(null)}
          onAccept={() => handleAcceptJob(selectedJob.tripId)}
        />
      )}
    </div>
  );
}

function JobCard({ job, payoutAmount, onSelect }: { job: EventJob; payoutAmount: number; onSelect: () => void }) {
  return (
    <div 
      onClick={onSelect}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:border-neutral-700 cursor-pointer"
    >
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-3">
          <span className="bg-neutral-800 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase font-mono">
            {job.tripLeg} LEG
          </span>
          <span className="text-neutral-300 text-sm font-medium">
            {job.route.originCity} ➔ <strong className="text-white">{job.route.destination}</strong>
          </span>
        </div>

        {job.event && (
          <h3 className="text-lg font-bold text-white">{job.event.title}</h3>
        )}

        <div className="text-xs text-neutral-400 font-mono flex gap-4">
          <span>📅 {new Date(job.departureTime).toLocaleDateString()}</span>
          <span>📍 {job.pickupPoints?.length || 0} Pickup Points</span>
        </div>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-neutral-800">
        <div className="text-left md:text-right">
          <span className="text-xs text-neutral-500 block uppercase font-semibold">Driver Payout</span>
          <span className="text-xl font-black text-emerald-400 font-mono">
            ₦{payoutAmount.toLocaleString()}
          </span>
        </div>

        <span className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs transition-all">
          View Details →
        </span>
      </div>
    </div>
  );
}

function JobDetailsModal({ 
  job, 
  payoutAmount, 
  isAccepting, 
  onClose, 
  onAccept 
}: { 
  job: EventJob; 
  payoutAmount: number; 
  isAccepting: boolean; 
  onClose: () => void; 
  onAccept: () => void; 
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="bg-neutral-800 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase font-mono">
              {job.tripLeg} LEG
            </span>
            <h2 className="text-2xl font-black text-white mt-2">
              {job.route.originCity} ➔ {job.route.destination}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-lg bg-neutral-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {job.event && (
          <div className="bg-neutral-950 rounded-2xl p-4 border border-neutral-800">
            <h3 className="text-md font-bold text-white">{job.event.title}</h3>
            <p className="text-xs text-neutral-400 mt-1">
              📍 {job.event.venue}, {job.event.city}, {job.event.state}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs font-mono text-neutral-400 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
          <div>
            <span className="block text-neutral-600 uppercase font-semibold">Departure</span>
            <span className="text-neutral-200">{new Date(job.departureTime).toLocaleString()}</span>
          </div>
          <div>
            <span className="block text-neutral-600 uppercase font-semibold">Arrival</span>
            <span className="text-neutral-200">{new Date(job.arrivalTime).toLocaleString()}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Pickup Points ({job.pickupPoints?.length || 0})
          </h4>
          <div className="space-y-2">
            {job.pickupPoints?.map((point, pIndex) => (
              <div key={`${point.id}-${pIndex}`} className="text-xs bg-neutral-950 px-3 py-2.5 rounded-xl border border-neutral-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">{point.name}</span>
                  <span className="text-neutral-500">{point.address} {point.landmark ? `(${point.landmark})` : ''}</span>
                </div>
                <span className="text-emerald-400 font-mono">Max Cap: {point.maxCapacity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 block uppercase font-semibold">Guaranteed Payout</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ₦{payoutAmount.toLocaleString()}
            </span>
          </div>

          <button
            onClick={onAccept}
            disabled={isAccepting}
            className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            {isAccepting ? 'Accepting Trip...' : 'Accept Event Job'}
          </button>
        </div>
      </div>
    </div>
  );
}