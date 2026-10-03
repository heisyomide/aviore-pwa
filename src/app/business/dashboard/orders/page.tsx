'use client';

import React, { useState } from 'react';

interface OrderItem {
  id: string;
  customerName: string;
  date: string;
  product: string;
  category: 'Registry Gift' | 'Direct Purchase';
  value: number;
  status: 'Awaiting Pack' | 'Handed to Rider' | 'Delivered';
  destination: string;
}

export default function BusinessOrdersPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'registry' | 'direct'>('all');

  // Master manifest ledger for tracking high-end outbound items
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: "AV-ORD-9081", customerName: "Chioma Amadi", date: "Today, 08:30 AM", product: "Minimalist Silver Tea Set", category: 'Registry Gift', value: 145000, status: 'Awaiting Pack', destination: "Ikoyi, Lagos" },
    { id: "AV-ORD-9076", customerName: "Olumide Bakare", date: "Yesterday", product: "Premium Wine Red Velvet Throw", category: 'Direct Purchase', value: 85000, status: 'Handed to Rider', destination: "Lekki Phase 1, Lagos" },
    { id: "AV-ORD-9072", customerName: "Fatima Yusuf", date: "03 Jul 2026", product: "Matte Black Audio System Core", category: 'Registry Gift', value: 320000, status: 'Delivered', destination: "Bodija, Ibadan" },
    { id: "AV-ORD-8941", customerName: "Efe Chenemi", date: "01 Jul 2026", product: "Titanium Mechanical Desk Clock", category: 'Direct Purchase', value: 110000, status: 'Delivered', destination: "Victoria Island, Lagos" },
  ]);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'registry') return order.category === 'Registry Gift';
    if (activeTab === 'direct') return order.category === 'Direct Purchase';
    return true;
  });

  const updateStatus = (id: string, newStatus: 'Awaiting Pack' | 'Handed to Rider' | 'Delivered') => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="space-y-6">
      
      {/* View Title Frame */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Orders & Registry Manifest</h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">Track and authorize premium outbound delivery pipelines.</p>
        </div>

        {/* Dynamic Stream Filter Segment */}
        <div className="bg-neutral-900 border border-neutral-800 p-1 rounded-xl flex items-center self-start sm:self-auto">
          {(['all', 'registry', 'direct'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all capitalize ${
                activeTab === tab 
                  ? 'bg-neutral-800 text-white shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab === 'all' ? 'All Channels' : tab === 'registry' ? 'Registry Orders' : 'Direct Retail'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Order Pipeline Stream List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-12 text-center text-xs text-neutral-500">
            No active manifest entries found for this channel.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-neutral-800 transition-all"
            >
              {/* Left Column: Context Identity Metadata */}
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black text-white">{order.product}</span>
                  <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-1.5 py-0.2 rounded">
                    {order.id}
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md font-bold tracking-tight border ${
                    order.category === 'Registry Gift' 
                      ? 'bg-purple-950/40 text-purple-400 border-purple-900/50' 
                      : 'bg-neutral-950/60 text-neutral-400 border-neutral-800'
                  }`}>
                    {order.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-4 text-[11px] font-mono text-neutral-400">
                  <p><span className="text-neutral-600 font-sans">Recipient:</span> {order.customerName}</p>
                  <p><span className="text-neutral-600 font-sans">Route:</span> {order.destination}</p>
                  <p className="col-span-2 sm:col-span-1"><span className="text-neutral-600 font-sans">Logged:</span> {order.date}</p>
                </div>
              </div>

              {/* Right Column: Settlement Values & Status Triggers */}
              <div className="flex flex-wrap items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-neutral-900 pt-4 lg:pt-0 shrink-0">
                <div className="lg:text-right">
                  <p className="text-sm font-black text-white">₦{order.value.toLocaleString()}</p>
                  <p className={`text-[10px] font-mono uppercase font-bold mt-0.5 ${
                    order.status === 'Awaiting Pack' ? 'text-amber-400' :
                    order.status === 'Handed to Rider' ? 'text-blue-400' : 'text-emerald-400'
                  }`}>
                    ● {order.status}
                  </p>
                </div>

                {/* State Transition Matrix Toggles */}
                <div className="flex items-center gap-1.5">
                  {order.status === 'Awaiting Pack' && (
                    <button
                      onClick={() => updateStatus(order.id, 'Handed to Rider')}
                      className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition-all"
                    >
                      🤝 Hand over to Fleet Rider
                    </button>
                  )}
                  {order.status === 'Handed to Rider' && (
                    <button
                      onClick={() => updateStatus(order.id, 'Delivered')}
                      className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-[11px] font-bold px-3 py-2 rounded-xl transition-all"
                    >
                      ✓ Mark Delivered (PIN Verified)
                    </button>
                  )}
                  {order.status === 'Delivered' && (
                    <span className="text-[10px] font-mono text-neutral-600 bg-neutral-950 px-2.5 py-1.5 rounded-xl border border-neutral-900">
                      Archive Ledger Closed
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}