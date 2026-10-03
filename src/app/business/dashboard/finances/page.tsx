'use client';

import React, { useState } from 'react';

interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  channel: 'Registry Fulfillment' | 'Direct Storefront';
  gross: number;
  status: 'settled' | 'escrow_hold';
}

export default function BusinessFinancesPage() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(1240500);
  const escrowHoldBalance = 602000;

  // Mock financial accounting audit stream
  const [ledgers, setLedgers] = useState<FinancialRecord[]>([
    { id: "FIN-9902", date: "Today, 09:14 AM", description: "Registry Clearance: Order AV-ORD-9072", channel: 'Registry Fulfillment', gross: 320000, status: 'settled' },
    { id: "FIN-9871", date: "Yesterday", description: "Direct Sale: Order AV-ORD-9076", channel: 'Direct Storefront', gross: 85000, status: 'settled' },
    { id: "FIN-9850", date: "03 Jul 2026", description: "Registry Holds: Order AV-ORD-9081", channel: 'Registry Fulfillment', gross: 145000, status: 'escrow_hold' },
    { id: "FIN-9722", date: "30 Jun 2026", description: "Bulk Gift Pool Contribution: Collection Group delta-4", channel: 'Registry Fulfillment', gross: 457000, status: 'escrow_hold' },
  ]);

  const handleCorporatePayout = () => {
    if (availableBalance <= 0) return;
    setIsWithdrawing(true);

    setTimeout(() => {
      const payoutId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
      const settlementRecord: FinancialRecord = {
        id: payoutId,
        date: "Just Now",
        description: `Corporate Payout Settlement to Central Pool Acct`,
        channel: 'Direct Storefront',
        gross: availableBalance,
        status: 'settled',
      };

      setLedgers(prev => [settlementRecord, ...prev]);
      alert(`Settlement request processed successfully. ₦${availableBalance.toLocaleString()} routed to corporate treasury account.`);
      setAvailableBalance(0);
      setIsWithdrawing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Settlement Ledger</h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">Corporate treasury balance sheet and escrow channels.</p>
        </div>

        <button
          onClick={handleCorporatePayout}
          disabled={isWithdrawing || availableBalance === 0}
          className="bg-white hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-white text-neutral-950 text-xs font-black px-5 py-3 rounded-xl transition-all shadow-md active:scale-98 shrink-0 text-center"
        >
          {isWithdrawing ? 'Authorizing Payout...' : 'Request Corporate Settlement Payout'}
        </button>
      </div>

      {/* Balance State Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Cleared Funds Card */}
        <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-1">
            <p className="text-neutral-500 text-[10px] uppercase font-mono tracking-wider">Available Cleared Balance</p>
            <p className="text-3xl font-black text-emerald-400 tracking-tight">₦{availableBalance.toLocaleString()}.00</p>
          </div>
          <p className="text-[11px] text-neutral-400 leading-normal max-w-sm">
            Cleared revenue from completed purchases and fully gifted registry allocations ready for instant payout.
          </p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Registry Escrow Hold Card */}
        <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-1">
            <p className="text-neutral-500 text-[10px] uppercase font-mono tracking-wider">Registry Escrow Holds</p>
            <p className="text-3xl font-black text-purple-400 tracking-tight">₦{escrowHoldBalance.toLocaleString()}.00</p>
          </div>
          <p className="text-[11px] text-neutral-400 leading-normal max-w-sm">
            Funds locked in active, unclosed registries. Automatically moves to cleared balance upon celebrant closure validation.
          </p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

      </div>

      {/* Audit Stream Ledger */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">Financial Audit Stream</h3>
        
        <div className="space-y-2">
          {ledgers.map((ledger) => (
            <div key={ledger.id} className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-800 transition-all">
              
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-bold text-white truncate">{ledger.description}</p>
                  <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-500 px-1.5 py-0.2 rounded shrink-0">
                    {ledger.id}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 font-mono">
                  Channel: <span className="text-neutral-400">{ledger.channel}</span> • Timestamp: {ledger.date}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-t-0 border-neutral-900 pt-3 sm:pt-0">
                <div className="sm:text-right">
                  <p className="text-sm font-black text-white">₦{ledger.gross.toLocaleString()}</p>
                  <span className={`text-[9px] font-mono uppercase font-bold tracking-wider inline-block mt-0.5 ${
                    ledger.status === 'settled' ? 'text-emerald-400' : 'text-purple-400'
                  }`}>
                    ● {ledger.status === 'settled' ? 'Settled to Treasury' : 'In Escrow Balance'}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}