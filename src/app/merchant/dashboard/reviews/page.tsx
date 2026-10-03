"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import {api} from "@/src/lib/api";

export default function MerchantReviewsPage() {
  const [data, setData] = useState({ reviews: [], averageRating: "0.0", totalCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/merchant/dashboard/reviews")
      .then(res => {
        if (res.data) setData(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-600" size={24} /></div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/merchant/dashboard/more" className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Customer Reviews</h1>
      </div>

      <div className="bg-amber-600 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-100">Overall Rating</span>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-black font-mono">{data.averageRating}</h3>
            <div className="flex items-center text-amber-200">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-amber-100">Based on {data.totalCount} completed customer orders</p>
        </div>
      </div>

      <div className="space-y-3">
        {data.reviews.length === 0 ? (
          <p className="text-center text-neutral-400 text-xs py-8">No customer reviews received yet.</p>
        ) : (
          data.reviews.map((rev: any) => (
            <div key={rev.id} className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-700">
                    {rev.customer}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-950">{rev.customer}</h3>
                    <p className="text-[10px] text-neutral-400 font-mono">{rev.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold font-mono">{rev.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 italic">"{rev.comment}"</p>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Ordered item: <strong className="text-neutral-700">{rev.item}</strong></span>
                <button onClick={() => alert("Reply feature coming soon!")} className="text-amber-600 font-bold hover:underline">Reply</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}