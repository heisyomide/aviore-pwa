'use client';

import React, { useEffect, useState } from 'react';
import { Users, Search, QrCode, CheckCircle2, Clock, AlertCircle, ShieldCheck, MapPin, Bus } from 'lucide-react';
import {api} from '@/src/lib/api';

interface PassengerBooking {
  id: string;
  qrToken: string;
  amountPaid: number;
  paymentStatus: string;
  boardingStatus: 'NOT_CHECKED_IN' | 'CHECKED_IN' | 'BOARDED' | 'CANCELLED';
  checkedInAt?: string;
  customer: {
    id: string;
    fullName?: string;
    email: string;
    phone?: string;
  };
  event: {
    id: string;
    title: string;
    venue: string;
  };
  route: {
    originCity: string;
    destination: string;
  };
  pickupPoint: {
    name: string;
    address: string;
  };
  trip?: {
    id: string;
    tripLeg: string;
    departureTime: string;
    vehicle?: {
      plateNumber: string;
      model: string;
    };
  };
}

export default function PassengersPage() {
  const [passengers, setPassengers] = useState<PassengerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [error, setError] = useState('');
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

const fetchPassengers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/events/organizer/passengers');
      setPassengers(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load passenger manifests.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPassengers();
  }, []);

  const handleManualCheckIn = async (qrToken: string) => {
    try {
      setCheckingInId(qrToken);
      await api.post('/events/check-in', { qrToken });
      await fetchPassengers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Check-in failed');
    } finally {
      setCheckingInId(null);
    }
  };

  const filteredPassengers = passengers.filter((p) => {
    const matchesSearch = 
      p.customer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.qrToken?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.event?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.boardingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-white uppercase font-mono tracking-tight">Passenger Manifests & Ticketing</h1>
          <p className="text-xs text-neutral-400">Track passenger bookings, boarding validations, and QR verification logs.</p>
        </div>
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0e131f] border border-neutral-800/80 rounded-2xl p-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by passenger name, email, or QR ticket token..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'NOT_CHECKED_IN', 'CHECKED_IN', 'BOARDED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-colors whitespace-nowrap ${
                statusFilter === status 
                  ? 'bg-emerald-500 text-neutral-950' 
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 font-mono">
          {error}
        </div>
      )}

      {/* Passengers Table / List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-75">
          <p className="text-xs font-mono text-neutral-400 animate-pulse">Syncing passenger manifests...</p>
        </div>
      ) : filteredPassengers.length > 0 ? (
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/50 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  <th className="py-4 px-5">Passenger</th>
                  <th className="py-4 px-5">Event / Route</th>
                  <th className="py-4 px-5">Pickup Point</th>
                  <th className="py-4 px-5">Ticket / Ref</th>
                  <th className="py-4 px-5">Boarding Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-xs font-mono">
                {filteredPassengers.map((booking) => (
                  <tr key={booking.id} className="hover:bg-neutral-900/40 transition-colors">
                    
                    {/* Passenger Info */}
                    <td className="py-4 px-5 space-y-0.5">
                      <div className="font-bold text-white">{booking.customer?.fullName || 'Anonymous Passenger'}</div>
                      <div className="text-[11px] text-neutral-400">{booking.customer?.email}</div>
                    </td>

                    {/* Event & Route */}
                    <td className="py-4 px-5 space-y-0.5">
                      <div className="text-white font-bold truncate max-w-50">{booking.event?.title}</div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Bus className="h-3 w-3" /> {booking.route?.originCity} $\rightarrow$ {booking.route?.destination}
                      </div>
                    </td>

                    {/* Pickup Point */}
                    <td className="py-4 px-5 space-y-0.5">
                      <div className="text-neutral-200 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-neutral-500" /> {booking.pickupPoint?.name}
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate max-w-40">{booking.pickupPoint?.address}</div>
                    </td>

                    {/* Ticket Token */}
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-300">
                        {booking.qrToken ? `${booking.qrToken.substring(0, 10)}...` : 'N/A'}
                      </span>
                    </td>

                    {/* Boarding Status Badge */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        booking.boardingStatus === 'CHECKED_IN' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        booking.boardingStatus === 'BOARDED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-neutral-800/50 text-neutral-400 border border-neutral-700'
                      }`}>
                        {booking.boardingStatus === 'CHECKED_IN' && <CheckCircle2 className="h-3 w-3" />}
                        {booking.boardingStatus === 'BOARDED' && <ShieldCheck className="h-3 w-3" />}
                        {booking.boardingStatus === 'NOT_CHECKED_IN' && <Clock className="h-3 w-3" />}
                        {booking.boardingStatus.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      {booking.boardingStatus === 'NOT_CHECKED_IN' ? (
                        <button
                          onClick={() => handleManualCheckIn(booking.qrToken)}
                          disabled={checkingInId === booking.qrToken}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-[11px] font-bold transition-colors disabled:opacity-50"
                        >
                          {checkingInId === booking.qrToken ? 'Validating...' : 'Check In'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-neutral-500 italic">Validated</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-12 text-center space-y-4">
          <Users className="h-10 w-10 text-neutral-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-mono">No Passengers Found</h3>
            <p className="text-xs text-neutral-400">Passenger bookings and manifests will appear here once customers book your event transit routes.</p>
          </div>
        </div>
      )}
    </div>
  );
}