"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Store, 
  FileText, 
  Clock, 
  Truck, 
  CreditCard, 
  Bell, 
  Tag, 
  Star, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Copy,
  Check
} from "lucide-react";
import { api } from "@/src/lib/api";

export default function MerchantMorePage() {
  const [profile, setProfile] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/merchant/dashboard/profile');
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch merchant profile", err);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (profile?.storeUrl) {
      navigator.clipboard.writeText(profile.storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const menuSections = [
    {
      title: "Restaurant Management",
      items: [
        { label: "Restaurant Profile", icon: Store, href: "/merchant/dashboard/profile" },
        { label: "Business Information", icon: FileText, href: "/merchant/dashboard/business" },
        { label: "Opening Hours", icon: Clock, href: "/merchant/dashboard/hours" },
        { label: "Delivery Settings", icon: Truck, href: "/merchant/dashboard/delivery" },
        { label: "Bank Account", icon: CreditCard, href: "/merchant/dashboard/bank" },
      ]
    },
    {
      title: "Preferences & Support",
      items: [
        { label: "Notifications", icon: Bell, href: "/merchant/dashboard/notifications" },
        { label: "Promotions", icon: Tag, href: "/merchant/dashboard/promotions" },
        { label: "Reviews", icon: Star, badge: "New", href: "/merchant/dashboard/reviews" },
        { label: "Help & Support", icon: HelpCircle, href: "/merchant/dashboard/support" },
      ]
    }
  ];

  const storeName = profile?.storeName || "Loading...";
  const restaurantId = profile?.restaurantId || "AVG-....";
  const initialLetter = storeName !== "Loading..." ? storeName.charAt(0).toUpperCase() : "M";

  return (
    <div className="space-y-6 pb-8">
      
      <h1 className="text-xl font-black tracking-tight text-neutral-950">More</h1>

      {/* Dynamic Business Profile Card */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-4 shadow-sm space-y-3">
        <Link 
          href="/merchant/dashboard/profile"
          className="flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-black text-lg">
              {initialLetter}
            </div>
            <div className="space-y-0.5">
              <h2 className="text-sm font-black text-neutral-950 group-hover:text-emerald-600 transition-colors">{storeName}</h2>
              <p className="text-[11px] font-mono text-neutral-400">Restaurant ID: {restaurantId}</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-neutral-400" />
        </Link>

        {/* Copy Store Link Action */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-500 truncate max-w-[220px]">
            {profile?.storeUrl || "Loading storefront link..."}
          </span>
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>
      </div>

      {/* Grouped Settings Sections */}
      <div className="space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <div className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-sm divide-y divide-neutral-100">
              {section.items.map((item, itemIdx) => {
                const IconComponent = item.icon;
                return (
                  <Link 
                    key={itemIdx} 
                    href={item.href}
                    className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors block"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-500">
                        <IconComponent size={18} />
                      </span>
                      <span className="text-xs font-bold text-neutral-900">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={16} className="text-neutral-300" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="pt-2">
        <Link 
          href="/login"
          className="w-full flex items-center gap-3 p-4 rounded-3xl bg-rose-50/80 hover:bg-rose-100 text-rose-600 transition-colors border border-rose-100 block text-center justify-center"
        >
          <LogOut size={18} />
          <span className="text-xs font-bold">Logout</span>
        </Link>
      </div>

    </div>
  );
}