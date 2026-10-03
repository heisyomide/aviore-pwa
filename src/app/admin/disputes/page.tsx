'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  ChevronRight, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { api } from '../../../lib/api';

interface DisputeItem {
  id: string;
  jobId: string;
  reporterId: string;
  reportedByRole: 'CUSTOMER' | 'RIDER';
  reason: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
}

export default function DisputesListPage() {
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('OPEN');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadDisputes = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};

      const res = await api.get('/disputes', { params, signal });

      if (res.data) {
        setDisputes(res.data);
      }
    } catch (err: any) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        console.error('Failed to sync disputes matrix:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    const controller = new AbortController();
    loadDisputes(controller.signal);

    return () => controller.abort();
  }, [loadDisputes]);

  const filteredDisputes = disputes.filter(
    (d) =>
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: DisputeItem['status']) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="w-3 h-3" /> Open
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-200">
            <AlertTriangle className="w-3 h-3" /> Under Review
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-50 text-rose-600 border border-rose-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900">
              Dispute Resolution Center
            </h1>
          </div>
          <p className="text-xs font-semibold text-neutral-500 mt-1">
            Review, investigate, and mediate active platform disputes between riders and customers.
          </p>
        </div>

        <button
          onClick={() => loadDisputes()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'ALL'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase whitespace-nowrap transition ${
                statusFilter === tab
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dispute, job ID, reason..."
            className="w-full bg-neutral-50 pl-9 pr-4 py-2 text-xs font-medium border border-neutral-200 rounded-xl outline-none focus:border-neutral-900 transition"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-black uppercase text-neutral-400 tracking-wider">
              <tr>
                <th className="p-4">Dispute ID</th>
                <th className="p-4">Job / Order</th>
                <th className="p-4">Reported By</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs font-mono text-neutral-400 uppercase tracking-widest animate-pulse">
                    Streaming disputes matrix logs...
                  </td>
                </tr>
              ) : filteredDisputes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    No disputes found matching filter.
                  </td>
                </tr>
              ) : (
                filteredDisputes.map((d) => (
                  <tr key={d.id} className="text-xs hover:bg-neutral-50/80 transition">
                    <td className="p-4 font-mono font-bold text-neutral-900">{d.id.slice(0, 8)}...</td>
                    <td className="p-4 font-mono text-neutral-600">#{d.jobId.slice(-6)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        d.reportedByRole === 'RIDER' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {d.reportedByRole}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-neutral-800">{d.reason}</td>
                    <td className="p-4">{getStatusBadge(d.status)}</td>
                    <td className="p-4 text-neutral-500 text-[11px]">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/disputes/${d.id}`}
                        className="inline-flex items-center gap-1 font-black text-[11px] uppercase text-neutral-900 hover:text-emerald-600 transition"
                      >
                        Investigate <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}