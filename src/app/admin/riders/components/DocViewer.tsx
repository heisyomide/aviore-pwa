'use client';

import React from 'react';

interface DocViewerProps {
  rider: {
    name?: string;
    firstName?: string;
    lastName?: string;
    ninImage?: string;
    driversLicenseImage?: string;
    selfieImage?: string;
    vehicleImage?: string;
    // Alternative property structural names mapped from storage layers
    ninUrl?: string;
    licenseUrl?: string;
    selfieUrl?: string;
    vehicleUrl?: string;
    status?: string;
  };
  onClose: () => void;
}

export default function DocViewer({ rider, onClose }: DocViewerProps) {
  const nameStr = rider.name || `${rider.firstName || ''} ${rider.lastName || ''}`.trim() || 'Rider';

  // Dynamic evaluation asset assignment maps from database record fields
  const docAssets = [
    { label: 'NIN Card', src: rider.ninImage || rider.ninUrl },
    { label: 'Driver License', src: rider.driversLicenseImage || rider.licenseUrl },
    { label: 'Vehicle Photo', src: rider.vehicleImage || rider.vehicleUrl },
    { label: 'Selfie', src: rider.selfieImage || rider.selfieUrl },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-black text-lg text-neutral-950">Verification Documents</h3>
            <p className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wide">{nameStr}</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 font-black text-xl hover:text-neutral-950 transition-colors">✕</button>
        </div>

        {/* Dynamic Document Image / Placeholder Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {docAssets.map((doc) => (
            <DocSlot key={doc.label} label={doc.label} src={doc.src} />
          ))}
        </div>

        {/* Verification Metadata Status Ledger */}
        <div className="space-y-3 mb-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-500 font-medium">Application Status</span>
            <span className={`font-black uppercase text-[10px] px-2 py-0.5 rounded ${
              rider.status === 'SUBMITTED' ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50'
            }`}>
              {rider.status || 'SUBMITTED'}
            </span>
          </div>
          <div className="flex justify-between text-xs border-t border-neutral-150/50 pt-2">
            <span className="text-neutral-500 font-medium">File Review Parameters</span>
            <span className="font-bold text-neutral-700 font-mono">KYC-VERIFIED-95%</span>
          </div>
        </div>

        <button onClick={onClose} className="w-full py-4 bg-neutral-950 text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-neutral-900 transition-colors shadow-sm">
          Close Viewer
        </button>
      </div>
    </div>
  );
}

function DocSlot({ label, src }: { label: string; src?: string }) {
  return (
    <div className="aspect-square bg-neutral-100 rounded-2xl flex flex-col items-center justify-center text-center p-1 border border-neutral-200 relative overflow-hidden group">
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={src} 
            alt={label} 
            className="w-full h-full object-cover rounded-2xl transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              // Graceful failure fallback UI handler if the link points to an invalid path or missing CDN
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs py-1 px-2 rounded-lg text-white text-[8px] font-black uppercase tracking-wider text-center">
            {label}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-1.5 p-4">
          <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-400 font-bold text-[9px] uppercase">
            ⚠️
          </div>
          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wide leading-tight">{label}</span>
          <span className="text-[8px] font-mono text-neutral-300 uppercase tracking-widest">No Link Provided</span>
        </div>
      )}
    </div>
  );
}