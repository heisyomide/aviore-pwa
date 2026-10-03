'use client';

import React from 'react';

interface Step6Props {
  formData: any;
  updateField: (key: string, value: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}

export default function Step6CompliancePolicies({ formData, updateField, onSubmit, onBack, submitting }: Step6Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const policies = [
    { key: 'acceptedTerms', label: 'I accept the Aviorè Go Rider Terms & Conditions' },
    { key: 'acceptedCommission', label: 'I accept the Logistics Delivery Commission Policy (80/20 Payout split)' },
    { key: 'acceptedPrivacy', label: 'I agree to the Operational Platform Privacy & Geolocation Tracking Policy' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Checklist Agreement Rows */}
      <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-2xl space-y-4">
        {policies.map((policy) => (
          <div key={policy.key} className="flex items-start gap-3.5 transition hover:bg-zinc-100/30 p-1 rounded-lg">
            <input 
              type="checkbox" 
              id={policy.key} 
              checked={formData[policy.key]} 
              onChange={e => updateField(policy.key, e.target.checked)} 
              className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-emerald-600 focus:ring-emerald-600 text-emerald-700 cursor-pointer" 
            />
            <label htmlFor={policy.key} className="text-xs text-zinc-600 font-medium select-none cursor-pointer leading-normal">
              {policy.label}
            </label>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2">
        <button 
          type="button" 
          onClick={onBack} 
          disabled={submitting} 
          className="rounded-xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-40 transition cursor-pointer"
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={submitting || !formData.acceptedTerms || !formData.acceptedCommission || !formData.acceptedPrivacy} 
          className="col-span-2 rounded-xl bg-emerald-700 text-white py-3 text-sm font-semibold hover:bg-emerald-800 disabled:opacity-40 transition cursor-pointer shadow-sm tracking-wide"
        >
          {submitting ? 'Submitting Profile Application...' : 'Submit Profile Application'}
        </button>
      </div>
    </form>
  );
}