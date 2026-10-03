'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/src/lib/api';
import { 
  Store, CheckCircle2, XCircle, Eye, Loader2, 
  Search, Phone, Mail, FilterX, Building2, RefreshCw 
} from 'lucide-react';

interface MerchantUser {
  id?: string;
  email?: string;
  phoneNumber?: string;
  status?: string;
}

interface Merchant {
  id: string;
  businessName?: string;
  ownerFullName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  supportPhone?: string;
  cuisineType?: string;
  category?: string;
  isOpen?: boolean;
  kycStatus?: 'APPROVED' | 'REJECTED' | 'PENDING' | string;
  isVerified?: boolean;
  user?: MerchantUser;
}

type StatusFilter = 'ALL' | 'VERIFIED' | 'PENDING' | 'REJECTED';

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const fetchMerchants = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await api.get('/admin/merchants');
      const payload = res.data;
      const rawData = Array.isArray(payload) ? payload : payload?.data || [];
      setMerchants(rawData);
    } catch (err) {
      console.error('Failed to fetch merchants:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const handleStatusChange = async (id: string, kycStatus: 'APPROVED' | 'REJECTED') => {
    try {
      setUpdatingId(id);
      await api.patch(`/admin/merchants/${id}/status`, { kycStatus });
      setMerchants((prev) =>
        prev.map((m) => (m.id === id ? { ...m, kycStatus, isVerified: kycStatus === 'APPROVED' } : m))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update merchant status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getComplianceState = useCallback((m: Merchant) => {
    const isApproved = m.kycStatus === 'APPROVED';
    const isRejected = m.kycStatus === 'REJECTED';
    const isPending = !isApproved && !isRejected;
    return { isApproved, isRejected, isPending };
  }, []);

  const stats = useMemo(() => {
    return merchants.reduce(
      (acc, m) => {
        const { isApproved, isRejected } = getComplianceState(m);
        acc.total++;
        if (isApproved) acc.verified++;
        else if (isRejected) acc.rejected++;
        else acc.pending++;
        return acc;
      },
      { total: 0, verified: 0, pending: 0, rejected: 0 }
    );
  }, [merchants, getComplianceState]);

  const filteredMerchants = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return merchants.filter((m) => {
      const matchesSearch =
        !q ||
        m.businessName?.toLowerCase().includes(q) ||
        m.ownerFullName?.toLowerCase().includes(q) ||
        m.ownerEmail?.toLowerCase().includes(q) ||
        m.user?.email?.toLowerCase().includes(q) ||
        m.cuisineType?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      const { isApproved, isRejected, isPending } = getComplianceState(m);
      if (statusFilter === 'VERIFIED') return isApproved;
      if (statusFilter === 'PENDING') return isPending;
      if (statusFilter === 'REJECTED') return isRejected;
      return true;
    });
  }, [merchants, searchQuery, statusFilter, getComplianceState]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Merchant Directory</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Manage partner stores, verify compliance docs, and monitor operational states.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchMerchants(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200/80 text-xs font-medium text-zinc-600 shadow-2xs transition disabled:opacity-50 cursor-pointer"
            title="Refresh directory"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-zinc-200/80 text-xs font-medium text-zinc-600 shadow-2xs">
            <span>Total Partners:</span>
            <strong className="text-zinc-900">{stats.total}</strong>
          </div>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'All Merchants', val: stats.total, filter: 'ALL', color: 'text-zinc-900' },
          { label: 'Verified', val: stats.verified, filter: 'VERIFIED', color: 'text-emerald-700' },
          { label: 'Pending Review', val: stats.pending, filter: 'PENDING', color: 'text-amber-700' },
          { label: 'Rejected', val: stats.rejected, filter: 'REJECTED', color: 'text-red-700' },
        ].map((item) => (
          <button
            key={item.filter}
            onClick={() => setStatusFilter(item.filter as StatusFilter)}
            className={`text-left p-4 rounded-xl border transition cursor-pointer ${
              statusFilter === item.filter
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                : 'bg-white hover:bg-zinc-50 border-zinc-200/80 text-zinc-700'
            }`}
          >
            <p className={`text-xs font-medium ${statusFilter === item.filter ? 'text-zinc-300' : 'text-zinc-500'}`}>
              {item.label}
            </p>
            <p className={`text-2xl font-bold mt-1 ${statusFilter === item.filter ? 'text-white' : item.color}`}>
              {item.val}
            </p>
          </button>
        ))}
      </div>

      {/* Search & Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-zinc-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by store name, owner name, cuisine, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50/80 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-600 transition"
          />
        </div>

        {(searchQuery || statusFilter !== 'ALL') && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition cursor-pointer"
          >
            <FilterX className="w-3.5 h-3.5" /> Clear filters
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3 text-zinc-400">
            <Loader2 className="animate-spin h-6 w-6 text-emerald-600" />
            <p className="text-xs font-medium">Loading merchant directory...</p>
          </div>
        ) : filteredMerchants.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Building2 className="w-10 h-10 text-zinc-300 mx-auto" />
            <p className="text-sm font-semibold text-zinc-800">No matching merchants</p>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              No partner records matched your active search query or status filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/90 border-b border-zinc-200/80 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                  <th className="py-3.5 px-5">Partner Store</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Cuisine / Type</th>
                  <th className="py-3.5 px-4">Store State</th>
                  <th className="py-3.5 px-4">Compliance Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {filteredMerchants.map((m) => {
                  const { isApproved, isRejected } = getComplianceState(m);
                  const isBusy = updatingId === m.id;
                  const emailVal = m.user?.email || m.ownerEmail || 'No email';
                  const phoneVal = m.ownerPhone || m.supportPhone || m.user?.phoneNumber || 'No phone';
                  const cuisineVal = m.cuisineType || m.category || 'General';
                  const initialChar = m.businessName ? m.businessName.charAt(0).toUpperCase() : null;

                  return (
                    <tr key={m.id} className="hover:bg-zinc-50/70 transition group">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50/80 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shrink-0 font-bold text-sm shadow-2xs">
                            {initialChar || <Store className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-900 leading-snug truncate max-w-[200px]">
                              {m.businessName || 'Unnamed Store'}
                            </p>
                            <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                              {m.ownerFullName || 'No owner name'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-700">
                            <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate max-w-[170px]" title={emailVal}>
                              {emailVal}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate max-w-[170px]" title={phoneVal}>{phoneVal}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 font-medium text-xs">
                          {cuisineVal}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          m.isOpen ? 'text-emerald-700' : 'text-zinc-500'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${m.isOpen ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                          {m.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : isRejected
                            ? 'bg-red-50 text-red-700 border border-red-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isApproved ? 'bg-emerald-500' : isRejected ? 'bg-red-500' : 'bg-amber-500'
                          }`} />
                          {isApproved ? 'Verified' : isRejected ? 'Rejected' : 'Pending'}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/merchants/${m.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium text-xs transition"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>

                          {!isApproved && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleStatusChange(m.id, 'APPROVED')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs transition cursor-pointer shadow-2xs"
                            >
                              {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              Approve
                            </button>
                          )}

                          {!isRejected && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleStatusChange(m.id, 'REJECTED')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 font-medium text-xs transition cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}