'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/src/lib/api';

export default function RiderOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Section 2: Personal Details
    middleName: '',
    dateOfBirth: '',
    gender: 'MALE',
    residentialAddress: '',
    state: '',
    city: '',
    lga: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',

    // Section 3: Identity Verification
    idType: 'NATIONAL_ID',
    idNumber: '',
    idFrontImage: '',
    idBackImage: '',
    selfieImage: '',

    // Section 4: Vehicle Information
    vehicleType: 'BIKE',
    plateNumber: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleColor: '',
    vehicleYear: '',
    vehiclePhoto: '',

    // Section 5: Extra Documents
    driversLicenseDoc: '',
    vehiclePaperDoc: '',
    insuranceDoc: '',
    roadWorthinessDoc: '',

    // Section 6: Bank Information
    bankName: '',
    accountNumber: '',
    accountName: '',

    // Section 7: Agreements
    acceptedTerms: false,
    acceptedCommission: false,
    acceptedPrivacy: false,
  });

  const updateField = (key: string, value: any) => {
    setFormData((p) => ({ ...p, [key]: value }));
  };

  // Automated Account Name Resolution Block using Paystack/Flutterwave backend proxy
  const handleResolveBankAccount = async (accountNum: string, bankCode: string) => {
    if (accountNum.length === 10 && bankCode) {
      try {
        const res = await api.get(`/payouts/resolve-bank?accountNumber=${accountNum}&bankCode=${bankCode}`);
        if (res.data?.accountName) {
          updateField('accountName', res.data.accountName);
        }
      } catch {
        // Fallback gracefully so the rider can confirm manually if needed
      }
    }
  };

  // High-performance direct asynchronous file upload engine to Cloudinary
  const handleCloudinaryUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const cloudinaryData = new FormData();
    cloudinaryData.append('file', file);
    // Replace with your designated dynamic Cloudinary configuration variables
    cloudinaryData.append('upload_preset', 'aviore_go_presets'); 

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/aviore-go/image/upload`, {
        method: 'POST',
        body: cloudinaryData,
      });
      const data = await res.json();
      if (data.secure_url) {
        updateField(key, data.secure_url);
      } else {
        setError('Cloudinary upload failure. Verify configuration credentials.');
      }
    } catch {
      setError('Failed to upload asset directly from device storage.');
    } finally {
      setUploading(false);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleFinalSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptedTerms || !formData.acceptedCommission || !formData.acceptedPrivacy) {
      setError('All regulatory guidelines must be explicitly accepted.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/rider/profile/complete', formData);
      router.replace('/rider/dashboard');
    } catch (err: any) {
      setError('Submission error. Verify field properties across the configuration pipeline.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm space-y-6">
        
        {/* Step Context Title Bar */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Rider Profile</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Section {step} of 6 — {step === 1 && 'Personal Information'}{step === 2 && 'Identity Verification'}{step === 3 && 'Vehicle Setup'}{step === 4 && 'Legal Records'}{step === 5 && 'Financial Parameters'}{step === 6 && 'Final Agreements'}</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`h-1 w-3.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-emerald-700' : 'bg-zinc-200'}`} />
            ))}
          </div>
        </div>

        {error && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600 text-center font-medium">{error}</div>}

        {/* STEP 1: PERSONAL DETAILS */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Middle Name (Optional)</label>
                <input type="text" value={formData.middleName} onChange={e => updateField('middleName', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Date of Birth</label>
                <input type="date" required value={formData.dateOfBirth} onChange={e => updateField('dateOfBirth', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Gender</label>
              <select value={formData.gender} onChange={e => updateField('gender', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Residential Address</label>
              <input type="text" required value={formData.residentialAddress} onChange={e => updateField('residentialAddress', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">State</label>
                <input type="text" required value={formData.state} onChange={e => updateField('state', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">City</label>
                <input type="text" required value={formData.city} onChange={e => updateField('city', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">LGA</label>
                <input type="text" required value={formData.lga} onChange={e => updateField('lga', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" />
              </div>
            </div>
            <div className="border-t border-zinc-100 pt-3 grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Emergency Contact</label>
                <input type="text" required placeholder="Name" value={formData.emergencyContactName} onChange={e => updateField('emergencyContactName', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Emergency Phone</label>
                <input type="tel" required placeholder="Phone" value={formData.emergencyContactPhone} onChange={e => updateField('emergencyContactPhone', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Relationship</label>
                <input type="text" required placeholder="e.g. Spouse" value={formData.emergencyContactRelationship} onChange={e => updateField('emergencyContactRelationship', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" />
              </div>
            </div>
            <button type="submit" className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 text-sm transition">Continue</button>
          </form>
        )}

        {/* STEP 2: IDENTITY VERIFICATION */}
        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">ID Type</label>
                <select value={formData.idType} onChange={e => updateField('idType', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition">
                  <option value="NATIONAL_ID">National ID</option>
                  <option value="DRIVERS_LICENSE">Driver's License</option>
                  <option value="VOTERS_CARD">Voter's Card</option>
                  <option value="PASSPORT">International Passport</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">ID Document Number</label>
                <input type="text" required value={formData.idNumber} onChange={e => updateField('idNumber', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">ID Front Image</label>
                <input type="file" accept="image/*" required={!formData.idFrontImage} onChange={e => handleCloudinaryUpload(e, 'idFrontImage')} className="text-xs file:hidden block border border-zinc-200 rounded-xl p-2 bg-zinc-50 text-center cursor-pointer" />
                {formData.idFrontImage && <p className="text-[10px] text-emerald-600 mt-1">✓ Loaded from file</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">ID Back Image</label>
                <input type="file" accept="image/*" required={!formData.idBackImage} onChange={e => handleCloudinaryUpload(e, 'idBackImage')} className="text-xs file:hidden block border border-zinc-200 rounded-xl p-2 bg-zinc-50 text-center cursor-pointer" />
                {formData.idBackImage && <p className="text-[10px] text-emerald-600 mt-1">✓ Loaded from file</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Selfie Verification</label>
                <input type="file" accept="image/*" required={!formData.selfieImage} onChange={e => handleCloudinaryUpload(e, 'selfieImage')} className="text-xs file:hidden block border border-zinc-200 rounded-xl p-2 bg-zinc-50 text-center cursor-pointer" />
                {formData.selfieImage && <p className="text-[10px] text-emerald-600 mt-1">✓ Loaded from file</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button type="button" onClick={handleBack} className="rounded-xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50">Back</button>
              <button type="submit" disabled={uploading} className="rounded-xl bg-emerald-700 text-white py-3 text-sm font-semibold hover:bg-emerald-800 disabled:opacity-40">Continue</button>
            </div>
          </form>
        )}

        {/* STEP 3: VEHICLE INFORMATION */}
        {step === 3 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Vehicle Type</label>
                <select value={formData.vehicleType} onChange={e => updateField('vehicleType', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition">
                  <option value="BIKE">Bike</option>
                  <option value="CAR">Car</option>
                  <option value="VAN">Van</option>
                  <option value="TRICYCLE">Tricycle</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Plate Number</label>
                <input type="text" required value={formData.plateNumber} onChange={e => updateField('plateNumber', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Vehicle Brand</label>
                <input type="text" required placeholder="e.g. Honda" value={formData.vehicleBrand} onChange={e => updateField('vehicleBrand', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Vehicle Model</label>
                <input type="text" required placeholder="e.g. CG125" value={formData.vehicleModel} onChange={e => updateField('vehicleModel', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Vehicle Color</label>
                <input type="text" required value={formData.vehicleColor} onChange={e => updateField('vehicleColor', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Vehicle Year</label>
                <input type="text" required maxLength={4} value={formData.vehicleYear} onChange={e => updateField('vehicleYear', e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1">Upload Vehicle Photo</label>
              <input type="file" accept="image/*" required={!formData.vehiclePhoto} onChange={e => handleCloudinaryUpload(e, 'vehiclePhoto')} className="text-xs file:hidden block border border-zinc-200 rounded-xl p-2.5 bg-zinc-50 w-full cursor-pointer" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button type="button" onClick={handleBack} className="rounded-xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50">Back</button>
              <button type="submit" disabled={uploading} className="rounded-xl bg-emerald-700 text-white py-3 text-sm font-semibold hover:bg-emerald-800 disabled:opacity-40">Continue</button>
            </div>
          </form>
        )}

        {/* STEP 4: DOCUMENTS UPLOAD */}
        {step === 4 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Driver's License File</label>
                <input type="file" required={!formData.driversLicenseDoc} onChange={e => handleCloudinaryUpload(e, 'driversLicenseDoc')} className="text-xs border border-zinc-200 bg-zinc-50 rounded-xl p-2 w-full file:hidden cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Vehicle Papers</label>
                <input type="file" required={!formData.vehiclePaperDoc} onChange={e => handleCloudinaryUpload(e, 'vehiclePaperDoc')} className="text-xs border border-zinc-200 bg-zinc-50 rounded-xl p-2 w-full file:hidden cursor-pointer" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Insurance Certificate</label>
                <input type="file" required={!formData.insuranceDoc} onChange={e => handleCloudinaryUpload(e, 'insuranceDoc')} className="text-xs border border-zinc-200 bg-zinc-50 rounded-xl p-2 w-full file:hidden cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Road Worthiness Certificate</label>
                <input type="file" required={!formData.roadWorthinessDoc} onChange={e => handleCloudinaryUpload(e, 'roadWorthinessDoc')} className="text-xs border border-zinc-200 bg-zinc-50 rounded-xl p-2 w-full file:hidden cursor-pointer" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button type="button" onClick={handleBack} className="rounded-xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50">Back</button>
              <button type="submit" disabled={uploading} className="rounded-xl bg-emerald-700 text-white py-3 text-sm font-semibold hover:bg-emerald-800 disabled:opacity-40">Continue</button>
            </div>
          </form>
        )}

        {/* STEP 5: FINANCIAL SETTLEMENT STRATEGY */}
        {step === 5 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Settlement Bank</label>
              <select required value={formData.bankName} onChange={e => { updateField('bankName', e.target.value); handleResolveBankAccount(formData.accountNumber, e.target.value); }} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition">
                <option value="">Select Target Institution</option>
                <option value="058">GTBank</option>
                <option value="044">Access Bank</option>
                <option value="999992">Opay</option>
                <option value="50211">Kuda Bank</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Account Number</label>
              <input type="text" maxLength={10} required value={formData.accountNumber} onChange={e => { updateField('accountNumber', e.target.value); handleResolveBankAccount(e.target.value, formData.bankName); }} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 transition" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Resolved Account Holder Confirmation</label>
              <input type="text" readOnly placeholder="Awaiting verification lookups..." value={formData.accountName} className="w-full rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm text-zinc-700 font-medium outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button type="button" onClick={handleBack} className="rounded-xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50">Back</button>
              <button type="submit" className="rounded-xl bg-emerald-700 text-white py-3 text-sm font-semibold hover:bg-emerald-800">Continue</button>
            </div>
          </form>
        )}

        {/* STEP 6: REGULATORY COMPLIANCE POLICIES */}
        {step === 6 && (
          <form onSubmit={handleFinalSubmission} className="space-y-4">
            <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-2xl space-y-3.5">
              <div className="flex items-start gap-3">
                <input type="checkbox" id="acceptedTerms" checked={formData.acceptedTerms} onChange={e => updateField('acceptedTerms', e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-emerald-600 cursor-pointer" />
                <label htmlFor="acceptedTerms" className="text-xs text-zinc-500 select-none cursor-pointer">I accept the Aviorè Go Terms & Conditions</label>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" id="acceptedCommission" checked={formData.acceptedCommission} onChange={e => updateField('acceptedCommission', e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-emerald-600 cursor-pointer" />
                <label htmlFor="acceptedCommission" className="text-xs text-zinc-500 select-none cursor-pointer">I accept the Logistics Delivery Commission Policy</label>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" id="acceptedPrivacy" checked={formData.acceptedPrivacy} onChange={e => updateField('acceptedPrivacy', e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-emerald-600 cursor-pointer" />
                <label htmlFor="acceptedPrivacy" className="text-xs text-zinc-500 select-none cursor-pointer">I agree to the Operational Platform Privacy Policy</label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button type="button" onClick={handleBack} disabled={submitting} className="rounded-xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-40">Back</button>
              <button type="submit" disabled={submitting} className="rounded-xl bg-emerald-700 text-white py-3 text-sm font-semibold hover:bg-emerald-800 disabled:opacity-40">{submitting ? 'Submitting Application...' : 'Submit Profile'}</button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}