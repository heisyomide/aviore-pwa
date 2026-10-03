'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api'; // Custom Axios client with auto-injected 'aviore_token'

interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalance: string;
  rating: number;
  joined: string;
  status: string;
  shipments: Array<{
    id: string;
    trackingCode: string;
    status: string;
    amount: string;
    createdAt: string;
  }>;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;

    const controller = new AbortController();

    async function fetchCustomerProfile() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        // Uses Axios `api` instance to attach JWT token
        const response = await api.get(`/admin/customers/${customerId}`, {
          signal: controller.signal,
        });

        setCustomer(response.data);
      } catch (err: any) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          console.error('Fatal failure downloading customer matrix timeline:', err);
          const serverError = err.response?.data?.message || err.message;
          setErrorMessage(serverError || 'Network connection failed while parsing user record ledger.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomerProfile();

    return () => controller.abort();
  }, [customerId]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-mono tracking-widest text-neutral-400 uppercase animate-pulse">
        Decompressing user profile data matrix...
      </div>
    );
  }

  if (errorMessage || !customer) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-mono uppercase tracking-wide">
          ⚠️ Operational Fault: {errorMessage || 'Requested profile key does not exist inside active storage registers.'}
        </div>
        <Link href="/admin/customers" className="inline-block text-xs font-black uppercase text-neutral-950 underline">
          ← Return to customers ledger
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-2">
        <Link href="/admin/customers" className="text-[10px] font-black uppercase tracking-wider text-neutral-400 hover:text-neutral-950 transition-colors">
          ← Back to Customers
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">{customer.name}</h2>
            <p className="text-xs font-mono text-neutral-400">ID reference: {customer.id}</p>
          </div>
          <span className="text-[10px] font-mono bg-neutral-950 text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
            {customer.status || 'ACTIVE'}
          </span>
        </div>
      </div>

      {/* Profile Overview HUD Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 p-4 rounded-2xl shadow-sm">
          <div className="text-[10px] font-black uppercase text-neutral-400 mb-1">Wallet Ledger</div>
          <div className="text-xl font-mono font-bold text-emerald-600">{customer.walletBalance}</div>
        </div>

        <div className="bg-white border border-neutral-200 p-4 rounded-2xl shadow-sm">
          <div className="text-[10px] font-black uppercase text-neutral-400 mb-1">Quality Metric Rating</div>
          <div className="text-xl font-bold text-amber-500">★ {Number(customer.rating || 0).toFixed(1)}</div>
        </div>

        <div className="bg-white border border-neutral-200 p-4 rounded-2xl shadow-sm">
          <div className="text-[10px] font-black uppercase text-neutral-400 mb-1">Total Pipeline Orders</div>
          <div className="text-xl font-mono font-bold text-neutral-900">{customer.shipments?.length ?? 0}</div>
        </div>

        <div className="bg-white border border-neutral-200 p-4 rounded-2xl shadow-sm">
          <div className="text-[10px] font-black uppercase text-neutral-400 mb-1">Registration Timeline</div>
          <div className="text-xl font-bold text-neutral-900">{customer.joined}</div>
        </div>
      </div>

      {/* Detailed Contact Breakdown */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2">
          Account Registry Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-[10px] font-bold text-neutral-400 uppercase">Registered Email Address</span>
            <span className="font-medium text-neutral-800 break-all">{customer.email || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-neutral-400 uppercase">Comms Mobile Contact</span>
            <span className="font-mono font-medium text-neutral-800">{customer.phone || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Shipment Manifest History Ledger */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Shipment Timeline Activity</h3>
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 text-[10px] font-black uppercase text-neutral-400">
              <tr>
                <th className="p-4">Tracking Code</th>
                <th className="p-4">Execution Status</th>
                <th className="p-4">Invoice Cost</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customer.shipments?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs font-mono tracking-widest text-neutral-400 uppercase">
                    No order fulfillment workflows created for this profile
                  </td>
                </tr>
              ) : (
                customer.shipments?.map((s) => (
                  <tr key={s.id} className="hover:bg-neutral-50 text-sm transition-colors duration-150">
                    <td className="p-4 font-mono font-bold text-neutral-900">{s.trackingCode}</td>
                    <td className="p-4">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        s.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border border-green-200' :
                        s.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-neutral-600">{s.amount}</td>
                    <td className="p-4 text-neutral-500 font-mono text-xs">
                      {new Date(s.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/admin/shipments?search=${s.trackingCode}`}
                        className="text-neutral-950 font-black text-[10px] uppercase underline tracking-wider"
                      >
                        Inspect Track
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