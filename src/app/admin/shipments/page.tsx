'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/src/lib/api';

export interface ShipmentRecord {
  id: string;
  trackingCode: string;
  status: 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  rider?: {
    user: {
      firstName: string;
      lastName: string;
    };
  } | null;
}

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Picked Up', value: 'PICKED_UP' },
  { label: 'In Transit', value: 'IN_TRANSIT' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' }
];

export default function ShipmentsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<ShipmentRecord[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLiveShipments() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: String(page),
          limit: '20',
        });

        if (activeTab !== 'all') {
          params.append('status', activeTab);
        }
        if (searchQuery.trim() !== '') {
          params.append('search', searchQuery.trim());
        }

        const response = await api.get<{ records: ShipmentRecord[]; meta: { total: number; page: number; limit: number } }>(
          `/admin/shipments?${params.toString()}`
        );

        setRecords(response.data.records || []);
        setMeta(response.data.meta || { total: 0, page: 1, limit: 20 });
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to retrieve shipments manifest.');
      } finally {
        setIsLoading(false);
      }
    }

    const delayDebounceFn = setTimeout(() => {
      fetchLiveShipments();
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(delayDebounceFn);
  }, [activeTab, page, searchQuery]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'PENDING': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'ACCEPTED': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'PICKED_UP': return 'bg-cyan-50 text-cyan-600 border border-cyan-100';
      case 'DELIVERED': return 'bg-green-50 text-green-600 border border-green-100';
      case 'CANCELLED': return 'bg-red-50 text-red-600 border border-red-100';
      default: return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-neutral-950 uppercase tracking-tight">Shipments</h2>
          <p className="text-xs text-neutral-500 font-medium">Core logistics operations and package management</p>
        </div>
      </div>

      {/* Control Workspace: Search & Ingestion Stream Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setPage(1); }}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === tab.value 
                  ? 'bg-neutral-950 text-white shadow-xs' 
                  : 'bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-950 hover:text-neutral-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search ID, Tracking Code, Customer..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-950 text-neutral-950"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-mono text-xs font-bold">
          ⚠️ Network Stream Error: {error}
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center font-mono text-[10px] text-neutral-500 tracking-widest uppercase animate-pulse">
            Ingesting Server Manifest Data...
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="p-4 text-[10px] font-black uppercase text-neutral-400">ID / Code</th>
                <th className="p-4 text-[10px] font-black uppercase text-neutral-400">Sender</th>
                <th className="p-4 text-[10px] font-black uppercase text-neutral-400">Rider Node</th>
                <th className="p-4 text-[10px] font-black uppercase text-neutral-400">Price</th>
                <th className="p-4 text-[10px] font-black uppercase text-neutral-400">Status</th>
                <th className="p-4 text-[10px] font-black uppercase text-neutral-400">Created At</th>
                <th className="p-4 text-[10px] font-black uppercase text-neutral-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {records.map((w) => (
                <tr key={w.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-black font-mono text-neutral-950">#{w.id.slice(-6).toUpperCase()}</p>
                    <p className="text-[9px] font-mono text-neutral-400 tracking-tight">{w.trackingCode}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-xs font-bold text-neutral-950">
                      {w.customer ? `${w.customer.firstName} ${w.customer.lastName}` : 'Anonymous User'}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-sans">{w.customer?.email}</p>
                  </td>
                  <td className="p-4 text-xs font-bold text-neutral-600">
                    {w.rider?.user ? (
                      <span className="text-neutral-900">🏍️ {w.rider.user.firstName} {w.rider.user.lastName}</span>
                    ) : (
                      <span className="text-neutral-400 italic text-[10px]">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4 text-xs font-black font-mono text-neutral-950">
                    ₦{Number(w.totalPrice).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${getStatusStyle(w.status)}`}>
                      {w.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-[10px] text-neutral-400 font-mono">
                    {new Date(w.createdAt).toLocaleDateString('en-NG', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/shipments/${w.id}`}
                      className="text-neutral-950 font-black text-[10px] uppercase underline hover:text-green-600 transition"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              
              {!isLoading && records.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400 font-medium italic text-xs">
                    No active shipment records match target parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-neutral-200 flex items-center justify-between text-[11px] font-bold text-neutral-500 bg-neutral-50">
          <span>Total Rows Logged: {meta.total} units</span>
          <div className="flex gap-2">
            <button 
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white disabled:opacity-40 text-[10px] text-neutral-950 font-black uppercase tracking-wide hover:bg-neutral-50 transition"
            >
              ◀ Prev
            </button>
            <button 
              type="button"
              disabled={page * meta.limit >= meta.total || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white disabled:opacity-40 text-[10px] text-neutral-950 font-black uppercase tracking-wide hover:bg-neutral-50 transition"
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}