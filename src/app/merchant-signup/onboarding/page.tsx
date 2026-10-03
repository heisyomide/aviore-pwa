'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/src/lib/api';
import { usePlacesAutocomplete } from "../../(customer)/dashboard/shipment/hooks/usePlacesAutocomplete";

export default function MerchantOnboardingStepper() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  
  const [banksList, setBanksList] = useState<{ code: string; name: string }[]>([]);
  const [isResolvingBank, setIsResolvingBank] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    merchantType: 'FOOD',
    description: '',
    cuisineType: 'Nigerian',
    phone: '',
    email: '',
    logoUrl: '',
    coverUrl: '',
    address: '',
    state: 'FCT',
    city: 'Abuja',
    area: '',
    landmarkId: '',
    latitude: 9.0765,
    longitude: 7.3986,
    ownerFullName: '',
    ownerPhone: '',
    ownerEmail: '',
    dateOfBirth: '',
    residentialAddress: '',
    idType: 'NIN',
    idNumber: '',
    idDocumentUrl: '',
    mainCategories: [] as string[],
    avgPrepTimeMinutes: 20,
    acceptsSameDay: true,
    acceptsScheduled: false,
    openingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
    openingTime: '08:00',
    closingTime: '21:00',
    accountNumber: '',
    accountName: '',
    bankCode: '',
    bankName: '',
    hasCac: false,
    cacNumber: '',
    cacCertificateUrl: '',
    supportingDocUrl: '',
    termsAccepted: false,
  });

  const {
    input: placeInput,
    suggestions: placeSuggestions,
    loading: placeLoading,
    search: searchPlaces,
    selectPlace,
    clearSuggestions
  } = usePlacesAutocomplete(formData.city);

  useEffect(() => {
    fetchProfile();
    fetchBanks();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/merchant/onboarding/profile');
      const currentStep = res.data.onboardingStep || 1;
      setStep(currentStep);
      setFormData(prev => ({
        ...prev,
        businessName: res.data.businessName || '',
        description: res.data.description || '',
        phone: res.data.phone || '',
        ownerFullName: res.data.ownerFullName || '',
      }));
    } catch (err) {
      console.error('Failed to load merchant profile', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const res = await api.get('/flutterwave/banks');
      if (Array.isArray(res.data)) {
        const uniqueBanks = Array.from(
          new Map(res.data.map((bank: any) => [bank.code, bank])).values()
        );
        setBanksList(uniqueBanks as { code: string; name: string }[]);
      }
    } catch (err) {
      console.error('Failed to fetch banks list', err);
    }
  };

  const handleResolveBankAccount = async (accountNum: string, bankCode: string) => {
    if (accountNum.length === 10 && bankCode) {
      try {
        setIsResolvingBank(true);
        const res = await api.get(`/payments/resolve-bank?accountNumber=${accountNum}&bankCode=${bankCode}`);
        if (res.data?.accountName) {
          setFormData(prev => ({ ...prev, accountName: res.data.accountName }));
        }
      } catch {
        // Fallback gracefully
      } finally {
        setIsResolvingBank(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => {
        const updated = { ...prev, [name]: value };
        
        if (name === 'bankCode') {
          const selectedBank = banksList.find(b => b.code === value);
          updated.bankName = selectedBank ? selectedBank.name : '';
          if (updated.accountNumber.length === 10 && value) {
            handleResolveBankAccount(updated.accountNumber, value);
          }
        }
        
        if (name === 'accountNumber' && value.length === 10 && updated.bankCode) {
          handleResolveBankAccount(value, updated.bankCode);
        }

        return updated;
      });
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      const exists = prev.mainCategories.includes(category);
      return {
        ...prev,
        mainCategories: exists 
          ? prev.mainCategories.filter(c => c !== category)
          : [...prev.mainCategories, category]
      };
    });
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (step === 1) {
        await api.patch('/merchant/onboarding/step-1', {
          businessName: formData.businessName,
          merchantType: formData.merchantType,
          description: formData.description,
          cuisineType: formData.cuisineType,
          phone: formData.phone,
          email: formData.email,
          logoUrl: formData.logoUrl,
          coverUrl: formData.coverUrl,
        });
        setStep(2);
      } else if (step === 2) {
        await api.patch('/merchant/onboarding/step-2', {
          address: formData.address,
          state: formData.state,
          city: formData.city,
          area: formData.area,
          landmarkId: formData.landmarkId || undefined,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        });
        setStep(3);
      } else if (step === 3) {
        await api.patch('/merchant/onboarding/step-3', {
          ownerFullName: formData.ownerFullName,
          ownerPhone: formData.ownerPhone,
          ownerEmail: formData.ownerEmail,
          dateOfBirth: formData.dateOfBirth,
          residentialAddress: formData.residentialAddress,
          idType: formData.idType,
          idNumber: formData.idNumber,
          idDocumentUrl: formData.idDocumentUrl || 'https://placeholder.id',
        });
        setStep(4);
      } else if (step === 4) {
        await api.patch('/merchant/onboarding/step-4', {
          mainCategories: formData.mainCategories,
          avgPrepTimeMinutes: Number(formData.avgPrepTimeMinutes),
          acceptsSameDay: formData.acceptsSameDay,
          acceptsScheduled: formData.acceptsScheduled,
          openingDays: formData.openingDays,
          openingTime: formData.openingTime,
          closingTime: formData.closingTime,
        });
        setStep(5);
      } else if (step === 5) {
        await api.patch('/merchant/onboarding/step-5', {
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
          bankName: formData.bankName,
          bankCode: formData.bankCode,
        });
        setStep(6);
      } else if (step === 6) {
        await api.patch('/merchant/onboarding/step-6', {
          hasCac: formData.hasCac,
          cacNumber: formData.hasCac ? formData.cacNumber : undefined,
          cacCertificateUrl: formData.hasCac ? formData.cacCertificateUrl : undefined,
          termsAccepted: formData.termsAccepted,
        });
        router.push('/merchant-signup/pending');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update onboarding step.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-500">Loading onboarding...</div>;
  }

  const foodCategoriesList = ['Swallow', 'Rice', 'Soups', 'Proteins', 'Beans', 'Yam', 'Pasta', 'Snacks', 'Drinks', 'Grills'];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Merchant Onboarding</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Complete all 6 steps to set up your store</p>
          </div>
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            Step {step} of 6
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleNextStep} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Business / Restaurant Name *</label>
                <input type="text" name="businessName" required value={formData.businessName} onChange={handleChange} placeholder="e.g., Mama's Kitchen" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Business Type *</label>
                <select name="merchantType" value={formData.merchantType} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600 bg-white">
                  <option value="FOOD">Food / Restaurant</option>
                  <option value="GROCERY">Grocery</option>
                  <option value="RETAIL">Retail</option>
                  <option value="PHARMACY">Pharmacy</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Description *</label>
                <textarea name="description" required value={formData.description} onChange={handleChange} rows={2} placeholder="Local Nigerian meals, soups and traditional dishes." className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Business Phone Number *</label>
                <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="08030000000" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">State *</label>
                  <input type="text" name="state" required value={formData.state} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">City / Town *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Search Landmark or Area *</label>
                <input 
                  type="text" 
                  value={placeInput}
                  onChange={(e) => searchPlaces(e.target.value)}
                  placeholder="Search landmark, street, or neighborhood..." 
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" 
                />
                {placeLoading && <span className="absolute right-3 top-9 text-xs text-zinc-400">Loading...</span>}

                {placeSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-zinc-200 shadow-lg max-h-60 overflow-y-auto">
                    {placeSuggestions.map((place) => (
                      <div
                        key={place.id}
                        onClick={() => {
                          selectPlace(place);
                          setFormData(prev => ({
                            ...prev,
                            area: place.address || place.name,
                            address: place.name,
                            landmarkId: place.isVerifiedLandmark ? place.id : '',
                            latitude: place.latitude,
                            longitude: place.longitude,
                          }));
                          clearSuggestions();
                        }}
                        className="px-4 py-2.5 text-xs hover:bg-zinc-50 cursor-pointer border-b border-zinc-50 last:border-none flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-zinc-800">{place.name}</p>
                          <p className="text-zinc-500 text-[10px]">{place.city}, {place.state}</p>
                        </div>
                        {place.isVerifiedLandmark && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full">Verified</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Area / Neighborhood *</label>
                <input type="text" name="area" required value={formData.area} onChange={handleChange} placeholder="e.g., Wuse 2, Maitama" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Street Address / House Number *</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder="Plot 12 Adetokunbo Ademola Crescent" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Owner Full Name *</label>
                <input type="text" name="ownerFullName" required value={formData.ownerFullName} onChange={handleChange} placeholder="As on valid ID" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Owner Phone *</label>
                  <input type="text" name="ownerPhone" required value={formData.ownerPhone} onChange={handleChange} placeholder="08000000000" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Owner Email *</label>
                  <input type="email" name="ownerEmail" required value={formData.ownerEmail} onChange={handleChange} placeholder="owner@email.com" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Government ID Type *</label>
                <select name="idType" value={formData.idType} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600 bg-white">
                  <option value="NIN">NIN (National Identification Number)</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="International Passport">International Passport</option>
                  <option value="Voter's Card">Voter's Card</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">ID Number / Document Reference *</label>
                <input type="text" name="idNumber" required value={formData.idNumber} onChange={handleChange} placeholder="Enter ID number" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-2">Main Food Categories (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {foodCategoriesList.map((cat) => {
                    const selected = formData.mainCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategoryToggle(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          selected 
                            ? 'bg-emerald-600 text-white border-emerald-600' 
                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Opening Time</label>
                  <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Closing Time</label>
                  <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Average Preparation Time (Minutes)</label>
                <input type="number" name="avgPrepTimeMinutes" value={formData.avgPrepTimeMinutes} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
            </>
          )}

         {step === 5 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Bank Name *</label>
                <select 
                  name="bankCode" 
                  required 
                  value={formData.bankCode} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="">Select your bank institution</option>
                  {banksList.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Account Number *</label>
                <input 
                  type="text" 
                  name="accountNumber" 
                  maxLength={10} 
                  required 
                  value={formData.accountNumber} 
                  onChange={handleChange} 
                  placeholder="0123456789" 
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Account Name (Auto-Verified) *</label>
                <input 
                  type="text" 
                  name="accountName" 
                  readOnly 
                  required 
                  value={formData.accountName} 
                  placeholder={isResolvingBank ? "Resolving account..." : "Verified bank account name will appear here"} 
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700 outline-none" 
                />
                {isResolvingBank && (
                  <p className="text-[10px] text-emerald-600 mt-1">Verifying account name...</p>
                )}
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="hasCac" name="hasCac" checked={formData.hasCac} onChange={handleChange} className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                <label htmlFor="hasCac" className="text-xs font-medium text-zinc-700">Do you have a CAC registration?</label>
              </div>

              {formData.hasCac && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">CAC Registration Number</label>
                  <input type="text" name="cacNumber" value={formData.cacNumber} onChange={handleChange} placeholder="BN-1234567" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
                </div>
              )}

              <div className="pt-2 border-t border-zinc-100">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="termsAccepted" name="termsAccepted" required checked={formData.termsAccepted} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                  <label htmlFor="termsAccepted" className="text-xs text-zinc-600 leading-relaxed">
                    I confirm that the information provided is accurate and I agree to AviorèGo's merchant terms and policies.
                  </label>
                </div>
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={submitting || (step === 5 && !formData.accountName)} 
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl text-sm transition disabled:opacity-50"
          >
            {submitting ? 'Processing...' : step === 6 ? 'Submit for Verification' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}