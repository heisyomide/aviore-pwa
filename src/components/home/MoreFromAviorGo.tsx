'use client';

import React from 'react';
import { Package, ShieldCheck, ShoppingBag, ChevronRight } from 'lucide-react';

export default function MoreFromAviorGo() {
  const items = [
    {
      title: 'Send a Package',
      description: 'Fast & reliable delivery',
      icon: <Package className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50/60 border-amber-100',
      action: () => {
        // Handle navigation or link to package delivery route
      }
    },
    {
      title: 'Event Logistics',
      description: 'Transport & more',
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50/60 border-blue-100',
      action: () => {
        // Handle event logistics navigation
      }
    },
    {
      title: 'Shop on Avio Marketplace',
      description: 'Fashion, electronics & more',
      icon: <ShoppingBag className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50/60 border-purple-100',
      action: () => {
        window.open('https://shopaviore.store', '_blank');
      }
    }
  ];

  return (
    <div className="w-full px-4 py-16">
      <h3 className="text-base font-bold text-neutral-900 mb-3 px-1">
        More from AviorèGo
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={item.action}
            className={`flex items-center justify-between p-4 rounded-2xl border ${item.bg} cursor-pointer hover:shadow-md transition-all group`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-white shadow-sm flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-500 font-medium">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm group-hover:translate-x-0.5 transition-transform">
              <ChevronRight size={16} className="text-neutral-400 group-hover:text-neutral-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}