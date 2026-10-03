// page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import JobCard from './components/JobsCard';
import JobDetailsModal from './components/JobDetailsModal';
import EmptyJobs from './components/EmptyJobs';
import LoadingJobs from './components/LoadingJobs';
import jobsService from './services/jobs.service';
import type { AvailableJob } from './types';

export default function JobsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<AvailableJob[]>([]);
  const [jobType, setJobType] = useState<string>('PARCEL_DELIVERY');
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<AvailableJob | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [timer, setTimer] = useState(15);

  // Default to true so management/boss testing accounts or any environment never falsely lock out
  const [isEventEligible, setIsEventEligible] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const response: any = await jobsService.getAvailableJobs();
      
      const items = Array.isArray(response) 
        ? response 
        : response?.jobs || [];
        
      setJobs(items);
      if (response?.jobType) {
        setJobType(response.jobType);
      }

      // Check account roles or vehicle compatibility if explicitly provided by backend response,
      // while preserving a safe fallback (true) for high-level accounts or smooth testing.
      const userRole = response?.role || response?.user?.role || response?.accountType;
      const isBossOrAdmin = ['ADMIN', 'SUPER_ADMIN', 'BOSS', 'FLEET_MANAGER', 'OPERATOR'].includes(
        String(userRole || '').toUpperCase()
      );

      const vType = response?.vehicleType || response?.activeVehicle?.type;
      const eligibleByVehicle = vType === 'BUS' || vType === 'VAN' || vType === 'CAR';

      if (userRole) {
        setIsEventEligible(isBossOrAdmin || eligibleByVehicle || response?.isEventEligible === true);
      }
    } catch (error) {
      console.error('Failed to load available jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!modalOpen) return;

    setTimer(15);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setModalOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [modalOpen]);

  async function acceptJob() {
    if (!selectedJob) return;

    const jobId = selectedJob.id || selectedJob.tripId;
    if (!jobId) return;

    try {
      setAccepting(true);
      await jobsService.acceptJob(jobId);
      router.push(`/rider/dashboard/jobs/${jobId}`);
    } catch (error) {
      console.error('Failed to accept job:', error);
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Available Jobs</h1>
          <p className="text-neutral-500 mt-2">
            {jobType === 'EVENT_TRANSIT' ? 'Nearby event bus transit assignments.' : 'Nearby parcel delivery requests.'}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-neutral-800 text-emerald-400 font-mono text-xs font-bold uppercase">
          {jobType.replaceAll('_', ' ')}
        </span>
      </div>

      {/* 🚀 Event Transit Hub Navigation Banner with Role/Vehicle Override */}
      <div className="mb-8 p-6 rounded-2xl bg-linear-to-r from-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🚌</span>
            <h2 className="text-xl font-bold text-white">Event Transit & Charters</h2>
            {!isEventEligible && (
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Locked
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            {isEventEligible 
              ? 'Management/Eligible profile detected. Access scheduled long-distance event routes and group trip allocations.'
              : 'Event transit jobs are exclusively available for Bus, Van, or Car driver profiles.'}
          </p>
        </div>

        <button
          onClick={() => {
            if (!isEventEligible) {
              alert('Access Denied: Your profile requires an eligible vehicle or management clearance.');
              return;
            }
            router.push('/rider/dashboard/jobs/events');
          }}
          disabled={!isEventEligible}
          className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
            isEventEligible
              ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 cursor-pointer shadow-lg shadow-emerald-500/20'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50'
          }`}
        >
          {isEventEligible ? 'View Event Schedules ➔' : '🔒 Locked'}
        </button>
      </div>

      {loading ? (
        <LoadingJobs />
      ) : jobs.length === 0 ? (
        <EmptyJobs />
      ) : (
        <div className="space-y-5">
          {jobs.map((job) => {
            const uniqueKey = job.id || job.tripId || Math.random().toString();
            return (
              <JobCard
                key={uniqueKey}
                job={job}
                jobType={jobType}
                onClick={() => {
                  setSelectedJob(job);
                  setModalOpen(true);
                }}
              />
            );
          })}
        </div>
      )}

      <JobDetailsModal
        open={modalOpen}
        job={selectedJob}
        jobType={jobType}
        timer={timer}
        accepting={accepting}
        onAccept={acceptJob}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}