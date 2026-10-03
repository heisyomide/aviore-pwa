'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/src/lib/api';
// Step Presentation Component Imports
import Step1PersonalDetails from './components/step1';
import Step2IdentityVerification from './components/step2';
import Step3VehicleInformation from './components/step3';
import Step4DocumentsUpload from './components/step4';
import Step5FinancialSettlement from './components/step5';
import Step6CompliancePolicies from './components/step6';

export default function RiderOnboardingWizard() {
  const router = useRouter();

  // Security Guard States
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');

  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Section 1: Personal Details
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
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

    // Section 2: Identity Verification
    idType: 'NATIONAL_ID',
    idNumber: '',
    idFrontImage: '',
    idBackImage: '',
    selfieImage: '',

    // Section 3: Vehicle Information
    vehicleType: 'BIKE',
    plateNumber: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleColor: '',
    vehicleYear: '',
    vehiclePhoto: '',

    // Section 4: Documents
    driversLicenseDoc: '',
    vehiclePaperDoc: '',
    insuranceDoc: '',
    roadWorthinessDoc: '',

    // Section 5: Bank Details
    bankName: '',
    bankCode: '',
    accountNumber: '',
    accountName: '',

    // Section 6: Agreements
    acceptedTerms: false,
    acceptedCommission: false,
    acceptedPrivacy: false,
  });

  // Verify Auth Token & Initialize Draft Application
  useEffect(() => {
    let isMounted = true;

    const checkVerificationStatus = async () => {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('aviore_token') || localStorage.getItem('access_token')
          : null;

      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const res = await api.get('/auth/me');
        const user = res.data;

        if (!isMounted) return;

        // Auto-fill existing user info
        const sanitizedPhone =
          user?.phoneNumber && !user.phoneNumber.startsWith('PENDING_')
            ? user.phoneNumber
            : '';

        setFormData((p) => ({
          ...p,
          email: user?.email || p.email || '',
          firstName: user?.firstName || p.firstName || '',
          lastName: user?.lastName || p.lastName || '',
          phoneNumber: sanitizedPhone || p.phoneNumber || '',
        }));

        const isVerified = user?.isEmailVerified === true || user?.status === 'VERIFIED';

        if (!isVerified) {
          router.replace('/confirm-email');
          return;
        }

        // Initialize draft application (Tries /start then /application as fallback)
        try {
          let appRes;
          try {
            appRes = await api.post('/rider-onboarding/start');
          } catch {
            appRes = await api.post('/rider-onboarding/application');
          }

          const appId = appRes.data?.applicationId || appRes.data?.id;
          if (appId) {
            setApplicationId(appId);
          }
        } catch (appErr) {
          console.warn('[APPLICATION INIT WARNING]', appErr);
        }

        setIsAuthorized(true);
      } catch (err: any) {
        console.error('[AUTH GUARD REJECTION]', err);
        if (isMounted) {
          if (err.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('aviore_token');
            router.replace('/login');
          } else {
            setAuthError('Unable to verify security clearance. Please check your connection.');
          }
        }
      } finally {
        if (isMounted) {
          setIsVerifyingAuth(false);
        }
      }
    };

    checkVerificationStatus();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const updateField = (key: string, value: any) => {
    setFormData((p) => ({ ...p, [key]: value }));
  };

  // Intermediate Step Sync Handlers
  const handleSaveStep = async (stepNumber: number) => {
    if (!applicationId) return;
    try {
      await api.post(`/rider-onboarding/step-${stepNumber}/${applicationId}`, formData);
    } catch (err) {
      console.warn(`[STEP ${stepNumber} SAVE WARNING]`, err);
    }
  };

  const handleSaveStepOneApi = async (appId: string, data: any) => {
    return api.post(`/rider-onboarding/step-1/${appId}`, data);
  };

  const handleResolveBankAccount = async (accountNum: string, bankCode: string) => {
    if (accountNum.length === 10 && bankCode) {
      const res = await api.get(
        `/payments/resolve-bank?accountNumber=${accountNum}&bankCode=${bankCode}`,
      );
      if (res.data?.accountName) {
        updateField('accountName', res.data.accountName);
      }
    }
  };

  const handleBackendUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const backendData = new FormData();
    backendData.append('file', file);

    let endpointUrl = '';
    switch (key) {
      case 'idFrontImage':
        endpointUrl = '/uploads/rider/id-front';
        break;
      case 'idBackImage':
        endpointUrl = '/uploads/rider/id-back';
        break;
      case 'selfieImage':
        endpointUrl = '/uploads/rider/selfie';
        break;
      case 'vehiclePhoto':
        endpointUrl = '/uploads/rider/vehicle-photo';
        break;
      case 'driversLicenseDoc':
        endpointUrl = '/uploads/license';
        break;
      case 'vehiclePaperDoc':
        endpointUrl = '/uploads/rider/vehicle-paper';
        break;
      case 'insuranceDoc':
        endpointUrl = '/uploads/rider/insurance';
        break;
      case 'roadWorthinessDoc':
        endpointUrl = '/uploads/rider/road-worthiness';
        break;
      default:
        endpointUrl = '/uploads/rider/profile-photo';
    }

    try {
      const res = await api.post(endpointUrl, backendData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.url) {
        updateField(key, res.data.url);
      } else {
        setError('Server stored file successfully but returned an empty asset link.');
      }
    } catch (err: any) {
      console.error('--- Backend Upload Rejection ---', err);
      setError(
        err.response?.data?.message ||
          'Failed to upload asset through the backend proxy gateway.',
      );
    } finally {
      setUploading(false);
    }
  };

  const handleNext = async () => {
    setError('');
    // Sync active step state before proceeding
    await handleSaveStep(step);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleFinalSubmission = async () => {
    if (!formData.acceptedTerms || !formData.acceptedCommission || !formData.acceptedPrivacy) {
      setError('All regulatory guidelines must be explicitly accepted.');
      return;
    }

    setSubmitting(true);
    setError('');

    const whitelistedPayload = {
      ...formData,
      idType: formData.idType === 'NATIONAL_ID' ? 'NIN' : formData.idType,
      vehicleType: formData.vehicleType === 'BIKE' ? 'MOTORCYCLE' : formData.vehicleType,
      localGovernment: formData.lga || (formData as any).localGovernment,
      emergencyRelationship: formData.emergencyContactRelationship,
      acceptedDeliveryPolicy: formData.acceptedPrivacy,
    };

    try {
      // Endpoint fallback handling matching both submit routes
      const endpoint = applicationId
        ? `/rider-onboarding/submit/${applicationId}`
        : '/rider-onboarding/submit';

      await api.post(endpoint, whitelistedPayload);
      router.replace('/become-rider/thank-you');
    } catch (err: any) {
      console.error('Submission API Error:', err.response?.data || err);

      const backendMessage = err.response?.data?.message;
      const displayMsg = Array.isArray(backendMessage)
        ? backendMessage.join(', ')
        : backendMessage || 'Submission error. Please verify field items and try again.';

      setError(displayMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles = [
    'Personal Information',
    'Identity Verification',
    'Vehicle Setup',
    'Legal Records',
    'Financial Parameters',
    'Final Agreements',
  ];

  if (isVerifyingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 font-sans select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-zinc-500">Verifying account security status...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 font-sans">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-zinc-200 text-center space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900">Verification Error</h3>
          <p className="text-sm text-zinc-600">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
          >
            Retry Verification
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 font-sans select-none">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Rider Profile</h2>
            <p className="text-xs text-zinc-400 font-medium">
              Section {step} of 6 —{' '}
              <span className="text-zinc-600 font-semibold">{stepTitles[step - 1]}</span>
            </p>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`h-1 w-4 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-emerald-700' : 'bg-zinc-100'
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 text-center font-semibold tracking-wide">
            {error}
          </div>
        )}

        {step === 1 && (
          <Step1PersonalDetails
            formData={formData}
            updateField={updateField}
            onNext={handleNext}
            applicationId={applicationId}
            saveStepOneApi={handleSaveStepOneApi}
          />
        )}
        {step === 2 && (
          <Step2IdentityVerification
            formData={formData}
            updateField={updateField}
            onUpload={handleBackendUpload}
            onNext={handleNext}
            onBack={handleBack}
            uploading={uploading}
          />
        )}
        {step === 3 && (
          <Step3VehicleInformation
            formData={formData}
            updateField={updateField}
            onUpload={handleBackendUpload}
            onNext={handleNext}
            onBack={handleBack}
            uploading={uploading}
          />
        )}
        {step === 4 && (
          <Step4DocumentsUpload
            formData={formData}
            onUpload={handleBackendUpload}
            onNext={handleNext}
            onBack={handleBack}
            uploading={uploading}
          />
        )}
        {step === 5 && (
          <Step5FinancialSettlement
            formData={formData}
            updateField={updateField}
            onResolveBank={handleResolveBankAccount}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 6 && (
          <Step6CompliancePolicies
            formData={formData}
            updateField={updateField}
            onSubmit={handleFinalSubmission}
            onBack={handleBack}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}