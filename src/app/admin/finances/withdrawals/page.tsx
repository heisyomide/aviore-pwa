'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../../../lib/api';

export default function WithdrawalRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Track which request ID is currently being processed
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function fetchPendingWithdrawals(signal?: AbortSignal) {
    try {
      setLoading(true);
      const res = await api.get('/admin/finances/withdrawals', { signal });
      if (res.data) {
        setRequests(res.data);
      }
    } catch (err: any) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        console.error('Fatal retrieval tracking payload crash:', err);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchPendingWithdrawals(controller.signal);

    return () => controller.abort();
  }, []);

  async function updatePayoutState(id: string, approve: boolean) {
    const actionPath = approve ? 'approve' : 'reject';
    try {
      setProcessingId(id);
      await api.patch(`/admin/finances/withdrawals/${id}/${actionPath}`);
      // Instantly slice updated entries out of memory array state
      setRequests((prev) => prev.filter(r => r.id !== id));
    } catch (err: any) {
      console.error('Failed updating payout state:', err);
      alert(err?.response?.data?.message || 'Action could not complete successfully.');
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <Link href="/admin/finances" className="text-[10px] text-neutral-400 font-black uppercase hover:text-neutral-950 tracking-wider block mb-1">
            ← Back to Finances Overview
          </Link>
          <h2 className="text-xl font-black uppercase tracking-tight text-neutral-950">Withdrawal Requests</h2>
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide">Approve pending payouts.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-xs text-center font-mono p-12 text-neutral-400 uppercase tracking-widest animate-pulse">
          Loading verification ledger rows...
        </div>
      ) : requests.length === 0 ? (
        <div className="text-xs text-center font-mono p-12 text-neutral-400 border border-dashed rounded-3xl border-neutral-200 uppercase tracking-wide bg-white shadow-sm">
          Clean Queue! No pending withdrawal allocations require attention.
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => {
            const isProcessing = processingId === req.id;

            return (
              <div key={req.id} className="bg-white p-6 rounded-3xl border border-neutral-200 flex justify-between items-center shadow-sm hover:border-neutral-300 transition-all">
                <div>
                  <p className="font-black text-neutral-950 text-base">{req.user}</p>
                  <p className="text-sm font-black text-red-600 font-mono mt-0.5">{req.amount}</p>
                  <p className="text-[9px] text-neutral-400 font-mono uppercase tracking-wider mt-1">Submitted: {req.date}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => updatePayoutState(req.id, true)}
                    disabled={isProcessing}
                    className="px-4 py-2.5 bg-neutral-950 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-neutral-800 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => updatePayoutState(req.id, false)}
                    disabled={isProcessing}
                    className="px-4 py-2.5 bg-neutral-100 text-neutral-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-neutral-200 border border-neutral-200 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}