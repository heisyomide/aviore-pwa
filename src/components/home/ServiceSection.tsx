"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/src/lib/api";
import { 
  Flame, 
  ChevronRight, 
  Sparkles
} from "lucide-react";
import FoodProductGrid, { FoodProductCardData } from "@/src/components/MerchantCardGrid";

interface CategoryObj {
  id: string;
  name: string;
  slug: string;
}

interface FoodItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  merchantId: string;
  merchant?: {
    id: string;
    businessName: string;
    address?: string;
    coverUrl?: string;
    logoUrl?: string;
    rating?: number | string;
    deliveryTime?: string;
    isOpen?: boolean;
  };
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<CategoryObj[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    api.get("/storefront/categories")
      .then((res) => {
        const data = res.data;
        setCategories(Array.isArray(data) ? data : []);
        setLoadingCategories(false);
      })
      .catch((err) => {
        console.error("Failed to load database categories:", err);
        setLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    setLoadingItems(true);
    api.get(`/storefront/food-items?category=${selectedCategory}`)
      .then((res) => {
        const data = res.data;
        setFoodItems(Array.isArray(data) ? data : []);
        setLoadingItems(false);
      })
      .catch((err) => {
        console.error("Failed to load food items:", err);
        setLoadingItems(false);
      });
  }, [selectedCategory]);

  // Map food items into FoodProductCardData format to match FoodProductGrid props
  const formattedProducts: FoodProductCardData[] = foodItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.merchant?.businessName || item.category || "Mama's Kitchen",
    imageUrl: item.imageUrl || item.merchant?.coverUrl,
    price: item.price,
    href: `/food/item/${item.id}`,
  }));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8">
      {/* Header with Flashy Glow */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">Explore Categories</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-xs animate-pulse">
              <Sparkles size={10} className="mr-1" /> Hot Picks
            </span>
          </div>
          <p className="text-xs font-semibold text-neutral-500">Mouth-watering dishes freshly prepared by top vendors</p>
        </div>
        <Link 
          href="/food/categories" 
          className="hidden sm:flex items-center gap-1 text-xs font-extrabold text-orange-600 hover:text-orange-700 transition-colors"
        >
          <span>View All</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Flashy Horizontal Category Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`group relative flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 shrink-0 cursor-pointer border ${
            selectedCategory === "all" 
              ? "bg-linear-to-r from-neutral-900 to-neutral-800 text-white shadow-lg shadow-neutral-900/20 font-black border-transparent scale-105 ring-2 ring-orange-500/50" 
              : "bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200/80 shadow-xs font-bold hover:border-orange-200"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-transform group-hover:scale-110 ${selectedCategory === "all" ? "bg-white/20 text-white" : "bg-orange-50 text-orange-600 shadow-2xs"}`}>
            <Flame size={16} />
          </div>
          <span className="text-[11px] tracking-tight">All Dishes</span>
        </button>

        {!loadingCategories && categories.map((cat, idx) => {
          const categoryKey = cat.slug || cat.id || cat.name;
          const isSelected = selectedCategory === categoryKey;
          
          const themes = [
            "from-orange-500 to-amber-500 shadow-orange-500/25",
            "from-rose-500 to-pink-500 shadow-rose-500/25",
            "from-purple-500 to-indigo-500 shadow-purple-500/25",
            "from-emerald-500 to-teal-500 shadow-emerald-500/25",
            "from-blue-500 to-cyan-500 shadow-blue-500/25",
          ];
          const activeThemeClass = themes[idx % themes.length];

          return (
            <button
              key={cat.id || cat.slug}
              onClick={() => setSelectedCategory(categoryKey)}
              className={`group relative flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 shrink-0 cursor-pointer border capitalize ${
                isSelected 
                  ? `bg-linear-to-r ${activeThemeClass} text-white shadow-md font-black border-transparent scale-105 ring-2 ring-white/50` 
                  : "bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200/80 shadow-xs font-bold hover:border-orange-200"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-transform group-hover:scale-110 ${isSelected ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600 shadow-2xs"}`}>
                <Sparkles size={16} />
              </div>
              <span className="text-[11px] tracking-tight">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Refactored Product Grid Component Integration */}
      <div className="mt-4">
        <FoodProductGrid
          products={formattedProducts}
          loading={loadingItems}
          emptyTitle="No flashy dishes found under this category yet."
          emptySubtitle="Try switching back to 'All Dishes' to see more delicious meals!"
        />
      </div>
    </section>
  );
}