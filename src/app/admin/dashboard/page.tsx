'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '../../../lib/api'; // Interceptor automatically handles Authorization header and aviore_token

// ============================================================================
// TYPE ARCHITECTURE (Synchronized Exactly with NestJS Controller & Service Types)
// ============================================================================
export type AdminTab = 'OVERVIEW' | 'SHIPMENTS' | 'RIDER_KYC' | 'PRICING_ENGINE';

export interface DashboardMetrics {
  activeDispatches: number;
  unassignedPipeline: number;
  netFeesToday: number;
  escrowVaultSecure: number;
}

export interface ShipmentRecord {
  id: string;
  trackingCode: string;
  status: 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  weight: number;
  totalPrice: number;
  platformShare: number;
  pickupAddress: string;
  dropoffAddress: string;
  recipientPhone: string;
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

export interface RiderApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string; // NIN
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

export default function AdminControlTower() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Navigation & Filtering States
  const [currentTab, setCurrentTab] = useState<AdminTab>('OVERVIEW');
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });

  // Core Dynamic Data Storage linked directly to NestJS endpoints
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [pendingKYC, setPendingKYC] = useState<RiderApplication[]>([]);
  
  // Pricing Engine Workspace State Matrix
  const [pricingParams, setPricingParams] = useState<Record<string, string>>({
    BASE_FARE: '500',
    PER_KM_CHARGE: '150',
    PLATFORM_SHARE_PERCENTAGE: '15',
    SURGE_MULTIPLIER: '1.0'
  });

  // Evaluation processing state
  const [selectedApplication, setSelectedApplication] = useState<RiderApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Infrastructure Status Controllers
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded Admin identity configuration for state mutations
  const CURRENT_ADMIN_ID = "admin_01J2YXW891ZPM"; 

  // ============================================================================
  // EFFECT 1: REAL-TIME OPERATIONS GATEWAY (SOCKET.IO)
  // ============================================================================
  useEffect(() => {
    const socketInstance = io(`${BACKEND_URL}/admin-operations`, {
      transports: ['websocket'],
      query: { role: 'ADMIN' }
    });

    socketInstance.on('connect', () => setIsSocketConnected(true));
    socketInstance.on('disconnect', () => setIsSocketConnected(false));

    socketInstance.on('metrics_update', (updatedMetrics: DashboardMetrics) => {
      setMetrics(updatedMetrics);
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, [BACKEND_URL]);

  // ============================================================================
  // EFFECT 2: DATA FETCHING FOR ACTIVE TAB (USING AXIOS `api` INSTANCE)
  // ============================================================================
  useEffect(() => {
    const controller = new AbortController();

    async function fetchTabData() {
      try {
        setIsLoading(true);
        setError(null);

        if (currentTab === 'OVERVIEW') {
          const { data } = await api.get('/admin/dashboard/overview', { signal: controller.signal });
          setMetrics(data);
        } else if (currentTab === 'SHIPMENTS') {
          let url = `/admin/shipments?page=${page}&limit=20`;
          if (shipmentStatusFilter !== 'all') url += `&status=${shipmentStatusFilter}`;
          if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

          const { data } = await api.get(url, { signal: controller.signal });
          setShipments(data.records || []);
          setMeta(data.meta || { total: 0, page: 1, limit: 20 });
        } else if (currentTab === 'RIDER_KYC') {
          const { data } = await api.get(`/admin/riders/pending-kyc?page=${page}&limit=20`, { signal: controller.signal });
          setPendingKYC(data || []);
        } else if (currentTab === 'PRICING_ENGINE') {
          const { data } = await api.get('/admin/pricing-engine/current', { signal: controller.signal });
          setPricingParams((prev) => ({ ...prev, ...data }));
        }
      } catch (err: any) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.response?.data?.message || err.message || 'Fatal Gateway Interface Disconnect.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchTabData();
    return () => controller.abort();
  }, [currentTab, shipmentStatusFilter, page, searchQuery]);

  // ============================================================================
  // MUTATION CLIENT ACTION: EXECUTE TARGET KYC APPRAISAL EVALUATION
  // ============================================================================
  const handleEvaluateKYC = async (applicationId: string, approve: boolean) => {
    try {
      setIsSubmitting(true);
      await api.patch(`/admin/riders/kyc/${applicationId}/evaluate`, {
        approve: approve,
        adminId: CURRENT_ADMIN_ID,
        reason: approve ? undefined : rejectionReason || 'Submitted tracking credentials could not be verified.'
      });

      setPendingKYC((prev) => prev.filter((app) => app.id !== applicationId));
      setSelectedApplication(null);
      setRejectionReason('');
      alert(`Node Verification Status Update: Success.`);
    } catch (err: any) {
      alert(`Critical KYC Override Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // MUTATION CLIENT ACTION: SAVE CONFIG MATRIX (PRICING ENGINE)
  // ============================================================================
  const handleSavePricingConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { data } = await api.post('/admin/pricing-engine/save', pricingParams);

      alert(data.message || 'Pricing configurations updated successfully.');
      
      const { data: updatedMetrics } = await api.get('/admin/dashboard/overview');
      setMetrics(updatedMetrics);
    } catch (err: any) {
      alert(`Pricing Engine Mutation Failure: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateConfigKey = (key: string, val: string) => {
    setPricingParams(prev => ({ ...prev, [key]: val }));
  };

  if (isLoading && shipments.length === 0 && pendingKYC.length === 0 && !metrics) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50 text-neutral-900 font-mono text-xs">
        <div className="animate-pulse tracking-widest text-center">
          <p className="font-black">POLLING ACTIVE NESTJS CONTROLLER ENVIRONMENT MATRIX...</p>
          <p className="text-[10px] text-neutral-400 mt-1">Hydrating operational metrics from backend parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-neutral-900 antialiased font-mono text-xs">
      
      {/* ================= MODAL: PENDING KYC APPRAISAL CONSOLE ================= */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="text-sm font-black tracking-tight text-neutral-950">KYC Assessment Node Panel</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Evaluate entry key: {selectedApplication.id}</p>
              </div>
              <button type="button" onClick={() => setSelectedApplication(null)} className="text-neutral-400 hover:text-neutral-950 font-bold text-sm">✕</button>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border space-y-1.5 text-[11px]">
              <p><span className="text-neutral-400 font-bold">Applicant Name:</span> {selectedApplication.firstName} {selectedApplication.lastName}</p>
              <p><span className="text-neutral-400 font-bold">Verified Email:</span> {selectedApplication.email}</p>
              <p><span className="text-neutral-400 font-bold">NIN Code:</span> <span className="underline font-bold text-neutral-950">{selectedApplication.idNumber}</span></p>
              <p><span className="text-neutral-400 font-bold">Settlement Entity:</span> {selectedApplication.bankName} ({selectedApplication.bankCode})</p>
              <p><span className="text-neutral-400 font-bold">Bank Identity:</span> {selectedApplication.accountNumber} — {selectedApplication.accountName}</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Rejection Exception Matrix Reason</label>
              <input 
                type="text"
                placeholder="Required only for application rejection overrides..." 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-[11px] outline-none font-mono focus:border-neutral-950 text-neutral-950"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleEvaluateKYC(selectedApplication.id, false)}
                className="border border-red-200 hover:bg-red-50 text-red-600 disabled:opacity-40 font-bold p-2.5 rounded-xl uppercase tracking-wide text-center"
              >
                Deny & Eject
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleEvaluateKYC(selectedApplication.id, true)}
                className="bg-neutral-950 hover:bg-neutral-900 text-white disabled:opacity-40 font-bold p-2.5 rounded-xl uppercase tracking-wide text-center shadow-sm"
              >
                Approve & Map Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Application Command Frame Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-neutral-200 pb-5 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black uppercase tracking-tight text-neutral-950">Aviago Control Engine</h1>
            <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] tracking-widest border transition-colors duration-300 ${
              isSocketConnected ? 'bg-neutral-950 text-green-400 border-neutral-800 animate-pulse' : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}>
              ● {isSocketConnected ? 'GATEWAY CACHE STREAM ACTIVE' : 'SOCKET FALLBACK'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1">Live administrative terminal synchronized with backend cache architectures.</p>
        </div>

        <div className="flex items-center bg-neutral-100 border p-1 rounded-xl font-bold text-[11px] overflow-x-auto max-w-full">
          {([
            { id: 'OVERVIEW', label: 'Overview Metrics' },
            { id: 'SHIPMENTS', label: 'Shipments Pipeline' },
            { id: 'RIDER_KYC', label: 'Rider Onboarding' },
            { id: 'PRICING_ENGINE', label: 'Pricing Config Engine' }
          ]).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setCurrentTab(tab.id as AdminTab); setPage(1); }}
              className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                currentTab === tab.id ? 'bg-neutral-950 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 font-bold rounded-xl text-[11px]">
          ⚠️ Engine Interface Notice: {error}
        </div>
      )}

      {/* ================= TAB COMPONENT A: DYNAMIC ENGINE OVERVIEW ================= */}
      {currentTab === 'OVERVIEW' && metrics && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Active Dispatches', val: metrics.activeDispatches, color: 'text-neutral-950' },
              { title: 'Unassigned Pipeline Stack', val: metrics.unassignedPipeline, color: metrics.unassignedPipeline > 0 ? 'text-amber-500 animate-pulse font-black' : 'text-neutral-400' },
              { title: 'Net Fees Captured (Today)', val: `₦${metrics.netFeesToday.toLocaleString()}`, color: 'text-green-600' },
              { title: 'Escrow Vault Secure Balance', val: `₦${metrics.escrowVaultSecure.toLocaleString()}`, color: 'text-blue-600' },
            ].map((metric, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <p className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">{metric.title}</p>
                <p className={`text-xl font-black mt-2 tracking-tight ${metric.color}`}>{metric.val}</p>
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-100" />
              </div>
            ))}
          </div>

          <div className="bg-neutral-50 rounded-2xl p-6 border text-center space-y-2 max-w-2xl mx-auto">
            <p className="font-black text-neutral-950 text-xs uppercase tracking-widest">Active System State Ingestion Operational</p>
            <p className="text-neutral-500 text-[11px] font-sans">
              Operational vectors auto-hydrate from backend core processes every 60 seconds or recalculate instantly when dynamic actions change database configuration models.
            </p>
          </div>
        </div>
      )}

      {/* ================= TAB COMPONENT B: SHIPMENTS PAGINATED PIPELINE ================= */}
      {currentTab === 'SHIPMENTS' && (
        <div className="border border-neutral-200 rounded-xl bg-white shadow-sm overflow-hidden animate-in fade-in duration-150">
          
          <div className="p-4 border-b border-neutral-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Search internal ID, trackingCode, or recipientPhone..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full bg-neutral-50 border rounded-xl p-2.5 outline-none text-[11px] font-mono focus:border-neutral-950 text-neutral-950"
              />
            </div>

            <div className="flex bg-neutral-50 border p-0.5 rounded-lg text-[10px] font-bold self-start lg:self-auto overflow-x-auto max-w-full">
              {['all', 'PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => { setShipmentStatusFilter(status); setPage(1); }}
                  className={`px-3 py-1.5 rounded-md transition-all uppercase whitespace-nowrap ${
                    shipmentStatusFilter === status ? 'bg-neutral-950 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-250">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-[10px] text-neutral-400 uppercase font-black tracking-wider">
                  <th className="py-3 px-4">Internal Shipment Key</th>
                  <th className="py-3 px-4">Tracking Reference Label</th>
                  <th className="py-3 px-4">Ordering Customer Account</th>
                  <th className="py-3 px-4">Trajectory Path Nodes</th>
                  <th className="py-3 px-4">Assigned Transporter Node</th>
                  <th className="py-3 px-4 text-right">Escrow Fee Share Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-[11px]">
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-black text-neutral-950">
                      <p className="tracking-tight">{shipment.id}</p>
                      <span className={`inline-block text-[8px] uppercase font-black px-1 rounded mt-0.5 tracking-wide ${
                        shipment.status === 'DELIVERED' ? 'text-green-600 bg-green-50' :
                        shipment.status === 'PENDING' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
                      }`}>{shipment.status}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold tracking-wider text-neutral-700">{shipment.trackingCode}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-neutral-900">{shipment.customer?.firstName} {shipment.customer?.lastName}</p>
                      <p className="text-[10px] text-neutral-400 font-sans">{shipment.customer?.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 font-sans max-w-xs truncate">
                      <p className="font-mono text-[11px]"><span className="text-neutral-400 font-bold">A:</span> {shipment.pickupAddress}</p>
                      <p className="font-mono text-[11px] mt-0.5"><span className="text-neutral-400 font-bold">B:</span> {shipment.dropoffAddress}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {shipment.rider?.user ? (
                        <span className="font-bold text-neutral-800">
                          👤 {shipment.rider.user.firstName} {shipment.rider.user.lastName}
                        </span>
                      ) : (
                        <span className="text-neutral-400 italic text-[10px]">No Assigned Transporter Profile</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <p className="font-black text-neutral-950">₦{shipment.totalPrice.toLocaleString()}</p>
                      <p className="text-[9px] text-green-600">Share: ₦{shipment.platformShare.toLocaleString()}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-neutral-100 flex items-center justify-between font-bold text-neutral-500">
            <span className="text-[10px]">Global Assets Counted: {meta.total} units</span>
            <div className="flex gap-2">
              <button 
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border rounded-lg bg-white disabled:opacity-40 text-[10px] text-neutral-950"
              >
                ◀ Previous Page
              </button>
              <button 
                type="button"
                disabled={page * meta.limit >= meta.total}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border rounded-lg bg-white disabled:opacity-40 text-[10px] text-neutral-950"
              >
                Next Page ▶
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB COMPONENT C: RIDER APPLICATION REVIEW PROCESSOR ================= */}
      {currentTab === 'RIDER_KYC' && (
        <div className="border border-neutral-200 rounded-xl bg-white shadow-sm overflow-hidden animate-in fade-in duration-150">
          <div className="p-4 border-b border-neutral-100">
            <h3 className="font-black text-neutral-950 uppercase tracking-wider text-[11px]">Segregated Transporter Onboarding Application Stack</h3>
            <p className="text-[11px] text-neutral-400 font-sans">Awaiting admin assessment execution inputs.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-200">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-[10px] text-neutral-400 uppercase font-black tracking-wider">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Applicant Profile Full Name</th>
                  <th className="py-3 px-4">Identity / NIN Document Code</th>
                  <th className="py-3 px-4">Submitted At timestamp</th>
                  <th className="py-3 px-4 text-right">Action Interface Console</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-[11px]">
                {pendingKYC.map((app) => (
                  <tr key={app.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-black text-neutral-950 tracking-tight">{app.id}</td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900">{app.firstName} {app.lastName}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-600 underline">{app.idNumber}</td>
                    <td className="py-3.5 px-4 text-neutral-400 font-sans">{new Date(app.submittedAt).toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedApplication(app)}
                        className="bg-neutral-950 hover:bg-neutral-900 text-white font-bold px-3 py-2 rounded-xl text-[10px] uppercase tracking-wide transition-all shadow-sm"
                      >
                        Inspect Credentials
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingKYC.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-400 font-medium italic">
                      No matching onboarding application records requiring verification.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB COMPONENT D: PRICING CONFIG ENGINE MATRIX ================= */}
      {currentTab === 'PRICING_ENGINE' && (
        <div className="max-w-2xl mx-auto border border-neutral-200 rounded-xl bg-white shadow-sm overflow-hidden animate-in fade-in duration-150">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50">
            <h3 className="font-black text-neutral-950 uppercase tracking-wider text-[11px]">System Global Configuration Matrix</h3>
            <p className="text-[11px] text-neutral-400 font-sans">Updates here trigger transaction mutations inside database rows and recalculate targets.</p>
          </div>

          <form onSubmit={handleSavePricingConfig} className="p-6 space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1">Base Currency Fare (₦)</label>
                <input 
                  type="number" 
                  value={pricingParams.BASE_FARE || ''}
                  onChange={(e) => updateConfigKey('BASE_FARE', e.target.value)}
                  className="w-full bg-neutral-50 border rounded-xl p-2.5 outline-none font-mono text-neutral-950 focus:border-neutral-950" 
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1">Charge Rate Per Kilometer (₦)</label>
                <input 
                  type="number" 
                  value={pricingParams.PER_KM_CHARGE || ''}
                  onChange={(e) => updateConfigKey('PER_KM_CHARGE', e.target.value)}
                  className="w-full bg-neutral-50 border rounded-xl p-2.5 outline-none font-mono text-neutral-950 focus:border-neutral-950" 
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1">Platform Cut Split Percentage (%)</label>
                <input 
                  type="number" 
                  value={pricingParams.PLATFORM_SHARE_PERCENTAGE || ''}
                  onChange={(e) => updateConfigKey('PLATFORM_SHARE_PERCENTAGE', e.target.value)}
                  className="w-full bg-neutral-50 border rounded-xl p-2.5 outline-none font-mono text-neutral-950 focus:border-neutral-950" 
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1">Dynamic Surge Multiplier Variable</label>
                <input 
                  type="text" 
                  value={pricingParams.SURGE_MULTIPLIER || ''}
                  onChange={(e) => updateConfigKey('SURGE_MULTIPLIER', e.target.value)}
                  className="w-full bg-neutral-50 border rounded-xl p-2.5 outline-none font-mono text-neutral-950 focus:border-neutral-950" 
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-neutral-950 hover:bg-neutral-900 text-white disabled:opacity-40 font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider text-center shadow-sm"
              >
                {isSubmitting ? 'Mutating Database Matrix...' : 'Save Configuration Parameters'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}