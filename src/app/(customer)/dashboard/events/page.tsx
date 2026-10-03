'use client';

import React, { useEffect, useState } from 'react';
import { eventsApi } from '@/src/lib/eventsApi';
import EventPaymentSheet from '@/src/components/events/EventPaymentSheet';
import { BellRing, CheckCircle2, Loader2, RefreshCw, X, MapPin, Calendar, Bus } from 'lucide-react';

export default function CustomerEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [selectedPickup, setSelectedPickup] = useState<any>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  
  const [selectedTripType, setSelectedTripType] = useState<string>('outbound');
  
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      const data = await eventsApi.getEvents();
      const eventList = Array.isArray(data) ? data : [];
      setEvents(eventList);

      if (selectedEvent) {
        const updatedCurrentEvent = eventList.find((ev: any) => ev.id === selectedEvent.id);
        if (updatedCurrentEvent) {
          setSelectedEvent(updatedCurrentEvent);
          
          if (selectedRoute) {
            const updatedRoute = updatedCurrentEvent.routes?.find((r: any) => r.id === selectedRoute.id);
            if (updatedRoute) {
              setSelectedRoute(updatedRoute);
              
              if (selectedTrip) {
                const updatedTrip = updatedRoute.trips?.find((t: any) => t.id === selectedTrip.id);
                if (updatedTrip) {
                  setSelectedTrip(updatedTrip);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleOpenEventModal = async (event: any) => {
    setLoading(true);
    try {
      const data = await eventsApi.getEvents();
      const eventList = Array.isArray(data) ? data : [];
      setEvents(eventList);
      const freshEventData = eventList.find((ev: any) => ev.id === event.id) || event;
      setSelectedEvent(freshEventData);
    } catch (error) {
      setSelectedEvent(event);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalFare = () => {
    if (!selectedTrip) return 0;

    const oneWayFare = Number(selectedTrip.customerOneWayFare || 0);
    const roundTripFare = Number(selectedTrip.customerRoundTripFare || (oneWayFare * 2));

    if (selectedTripType === 'round-trip') {
      return roundTripFare;
    }
    return oneWayFare;
  };

  const handleOpenPaymentSheet = () => {
    if (!selectedEvent || !selectedRoute || !selectedPickup || !selectedTrip) return;
    setIsPaymentSheetOpen(true);
  };

  const handleJoinWaitlist = async () => {
    if (!selectedEvent || !selectedRoute) {
      alert('Please select an event and route to join the waitlist.');
      return;
    }

    setWaitlistLoading(true);
    try {
      await eventsApi.joinWaitlist({
        eventId: selectedEvent.id,
        routeId: selectedRoute.id,
        pickupPointId: selectedPickup?.id || null,
      });

      setWaitlistSuccess(true);
      setSuccessMessage('You have successfully joined the waitlist! We will notify you via email and SMS as soon as buses are scheduled.');
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || 'Failed to join waitlist');
    } finally {
      setWaitlistLoading(false);
    }
  };

  const handleFlutterwaveCheckout = async () => {
    if (!selectedEvent || !selectedRoute || !selectedPickup || !selectedTrip) {
      alert('Please complete all selection steps including the trip schedule.');
      return;
    }

    setPaymentLoading(true);
    setSuccessMessage('');

    try {
      const totalAmount = calculateTotalFare();

      const paymentResponse = await eventsApi.initializePayment({
        eventId: selectedEvent.id,
        routeId: selectedRoute.id,
        pickupPointId: selectedPickup.id,
        tripId: selectedTrip.id,
        tripType: selectedTripType,
        amount: totalAmount,
        email: 'customer@aviorego.com.ng',
        name: 'Valued Customer',
      });

      const paymentLink = paymentResponse?.link || paymentResponse?.data?.link;
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        throw new Error('Payment link could not be generated.');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || 'Failed to initialize payment');
      setPaymentLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setSelectedRoute(null);
    setSelectedPickup(null);
    setSelectedTrip(null);
    setSelectedTripType('outbound');
    setWaitlistSuccess(false);
    setSuccessMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-950">AviorèGo Events & Transit</h1>
          <p className="text-sm text-neutral-500 mt-1">Discover upcoming festivals, concerts, and secure your official transit bus seats.</p>
        </div>
        <button
          onClick={() => fetchEvents(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Schedules'}
        </button>
      </div>

      {successMessage && !selectedEvent && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-sm font-medium flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Content grid */}
      {loading && events.length === 0 ? (
        <div className="py-24 text-center text-neutral-400 font-mono text-sm flex flex-col items-center justify-center gap-3">
          <Loader2 size={24} className="animate-spin text-neutral-500" />
          Loading active events...
        </div>
      ) : events.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200/80 rounded-3xl p-16 text-center space-y-3">
          <p className="text-neutral-900 font-bold text-base">No active events right now</p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">Check back soon for upcoming concerts, road trips, and cultural festivals organized on Aviorè.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-3">
                <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-mono font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200/50">
                  {event.city}, {event.state}
                </span>
                <h3 className="text-xl font-black text-neutral-950 group-hover:text-emerald-600 transition-colors">{event.title}</h3>
                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{event.description}</p>
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-600 pt-1">
                  <MapPin size={15} className="text-neutral-400 shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenEventModal(event)}
                className="w-full bg-neutral-950 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-2xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Bus size={15} />
                Select Bus Route & Book
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Selection Flow */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 sticky top-0 z-10 backdrop-blur-md">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider">Book Transit</span>
                <h2 className="text-base font-black text-neutral-950 truncate max-w-md">{selectedEvent.title}</h2>
              </div>
              <button 
                onClick={closeModal} 
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-950 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {waitlistSuccess ? (
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-8 text-center space-y-4 my-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={28} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-neutral-950 text-lg">You're on the Waitlist!</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">{successMessage}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full max-w-xs mx-auto bg-neutral-950 text-white font-bold py-3 rounded-xl text-xs hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <>
                  {/* Step 1: Trip Type */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 font-mono flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px]">1</span>
                      Select Trip Type
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'outbound', label: 'Outbound' },
                        { id: 'return', label: 'Return' },
                        { id: 'round-trip', label: 'Round Trip' },
                      ].map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedTripType(type.id)}
                          className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all text-center flex items-center justify-center ${selectedTripType === type.id ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-sm ring-1 ring-emerald-600/20' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50/50'}`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Travel Route */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 font-mono flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px]">2</span>
                      Select Travel Route
                    </label>
                    <div className="space-y-2">
                      {selectedEvent.routes?.map((route: any) => (
                        <div
                          key={route.id}
                          onClick={() => { 
                            setSelectedRoute(route); 
                            setSelectedPickup(null); 
                            setSelectedTrip(null); 
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedRoute?.id === route.id ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600/20' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedRoute?.id === route.id ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'}`}>
                              <Bus size={16} />
                            </div>
                            <p className="text-xs font-bold text-neutral-950">{route.originCity} ➔ {route.destination}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Pickup Landmark */}
                  {selectedRoute && (
                    <div className="space-y-3 animate-fade-in">
                      <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 font-mono flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px]">3</span>
                        Select Pickup Landmark
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedRoute.pickupPoints?.map((pickup: any) => (
                          <div
                            key={pickup.id}
                            onClick={() => setSelectedPickup(pickup)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${selectedPickup?.id === pickup.id ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600/20' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'}`}
                          >
                            <p className="text-xs font-bold text-neutral-950 truncate">{pickup.name}</p>
                            <p className="text-[10px] text-neutral-500 truncate mt-0.5">{pickup.address}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Bus Trip Schedule */}
                  {selectedPickup && (
                    <div className="space-y-3 animate-fade-in">
                      <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 font-mono flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px]">4</span>
                        Select Bus Trip Schedule & Fare
                      </label>
                      <div className="space-y-2">
                        {(!selectedRoute.trips || selectedRoute.trips.length === 0) ? (
                          <div className="p-5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-800 text-xs font-bold">
                              <BellRing size={16} />
                              <span>No schedules created for this route yet.</span>
                            </div>
                            <p className="text-[11px] text-amber-700 leading-relaxed">Join the waitlist to receive instant notifications and priority booking links the moment the organizer launches this bus schedule.</p>
                            <button
                              disabled={waitlistLoading}
                              onClick={handleJoinWaitlist}
                              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                              {waitlistLoading ? (
                                <>
                                  <Loader2 size={14} className="animate-spin" />
                                  Joining Waitlist...
                                </>
                              ) : (
                                'Join Route Waitlist'
                              )}
                            </button>
                          </div>
                        ) : (
                          selectedRoute.trips.map((trip: any) => {
                            const tripFare = selectedTripType === 'round-trip'
                              ? Number(trip.customerRoundTripFare || (trip.customerOneWayFare * 2))
                              : Number(trip.customerOneWayFare || 0);

                            return (
                              <div
                                key={trip.id}
                                onClick={() => setSelectedTrip(trip)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedTrip?.id === trip.id ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600/20' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'}`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-950">
                                    <Calendar size={13} className="text-neutral-400" />
                                    {new Date(trip.departureTime).toLocaleString()}
                                  </div>
                                  <p className="text-[10px] text-neutral-500 uppercase font-medium">
                                    Type: <span className="font-bold text-neutral-700">{trip.tripLeg}</span> • Status: <span className="font-bold text-emerald-600">{trip.status}</span>
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-mono font-black text-emerald-600">
                                    ₦{tripFare.toLocaleString()}
                                  </span>
                                  <p className="text-[9px] text-neutral-400 font-medium">
                                    {selectedTripType === 'round-trip' ? 'Round Trip' : 'One-way'}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {/* Proceed CTA */}
                  {selectedRoute?.trips && selectedRoute.trips.length > 0 && (
                    <div className="pt-2">
                      <button
                        disabled={!selectedRoute || !selectedPickup || !selectedTrip}
                        onClick={handleOpenPaymentSheet}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-100 disabled:text-neutral-400 text-white font-bold py-4 rounded-2xl text-xs transition-all shadow-md flex items-center justify-between px-6 active:scale-[0.99]"
                      >
                        <span className="font-bold">{selectedTrip ? 'Proceed to Payment' : 'Complete Selections to Continue'}</span>
                        {selectedTrip && (
                          <span className="font-mono font-black text-sm tracking-tight bg-emerald-700/50 px-3 py-1 rounded-xl">
                            ₦{calculateTotalFare().toLocaleString()}
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <EventPaymentSheet
        open={isPaymentSheetOpen}
        event={selectedEvent}
        route={selectedRoute}
        pickup={selectedPickup}
        tripType={selectedTripType}
        totalAmount={calculateTotalFare()}
        loading={paymentLoading}
        onClose={() => setIsPaymentSheetOpen(false)}
        onFlutterwavePay={handleFlutterwaveCheckout}
      />
    </div>
  );
}