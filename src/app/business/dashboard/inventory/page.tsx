'use client';

import React, { useState } from 'react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  isRegistryEligible: boolean;
  palette: 'Black' | 'Wine Red' | 'Silver' | 'Other';
}

export default function BusinessInventoryPage() {
  // Inventory collection aligned with premium aesthetics
  const [items, setItems] = useState<InventoryItem[]>([
    { id: "INV-001", sku: "AV-BLK-AUDIO-01", name: "Matte Black Audio System Core", category: "Electronics", price: 320000, stock: 8, isRegistryEligible: true, palette: 'Black' },
    { id: "INV-002", sku: "AV-WNE-VLVT-04", name: "Premium Wine Red Velvet Throw", category: "Home & Living", price: 85000, stock: 14, isRegistryEligible: true, palette: 'Wine Red' },
    { id: "INV-003", sku: "AV-SLV-TEA-09", name: "Minimalist Silver Tea Set", category: "Home & Living", price: 145000, stock: 3, isRegistryEligible: true, palette: 'Silver' },
    { id: "INV-004", sku: "AV-TTN-CLCK-12", name: "Titanium Mechanical Desk Clock", category: "Premium Electronics", price: 110000, stock: 0, isRegistryEligible: false, palette: 'Silver' },
  ]);

  // Adjust stock levels inline
  const updateStock = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextStock = Math.max(0, item.stock + delta);
        return { ...item, stock: nextStock };
      }
      return item;
    }));
  };

  // Toggle active registry visibility channel state 
  const toggleRegistryEligibility = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isRegistryEligible: !item.isRegistryEligible } : item
    ));
  };

  return (
    <div className="space-y-6">
      
      {/* View Title Framework Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Inventory Core</h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">Control product variations, luxury palettes, and registry flags.</p>
        </div>
        
        <button 
          onClick={() => alert("Launching premium catalog intake vault configuration...")}
          className="bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto"
        >
          + Add Premium Product
        </button>
      </div>

      {/* Grid View Architecture */}
      <div className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-neutral-800 transition-all"
          >
            {/* Left Frame column block: Identity & Aesthetic Palette Indicators */}
            <div className="flex items-start gap-4 min-w-0 flex-1">
              {/* Dynamic Theme Palette Color Swatch Indicator */}
              <div className={`w-4 h-12 rounded-md shrink-0 border ${
                item.palette === 'Black' ? 'bg-neutral-950 border-neutral-800' :
                item.palette === 'Wine Red' ? 'bg-rose-950 border-rose-900' :
                item.palette === 'Silver' ? 'bg-neutral-300 border-neutral-400' : 'bg-neutral-800 border-neutral-700'
              }`} title={`Palette theme: ${item.palette}`} />

              <div className="space-y-1 truncate">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs font-black text-white truncate">{item.name}</h3>
                  <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-500 px-1.5 py-0.2 rounded">
                    {item.sku}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 font-mono">
                  Category: {item.category} • Price point: <span className="text-neutral-300">QN ₦{item.price.toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* Right Frame column block: Controls, Quantities, and Options */}
            <div className="flex flex-wrap items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-neutral-900 pt-4 md:pt-0 shrink-0">
              
              {/* Registry Inclusion Option Switch */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Registry Status:</span>
                <button
                  onClick={() => toggleRegistryEligibility(item.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                    item.isRegistryEligible 
                      ? 'bg-purple-950/30 text-purple-400 border-purple-900/50 hover:bg-purple-950/50' 
                      : 'bg-neutral-950 text-neutral-600 border-neutral-900 hover:text-neutral-400'
                  }`}
                >
                  {item.isRegistryEligible ? '🔮 Active on Registries' : '● Hidden from Vaults'}
                </button>
              </div>

              {/* High-density Stock Unit Counter adjustments */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[9px] text-neutral-500 uppercase font-mono">Stock Level</p>
                  <p className={`text-xs font-black ${item.stock === 0 ? 'text-rose-500' : 'text-white'}`}>
                    {item.stock === 0 ? 'Out of Stock' : `${item.stock} Units`}
                  </p>
                </div>

                <div className="flex items-center bg-neutral-950 border border-neutral-900 rounded-xl p-1">
                  <button 
                    onClick={() => updateStock(item.id, -1)}
                    className="w-7 h-7 text-xs font-bold text-neutral-500 hover:text-white rounded-lg transition-all"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => updateStock(item.id, 1)}
                    className="w-7 h-7 text-xs font-bold text-neutral-500 hover:text-white rounded-lg transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}