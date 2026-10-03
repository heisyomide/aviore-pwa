'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MessageSquare, ShieldCheck, Calendar, MapPin, Bus } from 'lucide-react';

import jobService from './services/shipment.service';

import PickupCard from './components/PickupCard';
import DestinationCard from './components/DestinationCard';
import DeliveryTimeline from './components/DeliveryTimeline';
import DeliveryFooter from './components/DeliveryFooter';
import StatusBadge from './components/StatusBadge';
import VerificationModal from './components/VerificationModal';

const LiveMap = dynamic(
  () => import('./components/LiveMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[420px] bg-neutral-900 flex flex-col items-center justify-center text-neutral-400 font-mono text-xs gap-2 border-b border-neutral-800">
        <span className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-ping" />
        Initializing Geolocation Satellite Hardware Engine...
      </div>
    )
  }
);

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = (params?.shipmentId as string) || (params?.id as string);

  const [jobData, setJobData] = useState<{ jobType: string; job: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVerification, setShowVerification] = useState(false);

  async function loadJob() {
    try {
      const response = await jobService.getJobDetails(jobId);
      setJobData(response);
    } catch (err) {
      console.error('[LOAD_JOB_ERROR]', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const handleOpenChat = () => {
    router.push(`/rider/dashboard/jobs/${jobId}/chat`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white font-sans">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-sm text-neutral-400">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (!jobData || !jobData.job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white gap-4">
        <p className="text-neutral-400">Job not found.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-white rounded-lg transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { jobType, job } = jobData;

  // --- RENDER EVENT TRANSIT VIEW FOR BUS/VAN DRIVERS ---
  if (jobType === 'EVENT_TRANSIT') {
    return (
      <div className="min-h-screen bg-neutral-950 text-white relative pb-24 px-4 sm:px-8 py-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/50">
              Event Transit Trip
            </span>
            <h1 className="text-2xl font-bold mt-2">{job.event?.title || 'Scheduled Event Trip'}</h1>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Event Details Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-neutral-300">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-neutral-400">Departure Time</p>
              <p className="text-sm font-medium">{new Date(job.departureTime).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-neutral-300">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-neutral-400">Route</p>
              <p className="text-sm font-medium">{job.route?.originCity} ➔ {job.route?.destination}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-neutral-300">
            <Bus className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-neutral-400">Trip Payout</p>
              <p className="text-base font-bold text-emerald-400">₦{job.payout?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <button
          onClick={async () => {
            await jobService.acceptJob(job.tripId);
            loadJob();
          }}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-xl text-white transition shadow-lg"
        >
          Accept Event Trip
        </button>
      </div>
    );
  }

  // --- RENDER STANDARD PARCEL DELIVERY VIEW FOR BIKES/CARS ---
  return (
    <>
      <div className="min-h-screen bg-neutral-950 text-white relative pb-24">
        <LiveMap shipment={job} />
        <div className="max-w-6xl mx-auto px-5 py-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{job.trackingCode}</h1>
                <StatusBadge status={job.status} />
              </div>
              <p className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                <span>{job.packageCategory}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Direct Comm Channel
                </span>
              </p>
            </div>

            <button
              onClick={handleOpenChat}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Chat</span>
            </button>
          </div>

          <DeliveryTimeline shipment={job} />
          <PickupCard shipment={job} />
          <DestinationCard shipment={job} />
        </div>

        <DeliveryFooter
          shipment={job}
          loading={loading}
          onArrivedPickup={async () => {
            await jobService.arrivedAtPickup(job.id);
            loadJob();
          }}
          onPickup={async () => {
            await jobService.pickup(job.id);
            loadJob();
          }}
          onArrivedDestination={async () => {
            await jobService.arrivedAtDestination(job.id);
            loadJob();
          }}
          onComplete={() => {
            setShowVerification(true);
          }}
        />
      </div>

      <VerificationModal
        open={showVerification}
        loading={false}
        onClose={() => setShowVerification(false)}
        onSubmit={async (pin) => {
          await jobService.complete(job.id, pin);
          setShowVerification(false);
          loadJob();
        }}
      />
    </>
  );
}