'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/src/lib/api';

function DocViewer({ rider, onClose }: { rider: any; onClose: () => void }) {
  const nameStr = rider.name || `${rider.firstName || ''} ${rider.lastName || ''}`.trim() || 'Rider';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-sm uppercase tracking-tight">{nameStr} • Documents</h3>
          <button onClick={onClose} className="text-neutral-400 font-black hover:text-neutral-950">✕</button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {['NIN', 'License', 'Selfie', 'Vehicle'].map((doc) => (
            <div key={doc} className="aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center border border-neutral-200">
              <span className="text-[9px] font-bold text-neutral-400 uppercase">{doc}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-4 bg-neutral-950 text-white rounded-xl font-black text-xs uppercase tracking-wider">
          Close Preview
        </button>
      </div>
    </div>
  );
}

export default function RiderApprovalPage() {
  const [viewingDoc, setViewingDoc] = useState<any>(null);
  const [pendingRiders, setPendingRiders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadPendingKYC() {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const response = await api.get<any[]>('/admin/riders/pending-kyc');
      setPendingRiders(response.data);
    } catch (err: any) {
      console.error('KYC Payload Download Failure:', err);
      setErrorMessage(
        err.response?.data?.message || err.message || 'Failed connecting to validation servers.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPendingKYC();
  }, []);

  async function handleEvaluation(applicationId: string, approve: boolean) {
    const confirmation = window.confirm(
      `Are you sure you want to ${approve ? 'APPROVE' : 'REJECT'} this rider application?`
    );
    if (!confirmation) return;

    try {
      await api.patch(`/admin/riders/kyc/${applicationId}/evaluate`, {
        approve: approve,
        adminId: 'SYSTEM_ADMIN_UI',
        reason: approve ? 'Verified successfully.' : 'Submitted tracking credentials could not be verified.'
      });

      // Remove evaluated application from UI state
      setPendingRiders((prev) => prev.filter((item) => item.id !== applicationId));
    } catch (err: any) {
      console.error('Evaluation Error:', err);
      const serverMsg = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(', ')
        : err.response?.data?.message || 'Evaluation update failed.';
      alert(serverMsg);
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex gap-2 flex-col">
        <Link href="/admin/riders" className="text-[10px] text-neutral-400 font-black uppercase hover:text-neutral-950 underline transition-colors">
          ← Back to Fleet Management
        </Link>
        <h2 className="text-xl font-black uppercase tracking-tight text-neutral-950">Pending KYC</h2>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-mono uppercase">
          ⚠️ Operational Fault: {errorMessage}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-xs text-center font-mono p-12 text-neutral-400 uppercase tracking-widest animate-pulse">
          Pulling validation registries...
        </div>
      ) : pendingRiders.length === 0 ? (
        <div className="text-xs text-center font-mono p-12 text-neutral-400 border border-dashed rounded-3xl border-neutral-200 uppercase tracking-wider bg-white shadow-sm">
          Clear Ledger! No pending KYC workflows require review.
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingRiders.map((rider) => {
            const fullName = rider.name || `${rider.firstName || ''} ${rider.lastName || ''}`.trim() || 'Unnamed Rider';
            const trackingIdNum = rider.idNumber || rider.nin || 'Unspecified';
            const operationalVehicle = rider.vehicleType || rider.vehicle || 'Motorcycle Fleet';
            
            return (
              <div key={rider.id} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4 transition-all hover:border-neutral-300">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center font-black text-neutral-400 text-xs border border-neutral-200">
                    IMG
                  </div>
                  <div>
                    <p className="font-black text-neutral-950 text-base">{fullName}</p>
                    <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wide">{operationalVehicle}</p>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">NIN: {trackingIdNum}</p>
                  </div>
                </div>
                
                <div className="bg-green-50/70 border border-green-100 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-green-600 uppercase tracking-wider">Face Match Score</p>
                    <p className="text-xl font-black text-green-700 font-mono">{rider.faceMatch || '95%'}</p>
                  </div>
                  <button 
                    onClick={() => setViewingDoc({ name: fullName, ...rider })} 
                    className="text-[10px] font-bold text-green-600 underline hover:text-green-800 transition-colors"
                  >
                    View Full Docs
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => handleEvaluation(rider.id, true)} 
                    className="bg-green-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-wider hover:bg-green-700 shadow-sm transition-all"
                  >
                    Approve Operator
                  </button>
                  <button 
                    onClick={() => handleEvaluation(rider.id, false)} 
                    className="bg-neutral-100 text-neutral-600 py-3 rounded-xl font-black uppercase text-[10px] tracking-wider hover:bg-neutral-200 border border-neutral-200 transition-all"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewingDoc && (
        <DocViewer rider={viewingDoc} onClose={() => setViewingDoc(null)} />
      )}
    </div>
  );
}