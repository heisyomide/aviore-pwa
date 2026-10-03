'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api'; // Axios instance with auto-injected 'aviore_token'

interface CustomerItem {
  id: string;
  name: string;
  orders: number;
  wallet: string;
  rating: number;
  joined: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLiveCustomers() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        // Axios `api` instance automatically attaches `Authorization: Bearer <aviore_token>`
        const response = await api.get('/admin/customers', {
          signal: controller.signal,
        });

        setCustomers(response.data || []);
      } catch (err: any) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          console.error('Failed to load customers payload manifest:', err);
          const serverError = err.response?.data?.message || err.message;
          setErrorMessage(serverError || 'Network connectivity error fetching customer fleet profiles.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchLiveCustomers();

    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase tracking-tight">Customers</h2>
        {!isLoading && !errorMessage && (
          <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-neutral-200">
            Total Database Records: {customers.length}
          </span>
        )}
      </div>

      {/* Network / Auth Failure Alert Banner */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-mono uppercase tracking-wide">
          ⚠️ Operational Fault: {errorMessage}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 text-[10px] font-black uppercase text-neutral-400">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Wallet</th>
              <th className="p-4">Rating</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-xs font-mono tracking-widest text-neutral-400 uppercase animate-pulse">
                  Querying live operational ledger data...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-xs font-mono tracking-widest text-neutral-400 uppercase">
                  No registered active customer profiles found
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50 text-sm transition-colors duration-150">
                  <td className="p-4">
                    <div className="font-bold text-neutral-900">{c.name}</div>
                    <div className="text-[10px] font-mono text-neutral-400 lowercase">joined {c.joined}</div>
                  </td>
                  <td className="p-4 font-mono font-medium text-neutral-700">{c.orders}</td>
                  <td className="p-4 font-bold text-emerald-600 font-mono">{c.wallet}</td>
                  <td className="p-4 font-bold text-amber-500">★ {Number(c.rating || 0).toFixed(1)}</td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/customers/${c.id}`} 
                      className="inline-block px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-950 font-black text-[10px] uppercase tracking-wider hover:bg-neutral-950 hover:text-white transition-all duration-150"
                    >
                      View Profile
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