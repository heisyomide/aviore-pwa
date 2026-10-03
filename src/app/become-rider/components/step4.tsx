'use client';

import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

interface Step4Props {
  formData: any;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  onNext: () => void;
  onBack: () => void;
  uploading: boolean;
}

export default function Step4DocumentsUpload({ formData, onUpload, onNext, onBack, uploading }: Step4Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    onNext();
  };

  const documentSlots = [
    { label: "Driver's License File (Optional)", key: 'driversLicenseDoc' },
    { label: 'Vehicle Papers (Optional)', key: 'vehiclePaperDoc' },
    { label: 'Insurance Certificate (Optional)', key: 'insuranceDoc' },
    { label: 'Road Worthiness Doc (Optional)', key: 'roadWorthinessDoc' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {documentSlots.map((doc) => (
          <div key={doc.key} className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-500">{doc.label}</label>
            <label className="flex items-center justify-between border border-zinc-200 bg-zinc-50 rounded-xl px-4 py-3.5 cursor-pointer hover:bg-zinc-100/50 transition">
              {/* Note: required removed so it's strictly optional */}
              <input type="file" onChange={e => onUpload(e, doc.key)} className="hidden" />
              <div className="flex items-center gap-2 text-zinc-500">
                <FileText className="h-4 w-4 text-zinc-400" />
                <span className="text-xs font-medium truncate max-w-[120px]">
                  {formData[doc.key] ? 'Document.jpg' : 'Upload attachment'}
                </span>
              </div>
              {formData[doc.key] && <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />}
            </label>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4">
        <button 
          type="button" 
          onClick={onBack} 
          className="rounded-xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50 transition cursor-pointer"
        >
          Back
        </button>

        <button 
          type="submit" 
          disabled={uploading} 
          className="col-span-2 rounded-xl bg-emerald-700 text-white py-3 text-sm font-semibold hover:bg-emerald-800 disabled:opacity-40 transition cursor-pointer"
        >
          {uploading ? 'Uploading Paperworks...' : 'Continue'}
        </button>
      </div>
    </form>
  );
}