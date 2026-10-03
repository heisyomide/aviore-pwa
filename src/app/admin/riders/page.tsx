'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/src/lib/api';
interface RiderItem {
  id: string;
  name: string;
  orders: number;
  status: string;
  verified: boolean;
}

export default function RidersPage() {
  const [riders, setRiders] = useState<RiderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFleetMatrix() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        // Authenticated GET request via Axios
        const response = await api.get<RiderItem[]>('/admin/riders');
        setRiders(response.data);
      } catch (err: any) {
        console.error('Fatal failure communicating with core fleet router:', err);
        setErrorMessage(
          err.response?.data?.message || err.message || 'Network connection failed parsing active rider indexes.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchFleetMatrix();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Pipeline */}
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-black uppercase tracking-tight">Fleet</h2>
        <Link href="/admin/riders/approval" className="text-xs font-black uppercase text-green-600 underline">
          View Pending KYC
        </Link>
      </div>

      {/* Operational Error Notifications Banner */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-mono uppercase tracking-wide">
          ⚠️ Connection Fault: {errorMessage}
        </div>
      )}

      {/* Main Registry Data Ledger */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 text-[10px] font-black uppercase text-neutral-400">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-xs font-mono tracking-widest text-neutral-400 uppercase animate-pulse">
                  Decompressing active fleet registry streams...
                </td>
              </tr>
            ) : riders.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-xs font-mono tracking-widest text-neutral-400 uppercase">
                  No verified fleet operators registered inside storage databases.
                </td>
              </tr>
            ) : (
              riders.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 text-sm transition-colors duration-150">
                  <td className="p-4 font-bold text-neutral-900">{r.name}</td>
                  <td className="p-4 font-mono text-neutral-600">{r.orders ?? 0}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide ${
                      r.status === 'Online' 
                        ? 'bg-green-50 text-green-600 border border-green-100' 
                        : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {r.status || 'Offline'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/riders/${r.id}`} 
                      className="font-black text-[10px] uppercase text-neutral-950 hover:underline tracking-wider"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}