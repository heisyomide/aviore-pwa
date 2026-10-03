'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Calendar, MapPin, Users, Ticket, Search } from 'lucide-react';
import CreateEventModal from '@/src/components/events/CreateEventModal';
import {api} from '@/src/lib/api'; // Import your configured API client

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Use the centralized api client to hit the backend endpoint
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((ev: any) => 
    ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.venue?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-white uppercase font-mono tracking-tight">Events & Convoys Management</h1>
          <p className="text-xs text-neutral-400">Manage your active itineraries, ticket tiers, and travel schedules.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/10"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </button>
      </div>

      {/* Toolbar / Search */}
      <div className="flex items-center justify-between gap-4 bg-[#0e131f] border border-neutral-800/80 rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title or location..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
        <span className="text-xs font-mono text-neutral-400">Total: {filteredEvents.length}</span>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-xs font-mono text-neutral-400 animate-pulse">Loading events catalog...</p>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: any) => (
            <div key={event.id} className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 space-y-5 flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {event.category || 'TRANSPORT & LOGISTICS'}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {event.routes?.[0]?.price ? `₦${event.routes[0].price.toLocaleString()}` : 'Free / Multi-tier'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white font-mono leading-snug">{event.title}</h3>
                <p className="text-xs text-neutral-400 line-clamp-2">{event.description || 'No description provided.'}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-neutral-800/60 text-xs text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <span className="font-mono text-[11px]">{new Date(event.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <span className="truncate">{event.venue ? `${event.venue}, ${event.city}` : event.location || 'Terminal Location'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <span className="font-mono text-[11px]">{event._count?.bookings || 0} Booked</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-12 text-center space-y-4">
          <Ticket className="h-10 w-10 text-neutral-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-mono">No Events Found</h3>
            <p className="text-xs text-neutral-400">Get started by creating your first transit route or event itinerary.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono font-bold text-xs px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Event Now
          </button>
        </div>
      )}

      {/* Create Event Modal */}
      <CreateEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onEventCreated={fetchEvents} 
      />
    </div>
  );
}