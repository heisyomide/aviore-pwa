'use client';

import React from 'react';
import Link from 'next/link';

interface CorporateMetric {
  title: string;
  value: string;
  subtext: string;
  trend: string;
  trendType: 'positive' | 'neutral' | 'attention';
}

interface IncomingOrder {
  id: string;
  client: string;
  itemsCount: number;
  grossValue: number;
  fulfillmentType: 'Registry Gift' | 'Direct Purchase';
  status: 'pending_dispatch' | 'processing';
}

export default function BusinessOverviewPage() {
  
  // Real-time operations summary metrics
  const coreMetrics: CorporateMetric[] = [
    { title: 'Gross Registry Revenue', value: '₦1,842,500', subtext: 'Current billing cycle', trend: '+14.2% vs last month', trendType: 'positive' },
    { title: 'Awaiting Fulfillment', value: '12 Orders', subtext: 'In preparation or packaging', trend: '4 urgent dispatches', trendType: 'attention' },
    { title: 'Dispatched Waybills', value: '45 Consignments', subtext: 'In transit via Aviorè Network', trend: '98.4% ETA compliance', trendType: 'positive' },
  ];

  // High-priority active fulfillment orders feed
  const activeOrders: IncomingOrder[] = [
    { id: "AV-ORD-9081", client: "Chioma Amadi", itemsCount: 3, grossValue: 145000, fulfillmentType: 'Registry Gift', status: 'pending_dispatch' },
    { id: "AV-ORD-9076", client: "Olumide Bakare", itemsCount: 1, grossValue: 85000, fulfillmentType: 'Direct Purchase', status: 'processing' },
    { id: "AV-ORD-9072", client: "Fatima Yusuf", itemsCount: 5, grossValue: 320000, fulfillmentType: 'Registry Gift', status: 'pending_dispatch' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Matrix Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Enterprise Overview</h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">Control Panel for Main Hub Store</p>
        </div>
        
        {/* Rapid Utility Actions */}
        <div className="flex items-center gap-2">
          <Link 
            href="/business/dashboard/inventory"
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all text-center"
          >
            + Restock Item
          </Link>
          <Link 
            href="/business/dashboard/orders"
            className="bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all text-center"
          >
            Fulfill Waybills
          </Link>
        </div>
      </div>

      {/* Corporate Metric Framework Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coreMetrics.map((metric, idx) => (
          <div key={idx} className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="space-y-1">
              <p className="text-neutral-500 text-[11px] font-mono uppercase tracking-wider">{metric.title}</p>
              <p className="text-2xl font-black text-white tracking-tight">{metric.value}</p>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-neutral-400">{metric.subtext}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                metric.trendType === 'positive' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' :
                metric.trendType === 'attention' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40' :
                'bg-neutral-800 text-neutral-400'
              }`}>
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Split Operational Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Processing Manifest Stream (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">Fulfillment Pipeline Queue</h3>
            <Link href="/business/dashboard/orders" className="text-neutral-500 hover:text-neutral-300 text-xs font-bold">
              View All Order Logs →
            </Link>
          </div>

          <div className="space-y-2">
            {activeOrders.map((order) => (
              <div key={order.id} className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-800 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{order.client}</span>
                    <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-1.5 py-0.2 rounded">
                      {order.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    {order.itemsCount} units • <span className="text-neutral-500">{order.fulfillmentType}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-neutral-900 pt-3 sm:pt-0">
                  <div className="sm:text-right">
                    <p className="text-xs font-black text-white">₦{order.grossValue.toLocaleString()}</p>
                    <span className={`text-[9px] font-mono uppercase font-bold tracking-wider inline-block mt-0.5 ${
                      order.status === 'pending_dispatch' ? 'text-amber-400' : 'text-neutral-400'
                    }`}>
                      {order.status === 'pending_dispatch' ? '● Awaiting Dispatch' : '● Processing'}
                    </span>
                  </div>
                  
                  <Link
                    href={`/business/dashboard/orders?id=${order.id}`}
                    className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition-all"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rapid Logistics Allocation Hub (Right Column) */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">Logistics Connectivity</h3>
          
          <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-white">Aviorè Instant Dispatch System</p>
              <p className="text-[11px] text-neutral-400 leading-normal">
                Ready to outbound an unlisted corporate package or custom product to a partner address? Request a regional transit rider directly to your bay.
              </p>
            </div>
            
            <button 
              onClick={() => alert("Initiating regional hub courier lookup protocol...")}
              className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              🚀 Request Fleet Courier Dispatch
            </button>

            <div className="border-t border-neutral-900 pt-3 flex items-center justify-between">
              <span className="text-[10px] text-neutral-500 font-mono">Active Local Hub:</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500 block animate-pulse" /> Connected
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}