'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, ChevronDown, Search, Star, Heart, Bike } from 'lucide-react';
import { useAppLocation } from '@/src/context/AppLocationContext';
import { api } from '@/src/lib/api'; // 👈 Import your configured Axios client

export default function RestaurantsPage() {
  const router = useRouter();
  const { appLocation, startChangingLocation } = useAppLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        // Use the axios `api` instance which points to your backend URL base
        const res = await api.get(`/storefront/restaurants`, {
          params: { search: searchQuery }
        });
        const json = res.data;
        // Handle depending on whether your API returns the array directly or inside an object wrapper
        setRestaurants(Array.isArray(json) ? json : json.data || []);
      } catch (err) {
        console.error('Failed to load restaurants', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 300); // debounce search input

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const categories = ['All', 'Restaurants', 'Fast Food', 'Local Dishes', 'Grills'];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 pb-24">
      
      {/* Top Header Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-base font-black tracking-tight">Restaurants</h1>
          </div>

          <button
            type="button"
            onClick={() => {
              startChangingLocation();
              router.push('/location');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full text-xs font-bold text-neutral-800 transition-all max-w-[200px] cursor-pointer"
          >
            <MapPin size={13} className="text-emerald-600 shrink-0" />
            <span className="truncate">{appLocation?.address || 'Select Address'}</span>
            <ChevronDown size={12} className="shrink-0 text-neutral-500" />
          </button>

        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, cuisines, etc"
            className="w-full bg-white border border-neutral-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-emerald-600 shadow-xs"
          />
        </div>

        {/* Vendors Section Header */}
        <h2 className="text-sm font-black text-neutral-900 pt-2">All Vendors</h2>

        {/* Vendor List Feed */}
        {loading ? (
          <div className="space-y-4 pt-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-full h-44 bg-neutral-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-16 text-neutral-400 text-xs font-bold">
            No restaurants found. Try searching for something else!
          </div>
        ) : (
          <div className="space-y-4">
            {restaurants.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => router.push(`/food/restaurant/${vendor.id}`)}
                className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Vendor Cover / Banner Graphic */}
                <div className="w-full h-36 bg-emerald-950 rounded-xl overflow-hidden relative flex items-center justify-center border border-neutral-100 mb-3">
                  {vendor.logoUrl || vendor.bannerUrl ? (
                    <img 
                      src={vendor.logoUrl || vendor.bannerUrl} 
                      alt={vendor.businessName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  ) : (
                    <span className="text-base font-black text-emerald-100 px-4 text-center group-hover:scale-105 transition-transform">
                      {vendor.businessName}
                    </span>
                  )}
                </div>

                {/* Vendor Info Row */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-black text-neutral-900 group-hover:text-emerald-700 transition-colors">
                      {vendor.businessName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Bike size={13} className="text-emerald-600" /> {vendor.address || 'Delivery Available'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button type="button" onClick={(e) => { e.stopPropagation(); }} className="text-neutral-300 hover:text-rose-500 transition-colors">
                      <Heart size={18} />
                    </button>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200/50">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-black text-neutral-900">4.8</span>
                      <span className="text-[10px] text-neutral-500 font-medium">(120+)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}