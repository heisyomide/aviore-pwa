"use client";

import React, { useState, useEffect } from "react";
import { api } from '@/src/lib/api';
import { 
  Bell, 
  Power, 
  TrendingUp, 
  CheckCircle2, 
  ShoppingBag,
  Clock,
  Store,
  ChevronRight,
  Loader2,
  Utensils,
  Truck,
  Check,
  XCircle,
  Package
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedAddOns?: any;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  merchantShare?: number;
  subTotal?: number;
  totalPrice?: number;
  status: string;
  deliveryStatus?: string;
  deliveryAddress?: string;
  items?: OrderItem[];
  shipment?: any;
}

export default function MerchantHomePage() {
  const [loading, setLoading] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [storeName, setStoreName] = useState("Mama's Kitchen");
  const [metrics, setMetrics] = useState({ ordersCount: 0, revenue: 0, rating: 4.8 });
  const [pipelineCounts, setPipelineCounts] = useState({ new: 0, preparing: 0, ready: 0, delivery: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'NEW' | 'PREPARING' | 'READY' | 'DELIVERY'>('ALL');
  const [error, setError] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get("/merchant/dashboard");
      setStoreName(data.storeName || "My Store");
      setIsStoreOpen(data.isStoreOpen);
      setMetrics(data.metrics);
      setPipelineCounts(data.pipelineCounts);
      setOrders(data.orders || []);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Merchant profile not found. Please complete your onboarding steps.");
      } else {
        setError("Failed to fetch dashboard overview.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleStoreStatus = async () => {
    const nextState = !isStoreOpen;
    setIsStoreOpen(nextState);
    setToggleError(null);

    try {
      await api.patch("/merchant/dashboard/status", { isOpen: nextState });
    } catch (err: any) {
      setIsStoreOpen(!nextState);
      const message = err.response?.data?.message || "Failed to update store status based on operating hours.";
      setToggleError(message);
      setTimeout(() => setToggleError(null), 5000);
    }
  };

  const updateOrderStatus = async (orderId: string, nextStatus: string) => {
    try {
      await api.patch(`/merchant/dashboard/orders/${orderId}/status`, { status: nextStatus });
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const getMerchantPayout = (ord: Order) => {
    return Number(ord.merchantShare ?? (Number(ord.subTotal || 0) * 0.9));
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'NEW') return o.status === 'PENDING' || o.status === 'NEW';
    if (activeTab === 'PREPARING') return o.status === 'ACCEPTED' || o.status === 'PREPARING';
    if (activeTab === 'READY') return o.status === 'READY_FOR_PICKUP' || o.status === 'READY' || o.status === 'ARRIVED_AT_HUB';
    if (activeTab === 'DELIVERY') return o.status === 'OUT_FOR_DELIVERY' || o.deliveryStatus === 'OUT_FOR_DELIVERY';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }



  return (
    <div className="space-y-6 pb-8">
      {/* Schedule / Toggle Error Banner */}
      {toggleError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs font-bold animate-in fade-in flex items-center justify-between">
          <span>⚠️ {toggleError}</span>
          <button onClick={() => setToggleError(null)} className="text-amber-900 font-black hover:opacity-75">✕</button>
        </div>
      )}

      {/* Merchant Header Command */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200/80 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
            {storeName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-neutral-950">{storeName}</h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${isStoreOpen ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isStoreOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                {isStoreOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            <p className="text-xs text-neutral-500">Operational Command Center</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleStoreStatus}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${isStoreOpen ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            <Power size={14} />
            {isStoreOpen ? 'Close Store' : 'Open Store'}
          </button>

          <div className="relative p-2.5 rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors cursor-pointer">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600" />
          </div>
        </div>
      </div>

      {/* Today's Overview Banner Card (Net Payout Revenue) */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white p-6 rounded-3xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-100">Today's Overview</span>
          <button className="text-xs font-bold bg-white/25 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-colors backdrop-blur-sm">
            View report
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div>
            <span className="text-[11px] text-amber-100 font-mono">Orders</span>
            <h3 className="text-2xl font-black font-mono">{metrics.ordersCount}</h3>
          </div>
          <div>
            <span className="text-[11px] text-amber-100 font-mono">Net Payout</span>
            <h3 className="text-2xl font-black font-mono">₦{metrics.revenue.toLocaleString()}</h3>
          </div>
          <div>
            <span className="text-[11px] text-amber-100 font-mono">Rating</span>
            <h3 className="text-2xl font-black font-mono">{metrics.rating} <span className="text-xs font-normal">⭐</span></h3>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-2xl text-center">
            <span className="block text-sm font-black font-mono">{pipelineCounts.new}</span>
            <span className="text-[9px] uppercase tracking-wider text-amber-100">New</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-2xl text-center">
            <span className="block text-sm font-black font-mono">{pipelineCounts.preparing}</span>
            <span className="text-[9px] uppercase tracking-wider text-amber-100">Preparing</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-2xl text-center">
            <span className="block text-sm font-black font-mono">{pipelineCounts.ready}</span>
            <span className="text-[9px] uppercase tracking-wider text-amber-100">Ready</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-2xl text-center">
            <span className="block text-sm font-black font-mono">{pipelineCounts.delivery}</span>
            <span className="text-[9px] uppercase tracking-wider text-amber-100">Delivery</span>
          </div>
        </div>
      </div>

      {/* Order Pipeline Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['ALL', 'NEW', 'PREPARING', 'READY', 'DELIVERY'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-neutral-950 text-white shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Orders List Feed (Strictly Net Payout View) */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <p className="text-xs text-neutral-400 bg-white border border-neutral-200/80 p-8 rounded-3xl text-center">
            No orders found under &quot;{activeTab.toLowerCase()}&quot;.
          </p>
        ) : (
          filteredOrders.map((ord) => {
            const payoutAmount = getMerchantPayout(ord);
            const isNew = ord.status === 'PENDING' || ord.status === 'NEW';
            const isPreparing = ord.status === 'ACCEPTED' || ord.status === 'PREPARING';
            const isReady = ord.status === 'READY_FOR_PICKUP' || ord.status === 'READY';

            return (
              <div key={ord.id} className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black bg-neutral-900 text-white uppercase">
                      {ord.status}
                    </span>
                    <span className="text-xs font-mono font-black text-neutral-900">
                      #{ord.orderNumber || ord.id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1">
                  <p className="text-[11px] text-neutral-400 uppercase font-mono">Delivery Location</p>
                  <p className="text-xs font-bold text-neutral-900">{ord.deliveryAddress || "Standard Delivery Order"}</p>
                </div>

                {/* Ordered Items Summary */}
                {ord.items && ord.items.length > 0 && (
                  <div className="bg-neutral-50 rounded-2xl p-3 space-y-1.5 border border-neutral-100">
                    <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Items Breakdown</p>
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-neutral-700">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-mono text-neutral-500">₦{(Number(item.price) * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Payout & Lifecycle Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-neutral-100 gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block">Your Net Payout</span>
                    <span className="text-base font-mono font-black text-emerald-700">
                      ₦{payoutAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {isNew && (
                      <>
                        <button 
                          onClick={() => updateOrderStatus(ord.id, 'CANCELLED')}
                          className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors border border-neutral-200"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(ord.id, 'ACCEPTED')}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm"
                        >
                          Accept Order
                        </button>
                      </>
                    )}

                    {isPreparing && (
                      <button 
                        onClick={() => updateOrderStatus(ord.id, 'READY_FOR_PICKUP')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <Check size={14} /> Mark Ready
                      </button>
                    )}

                    {isReady && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        Waiting for Rider Pickup
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}