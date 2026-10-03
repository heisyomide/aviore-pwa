"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
  RefreshCw,
  PhoneCall,
  MessageCircle
} from "lucide-react";
import {api} from "@/src/lib/api";

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
  reportedByRole: string;
  reason: string;
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  resolution?: string;
  adminNotes?: string;
  createdAt: string;
  logs?: DisputeLog[];
}

export default function MerchantSupportPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form inputs
  const [reason, setReason] = useState('ITEM_MISSING');
  const [jobId, setJobId] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const faqs = [
    { q: "How do daily wallet settlements work?", a: "Daily earnings are automatically processed and transferred to your verified bank account every morning by 6:00 AM." },
    { q: "What should I do if a rider is delayed?", a: "You can contact the assigned AviorèGo dispatch rider directly from the active order tracking panel or call support." },
    { q: "How do I temporarily close my store?", a: "Use the main 'Open/Close' toggle switch on your dashboard home screen to instantly update your status on the marketplace." }
  ];

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
      setError('Unable to load your support tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedDispute]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

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
        reportedByRole: 'MERCHANT',
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
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/merchant/dashboard/more" className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-black tracking-tight text-neutral-950">Help & Support</h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Plus size={14} /> Open Ticket
        </button>
      </div>

      {/* Support Action Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-600 text-white p-5 rounded-3xl shadow-sm space-y-2 cursor-pointer hover:bg-amber-700 transition-colors">
          <MessageCircle size={22} />
          <h3 className="text-xs font-black">Live Chat Support</h3>
          <p className="text-[11px] text-amber-100">Chat with an AviorèGo merchant success agent.</p>
        </div>

        <div className="bg-white border border-neutral-200/80 p-5 rounded-3xl shadow-sm space-y-2 cursor-pointer hover:border-amber-600 transition-all">
          <PhoneCall size={22} className="text-neutral-950" />
          <h3 className="text-xs font-black text-neutral-950">Merchant Helpline</h3>
          <p className="text-[11px] text-neutral-500">Call +234 800 AVIORGO (24/7)</p>
        </div>
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
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
            <div className="space-y-1">
              <button
                onClick={() => setSelectedDispute(null)}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 mb-2"
              >
                ← Back to support tickets
              </button>
              <h2 className="text-base font-bold text-neutral-950">Reason: {selectedDispute.reason.replace(/_/g, ' ')}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                <span className="font-mono">Ticket #{selectedDispute.id.slice(0, 8)}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-neutral-700 font-semibold">
                  <Package className="w-3.5 h-3.5 text-amber-600" /> Order #{selectedDispute.jobId}
                </span>
              </div>
            </div>
            <div>{renderStatusBadge(selectedDispute.status)}</div>
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-200/60 rounded-2xl space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Issue Description</span>
            <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">{selectedDispute.description}</p>
          </div>

          {selectedDispute.resolution && (
            <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Support Team Resolution</span>
              <p className="text-xs text-amber-950 font-medium">{selectedDispute.resolution}</p>
              {selectedDispute.adminNotes && (
                <p className="text-[11px] text-amber-700/80 mt-1 italic">Note: {selectedDispute.adminNotes}</p>
              )}
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Activity Updates</h3>
            <div className="space-y-2">
              {selectedDispute.logs && selectedDispute.logs.length > 0 ? (
                selectedDispute.logs.map((log) => (
                  <div key={log.id} className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-700 font-bold">[{log.action}]</span>
                      <span className="text-neutral-600">{log.note}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-400 italic">No activity updates yet.</p>
              )}
            </div>
          </div>

          {isLocked && (
            <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-2xl flex items-center justify-center gap-2 text-neutral-500 text-xs font-semibold text-center">
              <Lock className="w-4 h-4 shrink-0 text-neutral-400" />
              <span>This ticket has been resolved and closed.</span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" /> Your Support Tickets
            </h2>
            <span className="text-xs text-neutral-400 font-medium font-mono">{disputes.length} total</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs font-medium text-neutral-400 animate-pulse flex flex-col items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-neutral-400" />
              Loading your support history...
            </div>
          ) : disputes.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-100">
                <Headset className="w-6 h-6" />
              </div>
              <p className="text-xs text-neutral-700 font-semibold">No active support tickets</p>
              <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">Have an issue with a delivery order or settlement? Open a new ticket.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {disputes.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDispute(d)}
                  className="p-4 hover:bg-neutral-50/80 transition cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-neutral-950 group-hover:text-amber-600 transition">
                        {d.reason.replace(/_/g, ' ')}
                      </h3>
                      <span className="text-[10px] bg-neutral-100 text-neutral-600 border border-neutral-200 px-2 py-0.5 rounded font-mono font-bold">
                        Order #{d.jobId.slice(0, 8)}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-mono">
                      Submitted on {new Date(d.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>{renderStatusBadge(d.status)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAQs */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Frequently Asked Questions</h2>
        
        <div className="space-y-4 divide-y divide-neutral-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="pt-4 first:pt-0 space-y-1">
              <h3 className="text-xs font-bold text-neutral-950">{faq.q}</h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity"
          onClick={() => setShowCreateModal(false)}
        >
          <div 
            className="bg-white border border-neutral-200 w-full max-w-lg rounded-3xl p-6 space-y-5 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <Headset className="w-5 h-5 text-amber-600" />
                <h2 className="text-sm font-black text-neutral-950">Open Support Ticket</h2>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 transition rounded-lg hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Order / Shipment ID</label>
                <input
                  type="text"
                  required
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  placeholder="e.g. shipment_id_123"
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs p-3 rounded-xl outline-none focus:border-amber-600 focus:bg-white font-mono transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Issue Category</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs p-3 rounded-xl outline-none focus:border-amber-600 focus:bg-white transition"
                >
                  <option value="ITEM_MISSING">Item Missing / Damaged</option>
                  <option value="WRONG_DELIVERY">Incorrect Delivery Address</option>
                  <option value="PAYMENT_ISSUE">Payment / Settlement Issue</option>
                  <option value="RIDER_BEHAVIOR">Unprofessional Rider Conduct</option>
                  <option value="OTHER">Other Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what happened so our merchant success team can assist..."
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs p-3 rounded-xl outline-none focus:border-amber-600 focus:bg-white transition resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-200 disabled:text-neutral-400 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}