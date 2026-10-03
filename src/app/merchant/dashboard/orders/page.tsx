"use client";

import React, { useState, useEffect, useMemo } from "react";
import { api } from '@/src/lib/api';
import { ShoppingBag, Truck, Search, Loader2, ChevronDown, ChevronUp } from "lucide-react";

export default function MerchantOrdersPage() {
  const [activeTab, setSearchTab] = useState<string>("new");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({});

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/merchant/dashboard");
      setOrders(data.orders || []);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Merchant profile not found. Please complete your onboarding.");
      } else {
        setError("Failed to fetch orders.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: string, nextStatus: string) => {
    try {
      await api.patch(`/merchant/dashboard/orders/${orderId}/status`, { status: nextStatus });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tabs = useMemo(() => [
    { id: "new", label: "New", count: orders.filter((o) => o.status === "PENDING" || o.status === "NEW").length },
    { id: "preparing", label: "Preparing", count: orders.filter((o) => o.status === "ACCEPTED" || o.status === "PREPARING").length },
    { id: "ready", label: "Ready", count: orders.filter((o) => o.status === "READY_FOR_PICKUP" || o.status === "ARRIVED_AT_HUB" || o.status === "READY").length },
    { id: "completed", label: "Completed", count: orders.filter((o) => o.status === "DELIVERED" || o.status === "COMPLETED").length },
  ], [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const st = (o.status || "").toUpperCase();
      if (activeTab === "new") return st === "PENDING" || st === "NEW";
      if (activeTab === "preparing") return st === "ACCEPTED" || st === "PREPARING";
      if (activeTab === "ready") return st === "READY_FOR_PICKUP" || st === "ARRIVED_AT_HUB" || st === "READY";
      if (activeTab === "completed") return st === "DELIVERED" || st === "COMPLETED";
      return false;
    });
  }, [orders, activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }


  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Orders</h1>
        <div className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 shadow-sm cursor-pointer">
          <Search size={18} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-12 text-center space-y-3">
            <ShoppingBag size={32} className="mx-auto text-neutral-300" />
            <p className="text-sm font-bold text-neutral-900">No orders found in this category</p>
            <p className="text-xs text-neutral-500">Incoming shipments will display here dynamically.</p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const isExpanded = !!expandedOrderIds[ord.id];
            const displayTotal = Number(ord.subTotal ?? ord.totalPrice ?? 0);
            const itemsList = ord.items || [];

            return (
              <div key={ord.id} className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold uppercase ${
                      ord.status === 'PENDING' || ord.status === 'NEW' ? 'bg-rose-500 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.status}
                    </span>
                    <span className="text-xs font-mono font-black text-neutral-900">
                      {ord.orderNumber || `#${ord.id.slice(-6)}`}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-neutral-900">{ord.deliveryAddress || "Standard Delivery Order"}</p>
                </div>

                {/* Collapsible Order Items */}
                {itemsList.length > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={() => toggleExpand(ord.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      <span>{itemsList.length} item{itemsList.length > 1 ? 's' : ''}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 pl-3 border-l-2 border-amber-200 space-y-2 bg-neutral-50/50 p-3 rounded-xl">
                        {itemsList.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-start justify-between text-xs">
                            <span className="text-neutral-800 font-medium">
                              {item.quantity}x {item.name || item.foodItem?.name || 'Food Item'}
                            </span>
                            <span className="font-mono text-neutral-600">
                              ₦{(Number(item.price || item.foodItem?.price || 0) * Number(item.quantity || 1)).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 flex-wrap gap-2">
                  <span className="text-sm font-mono font-black text-neutral-950">
                    Payout: ₦{displayTotal.toLocaleString()}
                  </span>

                  {(ord.status === 'PENDING' || ord.status === 'NEW') && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateOrderStatus(ord.id, 'CANCELLED')}
                        className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors border border-neutral-200"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(ord.id, 'ACCEPTED')}
                        className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        Accept
                      </button>
                    </div>
                  )}

                  {(ord.status === 'ACCEPTED' || ord.status === 'PREPARING') && (
                    <button 
                      onClick={() => updateOrderStatus(ord.id, 'READY_FOR_PICKUP')}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      Mark as Ready
                    </button>
                  )}

                  {(ord.status === 'READY_FOR_PICKUP' || ord.status === 'ARRIVED_AT_HUB' || ord.status === 'READY') && (
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <Truck size={13} /> Rider assigned & arriving...
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}