'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Headset, 
  Plus, 
  Lock, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  X,
  FileText,
  Package,
  RefreshCw
} from 'lucide-react';
import { api } from '../../../../lib/api';

interface DisputeLog {
  id: string;
  actorId: string;
  action: string;
  note: string;
  createdAt: string;
}

interface Dispute {
  id: string;
  jobId: string;
  reporterId: string;
  reportedByRole: 'RIDER' | 'CUSTOMER';
  reason: string;
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  resolution?: string;
  adminNotes?: string;
  createdAt: string;
  logs?: DisputeLog[];
}

export default function CustomerSupportPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form inputs matching NestJS CreateDisputeDto
  const [reason, setReason] = useState('ITEM_MISSING');
  const [jobId, setJobId] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch all user disputes
  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/disputes/my-disputes');
      
      const data: Dispute[] = Array.isArray(response.data) 
        ? response.data 
        : Array.isArray(response) 
          ? response 
          : [];

      setDisputes(data);

      if (selectedDispute) {
        const updated = data.find((d) => d.id === selectedDispute.id);
        if (updated) setSelectedDispute(updated);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch disputes:', err);
      setError('Unable to load your support requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedDispute]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  // Handle modal escape key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCreateModal) {
        setShowCreateModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCreateModal]);

  const resetForm = () => {
    setReason('ITEM_MISSING');
    setJobId('');
    setDescription('');
  };

  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId.trim() || !description.trim()) {
      alert('Order ID and Description are required.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/disputes', {
        jobId: jobId.trim(),
        reportedByRole: 'CUSTOMER',
        reason,
        description,
      });

      setShowCreateModal(false);
      resetForm();
      await fetchDisputes();
    } catch (err: unknown) {
      console.error('Error submitting issue:', err);
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = axiosErr?.response?.data?.message || axiosErr?.message || 'Could not submit your request.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusBadge = (status: Dispute['status']) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending Review
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5 text-blue-500" /> Under Admin Review
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-full text-xs font-semibold">
            <X className="w-3.5 h-3.5 text-rose-500" /> Closed / Rejected
          </span>
        );
    }
  };

  const isLocked = selectedDispute?.status === 'RESOLVED' || selectedDispute?.status === 'REJECTED';

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/profile" 
              className="p-3 bg-slate-100 hover:bg-slate-200/80 text-slate-600 rounded-2xl transition border border-slate-200"
              aria-label="Back to Orders"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Headset className="w-5 h-5 text-emerald-600" />
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Customer Support Center</h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Need help with an order? Track reported issues or open a new request.</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs tracking-wide rounded-2xl transition shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Open New Support Request
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
            <button 
              onClick={fetchDisputes}
              className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg transition font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* MAIN BODY VIEW */}
        {selectedDispute ? (
          /* SINGLE DISPUTE VIEW */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Thread Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedDispute(null)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 mb-2"
                >
                  ← Back to all support tickets
                </button>
                <h2 className="text-lg font-bold text-slate-900">Reason: {selectedDispute.reason.replace(/_/g, ' ')}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="font-mono">Ticket #{selectedDispute.id.slice(0, 8)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Package className="w-3.5 h-3.5 text-emerald-600" /> Order #{selectedDispute.jobId}
                  </span>
                </div>
              </div>

              <div>{renderStatusBadge(selectedDispute.status)}</div>
            </div>

            {/* Description Details */}
            <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Issue Description</span>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedDispute.description}</p>
            </div>

            {/* Admin Resolution Section */}
            {selectedDispute.resolution && (
              <div className="p-5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Support Team Resolution</span>
                <p className="text-sm text-emerald-950 font-medium">{selectedDispute.resolution}</p>
                {selectedDispute.adminNotes && (
                  <p className="text-xs text-emerald-700/80 mt-1 italic">Note: {selectedDispute.adminNotes}</p>
                )}
              </div>
            )}

            {/* Activity Feed */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity Updates</h3>
              <div className="space-y-2">
                {selectedDispute.logs && selectedDispute.logs.length > 0 ? (
                  selectedDispute.logs.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-700 font-bold">[{log.action}]</span>
                        <span className="text-slate-600">{log.note}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No activity updates yet.</p>
                )}
              </div>
            </div>

            {isLocked && (
              <div className="p-4 bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold text-center">
                <Lock className="w-4 h-4 shrink-0 text-slate-400" />
                <span>This issue report has been resolved and closed by support administrators.</span>
              </div>
            )}
          </div>
        ) : (
          /* DISPUTES LIST VIEW */
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" /> Your Support Tickets
              </h2>
              <span className="text-xs text-slate-400 font-medium">{disputes.length} total</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs font-medium text-slate-400 animate-pulse flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
                Loading your support history...
              </div>
            ) : disputes.length === 0 ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
                  <Headset className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-700 font-semibold">No active support requests</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">If you experienced an issue with missing items, delivery delays, or payment, file a request below.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition inline-flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Open Support Request
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {disputes.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDispute(d)}
                    className="p-5 hover:bg-slate-50/80 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition">
                          {d.reason.replace(/_/g, ' ')}
                        </h3>
                        <span className="text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono font-medium">
                          Order #{d.jobId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Submitted on {new Date(d.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      {renderStatusBadge(d.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CREATE DISPUTE MODAL */}
        {showCreateModal && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity"
            onClick={() => setShowCreateModal(false)}
          >
            <div 
              className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Headset className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">Report an Order Issue</h2>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition rounded-lg hover:bg-slate-100"
                  aria-label="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDispute} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Order / Job ID</label>
                  <input
                    type="text"
                    required
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    placeholder="e.g. clx123456789"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs p-3 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">What went wrong?</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs p-3 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition"
                  >
                    <option value="ITEM_MISSING">Item Missing / Damaged</option>
                    <option value="WRONG_DELIVERY">Incorrect Delivery Address</option>
                    <option value="PAYMENT_ISSUE">Payment / Refund Issue</option>
                    <option value="RIDER_BEHAVIOR">Unprofessional Rider Conduct</option>
                    <option value="OTHER">Other Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please explain what happened so our support team can assist you..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs p-3 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-semibold tracking-wide transition shadow-sm"
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}