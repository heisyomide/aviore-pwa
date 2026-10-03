"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/src/lib/api";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Sparkles,
  MapPin,
  Utensils,
  KeyRound,
  ChevronRight,
  Truck,
  PackageCheck
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  foodItem?: {
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: string;
  orderNumber?: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  status: "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED" | "REJECTED" | "DELIVERED";
  deliveryStatus?: string;
  createdAt: string;
  restaurant?: {
    businessName?: string;
  };
  shipment?: {
    trackingCode?: string;
    verificationPin?: string;
    status?: string;
  };
}

export default function FoodOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/food-orders")
      .then((res) => {
        const data = res.data;
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: Order["status"], deliveryStatus?: string) => {
    if (status === "DELIVERED" || status === "COMPLETED" || deliveryStatus === "DELIVERED") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={13} /> Delivered
        </span>
      );
    }
    
    if (status === "READY") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <PackageCheck size={13} /> Ready for Pickup
        </span>
      );
    }

    if (status === "ACCEPTED" || status === "PREPARING") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
          <Clock size={13} /> {status === "ACCEPTED" ? "Accepted" : "Preparing"}
        </span>
      );
    }

    if (status === "CANCELLED" || status === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle size={13} /> {status === "REJECTED" ? "Rejected" : "Cancelled"}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
        <Clock size={13} /> Pending
      </span>
    );
  };

  const getShipmentBadge = (shipmentStatus?: string) => {
    if (!shipmentStatus) return null;
    
    switch (shipmentStatus) {
      case "OUT_FOR_DELIVERY":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck size={12} /> Out for Delivery
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> Rider Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
            Shipment: {shipmentStatus.replace(/_/g, " ")}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link 
              href="/food" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Storefront</span>
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">My Food Orders</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-xs">
                <Sparkles size={12} className="mr-1" /> Live tracking
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500">
              Track live order statuses, escrow delivery PINs, and order history.
            </p>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 rounded-2xl bg-neutral-200/60 animate-pulse border border-neutral-200" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link 
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="block bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all space-y-5 group"
              >
                {/* Top Row: Restaurant Info & Statuses */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <ShoppingBag size={20} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-neutral-900">
                          {order.restaurant?.businessName ?? 'Restaurant'}
                        </h3>
                        {order.orderNumber && (
                          <span className="text-xs font-mono font-medium text-neutral-400">
                            • {order.orderNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 font-medium">
                        Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(order.status, order.deliveryStatus)}
                      {getShipmentBadge(order.shipment?.status)}
                    </div>
                    <span className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-orange-500 group-hover:text-white text-neutral-600 flex items-center justify-center transition-colors shrink-0">
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </div>

                {/* Verification PIN Banner (Escrow Release) */}
                {order.shipment?.verificationPin && order.status !== "DELIVERED" && order.status !== "COMPLETED" && order.status !== "CANCELLED" && order.status !== "REJECTED" && (
                  <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200/80 px-4 py-3 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-amber-900 font-semibold">
                      <KeyRound size={16} className="text-amber-600 shrink-0" />
                      <span>Delivery Verification PIN:</span>
                    </div>
                    <span className="font-mono font-bold text-sm tracking-wider bg-white px-3 py-1 rounded-lg shadow-2xs text-amber-800 border border-amber-200">
                      {order.shipment.verificationPin}
                    </span>
                  </div>
                )}

                {/* Order Summary Items */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Order Summary</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-neutral-50/70 border border-neutral-100 px-3.5 py-2.5 rounded-xl text-xs">
                        <span className="font-semibold text-neutral-800 truncate pr-2">
                          {item.quantity}x {item.foodItem?.name || "Dish Item"}
                        </span>
                        <span className="font-mono font-bold text-orange-600 shrink-0">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Address & Total Amount */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-neutral-100 text-xs">
                  <div className="flex items-center gap-2 text-neutral-600 truncate">
                    <MapPin size={15} className="text-orange-500 shrink-0" />
                    <span className="truncate">{order.deliveryAddress || "Standard Delivery Address"}</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <span className="text-neutral-500 font-semibold">Total Amount:</span>
                    <span className="text-base font-extrabold font-mono text-neutral-900">
                      ₦{order.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-neutral-200 p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <Utensils size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900">No active orders yet</h3>
              <p className="text-xs text-neutral-500">Explore our storefront dishes and place your first delicious order today!</p>
            </div>
            <div>
              <Link 
                href="/food"
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <span>Browse Storefront</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}