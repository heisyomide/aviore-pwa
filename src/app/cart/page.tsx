"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MapPin, 
  ChevronRight, 
  Bike,
  Loader2
} from "lucide-react";
import { api } from "@/src/lib/api";

export default function CartCheckoutPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  
  const merchantId = (params?.merchantId as string) || searchParams.get("merchantId");

  const [merchant, setMerchant] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("No default address set");
  const [userCoords, setUserCoords] = useState<{ lat?: number; lng?: number }>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [baseFee, setBaseFee] = useState(500);
  const [distanceFee, setDistanceFee] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [estimatedMinutes, setEstimatedMinutes] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCartAndData = async () => {
      if (!merchantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let userLat: number = 7.7827; 
        let userLng: number = 4.5418; 

        try {
          const [addressRes, merchantRes] = await Promise.all([
            api.get('/profile/addresses'),
            api.get(`/storefront/merchants/${merchantId}`)
          ]);

          if (addressRes.data && addressRes.data.length > 0) {
            const defaultAddr = addressRes.data.find((a: any) => a.isDefault) || addressRes.data[0];
            setDeliveryAddress(`${defaultAddr.street}, ${defaultAddr.city}`);
            if (defaultAddr.latitude && defaultAddr.longitude) {
              userLat = Number(defaultAddr.latitude);
              userLng = Number(defaultAddr.longitude);
            }
          }

          if (merchantRes.data) {
            setMerchant(merchantRes.data);
          }
        } catch (err) {
          console.error("Failed to fetch auxiliary cart data", err);
        }

        setUserCoords({ lat: userLat, lng: userLng });

        const { data } = await api.get(`/cart?merchantId=${merchantId}&lat=${userLat}&lng=${userLng}`);
        if (data) {
          syncPricingData(data);
        }
      } catch (err) {
        console.error("Failed to fetch cart data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndData();
  }, [merchantId]);

  const syncPricingData = (data: any) => {
    setCartItems(data.items || []);
    setSubtotal(data.subtotal || 0);
    setDeliveryFee(data.deliveryFee || 0);
    setTotal(data.total || 0);

    if (data.breakdown) {
      setBaseFee(data.breakdown.baseFee || 500);
      setDistanceFee(data.breakdown.deliveryDistanceFee || 0);
    }
    if (typeof data.distanceKm === 'number') {
      setDistanceKm(data.distanceKm);
    }
    if (typeof data.estimatedMinutes === 'number') {
      setEstimatedMinutes(data.estimatedMinutes);
    }
  };

  const updateQuantity = async (foodItemId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      return;
    }

    try {
      const { data } = await api.post(`/cart/items`, {
        merchantId,
        foodItemId,
        quantity: delta
      });
      if (data) {
        syncPricingData(data);
      }
    } catch (err) {
      console.error("Failed to update item quantity", err);
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      const { data } = await api.delete(`/cart/items/${cartItemId}?merchantId=${merchantId}`);
      if (data) {
        syncPricingData(data);
      }
    } catch (err) {
      console.error("Failed to remove item from cart", err);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const response = await api.post('/flutterwave/initialize', {
        cartCheckout: true,
        merchantId,
        items: cartItems,
        redirectUrl: `${window.location.origin}/payment/verify`
      });

      const paymentLink = response.data?.link;
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        throw new Error("Payment link not returned");
      }
    } catch (err: any) {
      console.error("Checkout initialization failed", err.response?.data || err.message);
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!merchantId) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag size={36} className="text-neutral-300 mb-2" />
        <h2 className="text-sm font-black text-neutral-900">Missing Restaurant Information</h2>
        <p className="text-xs text-neutral-400 mt-1">Please select a restaurant to view your corresponding cart.</p>
        <Link href="/" className="mt-4 bg-emerald-600 text-white px-6 py-2.5 rounded-2xl text-xs font-black shadow-md">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-28">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-800 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-sm font-black text-neutral-900">Review Your Cart</h1>
          <div className="w-9"></div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {cartItems.length > 0 ? (
          <>
            {merchant && (
              <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-3xl p-4 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Ordering From</span>
                  <h3 className="text-sm font-black text-neutral-900 mt-0.5">{merchant.businessName}</h3>
                </div>
                <Link href={`/food/merchant/${merchantId}`} className="text-xs font-bold text-emerald-600 hover:underline bg-white px-3 py-1.5 rounded-xl border border-emerald-200/60 shadow-2xs">
                  Add more items
                </Link>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-neutral-900">
                  <MapPin size={16} className="text-emerald-600" />
                  <span>Delivery Address</span>
                </div>
                <Link href="/dashboard/profile/address" className="text-xs font-bold text-emerald-600 hover:underline">Change</Link>
              </div>
              <p className="text-xs text-neutral-600 font-semibold bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                {deliveryAddress}
              </p>
              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <Bike size={14} className="text-emerald-600" />
                  <span>Distance: <strong className="text-neutral-800">{distanceKm} km</strong></span>
                </div>
                <span>Est. time: <strong className="text-neutral-800">{estimatedMinutes || "20-30"} mins</strong></span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">Order Items</h2>
              <div className="divide-y divide-neutral-100">
                {cartItems.map((item) => {
                  const food = item.foodItem || {};
                  const price = Number(food.price || 0);
                  const imageUrl = food.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60";
                  
                  const optionsTotal = (item.customizationOptions || []).reduce((sum: number, opt: any) => {
                    return sum + (Number(opt.option?.price || 0) * Number(opt.quantity || 1));
                  }, 0);
                  const itemLineTotal = (price + optionsTotal) * item.quantity;
                  
                  return (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <img src={imageUrl} alt={food.name || "Meal"} className="h-16 w-16 rounded-2xl object-cover shrink-0 bg-neutral-100" />
                        
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Verified Kitchen</span>
                          <h3 className="text-xs font-black text-neutral-900 truncate">{food.name || "Food Item"}</h3>
                          <p className="text-xs font-black text-neutral-700 mt-1">₦{itemLineTotal.toLocaleString()}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center bg-neutral-100 rounded-xl p-1 border border-neutral-200/60">
                            <button 
                              onClick={() => updateQuantity(food.id, item.quantity, -1)}
                              className="p-1 text-neutral-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-black px-2 text-neutral-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(food.id, item.quantity, 1)}
                              className="p-1 text-neutral-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {item.customizationOptions && item.customizationOptions.length > 0 && (
                        <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-100 space-y-1.5 ml-20">
                          <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Customizations:</span>
                          <div className="space-y-1">
                            {item.customizationOptions.map((opt: any) => (
                              <div key={opt.id} className="flex items-center justify-between text-[11px] text-neutral-600 font-medium">
                                <span>• {opt.option?.name} {opt.quantity > 1 ? `(x${opt.quantity})` : ""}</span>
                                {Number(opt.option?.price || 0) > 0 && (
                                  <span className="text-neutral-500 font-bold">+₦{(Number(opt.option.price) * opt.quantity).toLocaleString()}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-2xs space-y-3 text-xs font-medium text-neutral-600">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">Payment Summary</h2>
              <div className="flex justify-between">
                <span>Subtotal (Food Amount)</span>
                <span className="font-black text-neutral-900">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500 pl-2">
                <span>• Base Delivery Fee</span>
                <span className="font-semibold text-neutral-700">₦{baseFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500 pl-2">
                <span>• Distance Delivery Fee ({distanceKm} km)</span>
                <span className="font-semibold text-neutral-700">₦{distanceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-neutral-100">
                <span className="font-bold text-neutral-800">Total Delivery Fee</span>
                <span className="font-black text-neutral-900">₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-neutral-100 flex justify-between text-sm font-black text-neutral-900">
                <span>Total Amount</span>
                <span className="text-emerald-600">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-neutral-900 hover:bg-black text-white p-4 rounded-3xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Connecting to Flutterwave...</span>
                </>
              ) : (
                <>
                  <span>Pay with Flutterwave (₦{total.toLocaleString()})</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </>
        ) : (
          <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-neutral-200 space-y-3">
            <ShoppingBag size={36} className="mx-auto text-neutral-300" />
            <h2 className="text-sm font-black text-neutral-900">Your cart is empty</h2>
            <p className="text-xs text-neutral-400">Add delicious meals from this kitchen to get started.</p>
            <div className="pt-2">
              <Link href="/" className="inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-2xl text-xs font-black shadow-md">
                Browse Restaurants
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}