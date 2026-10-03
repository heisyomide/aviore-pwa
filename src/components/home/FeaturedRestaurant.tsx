'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flame, Star, ShieldCheck, Heart, ArrowRight, Bike } from 'lucide-react';

export interface Merchant {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  address?: string;
  distance?: string;
  href?: string;
}

interface FeaturedRestaurantsProps {
  merchants: Merchant[];
  loading?: boolean;
}

export default function FeaturedRestaurantsSection({ merchants = [], loading = false }: FeaturedRestaurantsProps) {
  const router = useRouter();
  const displayMerchants = merchants.slice(0, 5);

  return (
    <section className="py-9 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <h2 className="text-lg font-black text-neutral-900 tracking-tight">Featured</h2>
          <span className="text-base">✨</span>
        </div>
        <Link 
          href="/food" 
          className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
        >
          <span>See All</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-hidden py-1">
          {[1, 2, 3].map((n) => (
            <div key={n} className="min-w-[260px] sm:min-w-[300px] h-48 bg-neutral-100 rounded-2xl animate-pulse shrink-0" />
          ))}
        </div>
      ) : displayMerchants.length > 0 ? (
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {displayMerchants.map((merchant) => {
            const merchantHref = merchant.href || `/food/restaurant/${merchant.id}`;
            const imageUrl = merchant.imageUrl;
            const merchantName = merchant.name;

            return (
              <div
                key={merchant.id}
                onClick={() => router.push(merchantHref)}
                className="bg-white rounded-2xl border border-neutral-100 p-2.5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between min-w-[260px] sm:min-w-[280px] max-w-[280px] shrink-0 cursor-pointer group"
              >
                {/* Compact Image Card */}
                <div className="relative h-32 w-full rounded-xl overflow-hidden bg-neutral-900 flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={merchantName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-xs font-black text-white px-3 text-center truncate">
                      {merchantName}
                    </span>
                  )}
                  
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); }} 
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-neutral-500 hover:text-rose-500 transition-colors shadow-xs"
                  >
                    <Heart size={13} />
                  </button>
                </div>

                {/* Compact Details matching reference image */}
                <div className="pt-2 px-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-neutral-900 text-xs group-hover:text-emerald-600 transition-colors truncate">
                      {merchantName}
                    </h3>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <ShieldCheck size={13} className="text-emerald-500 fill-emerald-500/20" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[11px] font-medium text-neutral-500">
                    <span className="flex items-center gap-1 text-neutral-600">
                      <Bike size={13} className="text-neutral-500 shrink-0" />
                      From ₦595
                    </span>
                    <div className="flex items-center gap-1 font-bold text-neutral-900">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>4.6 <span className="text-neutral-400 font-normal">(14949)</span></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-neutral-200">
          <p className="text-xs font-bold text-neutral-700">No featured spots available right now.</p>
        </div>
      )}
    </section>
  );
}