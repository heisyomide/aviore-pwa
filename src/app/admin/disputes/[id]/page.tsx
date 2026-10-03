'use client';

import React, { use, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Clock, 
  User, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Lock
} from 'lucide-react';
import { api } from '../../../../lib/api'; // Adjust relative path to your lib/api file if needed

interface DisputeLog {
  id: string;
  actorId: string;
  action: string;
  note?: string;
  createdAt: string;
}

interface DisputeDetail {
  id: string;
  jobId: string;
  reporterId: string;
  reportedByRole: 'CUSTOMER' | 'RIDER';
  reason: string;
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  resolution?: string;
  adminNotes?: string;
  resolvedById?: string;
  resolvedAt?: string;
  createdAt: string;
  logs: DisputeLog[];
}

export default function ForensicDisputePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [dispute, setDispute] = useState<DisputeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State for Resolution
  const [resolveOutcome, setResolveOutcome] = useState('REFUND_CUSTOMER');
  const [adminNotes, setAdminNotes] = useState('');
  const [resolveModalOpen, setResolveModalOpen] = useState(false);

  const fetchDisputeDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/disputes/${id}`);
      setDispute(res.data || res);
    } catch (err: unknown) {
      console.error('Error fetching dispute detail:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDisputeDetail();
  }, [fetchDisputeDetail]);

  // Mark status as UNDER_REVIEW
  const handleMarkUnderReview = async () => {
    try {
      setSubmitting(true);
      await api.patch(`/disputes/${id}/status`, { status: 'UNDER_REVIEW' });
      await fetchDisputeDetail();
    } catch (err: unknown) {
      console.error('Error updating status:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Resolve or Reject Dispute
  const handleResolveDispute = async (status: 'RESOLVED' | 'REJECTED') => {
    if (!adminNotes.trim()) {
      alert('Please provide official admin notes explaining the decision.');
      return;
    }

    try {
      setSubmitting(true);
      await api.patch(`/disputes/${id}/resolve`, {
        status,
        resolution: status === 'RESOLVED' ? resolveOutcome : 'NO_ACTION',
        adminNotes,
      });

      setResolveModalOpen(false);
      await fetchDisputeDetail();
    } catch (err: unknown) {
      console.error('Error resolving dispute:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
        <p className="text-xs font-bold uppercase">Loading forensic case data...</p>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm font-bold text-neutral-500">Dispute record not found.</p>
        <Link href="/admin/disputes" className="text-xs font-black uppercase underline">
          Back to disputes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Navigation */}
      <Link
        href="/admin/disputes"
        className="inline-flex items-center gap-2 text-xs font-black uppercase text-neutral-500 hover:text-neutral-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Disputes
      </Link>

      {/* Header Banner */}
      <div className="bg-neutral-900 text-white p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-neutral-400">CASE #{dispute.id}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                dispute.status === 'RESOLVED'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : dispute.status === 'REJECTED'
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {dispute.status.replace('_', ' ')}
            </span>
          </div>
          <h1 className="text-xl font-black uppercase tracking-tight mt-1">{dispute.reason}</h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-mono">Associated Job ID: #{dispute.jobId}</p>
        </div>

        {/* Action Button for Status update */}
        {dispute.status === 'OPEN' && (
          <button
            onClick={handleMarkUnderReview}
            disabled={submitting}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase rounded-xl transition flex items-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
            Mark Under Review
          </button>
        )}
      </div>

      {/* Forensic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-1">
          <p className="text-[10px] uppercase font-black text-neutral-400 flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> Reporter Role
          </p>
          <p className="text-base font-black text-neutral-900">{dispute.reportedByRole}</p>
          <p className="text-[10px] font-mono text-neutral-400 truncate">ID: {dispute.reporterId}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-1">
          <p className="text-[10px] uppercase font-black text-neutral-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Created Date
          </p>
          <p className="text-base font-black text-neutral-900">
            {new Date(dispute.createdAt).toLocaleDateString()}
          </p>
          <p className="text-[10px] text-neutral-400">
            {new Date(dispute.createdAt).toLocaleTimeString()}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-1">
          <p className="text-[10px] uppercase font-black text-neutral-400 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Resolution Status
          </p>
          <p className="text-base font-black text-neutral-900">
            {dispute.resolution || 'Pending Resolution'}
          </p>
          {dispute.resolvedAt && (
            <p className="text-[10px] text-neutral-400">
              Resolved on {new Date(dispute.resolvedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Dispute Details & Statement */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Reported Issue Description
        </h3>
        <p className="text-sm font-medium text-neutral-800 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
          "{dispute.description}"
        </p>
      </div>

      {/* Official Admin Notes (If Resolved) */}
      {dispute.adminNotes && (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl space-y-2">
          <h3 className="text-xs font-black uppercase text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Official Admin Resolution Notes
          </h3>
          <p className="text-xs font-medium text-emerald-900 leading-relaxed">{dispute.adminNotes}</p>
        </div>
      )}

      {/* Audit Timeline / Logs */}
      <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">
          Forensic Audit Log
        </h3>
        <div className="space-y-3">
          {dispute.logs?.map((log) => (
            <div key={log.id} className="bg-white p-3.5 rounded-xl border border-neutral-200 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-neutral-900 uppercase">{log.action}</p>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                {log.note && <p className="text-xs text-neutral-600 mt-0.5">{log.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Decision Bar */}
      {dispute.status !== 'RESOLVED' && dispute.status !== 'REJECTED' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-neutral-200 shadow-2xl flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-neutral-900">Ready to take action?</p>
            <p className="text-[10px] text-neutral-500">Resolve with outcome or reject claim.</p>
          </div>
          <button
            onClick={() => setResolveModalOpen(true)}
            className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-black text-xs uppercase rounded-xl transition shadow-md"
          >
            Resolve Case
          </button>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {resolveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black uppercase text-neutral-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-600" /> Resolve Case #{dispute.id.slice(0, 8)}
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-neutral-500">
                Resolution Outcome
              </label>
              <select
                value={resolveOutcome}
                onChange={(e) => setResolveOutcome(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-bold text-neutral-900 outline-none"
              >
                <option value="REFUND_CUSTOMER">Refund Customer</option>
                <option value="CREDIT_RIDER">Credit Rider Wallet</option>
                <option value="PARTIAL_REFUND">Partial Refund</option>
                <option value="NO_ACTION">No Action Required</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-neutral-500">
                Official Admin Notes (Required)
              </label>
              <textarea
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Detail the investigation findings and reason for decision..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-medium text-neutral-900 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleResolveDispute('REJECTED')}
                disabled={submitting}
                className="py-3 bg-rose-50 text-rose-700 hover:bg-rose-100 font-black text-xs uppercase rounded-xl transition border border-rose-200"
              >
                Reject Claim
              </button>
              <button
                onClick={() => handleResolveDispute('RESOLVED')}
                disabled={submitting}
                className="py-3 bg-emerald-600 text-white hover:bg-emerald-500 font-black text-xs uppercase rounded-xl transition"
              >
                Approve & Resolve
              </button>
            </div>

            <button
              onClick={() => setResolveModalOpen(false)}
              className="w-full text-center text-xs font-bold uppercase text-neutral-400 hover:text-neutral-600 pt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}