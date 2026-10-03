'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/src/lib/api';
import { 
  ArrowLeft, CheckCircle2, XCircle, Loader2, 
  Store, Mail, Phone, MapPin, FileText, 
  ExternalLink, Clock, ShieldCheck, AlertCircle, Utensils
} from 'lucide-react';

export default function AdminMerchantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params?.id as string;

  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMerchant = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/admin/merchants/${merchantId}`);
      setMerchant(res.data?.data || res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load merchant details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (merchantId) fetchMerchant();
  }, [merchantId]);

  const handleUpdateStatus = async (kycStatus: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW') => {
    try {
      setUpdating(true);
      await api.patch(`/admin/merchants/${merchantId}/status`, { kycStatus });
      await fetchMerchant();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Status update failed.');
    } finally {
      setUpdating(false);
    }
  };

  const kycStatus = merchant?.kycStatus || 'PENDING';
  const isVerified = kycStatus === 'APPROVED' || merchant?.isVerified;
  const isRejected = kycStatus === 'REJECTED';

  const documents = useMemo(() => {
    if (!merchant) return [];
    return [
      { label: `${merchant.idType || 'Government ID'} (${merchant.idNumber || 'No ID num'})`, url: merchant.idDocumentUrl },
      { label: 'CAC Certificate', url: merchant.cacCertificateUrl },
      { label: 'Supporting Document', url: merchant.supportingDocUrl },
    ].filter((d) => Boolean(d.url));
  }, [merchant]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-3 text-zinc-500">
        <Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
        <p className="text-xs font-medium">Loading merchant dossier...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-12 bg-white rounded-2xl border border-red-200 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <p className="text-sm font-semibold text-zinc-900">Failed to load record</p>
        <p className="text-xs text-red-600 font-mono bg-red-50 p-2.5 rounded-lg">{error}</p>
        <button
          onClick={fetchMerchant}
          className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="p-16 text-center space-y-3 max-w-md mx-auto">
        <Store className="w-10 h-10 text-zinc-300 mx-auto" />
        <p className="text-sm font-semibold text-zinc-800">Merchant not found</p>
        <Link href="/admin/merchants" className="inline-block text-xs font-semibold text-emerald-600 hover:underline">
          ← Back to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div className="space-y-1">
          <Link 
            href="/admin/merchants" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Merchant Directory
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              {merchant.businessName || 'Unnamed Merchant'}
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isVerified 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                : isRejected 
                ? 'bg-red-50 text-red-700 border border-red-200/60'
                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                isVerified ? 'bg-emerald-500' : isRejected ? 'bg-red-500' : 'bg-amber-500'
              }`} />
              {kycStatus}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">ID: {merchant.id}</p>
        </div>

        <div className="flex items-center gap-2">
          {!isVerified && (
            <button
              disabled={updating}
              onClick={() => handleUpdateStatus('APPROVED')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs transition cursor-pointer shadow-2xs"
            >
              {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Approve KYC
            </button>
          )}

          {!isRejected && (
            <button
              disabled={updating}
              onClick={() => handleUpdateStatus('REJECTED')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 font-semibold text-xs transition cursor-pointer border border-red-200/60"
            >
              <XCircle className="w-4 h-4" />
              Reject KYC
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Owner & Store Metadata */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Account Owner</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-500">Full Name</span>
                <span className="font-semibold text-zinc-900">{merchant.ownerFullName || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-500">Email</span>
                <span className="font-medium text-zinc-900 truncate max-w-[180px]">{merchant.ownerEmail || merchant.user?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-500">Phone</span>
                <span className="font-medium text-zinc-900">{merchant.ownerPhone || merchant.user?.phoneNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-500">Date of Birth</span>
                <span className="font-medium text-zinc-900">{merchant.dateOfBirth || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">User Role / Status</span>
                <span className="font-medium text-zinc-900 capitalize">{merchant.user?.role || 'MERCHANT'} / {merchant.user?.status || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Compliance & KYC Docs</h3>
            {documents.length === 0 ? (
              <p className="text-xs text-zinc-400 py-2">No verification documents attached.</p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/60 transition group text-xs"
                  >
                    <span className="font-medium text-zinc-700 truncate pr-2">{doc.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 shrink-0" />
                  </a>
                ))}
              </div>
            )}
            {merchant.hasCac && (
              <div className="pt-2 border-t border-zinc-100 text-xs">
                <span className="text-zinc-500">CAC Number: </span>
                <strong className="text-zinc-900 font-mono">{merchant.cacNumber || 'Provided'}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Center/Right Column: Store Spec & Operating Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-900">Store Specifications</h3>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                merchant.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${merchant.isOpen ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                {merchant.isOpen ? 'Store Open' : 'Store Closed'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/50 space-y-1">
                <p className="text-zinc-400 font-medium">Cuisine Type / Category</p>
                <p className="text-zinc-900 font-semibold">{merchant.cuisineType || merchant.category || 'General Food'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/50 space-y-1">
                <p className="text-zinc-400 font-medium">Average Prep Time</p>
                <p className="text-zinc-900 font-semibold">{merchant.avgPrepTimeMinutes ? `${merchant.avgPrepTimeMinutes} mins` : 'Not specified'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/50 space-y-1 sm:col-span-2">
                <p className="text-zinc-400 font-medium">Physical Address</p>
                <p className="text-zinc-900 font-medium">{merchant.address || merchant.residentialAddress || 'No address provided'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/50 space-y-1">
                <p className="text-zinc-400 font-medium">Order Fulfillment Modes</p>
                <p className="text-zinc-900 font-medium">
                  {merchant.acceptsSameDay ? 'Same-Day' : ''} {merchant.acceptsScheduled ? '• Scheduled' : ''}
                  {!merchant.acceptsSameDay && !merchant.acceptsScheduled ? 'Standard' : ''}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/50 space-y-1">
                <p className="text-zinc-400 font-medium">Onboarding Progress</p>
                <p className="text-zinc-900 font-medium">
                  Step {merchant.onboardingStep || 6} {merchant.isOnboardingComplete ? '(Complete)' : '(In Progress)'}
                </p>
              </div>
            </div>

            {merchant.description && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-zinc-500 mb-1">Store Description</p>
                <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/50">
                  {merchant.description}
                </p>
              </div>
            )}
          </div>

          {/* Menu / Catalog Preview */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-zinc-400" />
                Featured Menu Catalog (Top 5)
              </h3>
              <span className="text-xs text-zinc-400 font-medium">
                {merchant.menuItems?.length || 0} loaded
              </span>
            </div>

            {!merchant.menuItems || merchant.menuItems.length === 0 ? (
              <div className="py-10 text-center text-xs text-zinc-400">
                No active menu items listed by this partner.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {merchant.menuItems.map((item: any) => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-zinc-200/70 flex items-center justify-between gap-3 bg-zinc-50/40">
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-900 text-xs truncate">{item.name}</p>
                      <p className="text-xs text-emerald-700 font-bold mt-0.5">
                        ₦{Number(item.price || 0).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      item.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-200/70 text-zinc-600'
                    }`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}