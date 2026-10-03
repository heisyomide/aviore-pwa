"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Search, CheckCircle2, Loader2, Plus, Star } from "lucide-react";
import { api } from "@/src/lib/api";

interface Landmark {
  id: string;
  name: string;
  description: string;
  city: string;
}

interface Address {
  id: string;
  streetAddress: string;
  landmark: Landmark;
  isDefault: boolean;
}

export default function AddressManagementPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [streetAddress, setStreetAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  useEffect(() => {
    if (showAddForm) {
      fetchLandmarks();
    }
  }, [searchQuery, showAddForm]);

  const fetchUserAddresses = async () => {
    try {
      setFetching(true);
      const { data } = await api.get('/profile/addresses');
      setAddresses(data || []);
    } catch (err) {
      console.error("Failed to fetch user addresses", err);
    } finally {
      setFetching(false);
    }
  };

  const fetchLandmarks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/landmarks/search?city=Osogbo&query=${encodeURIComponent(searchQuery)}`);
      setLandmarks(data || []);
    } catch (err) {
      console.error("Failed to fetch landmarks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLandmark || !streetAddress.trim()) return;

    try {
      setSaving(true);
      setSuccessMessage("");
      await api.post('/profile/addresses', {
        landmarkId: selectedLandmark.id,
        streetAddress: streetAddress.trim(),
      });
      setSuccessMessage("New delivery address added successfully!");
      setStreetAddress("");
      setSelectedLandmark(null);
      setShowAddForm(false);
      fetchUserAddresses();
    } catch (err) {
      console.error("Failed to add address", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await api.patch(`/profile/addresses/${addressId}/default`, {});
      setSuccessMessage("Default delivery address updated!");
      fetchUserAddresses();
    } catch (err) {
      console.error("Failed to set default address", err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-28">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/dashboard/profile" className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-800 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-sm font-black text-neutral-900">Delivery Addresses</h1>
          <div className="w-9"></div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 mt-6 space-y-6">
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Existing Addresses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">Saved Addresses</h2>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add New Address</span>
              </button>
            )}
          </div>

          {fetching ? (
            <div className="py-12 text-center">
              <Loader2 size={24} className="animate-spin text-emerald-600 mx-auto" />
            </div>
          ) : addresses.length > 0 ? (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white rounded-3xl border p-5 transition-all shadow-xs flex items-start justify-between gap-4 ${
                    addr.isDefault ? "border-emerald-600 ring-1 ring-emerald-600" : "border-neutral-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-2xl mt-0.5 ${addr.isDefault ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-500"}`}>
                      <MapPin size={18} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black text-neutral-900">{addr.streetAddress}</h3>
                        {addr.isDefault && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-neutral-700">Near {addr.landmark?.name}</p>
                      <p className="text-[11px] text-neutral-500 font-medium">{addr.landmark?.description}</p>
                    </div>
                  </div>

                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="shrink-0 text-xs font-bold text-neutral-600 hover:text-emerald-600 bg-neutral-100 hover:bg-emerald-50 px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Star size={14} />
                      <span>Make Default</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 text-center space-y-3">
              <p className="text-xs text-neutral-500 font-medium">No saved delivery addresses yet.</p>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-neutral-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Add Your First Address
                </button>
              )}
            </div>
          )}
        </div>

        {/* Add New Address Form Modal/Section */}
        {showAddForm && (
          <form onSubmit={handleAddAddress} className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-6 shadow-sm animate-in fade-in-50">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900">Add Delivery Address</h2>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs font-bold text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">House Number & Street Name</label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. Plot 14, CAC Street"
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700">Select Osogbo Landmark</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search landmark (e.g. Old Garage, Oke-Fia)..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pl-10 pr-3 py-3 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {loading ? (
                    <div className="py-4 text-center">
                      <Loader2 size={18} className="animate-spin text-emerald-600 mx-auto" />
                    </div>
                  ) : landmarks.length > 0 ? (
                    landmarks.map((landmark) => {
                      const isSelected = selectedLandmark?.id === landmark.id;
                      return (
                        <div
                          key={landmark.id}
                          onClick={() => setSelectedLandmark(landmark)}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected ? "border-emerald-600 bg-emerald-50/50" : "border-neutral-100 hover:bg-neutral-50"
                          }`}
                        >
                          <MapPin size={16} className={`mt-0.5 shrink-0 ${isSelected ? "text-emerald-600" : "text-neutral-400"}`} />
                          <div>
                            <h3 className="text-xs font-black text-neutral-900">{landmark.name}</h3>
                            <p className="text-[11px] text-neutral-500 font-medium">{landmark.description}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-neutral-400 text-center py-2">No matching Osogbo landmarks found.</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || !selectedLandmark || !streetAddress.trim()}
              className="w-full bg-neutral-900 hover:bg-black text-white p-4 rounded-3xl font-black text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              <span>Save Address</span>
            </button>
          </form>
        )}
      </main>
    </div>
  );
}