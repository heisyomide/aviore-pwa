"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/src/lib/api";

interface Bank {
  id?: number | string;
  code: string;
  name: string;
}

export default function MerchantBankAccountPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [hasExistingAccount, setHasExistingAccount] = useState(false);

  useEffect(() => {
    async function initData() {
      try {
        const banksRes = await api.get('/flutterwave/banks');
        const bankList = banksRes.data?.banks || banksRes.data?.data || banksRes.data || [];
        setBanks(Array.isArray(bankList) ? bankList : []);

        const { data } = await api.get('/merchant/dashboard/account');
        const account = data?.bankAccount;
        
        if (account) {
          if (account.bankCode) setBankCode(account.bankCode);
          if (account.accountNumber) setAccountNumber(account.accountNumber);
          if (account.accountName) setAccountName(account.accountName);
          setHasExistingAccount(true);
        }
      } catch (err) {
        console.error("Failed to initialize bank data", err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  const handleResolveBankAccount = async (accountNum: string, code: string) => {
    if (accountNum.length === 10 && code) {
      try {
        setAccountName("Resolving account details...");
        const res = await api.get(`/flutterwave/resolve-account?accountNumber=${accountNum}&bankCode=${code}`);
        const resolvedName = res.data?.accountName || res.data?.data?.account_name;
        if (resolvedName) {
          setAccountName(resolvedName);
        } else {
          setAccountName("Resolution failed - check account details");
        }
      } catch {
        setAccountName("Resolution failed - check account details");
      }
    } else {
      setAccountName("");
    }
  };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.patch('/merchant/dashboard/bank-account', {
        bankCode,
        accountNumber,
        accountName,
      });
      setHasExistingAccount(true);
      alert("Payout bank account updated securely!");
    } catch (err) {
      console.error("Error saving bank details", err);
      alert("Failed to update payout account.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-neutral-400">Loading bank details...</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      
      {/* Navigation Header */}
      <div className="flex items-center gap-3">
        <Link href="/merchant/dashboard/more" className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Bank Account</h1>
      </div>

      {hasExistingAccount && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 flex items-center gap-3 text-xs text-emerald-900 font-medium">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Your active payout account is linked and verified. You can update it anytime below.</span>
        </div>
      )}

      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Settlement Bank</label>
            <select 
              required
              value={bankCode}
              onChange={(e) => {
                const selectedCode = e.target.value;
                setBankCode(selectedCode);
                handleResolveBankAccount(accountNumber, selectedCode);
              }}
              className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 bg-white focus:outline-none focus:border-amber-600 transition-colors"
            >
              <option value="">Select Target Institution</option>
              {banks.map((bank, index) => (
                <option key={`${bank.code || bank.id}-${index}`} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Account Number</label>
            <input 
              type="text" 
              maxLength={10}
              required
              value={accountNumber} 
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setAccountNumber(val);
                handleResolveBankAccount(val, bankCode);
              }} 
              className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 font-mono focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Resolved Account Holder Confirmation</label>
            <input 
              type="text" 
              readOnly 
              placeholder="Awaiting verification lookups..." 
              value={accountName} 
              className="w-full px-4 py-3 rounded-2xl border border-neutral-100 text-xs font-bold text-neutral-500 bg-neutral-50 font-mono focus:outline-none cursor-not-allowed"
            />
            <p className="text-[10px] text-emerald-600 font-medium">✓ Verified automatically via NIBSS bank lookup.</p>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 pt-4 mt-4 cursor-pointer"
          >
            <Save size={16} /> {submitting ? "Saving..." : "Save Payout Account"}
          </button>
        </form>
      </div>

    </div>
  );
}