'use client';

import React, { useState } from 'react';
import { X, Calendar, MapPin, FileText, Plus, Trash2, Route, CheckCircle2 } from 'lucide-react';
import { api } from '@/src/lib/api';

interface PickupPointInput {
  name: string;
  address: string;
  landmark: string;
  maxCapacity: number;
}

interface RouteInput {
  originCity: string;
  destination: string;
  pickupPoints: PickupPointInput[];
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

export default function CreateEventModal({ isOpen, onClose, onEventCreated }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    city: 'Osogbo',
    state: 'Osun',
    startDate: '',
    endDate: '',
    routes: [
      {
        originCity: 'Lagos',
        destination: 'Osogbo',
        pickupPoints: [
          { name: 'Ikeja City Mall', address: 'Obafemi Awolowo Way, Ikeja', landmark: 'Main Entrance Gate', maxCapacity: 40 }
        ]
      }
    ] as RouteInput[]
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Route Handlers
  const handleRouteChange = (index: number, field: string, value: string) => {
    const updatedRoutes = [...formData.routes];
    updatedRoutes[index] = { ...updatedRoutes[index], [field]: value };
    setFormData({ ...formData, routes: updatedRoutes });
  };

  const addRoute = () => {
    setFormData({
      ...formData,
      routes: [
        ...formData.routes,
        { originCity: '', destination: formData.venue || 'Osogbo', pickupPoints: [{ name: '', address: '', landmark: '', maxCapacity: 40 }] }
      ]
    });
  };

  const removeRoute = (index: number) => {
    if (formData.routes.length === 1) return;
    const updatedRoutes = formData.routes.filter((_, i) => i !== index);
    setFormData({ ...formData, routes: updatedRoutes });
  };

  // Pickup Point Handlers within Routes
  const handlePickupChange = (routeIndex: number, pickupIndex: number, field: string, value: string | number) => {
    const updatedRoutes = [...formData.routes];
    const updatedPickups = [...updatedRoutes[routeIndex].pickupPoints];
    updatedPickups[pickupIndex] = { ...updatedPickups[pickupIndex], [field]: value };
    updatedRoutes[routeIndex].pickupPoints = updatedPickups;
    setFormData({ ...formData, routes: updatedRoutes });
  };

  const addPickupPoint = (routeIndex: number) => {
    const updatedRoutes = [...formData.routes];
    updatedRoutes[routeIndex].pickupPoints.push({ name: '', address: '', landmark: '', maxCapacity: 40 });
    setFormData({ ...formData, routes: updatedRoutes });
  };

  const removePickupPoint = (routeIndex: number, pickupIndex: number) => {
    const updatedRoutes = [...formData.routes];
    if (updatedRoutes[routeIndex].pickupPoints.length === 1) return;
    updatedRoutes[routeIndex].pickupPoints = updatedRoutes[routeIndex].pickupPoints.filter((_, i) => i !== pickupIndex);
    setFormData({ ...formData, routes: updatedRoutes });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/events', {
        title: formData.title,
        description: formData.description,
        venue: formData.venue,
        city: formData.city,
        state: formData.state,
        startDate: formData.startDate,
        endDate: formData.endDate,
        routes: formData.routes.map(r => ({
          originCity: r.originCity,
          destination: r.destination,
          pickupPoints: r.pickupPoints.map(p => ({
            ...p,
            maxCapacity: parseInt(p.maxCapacity as any, 10) || 40
          }))
        }))
      });

      setSuccess(true);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred while publishing event configuration.';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAll = () => {
    if (success) {
      onEventCreated();
    }
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0e131f] border border-neutral-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950/40">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white uppercase font-mono">Create Event & Transit Logistics</h2>
            <p className="text-xs text-neutral-400">Configure event schedule, transport routes, and customer pickup capacities.</p>
          </div>
          <button 
            onClick={handleCloseAll}
            className="h-8 w-8 rounded-full bg-neutral-800/80 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Conditional Success View */}
        {success ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-5 my-auto">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-base font-bold font-mono text-white">Event Submitted for Review</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Your event and transport logistics configuration has been successfully submitted and is now <span className="text-emerald-400 font-mono font-bold">Pending Review</span> by an administrator. Once approved, schedules and pricing will be configured.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseAll}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-neutral-950 transition-colors font-mono mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          /* Modal Form Body */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-7 flex-1">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-mono">
                {error}
              </div>
            )}

            {/* Section 1: Event Metadata */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">1. Event General Information</h3>
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Event Title</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                  <input 
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleBasicChange}
                    placeholder="e.g. Osogbo Music Festival & Transit Shuttle"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Venue Name</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                    <input 
                      type="text"
                      name="venue"
                      required
                      value={formData.venue}
                      onChange={handleBasicChange}
                      placeholder="e.g. Osun Cultural Center"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase">City</label>
                  <input 
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleBasicChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase">State</label>
                  <input 
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleBasicChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Start Date & Time</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                    <input 
                      type="datetime-local"
                      name="startDate"
                      required
                      value={formData.startDate}
                      onChange={handleBasicChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase">End Date & Time</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                    <input 
                      type="datetime-local"
                      name="endDate"
                      required
                      value={formData.endDate}
                      onChange={handleBasicChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Event Description</label>
                <textarea 
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleBasicChange}
                  placeholder="Describe the event and transit guidelines..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <hr className="border-neutral-800" />

            {/* Section 2: Transit Routes & Pickup Points */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">2. Transit Routes & Pickup Points</h3>
                  <p className="text-[11px] text-neutral-400">Define origin cities and specific customer boarding points with max seat capacities.</p>
                </div>
                <button
                  type="button"
                  onClick={addRoute}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-bold text-white transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-emerald-400" /> Add Route
                </button>
              </div>

              {formData.routes.map((route, rIndex) => (
                <div key={rIndex} className="p-4 rounded-2xl border border-neutral-800 bg-neutral-950/60 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2 text-white text-xs font-mono font-bold">
                      <Route className="h-4 w-4 text-emerald-400" />
                      <span>Route #{rIndex + 1}</span>
                    </div>
                    {formData.routes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoute(rIndex)}
                        className="text-red-400 hover:text-red-300 text-xs font-mono flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove Route
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Origin City</label>
                      <input 
                        type="text"
                        required
                        value={route.originCity}
                        onChange={(e) => handleRouteChange(rIndex, 'originCity', e.target.value)}
                        placeholder="e.g. Lagos"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Destination</label>
                      <input 
                        type="text"
                        required
                        value={route.destination}
                        onChange={(e) => handleRouteChange(rIndex, 'destination', e.target.value)}
                        placeholder="e.g. Osogbo Venue"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Pickup Points Nested Builder */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase">Pickup Points for this Route</span>
                      <button
                        type="button"
                        onClick={() => addPickupPoint(rIndex)}
                        className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add Pickup Point
                      </button>
                    </div>

                    {route.pickupPoints.map((pickup, pIndex) => (
                      <div key={pIndex} className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-neutral-400">Pickup Point #{pIndex + 1}</span>
                          {route.pickupPoints.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePickupPoint(rIndex, pIndex)}
                              className="text-red-400 hover:text-red-300 text-[10px] font-mono"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase">Point Name</label>
                            <input 
                              type="text"
                              required
                              value={pickup.name}
                              onChange={(e) => handlePickupChange(rIndex, pIndex, 'name', e.target.value)}
                              placeholder="e.g. Ikeja City Mall"
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase">Street Address</label>
                            <input 
                              type="text"
                              required
                              value={pickup.address}
                              onChange={(e) => handlePickupChange(rIndex, pIndex, 'address', e.target.value)}
                              placeholder="e.g. Obafemi Awolowo Way"
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase">Landmark Note</label>
                            <input 
                              type="text"
                              value={pickup.landmark}
                              onChange={(e) => handlePickupChange(rIndex, pIndex, 'landmark', e.target.value)}
                              placeholder="e.g. Near Main Gate"
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase">Max Capacity (Seats)</label>
                            <input 
                              type="number"
                              required
                              min="1"
                              value={pickup.maxCapacity}
                              onChange={(e) => handlePickupChange(rIndex, pIndex, 'maxCapacity', e.target.value)}
                              placeholder="40"
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-neutral-950 transition-colors disabled:opacity-50 font-mono"
              >
                {submitting ? 'Submitting for Review...' : 'Submit Event for Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}