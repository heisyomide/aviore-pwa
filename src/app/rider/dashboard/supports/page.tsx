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
import { api } from '@/src/lib/api';

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

export default function SupportPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form inputs matching NestJS CreateDisputeDto
  const [reason, setReason] = useState('ITEM_MISSING');
  const [jobId, setJobId] = useState('');
  const [description, setDescription] = useState('');
  const [reportedByRole, setReportedByRole] = useState<'CUSTOMER' | 'RIDER'>('CUSTOMER');
  const [submitting, setSubmitting] = useState(false);

  // Fetch all user disputes
  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/disputes/my-disputes');
      
      // Ensure array fallback
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
      setError('Unable to load dispute records. Please try again.');
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

  // Reset Form
  const resetForm = () => {
    setReason('ITEM_MISSING');
    setJobId('');
    setDescription('');
    setReportedByRole('CUSTOMER');
  };

  // Submit new dispute
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
        reportedByRole,
        reason,
        description,
      });

      setShowCreateModal(false);
      resetForm();
      await fetchDisputes();
    } catch (err: unknown) {
      console.error('Error creating dispute:', err);
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = axiosErr?.response?.data?.message || axiosErr?.message || 'Could not submit dispute.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Status Badge Mapper
  const renderStatusBadge = (status: Dispute['status']) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" /> Under Admin Review
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
            <X className="w-3.5 h-3.5" /> Rejected
          </span>
        );
    }
  };

  const isLocked = selectedDispute?.status === 'RESOLVED' || selectedDispute?.status === 'REJECTED';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/80 border border-neutral-800 p-6 rounded-3xl backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link 
              href="/rider/dashboard/profile" 
              className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-2xl transition border border-neutral-700"
              aria-label="Back to Profile"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Headset className="w-5 h-5 text-emerald-400" />
                <h1 className="text-xl font-black uppercase tracking-tight text-white">Support & Disputes Desk</h1>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Submit order disputes or request administrator intervention</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> File New Dispute
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button 
              onClick={fetchDisputes}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg transition font-mono flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* MAIN BODY VIEW */}
        {selectedDispute ? (
          /* SINGLE DISPUTE VIEW */
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-xl">
            {/* Thread Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedDispute(null)}
                  className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 mb-2"
                >
                  ← Back to all disputes
                </button>
                <h2 className="text-lg font-black text-white">Reason: {selectedDispute.reason.replace(/_/g, ' ')}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-mono">
                  <span>ID: #{selectedDispute.id}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-sans font-semibold">
                    <Package className="w-3.5 h-3.5" /> Order #{selectedDispute.jobId}
                  </span>
                </div>
              </div>

              <div>{renderStatusBadge(selectedDispute.status)}</div>
            </div>

            {/* Description Details */}
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Dispute Description</span>
              <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">{selectedDispute.description}</p>
            </div>

            {/* Admin Resolution Section */}
            {selectedDispute.resolution && (
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Official Resolution</span>
                <p className="text-sm text-emerald-100">{selectedDispute.resolution}</p>
                {selectedDispute.adminNotes && (
                  <p className="text-xs text-neutral-400 mt-1 italic">Note: {selectedDispute.adminNotes}</p>
                )}
              </div>
            )}

            {/* Logs Activity Feed */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Activity & Audit Logs</h3>
              <div className="space-y-2">
                {selectedDispute.logs && selectedDispute.logs.length > 0 ? (
                  selectedDispute.logs.map((log) => (
                    <div key={log.id} className="p-3 bg-neutral-950/50 border border-neutral-800/80 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-emerald-400 font-bold mr-2">[{log.action}]</span>
                        <span className="text-neutral-300">{log.note}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-600 italic">No audit logs recorded for this dispute yet.</p>
                )}
              </div>
            </div>

            {isLocked && (
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center gap-3 text-neutral-400 text-xs font-bold text-center">
                <Lock className="w-4 h-4 shrink-0 text-neutral-500" />
                <span>This dispute has been concluded and closed by platform administrators.</span>
              </div>
            )}
          </div>
        ) : (
          /* DISPUTES LIST VIEW */
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
              <h2 className="text-xs font-black uppercase text-neutral-400 tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> Dispute Records
              </h2>
              <span className="text-xs text-neutral-500 font-mono">{disputes.length} total</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs font-mono text-neutral-500 animate-pulse flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-neutral-600" />
                Fetching dispute records...
              </div>
            ) : disputes.length === 0 ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-12 h-12 bg-neutral-800 text-neutral-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Headset className="w-6 h-6" />
                </div>
                <p className="text-xs text-neutral-400 font-medium">No active disputes found.</p>
                <p className="text-[11px] text-neutral-600">If you have an issue with an order or payout, file a dispute above.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Open Dispute
                </button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {disputes.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDispute(d)}
                    className="p-5 hover:bg-neutral-800/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                          {d.reason.replace(/_/g, ' ')}
                        </h3>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                          Order #{d.jobId}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-mono">
                        Role: {d.reportedByRole} • Created {new Date(d.createdAt).toLocaleDateString()}
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setShowCreateModal(false)}
          >
            <div 
              className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-3xl p-6 space-y-5 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2">
                  <Headset className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-black uppercase text-white">File an Order Dispute</h2>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-neutral-400 hover:text-white transition rounded-lg hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDispute} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Order / Job ID</label>
                    <input
                      type="text"
                      required
                      value={jobId}
                      onChange={(e) => setJobId(e.target.value)}
                      placeholder="e.g. clx123456789"
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs p-3 rounded-xl outline-none focus:border-emerald-500 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Your Role</label>
                    <select
                      value={reportedByRole}
                      onChange={(e) => setReportedByRole(e.target.value as 'CUSTOMER' | 'RIDER')}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs p-3 rounded-xl outline-none focus:border-emerald-500 text-white"
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="RIDER">Rider</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Dispute Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs p-3 rounded-xl outline-none focus:border-emerald-500 text-white"
                  >
                    <option value="ITEM_MISSING">Item Missing / Damaged</option>
                    <option value="WRONG_DELIVERY">Incorrect Delivery Address</option>
                    <option value="PAYMENT_ISSUE">Payment / Refund Issue</option>
                    <option value="RIDER_BEHAVIOR">Unprofessional Conduct</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Detailed Description</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide full details of what occurred..."
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs p-3 rounded-xl outline-none focus:border-emerald-500 text-white resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                  >
                    {submitting ? 'Submitting...' : 'Submit Dispute'}
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