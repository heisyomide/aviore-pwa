'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/src/lib/api';
import { Route as RouteIcon, Calendar, MapPin, CheckCircle2, Plus, Users, Send, AlertCircle, ShieldCheck } from 'lucide-react';
import EventSchedulerModal from '../../../components/events/EventSchedulerModal';

interface PickupPointItem {
  id: string;
  name: string;
  address: string;
  landmark?: string;
  maxCapacity: number;
}

interface TripItem {
  id: string;
  tripLeg: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  driverId?: string;
  isPublished: boolean;
}

interface RouteItem {
  id: string;
  originCity: string;
  destination: string;
  price: number;
  pickupPoints: PickupPointItem[];
  trips: TripItem[];
}

interface EventItem {
  id: string;
  title: string;
  description?: string;
  venue: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  bannerUrl?: string;
  status: string;
  estimatedRiders?: number;
  organizer?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    user?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
    };
  };
  routes: RouteItem[];
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Updated tabs to 4 distinct views
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ACCEPTED' | 'SCHEDULED' | 'ALL'>('PENDING');

  // Modal State
  const [schedulingEventId, setSchedulingEventId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let endpoint = '/admin/events';
      
      if (activeTab === 'PENDING') {
        endpoint = '/admin/pending';
      } else if (activeTab === 'ACCEPTED') {
        endpoint = '/admin/events/accepted';
      }

      const res = await api.get(endpoint);
      const payload = res.data?.events || res.data?.data || res.data || [];
      setEvents(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error('Failed to load admin events pipeline', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  // Accept Event handler
  const handleAcceptEvent = async (evId: string) => {
    try {
      setActionLoadingId(evId);
      await api.patch(`/admin/events/${evId}/accept`).catch(() => api.patch(`/admin/${evId}/accept`));
      await fetchEvents();
    } catch (err) {
      alert('Error accepting event.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Publish Trip Live
const handlePublishTrip = async (tripId: string) => {
    try {
      await api.patch(`/admin/trips/${tripId}/publish-live`);
      alert('Trip published live! Notifications dispatched.');
      fetchEvents();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error publishing trip live.';
      alert(errorMsg);
    }
  };

  // Fixed Filter Logic: trust the server endpoints for PENDING and ACCEPTED queries
  const filteredEvents = events.filter((ev) => {
    const status = (ev.status || '').toUpperCase();
    const hasTrips = ev.routes?.some((r) => r.trips && r.trips.length > 0);

    if (activeTab === 'PENDING') {
      return status === 'PENDING' || status === 'PENDING_REVIEW';
    }
    if (activeTab === 'ACCEPTED') {
      return true;
    }
    if (activeTab === 'SCHEDULED') {
      return (status === 'ACCEPTED' || status === 'APPROVED' || status === 'PUBLISHED' || status === 'DRAFT') && hasTrips;
    }
    return true; // ALL
  });

  return (
    <div className="space-y-8 text-white max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight font-mono uppercase text-white">Events & Fleet Operations</h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">Approve incoming organizer requirements, track accepted queues, and dispatch transit buses.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#0b0f19] p-1.5 rounded-2xl border border-neutral-800/80 shadow-lg overflow-x-auto">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-2 text-xs font-mono font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'PENDING' ? 'bg-emerald-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setActiveTab('ACCEPTED')}
            className={`px-3 py-2 text-xs font-mono font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'ACCEPTED' ? 'bg-emerald-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Accepted (Needs Schedule)
          </button>
          <button
            onClick={() => setActiveTab('SCHEDULED')}
            className={`px-3 py-2 text-xs font-mono font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'SCHEDULED' ? 'bg-emerald-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Active & Scheduled
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-2 text-xs font-mono font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'ALL' ? 'bg-emerald-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Events
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          Loading events pipeline...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-[#0b0f19] rounded-3xl border border-neutral-800/80 p-16 text-center flex flex-col items-center justify-center gap-3">
          <AlertCircle className="h-8 w-8 text-neutral-600" />
          <p className="text-neutral-400 font-mono text-xs">No events found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.map((ev) => {
            const isPending = ev.status?.toUpperCase().includes('PENDING');

            const organizerName =
              ev.organizer?.fullName ||
              `${ev.organizer?.user?.firstName || ''} ${ev.organizer?.user?.lastName || ''}`.trim() ||
              'Organizer';
            const organizerEmail = ev.organizer?.email || ev.organizer?.user?.email || 'N/A';
            const organizerPhone = ev.organizer?.phoneNumber || ev.organizer?.user?.phoneNumber;

            return (
              <div key={ev.id} className="bg-[#0b0f19] rounded-3xl border border-neutral-800/80 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 transition-all hover:border-neutral-700">
                
                {/* Event Header Grid */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-neutral-800/80 pb-6">
                  <div className="flex items-start gap-4">
                    {ev.bannerUrl ? (
                      <img src={ev.bannerUrl} alt={ev.title} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-neutral-800 shrink-0" />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-2xl shrink-0">🎟️</div>
                    )}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold font-mono text-white">{ev.title}</h3>
                        <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          isPending ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {ev.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 flex items-center gap-1.5 font-mono">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> {ev.venue}, {ev.city}, {ev.state}
                      </p>
                      <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 font-mono">
                        <Calendar className="h-3.5 w-3.5 text-neutral-500 shrink-0" /> {new Date(ev.startDate).toLocaleDateString()} – {new Date(ev.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Organizer Card Box */}
                  <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800/80 text-xs flex flex-col gap-2 font-mono min-w-65">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-200">Organizer</span>
                      <span className="text-emerald-400 font-bold">{organizerName}</span>
                    </div>
                    <span className="text-neutral-400 text-[11px] truncate">✉️ {organizerEmail}</span>
                    {organizerPhone && <span className="text-neutral-400 text-[11px]">📞 {organizerPhone}</span>}
                    <div className="mt-1 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-emerald-400 font-bold">
                      <span className="flex items-center gap-1 text-[11px] text-neutral-400"><Users className="h-3.5 w-3.5 text-emerald-400" /> Target Riders:</span>
                      <span className="text-xs">{ev.estimatedRiders ? `${ev.estimatedRiders} pax` : 'Not Specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Description Box */}
                {ev.description && (
                  <div className="text-xs text-neutral-300 font-mono bg-neutral-950/40 p-4 rounded-2xl border border-neutral-800/40">
                    <span className="text-neutral-500 block mb-1 uppercase text-[10px] tracking-wider">Event Description & Requirements</span>
                    <p className="leading-relaxed">{ev.description}</p>
                  </div>
                )}

                {/* Action Controls for Pending Events */}
                {isPending && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleAcceptEvent(ev.id)}
                      disabled={actionLoadingId === ev.id}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl font-bold font-mono text-xs transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" /> 
                      {actionLoadingId === ev.id ? 'Accepting...' : 'Accept Event'}
                    </button>
                  </div>
                )}

                {/* Route & Pickup Points Breakdown for Accepted / Active Events */}
                {!isPending && (
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                        <RouteIcon className="h-4 w-4" /> Transit Routes, Pickup Points & Bus Slots
                      </h4>
                      <button
                        onClick={() => setSchedulingEventId(ev.id)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-mono font-bold transition shadow"
                      >
                        <Plus className="h-3.5 w-3.5" /> Schedule Fleet / Buses
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ev.routes?.map((route) => (
                        <div key={route.id} className="bg-neutral-950/90 rounded-2xl p-5 border border-neutral-800/90 space-y-4 shadow-inner">
                          {/* Route Summary */}
                          <div className="flex items-center justify-between font-mono text-xs border-b border-neutral-800 pb-3">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span className="text-emerald-400">⚡</span> {route.originCity} ➔ {route.destination}
                            </span>
                            <span className="text-emerald-400 font-black">₦{route.price?.toLocaleString() || 0}</span>
                          </div>

                          {/* Pickup Points with Capacities */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">Designated Boarding Points & Capacities</span>
                            {route.pickupPoints && route.pickupPoints.length > 0 ? (
                              <div className="grid grid-cols-1 gap-2">
                                {route.pickupPoints.map((point) => (
                                  <div key={point.id} className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800 text-[11px] font-mono flex items-center justify-between">
                                    <div>
                                      <p className="font-bold text-neutral-200">{point.name}</p>
                                      <p className="text-neutral-400 text-[10px]">{point.address} {point.landmark ? `(${point.landmark})` : ''}</p>
                                    </div>
                                    <div className="text-right shrink-0 pl-3">
                                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-bold border border-emerald-500/20">
                                        Max: {point.maxCapacity} seats
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-neutral-500 italic font-mono">No pickup points mapped for this route.</p>
                            )}
                          </div>

                          {/* Scheduled Trips */}
                          <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">Dispatched Buses / Trips</span>
                            {route.trips && route.trips.length > 0 ? (
                              route.trips.map((trip) => (
                                <div key={trip.id} className="bg-[#0b0f19] p-3 rounded-xl border border-neutral-800 flex items-center justify-between text-xs font-mono">
                                  <div className="space-y-1">
                                    <span className="font-bold uppercase text-[10px] bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded border border-neutral-800">
                                      {trip.tripLeg} Bus
                                    </span>
                                    <div className="text-neutral-400 text-[11px] mt-1">Departs: {new Date(trip.departureTime).toLocaleString()}</div>
                                    <div className="text-neutral-500 text-[10px]">Driver Claimed: {trip.driverId ? 'Yes 🚐' : 'Pending Assignment ⚠️'}</div>
                                  </div>
                                  <div>
                                    {trip.isPublished ? (
                                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold px-2.5 py-1 rounded-full text-[10px]">LIVE 🟢</span>
                                    ) : (
                                      <button
                                        onClick={() => handlePublishTrip(trip.id)}
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition flex items-center gap-1 shadow"
                                      >
                                        <Send className="h-3 w-3" /> Publish Live
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-[11px] text-neutral-500 italic font-mono">No buses scheduled for this route yet.</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Imported Event Scheduler Modal Component */}
{/* Event Scheduler Modal Component */}
<EventSchedulerModal
  isOpen={Boolean(schedulingEventId)}
  onClose={() => {
    setSchedulingEventId(null);
    fetchEvents();
  }}
  event={events.find((e) => e.id === schedulingEventId) || null}
/>
    </div>
  );
}