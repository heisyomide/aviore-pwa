"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/src/lib/api";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Bike,
  Building2,
  PackageCheck
} from "lucide-react";

interface OrderDetail {
  id: string;
  status: string;
  deliveryStatus: string;
  subtotal: number;
  deliveryFee: number;
  statusMessage?: string;
  serviceFee: number;
  totalAmount: number;
  deliveryAddress: string;
  deliveryNotes?: string;
  createdAt: string;
  restaurant: {
    id: string;
    name: string;
    logoUrl?: string;
    phone?: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    foodItem: {
      name: string;
      imageUrl?: string;
    };
  }>;
  shipment?: {
    id: string;
    trackingCode: string;
    status: string;
    verificationPin: string;
    estimatedMinutes?: number;
    distanceKm?: number;
    rider?: {
      name: string;
      phone: string;
      avatarUrl?: string;
      vehicle?: {
        type: string;
        plateNumber?: string;
      };
    };
    timeline?: Array<{
      id: string;
      status: string;
      description: string;
      createdAt: string;
    }>;
  };
}

export default function FoodOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    api.get(`/food-orders/${params.id}`)
      .then((res) => {
        if (res.data?.success && res.data?.order) {
          setOrder(res.data.order);
        } else {
          setError("Failed to load order details.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order details:", err);
        setError("Network error. Please try again.");
        setLoading(false);
      });
  }, [params?.id]);

  const getMerchantStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "READY":
      case "READY_FOR_PICKUP":
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            <PackageCheck size={14} /> Restaurant: Food Ready
          </span>
        );
      case "PREPARING":
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-700 border border-amber-500/20 animate-pulse">
            <Clock size={14} /> Restaurant: Preparing Food
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-500/10 text-rose-700 border border-rose-500/20">
            <XCircle size={14} /> Restaurant: Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-orange-500/10 text-orange-700 border border-orange-500/20">
            <Clock size={14} /> Restaurant: {status || "Processing"}
          </span>
        );
    }
  };

  const getDeliveryStatusBadge = (shipmentStatus?: string, deliveryStatus?: string) => {
    const activeStatus = (shipmentStatus || deliveryStatus)?.toUpperCase();

    switch (activeStatus) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            <CheckCircle2 size={14} /> Delivery: Completed
          </span>
        );
      case "OUT_FOR_DELIVERY":
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-orange-500/10 text-orange-700 border border-orange-500/20 animate-bounce">
            <Bike size={14} /> Delivery: Arrived at Destination
          </span>
        );
      case "ARRIVED_AT_PICKUP":
      case "ARRIVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-blue-500/10 text-blue-700 border border-blue-500/20">
            <Bike size={14} /> Delivery: At Pickup Location
          </span>
        );
      case "PICKED_UP":
      case "IN_TRANSIT":
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-purple-500/10 text-purple-700 border border-purple-500/20">
            <Bike size={14} /> Delivery: On the Way
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-blue-500/10 text-blue-700 border border-blue-500/20">
            <Bike size={14} /> Delivery: Rider Assigned
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto min-h-screen bg-neutral-50 p-6 text-center pt-24 space-y-4">
        <p className="text-rose-500 font-semibold">{error || "Order not found."}</p>
        <button
          onClick={() => router.push("/dashboard/orders")}
          className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-orange-700 transition"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation & Header */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/dashboard/orders")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to My Orders</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                Order #{order.shipment?.trackingCode ?? order.id.slice(0, 8)}
              </h1>
              <p className="text-xs text-neutral-500 font-semibold mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            
            <div className="flex flex-col sm:items-end gap-2">
              {getMerchantStatusBadge(order.status)}
              {getDeliveryStatusBadge(order.shipment?.status, order.deliveryStatus)}
            </div>
          </div>

          {/* Dynamic Status Message Banner */}
          {order.statusMessage && (
            <div className="bg-orange-50 border border-orange-200/60 rounded-2xl p-4 flex items-center gap-3 text-orange-900 mt-3">
              <Clock size={18} className="text-orange-600 shrink-0" />
              <p className="text-xs sm:text-sm font-extrabold">{order.statusMessage}</p>
            </div>
          )}
        </div>

        {/* Verification PIN Banner */}
        {order.shipment?.verificationPin && (
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-3xl p-6 shadow-lg shadow-orange-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase">
                <ShieldCheck size={14} /> Secure Delivery
              </div>
              <h3 className="text-base font-extrabold">Delivery Verification PIN</h3>
              <p className="text-xs text-orange-100 font-medium">Provide this code to your rider upon arrival to complete delivery.</p>
            </div>
            <div className="bg-white text-orange-600 font-mono text-2xl font-black px-6 py-3 rounded-2xl tracking-widest shadow-inner">
              {order.shipment.verificationPin}
            </div>
          </div>
        )}

        {/* Restaurant Card */}
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-orange-50 rounded-2xl overflow-hidden flex items-center justify-center text-orange-600 font-black">
                {order.restaurant?.logoUrl ? (
                  <Image src={order.restaurant.logoUrl} alt={order.restaurant.name} fill className="object-cover" />
                ) : (
                  <Building2 size={22} />
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Merchant</span>
                <h3 className="text-base font-black text-neutral-900">{order.restaurant.name}</h3>
              </div>
            </div>
            {order.restaurant?.phone && (
              <a
                href={`tel:${order.restaurant.phone}`}
                className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3.5 py-2 rounded-xl text-xs font-extrabold hover:bg-orange-100 transition"
              >
                <Phone size={14} /> Call Restaurant
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-semibold pt-2 border-t border-neutral-100">
            <MapPin size={14} className="text-orange-500 shrink-0" />
            <span>{order.restaurant.address}</span>
          </div>
        </div>

        {/* Rider Card */}
        {order.shipment?.rider && (
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neutral-100 rounded-2xl relative overflow-hidden flex items-center justify-center text-neutral-500 font-bold">
                {order.shipment.rider.avatarUrl ? (
                  <Image src={order.shipment.rider.avatarUrl} alt="Rider" fill className="object-cover" />
                ) : (
                  <Bike size={22} />
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Assigned Rider</span>
                <h3 className="text-sm font-black text-neutral-900">{order.shipment.rider.name}</h3>
                <p className="text-xs text-neutral-500 font-semibold">{order.shipment.rider.vehicle?.type ?? "Delivery Rider"}</p>
              </div>
            </div>
            <a
              href={`tel:${order.shipment.rider.phone}`}
              className="inline-flex items-center gap-1.5 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition shadow-sm"
            >
              <Phone size={14} /> Call Rider
            </a>
          </div>
        )}

        {/* Itemized Order Breakdown */}
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <ShoppingBag size={18} className="text-orange-600" />
            <h3 className="text-sm font-black text-neutral-900">Order Summary</h3>
          </div>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5 font-bold text-neutral-800">
                  <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg text-xs font-black">
                    {item.quantity}x
                  </span>
                  <span>{item.foodItem.name}</span>
                </div>
                <span className="font-mono font-bold text-orange-600">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs text-neutral-500 font-semibold">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-neutral-800">₦{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-mono font-bold text-neutral-800">₦{order.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span className="font-mono font-bold text-neutral-800">₦{order.serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-neutral-100 text-sm font-black text-neutral-900">
              <span>Total Amount</span>
              <span className="font-mono text-orange-600 text-base">₦{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Delivery Information</h3>
          <div className="flex items-start gap-2 pt-1">
            <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-neutral-800">{order.deliveryAddress}</p>
              {order.deliveryNotes && (
                <p className="text-xs text-neutral-500 mt-2 bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                  <span className="font-bold text-neutral-700">Note:</span> {order.deliveryNotes}
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}