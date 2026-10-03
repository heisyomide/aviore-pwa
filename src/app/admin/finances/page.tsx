'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';

interface StatItem {
  label: string;
  value: string;
}

interface TransactionItem {
  id: string;
  reference: string;
  user: string;
  amount: string;
  isCredit: boolean;
}

interface WithdrawalItem {
  id: string;
  user: string;
  amount: string;
  date: string;
  bankName?: string;
  accountNumber?: string;
}

const TABS = ['Transactions', 'Pending Withdrawals'] as const;
type TabType = typeof TABS[number];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('Transactions');
  const [stats, setStats] = useState<StatItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadFinanceData = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const [statsRes, txRes, wdRes] = await Promise.all([
        api.get<StatItem[]>('/admin/finances/overview', { signal }),
        api.get<TransactionItem[]>('/admin/finances/transactions', { signal }),
        api.get<WithdrawalItem[]>('/admin/finances/withdrawals', { signal }),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (txRes?.data) setTransactions(txRes.data);
      if (wdRes?.data) setWithdrawals(wdRes.data);
    } catch (err: any) {
      if (err?.name !== 'CanceledError' && err?.name !== 'AbortError') {
        console.error('Failed syncing system ledger matrices:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadFinanceData(controller.signal);
    return () => controller.abort();
  }, [loadFinanceData]);

  const handleWithdrawalAction = async (id: string, action: 'approve' | 'reject') => {
    if (processingId) return;
    try {
      setProcessingId(id);
      await api.patch(`/admin/finances/withdrawals/${id}/${action}`);
      await loadFinanceData();
    } catch (err: any) {
      console.error(`Failed to ${action} withdrawal:`, err);
      alert(err?.response?.data?.message || `${action === 'approve' ? 'Disbursement' : 'Rejection'} validation error occurred.`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleInstantApproval = (id: string) => handleWithdrawalAction(id, 'approve');
  const handleInstantRejection = (id: string) => handleWithdrawalAction(id, 'reject');

  const skeletonStats = useMemo(() => [1, 2, 3], []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Finances</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Fleet & Merchant liquidity controls</p>
        </div>
        <Link 
          href="/admin/finances/withdrawals" 
          className="text-[10px] font-black uppercase underline text-neutral-900 hover:text-neutral-600 transition-colors"
        >
          View All Requests
        </Link>
      </div>

      {/* Stats Cards Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading && stats.length === 0 ? (
          skeletonStats.map((i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-200 animate-pulse h-24" />
          ))
        ) : (
          stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-black mt-1 text-neutral-950 font-mono">{s.value}</p>
            </div>
          ))
        )}
      </div>

      {/* Tab Controls Navigation */}
      <div className="flex gap-6 border-b border-neutral-200">
        {TABS.map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[10px] font-black uppercase tracking-wide transition-all border-b-2 ${
              activeTab === tab 
                ? 'border-neutral-950 text-neutral-950' 
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {tab}
            {tab === 'Pending Withdrawals' && withdrawals.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-neutral-950 text-white rounded-full text-[9px]">
                {withdrawals.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Conditional Interface Elements Grid */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        {loading && stats.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-neutral-400 uppercase tracking-widest animate-pulse">
            Streaming structural transactions matrix logs...
          </div>
        ) : activeTab === 'Transactions' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 text-[10px] font-black uppercase text-neutral-400">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-xs font-mono text-neutral-400 uppercase">
                      No transactions documented.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="text-sm hover:bg-neutral-50 transition-colors">
                      <td className="p-4 font-mono text-neutral-500 text-xs">{tx.reference}</td>
                      <td className="p-4 font-bold text-neutral-800">{tx.user}</td>
                      <td className={`p-4 text-right font-black font-mono ${tx.isCredit ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {withdrawals.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-neutral-400 uppercase tracking-wider">
                No active pending payouts found.
              </div>
            ) : (
              withdrawals.map((w) => {
                const isBusy = processingId === w.id;
                return (
                  <div key={w.id} className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-neutral-50 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{w.user}</p>
                      <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">
                        REF: {w.id} • {w.date}
                      </p>
                      {w.bankName && w.accountNumber && (
                        <p className="text-[11px] text-neutral-600 mt-1 font-mono">
                          {w.bankName} — <span className="font-bold">{w.accountNumber}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="text-xs font-black text-red-600 font-mono">{w.amount}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleInstantRejection(w.id)}
                          disabled={isBusy}
                          className="px-3 py-1.5 border border-neutral-300 text-neutral-700 rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-neutral-100 disabled:opacity-50 transition-all"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleInstantApproval(w.id)}
                          disabled={isBusy}
                          className="px-3 py-1.5 bg-neutral-950 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 shadow-sm transition-all"
                        >
                          {isBusy ? 'Processing...' : 'Approve'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}