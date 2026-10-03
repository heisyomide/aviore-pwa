'use client';

import React from 'react';
import { FileUp, CheckCircle, CreditCard, Loader2 } from 'lucide-react';

interface Step2Props {
  formData: any;
  updateField: (key: string, value: any) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  onNext: () => void;
  onBack: () => void;
  uploading: boolean;
}

export default function Step2IdentityVerification({ 
  formData, 
  updateField, 
  onUpload, 
  onNext, 
  onBack, 
  uploading 
}: Step2Props) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.idFrontImage && formData.idBackImage && formData.selfieImage) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Identity Configuration Metadata Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Document Identifier Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">ID Type</label>
          <select 
            value={formData.idType || 'NATIONAL_ID'} 
            onChange={e => updateField('idType', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition"
          >
            <option value="NATIONAL_ID">National ID (NIN)</option>
            <option value="DRIVERS_LICENSE">Driver's License</option>
            <option value="VOTERS_CARD">Voter's Card</option>
            <option value="PASSPORT">International Passport</option>
          </select>
        </div>

        {/* Document Id Key Number */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">ID Document Number</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400"><CreditCard className="h-4 w-4" /></span>
            <input 
              type="text" 
              required 
              placeholder="Enter ID number string"
              value={formData.idNumber || ''} 
              onChange={e => updateField('idNumber', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>
      </div>

      {/* Styled File Upload Dropzone Boxes */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        {/* ID Front Dropzone */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-zinc-500 text-center">ID Card Front</label>
          <label className="relative flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-xl p-4 bg-zinc-50 cursor-pointer hover:bg-zinc-100/70 transition min-h-[110px] overflow-hidden group">
            <input 
              type="file" 
              accept="image/*" 
              disabled={uploading}
              required={!formData.idFrontImage} 
              onChange={e => onUpload(e, 'idFrontImage')} 
              className="hidden" 
            />
            {formData.idFrontImage ? (
              <>
                <img 
                  src={formData.idFrontImage} 
                  alt="ID Front Preview" 
                  className="absolute inset-0 h-full w-full object-cover brightness-95 filter transition group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <CheckCircle className="h-6 w-6 text-white drop-shadow-md" />
                </div>
              </>
            ) : (
              <>
                <FileUp className="h-5 w-5 text-zinc-400" />
                <span className="text-[10px] text-zinc-400 font-medium mt-1.5">Choose File</span>
              </>
            )}
          </label>
        </div>

        {/* ID Back Dropzone */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-zinc-500 text-center">ID Card Back</label>
          <label className="relative flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-xl p-4 bg-zinc-50 cursor-pointer hover:bg-zinc-100/70 transition min-h-[110px] overflow-hidden group">
            <input 
              type="file" 
              accept="image/*" 
              disabled={uploading}
              required={!formData.idBackImage} 
              onChange={e => onUpload(e, 'idBackImage')} 
              className="hidden" 
            />
            {formData.idBackImage ? (
              <>
                <img 
                  src={formData.idBackImage} 
                  alt="ID Back Preview" 
                  className="absolute inset-0 h-full w-full object-cover brightness-95 filter transition group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <CheckCircle className="h-6 w-6 text-white drop-shadow-md" />
                </div>
              </>
            ) : (
              <>
                <FileUp className="h-5 w-5 text-zinc-400" />
                <span className="text-[10px] text-zinc-400 font-medium mt-1.5">Choose File</span>
              </>
            )}
          </label>
        </div>

        {/* Live Selfie Snapshot Profile */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-zinc-500 text-center">Clear Selfie Face</label>
          <label className="relative flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-xl p-4 bg-zinc-50 cursor-pointer hover:bg-zinc-100/70 transition min-h-[110px] overflow-hidden group">
            <input 
              type="file" 
              accept="image/*" 
              disabled={uploading}
              required={!formData.selfieImage} 
              onChange={e => onUpload(e, 'selfieImage')} 
              className="hidden" 
            />
            {formData.selfieImage ? (
              <>
                <img 
                  src={formData.selfieImage} 
                  alt="Selfie Preview" 
                  className="absolute inset-0 h-full w-full object-cover brightness-95 filter transition group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <CheckCircle className="h-6 w-6 text-white drop-shadow-md" />
                </div>
              </>
            ) : (
              <>
                <FileUp className="h-5 w-5 text-zinc-400" />
                <span className="text-[10px] text-zinc-400 font-medium mt-1.5">Choose File</span>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Button Navigation Array Row */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        <button 
          type="button" 
          onClick={onBack} 
          disabled={uploading}
          className="rounded-xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50 transition cursor-pointer"
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={uploading || !formData.idFrontImage || !formData.idBackImage || !formData.selfieImage} 
          className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-700 text-white py-3 text-sm font-semibold hover:bg-emerald-800 disabled:opacity-40 transition cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading Media...</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>
      </div>
    </form>
  );
}