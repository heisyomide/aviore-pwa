'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, Download, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '@/src/lib/api';

interface ReportMetrics {
  totalEvents: number;
  activeEvents: number;
  totalBookings: number;
  totalBoarded: number;
  overallCheckInRate: string;
}

interface EventPerformance {
  id: string;
  title: string;
  date: string;
  status: string;
  totalBookings: number;
  attendeesBoarded: number;
  checkInRate: string;
}

export default function OrganizerReportsPage() {
  const [metrics, setMetrics] = useState<ReportMetrics>({
    totalEvents: 0,
    activeEvents: 0,
    totalBookings: 0,
    totalBoarded: 0,
    overallCheckInRate: '0%',
  });
  const [performances, setPerformances] = useState<EventPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30days');

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/events/reports/summary?range=${timeRange}`);
      setMetrics(response.data.metrics || { totalEvents: 0, activeEvents: 0, totalBookings: 0, totalBoarded: 0, overallCheckInRate: '0%' });
      setPerformances(response.data.eventAnalytics || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load report data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [timeRange]);

  const exportCSV = () => {
    const headers = ['Event Title', 'Date', 'Total Bookings', 'Attendees Boarded', 'Check-In Rate', 'Status'];
    const rows = performances.map((p) => [
      `"${p.title}"`,
      p.date,
      p.totalBookings,
      p.attendeesBoarded,
      p.checkInRate,
      p.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `organizer_analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-[#0e131f] min-h-screen text-white font-mono">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white uppercase">Event Analytics & Reports</h1>
          <p className="text-xs text-neutral-400">Monitor attendee bookings, boarding metrics, and event performance telemetry.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-bold text-neutral-300 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            Export CSV
          </button>

          <button
            onClick={fetchReports}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-950/40 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase">Total Bookings</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {metrics.totalBookings.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-500">Total registered attendees</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950/40 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase">Total Boarded</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {metrics.totalBoarded.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400">Checked-in & verified</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950/40 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase">Check-In Rate</span>
            <BarChart3 className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {metrics.overallCheckInRate}
          </div>
          <div className="text-[10px] text-neutral-500">Overall attendance efficiency</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950/40 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase">Active Events</span>
            <Calendar className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {metrics.activeEvents} <span className="text-xs text-neutral-500 font-normal">/ {metrics.totalEvents} total</span>
          </div>
          <div className="text-[10px] text-neutral-500">Currently published events</div>
        </div>
      </div>

      {/* Performance Breakdown Table */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950/40 overflow-hidden">
        <div className="p-5 border-b border-neutral-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">Event Analytics & Telemetry Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/50 text-neutral-400 uppercase font-bold border-b border-neutral-800">
              <tr>
                <th className="p-4">Event Title</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total Bookings</th>
                <th className="p-4">Attendees Boarded</th>
                <th className="p-4">Check-In Rate</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">
                    Loading analytics data...
                  </td>
                </tr>
              ) : performances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">
                    No event analytics available for this range.
                  </td>
                </tr>
              ) : (
                performances.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="p-4 font-bold text-white">{item.title}</td>
                    <td className="p-4 text-neutral-400">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="p-4 font-mono">{item.totalBookings}</td>
                    <td className="p-4 font-mono text-emerald-400">{item.attendeesBoarded}</td>
                    <td className="p-4 font-mono">{item.checkInRate}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        item.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {item.status}
                      </span>
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