'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, Upload, Loader2 } from 'lucide-react';

interface Props {
  jobId: string;
  userRole: 'RIDER' | 'CUSTOMER';
  isOpen: boolean;
  onClose: () => void;
  onSubmitDisputeApi: (payload: any) => Promise<any>;
}

export default function DisputeModal({
  jobId,
  userRole,
  isOpen,
  onClose,
  onSubmitDisputeApi,
}: Props) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmitDisputeApi({
        jobId,
        reportedByRole: userRole,
        reason,
        description,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit dispute:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600">
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              ✓
            </div>
            <h3 className="font-bold text-lg text-zinc-900">Dispute Submitted</h3>
            <p className="text-xs text-zinc-500">
              Our support team has been notified and will review job logs and contact you shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-bold text-base text-zinc-900">Report Issue / Open Dispute</h3>
            </div>

            <p className="text-xs text-zinc-500">
              Reporting an issue alerts admin to mediate between rider and customer.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Reason</label>
              <select
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 outline-none focus:border-emerald-600"
              >
                <option value="">Select a reason...</option>
                {userRole === 'CUSTOMER' ? (
                  <>
                    <option value="RIDER_UNREACHABLE">Rider Unreachable</option>
                    <option value="PACKAGE_DAMAGED">Package Damaged</option>
                    <option value="WRONG_DELIVERY_LOCATION">Delivered to Wrong Location</option>
                    <option value="EXCESSIVE_DELAY">Excessive Delay</option>
                  </>
                ) : (
                  <>
                    <option value="CUSTOMER_UNREACHABLE">Customer Unreachable</option>
                    <option value="WRONG_ADDRESS_PROVIDED">Wrong Address Provided</option>
                    <option value="PAYMENT_DISPUTE">Payment / Cash Collection Issue</option>
                    <option value="UNSAFE_LOCATION">Unsafe Delivery Area</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Details</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 outline-none focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Dispute to Admin'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}