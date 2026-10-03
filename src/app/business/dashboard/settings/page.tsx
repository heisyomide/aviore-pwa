'use client';

import React, { useState } from 'react';

export default function BusinessSettingsPage() {
  const [storeName, setStoreName] = useState('Main Hub Store');
  const [dispatchContact, setDispatchContact] = useState('+234 812 345 6789');
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [alertTier, setAlertTier] = useState('instant');

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Workspace metadata successfully synchronized to core server cluster.');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* View Title Frame */}
      <div className="border-b border-neutral-900 pb-5">
        <h1 className="text-xl font-black text-white tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">Configure operational thresholds, dispatch triggers, and brand profiles.</p>
      </div>

      <form onSubmit={handleSaveChanges} className="space-y-6">
        
        {/* Section Block: Brand & Store Coordinates */}
        <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 border-b border-neutral-900 pb-2">
            Enterprise Coordinates
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Store Workspace Designation</label>
              <input 
                type="text" 
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-neutral-700 font-bold transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Dispatched Fulfillment Contact</label>
              <input 
                type="text" 
                value={dispatchContact}
                onChange={(e) => setDispatchContact(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-neutral-700 font-mono transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section Block: Automated Dispatch Protocol Triggers */}
        <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 border-b border-neutral-900 pb-2">
            Logistics Pipeline Protocols
          </h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-neutral-950 border border-neutral-900 rounded-xl">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-neutral-200">Automated Fleet Matching</p>
              <p className="text-[11px] text-neutral-500 max-w-md leading-normal">
                Instantly request an Aviorè partner transit courier the moment a premium registry or direct item transitions to 'Awaiting Pack'.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setAutoDispatch(!autoDispatch)}
              className={`text-[10px] font-bold px-4 py-2 rounded-xl border transition-all shrink-0 ${
                autoDispatch 
                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' 
                  : 'bg-neutral-900 text-neutral-500 border-neutral-800'
              }`}
            >
              {autoDispatch ? '✓ Active Trigger Pipeline' : '● Manual Authorization'}
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Escrow Status Alerts</label>
            <select
              value={alertTier}
              onChange={(e) => setAlertTier(e.target.value)}
              className="w-full sm:w-64 bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-neutral-700 font-bold transition-all"
            >
              <option value="instant">Instant Realtime Stream Webhooks</option>
              <option value="daily">Aggregated Daily Closing Ledger</option>
              <option value="manual">Manual Pull Audits Only</option>
            </select>
          </div>
        </div>

        {/* Submission Action Grid Line */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-98"
          >
            Synchronize Parameters
          </button>
        </div>

      </form>

    </div>
  );
}