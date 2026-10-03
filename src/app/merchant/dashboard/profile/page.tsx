"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Camera, Save, Copy, Check, Edit3, X, MapPin, Search, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { api } from "@/src/lib/api";

interface Landmark {
  id: string;
  name: string;
  description: string;
  city: string;
}

export default function MerchantProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Editable form states
  const [storeName, setStoreName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [description, setDescription] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  
  // File & preview states for local mobile uploads
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

  // Hidden file input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Landmark selection states
  const [searchQuery, setSearchQuery] = useState("");
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [landmarkLoading, setLandmarkLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get('/merchant/dashboard/profile');
        const pData = data?.profile || data;

        setProfile(pData);
        setStoreName(pData.storeName || pData.businessName || "");
        setPhone(pData.phone || "");
        setStreetAddress(pData.streetAddress || pData.address || "");
        setDescription(pData.description || "");
        setStoreSlug(pData.storeSlug || "");
        setLogoPreview(pData.logoUrl || "");
        setCoverPreview(pData.coverUrl || "");
        if (pData.landmark) {
          setSelectedLandmark(pData.landmark);
        }
      } catch (err) {
        console.error("Failed to load business profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    if (isEditModalOpen) {
      fetchLandmarks();
    }
  }, [searchQuery, isEditModalOpen]);

  const fetchLandmarks = async () => {
    try {
      setLandmarkLoading(true);
      const { data } = await api.get(`/landmarks/search?city=Osogbo&query=${encodeURIComponent(searchQuery)}`);
      setLandmarks(data || []);
    } catch (err) {
      console.error("Failed to fetch landmarks", err);
    } finally {
      setLandmarkLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleCopyLink = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.storeUrl || `https://aviorego.com.ng/${profile.storeSlug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploadingImages(true);

      const formData = new FormData();
      formData.append("storeName", storeName);
      formData.append("phone", phone);
      formData.append("streetAddress", streetAddress);
      if (selectedLandmark) {
        formData.append("landmarkId", selectedLandmark.id);
      }
      formData.append("description", description);
      formData.append("storeSlug", storeSlug);

      if (logoFile) {
        formData.append("logo", logoFile);
      }
      if (coverFile) {
        formData.append("cover", coverFile);
      }

      const { data } = await api.patch('/merchant/dashboard/profile', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const pData = data?.profile || data;
      setProfile(pData);
      setLogoPreview(pData.logoUrl || logoPreview);
      setCoverPreview(pData.coverUrl || coverPreview);
      setIsEditModalOpen(false);
      alert("Restaurant profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile", err);
      alert("Failed to update profile.");
    } finally {
      setUploadingImages(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-neutral-400">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/merchant/dashboard/more" className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-black tracking-tight text-neutral-950">Restaurant Profile</h1>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Edit3 size={14} /> Edit Profile
        </button>
      </div>

      {/* Read-Only Profile Overview */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-700">Store Cover & Logo</label>
          <div 
            className="h-32 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 relative overflow-hidden border border-neutral-200 bg-cover bg-center"
            style={{ backgroundImage: profile?.coverUrl ? `url(${profile.coverUrl})` : undefined }}
          >
            {!profile?.coverUrl && <Camera size={24} />}
            <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl border-2 border-white bg-neutral-200 bg-cover bg-center shadow-md"
              style={{ backgroundImage: profile?.logoUrl ? `url(${profile.logoUrl})` : undefined }}
            />
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">Restaurant Name</span>
            <p className="font-bold text-neutral-900 text-sm">{profile?.storeName || profile?.businessName || "Not set"}</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">Storefront Link</span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-amber-600 truncate">{profile?.storeUrl || `https://aviorego.com.ng/${profile?.storeSlug}`}</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold transition-colors flex items-center gap-1 shrink-0"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Phone Number</span>
              <p className="font-bold text-neutral-900">{profile?.phone || "Not set"}</p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Restaurant ID</span>
              <p className="font-bold text-neutral-900">{profile?.restaurantId || "Not set"}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">Location & Landmark</span>
            <p className="font-bold text-neutral-900">{profile?.streetAddress || profile?.address || "Not set"}</p>
            {profile?.landmark && (
              <div className="flex items-center gap-1.5 text-neutral-500 pt-1">
                <MapPin size={12} className="text-amber-600" />
                <span>Near {profile.landmark.name}</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">Short Description</span>
            <p className="font-medium text-neutral-700 leading-relaxed">{profile?.description || "No description provided."}</p>
          </div>
        </div>
      </div>

      {/* Edit Modal Popup */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-neutral-950">Edit Restaurant Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Hidden File Inputs for Device Gallery/Camera */}
              <input 
                type="file" 
                ref={logoInputRef} 
                onChange={handleLogoChange} 
                accept="image/*" 
                className="hidden" 
              />
              <input 
                type="file" 
                ref={coverInputRef} 
                onChange={handleCoverChange} 
                accept="image/*" 
                className="hidden" 
              />

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700">Cover & Logo Image</label>
                <div 
                  onClick={() => coverInputRef.current?.click()}
                  className="h-32 rounded-2xl bg-neutral-100 flex flex-col items-center justify-center text-neutral-500 relative overflow-hidden border-2 border-dashed border-neutral-300 bg-cover bg-center cursor-pointer hover:border-amber-600 transition-all"
                  style={{ backgroundImage: coverPreview ? `url(${coverPreview})` : undefined }}
                >
                  {!coverPreview && (
                    <>
                      <Upload size={20} className="mb-1 text-amber-600" />
                      <span className="text-[11px] font-bold">Tap to upload cover photo</span>
                    </>
                  )}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      logoInputRef.current?.click();
                    }}
                    className="absolute bottom-3 left-3 w-12 h-12 rounded-xl border-2 border-white bg-neutral-200 bg-cover bg-center shadow-md flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundImage: logoPreview ? `url(${logoPreview})` : undefined }}
                  >
                    {!logoPreview && <Camera size={16} className="text-neutral-600" />}
                  </div>
                </div>
                <p className="text-[10px] text-neutral-400 font-medium">Tap the card to change your cover, or the small circle for your logo.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Restaurant Name</label>
                <input 
                  type="text" 
                  value={storeName} 
                  onChange={(e) => setStoreName(e.target.value)} 
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">House Number & Street Name</label>
                <input 
                  type="text" 
                  value={streetAddress} 
                  onChange={(e) => setStreetAddress(e.target.value)} 
                  placeholder="e.g. Plot 14, CAC Street"
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 focus:outline-none focus:border-amber-600"
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
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pl-10 pr-3 py-3 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {landmarkLoading ? (
                    <div className="py-4 text-center">
                      <Loader2 size={18} className="animate-spin text-amber-600 mx-auto" />
                    </div>
                  ) : landmarks.length > 0 ? (
                    landmarks.map((landmark) => {
                      const isSelected = selectedLandmark?.id === landmark.id;
                      return (
                        <div
                          key={landmark.id}
                          onClick={() => setSelectedLandmark(landmark)}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected ? "border-amber-600 bg-amber-50/50" : "border-neutral-100 hover:bg-neutral-50"
                          }`}
                        >
                          <MapPin size={16} className={`mt-0.5 shrink-0 ${isSelected ? "text-amber-600" : "text-neutral-400"}`} />
                          <div>
                            <h3 className="text-xs font-black text-neutral-900">{landmark.name}</h3>
                            <p className="text-[11px] text-neutral-500 font-medium">{landmark.description}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-neutral-400 text-center py-2">No matching landmarks found.</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Short Description</label>
                <textarea 
                  rows={3}
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 focus:outline-none focus:border-amber-600 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={uploadingImages}
                  className="w-1/2 py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploadingImages}
                  className="w-1/2 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploadingImages ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}