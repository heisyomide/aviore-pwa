'use client';

import { useState, useMemo } from 'react';

import PickupStep from './PickupStep';
import PackageStep from './PackageStep';
import ReceiverStep from './ReceiverStep';
import DeliveryMethodStep from './DeliveryMethodStep';
import SmartDeliveryStep from './SmartDeliveryStep';
import PinStepProps from './PinStep';
import CheckoutStep from './CheckoutStep';
import PaymentSheet from './PaymentSheet';
import SuccessModalProps from './SuccessModal';
import StepIndicator from './StepIndicator';
import { useAuth } from '@/src/context/AuthContext';
import { ShipmentFormData, PricingResponse } from '../../types';
import { useShipment } from '../../hooks/useShipment';
import { usePricing } from '../../hooks/usePricing';

export default function ShipmentWizard() {
const [step, setStep] = useState(1);
const [pin, setPin] =useState("");

const [paymentOpen,setPaymentOpen]=useState(false);
const [paymentLoading,setPaymentLoading]=useState(false);

const [successOpen,setSuccessOpen]=useState(false);
const [trackingCode,setTrackingCode]=useState("");

  // Hooks
  const { shipment: formData, updateShipment, resetShipment } = useShipment();
  const { 
    pricing, 
    isLoading: pricingLoading, 
    calculatePrice 
  } = usePricing();

  const isSmartDelivery = formData.deliveryMethod === 'smart';

  const totalSteps = isSmartDelivery ? 7 : 6;
  const { token, user } = useAuth();
  const checkoutStep = isSmartDelivery ? 7 : 6;
  const pinStep = isSmartDelivery ? 6 : 5;
  const smartDeliveryStep = 5;

  const updateForm = (updates: Partial<ShipmentFormData>) => {
    updateShipment(updates);
  };

  const handleNext = async () => {
    if (step === pinStep) {
      // Calculate final pricing before checkout
      await calculatePrice({
        pickupLat: formData.pickup.latitude,
        pickupLng: formData.pickup.longitude,
        destinationLat: formData.destination.latitude,
        destinationLng: formData.destination.longitude,
        packageCategory: formData.packageCategory,
        weightRange: formData.weightRange,
        isExpress: formData.deliverySpeed === "EXPRESS",
        waterproof: formData.waterproof,
      });
    }

    if (step < totalSteps) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleCheckout = () => setPaymentOpen(true);

  const handleClosePayment = () => setPaymentOpen(false);

const createShipment = async () => {
  if (!token) {
    throw new Error("User is not authenticated.");
  }

  // Determine sender details from formData or fallback to authenticated user context
  const senderName =
    formData.sender?.senderName ||
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || "");

  const senderPhone = formData.sender?.senderPhone || user?.phone || user?.phoneNumber || "";

  const payload = {
    // Sender Information (Required by Backend DTO)
    senderName,
    senderPhone,

    deliveryType: formData.deliveryType,
    deliverySpeed: formData.deliverySpeed,
    packageCategory: formData.packageCategory,
    weightRange: formData.weightRange,

    pickupAddress: formData.pickup.address,
    pickupLat: formData.pickup.latitude,
    pickupLng: formData.pickup.longitude,
    pickupPlaceId: formData.pickup.placeId,

    destinationAddress: formData.destination.address,
    destinationLat: formData.destination.latitude,
    destinationLng: formData.destination.longitude,
    destinationPlaceId: formData.destination.placeId,

    // Receiver Information
    receiverName: formData.receiver.receiverName,
    receiverPhone: formData.receiver.receiverPhone,

    verificationPin: pin,
    deliveryMethod: formData.deliveryMethod,
    waterproof: formData.waterproof,
    isExpress: formData.deliverySpeed === "EXPRESS",
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shipments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message
    );
  }

  return result.data;
};
const initializeFlutterwavePayment = async () => {
  if (!pricing) return;

  try {
    setPaymentLoading(true);

    // 1. First save or update shipment record
    const shipment = await createShipment();
    setTrackingCode(shipment.trackingCode);

    // 2. Resolve frontend redirect URL
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'http://localhost:3000';
    const redirectUrl = `${origin}/payment/verify`;

    // 3. Prepare payload
    const customerName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Valued Customer';
    const customerEmail = user?.email || 'customer@aviorego.com.ng';

    const payload = {
      shipmentId: shipment.id,
      email: customerEmail,
      name: customerName,
      redirectUrl: redirectUrl,
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('📡 Requesting Flutterwave Init from:', `${apiUrl}/flutterwave/initialize`);

    // 4. Send request to NestJS backend
    let response: Response;
    try {
      response = await fetch(`${apiUrl}/flutterwave/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
    } catch (netErr: any) {
      console.error('Network Error Details:', netErr);
      throw new Error(
        `Network error: Cannot reach NestJS server at ${apiUrl}. Verify your backend server is running on port 5000 and CORS is enabled.`
      );
    }

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('Backend returned error status:', response.status, result);
      const serverMsg = Array.isArray(result?.message)
        ? result.message.join(', ')
        : result?.message || `Server Error (${response.status})`;
      throw new Error(serverMsg);
    }

    // 5. Check payment link returned
    const paymentLink = result?.link || result?.data?.link;
    if (!paymentLink) {
      throw new Error('Payment link missing in response from backend.');
    }

    console.log('✅ Redirecting to Flutterwave Live Link:', paymentLink);
    window.location.href = paymentLink;
  } catch (error: any) {
    console.error('Flutterwave initialization failed:', error);
    alert(`Payment Failure: ${error.message}`);
  } finally {
    setPaymentLoading(false);
  }
};
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white">
      {/* Header */}
      <div className="border-b px-6 py-5">
        <h1 className="text-xl font-black">Create Shipment</h1>
        <StepIndicator currentStep={step} totalSteps={totalSteps} />
      </div>

      {/* Wizard Body */}
      <div className="flex-1 px-6 py-6">
        {step === 1 && (
          <PickupStep 
            formData={formData} 
            updateForm={updateForm} 
            onNext={handleNext} 
          />
        )}

        {step === 2 && (
          <PackageStep 
            formData={formData} 
            updateForm={updateForm} 
            onNext={handleNext} 
          />
        )}

        {step === 3 && (
          <ReceiverStep 
            formData={formData} 
            updateForm={updateForm} 
            onNext={handleNext} 
          />
        )}

        {step === 4 && (
          <DeliveryMethodStep 
            formData={formData} 
            updateForm={updateForm} 
            onNext={handleNext} 
          />
        )}

        {step === smartDeliveryStep && isSmartDelivery && (
          <SmartDeliveryStep 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}

        {step === pinStep && (
          <PinStepProps 
            pin={pin} 
            setPin={setPin} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}

        {step === checkoutStep && (
          <CheckoutStep
            formData={formData}
            pricing={pricing ?? null}
            loading={pricingLoading}
            submitting={false}
            error={null}
            onBack={handleBack}
            onPay={handleCheckout}
          />
        )}
      </div>

      {/* Payment Sheet */}
<PaymentSheet
    open={paymentOpen}
    pricing={pricing ?? null}
    loading={paymentLoading}
    onClose={handleClosePayment}
    onFlutterwave={initializeFlutterwavePayment}
/>

      {/* Success Modal */}
      <SuccessModalProps
              open={successOpen}
              trackingCode={trackingCode}
              onClose={() => {
                  setSuccessOpen(true);
                  resetShipment();
                  setStep(1);
                  setPin('');
              } } pin={''}      />
    </div>
  );
}