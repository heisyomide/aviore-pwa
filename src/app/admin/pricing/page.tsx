'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Environment variable or fallback NestJS local server address
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Landmark {
  id: string;
  name: string;
  aliases?: string[];
  description?: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  isActive?: boolean;
}

export default function PricingSettingsPage() {
  // --- PRICING CONFIG STATE ---
  const [config, setConfig] = useState({
    bikeBase: 1500,
    bikePerKm: 250,
    platformCommission: 15,
  });

  // --- LANDMARK MANAGEMENT STATE ---
  const [activeTab, setActiveTab] = useState<'pricing' | 'landmarks'>('pricing');
  const [selectedCity, setSelectedCity] = useState('Osogbo');
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loadingLandmarks, setLoadingLandmarks] = useState(false);
  const [savingLandmark, setSavingLandmark] = useState(false);
  const [refreshingCache, setRefreshingCache] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Landmark Form State
  const [newLandmark, setNewLandmark] = useState({
    name: '',
    aliases: '',
    description: '',
    city: 'Osogbo',
    state: 'Osun',
    latitude: '',
    longitude: '',
  });

  // Helper to construct request URLs (handles both full backend URL and relative path fallback)
  const getUrl = (path: string) => {
    return path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
  };

  // Fetch Landmarks for selected city
  const fetchLandmarks = useCallback(async (city: string) => {
    try {
      setLoadingLandmarks(true);
      const url = getUrl(`/landmarks?city=${encodeURIComponent(city)}`);
      const res = await fetch(url);
      
      if (res.ok) {
        const data: Landmark[] = await res.json();
        // Ensure proper array handling
        setLandmarks(Array.isArray(data) ? data : []);
      } else {
        console.error(`Failed to load landmarks. Status: ${res.status}`);
        setLandmarks([]);
      }
    } catch (err) {
      console.error('Failed to fetch landmarks from backend:', err);
      setLandmarks([]);
    } finally {
      setLoadingLandmarks(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'landmarks') {
      fetchLandmarks(selectedCity);
    }
  }, [activeTab, selectedCity, fetchLandmarks]);

  // Handle Create Landmark Submit
  const handleCreateLandmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLandmark.name || !newLandmark.latitude || !newLandmark.longitude) {
      setFeedback({ type: 'error', message: 'Name, Latitude, and Longitude are required fields.' });
      return;
    }

    try {
      setSavingLandmark(true);
      setFeedback(null);

      const payload = {
        name: newLandmark.name.trim(),
        aliases: newLandmark.aliases
          ? newLandmark.aliases.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
        description: newLandmark.description.trim() || undefined,
        city: newLandmark.city.trim(),
        state: newLandmark.state.trim(),
        latitude: parseFloat(newLandmark.latitude),
        longitude: parseFloat(newLandmark.longitude),
      };

      const res = await fetch(getUrl('/landmarks'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: 'Landmark created and memory cache updated successfully!' });
        setNewLandmark({
          name: '',
          aliases: '',
          description: '',
          city: selectedCity,
          state: 'Osun',
          latitude: '',
          longitude: '',
        });
        fetchLandmarks(selectedCity);
      } else {
        const errData = await res.json().catch(() => ({}));
        setFeedback({
          type: 'error',
          message: errData.message || `Failed to create landmark (Status ${res.status}).`,
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error creating landmark. Check backend URL.' });
    } finally {
      setSavingLandmark(false);
    }
  };

  // Trigger RAM cache refresh on NestJS backend
  const handleRefreshCache = async () => {
    try {
      setRefreshingCache(true);
      const res = await fetch(getUrl('/landmarks/refresh'), { method: 'POST' });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Backend memory cache manually synchronized!' });
        fetchLandmarks(selectedCity);
      } else {
        setFeedback({ type: 'error', message: 'Failed to refresh cache on server.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error while triggering cache refresh.' });
    } finally {
      setRefreshingCache(false);
    }
  };

  // Toggle Landmark Active Status
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(getUrl(`/landmarks/${id}/toggle`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        fetchLandmarks(selectedCity);
      }
    } catch (err) {
      console.error('Failed to toggle landmark active state', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-sans text-neutral-900">
      {/* HEADER & TAB NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-neutral-900">
            Operations Center
          </h1>
          <p className="text-sm font-medium text-neutral-500 mt-1">
            Configure system fare rates and manage local in-memory geographic landmarks.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="inline-flex p-1 bg-neutral-100 rounded-2xl border border-neutral-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'pricing'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Pricing Engine
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('landmarks')}
            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'landmarks'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Landmarks DB
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border shadow-sm transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-neutral-400 hover:text-neutral-600 font-black ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: PRICING ENGINE */}
      {activeTab === 'pricing' && (
        <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-xl font-black uppercase text-neutral-900">Vehicle Tariff Settings</h2>
            <p className="text-xs text-neutral-500">
              Adjust initial booking base rates and distance multipliers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Bike Base Fee (₦)"
              value={config.bikeBase}
              onChange={(val) => setConfig({ ...config, bikeBase: val })}
            />
            <Input
              label="Bike Per-KM Rate (₦)"
              value={config.bikePerKm}
              onChange={(val) => setConfig({ ...config, bikePerKm: val })}
            />
          </div>

          <div className="bg-neutral-950 p-6 rounded-2xl text-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
                Platform Revenue Cut
              </span>
              <span className="text-3xl font-black text-emerald-400">{config.platformCommission}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={config.platformCommission}
              onChange={(e) =>
                setConfig({ ...config, platformCommission: parseInt(e.target.value) || 0 })
              }
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <button
            type="button"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-xs tracking-wider transition shadow-sm"
          >
            Save Global Config
          </button>
        </div>
      )}

      {/* TAB 2: LANDMARK MANAGEMENT */}
      {activeTab === 'landmarks' && (
        <div className="space-y-8">
          {/* CREATE LANDMARK FORM CARD */}
          <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div>
                <h2 className="text-xl font-black uppercase text-neutral-900">Add New Landmark</h2>
                <p className="text-xs text-neutral-500">
                  New locations are saved to PostgreSQL and instantly hydrated into RAM.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefreshCache}
                disabled={refreshingCache}
                className="inline-flex items-center justify-center px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-black uppercase tracking-wider transition disabled:opacity-50"
              >
                {refreshingCache ? 'Syncing...' : '⚡ Sync Server RAM'}
              </button>
            </div>

            <form onSubmit={handleCreateLandmark} className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                    Landmark Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Old Garage Roundabout"
                    value={newLandmark.name}
                    onChange={(e) => setNewLandmark({ ...newLandmark, name: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 rounded-xl font-bold border border-neutral-200 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                    City *
                  </label>
                  <select
                    value={newLandmark.city}
                    onChange={(e) => {
                      setNewLandmark({ ...newLandmark, city: e.target.value });
                      setSelectedCity(e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-neutral-50 rounded-xl font-bold border border-neutral-200 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900 transition"
                  >
                    <option value="Osogbo">Osogbo</option>
                    <option value="Ilesha">Ilesha</option>
                    <option value="Ile-Ife">Ile-Ife</option>
                    <option value="Ibadan">Ibadan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={newLandmark.state}
                    onChange={(e) => setNewLandmark({ ...newLandmark, state: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 rounded-xl font-bold border border-neutral-200 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900 transition"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 7.7719"
                    value={newLandmark.latitude}
                    onChange={(e) => setNewLandmark({ ...newLandmark, latitude: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 rounded-xl font-bold border border-neutral-200 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 4.5581"
                    value={newLandmark.longitude}
                    onChange={(e) => setNewLandmark({ ...newLandmark, longitude: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 rounded-xl font-bold border border-neutral-200 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900 transition"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                    Aliases (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. garage, station road, bus stop"
                    value={newLandmark.aliases}
                    onChange={(e) => setNewLandmark({ ...newLandmark, aliases: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 rounded-xl font-bold border border-neutral-200 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                    Description / Extra Directions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite GTBank Junction"
                    value={newLandmark.description}
                    onChange={(e) =>
                      setNewLandmark({ ...newLandmark, description: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-50 rounded-xl font-bold border border-neutral-200 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingLandmark}
                className="w-full py-4 bg-neutral-900 hover:bg-black text-white rounded-2xl font-black uppercase text-xs tracking-wider transition shadow-md disabled:opacity-50"
              >
                {savingLandmark ? 'Saving Landmark...' : '+ Add Landmark to Database'}
              </button>
            </form>
          </div>

          {/* ACTIVE LANDMARKS LIST CARD */}
          <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div>
                <h2 className="text-xl font-black uppercase text-neutral-900">
                  Landmarks Directory ({selectedCity})
                </h2>
                <p className="text-xs text-neutral-500">
                  {landmarks.length} location{landmarks.length === 1 ? '' : 's'} registered for autocompletion.
                </p>
              </div>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200/70 rounded-xl font-bold text-xs uppercase tracking-wider outline-none cursor-pointer transition"
              >
                <option value="Osogbo">City: Osogbo</option>
                <option value="Ilesha">City: Ilesha</option>
                <option value="Ile-Ife">City: Ile-Ife</option>
                <option value="Ibadan">City: Ibadan</option>
              </select>
            </div>

            {loadingLandmarks ? (
              <div className="py-12 text-center space-y-2">
                <div className="inline-block w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Loading city landmarks from server memory...
                </p>
              </div>
            ) : landmarks.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
                <p className="text-sm font-bold text-neutral-500">
                  No landmarks found for <span className="text-neutral-900">{selectedCity}</span>.
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Fill in the form above to register key pickup points.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-neutral-200/60">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] uppercase font-black text-neutral-400 tracking-wider">
                      <th className="py-3.5 px-4">Landmark Name</th>
                      <th className="py-3.5 px-4">Coordinates</th>
                      <th className="py-3.5 px-4">Aliases</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs font-medium">
                    {landmarks.map((item) => {
                      const isItemActive = item.isActive !== false;
                      return (
                        <tr key={item.id} className="hover:bg-neutral-50/80 transition">
                          <td className="py-4 px-4 font-bold text-neutral-900">
                            <div>{item.name}</div>
                            {item.description && (
                              <div className="text-[11px] text-neutral-400 font-normal mt-0.5">
                                {item.description}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 font-mono text-[11px] text-neutral-600">
                            {item.latitude?.toFixed?.(4) ?? item.latitude},{' '}
                            {item.longitude?.toFixed?.(4) ?? item.longitude}
                          </td>
                          <td className="py-4 px-4 text-[11px] text-neutral-500">
                            {item.aliases && item.aliases.length > 0
                              ? item.aliases.join(', ')
                              : '--'}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                isItemActive
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isItemActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(item.id, isItemActive)}
                              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-[10px] font-black uppercase tracking-wider transition"
                            >
                              {isItemActive ? 'Disable' : 'Enable'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange?: (val: number) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange && onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-4 py-3 bg-neutral-50 rounded-xl font-bold border border-neutral-200 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900 transition"
      />
    </div>
  );
}