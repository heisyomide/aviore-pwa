'use client';

import React from 'react';
import { Truck, Palette, CalendarClock, UploadCloud, CheckCircle2 } from 'lucide-react';

interface Step3Props {
  formData: any;
  updateField: (key: string, value: any) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  onNext: () => void;
  onBack: () => void;
  uploading: boolean;
}

export default function Step3VehicleInformation({ formData, updateField, onUpload, onNext, onBack, uploading }: Step3Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.vehiclePhoto) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Asset Type Categories (Synced with Prisma VehicleType enum) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Vehicle Type</label>
          <select value={formData.vehicleType} onChange={e => updateField('vehicleType', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition">
            <option value="MOTORCYCLE">Motorcycle / Dispatch Bike</option>
            <option value="BICYCLE">Bicycle</option>
            <option value="CAR">Car</option>
            <option value="BUS">Bus</option>
            <option value="VAN">Van / Delivery Minivan</option>
            <option value="TRICYCLE">Tricycle (Keke)</option>
          </select>
        </div>
        {/* License Regulatory Plate */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Plate Number</label>
          <input type="text" required placeholder="e.g. LAG-124AA" value={formData.plateNumber} onChange={e => updateField('plateNumber', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Brand Maker */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Vehicle Brand</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400"><Truck className="h-4 w-4" /></span>
            <input type="text" required placeholder="e.g. Bajaj, Toyota" value={formData.vehicleBrand} onChange={e => updateField('vehicleBrand', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition" />
          </div>
        </div>
        {/* Engine Model String */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Vehicle Model</label>
          <input type="text" required placeholder="e.g. Pulsar 200, Hiace" value={formData.vehicleModel} onChange={e => updateField('vehicleModel', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Exterior Color */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Vehicle Color</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400"><Palette className="h-4 w-4" /></span>
            <input type="text" required placeholder="Black" value={formData.vehicleColor} onChange={e => updateField('vehicleColor', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition" />
          </div>
        </div>
        {/* Fabrication Year */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Vehicle Year</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400"><CalendarClock className="h-4 w-4" /></span>
            <input type="text" required maxLength={4} placeholder="2022" value={formData.vehicleYear} onChange={e => updateField('vehicleYear', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition" />
          </div>
        </div>
      </div>

      {/* Visual Photo Verification Strip */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Upload Vehicle Photo</label>
        <label className="flex flex-col items-center justify-center w-full border border-dashed border-zinc-200 rounded-xl p-5 bg-zinc-50 cursor-pointer hover:bg-zinc-100/60 transition min-h-[110px]">
          <input type="file" accept="image/*" required={!formData.vehiclePhoto} onChange={e => onUpload(e, 'vehiclePhoto')} className="hidden" />
          {formData.vehiclePhoto ? (
            <div className="flex items-center gap-2 text-emerald-700 font-medium text-xs">
              <CheckCircle2 className="h-5 w-5" />
              <span>Asset Media Matrix Saved Successfully</span>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <UploadCloud className="h-6 w-6 text-zinc-400 mx-auto" />
              <p className="text-xs text-zinc-500 font-medium">Click to select physical vehicle capture</p>
            </div>
          )}
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4">
        <button type="button" onClick={onBack} className="rounded-xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50 transition cursor-pointer">Back</button>
        <button type="submit" disabled={uploading || !formData.vehiclePhoto} className="col-span-2 rounded-xl bg-emerald-700 text-white py-3 text-sm font-semibold hover:bg-emerald-800 disabled:opacity-40 transition cursor-pointer">Continue</button>
      </div>
    </form>
  );
}