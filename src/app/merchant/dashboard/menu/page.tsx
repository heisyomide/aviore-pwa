"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UtensilsCrossed, Plus, Image as ImageIcon, Edit3, Loader2 } from "lucide-react";
import { api } from '@/src/lib/api';
import EditMenuModal, { MenuFormData } from "@/src/components/EditMenuModal"; // Import the clean modular component

interface Category {
  id: string;
  name: string;
  subcategories?: { id: string; name: string; categoryId: string }[];
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  subcategoryId: string;
  imageUrl?: string;
  isAvailable: boolean;
  subcategory?: { name: string };
  customizationGroups?: any[];
}

interface MenuItemCardProps {
  food: MenuItem;
  onEdit: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ food, onEdit }) => (
  <div className="bg-white border border-neutral-200/80 rounded-3xl p-4 shadow-sm flex items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 relative overflow-hidden shrink-0">
        {food.imageUrl ? (
          <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={24} />
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-neutral-950">{food.name}</h3>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block text-[10px] font-bold ${
              food.isAvailable ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {food.isAvailable ? "✓ Available" : "✕ Sold Out"}
          </span>
          {food.subcategory && (
            <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-semibold">
              {food.subcategory.name}
            </span>
          )}
        </div>
        <p className="text-xs font-mono font-black text-neutral-900">
          ₦{Number(food.price).toLocaleString()}
        </p>
      </div>
    </div>

    <button
      onClick={() => onEdit(food)}
      className="p-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
    >
      <Edit3 size={16} />
    </button>
  </div>
);

export default function MerchantMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState<MenuFormData>({
    name: "",
    price: "",
    categoryId: "",
    subcategoryId: "",
    imageUrl: "",
    available: true,
    customizationGroups: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [menuRes, catRes] = await Promise.all([
        api.get<MenuItem[]>("/merchant/dashboard/menu"),
        api.get<Category[]>("/storefront/categories"),
      ]);
      setMenuItems(menuRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Failed to load initial merchant menu data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    const firstCat = categories[0];
    const firstSub = firstCat?.subcategories?.[0];

    setFormData({
      name: "",
      price: "",
      categoryId: firstCat?.id || "",
      subcategoryId: firstSub?.id || "",
      imageUrl: "",
      available: true,
      customizationGroups: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    const matchedSub = categories
      .flatMap((c) => c.subcategories || [])
      .find((s) => s.id === item.subcategoryId);

    setFormData({
      name: item.name,
      price: item.price.toString(),
      categoryId: matchedSub?.categoryId || categories[0]?.id || "",
      subcategoryId: item.subcategoryId || "",
      imageUrl: item.imageUrl || "",
      available: item.isAvailable ?? true,
      customizationGroups: item.customizationGroups || [],
    });
    setIsModalOpen(true);
  };

  const handleCategoryChangeInForm = (catId: string) => {
    const targetCat = categories.find((c) => c.id === catId);
    const firstSubId = targetCat?.subcategories?.[0]?.id || "";
    setFormData((prev) => ({
      ...prev,
      categoryId: catId,
      subcategoryId: firstSubId,
    }));
  };

const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 1. Temporary local preview (safe for UI state preview only)
  const previewUrl = URL.createObjectURL(file);
  setFormData((prev) => ({ ...prev, imageUrl: previewUrl }));

  try {
    setUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    // 2. Post to your backend upload endpoint
    const { data } = await api.post('/uploads/menu-item', uploadData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // 3. Replace blob URL with permanent Cloudinary secure URL
    if (data && data.url) {
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    }
  } catch (err) {
    console.error("Failed to upload image to Cloudinary", err);
    alert("Image upload failed. Please try again.");
  } finally {
    setUploadingImage(false);
  }
};

  const refreshMenu = async () => {
    const { data } = await api.get<MenuItem[]>("/merchant/dashboard/menu");
    setMenuItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        subcategoryId: formData.subcategoryId,
        available: formData.available,
        imageUrl: formData.imageUrl,
        customizationGroups: formData.customizationGroups,
      };

      if (editingItem) {
        await api.patch(`/merchant/dashboard/menu/${editingItem.id}`, payload);
      } else {
        await api.post("/merchant/dashboard/menu", payload);
      }

      setIsModalOpen(false);
      await refreshMenu();
    } catch (err) {
      console.error("Failed to save menu item", err);
      alert("Failed to save menu item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingItem) return;
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    setDeleting(true);
    try {
      await api.delete(`/merchant/dashboard/menu/${editingItem.id}`);
      setIsModalOpen(false);
      await refreshMenu();
    } catch (err) {
      console.error("Failed to delete menu item", err);
    } finally {
      setDeleting(false);
    }
  };

  const currentCategorySubIds =
    selectedCategoryId === "All"
      ? null
      : categories.find((c) => c.id === selectedCategoryId)?.subcategories?.map((s) => s.id) || [];

  const filteredItems =
    selectedCategoryId === "All"
      ? menuItems
      : menuItems.filter((item) => currentCategorySubIds?.includes(item.subcategoryId));

  const activeCategoryObject = categories.find((c) => c.id === formData.categoryId);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Menu & Customizations</h1>
        <button
          onClick={handleOpenAdd}
          className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors flex items-center gap-1.5 px-3 text-xs font-bold cursor-pointer"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryId("All")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategoryId === "All"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryId === cat.id
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-neutral-400">Loading menu...</div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-12 text-center space-y-3">
            <UtensilsCrossed size={32} className="mx-auto text-neutral-300" />
            <p className="text-sm font-bold text-neutral-900">No items in this category</p>
            <p className="text-xs text-neutral-500">Add dishes matching this taxonomy to populate your store.</p>
          </div>
        ) : (
          filteredItems.map((food) => (
            <MenuItemCard key={food.id} food={food} onEdit={handleOpenEdit} />
          ))
        )}
      </div>

      <EditMenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        activeCategoryObject={activeCategoryObject}
        handleCategoryChangeInForm={handleCategoryChangeInForm}
        handleImageFileChange={handleImageFileChange}
        submitting={submitting}
        deleting={deleting}
        uploadingImage={uploadingImage}
      />
    </div>
  );
}