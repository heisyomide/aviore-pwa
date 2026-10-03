'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Landmark, Fingerprint, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Step5Props {
  formData: any;
  updateField: (key: string, value: any) => void;
  onResolveBank: (accountNum: string, bankCode: string) => Promise<void> | void;
  onNext: () => void;
  onBack: () => void;
}

// 🌟 Official Flutterwave LIVE Bank Codes mapping (NIBSS Standard)
const LIVE_BANKS = [
  { code: '058', name: 'GTBank' },
  { code: '044', name: 'Access Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '033', name: 'United Bank For Africa (UBA)' },
  { code: '057', name: 'Zenith Bank' },
  { code: '214', name: 'First City Monument Bank (FCMB)' },
  { code: '035', name: 'Wema Bank' },
  { code: '050', name: 'Ecobank Nigeria' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '215', name: 'Unity Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
  { code: '082', name: 'Keystone Bank' },
  { code: '100004', name: 'OPay Digital Services' },
  { code: '090267', name: 'Kuda Microfinance Bank' },
  { code: '100033', name: 'PalmPay' },
  { code: '090551', name: 'Moniepoint Microfinance Bank' },
];

export default function Step5FinancialSettlement({
  formData,
  updateField,
  onResolveBank,
  onNext,
  onBack,
}: Step5Props) {
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionError, setResolutionError] = useState('');
  
  // Track last resolved pair to prevent duplicate API hammering
  const lastResolvedKey = useRef<string>('');

  useEffect(() => {
    const currentKey = `${formData.accountNumber}_${formData.bankCode}`;

    const triggerResolution = async () => {
      // Execute lookup ONLY when 10 digits + bank code exist AND key changed
      if (
        formData.accountNumber?.length === 10 &&
        formData.bankCode &&
        lastResolvedKey.current !== currentKey
      ) {
        setIsResolving(true);
        setResolutionError('');
        
        try {
          await onResolveBank(formData.accountNumber, formData.bankCode);
          lastResolvedKey.current = currentKey; // Mark as successfully queried
        } catch (error: any) {
          console.error('--- Flutterwave Bank Resolution Exception ---', error);
          lastResolvedKey.current = ''; // Reset on error so user can retry
          updateField('accountName', '');
          
          setResolutionError(
            error.response?.data?.message ||
            error.response?.status === 404
              ? 'Could not verify account with bank. Please verify account number and bank.'
              : 'Unable to verify account details. Check entries or try another bank.'
          );
        } finally {
          setIsResolving(false);
        }
      }
    };

    triggerResolution();
  }, [formData.accountNumber, formData.bankCode]);

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/\D/g, '');
    updateField('accountNumber', cleanValue);
    if (cleanValue.length !== 10) {
      updateField('accountName', '');
      setResolutionError('');
      lastResolvedKey.current = '';
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const selectedBank = LIVE_BANKS.find((b) => b.code === code);
    
    updateField('bankCode', code);
    updateField('bankName', selectedBank ? selectedBank.name : '');
    updateField('accountName', '');
    setResolutionError('');
    lastResolvedKey.current = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.accountName && !isResolving) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Target Settlement Institution Dropdown */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Settlement Bank
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-zinc-400">
            <Landmark className="h-4 w-4" />
          </span>
          <select
            required
            value={formData.bankCode || ''}
            onChange={handleBankChange}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition"
          >
            <option value="">Select Target Institution</option>
            {LIVE_BANKS.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Account Number Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Account Number
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-zinc-400">
            <Fingerprint className="h-4 w-4" />
          </span>
          <input
            type="text"
            maxLength={10}
            required
            placeholder="10 digit NUBAN number"
            value={formData.accountNumber || ''}
            onChange={handleAccountNumberChange}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Dynamic Account Holder Status Input Display */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Account Holder Confirmation
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            disabled
            readOnly
            placeholder={
              isResolving
                ? 'Verifying with Interbank NIBSS system...'
                : 'Awaiting account details...'
            }
            value={formData.accountName || ''}
            className={`w-full rounded-xl border px-4 py-3.5 text-sm font-semibold outline-none tracking-wide transition duration-200 ${
              formData.accountName
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : 'bg-zinc-100 border-zinc-200 text-zinc-500'
            }`}
          />
          <div className="absolute right-4">
            {isResolving && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
            {!isResolving && formData.accountName && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            )}
          </div>
        </div>
      </div>

      {/* Warning/Error Banner */}
      {resolutionError && (
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <span className="font-medium tracking-wide">{resolutionError}</span>
        </div>
      )}

      {/* Navigation Buttons Row */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isResolving}
          className="rounded-xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50 transition cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isResolving || !formData.accountName}
          className="col-span-2 rounded-xl bg-emerald-700 text-white py-3 text-sm font-semibold hover:bg-emerald-800 disabled:opacity-40 transition cursor-pointer"
        >
          Continue
        </button>
      </div>
    </form>
  );
}