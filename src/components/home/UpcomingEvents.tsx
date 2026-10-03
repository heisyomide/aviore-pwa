'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Bus, Heart } from "lucide-react";
import { eventsApi } from "@/src/lib/eventsApi";

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  image?: string;
  transportAvailable?: boolean;
}

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await eventsApi.getEvents();
        const eventList = Array.isArray(data) ? data : data.events || data.data || [];
        
        const formattedEvents = eventList.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.date || (event.routes?.[0]?.trips?.[0]?.departureTime ? new Date(event.routes[0].trips[0].departureTime).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : "Upcoming"),
          location: event.venue || event.city || "See Route Details",
          image: event.imageUrl || event.coverUrl || event.image,
          transportAvailable: true, // Displaying transportation status badge as shown in design
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Failed to fetch upcoming events:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <section className="py-6 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">
            Events near you
          </h2>
          <Link
            href="/dashboard/events"
            className="text-xs font-extrabold text-orange-600 hover:text-orange-700 transition-colors"
          >
            See all
          </Link>
        </div>

        {/* Dynamic Content States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-36 rounded-2xl bg-neutral-100 animate-pulse border border-neutral-200" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/events`}
                className="group p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 flex items-start gap-3.5 relative"
              >
                {/* Event Poster Thumbnail */}
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-neutral-900 overflow-hidden shrink-0 relative shadow-inner">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-neutral-800 p-2.5 flex flex-col justify-between text-amber-400 font-black text-[11px] leading-tight uppercase tracking-tighter">
                      <span>{event.title}</span>
                      <span className="text-[9px] text-neutral-400 font-mono">Aviorè</span>
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5 space-y-2">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs sm:text-sm text-neutral-950 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                        {event.title}
                      </h4>
                      <button type="button" className="text-neutral-400 hover:text-red-500 transition-colors shrink-0 mt-0.5" onClick={(e) => { e.preventDefault(); }}>
                        <Heart size={15} />
                      </button>
                    </div>

                    <div className="space-y-1 text-[11px] text-neutral-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-orange-500 shrink-0" />
                        <span className="truncate">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-orange-500 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Transportation Status Badge */}
                  {event.transportAvailable && (
                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-emerald-700 tracking-tight">
                        Transportation available
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Fallback Empty State */
          <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center space-y-2">
            <p className="text-xs font-bold text-neutral-900">No events near you right now</p>
            <p className="text-[11px] text-neutral-500">Check back later for newly published festivals and concerts.</p>
          </div>
        )}

      </div>
    </section>
  );
}