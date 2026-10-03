'use client';

import { useState } from 'react';
import { RiderEarningsModal, DailySummaryData } from './RiderEarningsModal';

interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => Promise<DailySummaryData | void>;
}

export default function VerificationModal({
  open,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // State to control the earnings modal independently
  const [summaryData, setSummaryData] = useState<DailySummaryData | null>(null);

  const handleSubmit = async () => {
    if (!pin.trim()) return;
    try {
      setError('');
      const summary = await onSubmit(pin);

      if (summary) {
        // Step A: Save the summary data
        setSummaryData(summary);
        // Step B: Close the PIN input modal
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid PIN. Please ask the customer again.');
    }
  };

  return (
    <>
      {/* 1. PIN INPUT MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-md p-6 text-white shadow-2xl">
            <h2 className="text-xl font-bold mb-1">Delivery Verification</h2>
            <p className="text-neutral-400 text-sm mb-6">
              Ask the customer for their 4-digit verification PIN to complete drop-off.
            </p>

            <input
              type="text"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 4-digit PIN"
              className="w-full rounded-xl bg-neutral-950 border border-neutral-700 px-4 py-3.5 text-center font-mono text-2xl tracking-widest text-white outline-none focus:border-emerald-500"
            />

            {error && <p className="text-xs text-rose-400 font-semibold mt-2">{error}</p>}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 font-medium text-sm text-neutral-300"
              >
                Cancel
              </button>

              <button
                disabled={loading || !pin}
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 font-bold text-sm text-white transition-all"
              >
                {loading ? 'Verifying...' : 'Complete Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. RIDER EARNINGS CELEBRATION MODAL */}
      {summaryData && (
        <RiderEarningsModal
          isOpen={!!summaryData}
          onClose={() => {
            setSummaryData(null);
            window.location.href = '/rider/dashboard';
          }}
          onAcceptNextJob={() => {
            setSummaryData(null);
            window.location.href = '/rider/dashboard/available-jobs';
          }}
          summary={summaryData}
        />
      )}
    </>
  );
}