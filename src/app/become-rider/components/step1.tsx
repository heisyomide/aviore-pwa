'use client';

import React, { useState } from 'react';
import { User, Calendar, MapPin, ShieldAlert, Mail, Phone, Loader2 } from 'lucide-react';

interface Step1Props {
  formData: any;
  updateField: (key: string, value: any) => void;
  onNext: () => void;
  applicationId?: string | null;
  saveStepOneApi?: (appId: string, data: any) => Promise<any>;
}

export default function Step1PersonalDetails({ 
  formData, 
  updateField, 
  onNext,
  applicationId,
  saveStepOneApi
}: Step1Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | string[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Sanitize phone number to digits only (retaining leading + if present)
    const rawPhone = formData.phoneNumber ? String(formData.phoneNumber).trim() : '';
    const cleanPhone = rawPhone.startsWith('+') 
      ? '+' + rawPhone.slice(1).replace(/\D/g, '')
      : rawPhone.replace(/\D/g, '');

    // Validate phone number isn't placeholder
    if (!cleanPhone || cleanPhone.includes('PENDING') || cleanPhone.length < 10) {
      setError('Please provide a valid phone number (10 to 15 digits).');
      return;
    }

    // Call Step 1 Saver if API function and Application ID exist
    if (applicationId && saveStepOneApi) {
      try {
        setLoading(true);

        // Build payload matching backend expectations
        const payload: Record<string, any> = {
          firstName: formData.firstName?.trim(),
          lastName: formData.lastName?.trim(),
          phoneNumber: cleanPhone,
          email: formData.email?.trim(),
        };

        // Pass optional fields only when they contain non-empty values
        if (formData.middleName?.trim()) payload.middleName = formData.middleName.trim();
        if (formData.residentialAddress || formData.address) payload.address = (formData.residentialAddress || formData.address).trim();
        if (formData.residentialAddress) payload.residentialAddress = formData.residentialAddress.trim();
        if (formData.state?.trim()) payload.state = formData.state.trim();
        if (formData.city?.trim()) payload.city = formData.city.trim();
        if (formData.lga || formData.localGovernment) payload.localGovernment = (formData.lga || formData.localGovernment).trim();
        if (formData.emergencyContactName?.trim()) payload.emergencyContactName = formData.emergencyContactName.trim();
        if (formData.emergencyContactPhone?.trim()) payload.emergencyContactPhone = formData.emergencyContactPhone.trim();
        if (formData.emergencyContactRelationship || formData.emergencyRelationship) {
          payload.emergencyRelationship = (formData.emergencyContactRelationship || formData.emergencyRelationship).trim();
        }
        if (formData.referralCode?.trim()) payload.referralCode = formData.referralCode.trim();

        // Include password parameters if required by your CreateStep1Dto
        if (formData.password) {
          payload.password = formData.password;
          payload.confirmPassword = formData.confirmPassword || formData.password;
        }

        await saveStepOneApi(applicationId, payload);
      } catch (err: any) {
        console.error('Failed to save step 1 details:', err);

        const backendMessage = err?.response?.data?.message;
        setError(backendMessage || 'Failed to save step 1 details. Please check all fields.');
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
          {Array.isArray(error) ? error.join(', ') : error}
        </div>
      )}

      {/* Name Input Grid Matrix */}
      <div className="grid grid-cols-3 gap-3">
        {/* First Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">First Name</label>
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 text-zinc-400"><User className="h-4 w-4" /></span>
            <input 
              type="text" 
              required
              placeholder="John"
              value={formData.firstName || ''} 
              onChange={e => updateField('firstName', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-3 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>

        {/* Middle Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Middle Name</label>
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 text-zinc-400"><User className="h-4 w-4" /></span>
            <input 
              type="text" 
              placeholder="e.g. Alao"
              value={formData.middleName || ''} 
              onChange={e => updateField('middleName', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-3 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Last Name</label>
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 text-zinc-400"><User className="h-4 w-4" /></span>
            <input 
              type="text" 
              required
              placeholder="Doe"
              value={formData.lastName || ''} 
              onChange={e => updateField('lastName', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-3 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Date Of Birth */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Date of Birth</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400"><Calendar className="h-4 w-4" /></span>
            <input 
              type="date" 
              required 
              value={formData.dateOfBirth || ''} 
              onChange={e => updateField('dateOfBirth', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>

        {/* Gender Select */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Gender</label>
          <select 
            value={formData.gender || 'MALE'} 
            onChange={e => updateField('gender', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400"><Mail className="h-4 w-4" /></span>
            <input 
              type="email" 
              required 
              placeholder="john.doe@example.com"
              value={formData.email || ''} 
              onChange={e => updateField('email', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Phone Number</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400"><Phone className="h-4 w-4" /></span>
            <input 
              type="tel" 
              required 
              placeholder="e.g. 08012345678"
              value={formData.phoneNumber || ''} 
              onChange={e => updateField('phoneNumber', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>
      </div>

      {/* Residential Address */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Residential Address</label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-zinc-400"><MapPin className="h-4 w-4" /></span>
          <input 
            type="text" 
            required 
            placeholder="House Number, Street Name, Landmark"
            value={formData.residentialAddress || ''} 
            onChange={e => updateField('residentialAddress', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
        </div>
      </div>

      {/* State, City, LGA */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">State</label>
          <input 
            type="text" 
            required 
            placeholder="Lagos"
            value={formData.state || ''} 
            onChange={e => updateField('state', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">City</label>
          <input 
            type="text" 
            required 
            placeholder="Ikeja"
            value={formData.city || ''} 
            onChange={e => updateField('city', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">LGA</label>
          <input 
            type="text" 
            required 
            placeholder="Ikeja"
            value={formData.lga || ''} 
            onChange={e => updateField('lga', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="border-t border-zinc-100 pt-4 space-y-3">
        <div className="flex items-center gap-2 text-zinc-800">
          <ShieldAlert className="h-4 w-4 text-emerald-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">Emergency Contact Protocols</h3>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <input 
            type="text" 
            required 
            placeholder="Full Name" 
            value={formData.emergencyContactName || ''} 
            onChange={e => updateField('emergencyContactName', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
          <input 
            type="tel" 
            required 
            placeholder="Phone Line" 
            value={formData.emergencyContactPhone || ''} 
            onChange={e => updateField('emergencyContactPhone', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
          <input 
            type="text" 
            required 
            placeholder="e.g. Brother" 
            value={formData.emergencyContactRelationship || ''} 
            onChange={e => {
              updateField('emergencyContactRelationship', e.target.value);
              updateField('emergencyRelationship', e.target.value);
            }} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold py-3.5 text-sm transition shadow-sm tracking-wide mt-2 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue'}
      </button>
    </form>
  );
}