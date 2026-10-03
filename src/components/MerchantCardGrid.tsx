"use client";

import { useRouter } from "next/navigation";
import { Flame, Clock, Store, ArrowRight, ShoppingBag, Tag } from "lucide-react";

export interface FoodProductCardData {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  imageUrl?: string;
  isAvailable?: boolean;
  prepTimeMinutes?: number;
  restaurant?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  isHotOrTrending?: boolean;
  href?: string;
}

interface FoodProductGridProps {
  products?: FoodProductCardData[];
  loading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export default function FoodProductGrid({
  products = [],
  loading = false,
  emptyTitle = "No delicious meals available right now.",
  emptySubtitle = "Check back soon for freshly prepared options.",
}: FoodProductGridProps) {
  const router = useRouter();
  const safeItems = Array.isArray(products) ? products : [];

  if (loading) {
    return (
      <div className="py-8 flex flex-col justify-center items-center gap-2">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-3 border-orange-200 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-3 border-orange-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-[11px] font-bold text-neutral-500 animate-pulse">Preparing kitchen...</p>
      </div>
    );
  }

  if (safeItems.length === 0) {
    return (
      <div className="py-8 text-center bg-gradient-to-b from-neutral-50 to-orange-50/20 rounded-xl border border-dashed border-orange-200/60 p-4">
        <p className="text-xs font-black text-neutral-800">{emptyTitle}</p>
        <p className="text-[10px] text-neutral-400 mt-0.5 max-w-xs mx-auto">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 animate-in fade-in duration-500">
      {safeItems.map((product, index) => {
        const uniqueKey = `${product.id}-${index}`;
        const formattedPrice = typeof product.price === 'number' 
          ? `₦${product.price.toLocaleString()}` 
          : product.price;

        const isAvailable = product.isAvailable ?? true;
        
        // Determine single source of truth for routing path
        const destinationHref = product.href || (
          product.restaurant?.id 
            ? `/food/restaurant/${product.restaurant.id}`
            : `/food/item/${product.id}`
        );

        const handleCardNavigation = () => {
          router.push(destinationHref);
        };

        return (
          <div
            key={uniqueKey}
            onClick={handleCardNavigation}
            className={`group relative bg-white rounded-xl border border-neutral-200/70 overflow-hidden shadow-2xs hover:shadow-lg hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-0.5 ${
              !isAvailable ? "opacity-60 bg-neutral-50 grayscale pointer-events-none" : ""
            }`}
          >
            <div>
              {/* Compact Image Container with Badges */}
              <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
                <img
                  src={product.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70"></div>

                {/* Hot & Fresh Animation Badge */}
                {(product.isHotOrTrending || true) && isAvailable && (
                  <div className="absolute top-1.5 left-1.5 bg-orange-600/90 backdrop-blur-md text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm flex items-center gap-0.5 animate-bounce">
                    <Flame size={9} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                    <span>Hot</span>
                  </div>
                )}

                {/* Sold Out Overlay */}
                {!isAvailable && (
                  <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-neutral-900 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest shadow-xs">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Category Tag */}
                {product.category?.name && (
                  <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-md text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Tag size={8} />
                    {product.category.name}
                  </span>
                )}
              </div>

              {/* Information Section */}
              <div className="p-2 pb-1">
                {product.restaurant?.name && (
                  <div className="flex items-center gap-1 text-[9px] text-orange-600 font-bold mb-0.5 truncate">
                    <Store size={9} className="shrink-0" />
                    <span className="truncate">{product.restaurant.name}</span>
                  </div>
                )}

                <h3 className="font-black text-neutral-900 text-[11px] leading-tight line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="text-[9px] text-neutral-400 line-clamp-1 mt-0.5 font-medium">
                    {product.description}
                  </p>
                )}

                {product.prepTimeMinutes && (
                  <div className="flex items-center gap-0.5 text-[8px] text-neutral-400 font-semibold mt-1">
                    <Clock size={8} />
                    <span>{product.prepTimeMinutes} mins</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Interactive Order Footer */}
            <div className="p-2 pt-1 flex items-center justify-between gap-1 border-t border-neutral-100 bg-neutral-50/50 mt-1">
              <div className="flex flex-col truncate">
                <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider leading-none">Price</span>
                <span className="font-black text-orange-600 text-[11px] leading-tight truncate">
                  {formattedPrice}
                </span>
              </div>

              {isAvailable ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardNavigation();
                  }}
                  className="flex items-center gap-0.5 bg-orange-600 hover:bg-orange-700 text-white text-[9px] font-bold px-2 py-1 rounded-lg transition-all shadow-2xs hover:shadow-xs shrink-0 cursor-pointer active:scale-95"
                >
                  <ShoppingBag size={10} />
                  <span>Order</span>
                  <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider px-1.5 py-1">
                  N/A
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}