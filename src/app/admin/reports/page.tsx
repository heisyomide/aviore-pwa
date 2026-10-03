'use client';

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/src/lib/api'; // Standardized Axios instance with bearer token support

interface AnalyticsData {
  monthlySummary?: {
    totalShipmentsGenerated?: number;
    grossTransactionVolume?: number;
    netPlatformEarnings?: number;
    riderPayoutAllocations?: number;
  };
  chartData?: Array<{ date: string; revenue: number }>;
  topCities?: string[];
  gamificationLeaderboards?: {
    riderOfTheMonth?: {
      name?: string;
      tripsCompletedCount?: number;
      email?: string;
    };
    highestSpendingCustomer?: {
      name?: string;
      totalCapitalSpent?: number;
      email?: string;
    };
  };
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Avoid Next.js hydration mismatch issues with Recharts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        // Authenticated request via centralized Axios instance
        const response = await api.get('/admin/analytics/summary');
        setReportData(response.data);
      } catch (err) {
        console.error('Failed compiling matrix data streams:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading || !reportData) {
    return (
      <div className="text-xs text-center font-mono p-24 text-neutral-400 uppercase tracking-widest animate-pulse">
        Compiling analytical intelligence summaries...
      </div>
    );
  }

  const summary = reportData.monthlySummary;
  const leaderboards = reportData.gamificationLeaderboards;

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-950">Analytics & Intelligence</h2>

      {/* Financial Matrix Summary Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Shipments', val: (summary?.totalShipmentsGenerated ?? 0).toLocaleString() },
          { label: 'GTV Volume', val: `₦${(summary?.grossTransactionVolume ?? 0).toLocaleString()}` },
          { label: 'Platform Share', val: `₦${(summary?.netPlatformEarnings ?? 0).toLocaleString()}` },
          { label: 'Rider Payouts', val: `₦${(summary?.riderPayoutAllocations ?? 0).toLocaleString()}` },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-5 border border-neutral-200 rounded-2xl shadow-sm">
            <span className="text-[9px] font-black font-mono text-neutral-400 uppercase tracking-wider">{item.label}</span>
            <p className="text-lg font-black font-mono mt-1 text-neutral-900">{item.val}</p>
          </div>
        ))}
      </div>

      {/* 1. Time-Series Revenue Chart */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <h3 className="text-[10px] font-black uppercase text-neutral-400 mb-6 tracking-wider">Revenue Trend (7-Day Metric Window)</h3>
        <div className="h-64 w-full">
          {isMounted && reportData.chartData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData.chartData}>
                <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontWeight: 'bold' }} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontWeight: 'bold' }} tickFormatter={(val) => `₦${val >= 1000 ? (val / 1000) + 'k' : val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e5e5', fontFamily: 'monospace', fontSize: '11px' }}
                  formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, 'Platform Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2.5} fill="#f5f5f5" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-neutral-50 rounded-2xl animate-pulse" />
          )}
        </div>
      </div>

      {/* 2. Three-Column Leaderboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Cities Distribution */}
        <Leaderboard title="Top Cities" data={reportData.topCities ?? []} />

        {/* Top Riders Gamification Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black uppercase text-[10px] text-neutral-400 mb-4 tracking-wider">Top Rider</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-950 rounded-full text-white flex items-center justify-center font-black text-sm tracking-tighter">
                {leaderboards?.riderOfTheMonth?.name?.slice(0, 2).toUpperCase() || 'RM'}
              </div>
              <div>
                <p className="font-black text-sm text-neutral-900">{leaderboards?.riderOfTheMonth?.name || 'Unassigned'}</p>
                <p className="text-[10px] text-neutral-500 font-bold font-mono uppercase mt-0.5">
                  {leaderboards?.riderOfTheMonth?.tripsCompletedCount ?? 0} Trips Completed
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 font-mono truncate">
            {leaderboards?.riderOfTheMonth?.email || 'N/A'}
          </div>
        </div>

        {/* Customer Segments Card */}
        <div className="bg-neutral-950 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-black uppercase text-[10px] text-neutral-500 mb-4 tracking-wider">Top Customer Profile</h3>
            <div className="space-y-4">
              <CustomerRow 
                label="Highest Contributor" 
                value={leaderboards?.highestSpendingCustomer?.name || 'No Active Record'} 
              />
              <div className="border-t border-neutral-800 pt-3">
                <p className="text-[9px] uppercase text-neutral-400 font-bold tracking-wide">Total Invested Volume</p>
                <p className="font-black text-sm text-green-400 font-mono mt-0.5">
                  ₦{(leaderboards?.highestSpendingCustomer?.totalCapitalSpent ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono truncate">
            {leaderboards?.highestSpendingCustomer?.email || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}

function Leaderboard({ title, data }: { title: string; data: string[] }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
      <h3 className="font-black uppercase text-[10px] text-neutral-400 mb-4 tracking-wider">{title}</h3>
      <div className="space-y-2">
        {data.length === 0 ? (
          <p className="text-xs font-mono text-neutral-400 py-4 text-center">No active hubs recorded</p>
        ) : (
          data.map((city, i) => (
            <div key={`${city}-${i}`} className="flex justify-between items-center py-1 border-b border-neutral-50 last:border-0">
              <p className="font-bold text-sm text-neutral-800">
                <span className="font-black text-neutral-400 font-mono mr-1.5">{i + 1}.</span> {city}
              </p>
              <span className="text-[9px] bg-neutral-100 text-neutral-600 font-bold font-mono px-2 py-0.5 rounded-md uppercase">Active Hub</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CustomerRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] uppercase text-neutral-400 font-bold tracking-wide">{label}</p>
      <p className="font-black text-sm text-white mt-0.5">{value}</p>
    </div>
  );
}