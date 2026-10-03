'use client';

import React, { useState, useEffect } from "react";
import { Search, Loader2, ArrowDownLeft, ArrowUpRight, RefreshCcw } from "lucide-react";
import { api } from "@/src/lib/api";
import MerchantWithdrawModal from "@/src/components/MerchantWithdrawModal";

export default function MerchantWalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletRes, txRes] = await Promise.all([
        api.get('/merchant/wallet'),
        api.get('/merchant/wallet/transactions'),
      ]);
      setWallet(walletRes.data);
      setTransactions(Array.isArray(txRes.data) ? txRes.data : []);
    } catch (err: any) {
      console.error("Failed to load wallet data", err);
    } finally {
      setLoading(false);
    }
  };

  const availableBalance = wallet?.availableBalance ?? 0;

  const filteredTransactions = transactions.filter((tx) => {
    const q = searchQuery.toLowerCase();
    return (
      (tx.description && tx.description.toLowerCase().includes(q)) ||
      (tx.referenceCode && tx.referenceCode.toLowerCase().includes(q)) ||
      (tx.type && tx.type.toLowerCase().includes(q))
    );
  });

  if (loading && !wallet) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Wallet</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 shadow-sm cursor-pointer hover:bg-neutral-50"
            title="Search transactions"
          >
            <Search size={18} />
          </button>
          <button
            onClick={fetchWalletData}
            className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 shadow-sm cursor-pointer hover:bg-neutral-50"
            title="Refresh"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-bold ${feedback.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {feedback.message}
        </div>
      )}

      {isSearchOpen && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by description, reference, or type..."
            className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-200 text-xs font-medium focus:outline-none focus:border-emerald-600 shadow-sm"
          />
        </div>
      )}

      {/* Main Available Balance Card */}
      <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-100">Available Balance</span>
          <h3 className="text-3xl font-black font-mono">₦{Number(availableBalance).toLocaleString()}</h3>
        </div>
        <button
          onClick={() => {
            setFeedback(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-white text-emerald-700 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm cursor-pointer"
        >
          Withdraw
        </button>
      </div>

      {/* Stats Breakdown Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-neutral-200/80 p-4 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Today's Earnings</span>
          <h4 className="text-base font-black text-neutral-950 font-mono">₦{Number(wallet?.todayEarnings || 0).toLocaleString()}</h4>
          <span className="text-[10px] text-emerald-600 font-bold block">{wallet?.earningsGrowth || "+0%"}</span>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Pending Balance</span>
          <h4 className="text-base font-black text-neutral-950 font-mono">₦{Number(wallet?.pendingBalance || 0).toLocaleString()}</h4>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Total Earned</span>
          <h4 className="text-base font-black text-neutral-950 font-mono">₦{Number(wallet?.totalEarned || 0).toLocaleString()}</h4>
          <span className="text-[9px] text-neutral-400 block">Cumulative</span>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-neutral-950">Recent Transactions</h3>
          <span className="text-[10px] font-mono text-neutral-400">{filteredTransactions.length} items</span>
        </div>

        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-xs text-neutral-400 font-medium">
              No transactions matching your record found.
            </div>
          ) : (
            filteredTransactions.map((tx: any) => {
              const isCredit = tx.type === 'CREDIT' || tx.type === 'DEPOSIT' || Number(tx.amount) > 0;
              const numericAmount = Math.abs(Number(tx.amount || 0));

              return (
                <div key={tx.id || Math.random()} className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-neutral-900 truncate">{tx.description || tx.type}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 block">{tx.date} • {tx.referenceCode}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-mono font-black ${isCredit ? 'text-emerald-600' : 'text-neutral-900'}`}>
                      {isCredit ? `+₦${numericAmount.toLocaleString()}` : `-₦${numericAmount.toLocaleString()}`}
                    </span>
                    <span className="block text-[10px] font-bold text-neutral-500 pt-0.5 uppercase">
                      {tx.type}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <MerchantWithdrawModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchWalletData}
        wallet={wallet}
      />
    </div>
  );
}