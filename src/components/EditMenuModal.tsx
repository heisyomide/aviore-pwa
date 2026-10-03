"use client";

import React from "react";
import { X, Loader2, Trash2, Plus, Trash } from "lucide-react";

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
  customizationGroups?: any[];
}

export interface CustomizationOptionForm {
  name: string;
  price: number;
}

export interface CustomizationGroupForm {
  name: string; // e.g. "Soup", "Protein"
  selectionType: "REQUIRED" | "OPTIONAL";
  minSelections: number;
  maxSelections: number;
  options: CustomizationOptionForm[];
}

export interface MenuFormData {
  name: string;
  price: string;
  categoryId: string;
  subcategoryId: string;
  imageFile?: File | null;
  imageUrl: string;
  available: boolean;
  customizationGroups: CustomizationGroupForm[];
}

interface EditMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: () => void;
  editingItem: MenuItem | null;
  formData: MenuFormData;
  setFormData: React.Dispatch<React.SetStateAction<MenuFormData>>;
  categories: Category[];
  activeCategoryObject?: Category;
  handleCategoryChangeInForm: (catId: string) => void;
  handleImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitting: boolean;
  deleting: boolean;
  uploadingImage: boolean;
}

export default function EditMenuModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  editingItem,
  formData,
  setFormData,
  categories,
  activeCategoryObject,
  handleCategoryChangeInForm,
  handleImageFileChange,
  submitting,
  deleting,
  uploadingImage,
}: EditMenuModalProps) {
  if (!isOpen) return null;

  // Customization group helper handlers
  const addGroup = () => {
    setFormData((prev) => ({
      ...prev,
      customizationGroups: [
        ...prev.customizationGroups,
        {
          name: "",
          selectionType: "OPTIONAL",
          minSelections: 0,
          maxSelections: 1,
          options: [{ name: "", price: 0 }],
        },
      ],
    }));
  };

  const removeGroup = (groupIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      customizationGroups: prev.customizationGroups.filter((_, i) => i !== groupIndex),
    }));
  };

  const updateGroupField = (groupIndex: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.customizationGroups];
      updated[groupIndex] = { ...updated[groupIndex], [field]: value };
      return { ...prev, customizationGroups: updated };
    });
  };

  const addOption = (groupIndex: number) => {
    setFormData((prev) => {
      const updated = [...prev.customizationGroups];
      updated[groupIndex].options.push({ name: "", price: 0 });
      return { ...prev, customizationGroups: updated };
    });
  };

  const removeOption = (groupIndex: number, optionIndex: number) => {
    setFormData((prev) => {
      const updated = [...prev.customizationGroups];
      updated[groupIndex].options = updated[groupIndex].options.filter((_, i) => i !== optionIndex);
      return { ...prev, customizationGroups: updated };
    });
  };

  const updateOptionField = (groupIndex: number, optionIndex: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.customizationGroups];
      const options = [...updated[groupIndex].options];
      options[optionIndex] = { ...options[optionIndex], [field]: value };
      updated[groupIndex].options = options;
      return { ...prev, customizationGroups: updated };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto my-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <h2 className="text-base font-black text-neutral-950">
            {editingItem ? "Edit Menu Item & Customizations" : "Add New Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:bg-neutral-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">1. Basic Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Item Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Amala Portion or Jollof Rice"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Base Price (₦)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="200"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Parent Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleCategoryChangeInForm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-amber-600 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Subcategory Taxonomy</label>
                <select
                  value={formData.subcategoryId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subcategoryId: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-amber-600 bg-white"
                  required
                >
                  {activeCategoryObject?.subcategories?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image upload */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700">Food Dish Image</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-neutral-400">No Image</span>
                  )}
                </div>
                <label className="flex-1 cursor-pointer bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3 text-center transition-colors flex items-center justify-center gap-2">
                  {uploadingImage ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-amber-600" />
                      <span className="text-xs font-bold text-neutral-600">Uploading...</span>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-neutral-700">Choose image from device</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.available}
                onChange={(e) => setFormData((prev) => ({ ...prev, available: e.target.checked }))}
                className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
              />
              <label htmlFor="isAvailable" className="text-xs font-bold text-neutral-700 cursor-pointer">
                Available for ordering right now
              </label>
            </div>
          </div>

          {/* Dynamic Customization Engine Builder Section */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">2. Customization Groups</h3>
                <p className="text-[11px] text-neutral-500">Configure add-ons, soups, or proteins (e.g. Soups, Proteins, Extras)</p>
              </div>
              <button
                type="button"
                onClick={addGroup}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add Group
              </button>
            </div>

            {formData.customizationGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 relative">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    placeholder="Group Name (e.g. Soups, Proteins)"
                    value={group.name}
                    onChange={(e) => updateGroupField(groupIdx, "name", e.target.value)}
                    className="flex-1 px-3 py-2 bg-white rounded-xl border border-neutral-200 text-xs font-bold focus:outline-none focus:border-amber-600"
                  />
                  <select
                    value={group.selectionType}
                    onChange={(e) => updateGroupField(groupIdx, "selectionType", e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-amber-600"
                  >
                    <option value="OPTIONAL">Optional</option>
                    <option value="REQUIRED">Required</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeGroup(groupIdx)}
                    className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                    title="Remove Group"
                  >
                    <Trash size={16} />
                  </button>
                </div>

                {/* Min / Max selections helper row */}
                <div className="flex items-center gap-4 text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <span>Min:</span>
                    <input
                      type="number"
                      min={0}
                      value={group.minSelections}
                      onChange={(e) => updateGroupField(groupIdx, "minSelections", parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-1 bg-white rounded-lg border border-neutral-200 text-xs text-center"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Max:</span>
                    <input
                      type="number"
                      min={1}
                      value={group.maxSelections}
                      onChange={(e) => updateGroupField(groupIdx, "maxSelections", parseInt(e.target.value) || 1)}
                      className="w-14 px-2 py-1 bg-white rounded-lg border border-neutral-200 text-xs text-center"
                    />
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-2 pt-2 border-t border-neutral-200/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase">Options inside group</span>
                    <button
                      type="button"
                      onClick={() => addOption(groupIdx)}
                      className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer"
                    >
                      + Add Option
                    </button>
                  </div>

                  {group.options.map((option, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Option Name (e.g. Beef, Gbegiri)"
                        value={option.name}
                        onChange={(e) => updateOptionField(groupIdx, optIdx, "name", e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-neutral-200 text-xs focus:outline-none focus:border-amber-600"
                      />
                      <input
                        type="number"
                        placeholder="Extra Price (₦)"
                        value={option.price}
                        onChange={(e) => updateOptionField(groupIdx, optIdx, "price", parseFloat(e.target.value) || 0)}
                        className="w-24 px-3 py-1.5 bg-white rounded-lg border border-neutral-200 text-xs focus:outline-none focus:border-amber-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(groupIdx, optIdx)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="flex-1 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {editingItem ? "Save Changes" : "Create Item & Customizations"}
            </button>

            {editingItem && (
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="p-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-sm transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
                title="Delete item"
              >
                {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}